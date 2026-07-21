"use client";

import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { usePlan } from "@/app/lib/usePlan";
import { LockedScreen } from "@/app/component/LockedScreen";

// ── Types ──────────────────────────────────────────────────────────────────────
// Live/factual data now comes exclusively from real APIs (Google Routes, OpenWeather,
// OpenStreetMap/Overpass, TomTom Traffic). The AI model is only ever asked for
// narrative/advisory content — it never produces distance, weather, stop names,
// or traffic facts. See buildInsightPrompt() below.

interface GoogleAlternativeRoute {
  summary:       string;  // e.g. "Via I-40 W instead of I-30 W"
  extraMinutes:  number;  // positive = slower, negative = faster
}

interface GoogleRouteData {
  distanceMiles: number;
  driveHours:    number;
  origin: {
  lat?: number;
  lon?: number;
};

destination: {
  lat?: number;
  lon?: number;
};
  steps?:        string[];               // turn-by-turn, when the Directions API returns them
  alternativeRoute?: GoogleAlternativeRoute | null;
  crossesBorder?: boolean;
  economics: {
    fuelCostUSD:       number;
    estimatedTollUSD:  number;
    estimatedRevenue:  number;
    netProfit:         number;
    netProfitUSD:      number;
    totalCostUSD:      number;
    revenuePerMile:    number;
  };
  compliance: { requiredBreaks: number };
}

interface WeatherPoint {
  location:          string;
  tempF:             number | null;
  condition:         string;
  windMph:           number | null;
  precipChancePct?:  number | null;
  alert?:            string | null;
}

interface RouteWeatherData {
  pickup:   WeatherPoint | null;
  delivery: WeatherPoint | null;
}

interface TruckStop {
  name:           string;
  brand?:         string;
  address?:       string;
  distanceMiles?: number;
}

interface RouteStopsData {
  fuelStops: TruckStop[];
  restStops: TruckStop[];
}

interface RouteTrafficData {
  currentSpeed: number;
  freeFlowSpeed: number;
  currentTravelTime: number;
  freeFlowTravelTime: number;
  confidence: number;
  roadClosure: boolean;
}

// The ONLY things the AI model is allowed to generate. Everything here is
// advisory/narrative — never a fact that could be sourced from a live API.
interface AIInsights {
  risk:                       "Low" | "Medium" | "High";
  risk_note:                  string;
  efficiency:                 number; // 0-100 qualitative lane/opportunity score
  summary:                    string;
  dispatcher_recommendation:  string;
  fuel_strategy_tip:          string;
  hos_guidance:               string;
  best_depart_time:           string;
  backhaul_chance:            "High" | "Medium" | "Low";
  load_density:               string;
  seasonal_note:              string;
  alt_route_commentary:       string;
  truckStops?: {
  name: string;
  type: string;
  lat: number;
  lon: number;
}[];
}

const EQUIPMENT_TYPES = [
  "Dry Van", "Reefer", "Flatbed", "Box Truck",
  "Sprinter/Cargo Van", "Tanker", "HotShot", "Step Deck", "Power Only",
];

// ── Animated Number ────────────────────────────────────────────────────────────

function AnimatedNumber({ target, decimals = 0 }: { target: number; decimals?: number }) {
  const [val, setVal] = useState(0);
  const raf = useRef<number | null>(null);
  useEffect(() => {
    const dur = 1100;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(e * target);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target]);
  return <>{decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString()}</>;
}

// ── Typewriter ─────────────────────────────────────────────────────────────────

function Typewriter({ text, speed = 16 }: { text: string; speed?: number }) {
  const [shown, setShown] = useState("");
  const idx = useRef(0);
  useEffect(() => {
    setShown(""); idx.current = 0;
    const iv = setInterval(() => {
      setShown(text.slice(0, idx.current + 1));
      idx.current++;
      if (idx.current >= text.length) clearInterval(iv);
    }, speed);
    return () => clearInterval(iv);
  }, [text, speed]);
  return <span>{shown}<span style={{ opacity: idx.current < text.length ? 1 : 0 }}>|</span></span>;
}

// ── Live Status Badge ──────────────────────────────────────────────────────────

function LiveBadge({ status }: { status: "idle" | "loading" | "ready" | "error" }) {
  const map = {
    idle:    { color: "#6B7A8D", bg: "#EFF1F5", border: "#D0D5E0", dot: "#6B7A8D", label: "READY TO ANALYZE" },
    loading: { color: "#D97706", bg: "#FEF3C7", border: "#FDE68A", dot: "#D97706", label: "ANALYZING LIVE…"  },
    ready:   { color: "#12A150", bg: "#E6F7EE", border: "#A7F3C8", dot: "#12A150", label: "LIVE RESULTS"      },
    error:   { color: "#DC2626", bg: "#FEF2F2", border: "#FEE2E2", dot: "#DC2626", label: "ANALYSIS ERROR"    },
  };
  const s = map[status];
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6,
      padding: "5px 12px", borderRadius: 999,
      background: s.bg, border: `1px solid ${s.border}`,
      fontSize: "0.63rem", fontWeight: 800, letterSpacing: "0.07em",
      color: s.color, whiteSpace: "nowrap",
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: "50%", background: s.dot, display: "inline-block",
        animation: (status === "loading" || status === "ready") ? "pulse 1.5s infinite" : "none",
      }} />
      {s.label}
    </div>
  );
}

// ── Helpers: build the (much smaller) AI prompt ────────────────────────────────
// The AI is only given live-data context so its narrative is grounded, but it is
// never asked to invent distance/weather/stops/traffic — those are already known.

