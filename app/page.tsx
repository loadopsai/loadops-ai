"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

type Load = {
  id: string;
  company_name: string;
  contact?: string;
  email?: string;
  pickup_location: string;
  delivery_location: string;
  equipment: string;
  load_type?: string;
  weight?: string;
  total_rate: string;
  mc_number?: string;
  usdot?: string;
  pickup_date?: string;
  delivery_date?: string;
  description?: string;
  status: string;
  distance?: string;
  broker_verified?: boolean;
  created_at?: string;
};

const FALLBACK_LOADS: Load[] = [
  { id: "fallback-1", company_name: "Coyote Logistics", pickup_location: "Dallas, TX", delivery_location: "Chicago, IL", distance: "1042", pickup_date: "2026-06-18", equipment: "Dry Van", weight: "42000", total_rate: "2840", broker_verified: true, status: "available" },
  { id: "fallback-2", company_name: "Echo Global", pickup_location: "Atlanta, GA", delivery_location: "Miami, FL", distance: "662", pickup_date: "2026-06-19", equipment: "Reefer", weight: "38500", total_rate: "2210", broker_verified: true, status: "available" },
  { id: "fallback-3", company_name: "XPO Logistics", pickup_location: "Los Angeles, CA", delivery_location: "Phoenix, AZ", distance: "370", pickup_date: "2026-06-19", equipment: "FlatBed", weight: "44800", total_rate: "1480", broker_verified: true, status: "available" },
  { id: "fallback-4", company_name: "CH Robinson", pickup_location: "Houston, TX", delivery_location: "Nashville, TN", distance: "890", pickup_date: "2026-06-20", equipment: "Dry Van", weight: "40200", total_rate: "2670", broker_verified: false, status: "available" },
];

const EQ_CLASS: Record<string, string> = {
  "Dry Van": "eq-v",
  "Reefer": "eq-r",
  "FlatBed": "eq-f",
  "Flatbed": "eq-f",
  "Box Truck": "eq-v",
  "Sprinter/Cargo Van": "eq-v",
  "Tanker": "eq-f",
  "Step Deck": "eq-f",
  "HotShot": "eq-f",
  "Power Only": "eq-v",
};

const cap = (text?: string) => {
  if (!text) return "";
  return text.toLowerCase().split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
};

