import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────────────────
// This endpoint previously used OpenStreetMap Overpass, which frequently
// timed out or returned "Access Denied" from the free public mirror — hence
// fuelStops/restStops being empty and "Top Fuel Stop" always showing
// "No live data". It now uses Google Places API (New) exclusively:
//   - Step 1 (geocode):  places:searchText   — resolves the pickup string to lat/lon
//   - Step 2 (discover): places:searchNearby — finds fuel stations + rest/truck stops
// No Overpass, no Nominatim, no new environment variables — this reuses the
// same GOOGLE_MAPS_API_KEY already used by /api/google-route.
// ─────────────────────────────────────────────────────────────────────────────

// ---------- Types ----------

interface Stop {
  name: string;
  type: "Fuel Station" | "Rest Area";
  lat: number;
  lon: number;
  distanceKm: number;
}

/** Minimal shape of a Places API (New) `Place` — only the fields we request. */
interface GooglePlace {
  id?: string;
  displayName?: { text?: string; languageCode?: string };
  location?: { latitude?: number; longitude?: number };
  primaryType?: string;
}

interface GooglePlacesSearchTextResponse {
  places?: GooglePlace[];
}

interface GooglePlacesSearchNearbyResponse {
  places?: GooglePlace[];
}

/** Places API (New) error envelope, e.g. { error: { code, message, status } } */
interface GooglePlacesErrorResponse {
  error?: { code?: number; message?: string; status?: string };
}

class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// ---------- Config ----------

const PLACES_SEARCH_TEXT_URL = "https://places.googleapis.com/v1/places:searchText";
const PLACES_SEARCH_NEARBY_URL = "https://places.googleapis.com/v1/places:searchNearby";
const SEARCH_RADIUS_M = 50_000; // 50km, per requirements
const FETCH_TIMEOUT_MS = 15_000;
const MAX_RESULTS_PER_TYPE = 20; // Places API (New) hard cap per request

// Google Places "Table A" types used for each stop category. Google
// periodically revises this type list — if either of these ever starts
// returning 400 INVALID_ARGUMENT, check the current supported types at
// https://developers.google.com/maps/documentation/places/web-service/place-types
const FUEL_INCLUDED_TYPES = ["gas_station"];
const REST_INCLUDED_TYPES = ["rest_stop", "truck_stop"];

// Requesting only Basic-tier fields (id, displayName, location, primaryType)
// keeps this on Google's cheapest Places API (New) billing tier — avoid
// adding fields like photos/reviews/formattedAddress unless you need them,
// since that moves the whole call to a pricier SKU.
const NEARBY_FIELD_MASK = "places.id,places.displayName,places.location,places.primaryType";
const TEXT_SEARCH_FIELD_MASK = "places.id,places.displayName,places.location";

// ---------- Helpers ----------

/** fetch with a hard timeout so a slow upstream never hangs the request */
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = FETCH_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

/** Haversine distance in km between two lat/lon points */
function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/** Maps a Places API HTTP failure to a client-safe HttpError with the right status. */
async function throwForFailedResponse(res: Response, context: string): Promise<never> {
  const body: GooglePlacesErrorResponse = await res.json().catch(() => ({}));
  const message = body.error?.message ?? `${context} failed (${res.status})`;

  console.error(`Google Places error [${context}] ${res.status}:`, body.error ?? message);

  if (res.status === 400) throw new HttpError(400, `Invalid request to Google Places (${context}): ${message}`);
  if (res.status === 401 || res.status === 403) {
    throw new HttpError(403, "Google Places API key is invalid or lacks Places API (New) access.");
  }
  if (res.status === 429) throw new HttpError(429, "Google Places quota exceeded. Try again shortly.");
  throw new HttpError(502, `Google Places service error (${context}): ${message}`);
}

function requireApiKey(): string {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error("GOOGLE_MAPS_API_KEY is not set.");
    throw new HttpError(500, "Server configuration error: Google Maps API key missing.");
  }
  return apiKey;
}

/**
 * Step 1: Geocode the pickup string using Places API (New) Text Search.
 * Using Places (New) here — rather than the legacy Geocoding API — means
 * this endpoint only depends on a single Google API being enabled.
 */
