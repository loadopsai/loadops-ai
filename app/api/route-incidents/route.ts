import { NextRequest, NextResponse } from "next/server";

// ── Types ─────────────────────────────────────────────────────────────────────

interface TomTomIncidentEvent {
  description?: string;
}

interface TomTomIncidentProperties {
  iconCategory?: number;
  magnitudeOfDelay?: number;
  delay?: number;
  events?: TomTomIncidentEvent[];
}

interface TomTomIncident {
  properties?: TomTomIncidentProperties;
}

interface TomTomIncidentDetailsResponse {
  incidents?: TomTomIncident[];
}

type IncidentType =
  | "accident"
  | "fog"
  | "dangerous_conditions"
  | "rain"
  | "ice"
  | "jam"
  | "lane_closed"
  | "road_closed"
  | "road_works"
  | "wind"
  | "flooding"
  | "broken_down_vehicle"
  | "unknown";

interface TrafficIncident {
  type: IncidentType;
  label: string;
  description: string;
  delayMinutes: number | null;
}

class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// ── Config ────────────────────────────────────────────────────────────────────

const TOMTOM_URL = "https://api.tomtom.com/traffic/services/5/incidentDetails";
const FETCH_TIMEOUT_MS = 10_000;
const BBOX_DELTA = 0.4; // ~44km per side around the point

// TomTom's iconCategory codes: https://developer.tomtom.com/traffic-api/documentation/traffic-incidents/incident-details
const ICON_CATEGORY_MAP: Record<number, { type: IncidentType; label: string }> = {
  1:  { type: "accident",             label: "Accident" },
  2:  { type: "fog",                  label: "Fog" },
  3:  { type: "dangerous_conditions", label: "Dangerous Conditions" },
  4:  { type: "rain",                 label: "Rain" },
  5:  { type: "ice",                  label: "Ice" },
  6:  { type: "jam",                  label: "Traffic Jam" },
  7:  { type: "lane_closed",          label: "Lane Closed" },
  8:  { type: "road_closed",          label: "Road Closed" },
  9:  { type: "road_works",           label: "Road Works" },
  10: { type: "wind",                 label: "Wind" },
  11: { type: "flooding",             label: "Flooding" },
  14: { type: "broken_down_vehicle",  label: "Broken Down Vehicle" },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

async function fetchWithTimeout(url: string, timeoutMs = FETCH_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

function isValidCoordinate(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function parseIncidents(data: TomTomIncidentDetailsResponse): TrafficIncident[] {
  return (data.incidents ?? []).map((incident) => {
    const props = incident.properties ?? {};
    const category = ICON_CATEGORY_MAP[props.iconCategory ?? -1] ?? {
      type: "unknown" as const,
      label: "Traffic Incident",
    };
    const description = props.events?.map((e) => e.description).filter(Boolean).join("; ") || category.label;

    return {
      type: category.type,
      label: category.label,
      description,
      delayMinutes: typeof props.delay === "number" ? Math.round(props.delay / 60) : null,
    };
  });
}

// ── Route ─────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.TOMTOM_API_KEY;
    if (!apiKey) {
      console.error("TRAFFIC INCIDENTS ERROR: TOMTOM_API_KEY is not set");
      return NextResponse.json(
        { error: "Traffic incidents service is not configured" },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => null);
    const lat = body?.lat;
    const lon = body?.lon;

    if (!isValidCoordinate(lat) || !isValidCoordinate(lon)) {
      return NextResponse.json(
        { error: "`lat` and `lon` are required and must be numbers" },
        { status: 400 }
      );
    }

    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return NextResponse.json(
        { error: "`lat`/`lon` are out of valid range" },
        { status: 400 }
      );
    }

    const bbox = [
      lon - BBOX_DELTA,
      lat - BBOX_DELTA,
      lon + BBOX_DELTA,
      lat + BBOX_DELTA,
    ].join(",");

    const fields = "{incidents{properties{iconCategory,magnitudeOfDelay,delay,events{description}}}}";

    const url =
      `${TOMTOM_URL}?key=${encodeURIComponent(apiKey)}` +
      `&bbox=${encodeURIComponent(bbox)}` +
      `&fields=${encodeURIComponent(fields)}`;

    const res = await fetchWithTimeout(url);

    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      console.error("TomTom incidents response:", errorText);
      throw new HttpError(
        res.status === 429 ? 429 : 502,
        `Traffic incidents lookup failed (${res.status})`
      );
    }

    const data: TomTomIncidentDetailsResponse = await res.json();
    const incidents = parseIncidents(data);

    return NextResponse.json({ incidents });
  } catch (err: unknown) {
    if (err instanceof HttpError) {
      console.error(`TRAFFIC INCIDENTS ERROR [${err.status}]:`, err.message);
      return NextResponse.json({ error: err.message }, { status: err.status });
    }

    if (err instanceof Error && err.name === "AbortError") {
      console.error("TRAFFIC INCIDENTS ERROR: request to TomTom timed out");
      return NextResponse.json(
        { error: "Traffic incidents service timed out" },
        { status: 504 }
      );
    }

    console.error("TRAFFIC INCIDENTS ERROR:", err);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}