export default function Home() {
  const router = useRouter();

  const [loads, setLoads] = useState<Load[]>([]);
  const [loadsLoading, setLoadsLoading] = useState(true);
  const [totalLoadCount, setTotalLoadCount] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [equipmentFilter, setEquipmentFilter] = useState("All Equipment");
  const [distanceFilter, setDistanceFilter] = useState("Any Distance");
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [bookedIds, setBookedIds] = useState<string[]>([]);
  const [toast, setToast] = useState("");

  // ── Fetch live loads from the same `loads` table the load board uses ──
  useEffect(() => {
    let channel: any;

    const fetchLoads = async () => {
      setLoadsLoading(true);
      const { data, error, count } = await supabase
        .from("loads")
        .select("*", { count: "exact" })
        .eq("status", "available")
        .order("created_at", { ascending: false })
        .limit(25);

      if (!error && data && data.length > 0) {
        setLoads(data as Load[]);
        setTotalLoadCount(count ?? data.length);
      } else {
        setLoads(FALLBACK_LOADS);
        setTotalLoadCount(48241);
      }
      setLoadsLoading(false);
    };

    fetchLoads();

    channel = supabase
      .channel("home-live-loadboard")
      .on("postgres_changes", { event: "*", schema: "public", table: "loads" }, () => {
        fetchLoads();
      })
      .subscribe();

    return () => { if (channel) supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  // ── Book Now → same load_bookings flow as the platform page ──
  const handleBook = async (load: Load) => {
    if (!load.id || bookingId) return;
    setBookingId(load.id);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push(`/signup?role=carrier&redirect=loadboard`);
        return;
      }

      const { error: bookingError } = await supabase.from("load_bookings").insert([{
        load_id: load.id,
        carrier_name: user.email ?? "Carrier",
        mc_number: "",
        phone: "",
        email: user.email ?? "",
        truck_type: load.equipment,
        message: "",
        status: "pending",
      }]);

      if (bookingError) console.log(bookingError.message);

      setBookedIds(prev => [...prev, load.id]);
      setToast(`Booking request sent · ${cap(load.pickup_location)} → ${cap(load.delivery_location)}`);

      setTimeout(() => {
        router.push(`/platform?booked=${load.id}`);
      }, 1200);
    } catch {
      setToast("Couldn't complete booking — please try again.");
    } finally {
      setBookingId(null);
    }
  };

  const handleViewLoad = (load: Load) => {
    router.push(`/platform${load.id ? `?load=${load.id}` : ""}`);
  };

  // ── Filtering ──
  const filteredLoads = loads.filter((row) => {
    const matchesSearch =
      !search ||
      row.pickup_location?.toLowerCase().includes(search.toLowerCase()) ||
      row.delivery_location?.toLowerCase().includes(search.toLowerCase()) ||
      row.company_name?.toLowerCase().includes(search.toLowerCase());

    const matchesEquipment =
      equipmentFilter === "All Equipment" || row.equipment === equipmentFilter;

    const dist = Number(row.distance || 0);
    const matchesDistance =
      distanceFilter === "Any Distance" ||
      (distanceFilter === "Under 500mi" && dist < 500) ||
      (distanceFilter === "500–1000mi" && dist >= 500 && dist <= 1000) ||
      (distanceFilter === "1000mi+" && dist > 1000);

    return matchesSearch && matchesEquipment && matchesDistance;
  });

  const formatRate = (rate: string) => `$${Number(rate).toLocaleString()}`;
  const formatRpm = (rate: string, distance?: string) => {
    const d = Number(distance || 0);
    const r = Number(rate || 0);
    if (!d || !r) return "—";
    return `$${(r / d).toFixed(2)}/mi`;
  };
  const formatPickup = (dateStr?: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#FFFFFF",
        color: "#0F1520",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap');

        :root {
          --white:    #FFFFFF;
          --bg:       #F7F8FA;
          --bg2:      #EFF1F5;
          --border:   #E4E7ED;
          --border2:  #D0D5E0;
          --txt:      #0F1520;
          --txt2:     #3D4A5C;
          --txt3:     #4A5568;
          --txt4:     #6B7A8D;
          --blue:     #1A56DB;
          --blue-h:   #1446C0;
          --blue-l:   #EBF1FD;
          --blue-m:   #C7D9FA;
          --green:    #12A150;
          --green-l:  #E6F7EE;
          --green-m:  #A7F3C8;
          --amber:    #D97706;
          --amber-l:  #FEF3C7;
          --purple:   #7C3AED;
          --purple-l: #EDE9FE;
          --purple-m: #C4B5FD;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; }

        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 3px #E6F7EE; }
          50%       { box-shadow: 0 0 0 6px #E6F7EE; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(16px) translateX(-50%); }
          to   { opacity: 1; transform: translateY(0) translateX(-50%); }
        }

        /* HERO */
        .hero {
          padding: 80px 5% 70px;
          background: var(--white);
          text-align: center;
          position: relative; overflow: hidden;
        }
        .hero::before {
          content: '';
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 90% 60% at 50% -5%, rgba(26,86,219,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 5% 90%, rgba(18,161,80,0.04) 0%, transparent 55%),
            radial-gradient(ellipse 40% 30% at 95% 80%, rgba(124,58,237,0.04) 0%, transparent 55%);
        }
        .hero::after {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(26,86,219,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(26,86,219,0.035) 1px, transparent 1px);
          background-size: 52px 52px;
          mask-image: radial-gradient(ellipse 80% 70% at 50% 0%, black 0%, transparent 70%);
        }
        .hero-inner { position: relative; z-index: 1; }

        .hero-badge {
          display: inline-flex; align-items: center; gap: 7px;
          background: var(--blue-l); border: 1px solid var(--blue-m);
          color: var(--blue); border-radius: 20px;
          font-size: 0.7rem; font-weight: 700; letter-spacing: 0.06em;
          padding: 5px 14px; margin-bottom: 26px; text-transform: uppercase;
          animation: fadeUp 0.6s ease both;
        }
        .live-pulse { width: 7px; height: 7px; border-radius: 50%; background: var(--green); animation: pulse 2s infinite; display: inline-block; }

        .hero h1 {
          font-size: clamp(2.2rem, 5.5vw, 3.8rem);
          font-weight: 800; letter-spacing: -0.045em; line-height: 1.05;
          color: var(--txt); margin-bottom: 20px;
          max-width: 760px; margin-left: auto; margin-right: auto;
          animation: fadeUp 0.6s 0.1s ease both;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .hero h1 em { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; color: var(--blue); }

        .hero-sub {
          font-size: 1rem; color: var(--txt3); max-width: 480px;
          margin: 0 auto 36px; line-height: 1.7; font-weight: 400;
          animation: fadeUp 0.6s 0.2s ease both;
        }

        .role-selector { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-bottom: 28px; animation: fadeUp 0.6s 0.3s ease both; }
        .role-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 12px 22px; border-radius: 12px;
          font-size: 0.83rem; font-weight: 700;
          border: 1.5px solid var(--border2); background: var(--white);
          color: var(--txt2); cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.18s ease;
        }
        .role-btn:hover { border-color: var(--blue); color: var(--blue); background: var(--blue-l); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(26,86,219,0.1); }
        .role-btn.broker:hover { border-color: var(--green); color: var(--green); background: var(--green-l); }
        .role-btn.dispatch:hover { border-color: var(--purple); color: var(--purple); background: var(--purple-l); }
        .role-icon { font-size: 1.1rem; }
        .role-label { display: flex; flex-direction: column; text-align: left; }
        .role-label small { font-size: 0.65rem; font-weight: 400; color: var(--txt4); margin-top: 1px; }

        .hero-or { font-size: 0.75rem; color: var(--txt4); margin-bottom: 28px; animation: fadeUp 0.6s 0.35s ease both; }

        .hero-cta-row { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; animation: fadeUp 0.6s 0.4s ease both; }
        .hbtn {
          padding: 13px 26px; border-radius: 10px; font-size: 0.86rem; font-weight: 700;
          border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; letter-spacing: -0.01em; transition: all 0.18s;
        }
        .hbtn-primary { background: var(--blue); color: #fff; box-shadow: 0 1px 3px rgba(26,86,219,0.3), 0 4px 16px rgba(26,86,219,0.2); }
        .hbtn-primary:hover { background: var(--blue-h); transform: translateY(-1px); }
        .hbtn-ghost { background: transparent; color: var(--txt3); border: 1.5px solid var(--border2); }
        .hbtn-ghost:hover { color: var(--txt); }

        .hero-proof { display: flex; align-items: center; justify-content: center; gap: 16px; flex-wrap: wrap; margin-top: 36px; animation: fadeUp 0.6s 0.5s ease both; }
        .proof-avs { display: flex; }
        .proof-avs span { width: 28px; height: 28px; border-radius: 50%; background: var(--bg2); border: 2px solid #fff; display: flex; align-items: center; justify-content: center; font-size: 0.62rem; font-weight: 700; color: var(--txt3); margin-left: -8px; }
        .proof-avs span:first-child { margin-left: 0; }
        .proof-txt { font-size: 0.74rem; color: var(--txt3); }
        .proof-txt b { color: var(--txt2); }
        .pdiv { width: 1px; height: 18px; background: var(--border); }
        .pstars { color: #F59E0B; font-size: 0.75rem; }

        /* STATS */
        .stats { display: grid; grid-template-columns: repeat(4,1fr); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); background: var(--bg); }
        .sc { padding: 26px 20px; border-right: 1px solid var(--border); text-align: center; }
        .sc:last-child { border-right: none; }
        .sn { font-size: 1.8rem; font-weight: 800; color: var(--txt); letter-spacing: -0.04em; line-height: 1.1; font-family: 'Plus Jakarta Sans', sans-serif; }
        .sn span { color: var(--blue); }
        .sl { font-size: 0.7rem; color: var(--txt3); font-weight: 500; text-transform: uppercase; letter-spacing: 0.07em; margin-top: 3px; }

        /* SECTION COMMONS */
        .section-eyebrow { display: flex; align-items: center; gap: 8px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--blue); margin-bottom: 12px; }
        .section-eyebrow::before { content: ''; width: 20px; height: 2px; background: var(--blue); border-radius: 1px; }
        .section-title { font-size: clamp(1.5rem,3vw,2.2rem); font-weight: 800; letter-spacing: -0.04em; color: var(--txt); margin-bottom: 8px; line-height: 1.12; font-family: 'Plus Jakarta Sans', sans-serif; }
        .section-title em { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; color: var(--blue); }
        .section-sub { font-size: 0.86rem; color: var(--txt3); max-width: 440px; margin-bottom: 50px; line-height: 1.65; }

        /* DASHBOARDS */
        .dashboards { padding: 80px 5%; background: var(--white); }
        .dash-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
        .dash-card { border-radius: 18px; overflow: hidden; border: 1px solid var(--border); transition: transform 0.22s, box-shadow 0.22s; }
        .dash-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(0,0,0,0.09); }
        .dash-header { padding: 28px 28px 22px; }
        .dash-icon-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
        .dash-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
        .dash-tag { font-size: 0.62rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; padding: 3px 10px; border-radius: 20px; }
        .dash-title { font-size: 1.05rem; font-weight: 800; color: var(--txt); letter-spacing: -0.02em; margin-bottom: 7px; }
        .dash-desc { font-size: 0.78rem; color: var(--txt3); line-height: 1.6; }
        .dash-features { padding: 0 28px 24px; display: flex; flex-direction: column; gap: 8px; }
        .df { display: flex; align-items: center; gap: 8px; font-size: 0.77rem; color: var(--txt2); }
        .df::before { content: '✓'; width: 18px; height: 18px; border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 800; flex-shrink: 0; }
        .dash-footer { padding: 18px 28px; border-top: 1px solid var(--border); }
        .dash-cta { width: 100%; padding: 11px; border-radius: 9px; font-size: 0.8rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: opacity 0.15s; }
        .dash-cta:hover { opacity: 0.88; }

        .dash-carrier .dash-header { background: linear-gradient(135deg, var(--blue-l) 0%, var(--white) 100%); }
        .dash-carrier .dash-icon { background: var(--blue); color: #fff; }
        .dash-carrier .dash-tag { background: var(--blue-m); color: var(--blue); }
        .dash-carrier .df::before { background: var(--blue-l); color: var(--blue); }
        .dash-carrier .dash-cta { background: var(--blue); color: #fff; }

        .dash-broker .dash-header { background: linear-gradient(135deg, var(--green-l) 0%, var(--white) 100%); }
        .dash-broker .dash-icon { background: var(--green); color: #fff; }
        .dash-broker .dash-tag { background: var(--green-m); color: var(--green); }
        .dash-broker .df::before { background: var(--green-l); color: var(--green); }
        .dash-broker .dash-cta { background: var(--green); color: #fff; }

        .dash-dispatcher .dash-header { background: linear-gradient(135deg, var(--purple-l) 0%, var(--white) 100%); }
        .dash-dispatcher .dash-icon { background: var(--purple); color: #fff; }
        .dash-dispatcher .dash-tag { background: var(--purple-m); color: var(--purple); }
        .dash-dispatcher .df::before { background: var(--purple-l); color: var(--purple); }
        .dash-dispatcher .dash-cta { background: var(--purple); color: #fff; }

        /* AI INBOX */
        .ai-section { padding: 80px 5%; background: var(--bg); border-top: 1px solid var(--border); }
        .ai-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
        .ai-inbox-mock { background: var(--white); border: 1px solid var(--border); border-radius: 18px; overflow: hidden; box-shadow: 0 12px 40px rgba(0,0,0,0.08); }
        .inbox-header { padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; background: var(--bg); }
        .inbox-title { font-size: 0.82rem; font-weight: 700; color: var(--txt); }
        .inbox-badge { background: var(--blue); color: #fff; font-size: 0.62rem; font-weight: 800; padding: 2px 8px; border-radius: 10px; }
        .inbox-item { padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; gap: 12px; align-items: flex-start; transition: background 0.15s; cursor: pointer; }
        .inbox-item:last-child { border-bottom: none; }
        .inbox-item:hover { background: var(--bg); }
        .inbox-item.unread { border-left: 3px solid var(--blue); background: var(--blue-l); }
        .inbox-item.unread:hover { background: #e0ecfd; }
        .inbox-avatar { width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; }
        .inbox-body { flex: 1; }
        .inbox-from { font-size: 0.78rem; font-weight: 700; color: var(--txt); margin-bottom: 2px; display: flex; align-items: center; gap: 6px; }
        .vbadge { font-size: 0.58rem; font-weight: 800; padding: 1px 5px; border-radius: 3px; background: var(--green-l); color: var(--green); }
        .inbox-route { font-size: 0.75rem; color: var(--txt2); margin-bottom: 2px; }
        .inbox-meta { display: flex; gap: 8px; align-items: center; }
        .inbox-rate { font-size: 0.72rem; font-weight: 700; color: var(--green); }
        .inbox-time { font-size: 0.68rem; color: var(--txt4); margin-left: auto; }
        .ai-badge-pill { display: inline-flex; align-items: center; gap: 6px; background: linear-gradient(135deg, var(--blue-l), var(--purple-l)); border: 1px solid var(--blue-m); color: var(--blue); padding: 5px 14px; border-radius: 20px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 16px; }
        .ai-feature-list { display: flex; flex-direction: column; gap: 16px; margin-top: 32px; }
        .af { display: flex; gap: 12px; align-items: flex-start; }
        .af-icon { width: 36px; height: 36px; border-radius: 10px; background: var(--white); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
        .af-title { font-size: 0.83rem; font-weight: 700; color: var(--txt); margin-bottom: 3px; }
        .af-desc { font-size: 0.75rem; color: var(--txt3); line-height: 1.55; }

        /* DISPATCHER PROFILES */
        .dispatch-section { padding: 80px 5%; background: var(--white); border-top: 1px solid var(--border); }
        .dispatch-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
        .profile-cards { display: flex; flex-direction: column; gap: 14px; }
        .profile-card { background: var(--white); border: 1px solid var(--border); border-radius: 14px; padding: 18px; display: flex; gap: 14px; align-items: center; transition: border-color 0.18s, box-shadow 0.18s; cursor: pointer; }
        .profile-card:hover { border-color: var(--purple-m); box-shadow: 0 6px 24px rgba(124,58,237,0.08); }
        .profile-avatar { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0; }
        .profile-info { flex: 1; }
        .profile-name { font-size: 0.85rem; font-weight: 700; color: var(--txt); margin-bottom: 2px; display: flex; align-items: center; gap: 6px; }
        .profile-spec { font-size: 0.73rem; color: var(--txt3); margin-bottom: 6px; }
        .profile-tags { display: flex; gap: 5px; flex-wrap: wrap; }
        .ptag { font-size: 0.62rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; background: var(--bg2); color: var(--txt3); }
        .profile-rate { font-size: 0.85rem; font-weight: 800; color: var(--txt); white-space: nowrap; text-align: right; }
        .profile-rate small { display: block; font-size: 0.65rem; font-weight: 400; color: var(--txt4); }
        .verified-badge { font-size: 0.58rem; font-weight: 800; padding: 1px 5px; border-radius: 3px; background: var(--green-l); color: var(--green); }
        .filter-pills { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
        .fpill { padding: 5px 14px; border-radius: 20px; font-size: 0.72rem; font-weight: 600; border: 1.5px solid var(--border2); background: var(--white); color: var(--txt3); cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; }
        .fpill:hover, .fpill.active { background: var(--purple-l); border-color: var(--purple-m); color: var(--purple); }

        /* LIVE LOAD BOARD */
        .board-section { padding: 80px 5%; background: var(--bg); border-top: 1px solid var(--border); }
        .board-wrap { background: var(--white); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; }
        .board-toolbar { padding: 14px 20px; background: var(--bg); border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .toolbar-search { flex: 1; min-width: 180px; background: var(--white); border: 1px solid var(--border2); border-radius: 8px; padding: 8px 14px; font-size: 0.79rem; color: var(--txt); font-family: 'Plus Jakarta Sans', sans-serif; outline: none; }
        .toolbar-filter { padding: 7px 14px; border-radius: 8px; background: var(--white); border: 1px solid var(--border2); font-size: 0.76rem; font-weight: 500; color: var(--txt2); cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; }
        .toolbar-live { display: flex; align-items: center; gap: 6px; font-size: 0.72rem; color: var(--txt3); margin-left: auto; }
        .ldot { width: 7px; height: 7px; border-radius: 50%; background: var(--green); animation: pulse 2s infinite; display: inline-block; }
        .board-head { display: grid; grid-template-columns: 2fr 1.5fr 0.9fr 0.9fr 1fr 110px; padding: 10px 20px; border-bottom: 1px solid var(--border); gap: 8px; background: var(--bg); }
        .bh { font-size: 0.66rem; font-weight: 700; color: var(--txt4); text-transform: uppercase; letter-spacing: 0.08em; }
        .board-row { display: grid; grid-template-columns: 2fr 1.5fr 0.9fr 0.9fr 1fr 110px; padding: 15px 20px; border-bottom: 1px solid var(--border); gap: 8px; align-items: center; transition: background 0.12s; cursor: pointer; }
        .board-row:last-child { border-bottom: none; }
        .board-row:hover { background: var(--bg); }
        .board-row.ai-match { background: linear-gradient(90deg, rgba(26,86,219,0.04) 0%, transparent 40%); border-left: 3px solid var(--blue); }
        .route-main { font-size: 0.82rem; font-weight: 700; color: var(--txt); }
        .route-sub { font-size: 0.68rem; color: var(--txt4); margin-top: 1px; }
        .broker-name { font-size: 0.78rem; font-weight: 600; color: var(--txt2); }
        .broker-meta { font-size: 0.67rem; color: var(--txt4); }
        .cell-txt { font-size: 0.78rem; color: var(--txt2); font-weight: 500; }
        .rate-main { font-size: 0.88rem; font-weight: 800; color: var(--txt); letter-spacing: -0.02em; }
        .rate-sub { font-size: 0.65rem; color: var(--txt4); }
        .ai-pill { display: inline-block; font-size: 0.58rem; font-weight: 800; padding: 1px 6px; border-radius: 3px; background: var(--blue-l); color: var(--blue); letter-spacing: 0.04em; margin-left: 4px; }
        .eq { display: inline-block; font-size: 0.65rem; font-weight: 700; padding: 2px 7px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.04em; }
        .eq-v { background: var(--blue-l); color: var(--blue); }
        .eq-f { background: var(--amber-l); color: var(--amber); }
        .eq-r { background: var(--green-l); color: var(--green); }
        .bbtn { padding: 7px 14px; border-radius: 7px; font-size: 0.72rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; white-space: nowrap; transition: all 0.15s; }
        .bbtn-solid { background: var(--blue); color: #fff; }
        .bbtn-solid:hover { background: var(--blue-h); }
        .bbtn-solid:disabled { opacity: 0.6; cursor: not-allowed; }
        .bbtn-outline { background: transparent; color: var(--blue); border: 1.5px solid var(--blue-m); }
        .bbtn-booked { background: var(--green-l); color: var(--green); border: 1.5px solid var(--green-m); cursor: default; }
        .board-empty { padding: 48px 20px; text-align: center; color: var(--txt3); font-size: 0.84rem; }
        .board-loading { padding: 48px 20px; text-align: center; color: var(--txt3); font-size: 0.84rem; display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .board-spinner { width: 28px; height: 28px; border: 2.5px solid var(--border); border-top-color: var(--blue); border-radius: 50%; animation: spin 0.75s linear infinite; }
        .row-spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite; display: inline-block; }

        /* HOW IT WORKS */
        .how-section { padding: 80px 5%; background: var(--white); border-top: 1px solid var(--border); }
        .steps { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-top: 44px; }
        .step { padding: 28px; background: var(--bg); border: 1px solid var(--border); border-radius: 14px; position: relative; }
        .step-n { width: 32px; height: 32px; border-radius: 8px; background: var(--blue-l); border: 1px solid var(--blue-m); display: flex; align-items: center; justify-content: center; font-size: 0.78rem; font-weight: 800; color: var(--blue); margin-bottom: 14px; }
        .step-title { font-size: 0.85rem; font-weight: 700; color: var(--txt); margin-bottom: 6px; }
        .step-desc { font-size: 0.75rem; color: var(--txt3); line-height: 1.6; }
        .step-arr { position: absolute; top: 34px; right: -12px; width: 24px; height: 24px; background: var(--white); border: 1px solid var(--border); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; color: var(--txt4); z-index: 1; }

        /* CTA BANNER */
        .cta-banner {
          margin: 0 5% 80px; padding: 56px 5%;
          background: var(--txt); border-radius: 20px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 24px; flex-wrap: wrap; position: relative; overflow: hidden;
        }
        .cta-banner::before {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse 60% 80% at 100% 50%, rgba(26,86,219,0.25) 0%, transparent 55%),
                      radial-gradient(ellipse 40% 40% at 0% 50%, rgba(124,58,237,0.12) 0%, transparent 55%);
        }
        .cta-text { position: relative; z-index: 1; }
        .cta-text h2 { font-size: clamp(1.4rem,3vw,2rem); font-weight: 800; color: #fff; letter-spacing: -0.04em; line-height: 1.2; margin-bottom: 6px; font-family: 'Plus Jakarta Sans', sans-serif; }
        .cta-text h2 em { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; color: #93B5FA; }
        .cta-text p { font-size: 0.84rem; color: #666; max-width: 360px; }
        .cta-btns { display: flex; gap: 10px; flex-wrap: wrap; position: relative; z-index: 1; }
        .cbtn { padding: 13px 24px; border-radius: 10px; font-size: 0.84rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; }
        .cbtn-white { background: #fff; color: var(--txt); }
        .cbtn-white:hover { background: #F0F0F0; }
        .cbtn-outline { background: transparent; color: #888; border: 1.5px solid #2A2A2A; }

        /* TOAST */
        .toast {
          position: fixed; bottom: 28px; left: 50%;
          background: var(--txt); color: #fff;
          padding: 12px 22px; border-radius: 10px;
          font-size: 0.8rem; font-weight: 600;
          box-shadow: 0 8px 32px rgba(0,0,0,0.25);
          z-index: 9999; animation: toastIn 0.25s ease both;
          display: flex; align-items: center; gap: 8px;
        }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .dash-grid, .ai-grid, .dispatch-grid { grid-template-columns: 1fr; }
          .stats { grid-template-columns: repeat(2, 1fr); }
          .steps { grid-template-columns: repeat(2, 1fr); }
          .board-head, .board-row { grid-template-columns: 2fr 1fr 0.7fr 80px; }
          .board-head .bh:nth-child(3),
          .board-head .bh:nth-child(4),
          .board-row > div:nth-child(3),
          .board-row > div:nth-child(4) { display: none; }
        }
        @media (max-width: 600px) {
          .dash-grid { grid-template-columns: 1fr; }
          .steps { grid-template-columns: 1fr; }
          .stats { grid-template-columns: repeat(2, 1fr); }
          .step-arr { display: none; }
        }
      `}</style>

      {/* ── TOAST ── */}
      {toast && <div className="toast">✅ {toast}</div>}

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge">
            <span className="live-pulse" />
            {" "}AI Loads Delivered Directly to Your Inbox
          </div>

          <h1>
            One Platform for Carriers,<br />
            Brokers &amp; <em>Dispatchers</em>
          </h1>

          <p className="hero-sub">
            AI freight matching, verified load boards, dispatcher portfolios, and 3 dedicated dashboards — everything in one place.
          </p>

          <div className="role-selector">
            <button className="role-btn carrier" onClick={() => router.push("/signup?role=carrier")}>
              <span className="role-icon">🚛</span>
              <span className="role-label">
                I&apos;m a Carrier
                <small>Find loads, get AI matches</small>
              </span>
            </button>
            <button className="role-btn broker" onClick={() => router.push("/signup?role=broker")}>
              <span className="role-icon">📦</span>
              <span className="role-label">
                I&apos;m a Broker
                <small>Post loads, find carriers</small>
              </span>
            </button>
            <button className="role-btn dispatch" onClick={() => router.push("/signup?role=dispatcher")}>
              <span className="role-icon">🎯</span>
              <span className="role-label">
                I&apos;m a Dispatcher
                <small>Build profile, find clients</small>
              </span>
            </button>
          </div>

          <p className="hero-or">or</p>

          <div className="hero-cta-row">
            <button className="hbtn hbtn-primary" onClick={() => router.push("/platform")}>
              Explore the Platform →
            </button>
            <button className="hbtn hbtn-ghost" onClick={() => router.push("/dispatchers")}>
              Find Dispatchers
            </button>
          </div>

          <div className="hero-proof">
            <div className="proof-avs">
              <span>JM</span><span>KR</span><span>TS</span><span>AB</span><span>+</span>
            </div>
            <div className="proof-txt">Trusted by <b>12,400+</b> professionals</div>
            <div className="pdiv" />
            <div className="pstars">★★★★★</div>
            <div className="proof-txt"><b>4.9</b> / 5 rating</div>
            <div className="pdiv" />
            <div className="proof-txt"><b>Zero</b> spam calls</div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="stats">
        <div className="sc"><div className="sn">48<span>K+</span></div><div className="sl">Loads Posted Daily</div></div>
        <div className="sc"><div className="sn">4.2<span>s</span></div><div className="sl">AI Match Time</div></div>
        <div className="sc"><div className="sn">3</div><div className="sl">Dedicated Dashboards</div></div>
        <div className="sc"><div className="sn">98<span>%</span></div><div className="sl">Verified Brokers</div></div>
      </div>

      {/* ── 3 DASHBOARDS ── */}
      <section className="dashboards">
        <div className="section-eyebrow">3 Dedicated Dashboards</div>
        <div className="section-title">Your role. Your dashboard.<br /><em>Your workflow.</em></div>
        <div className="section-sub">No more one-size-fits-all platforms. Every user type gets a custom dashboard built for how they actually work.</div>

        <div className="dash-grid">
          <div className="dash-card dash-carrier">
            <div className="dash-header">
              <div className="dash-icon-row">
                <div className="dash-icon">🚛</div>
                <div className="dash-tag">Carrier Dashboard</div>
              </div>
              <div className="dash-title">Built for Truck Owners</div>
              <div className="dash-desc">AI loads delivered directly to your inbox. See rates, book instantly, no phone calls ever.</div>
            </div>
            <div className="dash-features">
              <div className="df">AI load matching to your inbox</div>
              <div className="df">Filter dispatchers by specialty &amp; rate</div>
              <div className="df">Live rate intelligence by lane</div>
              <div className="df">Broker credit scores &amp; reviews</div>
              <div className="df">One-click booking &amp; confirmations</div>
            </div>
            <div className="dash-footer">
              <button className="dash-cta" onClick={() => router.push("/signup?role=carrier")}>Join as Carrier →</button>
            </div>
          </div>

          <div className="dash-card dash-broker">
            <div className="dash-header">
              <div className="dash-icon-row">
                <div className="dash-icon">📦</div>
                <div className="dash-tag">Broker Dashboard</div>
              </div>
              <div className="dash-title">Built for Brokers</div>
              <div className="dash-desc">Post loads and have AI instantly surface verified, reliable carriers for your freight.</div>
            </div>
            <div className="dash-features">
              <div className="df">Post loads to 12,000+ carriers</div>
              <div className="df">AI carrier matching &amp; vetting</div>
              <div className="df">Real-time carrier availability</div>
              <div className="df">Digital rate confirmations</div>
              <div className="df">Load tracking &amp; analytics</div>
            </div>
            <div className="dash-footer">
              <button className="dash-cta" onClick={() => router.push("/signup?role=broker")}>Join as Broker →</button>
            </div>
          </div>

          <div className="dash-card dash-dispatcher">
            <div className="dash-header">
              <div className="dash-icon-row">
                <div className="dash-icon">🎯</div>
                <div className="dash-tag">Dispatcher Dashboard</div>
              </div>
              <div className="dash-title">Built for Dispatchers</div>
              <div className="dash-desc">Build your professional portfolio, showcase your lanes &amp; specialty, and get found by carriers.</div>
            </div>
            <div className="dash-features">
              <div className="df">Full professional profile &amp; portfolio</div>
              <div className="df">Post your availability &amp; specialty</div>
              <div className="df">Get matched with carriers automatically</div>
              <div className="df">Manage multiple carrier accounts</div>
              <div className="df">Earnings tracking &amp; performance stats</div>
            </div>
            <div className="dash-footer">
              <button className="dash-cta" onClick={() => router.push("/signup?role=dispatcher")}>Join as Dispatcher →</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI INBOX ── */}
      <section className="ai-section">
        <div className="ai-grid">
          <div>
            <div className="ai-badge-pill">🤖 AI Matching Engine</div>
            <div className="section-title">Loads come to <em>you.</em><br />Not the other way around.</div>
            <div className="section-sub" style={{ marginBottom: 0 }}>
              Our AI learns your lanes, equipment, and preferences — then pushes matching loads straight to your inbox the moment they&apos;re posted.
            </div>
            <div className="ai-feature-list">
              <div className="af">
                <div className="af-icon">⚡</div>
                <div>
                  <div className="af-title">Instant inbox delivery</div>
                  <div className="af-desc">New loads matching your profile land in your inbox before other carriers even see them on the board.</div>
                </div>
              </div>
              <div className="af">
                <div className="af-icon">🧠</div>
                <div>
                  <div className="af-title">Learns your preferences</div>
                  <div className="af-desc">The more you use it, the smarter it gets. AI tracks what you book and improves matches over time.</div>
                </div>
              </div>
              <div className="af">
                <div className="af-icon">🔇</div>
                <div>
                  <div className="af-title">Zero spam calls</div>
                  <div className="af-desc">No broker cold calls. Everything is handled digitally — book, confirm, and go.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="ai-inbox-mock">
            <div className="inbox-header">
              <div className="inbox-title">📬 AI Load Inbox</div>
              <div className="inbox-badge">3 New</div>
            </div>
            {[
              { initials: "CL", bg: "#EBF1FD", color: "#1A56DB", name: "Coyote Logistics", route: "Dallas, TX → Chicago, IL · 1,042 mi · Dry Van", rate: "$2,840 · $2.73/mi", time: "2 min ago", unread: true },
              { initials: "EG", bg: "#E6F7EE", color: "#12A150", name: "Echo Global", route: "Atlanta, GA → Miami, FL · 662 mi · Reefer", rate: "$2,210 · $3.34/mi", time: "8 min ago", unread: true },
              { initials: "XP", bg: "#FEF3C7", color: "#D97706", name: "XPO Logistics", route: "Los Angeles, CA → Phoenix, AZ · 370 mi · Flatbed", rate: "$1,480 · $4.00/mi", time: "15 min ago", unread: true },
              { initials: "CH", bg: "#EFF1F5", color: "#4A5568", name: "CH Robinson", route: "Houston, TX → Nashville, TN · 890 mi · Dry Van", rate: "$2,670 · $3.00/mi", time: "1 hr ago", unread: false },
            ].map((item, i) => (
              <div key={i} className={`inbox-item${item.unread ? " unread" : ""}`}>
                <div className="inbox-avatar" style={{ background: item.bg, color: item.color }}>{item.initials}</div>
                <div className="inbox-body">
                  <div className="inbox-from">
                    {item.name}
                    {item.unread && <span className="vbadge">VERIFIED</span>}
                  </div>
                  <div className="inbox-route">{item.route}</div>
                  <div className="inbox-meta">
                    <span className="inbox-rate">{item.rate}</span>
                    <span className="inbox-time">{item.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DISPATCHER PROFILES ── */}
      <section className="dispatch-section">
        <div className="dispatch-grid">
          <div>
            <div className="section-eyebrow">Dispatcher Network</div>
            <div className="section-title">Find the perfect dispatcher<br /><em>for your operation.</em></div>
            <div className="section-sub">Every dispatcher has a full professional profile — their lanes, specialties, rates, and track record. You choose who works for you.</div>
            <div className="filter-pills">
              <div className="fpill active">All Dispatchers</div>
              <div className="fpill">Dry Van</div>
              <div className="fpill">Box Truck</div>
              <div className="fpill">Flatbed</div>
              <div className="fpill">Sprinter Van</div>
              <div className="fpill">OTR</div>
            </div>
          </div>

          <div className="profile-cards">
            {[
              { bg: "#EBF1FD", name: "Marcus Reid", spec: "Dry Van · OTR Specialist · 7 yrs experience", tags: ["Midwest", "Southeast", "Full Truckload"], rate: "$350", per: "/week" },
              { bg: "#E6F7EE", name: "Tanya Brooks", spec: "Reefer · Temperature Controlled Expert · 5 yrs", tags: ["Northeast", "Texas Corridor"], rate: "$300", per: "/week" },
              { bg: "#EDE9FE", name: "James Okafor", spec: "Flatbed · Oversize Load · 10 yrs experience", tags: ["West Coast", "Heavy Haul"], rate: "$400", per: "/week" },
            ].map((p, i) => (
              <div key={i} className="profile-card">
                <div className="profile-avatar" style={{ background: p.bg }}>👤</div>
                <div className="profile-info">
                  <div className="profile-name">{p.name} <span className="verified-badge">✓ VERIFIED</span></div>
                  <div className="profile-spec">{p.spec}</div>
                  <div className="profile-tags">{p.tags.map(t => <span key={t} className="ptag">{t}</span>)}</div>
                </div>
                <div className="profile-rate">{p.rate}<small>{p.per}</small></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE LOAD BOARD ── */}
      <section className="board-section">
        <div className="section-eyebrow">Live Load Board</div>
        <div className="section-title">{(totalLoadCount ?? 48241).toLocaleString()}+ loads. <em>Right now.</em></div>
        <div className="section-sub" style={{ marginBottom: 28 }}>Every load is verified. Every broker is rated. No spam, no ghosts.</div>

        <div className="board-wrap">
          <div className="board-toolbar">
            <input
              className="toolbar-search"
              type="text"
              placeholder="🔍  Search by origin, destination, or broker..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select className="toolbar-filter" value={equipmentFilter} onChange={(e) => setEquipmentFilter(e.target.value)}>
              <option>All Equipment</option>
              <option>Dry Van</option>
              <option>FlatBed</option>
              <option>Box Truck</option>
              <option>Reefer</option>
              <option>Sprinter/Cargo Van</option>
              <option>Tanker</option>
              <option>Step Deck</option>
              <option>HotShot</option>
              <option>Power Only</option>
              <option>Other</option>
            </select>
            <select className="toolbar-filter" value={distanceFilter} onChange={(e) => setDistanceFilter(e.target.value)}>
              <option>Any Distance</option>
              <option>Under 500mi</option>
              <option>500–1000mi</option>
              <option>1000mi+</option>
            </select>
            <div className="toolbar-live"><span className="ldot" /> Live · {(totalLoadCount ?? 48241).toLocaleString()} loads</div>
          </div>

          <div className="board-head">
            <div className="bh">Route</div>
            <div className="bh">Broker</div>
            <div className="bh">Equipment</div>
            <div className="bh">Weight</div>
            <div className="bh">Rate</div>
            <div className="bh" />
          </div>

          {loadsLoading ? (
            <div className="board-loading">
              <div className="board-spinner" />
              <div>Loading live loads from the board...</div>
            </div>
          ) : filteredLoads.length === 0 ? (
            <div className="board-empty">No loads match your filters right now. Try a different search or equipment type.</div>
          ) : (
            filteredLoads.map((row) => {
              const isBooked = bookedIds.includes(row.id);
              const isBooking = bookingId === row.id;
              const eqClass = EQ_CLASS[row.equipment] ?? "eq-v";
              return (
                <div key={row.id} className={`board-row${row.broker_verified ? " ai-match" : ""}`} onClick={() => handleViewLoad(row)}>
                  <div>
                    <div className="route-main">
                      {cap(row.pickup_location)} → {cap(row.delivery_location)}
                      {row.broker_verified && <span className="ai-pill">VERIFIED</span>}
                    </div>
                    <div className="route-sub">
                      {row.distance ? `${Number(row.distance).toLocaleString()} mi` : ""}{row.pickup_date ? ` · Pickup ${formatPickup(row.pickup_date)}` : ""}
                    </div>
                  </div>
                  <div>
                    <div className="broker-name">{cap(row.company_name) || "Direct Shipper"}</div>
                    <div className="broker-meta">
                      {row.mc_number ? `MC ${row.mc_number}` : ""}
                    </div>
                  </div>
                  <div className="cell-txt"><span className={`eq ${eqClass}`}>{row.equipment}</span></div>
                  <div className="cell-txt">{row.weight ? `${Number(row.weight).toLocaleString()} lbs` : "—"}</div>
                  <div>
                    <div className="rate-main">{formatRate(row.total_rate)}</div>
                    <div className="rate-sub">{formatRpm(row.total_rate, row.distance)}</div>
                  </div>
                  <button
                    className={`bbtn ${isBooked ? "bbtn-booked" : "bbtn-solid"}`}
                    disabled={isBooking || isBooked}
                    onClick={(e) => { e.stopPropagation(); handleBook(row); }}
                  >
                    {isBooked ? "✓ Booked" : isBooking ? <span className="row-spinner" /> : "Book Now"}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how-section">
        <div className="section-eyebrow">How It Works</div>
        <div className="section-title">Search to booked in <em>60 seconds.</em></div>
        <div className="steps">
          {[
            { n: "01", title: "Choose your role", desc: "Sign up as a Carrier, Broker, or Dispatcher and get your dedicated dashboard instantly.", arr: true },
            { n: "02", title: "Set your preferences", desc: "Tell the AI your equipment, home region, and preferred lanes. Brokers post their load requirements.", arr: true },
            { n: "03", title: "AI matches you", desc: "Loads land in your inbox automatically. Carriers find dispatchers. Brokers get matched to the right trucks.", arr: true },
            { n: "04", title: "Book with one click", desc: "No calls, no spam, no chasing. Accept digitally, get your rate con, and roll.", arr: false },
          ].map((s, i) => (
            <div key={i} className="step">
              <div className="step-n">{s.n}</div>
              <div className="step-title">{s.title}</div>
              <div className="step-desc">{s.desc}</div>
              {s.arr && <div className="step-arr">→</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <div className="cta-banner">
        <div className="cta-text">
          <h2>Everything Freight<br /><em>Finally Connected!</em></h2>
          <p>Join 12,400+ carriers, brokers, and dispatchers already on LoadOps AI.</p>
        </div>
        <div className="cta-btns">
          <button className="cbtn cbtn-white" onClick={() => router.push("/signup")}>Get Started Free →</button>
          <button className="cbtn cbtn-outline" onClick={() => router.push("/Talk-to-us")} >Talk to Us</button>
        </div>
      </div>

    </main>
  );
}
