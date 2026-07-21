import { NextRequest, NextResponse } from "next/server";

// ---------- Types ----------

interface FlowSegmentData {
  currentSpeed: number;
  freeFlowSpeed: number;
  currentTravelTime: number;
  freeFlowTravelTime: number;
  confidence: number;
  roadClosure: boolean;
}

interface TomTomFlowResponse {
  flowSegmentData?: FlowSegmentData;
}

class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// ---------- Config ----------

const TOMTOM_URL =
  "https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json";
const FETCH_TIMEOUT_MS = 10_000;

// ---------- Helpers ----------

async function fetchWithTimeout(
  url: string,
  timeoutMs = FETCH_TIMEOUT_MS
): Promise<Response> {
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

// ---------- Route ----------

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.TOMTOM_API_KEY;
    if (!apiKey) {
      // Don't leak env details to the client, but log clearly server-side
      console.error("TRAFFIC ERROR: TOMTOM_API_KEY is not set");
      return NextResponse.json(
        { error: "Traffic service is not configured" },
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

    const url = `${TOMTOM_URL}?point=${lat},${lon}&key=${apiKey}`;

    const response = await fetchWithTimeout(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("TomTom Response:", errorText);
      throw new HttpError(
        response.status === 429 ? 429 : 502,
        `Traffic lookup failed (${response.status})`
      );
    }

    const data: TomTomFlowResponse = await response.json();

    if (!data.flowSegmentData) {
      throw new HttpError(502, "Traffic service returned an unexpected response");
    }

    const {
      currentSpeed,
      freeFlowSpeed,
      currentTravelTime,
      freeFlowTravelTime,
      confidence,
      roadClosure,
    } = data.flowSegmentData;

    return NextResponse.json({
      currentSpeed,
      freeFlowSpeed,
      currentTravelTime,
      freeFlowTravelTime,
      confidence,
      roadClosure,
    });
  } catch (err: unknown) {
    if (err instanceof HttpError) {
      console.error(`TRAFFIC ERROR [${err.status}]:`, err.message);
      return NextResponse.json({ error: err.message }, { status: err.status });
    }

    if (err instanceof Error && err.name === "AbortError") {
      console.error("TRAFFIC ERROR: request to TomTom timed out");
      return NextResponse.json(
        { error: "Traffic service timed out" },
        { status: 504 }
      );
    }

    console.error("TRAFFIC ERROR:", err);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}