function buildInsightPrompt(
  p: string, d: string, eq: string, st: string, f: string, w: string, r: string,
  g: GoogleRouteData | null,
  weather: RouteWeatherData | null,
  stops: RouteStopsData | null,
  traffic: RouteTrafficData | null,
): string {
  return `You are an expert freight dispatcher AI assistant. You are NOT responsible for distance, drive time, weather, fuel/rest stop names, or traffic — those are already known from live data below. Your only job is dispatcher-style advice and narrative analysis. Return ONLY a raw JSON object — no markdown, no backticks, no explanation text.

ROUTE: ${p} → ${d}
Equipment: ${eq || "Dry Van"} | Planned stops: ${st || "0"} | Fuel budget: ${f ? "$" + f : "not specified"} | Load weight: ${w ? w + " lbs" : "not specified"} | Expected rate: ${r ? "$" + r : "not specified"}

LIVE DATA (already confirmed, do not contradict or restate as your own estimate):
${g ? `- Distance: ${g.distanceMiles} mi, Drive time: ${g.driveHours} hrs, Required HOS breaks: ${g.compliance.requiredBreaks}, Border crossing: ${g.crossesBorder ? "yes" : "no"}` : "- Route distance/time unavailable this request."}
${weather?.pickup ? `- Pickup weather (${weather.pickup.location}): ${weather.pickup.condition}, ${weather.pickup.tempF}°F, wind ${weather.pickup.windMph} mph${weather.pickup.alert ? `, ALERT: ${weather.pickup.alert}` : ""}` : "- Pickup weather unavailable."}
${weather?.delivery ? `- Delivery weather (${weather.delivery.location}): ${weather.delivery.condition}, ${weather.delivery.tempF}°F, wind ${weather.delivery.windMph} mph${weather.delivery.alert ? `, ALERT: ${weather.delivery.alert}` : ""}` : "- Delivery weather unavailable."}
${traffic ? `- Traffic:
Current speed ${traffic.currentSpeed} km/h,
Free-flow speed ${traffic.freeFlowSpeed} km/h,
Travel time ${traffic.currentTravelTime} sec,
Road closure: ${traffic.roadClosure ? "Yes" : "No"}` : "- Traffic data unavailable."}
${stops?.fuelStops?.length ? `- Known live fuel stops: ${stops.fuelStops.slice(0, 3).map(s => s.name).join(", ")}` : ""}

Return this exact JSON, all fields populated for THIS specific route/conditions:
{
  "risk": "<Low | Medium | High, based on the live weather/traffic above>",
  "risk_note": "<one specific sentence explaining the risk level using the live data above>",
  "efficiency": <integer 0-100 lane/opportunity score based on rate, equipment, and market>,
  "summary": "<3 sentences: lane quality, freight density, carrier opportunity for this exact route>",
  "dispatcher_recommendation": "<one specific, actionable dispatcher recommendation under 25 words>",
  "fuel_strategy_tip": "<one hyper-specific fuel-saving tip under 15 words>",
  "hos_guidance": "<practical HOS scheduling guidance for this route under 20 words>",
  "best_depart_time": "<specific day/time recommendation to avoid traffic/weather>",
  "backhaul_chance": "<High | Medium | Low, based on freight market on the return lane>",
  "load_density": "<short freight market description for this specific lane>",
  "seasonal_note": "<seasonal freight pattern relevant to this lane right now>",
  "alt_route_commentary": "<one sentence of dispatcher commentary on the alternative route, or why the primary route is best>"
}`;
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function RoutePlannerPage() {
  const { canUseRoutePlanner, loading } = usePlan();
  const router = useRouter();

  // Form state
  const [pickup,    setPickup]    = useState("");
  const [delivery,  setDelivery]  = useState("");
  const [equipment, setEquipment] = useState("Dry Van");
  const [stops,     setStops]     = useState("0");
  const [fuel,      setFuel]      = useState("");
  const [weight,    setWeight]    = useState("");
  const [rate,      setRate]      = useState("");

  // Live-data state (one slot per API — each fails independently)
  const [googleData,  setGoogleData]  = useState<GoogleRouteData | null>(null);
  const [weatherData, setWeatherData] = useState<RouteWeatherData | null>(null);
  const [stopsData,   setStopsData]   = useState<RouteStopsData | null>(null);
  const [trafficData, setTrafficData] = useState<RouteTrafficData | null>(null);
  const [aiInsights,  setAiInsights]  = useState<AIInsights | null>(null);

  // UI state
  const [aiLoading,        setAiLoading]        = useState(false);
  const [activeTab,        setActiveTab]        = useState<"map" | "insights">("map");
  const [activeInsightTab, setActiveInsightTab] = useState("overview");
  const [error,            setError]            = useState("");
  const [savedRoute,       setSavedRoute]       = useState(false);
  const [liveStatus,       setLiveStatus]       = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [lastAnalyzed,     setLastAnalyzed]     = useState("");

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef    = useRef<AbortController | null>(null);

  // ── Map embed ────────────────────────────────────────────────────────────────
  const mapSrc = useMemo(() => {
    if (!pickup || !delivery) return "";
    return `https://www.google.com/maps?q=${encodeURIComponent(pickup)}+to+${encodeURIComponent(delivery)}&output=embed`;
  }, [pickup, delivery]);

  // ── Financials — pure calculation off live Google data, never AI ─────────────
  const financials = useMemo(() => {
    if (!googleData) return null;
    const rateNum          = rate && Number(rate) > 0 ? Number(rate) : null;
    const estimatedRevenue = rateNum ?? Math.round(googleData.distanceMiles * (googleData.economics.revenuePerMile || 2.5));
    const totalCosts       = googleData.economics.fuelCostUSD + googleData.economics.estimatedTollUSD + 150;
    const netProfit        = estimatedRevenue - totalCosts;
    const margin           = estimatedRevenue > 0 ? ((netProfit / estimatedRevenue) * 100).toFixed(1) + "%" : "0%";
    const rpm               = estimatedRevenue > 0
      ? parseFloat((estimatedRevenue / googleData.distanceMiles).toFixed(2))
      : 0;
    return { estimatedRevenue, netProfit, margin, rpm, totalCosts };
  }, [googleData, rate]);

  const resultsReady = !!aiInsights;

  // Cache the live-data fetch keyed by the pickup/delivery pair it was fetched
  // for, so a change to equipment/rate/weight/etc. can reuse it instead of
  // re-hitting four external APIs just to regenerate a narrative.
  const liveDataCacheKey = useRef<string>("");

  // ── Step 1: fetch every live data source in parallel — each fails independently.
  //     Only re-runs when pickup/delivery actually change. ─────────────────────
  const fetchLiveData = useCallback(async (p: string, d: string, r: string, signal: AbortSignal) => {
    const [googleRes, weatherRes, stopsRes] = await Promise.allSettled([
      fetch("/api/google-route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin: p,
          destination: d,
          waypoints: [],
          ratePerMile: Number(r || 2.5),
          avoidTolls: false,
        }),
        signal,
      }),
      fetch("/api/route-weather", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pickup: p, delivery: d }),
        signal,
      }),
      fetch("/api/route-stops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pickup: p }),
        signal,
      }),
    ]);

    if (signal.aborted) return null;

    let gData: GoogleRouteData | null = null;
    if (googleRes.status === "fulfilled" && googleRes.value.ok) {
      const json = await googleRes.value.json().catch(() => null);
      if (json && !json.error) gData = json;
    } else if (googleRes.status === "rejected") {
      console.warn("Google route API unavailable:", googleRes.reason);
    }

    let tData: RouteTrafficData | null = null;
    if (gData?.origin?.lat && gData?.origin?.lon) {
      try {
        const trafficRes = await fetch("/api/route-traffic", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lat: gData.origin.lat, lon: gData.origin.lon }),
          signal,
        });
        if (trafficRes.ok) tData = await trafficRes.json();
      } catch (err) {
        console.warn("Traffic API unavailable:", err);
      }
    }

    let wData: RouteWeatherData | null = null;

