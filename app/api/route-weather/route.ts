import { NextResponse } from "next/server";

// =====================================================================
// route-weather API — now backed by Open-Meteo instead of OpenWeather.
//
// Why the switch: Open-Meteo's geocoding + forecast endpoints require
// NO API key, no signup, and no activation delay — this permanently
// removes the "key not yet activated" / "missing env var" / "rate
// limited" failure modes that were causing intermittent blank weather.
//
// Response shape is UNCHANGED from before (location, tempF, condition,
// description, humidity, windMph, alert) — the frontend needs zero
// changes, since it already expects exactly this shape.
// =====================================================================

// ---------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------

interface WeatherPoint {
  location: string;
  tempF: number | null;
  condition: string;
  description: string;
  humidity: number;
  windMph: number | null;
  alert: string | null;
}

interface OpenMeteoGeoResult {
  name: string;
  latitude: number;
  longitude: number;
  admin1?: string;  // state/province
  country?: string;
}

interface OpenMeteoGeoResponse {
  results?: OpenMeteoGeoResult[];
}

interface OpenMeteoForecastResponse {
  current?: {
    temperature_2m?: number;
    relative_humidity_2m?: number;
    wind_speed_10m?: number;
    weather_code?: number;
  };
}

interface GeocodeResult {
  label: string;
  lat: number;
  lon: number;
}

type LocationLeg = "pickup" | "delivery";

class HttpError extends Error {
  readonly status: number;
  constructor(status: number, message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "HttpError";
    this.status = status;
  }
}

// ---------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------

const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";
const FETCH_TIMEOUT_MS = 10_000;

const STATE_NAME_TO_ABBR: Record<string, string> = {
  alabama: "AL", alaska: "AK", arizona: "AZ", arkansas: "AR", california: "CA",
  colorado: "CO", connecticut: "CT", delaware: "DE", florida: "FL", georgia: "GA",
  hawaii: "HI", idaho: "ID", illinois: "IL", indiana: "IN", iowa: "IA",
  kansas: "KS", kentucky: "KY", louisiana: "LA", maine: "ME", maryland: "MD",
  massachusetts: "MA", michigan: "MI", minnesota: "MN", mississippi: "MS", missouri: "MO",
  montana: "MT", nebraska: "NE", nevada: "NV", "new hampshire": "NH", "new jersey": "NJ",
  "new mexico": "NM", "new york": "NY", "north carolina": "NC", "north dakota": "ND", ohio: "OH",
  oklahoma: "OK", oregon: "OR", pennsylvania: "PA", "rhode island": "RI", "south carolina": "SC",
  "south dakota": "SD", tennessee: "TN", texas: "TX", utah: "UT", vermont: "VT",
  virginia: "VA", washington: "WA", "west virginia": "WV", wisconsin: "WI", wyoming: "WY",
};

// WMO weather codes -> {condition, description}. Open-Meteo returns a
// numeric weather_code instead of OpenWeather's main/description pair.
// https://open-meteo.com/en/docs — WMO Weather interpretation codes
const WMO_CODE_MAP: Record<number, { condition: string; description: string }> = {
  0:  { condition: "Clear",        description: "clear sky" },
  1:  { condition: "Clear",        description: "mainly clear" },
  2:  { condition: "Clouds",       description: "partly cloudy" },
  3:  { condition: "Clouds",       description: "overcast" },
  45: { condition: "Fog",          description: "fog" },
  48: { condition: "Fog",          description: "depositing rime fog" },
  51: { condition: "Drizzle",      description: "light drizzle" },
  53: { condition: "Drizzle",      description: "moderate drizzle" },
  55: { condition: "Drizzle",      description: "dense drizzle" },
  56: { condition: "Drizzle",      description: "light freezing drizzle" },
  57: { condition: "Drizzle",      description: "dense freezing drizzle" },
  61: { condition: "Rain",         description: "slight rain" },
  63: { condition: "Rain",         description: "moderate rain" },
  65: { condition: "Rain",         description: "heavy rain" },
  66: { condition: "Rain",         description: "light freezing rain" },
  67: { condition: "Rain",         description: "heavy freezing rain" },
  71: { condition: "Snow",         description: "slight snow fall" },
  73: { condition: "Snow",         description: "moderate snow fall" },
  75: { condition: "Snow",         description: "heavy snow fall" },
  77: { condition: "Snow",         description: "snow grains" },
  80: { condition: "Rain",         description: "slight rain showers" },
  81: { condition: "Rain",         description: "moderate rain showers" },
  82: { condition: "Rain",         description: "violent rain showers" },
  85: { condition: "Snow",         description: "slight snow showers" },
  86: { condition: "Snow",         description: "heavy snow showers" },
  95: { condition: "Thunderstorm", description: "thunderstorm" },
  96: { condition: "Thunderstorm", description: "thunderstorm with slight hail" },
  99: { condition: "Thunderstorm", description: "thunderstorm with heavy hail" },
};