async function geocode(pickup: string, apiKey: string): Promise<{ lat: number; lon: number }> {
  const res = await fetchWithTimeout(PLACES_SEARCH_TEXT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": TEXT_SEARCH_FIELD_MASK,
    },
    body: JSON.stringify({ textQuery: pickup }),
  });

  if (!res.ok) await throwForFailedResponse(res, "geocode");

  const data: GooglePlacesSearchTextResponse = await res.json();
  const first = data.places?.[0];
  const lat = first?.location?.latitude;
  const lon = first?.location?.longitude;

  if (typeof lat !== "number" || typeof lon !== "number") {
    throw new HttpError(404, "Location not found");
  }

  return { lat, lon };
}

/**
 * Step 2: Nearby Search for a single category of stop (fuel or rest/truck).
 * rankPreference: "DISTANCE" asks Google to order results nearest-first;
 * we still recompute + sort locally with Haversine so distanceKm is exact
 * and consistent regardless of what Google's ranking returns.
 */
async function searchNearby(
  lat: number,
  lon: number,
  includedTypes: string[],
  apiKey: string,
  context: string
): Promise<GooglePlace[]> {
  const res = await fetchWithTimeout(PLACES_SEARCH_NEARBY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": NEARBY_FIELD_MASK,
    },
    body: JSON.stringify({
      includedTypes,
      maxResultCount: MAX_RESULTS_PER_TYPE,
      rankPreference: "DISTANCE",
      locationRestriction: {
        circle: {
          center: { latitude: lat, longitude: lon },
          radius: SEARCH_RADIUS_M,
        },
      },
    }),
  });

  if (!res.ok) await throwForFailedResponse(res, context);

  const data: GooglePlacesSearchNearbyResponse = await res.json();
  return data.places ?? [];
}

function toStops(places: GooglePlace[], origin: { lat: number; lon: number }, type: Stop["type"]): Stop[] {
  return places
    .filter((p) => typeof p.location?.latitude === "number" && typeof p.location?.longitude === "number")
    .map((p) => {
      const lat = p.location!.latitude as number;
      const lon = p.location!.longitude as number;
      return {
        name: p.displayName?.text?.trim() || "Unnamed Stop",
        type,
        lat,
        lon,
        distanceKm: Math.round(distanceKm(origin.lat, origin.lon, lat, lon) * 10) / 10,
      };
    });
}

// ---------- Route ----------

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const pickup = body?.pickup;

    if (typeof pickup !== "string" || !pickup.trim()) {
      return NextResponse.json(
        { error: "`pickup` is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    const apiKey = requireApiKey();
    const origin = await geocode(pickup.trim(), apiKey);

    // Fuel and rest/truck stops are independent lookups — fetch in parallel
    // and let one succeed even if the other fails.
    const [fuelRes, restRes] = await Promise.allSettled([
      searchNearby(origin.lat, origin.lon, FUEL_INCLUDED_TYPES, apiKey, "fuel search"),
      searchNearby(origin.lat, origin.lon, REST_INCLUDED_TYPES, apiKey, "rest stop search"),
    ]);

    if (fuelRes.status === "rejected") {
      console.error("Fuel stop search failed:", fuelRes.reason);
    }
    if (restRes.status === "rejected") {
      console.error("Rest stop search failed:", restRes.reason);
    }

    const fuelPlaces = fuelRes.status === "fulfilled" ? fuelRes.value : [];
    const restPlaces = restRes.status === "fulfilled" ? restRes.value : [];

    const fuelStops = toStops(fuelPlaces, origin, "Fuel Station").sort(
      (a, b) => a.distanceKm - b.distanceKm
    );
    const restStops = toStops(restPlaces, origin, "Rest Area").sort(
      (a, b) => a.distanceKm - b.distanceKm
    );

    console.log(
      `Route stops for "${pickup}": ${fuelStops.length} fuel, ${restStops.length} rest (origin ${origin.lat},${origin.lon})`
    );

    return NextResponse.json({
      origin,
      fuelStops,
      restStops,
    });
  } catch (err: unknown) {
    if (err instanceof HttpError) {
      console.error(`ROUTE STOPS ERROR [${err.status}]:`, err.message);
      return NextResponse.json({ error: err.message }, { status: err.status });
    }

    if (err instanceof Error && err.name === "AbortError") {
      console.error("ROUTE STOPS ERROR: upstream request timed out");
      return NextResponse.json(
        { error: "Upstream location service timed out" },
        { status: 504 }
      );
    }

    console.error("ROUTE STOPS ERROR:", err);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}