if (weatherRes.status === "fulfilled") {
  console.log("Weather status:", weatherRes.value.status);

  if (weatherRes.value.ok) {
    wData = await weatherRes.value.json().catch(() => null);

    console.log("Weather API response:", wData);
  } else {
    console.log(
      "Weather API error body:",
      await weatherRes.value.text()
    );
  }
} else {
  console.warn("Weather API unavailable:", weatherRes.reason);
}

    let sData: RouteStopsData | null = null;
    if (stopsRes.status === "fulfilled" && stopsRes.value.ok) {
      sData = await stopsRes.value.json().catch(() => null);
    } else if (stopsRes.status === "rejected") {
      console.warn("Route stops API unavailable:", stopsRes.reason);
    }

    if (signal.aborted) return null;

    setGoogleData(gData);
    setTrafficData(tData);
    setWeatherData(wData);
    setStopsData(sData);

    return { gData, wData, sData, tData };
  }, []);

  // ── Step 2: ask the AI for narrative-only insights, grounded in whatever
  //     live data is currently loaded ───────────────────────────────────────
  const generateInsights = useCallback(async (
    p: string, d: string, eq: string, st: string, f: string, w: string, r: string,
    live: { gData: GoogleRouteData | null; wData: RouteWeatherData | null; sData: RouteStopsData | null; tData: RouteTrafficData | null },
    signal: AbortSignal,
  ) => {
    try {
      const prompt = buildInsightPrompt(p, d, eq, st, f, w, r, live.gData, live.wData, live.sData, live.tData);

      const res = await fetch("/api/route-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
        signal,
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error((errBody as { error?: string })?.error || `Server error ${res.status}`);
      }

      const data = await res.json();
      if (!data.result) throw new Error("No result returned from API.");

      const clean = (data.result as string)
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(clean) as AIInsights;
      if (signal.aborted) return;

      setAiInsights(parsed);
      setLiveStatus("ready");
      setLastAnalyzed(`${p} → ${d}`);
      setActiveTab("insights");
      setActiveInsightTab("overview");

    } catch (err: unknown) {
      if ((err as { name?: string }).name === "AbortError" || signal.aborted) return;
      console.error("AI insight generation error:", err);
      setAiInsights(null);
      // Live data (Google/weather/stops/traffic) may still be usable even if the
      // AI narrative fails — only flag an error if we have nothing at all.
      if (!live.gData && !live.wData && !live.sData && !live.tData) {
        setLiveStatus("error");
        setError("Route analysis failed. Please check your connection and try again.");
      } else {
        setLiveStatus("ready");
        setLastAnalyzed(`${p} → ${d}`);
        setActiveTab("insights");
        setError("Live route data loaded, but the AI dispatcher summary is temporarily unavailable.");
      }
    } finally {
      if (!signal.aborted) setAiLoading(false);
    }
  }, []);

  // ── Orchestrator: fetch live data only when pickup/delivery changed since
  //     the last run, then always regenerate the AI narrative ─────────────────
  // ── Orchestrator: fetch live data only when pickup/delivery changed since
  //     the last run, then always regenerate the AI narrative ─────────────────
  const runAnalysis = useCallback(async (
    p: string, d: string, eq: string, st: string, f: string, w: string, r: string
  ) => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    setAiLoading(true);
    setLiveStatus("loading");
    setError("");

    const routeKey = `${p.toLowerCase()}→${d.toLowerCase()}`;
    const routeChanged = routeKey !== liveDataCacheKey.current;

    let live: { gData: GoogleRouteData | null; wData: RouteWeatherData | null; sData: RouteStopsData | null; tData: RouteTrafficData | null } | null;

    if (routeChanged) {
      live = await fetchLiveData(p, d, r, signal);
      if (signal.aborted) return;

      // Only treat this route pair as "cached" if at least one live source
      // actually came back. If everything failed (e.g. a transient
      // OpenWeather rate-limit or a not-yet-activated API key), leave the
      // cache key alone so the NEXT edit — even to an unrelated field like
      // equipment — retries the live-data fetch instead of permanently
      // reusing null state for this route.
      const gotSomething = !!(live?.gData || live?.wData || live?.sData || live?.tData);
      if (gotSomething) {
        liveDataCacheKey.current = routeKey;
      }
    } else {
      // Reuse whatever is already loaded — avoids re-hitting Google/OpenWeather/
      // Places/TomTom just because equipment, rate, or weight changed.
      live = { gData: googleData, wData: weatherData, sData: stopsData, tData: trafficData };
    }

    if (signal.aborted || !live) return;
    await generateInsights(p, d, eq, st, f, w, r, live, signal);
  }, [fetchLiveData, generateInsights, googleData, weatherData, stopsData, trafficData]);
  // ── Debounced live trigger ────────────────────────────────────────────────────
  useEffect(() => {
    if (!pickup.trim() || !delivery.trim()) {
      setLiveStatus("idle");
      setGoogleData(null);
      setWeatherData(null);
      setStopsData(null);
      setTrafficData(null);
      setAiInsights(null);
      liveDataCacheKey.current = "";
      return;
    }
    if (pickup.trim().length < 3 || delivery.trim().length < 3) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      runAnalysis(pickup, delivery, equipment, stops, fuel, weight, rate);
    }, 800);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickup, delivery, equipment, stops, fuel, weight, rate]);

  // Abort any in-flight request on unmount so state isn't set after the
  // component is gone.
  useEffect(() => {
    return () => { abortRef.current?.abort(); };
  }, []);

  // ── Color maps ────────────────────────────────────────────────────────────────
  const riskStyle = {
    Low:    { bg: "var(--green-l)",  color: "var(--green)",  border: "var(--green-m)" },
    Medium: { bg: "var(--amber-l)",  color: "var(--amber)",  border: "#FDE68A"        },
    High:   { bg: "var(--red-l)",    color: "var(--red)",    border: "#FEE2E2"        },
  };

  const backhaulStyle = {
    High:   { color: "var(--green)", bg: "var(--green-l)", border: "var(--green-m)" },
    Medium: { color: "var(--amber)", bg: "var(--amber-l)", border: "#FDE68A"        },
    Low:    { color: "var(--red)",   bg: "var(--red-l)",   border: "#FEE2E2"        },
  };

  // Derive a human-readable congestion level from the TomTom speed ratio
  // instead of showing a raw speed number labeled "congestion" (previous bug).
  const congestionLevel = useMemo(() => {
    if (!trafficData || !trafficData.freeFlowSpeed) return null;
    const ratio = trafficData.currentSpeed / trafficData.freeFlowSpeed;
    if (ratio >= 0.85) return { label: "Light", color: "var(--green)" };
    if (ratio >= 0.6)  return { label: "Moderate", color: "var(--amber)" };
    return { label: "Heavy", color: "var(--red)" };
  }, [trafficData]);

  const insightTabs = [
    { key: "overview",   label: "📊 Overview"   },
    { key: "financials", label: "💵 Financials" },
    { key: "navigation", label: "🗺 Navigation" },
    { key: "conditions", label: "⚠ Conditions"  },
  ];

  // ── Guards ────────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#6B7A8D" }}>
        Loading…
      </div>
    );
  }

  if (!canUseRoutePlanner) {
   return <LockedScreen name="Smart Route Planner" plan="Enterprise" url="https://loadops.gumroad.com/l/thxap" />;
  }

  const hasRoute = pickup.trim().length >= 3 && delivery.trim().length >= 3;

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <main style={{ minHeight: "100vh", background: "#F7F8FA", fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#0F1520" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap');

        :root {
          --white:#FFFFFF; --bg:#F7F8FA; --bg2:#EFF1F5;
          --border:#E4E7ED; --border2:#D0D5E0;
          --txt:#0F1520; --txt2:#3D4A5C; --txt3:#4A5568; --txt4:#6B7A8D;
          --blue:#1A56DB; --blue-h:#1446C0; --blue-l:#EBF1FD; --blue-m:#C7D9FA;
          --green:#12A150; --green-l:#E6F7EE; --green-m:#A7F3C8;
          --amber:#D97706; --amber-l:#FEF3C7;
          --purple:#7C3AED; --purple-l:#EDE9FE; --purple-m:#C4B5FD;
          --red:#DC2626; --red-l:#FEF2F2;
        }
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

        @keyframes fadeUp  {from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:none;}}
        @keyframes pulse   {0%,100%{opacity:1;}50%{opacity:0.4;}}
        @keyframes spin    {to{transform:rotate(360deg);}}
        @keyframes slideIn {from{opacity:0;transform:translateX(8px);}to{opacity:1;transform:none;}}
        @keyframes shimmer {0%{background-position:-400px 0;}100%{background-position:400px 0;}}

        .rp-page{padding:32px 5%;max-width:1300px;margin:0 auto;}

        .rp-header{display:flex;align-items:flex-start;justify-content:space-between;gap:24px;margin-bottom:28px;flex-wrap:wrap;}
        .rp-eyebrow{display:flex;align-items:center;gap:7px;font-size:0.68rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--blue);margin-bottom:8px;}
        .rp-live-dot{width:7px;height:7px;border-radius:50%;background:var(--green);animation:pulse 2s infinite;display:inline-block;}
        .rp-title{font-size:clamp(1.6rem,3.5vw,2.4rem);font-weight:800;letter-spacing:-0.045em;color:var(--txt);line-height:1.06;}
        .rp-title em{font-family:'Instrument Serif',serif;font-style:italic;font-weight:400;color:var(--blue);}
        .rp-sub{font-size:0.84rem;color:var(--txt3);margin-top:6px;}
        .rp-back-btn{padding:9px 18px;border-radius:9px;background:var(--white);border:1.5px solid var(--border2);color:var(--txt2);font-size:0.78rem;font-weight:700;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all 0.15s;white-space:nowrap;align-self:flex-start;}
        .rp-back-btn:hover{border-color:var(--blue-m);color:var(--blue);}

        .rp-stats-row{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:24px;}
        .rp-stat{background:var(--white);border:1px solid var(--border);border-radius:14px;padding:16px 20px;min-width:130px;}
        .rp-stat-n{font-size:1.5rem;font-weight:800;letter-spacing:-0.04em;line-height:1;}
        .rp-stat-l{font-size:0.65rem;color:var(--txt3);font-weight:600;text-transform:uppercase;letter-spacing:0.07em;margin-top:4px;}
        .blue{color:var(--blue);} .green{color:var(--green);} .purple{color:var(--purple);} .amber{color:var(--amber);}

        .rp-grid{display:grid;grid-template-columns:340px 1fr;gap:20px;align-items:start;}

        .rp-sidebar{background:var(--white);border:1px solid var(--border);border-radius:16px;overflow:hidden;position:sticky;top:20px;animation:fadeUp 0.4s ease both;}
        .rp-sidebar-head{padding:22px 22px 18px;border-bottom:1px solid var(--border);}
        .rp-sidebar-eyebrow{font-size:0.62rem;font-weight:800;color:var(--blue);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px;}
        .rp-sidebar-title{font-size:0.95rem;font-weight:800;color:var(--txt);letter-spacing:-0.02em;margin-bottom:4px;}
        .rp-sidebar-sub{font-size:0.76rem;color:var(--txt3);line-height:1.6;}

        .rp-live-hint{display:flex;align-items:center;gap:6px;font-size:0.68rem;color:var(--green);font-weight:700;background:var(--green-l);border:1px solid var(--green-m);border-radius:8px;padding:7px 10px;margin:0 22px 14px;}

        .rp-form{padding:18px 22px;display:flex;flex-direction:column;gap:14px;}
        .rp-label{display:block;font-size:0.62rem;font-weight:700;color:var(--txt4);text-transform:uppercase;letter-spacing:0.07em;margin-bottom:5px;}
        .rp-iw{position:relative;}
        .rp-ii{position:absolute;left:11px;top:50%;transform:translateY(-50%);font-size:0.9rem;pointer-events:none;line-height:1;}
        .rp-input{width:100%;padding:9px 12px 9px 34px;border-radius:9px;background:var(--bg);border:1.5px solid var(--border2);color:var(--txt);font-size:0.8rem;font-family:'Plus Jakarta Sans',sans-serif;outline:none;transition:border-color 0.15s,box-shadow 0.15s;}
        .rp-input:focus{border-color:var(--blue);box-shadow:0 0 0 3px var(--blue-l);background:var(--white);}
        .rp-input::placeholder{color:var(--txt4);}
        .rp-input.live-ready{border-color:var(--green-m);}
        select.rp-input{appearance:none;cursor:pointer;}
        .rp-input-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
        .rp-error{font-size:0.72rem;color:var(--red);font-weight:600;padding:0 22px;margin-top:-6px;}
        .rp-sidebar-footer{padding:14px 22px 18px;border-top:1px solid var(--border);display:flex;flex-direction:column;gap:8px;}
        .rp-ghost-btn{width:100%;padding:9px;border-radius:9px;background:var(--white);color:var(--txt2);font-size:0.78rem;font-weight:700;border:1.5px solid var(--border2);cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all 0.15s;}
        .rp-ghost-btn:hover{border-color:var(--blue-m);color:var(--blue);}
        .rp-ghost-btn.saved{background:var(--amber-l);color:var(--amber);border-color:#FDE68A;}
        .rp-ghost-btn.purple{background:var(--purple-l);color:var(--purple);border-color:var(--purple-m);}
        .rp-ghost-btn.purple:hover{background:var(--purple);color:#fff;}
        .rp-ghost-btn:disabled{opacity:0.4;cursor:not-allowed;}

        .rp-main{background:var(--white);border:1px solid var(--border);border-radius:16px;overflow:hidden;animation:fadeUp 0.4s 0.08s ease both;}
        .rp-topbar{padding:18px 22px;border-bottom:1px solid var(--border);background:var(--txt);display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;}
        .rp-topbar-eyebrow{font-size:0.62rem;font-weight:800;color:#93C5FD;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:5px;}
        .rp-topbar-title{font-size:1.15rem;font-weight:800;color:#fff;letter-spacing:-0.03em;}
        .rp-topbar-route{font-size:0.76rem;color:#94A3B8;margin-top:3px;}

        .rp-tabs{display:flex;gap:4px;padding:12px 16px;border-bottom:1px solid var(--border);background:var(--bg);}
        .rp-tab{padding:7px 16px;border-radius:8px;border:1px solid transparent;font-size:0.76rem;font-weight:700;cursor:pointer;transition:all 0.15s;color:var(--txt3);background:transparent;font-family:'Plus Jakarta Sans',sans-serif;}
        .rp-tab.active{background:var(--white);border-color:var(--border);color:var(--txt);box-shadow:0 1px 3px rgba(0,0,0,0.06);}
        .rp-tab:hover:not(.active){background:var(--white);color:var(--txt2);}

        .rp-map-wrap{padding:18px;}
        .rp-map-frame{width:100%;height:420px;border:none;border-radius:10px;display:block;}
        .rp-map-placeholder{width:100%;height:420px;border-radius:10px;border:1.5px dashed var(--border2);background:var(--bg);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;color:var(--txt4);text-align:center;padding:40px;}
        .rp-placeholder-icon{font-size:2.8rem;opacity:0.35;}
        .rp-placeholder-txt{font-size:0.85rem;line-height:1.7;max-width:320px;font-weight:500;}

        .rp-skeleton{background:linear-gradient(90deg,var(--bg) 25%,var(--border) 50%,var(--bg) 75%);background-size:800px 100%;animation:shimmer 1.4s infinite linear;border-radius:8px;}

        .rp-insights-shell{display:flex;flex-direction:column;}
        .rp-insight-tabs{display:flex;gap:3px;padding:10px 14px;border-bottom:1px solid var(--border);background:var(--bg);flex-wrap:wrap;}
        .rp-itab{padding:6px 14px;border-radius:7px;border:1px solid transparent;font-size:0.72rem;font-weight:700;cursor:pointer;transition:all 0.15s;color:var(--txt3);background:transparent;font-family:'Plus Jakarta Sans',sans-serif;}
        .rp-itab.active{background:var(--white);border-color:var(--border);color:var(--txt);box-shadow:0 1px 3px rgba(0,0,0,0.06);}
        .rp-itab:hover:not(.active){background:var(--white);color:var(--txt2);}
        .rp-insights{padding:16px 18px 18px;animation:slideIn 0.3s ease;}

        .rp-loading-wrap{padding:48px 20px;display:flex;flex-direction:column;align-items:center;gap:14px;}
        .rp-spinner{width:32px;height:32px;border:2.5px solid var(--border);border-top-color:var(--blue);border-radius:50%;animation:spin 0.75s linear infinite;}
        .rp-loading-txt{font-size:0.82rem;color:var(--txt3);font-weight:600;text-align:center;max-width:280px;line-height:1.6;}
        .rp-skeleton-panel{padding:0 18px 18px;display:flex;flex-direction:column;gap:12px;}
        .rp-skel-row{display:flex;gap:10px;}
        .rp-skel-box{border-radius:10px;}

        .rp-metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:14px;}
        .rp-metric{background:var(--bg);border:1px solid var(--border);border-radius:12px;padding:16px;animation:fadeUp 0.4s ease both;}
        .rp-metric-icon{font-size:1.2rem;margin-bottom:8px;}
        .rp-metric-val{font-size:1.3rem;font-weight:800;color:var(--txt);letter-spacing:-0.04em;line-height:1;}
        .rp-metric-lbl{font-size:0.6rem;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--txt4);margin-top:4px;}
        .rp-eff-bar-bg{height:5px;border-radius:999px;background:var(--border);overflow:hidden;margin-top:10px;}
        .rp-eff-bar-fill{height:100%;border-radius:999px;background:linear-gradient(90deg,var(--blue),var(--green));transition:width 1.2s cubic-bezier(0.16,1,0.3,1);}
        .rp-risk-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:999px;font-size:0.62rem;font-weight:800;letter-spacing:0.06em;border:1px solid;margin-top:9px;}

        .rp-summary{background:var(--txt);border-radius:12px;padding:18px 20px;margin-bottom:12px;animation:fadeUp 0.4s 0.1s ease both;}
        .rp-summary-lbl{font-size:0.6rem;font-weight:800;color:#93C5FD;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:10px;}
        .rp-summary-txt{font-size:0.84rem;color:rgba(255,255,255,0.85);line-height:1.8;}

        .rp-info-row{display:flex;align-items:flex-start;gap:10px;padding:12px 16px;border-radius:10px;border:1px solid;margin-bottom:10px;animation:fadeUp 0.4s ease both;}
        .rp-info-icon{font-size:1.1rem;flex-shrink:0;margin-top:1px;}
        .rp-info-lbl{font-size:0.6rem;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:3px;}
        .rp-info-txt{font-size:0.8rem;font-weight:600;line-height:1.5;}

        .rp-chips{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:14px;}
        .rp-chip{background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:12px 14px;display:flex;flex-direction:column;gap:4px;}
        .rp-chip-lbl{font-size:0.6rem;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--txt4);}
        .rp-chip-val{font-size:0.88rem;font-weight:800;color:var(--txt);letter-spacing:-0.02em;}

        .rp-finance-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:14px;}
        .rp-finance-card{border-radius:12px;padding:18px;border:1px solid;}
        .rp-finance-icon{font-size:1.3rem;margin-bottom:8px;}
        .rp-finance-val{font-size:1.6rem;font-weight:900;letter-spacing:-0.05em;line-height:1;}
        .rp-finance-lbl{font-size:0.62rem;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;margin-top:5px;}
        .rp-finance-note{font-size:0.68rem;margin-top:4px;opacity:0.7;}
        .rp-cost-breakdown{background:var(--bg);border:1px solid var(--border);border-radius:12px;padding:16px 18px;margin-bottom:12px;}
        .rp-cost-row{display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);}
        .rp-cost-row:last-child{border-bottom:none;font-weight:800;padding-top:10px;}
        .rp-cost-key{font-size:0.78rem;color:var(--txt2);font-weight:500;display:flex;align-items:center;gap:6px;}
        .rp-cost-val{font-size:0.82rem;font-weight:700;color:var(--txt);}

        .rp-step-list{display:flex;flex-direction:column;gap:10px;margin-bottom:14px;}
        .rp-step-item{display:flex;align-items:flex-start;gap:12px;padding:12px 14px;background:var(--bg);border:1px solid var(--border);border-radius:10px;animation:fadeUp 0.4s ease both;}
        .rp-step-num{width:24px;height:24px;border-radius:50%;background:var(--blue);color:white;font-size:0.68rem;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;}
        .rp-step-txt{font-size:0.8rem;color:var(--txt2);line-height:1.6;font-weight:500;}
        .rp-stops-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
        .rp-stop-card{background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:12px 14px;}
        .rp-stop-lbl{font-size:0.6rem;font-weight:800;text-transform:uppercase;letter-spacing:0.07em;color:var(--txt4);margin-bottom:6px;}
        .rp-stop-item{font-size:0.76rem;font-weight:600;color:var(--txt2);padding:3px 0;display:flex;align-items:center;gap:6px;}
        .rp-stop-empty{font-size:0.72rem;color:var(--txt4);font-weight:500;padding:4px 0;}

        .rp-cond-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;}
        .rp-incident-list{display:flex;flex-direction:column;gap:8px;margin-bottom:12px;}
        .rp-incident-item{display:flex;align-items:flex-start;gap:10px;padding:10px 14px;border-radius:10px;border:1px solid;}
        .rp-incident-txt{font-size:0.78rem;font-weight:600;line-height:1.5;}
        .rp-incident-meta{font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:2px;}

        @media(max-width:1000px){.rp-grid{grid-template-columns:1fr;}.rp-sidebar{position:relative;top:0;}}
        @media(max-width:700px){
          .rp-page{padding:20px 4%;}
          .rp-metrics{grid-template-columns:repeat(2,1fr);}
          .rp-chips{grid-template-columns:repeat(2,1fr);}
          .rp-finance-grid{grid-template-columns:1fr;}
          .rp-stops-grid{grid-template-columns:1fr;}
          .rp-cond-grid{grid-template-columns:1fr;}
          .rp-topbar{flex-direction:column;align-items:flex-start;gap:10px;}
        }
      `}</style>

      <div className="rp-page">

        {/* ── HEADER ── */}
        <div className="rp-header">
          <div>
            <div className="rp-eyebrow"><span className="rp-live-dot" /> AI Route Planner</div>
            <div className="rp-title">LoadOps <em>Route Intelligence</em></div>
            <div className="rp-sub">Type your route — live data analyzes as you type. No button needed.</div>
          </div>
          <button className="rp-back-btn" onClick={() => router.push("/platform")}>← Back to Load Board</button>
        </div>

        {/* ── STATS ── */}
        <div className="rp-stats-row">
          {[
            { n: "97%",  cls: "blue",   label: "Route Accuracy"  },
            { n: "18%",  cls: "green",  label: "Avg Fuel Savings" },
            { n: "2.4M", cls: "purple", label: "Miles Analyzed"   },
            { n: "24/7", cls: "amber",  label: "Live Monitoring"  },
          ].map(s => (
            <div className="rp-stat" key={s.label}>
              <div className={`rp-stat-n ${s.cls}`}>{s.n}</div>
              <div className="rp-stat-l">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── GRID ── */}
        <div className="rp-grid">

          {/* ── SIDEBAR ── */}
          <div className="rp-sidebar">
            <div className="rp-sidebar-head">
              <div className="rp-sidebar-eyebrow">🗺 Plan Your Route</div>
              <div className="rp-sidebar-title">Live Route Intelligence</div>
              <div className="rp-sidebar-sub">Results update automatically as you type — no button required.</div>
            </div>

            {hasRoute && (
              <div className="rp-live-hint">
                <span style={{ fontSize: "0.75rem" }}>⚡</span>
                {aiLoading
                  ? "Pulling live route, weather, stops & traffic data…"
                  : resultsReady
                  ? "Live results active — edit any field to refresh"
                  : "Analyzing…"}
              </div>
            )}

            <div className="rp-form">
              <div>
                <label className="rp-label">Pickup Location *</label>
                <div className="rp-iw"><span className="rp-ii">📍</span>
                  <input type="text" placeholder="Dallas, TX" value={pickup}
                    onChange={e => setPickup(e.target.value)}
                    className={`rp-input${hasRoute && resultsReady ? " live-ready" : ""}`} />
                </div>
              </div>

              <div>
                <label className="rp-label">Delivery Location *</label>
                <div className="rp-iw"><span className="rp-ii">🏁</span>
                  <input type="text" placeholder="Chicago, IL" value={delivery}
                    onChange={e => setDelivery(e.target.value)}
                    className={`rp-input${hasRoute && resultsReady ? " live-ready" : ""}`} />
                </div>
              </div>

              <div>
                <label className="rp-label">Equipment Type</label>
                <div className="rp-iw"><span className="rp-ii">🚛</span>
                  <select value={equipment} onChange={e => setEquipment(e.target.value)} className="rp-input">
                    {EQUIPMENT_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="rp-label">Expected Load Rate ($)</label>
                <div className="rp-iw"><span className="rp-ii">💵</span>
                  <input type="number" placeholder="2400" value={rate}
                    onChange={e => setRate(e.target.value)} className="rp-input" />
                </div>
              </div>

              <div className="rp-input-grid">
                <div>
                  <label className="rp-label">Planned Stops</label>
                  <div className="rp-iw"><span className="rp-ii">🛑</span>
                    <select value={stops} onChange={e => setStops(e.target.value)} className="rp-input">
                      {[0,1,2,3,4,5].map(n => <option key={n} value={n}>{n === 0 ? "Direct" : `${n} stop${n>1?"s":""}`}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="rp-label">Load Weight (lbs)</label>
                  <div className="rp-iw"><span className="rp-ii">⚖️</span>
                    <input type="number" placeholder="44000" value={weight}
                      onChange={e => setWeight(e.target.value)} className="rp-input" />
                  </div>
                </div>
              </div>

              <div>
                <label className="rp-label">Fuel Budget (USD)</label>
                <div className="rp-iw"><span className="rp-ii">⛽</span>
                  <input type="number" placeholder="800" value={fuel}
                    onChange={e => setFuel(e.target.value)} className="rp-input" />
                </div>
              </div>

              {error && <div className="rp-error">⚠ {error}</div>}

              <div style={{ display: "flex", justifyContent: "center", paddingTop: 2 }}>
                <LiveBadge status={liveStatus} />
              </div>
            </div>

            <div className="rp-sidebar-footer">
              <button className={`rp-ghost-btn${savedRoute ? " saved" : ""}`}
                onClick={() => setSavedRoute(v => !v)} disabled={!resultsReady}>
                {savedRoute ? "★ Route Saved" : "☆ Save This Route"}
              </button>
              <button className="rp-ghost-btn purple"
                disabled={!resultsReady || aiLoading}
                onClick={() => { setActiveTab("insights"); setActiveInsightTab("financials"); }}>
                💵 View Financials
              </button>
            </div>
          </div>

          {/* ── MAIN PANEL ── */}
          <div className="rp-main">

            <div className="rp-topbar">
              <div>
                <div className="rp-topbar-eyebrow">LIVE ROUTE ANALYSIS</div>
                <div className="rp-topbar-title">AI Route Intelligence</div>
                {lastAnalyzed && (
                  <div className="rp-topbar-route">{lastAnalyzed}{equipment ? ` · ${equipment}` : ""}{rate ? ` · $${Number(rate).toLocaleString()} rate` : ""}</div>
                )}
              </div>
              <LiveBadge status={liveStatus} />
            </div>

            {hasRoute && (
              <div className="rp-tabs">
                <button className={`rp-tab${activeTab === "map" ? " active" : ""}`} onClick={() => setActiveTab("map")}>
                  🗺 Route Map
                </button>
                <button className={`rp-tab${activeTab === "insights" ? " active" : ""}`} onClick={() => setActiveTab("insights")}>
                  🤖 AI Insights {aiLoading ? "…" : resultsReady ? "✓" : ""}
                </button>
              </div>
            )}

            {/* MAP TAB */}
            {(!hasRoute || activeTab === "map") && (
              <div className="rp-map-wrap">
                {hasRoute ? (
                  <iframe className="rp-map-frame" loading="lazy" src={mapSrc} title="Route Map" />
                ) : (
                  <div className="rp-map-placeholder">
                    <span className="rp-placeholder-icon">🗺</span>
                    <p className="rp-placeholder-txt">Start typing a pickup and delivery location — your live freight route will appear automatically.</p>
                  </div>
                )}
              </div>
            )}

            {/* INSIGHTS TAB */}
            {hasRoute && activeTab === "insights" && (
              <div className="rp-insights-shell">

                {resultsReady && !aiLoading && (
                  <div className="rp-insight-tabs">
                    {insightTabs.map(t => (
                      <button key={t.key} className={`rp-itab${activeInsightTab === t.key ? " active" : ""}`} onClick={() => setActiveInsightTab(t.key)}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* LOADING SKELETON */}
                {aiLoading && (
                  <div className="rp-loading-wrap">
                    <div className="rp-spinner" />
                    <div className="rp-loading-txt">
                      Pulling live route, weather, stops & traffic data for<br />
                      <strong style={{ color: "var(--txt)" }}>{pickup} → {delivery}</strong>
                    </div>
                    <div className="rp-skeleton-panel" style={{ width: "100%" }}>
                      <div className="rp-skel-row">
                        <div className="rp-skel-box rp-skeleton" style={{ height: 80, flex: 1 }} />
                        <div className="rp-skel-box rp-skeleton" style={{ height: 80, flex: 1 }} />
                        <div className="rp-skel-box rp-skeleton" style={{ height: 80, flex: 1 }} />
                      </div>
                      <div className="rp-skel-box rp-skeleton" style={{ height: 100, width: "100%" }} />
                      <div className="rp-skel-row">
                        <div className="rp-skel-box rp-skeleton" style={{ height: 50, flex: 1 }} />
                        <div className="rp-skel-box rp-skeleton" style={{ height: 50, flex: 1 }} />
                        <div className="rp-skel-box rp-skeleton" style={{ height: 50, flex: 1 }} />
                      </div>
                    </div>
                  </div>
                )}

                {/* RESULTS */}
                {!aiLoading && resultsReady && aiInsights && (

                  // ── OVERVIEW ──────────────────────────────────────────────
                  activeInsightTab === "overview" ? (
                    <div className="rp-insights" key="overview">
                      <div className="rp-metrics">
                        {[
                          { icon: "📏", val: googleData ? <><AnimatedNumber target={googleData.distanceMiles} /><span style={{fontSize:"0.78rem",color:"var(--txt3)"}}> mi</span></> : "—", lbl: "Distance (Google)" },
                          { icon: "⏱",  val: googleData ? <><AnimatedNumber target={googleData.driveHours} decimals={1} /><span style={{fontSize:"0.78rem",color:"var(--txt3)"}}> hrs</span></> : "—", lbl: "Drive Time (Google)" },
                          { icon: "⛽", val: googleData ? <><span style={{fontSize:"0.8rem"}}>$</span><AnimatedNumber target={googleData.economics.fuelCostUSD} /></> : "—", lbl: "Fuel Cost" },
                          { icon: "🛣️",val: googleData ? <><span style={{fontSize:"0.8rem"}}>$</span><AnimatedNumber target={googleData.economics.estimatedTollUSD} /></> : "—", lbl: "Toll Cost" },
                          { icon: "💵", val: financials ? <><span style={{fontSize:"0.8rem"}}>$</span><AnimatedNumber target={financials.rpm} decimals={2} /><span style={{fontSize:"0.78rem",color:"var(--txt3)"}}>/mi</span></> : "—", lbl: "Rate Per Mile" },
                          { icon: "🎯", val: null, lbl: "Opportunity Score", isEff: true },
                        ].map((m, i) => (
                          <div className="rp-metric" key={m.lbl} style={{ animationDelay: `${i * 0.05}s` }}>
                            <div className="rp-metric-icon">{m.icon}</div>
                            {m.isEff ? (
                              <>
                                <div className="rp-metric-val"><AnimatedNumber target={aiInsights.efficiency} /><span style={{fontSize:"0.8rem",color:"var(--txt3)"}}>/100</span></div>
                                <div className="rp-metric-lbl">{m.lbl}</div>
                                <div className="rp-eff-bar-bg"><div className="rp-eff-bar-fill" style={{ width: `${aiInsights.efficiency}%` }} /></div>
                                <div className="rp-risk-badge" style={{ background: riskStyle[aiInsights.risk]?.bg, color: riskStyle[aiInsights.risk]?.color, borderColor: riskStyle[aiInsights.risk]?.border }}>
                                  ⚠ {aiInsights.risk} Risk
                                </div>
                              </>
                            ) : (
                              <><div className="rp-metric-val">{m.val}</div><div className="rp-metric-lbl">{m.lbl}</div></>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="rp-summary">
                        <div className="rp-summary-lbl">🤖 AI Dispatcher Assistant — {pickup} → {delivery}</div>
                        <div className="rp-summary-txt"><Typewriter text={aiInsights.summary} /></div>
                      </div>

                      <div className="rp-info-row" style={{ background: "var(--blue-l)", borderColor: "var(--blue-m)" }}>
                        <span className="rp-info-icon">🧭</span>
                        <div>
                          <div className="rp-info-lbl" style={{ color: "#1E40AF" }}>Dispatcher Recommendation</div>
                          <div className="rp-info-txt" style={{ color: "#1E3A8A" }}>{aiInsights.dispatcher_recommendation}</div>
                        </div>
                      </div>

                      <div className="rp-info-row" style={{ background: "var(--amber-l)", borderColor: "#FDE68A" }}>
                        <span className="rp-info-icon">💡</span>
                        <div>
                          <div className="rp-info-lbl" style={{ color: "#92400E" }}>Fuel Strategy Tip</div>
                          <div className="rp-info-txt" style={{ color: "#78350F" }}>{aiInsights.fuel_strategy_tip}</div>
                        </div>
                      </div>

                      <div className="rp-chips">
                        <div className="rp-chip"><div className="rp-chip-lbl">HOS Breaks (Google)</div><div className="rp-chip-val">{googleData ? `${googleData.compliance.requiredBreaks} stop${googleData.compliance.requiredBreaks !== 1 ? "s" : ""}` : "—"}</div></div>
                        <div className="rp-chip"><div className="rp-chip-lbl">Border Cross</div><div className="rp-chip-val" style={{ color: googleData?.crossesBorder ? "var(--amber)" : "var(--green)" }}>{googleData ? (googleData.crossesBorder ? "⚠ Yes" : "✓ No") : "—"}</div></div>
                        <div className="rp-chip"><div className="rp-chip-lbl">Best Depart</div><div className="rp-chip-val" style={{ fontSize: "0.72rem" }}>{aiInsights.best_depart_time}</div></div>
                        <div className="rp-chip"><div className="rp-chip-lbl">Top Fuel Stop</div><div className="rp-chip-val" style={{ fontSize: "0.72rem" }}>{stopsData?.fuelStops?.[0]?.name || "No live data"}</div></div>
                        <div className="rp-chip"><div className="rp-chip-lbl">Backhaul</div><div className="rp-chip-val" style={{ color: backhaulStyle[aiInsights.backhaul_chance]?.color }}>{aiInsights.backhaul_chance}</div></div>
                        <div className="rp-chip"><div className="rp-chip-lbl">Road Conditions</div><div className="rp-chip-val" style={{ fontSize: "0.72rem", color: congestionLevel?.color }}>{congestionLevel ? `${congestionLevel.label} traffic` : "No live data"}</div></div>
                      </div>
                    </div>

                  // ── FINANCIALS ────────────────────────────────────────────
                  ) : activeInsightTab === "financials" ? (
                    <div className="rp-insights" key="financials">
                      <div className="rp-finance-grid">
                        <div className="rp-finance-card" style={{ background: "var(--green-l)", borderColor: "var(--green-m)" }}>
                          <div className="rp-finance-icon">💰</div>
                          <div className="rp-finance-val" style={{ color: "var(--green)" }}>$<AnimatedNumber target={financials?.estimatedRevenue ?? 0} /></div>
                          <div className="rp-finance-lbl" style={{ color: "#166534" }}>Estimated Revenue</div>
                          <div className="rp-finance-note" style={{ color: "#166534" }}>Based on {rate ? `your $${Number(rate).toLocaleString()} rate` : "market average for this lane"}</div>
                        </div>
                        <div className="rp-finance-card" style={{ background: (financials?.netProfit ?? 0) > 0 ? "var(--blue-l)" : "var(--red-l)", borderColor: (financials?.netProfit ?? 0) > 0 ? "var(--blue-m)" : "#FEE2E2" }}>
                          <div className="rp-finance-icon">📈</div>
                          <div className="rp-finance-val" style={{ color: (financials?.netProfit ?? 0) > 0 ? "var(--blue)" : "var(--red)" }}>
                            {(financials?.netProfit ?? 0) < 0 ? "-" : ""}$<AnimatedNumber target={Math.abs(financials?.netProfit ?? 0)} />
                          </div>
                          <div className="rp-finance-lbl" style={{ color: (financials?.netProfit ?? 0) > 0 ? "var(--blue)" : "var(--red)" }}>Net Profit Est.</div>
                          <div className="rp-finance-note" style={{ color: (financials?.netProfit ?? 0) > 0 ? "var(--blue)" : "var(--red)" }}>After fuel, tolls & driver cost</div>
                        </div>
                      </div>

                      <div className="rp-cost-breakdown">
                        <div style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--txt4)", marginBottom: 10 }}>Cost Breakdown</div>
                        {googleData && financials ? [
                          { icon: "⛽",  label: "Fuel Cost",        val: googleData.economics.fuelCostUSD,                                  color: "var(--txt)"  },
                          { icon: "🛣️", label: "Toll Cost",        val: googleData.economics.estimatedTollUSD,                             color: "var(--txt)"  },
                          { icon: "👤",  label: "Est. Driver Cost", val: 150,                                                               color: "var(--txt)"  },
                          { icon: "📊",  label: "Total Expenses",   val: googleData.economics.fuelCostUSD + googleData.economics.estimatedTollUSD + 150, color: "var(--red)"  },
                          { icon: "💵",  label: "Net Profit",       val: financials.netProfit,                                              color: financials.netProfit > 0 ? "var(--green)" : "var(--red)" },
                        ].map((row, i) => (
                          <div className="rp-cost-row" key={row.label} style={{ borderBottom: i < 3 ? "1px solid var(--border)" : "none" }}>
                            <span className="rp-cost-key"><span>{row.icon}</span>{row.label}</span>
                            <span className="rp-cost-val" style={{ color: row.color }}>${Math.abs(row.val).toLocaleString()}</span>
                          </div>
                        )) : (
                          <div className="rp-stop-empty">Live route cost data is unavailable for this route.</div>
                        )}
                      </div>

                      <div className="rp-chips">
                        <div className="rp-chip"><div className="rp-chip-lbl">Profit Margin</div><div className="rp-chip-val" style={{ color: "var(--green)" }}>{financials?.margin ?? "—"}</div></div>
                        <div className="rp-chip"><div className="rp-chip-lbl">Rate Per Mile</div><div className="rp-chip-val">{financials ? `$${financials.rpm.toFixed(2)}` : "—"}</div></div>
                        <div className="rp-chip"><div className="rp-chip-lbl">Load Density</div><div className="rp-chip-val" style={{ fontSize: "0.68rem" }}>{aiInsights.load_density}</div></div>
                        <div className="rp-chip"><div className="rp-chip-lbl">Backhaul</div><div className="rp-chip-val" style={{ color: backhaulStyle[aiInsights.backhaul_chance]?.color }}>{aiInsights.backhaul_chance} chance</div></div>
                        <div className="rp-chip"><div className="rp-chip-lbl">Seasonal Note</div><div className="rp-chip-val" style={{ fontSize: "0.65rem", lineHeight: 1.4 }}>{aiInsights.seasonal_note}</div></div>
                        <div className="rp-chip"><div className="rp-chip-lbl">Distance</div><div className="rp-chip-val">{googleData ? `${googleData.distanceMiles.toLocaleString()} mi` : "—"}</div></div>
                      </div>
                    </div>

                  // ── NAVIGATION ────────────────────────────────────────────
                  ) : activeInsightTab === "navigation" ? (
                    <div className="rp-insights" key="navigation">
                      <div style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--txt4)", marginBottom: 12 }}>
                        Turn-by-Turn Route (Google) — {pickup} → {delivery}
                      </div>
                      <div className="rp-step-list">
                        {googleData?.steps?.length ? googleData.steps.map((step, i) => (
                          <div className="rp-step-item" key={i} style={{ animationDelay: `${i * 0.07}s` }}>
                            <div className="rp-step-num">{i + 1}</div>
                            <div className="rp-step-txt">{step}</div>
                          </div>
                        )) : (
                          <div className="rp-stop-empty">Detailed turn-by-turn directions aren't available for this route — see the Route Map tab for the full path.</div>
                        )}
                      </div>

                      <div className="rp-info-row" style={{ background: "var(--blue-l)", borderColor: "var(--blue-m)" }}>
                        <span className="rp-info-icon">🛤️</span>
                        <div>
                          <div className="rp-info-lbl" style={{ color: "#1E40AF" }}>Alternative Route</div>
                          <div className="rp-info-txt" style={{ color: "#1E3A8A" }}>
                            {googleData?.alternativeRoute
                              ? `${googleData.alternativeRoute.summary} (${googleData.alternativeRoute.extraMinutes > 0 ? "+" : ""}${googleData.alternativeRoute.extraMinutes} min). `
                              : ""}
                            {aiInsights.alt_route_commentary}
                          </div>
                        </div>
                      </div>

                      <div className="rp-stops-grid">
                        <div className="rp-stop-card">
                          <div className="rp-stop-lbl">🛏 Rest Areas (OpenStreetMap)</div>
                          {stopsData?.restStops?.length ? stopsData.restStops.map((s, i) => (
                            <div className="rp-stop-item" key={i}><span>📍</span>{s.name}{s.address ? ` — ${s.address}` : ""}</div>
                          )) : (
                            <div className="rp-stop-empty">No live rest stop data available for this route.</div>
                          )}
                        </div>
                        <div className="rp-stop-card">
                          <div className="rp-stop-lbl">⛽ Truck-Friendly Fuel Stops (OpenStreetMap)</div>
                          {stopsData?.fuelStops?.length ? (
                            <>
                              {stopsData.fuelStops.map((s, i) => (
                                <div className="rp-stop-item" key={i}><span>⛽</span>{s.brand || s.name}{s.address ? ` — ${s.address}` : ""}</div>
                              ))}
                              <div className="rp-stop-item" style={{ marginTop: 6, paddingTop: 6, borderTop: "1px solid var(--border)" }}>
                                <span>🏆</span><span style={{ color: "var(--green)", fontWeight: 700 }}>Best: {stopsData.fuelStops[0].brand || stopsData.fuelStops[0].name}</span>
                              </div>
                            </>
                          ) : (
                            <div className="rp-stop-empty">No live fuel stop data available for this route.</div>
                          )}
                        </div>
                      </div>
                    </div>

                  // ── CONDITIONS ────────────────────────────────────────────
                  ) : (
                    <div className="rp-insights" key="conditions">
                      <div className="rp-cond-grid">
                        <div className="rp-info-row" style={{ background: "var(--blue-l)", borderColor: "var(--blue-m)", marginBottom: 0 }}>
                          <span className="rp-info-icon">🌤️</span>
                          <div>
                            <div className="rp-info-lbl" style={{ color: "#1E40AF" }}>Pickup Weather (OpenWeather)</div>
                            <div className="rp-info-txt" style={{ color: "#1E3A8A" }}>
                              {weatherData?.pickup
                                ? `${weatherData.pickup.location}: ${weatherData.pickup.condition}, ${weatherData.pickup.tempF}°F, wind ${weatherData.pickup.windMph} mph${weatherData.pickup.alert ? ` — ⚠ ${weatherData.pickup.alert}` : ""}`
                                : "No live weather data available for pickup."}
                            </div>
                          </div>
                        </div>
                        <div className="rp-info-row" style={{ background: "var(--blue-l)", borderColor: "var(--blue-m)", marginBottom: 0 }}>
                          <span className="rp-info-icon">🌤️</span>
                          <div>
                            <div className="rp-info-lbl" style={{ color: "#1E40AF" }}>Delivery Weather (OpenWeather)</div>
                            <div className="rp-info-txt" style={{ color: "#1E3A8A" }}>
                              {weatherData?.delivery
                                ? `${weatherData.delivery.location}: ${weatherData.delivery.condition}, ${weatherData.delivery.tempF}°F, wind ${weatherData.delivery.windMph} mph${weatherData.delivery.alert ? ` — ⚠ ${weatherData.delivery.alert}` : ""}`
                                : "No live weather data available for delivery."}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="rp-info-row" style={{ background: riskStyle[aiInsights.risk]?.bg, borderColor: riskStyle[aiInsights.risk]?.border }}>
                        <span className="rp-info-icon">⚠️</span>
                        <div>
                          <div className="rp-info-lbl" style={{ color: riskStyle[aiInsights.risk]?.color }}>Risk · {aiInsights.risk}</div>
                          <div className="rp-info-txt" style={{ color: riskStyle[aiInsights.risk]?.color }}>{aiInsights.risk_note}</div>
                        </div>
                      </div>

                      <div style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--txt4)", margin: "14px 0 10px" }}>
                        Road Conditions (TomTom Traffic)
{trafficData
  ? `— Current ${trafficData.currentSpeed} km/h • Free Flow ${trafficData.freeFlowSpeed} km/h${congestionLevel ? ` • ${congestionLevel.label} traffic` : ""}`
  : ""}
                      </div>
                      <div className="rp-incident-list">
  {trafficData ? (
    <>
      <div className="rp-incident-item">
        <strong>🚗 Current Speed:</strong> {trafficData.currentSpeed} km/h
      </div>

      <div className="rp-incident-item">
        <strong>🛣 Free Flow Speed:</strong> {trafficData.freeFlowSpeed} km/h
      </div>

      <div className="rp-incident-item">
        <strong>⏱ Travel Time:</strong> {trafficData.currentTravelTime} sec
      </div>

      <div className="rp-incident-item">
        <strong>🚧 Road Closure:</strong>{" "}
        {trafficData.roadClosure ? "Yes" : "No"}
      </div>
    </>
  ) : (
    <div className="rp-stop-empty">No live traffic data available.</div>
  )}
</div>

                      <div className="rp-info-row" style={{ background: "var(--purple-l)", borderColor: "var(--purple-m)" }}>
                        <span className="rp-info-icon">📅</span>
                        <div>
                          <div className="rp-info-lbl" style={{ color: "var(--purple)" }}>Seasonal Intelligence</div>
                          <div className="rp-info-txt" style={{ color: "var(--purple)" }}>{aiInsights.seasonal_note}</div>
                        </div>
                      </div>

                      <div className="rp-info-row" style={{ background: "var(--amber-l)", borderColor: "#FDE68A" }}>
                        <span className="rp-info-icon">📋</span>
                        <div>
                          <div className="rp-info-lbl" style={{ color: "#92400E" }}>HOS Guidance</div>
                          <div className="rp-info-txt" style={{ color: "#78350F" }}>{aiInsights.hos_guidance}</div>
                        </div>
                      </div>

                      <div className="rp-chips">
                        <div className="rp-chip"><div className="rp-chip-lbl">Best Depart</div><div className="rp-chip-val" style={{ fontSize: "0.72rem", lineHeight: 1.4 }}>{aiInsights.best_depart_time}</div></div>
                        <div className="rp-chip"><div className="rp-chip-lbl">HOS Breaks</div><div className="rp-chip-val">{googleData ? `${googleData.compliance.requiredBreaks} required` : "—"}</div></div>
                        <div className="rp-chip"><div className="rp-chip-lbl">Border Cross</div><div className="rp-chip-val" style={{ color: googleData?.crossesBorder ? "var(--amber)" : "var(--green)" }}>{googleData ? (googleData.crossesBorder ? "⚠ Required" : "✓ Not needed") : "—"}</div></div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