function describeWeatherCode(code?: number): { condition: string; description: string } {
  if (code === undefined) return { condition: "Unknown", description: "" };
  return WMO_CODE_MAP[code] ?? { condition: "Unknown", description: `weather code ${code}` };
}

// Reverse lookup: "GA" -> "georgia", so a state token in either form
// (abbreviation or full name) can be compared against Open-Meteo's
// admin1 field, which always comes back as a full state name.
const ABBR_TO_STATE_NAME: Record<string, string> = Object.fromEntries(
  Object.entries(STATE_NAME_TO_ABBR).map(([name, abbr]) => [abbr, name])
);

/** Splits "Atlanta, GA" into { city: "Atlanta", stateToken: "GA" } without
 *  ever recombining them into a single search string. */
function splitCityState(rawLocation: string): { city: string; stateToken?: string } {
  const withCommas = rawLocation.replace(/\s*\.\s*/g, ", ").replace(/\s+/g, " ").trim();
  const parts = withCommas.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length < 2) return { city: parts[0] ?? "" };
  return { city: parts[0], stateToken: parts[1] };
}

// ---------------------------------------------------------------------
// Logging
// ---------------------------------------------------------------------

function log(event: string, fields: Record<string, unknown> = {}): void {
  console.log(JSON.stringify({ event, ...fields, ts: new Date().toISOString() }));
}

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------

async function fetchWithTimeout(url: string, timeoutMs = FETCH_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new HttpError(504, `Request timed out after ${timeoutMs}ms`, { cause: err });
    }
    throw new HttpError(502, "Network error while contacting weather provider", { cause: err });
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * No API key — Open-Meteo's geocoding endpoint is fully open.
 *
 * Searches by CITY NAME ONLY (never "City, ST" as one string — that's
 * the bug that caused "Atlanta, GA" to intermittently fail). If a state
 * was given, the correct match is picked afterward by comparing against
 * each candidate's `admin1` field, which Open-Meteo always returns as a
 * full state name (e.g. "Georgia"), not an abbreviation.
 */
async function geocodeLocation(rawLocation: string): Promise<GeocodeResult> {
  const { city, stateToken } = splitCityState(rawLocation);

  if (!city) {
    throw new HttpError(400, "Location must not be empty.");
  }

  // count=10 so there's a real pool of candidates to disambiguate against
  // when a common city name (e.g. "Springfield") exists in multiple states.
  const url = `${GEO_URL}?name=${encodeURIComponent(city)}&count=10&language=en&format=json`;
  const res = await fetchWithTimeout(url);

  if (!res.ok) {
    throw new HttpError(502, `Geocoding provider returned ${res.status} for "${city}"`);
  }

  const raw = await res.text();
  let data: OpenMeteoGeoResponse;
  try {
    data = JSON.parse(raw) as OpenMeteoGeoResponse;
  } catch (err) {
    throw new HttpError(502, "Geocoding provider returned an invalid response", { cause: err });
  }

  const results = data.results ?? [];
  if (!results.length) {
    throw new HttpError(404, `Location not found: "${rawLocation}"`);
  }

  let match = results[0];

  if (stateToken) {
    const wantedStateName =
      STATE_NAME_TO_ABBR[stateToken.toLowerCase()] !== undefined
        ? stateToken.toLowerCase() // caller already gave the full name
        : ABBR_TO_STATE_NAME[stateToken.toUpperCase()]; // convert "GA" -> "georgia"

    if (wantedStateName) {
      const found = results.find((r) => r.admin1?.toLowerCase() === wantedStateName);
      if (found) match = found;
      // If no result's admin1 matches, we deliberately fall back to
      // results[0] rather than throwing 404 — better to show weather for
      // the most likely city than fail outright over a state mismatch.
    }
  }

  const label = [match.name, match.admin1, match.country].filter(Boolean).join(", ");
  return { label, lat: match.latitude, lon: match.longitude };
}

