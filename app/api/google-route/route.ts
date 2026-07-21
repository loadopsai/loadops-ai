import { NextRequest, NextResponse } from "next/server";

// ── Constants ─────────────────────────────────────────────────────────────────

const GOOGLE_ROUTES_URL =
  "https://routes.googleapis.com/directions/v2:computeRoutes";

// Defaults — callers can override per-request via the request body for
// more accurate economics (actual truck MPG varies a lot by load/terrain).
const DEFAULT_DIESEL_PRICE_PER_GALLON = 3.85;
const DEFAULT_TRUCK_MPG = 6.5;
// Cost per mile including driver, maintenance, etc. (excluding fuel)
const COST_PER_MILE_EXCL_FUEL = 0.45;

// FMCSA hours-of-service reference points (49 CFR 395):
// - A 30-minute break is required after 8 cumulative hours of driving.
// - Drivers may not drive more than 11 hours following 10 consecutive off-duty hours.
// - The 14-hour on-duty window caps how long that driving can be spread across.
// This endpoint gives a simplified heads-up, not a full HOS compliance engine.
const HOS_BREAK_TRIGGER_HOURS = 8;
const HOS_MAX_DRIVING_HOURS = 11;

const FETCH_TIMEOUT_MS = 12_000;

// Simple in-memory cache (survives the warm Lambda lifetime, not across cold starts)
const routeCache = new Map<string, { data: RouteResult; cachedAt: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const CACHE_MAX_ENTRIES = 500; // crude bound so a busy instance can't grow this unbounded

// ── Types ─────────────────────────────────────────────────────────────────────

interface RouteResult {
  distanceMiles:      number;
  driveHours:         number;
  driveHoursFormatted:string;
  origin: {
    lat?: number;
    lon?: number;
  };
  destination: {
    lat?: number;
    lon?: number;
  };
  polyline:           string;
  summary:            RouteSummary;
  economics:          RouteEconomics;
  compliance:         RouteCompliance;
  alternatives?:      AlternativeRoute[];
  cachedAt?:          string;
}

interface RouteSummary {
  origin:       string;
  destination:  string;
  waypoints:    string[];
  totalStops:   number;
  travelMode:   string;
  trafficModel: string;
}

interface RouteEconomics {
  fuelGallons:      number;
  fuelCostUSD:      number;
  estimatedTollUSD: number;
  totalCostUSD:     number;
  revenuePerMile?:  number;
  netProfitUSD?:    number;
}

interface RouteCompliance {
  requiredBreaks:          number;
  breakIntervalMiles:      number;
  estimatedTotalTripHours: number;
  hosWarning:              boolean;
  hosWarningMessage:       string;
  multiDayTrip:            boolean;
}

interface AlternativeRoute {
  distanceMiles: number;
  driveHours:    number;
  polyline:      string;
}

interface RequestBody {
  origin:         string;
  destination:    string;
  waypoints?:     string[];
  ratePerMile?:   number;
  avoidTolls?:    boolean;
  avoidHighways?: boolean;
  truckMpg?:      number;
  dieselPricePerGallon?: number;
}

interface GoogleLatLng {
  latitude?:  number;
  longitude?: number;
}

interface GoogleRoute {
  distanceMeters?: number;
  duration?:       string;
  polyline?:       { encodedPolyline?: string };
  legs?: {
    startLocation?: { latLng?: GoogleLatLng };
    endLocation?:   { latLng?: GoogleLatLng };
  }[];
}

interface GoogleRoutesApiResponse {
  routes?: GoogleRoute[];
  error?: { message?: string };
}

class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDriveTime(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}hr`;
  return `${h}hr ${m}min`;
}

function estimateTolls(distanceMiles: number): number {
  // Rough US average: $0.04–0.06/mile on toll-heavy corridors
  return Math.round(distanceMiles * 0.045);
}

function calcEconomics(
  distanceMiles: number,
  ratePerMile?: number,
  avoidTolls?: boolean,
  truckMpg: number = DEFAULT_TRUCK_MPG,
  dieselPricePerGallon: number = DEFAULT_DIESEL_PRICE_PER_GALLON,
): RouteEconomics {
  const fuelGallons      = distanceMiles / truckMpg;
  const fuelCostUSD      = Math.round(fuelGallons * dieselPricePerGallon);
  const estimatedTollUSD = avoidTolls ? 0 : estimateTolls(distanceMiles);
  const otherCosts       = Math.round(distanceMiles * COST_PER_MILE_EXCL_FUEL);
  const totalCostUSD     = fuelCostUSD + estimatedTollUSD + otherCosts;
  const revenuePerMile   = ratePerMile;
  const netProfitUSD     = ratePerMile
    ? Math.round(ratePerMile * distanceMiles - totalCostUSD)
    : undefined;

  return {
    fuelGallons: Math.round(fuelGallons),
    fuelCostUSD,
    estimatedTollUSD,
    totalCostUSD,
    revenuePerMile,
    netProfitUSD,
  };
}

function calcCompliance(distanceMiles: number, driveHours: number): RouteCompliance {
  // Time-based break estimate (more accurate than a fixed mileage interval,
  // since break triggers are defined in hours of driving, not miles).
  const requiredBreaks = Math.floor(driveHours / HOS_BREAK_TRIGGER_HOURS);
  const estimatedTotalTripHours = Math.round((driveHours + requiredBreaks * 0.5) * 10) / 10;

  // A single driver legally cannot drive more than 11 hours without a
  // 10-hour off-duty rest — beyond that, the trip needs an overnight stop.
  const multiDayTrip = driveHours > HOS_MAX_DRIVING_HOURS;
  const hosWarning = multiDayTrip || requiredBreaks > 0;

  const hosWarningMessage = multiDayTrip
    ? `Drive time (${formatDriveTime(driveHours)}) exceeds the 11-hour daily driving limit — this trip needs at least one overnight (10-hour) rest for a single driver.`
    : requiredBreaks > 0
    ? `A 30-minute break is required after ${HOS_BREAK_TRIGGER_HOURS} cumulative hours of driving (~${requiredBreaks} break${requiredBreaks > 1 ? "s" : ""} for this trip).`
    : "No mandatory breaks expected for this drive time.";

  return {
    requiredBreaks,
    breakIntervalMiles: Math.round(distanceMiles / Math.max(requiredBreaks, 1)),
    estimatedTotalTripHours,
    hosWarning,
    hosWarningMessage,
    multiDayTrip,
  };
}

function buildRoutePayload(
  origin: string,
  destination: string,
  waypoints: string[],
  avoidTolls: boolean,
  avoidHighways: boolean,
  computeAlternatives: boolean
) {
  const intermediates = waypoints.map(wp => ({ address: wp }));
  const routeModifiers: Record<string, boolean> = {};
  if (avoidTolls)    routeModifiers.avoidTolls    = true;
  if (avoidHighways) routeModifiers.avoidHighways = true;

  return {
    origin:                    { address: origin },
    destination:               { address: destination },
    intermediates:             intermediates.length ? intermediates : undefined,
    travelMode:                "DRIVE",
    routingPreference:         "TRAFFIC_AWARE_OPTIMAL",
    computeAlternativeRoutes:  computeAlternatives,
    routeModifiers:            Object.keys(routeModifiers).length ? routeModifiers : undefined,
    units:                     "IMPERIAL",
  };
}

async function fetchRoutes(
  body: object,
  apiKey: string,
  attempt: number = 1
): Promise<{ ok: boolean; status: number; data: GoogleRoutesApiResponse }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(GOOGLE_ROUTES_URL, {
      method: "POST",
      headers: {
        "Content-Type":     "application/json",
        "X-Goog-Api-Key":   apiKey,
        "X-Goog-FieldMask": [
          "routes.distanceMeters",
          "routes.duration",
          "routes.staticDuration",
          "routes.polyline.encodedPolyline",
          "routes.description",
          "routes.warnings",
          "routes.legs",
          "routes.legs.startLocation",
          "routes.legs.endLocation",
        ].join(","),
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const data: GoogleRoutesApiResponse = await response.json();

    // Retry once on 503/429 with a short back-off
    if (!response.ok && attempt === 1 && [429, 503].includes(response.status)) {
      await new Promise(r => setTimeout(r, 800));
      return fetchRoutes(body, apiKey, 2);
    }

    return { ok: response.ok, status: response.status, data };
  } finally {
    clearTimeout(timeout);
  }
}

function parseDuration(duration: string): number {
  // Google returns e.g. "12345s"
  return parseInt(duration.replace("s", ""), 10) || 0;
}

function pruneCache() {
  const now = Date.now();
  for (const [key, entry] of routeCache) {
    if (now - entry.cachedAt >= CACHE_TTL_MS) routeCache.delete(key);
  }
  // If still oversized after removing expired entries, drop the oldest ones.
  if (routeCache.size > CACHE_MAX_ENTRIES) {
    const excess = routeCache.size - CACHE_MAX_ENTRIES;
    const oldestKeys = [...routeCache.entries()]
      .sort((a, b) => a[1].cachedAt - b[1].cachedAt)
      .slice(0, excess)
      .map(([key]) => key);
    oldestKeys.forEach(key => routeCache.delete(key));
  }
}

// ── Handler ───────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    // ── Parse & validate ──────────────────────────────────────────────────────
    let body: RequestBody;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body." },
        { status: 400 }
      );
    }

    const {
      origin,
      destination,
      waypoints = [],
      ratePerMile,
      avoidTolls    = false,
      avoidHighways = false,
      truckMpg,
      dieselPricePerGallon,
    } = body;

    if (!origin?.trim()) {
      return NextResponse.json({ error: "Origin is required." }, { status: 400 });
    }
    if (!destination?.trim()) {
      return NextResponse.json({ error: "Destination is required." }, { status: 400 });
    }
    if (truckMpg !== undefined && (typeof truckMpg !== "number" || truckMpg <= 0)) {
      return NextResponse.json({ error: "truckMpg must be a positive number." }, { status: 400 });
    }
    if (dieselPricePerGallon !== undefined && (typeof dieselPricePerGallon !== "number" || dieselPricePerGallon <= 0)) {
      return NextResponse.json({ error: "dieselPricePerGallon must be a positive number." }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error("GOOGLE_MAPS_API_KEY is not set.");
      return NextResponse.json(
        { error: "Server configuration error: maps API key missing." },
        { status: 500 }
      );
    }

    // ── Cache check ───────────────────────────────────────────────────────────
    // Include every input that affects the *returned economics*, not just the
    // route geometry — ratePerMile/truckMpg/dieselPrice previously weren't part
    // of the key, so a cached response could silently serve stale profit
    // numbers computed under a different rate.
    const cacheKey = JSON.stringify({
      origin, destination, waypoints, avoidTolls, avoidHighways,
      ratePerMile: ratePerMile ?? null,
      truckMpg: truckMpg ?? null,
      dieselPricePerGallon: dieselPricePerGallon ?? null,
    });

    pruneCache();

    const cached = routeCache.get(cacheKey);
    if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
      return NextResponse.json({
        ...cached.data,
        cachedAt: new Date(cached.cachedAt).toISOString(),
      });
    }

    // ── Fetch from Google ─────────────────────────────────────────────────────
    const payload = buildRoutePayload(
      origin, destination, waypoints, avoidTolls, avoidHighways,
      waypoints.length === 0 // only compute alternatives for direct routes
    );

    const { ok, status, data } = await fetchRoutes(payload, apiKey);

    if (!ok) {
      const googleError = data?.error?.message ?? JSON.stringify(data);

      // Surface actionable messages for the most common errors
      if (status === 400) {
        return NextResponse.json(
          { error: `Address not found or invalid: ${googleError}` },
          { status: 400 }
        );
      }
      if (status === 403 || status === 401) {
        return NextResponse.json(
          { error: "Google Maps API key is invalid or lacks Routes API access." },
          { status: 403 }
        );
      }
      if (status === 429) {
        return NextResponse.json(
          { error: "Google Maps quota exceeded. Try again in a moment." },
          { status: 429 }
        );
      }

      return NextResponse.json({ error: googleError }, { status });
    }

    const routes = data.routes ?? [];
    if (!routes.length) {
      return NextResponse.json(
        { error: "No route found between these locations. Check addresses and try again." },
        { status: 404 }
      );
    }

    // ── Primary route ─────────────────────────────────────────────────────────
    const primary    = routes[0];
    const distMeters = primary.distanceMeters ?? 0;
    const distMiles  = Math.round(distMeters / 1609.34);
    const driveSecs  = parseDuration(primary.duration ?? "0s");
    const driveHours = Math.round((driveSecs / 3600) * 10) / 10;

    // ── Alternatives ──────────────────────────────────────────────────────────
    const alternatives: AlternativeRoute[] = routes.slice(1).map(r => ({
      distanceMiles: Math.round((r.distanceMeters ?? 0) / 1609.34),
      driveHours:    Math.round((parseDuration(r.duration ?? "0s") / 3600) * 10) / 10,
      polyline:      r.polyline?.encodedPolyline ?? "",
    }));

    const firstLeg = primary.legs?.[0];
    const originLocation = firstLeg?.startLocation?.latLng;
    const destinationLocation = firstLeg?.endLocation?.latLng;

    // ── Compose result ────────────────────────────────────────────────────────
    const result: RouteResult = {
      distanceMiles: distMiles,
      driveHours,
      driveHoursFormatted: formatDriveTime(driveHours),

      origin: {
        lat: originLocation?.latitude,
        lon: originLocation?.longitude,
      },
      destination: {
        lat: destinationLocation?.latitude,
        lon: destinationLocation?.longitude,
      },

      polyline: primary.polyline?.encodedPolyline ?? "",

      summary: {
        origin,
        destination,
        waypoints,
        totalStops: waypoints.length,
        travelMode: "DRIVE",
        trafficModel: "TRAFFIC_AWARE_OPTIMAL",
      },

      economics: calcEconomics(distMiles, ratePerMile, avoidTolls, truckMpg, dieselPricePerGallon),
      compliance: calcCompliance(distMiles, driveHours),
      alternatives: alternatives.length ? alternatives : undefined,
    };

    // ── Cache & return ────────────────────────────────────────────────────────
    routeCache.set(cacheKey, { data: result, cachedAt: Date.now() });

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "private, max-age=300",
      },
    });

  } catch (err: unknown) {
    if (err instanceof HttpError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    if (err instanceof Error && err.name === "AbortError") {
      console.error("[/api/route] Google Routes request timed out");
      return NextResponse.json(
        { error: "Route lookup timed out. Please try again." },
        { status: 504 }
      );
    }
    console.error("[/api/route] Unhandled error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}

// ── Only POST is allowed ──────────────────────────────────────────────────────

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST." },
    { status: 405 }
  );
}