/** No API key — Open-Meteo's forecast endpoint is fully open. */
async function fetchCurrentWeather(coords: GeocodeResult): Promise<WeatherPoint> {
  const url =
    `${WEATHER_URL}?latitude=${coords.lat}&longitude=${coords.lon}` +
    `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code` +
    `&temperature_unit=fahrenheit&wind_speed_unit=mph`;

  const res = await fetchWithTimeout(url);

  if (!res.ok) {
    throw new HttpError(502, `Weather provider returned ${res.status} for "${coords.label}"`);
  }

  const raw = await res.text();
  let data: OpenMeteoForecastResponse;
  try {
    data = JSON.parse(raw) as OpenMeteoForecastResponse;
  } catch (err) {
    throw new HttpError(502, "Weather provider returned an invalid response", { cause: err });
  }

  if (!data.current || data.current.temperature_2m === undefined) {
    throw new HttpError(502, `Weather service returned an unexpected response for "${coords.label}"`);
  }

  const { condition, description } = describeWeatherCode(data.current.weather_code);

  return {
    location: coords.label,
    tempF: Math.round(data.current.temperature_2m),
    condition,
    description,
    humidity: data.current.relative_humidity_2m ?? 0,
    windMph: data.current.wind_speed_10m !== undefined ? Math.round(data.current.wind_speed_10m) : null,
    // Open-Meteo's free forecast endpoint doesn't include severe weather
    // alerts; leave null (same limitation the OpenWeather /weather
    // endpoint had).
    alert: null,
  };
}

async function resolveLegWeather(rawLocation: string, leg: LocationLeg): Promise<WeatherPoint> {
  try {
    const coords = await geocodeLocation(rawLocation);
    const result = await fetchCurrentWeather(coords);
    log("route_weather.success", { leg, location: result.location });
    return result;
  } catch (err) {
    const reason = err instanceof Error ? err.message : "Weather lookup failed";
    log("route_weather.leg_failed", { leg, input: rawLocation, reason });
    throw err;
  }
}

// ---------------------------------------------------------------------
// Route
// ---------------------------------------------------------------------

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const pickup = body?.pickup;
    const delivery = body?.delivery;

    if (typeof pickup !== "string" || typeof delivery !== "string" || !pickup.trim() || !delivery.trim()) {
      return NextResponse.json(
        { pickup: null, delivery: null, error: "`pickup` and `delivery` are required and must be non-empty strings." },
        { status: 400 }
      );
    }

    const [pickupResult, deliveryResult] = await Promise.allSettled([
      resolveLegWeather(pickup, "pickup"),
      resolveLegWeather(delivery, "delivery"),
    ]);

    const pickupOk = pickupResult.status === "fulfilled";
    const deliveryOk = deliveryResult.status === "fulfilled";

    const pickupError = pickupOk ? undefined : describeError((pickupResult as PromiseRejectedResult).reason);
    const deliveryError = deliveryOk ? undefined : describeError((deliveryResult as PromiseRejectedResult).reason);

    if (!pickupOk && !deliveryOk) {
      log("route_weather.both_legs_failed", { pickupError, deliveryError });
      return NextResponse.json(
        { pickup: null, delivery: null, error: "Weather lookup failed for both locations.", pickupError, deliveryError },
        { status: 404 }
      );
    }

    if (pickupOk && deliveryOk) {
      return NextResponse.json({ pickup: pickupResult.value, delivery: deliveryResult.value, error: "" }, { status: 200 });
    }

    const failedLeg: LocationLeg = pickupOk ? "delivery" : "pickup";
    log("route_weather.partial_success", { failedLeg, pickupError, deliveryError });

    return NextResponse.json(
      {
        pickup: pickupOk ? pickupResult.value : null,
        delivery: deliveryOk ? deliveryResult.value : null,
        error: `${failedLeg === "pickup" ? "Pickup" : "Delivery"}: ${pickupError ?? deliveryError}`,
        pickupError,
        deliveryError,
      },
      { status: 207 }
    );
  } catch (err: unknown) {
    log("route_weather.unhandled_error", { reason: describeError(err) });
    const status = err instanceof HttpError ? err.status : 500;
    return NextResponse.json({ pickup: null, delivery: null, error: describeError(err) }, { status });
  }
}

function describeError(err: unknown): string {
  return err instanceof Error ? err.message : "Weather lookup failed";
}