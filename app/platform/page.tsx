"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

type Load = {
  id: string;
  company_name: string;
  contact: string;
  email: string;
  pickup_location: string;
  delivery_location: string;
  equipment: string;
  load_type?: string;
  weight: string;
  total_rate: string;
  mc_number: string;
  usdot: string;
  pickup_date: string;
  delivery_date: string;
  description: string;
  status: string;
  distance?: string;
  broker_verified?: boolean;
};

const equipmentColors: Record<string, { bg: string; color: string }> = {
  "Dry Van":             { bg: "#EBF1FD", color: "#1A56DB" },
  "Reefer":              { bg: "#E6F7EE", color: "#12A150" },
  "Flatbed":             { bg: "#FEF3C7", color: "#D97706" },
  "FlatBed":             { bg: "#FEF3C7", color: "#D97706" },
  "Box Truck":           { bg: "#EDE9FE", color: "#7C3AED" },
  "Sprinter/Cargo Van":  { bg: "#FFF7ED", color: "#C2410C" },
  "Tanker":              { bg: "#FFF1F2", color: "#E11D48" },
  "HotShot":             { bg: "#F0FDF4", color: "#166534" },
  "Step Deck":           { bg: "#FEF3C7", color: "#D97706" },
  "Power Only":          { bg: "#EFF1F5", color: "#4A5568" },
};

export default function PlatformPage() {
  const [loads, setLoads] = useState<Load[]>([]);
  const [filteredLoads, setFilteredLoads] = useState<Load[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null);
  const [savedLoads, setSavedLoads] = useState<string[]>([]);

  const [pickupSearch, setPickupSearch] = useState("");
  const [pickupDeadhead, setPickupDeadhead] = useState("");
  const [deliverySearch, setDeliverySearch] = useState("");
  const [deliveryDeadhead, setDeliveryDeadhead] = useState("");
  const [equipmentFilter, setEquipmentFilter] = useState("");
  const [loadType, setLoadType] = useState("");
  const [rateFilter, setRateFilter] = useState("");
  const [maxWeight, setMaxWeight] = useState("");
  const [maxDistance, setMaxDistance] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const [bookingForm, setBookingForm] = useState({ carrier_name: "", mc_number: "", phone: "", email: "", truck_type: "", message: "" });

  const fetchLoads = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("loads").select("*").eq("status", "available").order("created_at", { ascending: false });
    if (!error && data) { setLoads(data); setFilteredLoads(data); }
    setLoading(false);
  };

  useEffect(() => { fetchLoads(); }, []);

  useEffect(() => {
    let filtered = [...loads];
    if (pickupSearch)   filtered = filtered.filter((l) => l.pickup_location?.toLowerCase().includes(pickupSearch.toLowerCase()));
    if (deliverySearch) filtered = filtered.filter((l) => l.delivery_location?.toLowerCase().includes(deliverySearch.toLowerCase()));
    if (equipmentFilter) filtered = filtered.filter((l) => l.equipment === equipmentFilter);
    if (loadType)  filtered = filtered.filter((l) => l.load_type === loadType);
    if (rateFilter) filtered = filtered.filter((l) => Number(l.total_rate) >= Number(rateFilter));
    if (maxWeight)  filtered = filtered.filter((l) => Number(l.weight) <= Number(maxWeight));
    if (maxDistance) filtered = filtered.filter((l) => Number(l.distance || 0) <= Number(maxDistance));
    if (verifiedOnly) filtered = filtered.filter((l) => l.broker_verified);
    setFilteredLoads(filtered);
  }, [pickupSearch, deliverySearch, equipmentFilter, loadType, rateFilter, maxWeight, maxDistance, verifiedOnly, loads]);

  const toggleSaveLoad = (loadId: string) => {
    setSavedLoads(prev => prev.includes(loadId) ? prev.filter(id => id !== loadId) : [...prev, loadId]);
  };

  const handleBookLoad = async () => {
    if (!selectedLoad) return;
    const { carrier_name, mc_number, phone, email } = bookingForm;
    if (!carrier_name || !mc_number || !phone || !email) { alert("Fill all required fields"); return; }
    const { error } = await supabase.from("load_bookings").insert([{ load_id: selectedLoad.id, ...bookingForm, status: "pending" }]);
    if (error) { alert(error.message); } else {
      alert("Booking Request Submitted!");
      setSelectedLoad(null);
      setBookingForm({ carrier_name: "", mc_number: "", phone: "", email: "", truck_type: "", message: "" });
    }
  };

  const handleAiAlerts = () => alert("AI Load Alerts Activated! Carriers will receive AI matched loads by email.");
  const router = useRouter();
  const handleAiEmail  = () => alert("AI Email Matching System Activated!");

  const aiMatch = useMemo(() => () => Math.floor(Math.random() * 15 + 85), []);

  const cap = (text: string) => {
    if (!text) return "";
    return text.toLowerCase().split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  };

  const resetFilters = () => {
    setPickupSearch(""); setPickupDeadhead(""); setDeliverySearch(""); setDeliveryDeadhead("");
    setEquipmentFilter(""); setLoadType(""); setRateFilter(""); setMaxWeight(""); setMaxDistance(""); setVerifiedOnly(false);
  };

  const activeFilters = [pickupSearch, deliverySearch, equipmentFilter, loadType, rateFilter, maxWeight, maxDistance, verifiedOnly ? "verified" : ""].filter(Boolean).length;

  return (
    <main style={{ minHeight: "100vh", background: "#F7F8FA", fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#0F1520" }}>

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
          --red:      #DC2626;
          --red-l:    #FEF2F2;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 3px #E6F7EE; }
          50%       { box-shadow: 0 0 0 6px #E6F7EE; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes radarPing {
          0%   { transform: scale(1); opacity: 1; }
          100% { transform: scale(2.2); opacity: 0; }
        }

        /* ── PAGE WRAPPER ── */
        .plt-page { padding: 32px 5%; max-width: 1300px; margin: 0 auto; }

        /* ── PAGE HEADER ── */
        .plt-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; margin-bottom: 28px; flex-wrap: wrap; }
        .plt-header-left {}
        .plt-eyebrow { display: flex; align-items: center; gap: 7px; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--blue); margin-bottom: 8px; }
        .plt-live-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--green); animation: pulse 2s infinite; display: inline-block; }
        .plt-title { font-size: clamp(1.6rem, 3.5vw, 2.4rem); font-weight: 800; letter-spacing: -0.045em; color: var(--txt); line-height: 1.06; font-family: 'Plus Jakarta Sans', sans-serif; }
        .plt-title em { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; color: var(--blue); }
        .plt-sub { font-size: 0.84rem; color: var(--txt3); margin-top: 6px; font-weight: 400; }

        .plt-stats-row { display: flex; gap: 12px; flex-wrap: wrap; }
        .plt-stat { background: var(--white); border: 1px solid var(--border); border-radius: 14px; padding: 16px 20px; min-width: 140px; }
        .plt-stat-n { font-size: 1.5rem; font-weight: 800; color: var(--txt); letter-spacing: -0.04em; line-height: 1; font-family: 'Plus Jakarta Sans', sans-serif; }
        .plt-stat-n.blue   { color: var(--blue); }
        .plt-stat-n.green  { color: var(--green); }
        .plt-stat-n.purple { color: var(--purple); }
        .plt-stat-l { font-size: 0.65rem; color: var(--txt3); font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; margin-top: 4px; }

        /* ── AI SECTION ── */
        .plt-ai {
          background: linear-gradient(135deg, var(--blue-l) 0%, var(--purple-l) 100%);
          border: 1px solid var(--blue-m);
          border-radius: 16px; padding: 22px 24px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 20px; flex-wrap: wrap; margin-bottom: 24px;
        }
        .plt-ai-left {}
        .plt-ai-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 0.62rem; font-weight: 800; color: var(--blue); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; }
        .plt-ai-title { font-size: 0.95rem; font-weight: 800; color: var(--txt); margin-bottom: 4px; letter-spacing: -0.02em; }
        .plt-ai-desc  { font-size: 0.78rem; color: var(--txt3); max-width: 500px; line-height: 1.6; font-weight: 400; }
        .plt-ai-btns { display: flex; gap: 8px; flex-wrap: wrap; }
        .plt-ai-btn-primary { padding: 9px 18px; border-radius: 9px; background: var(--blue); color: #fff; font-size: 0.78rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; }
        .plt-ai-btn-primary:hover { background: var(--blue-h); transform: translateY(-1px); }
        .plt-ai-btn-ghost { padding: 9px 18px; border-radius: 9px; background: var(--white); color: var(--txt2); font-size: 0.78rem; font-weight: 700; border: 1.5px solid var(--border2); cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; }
        .plt-ai-btn-ghost:hover { border-color: var(--blue-m); color: var(--blue); }
        .plt-ai-btn-purple { padding: 9px 18px; border-radius: 9px; background: var(--purple-l); color: var(--purple); font-size: 0.78rem; font-weight: 700; border: 1.5px solid var(--purple-m); cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; }
        .plt-ai-btn-purple:hover { background: var(--purple); color: #fff; }

        /* ── FILTERS ── */
        .plt-filters { background: var(--white); border: 1px solid var(--border); border-radius: 16px; padding: 22px 24px; margin-bottom: 24px; }
        .plt-filter-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
        .plt-filter-title { font-size: 0.82rem; font-weight: 800; color: var(--txt); display: flex; align-items: center; gap: 8px; }
        .plt-filter-count { font-size: 0.62rem; font-weight: 800; padding: 2px 8px; border-radius: 10px; background: var(--blue); color: #fff; }
        .plt-reset-btn { font-size: 0.72rem; font-weight: 600; color: var(--txt3); background: none; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: color 0.15s; }
        .plt-reset-btn:hover { color: var(--red); }

        .plt-filter-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 14px; }
        .plt-filter-group { display: flex; flex-direction: column; gap: 6px; }
        .plt-filter-label { font-size: 0.62rem; font-weight: 700; color: var(--txt4); text-transform: uppercase; letter-spacing: 0.07em; }
        .plt-input {
          width: 100%; padding: 9px 12px; border-radius: 9px;
          background: var(--bg); border: 1.5px solid var(--border2);
          color: var(--txt); font-size: 0.8rem; font-family: 'Plus Jakarta Sans', sans-serif;
          outline: none; transition: border-color 0.15s, box-shadow 0.15s;
        }
        .plt-input:focus { border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-l); background: var(--white); }
        .plt-input::placeholder { color: var(--txt4); }

        .plt-minimap { width: 100%; height: 100px; border-radius: 8px; border: 1px solid var(--border); margin-top: 6px; }

        .plt-verified-row { display: flex; align-items: center; gap: 9px; padding-top: 6px; }
        .plt-checkbox { width: 16px; height: 16px; border-radius: 4px; border: 1.5px solid var(--border2); background: var(--bg); cursor: pointer; appearance: none; outline: none; transition: all 0.15s; flex-shrink: 0; }
        .plt-checkbox:checked { background: var(--green); border-color: var(--green); }
        .plt-verified-label { font-size: 0.78rem; color: var(--txt2); font-weight: 600; cursor: pointer; }

        /* ── RESULTS HEADER ── */
        .plt-results-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 10px; }
        .plt-results-title { font-size: 0.86rem; font-weight: 800; color: var(--txt); }
        .plt-results-count { font-size: 0.7rem; font-weight: 700; padding: 3px 10px; border-radius: 20px; background: var(--blue-l); color: var(--blue); }
        .plt-results-live { display: flex; align-items: center; gap: 5px; font-size: 0.68rem; color: var(--txt3); font-weight: 600; }
        .plt-ldot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); animation: pulse 2s infinite; display: inline-block; }

        /* ── LOAD CARD ── */
        .plt-load-card { background: var(--white); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; margin-bottom: 14px; transition: box-shadow 0.2s; animation: fadeUp 0.4s ease both; }
        .plt-load-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.08); }
        .plt-load-card.ai-match { border-left: 3px solid var(--blue); background: linear-gradient(90deg, rgba(26,86,219,0.025) 0%, var(--white) 30%); }

        .plt-load-top { padding: 18px 22px 14px; border-bottom: 1px solid var(--border); display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
        .plt-load-name { font-size: 1.05rem; font-weight: 800; color: var(--txt); letter-spacing: -0.02em; margin-bottom: 4px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .plt-verified-badge { font-size: 0.58rem; font-weight: 800; padding: 2px 7px; border-radius: 4px; background: var(--green-l); color: var(--green); }
        .plt-ai-badge-pill { font-size: 0.58rem; font-weight: 800; padding: 2px 7px; border-radius: 4px; background: var(--purple-l); color: var(--purple); }
        .plt-load-route { font-size: 0.84rem; color: var(--txt3); display: flex; align-items: center; gap: 6px; font-weight: 400; }
        .plt-load-arrow { color: var(--txt4); }
        .plt-rate { font-size: 1.2rem; font-weight: 800; color: var(--green); letter-spacing: -0.03em; white-space: nowrap; }
        .plt-rate small { display: block; font-size: 0.65rem; font-weight: 400; color: var(--txt4); text-align: right; margin-top: 1px; }

        .plt-load-meta { display: grid; grid-template-columns: repeat(5, 1fr); padding: 12px 22px; background: var(--bg); border-bottom: 1px solid var(--border); gap: 12px; }
        .plt-meta-item {}
        .plt-meta-label { font-size: 0.6rem; font-weight: 700; color: var(--txt4); text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 3px; }
        .plt-meta-value { font-size: 0.78rem; font-weight: 600; color: var(--txt2); }
        .plt-eq-tag { display: inline-block; font-size: 0.63rem; font-weight: 700; padding: 2px 7px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.04em; }

        .plt-load-body { display: grid; grid-template-columns: 1fr 240px; gap: 0; }
        .plt-load-body-left { display: flex; flex-direction: column; }
        .plt-load-bottom { padding: 14px 22px; display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; flex: 1; }
        .plt-load-desc { font-size: 0.76rem; color: var(--txt3); line-height: 1.55; flex: 1; font-weight: 400; }
        .plt-load-desc b { color: var(--txt2); font-weight: 600; }
        .plt-load-actions { display: flex; gap: 8px; flex-shrink: 0; flex-wrap: wrap; }
        .plt-load-map { width: 240px; flex-shrink: 0; border-left: 1px solid var(--border); overflow: hidden; }
        .plt-load-map iframe { width: 100%; height: 100%; min-height: 120px; display: block; border: none; }
        .plt-load-map-label { padding: 6px 10px; background: var(--bg); border-top: 1px solid var(--border); font-size: 0.6rem; font-weight: 700; color: var(--txt4); text-transform: uppercase; letter-spacing: 0.06em; display: flex; align-items: center; gap: 4px; }
        @media (max-width: 800px) { .plt-load-body { grid-template-columns: 1fr; } .plt-load-map { width: 100%; border-left: none; border-top: 1px solid var(--border); } .plt-load-map iframe { min-height: 160px; } }

        .plt-btn { padding: 8px 18px; border-radius: 8px; font-size: 0.75rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; }
        .plt-btn-primary { background: var(--blue); color: #fff; }
        .plt-btn-primary:hover { background: var(--blue-h); transform: translateY(-1px); }
        .plt-btn-save { background: var(--white); color: var(--txt2); border: 1.5px solid var(--border2); }
        .plt-btn-save:hover { border-color: var(--amber); color: var(--amber); }
        .plt-btn-save.saved { background: var(--amber-l); color: var(--amber); border-color: #FDE68A; }
        .plt-btn-ai { background: var(--purple-l); color: var(--purple); border: 1.5px solid var(--purple-m); }
        .plt-btn-ai:hover { background: var(--purple); color: #fff; }

        /* MAP IN CARD */
        .plt-card-map { width: 100%; height: 180px; border-radius: 10px; border: 1px solid var(--border); display: block; }

        /* ── LOADING / EMPTY ── */
        .plt-loading { text-align: center; padding: 80px 20px; }
        .plt-spinner { width: 38px; height: 38px; border: 3px solid var(--border); border-top-color: var(--blue); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 14px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .plt-loading-txt { font-size: 0.84rem; color: var(--txt3); font-weight: 500; }
        .plt-empty { text-align: center; padding: 80px 20px; background: var(--white); border: 1px solid var(--border); border-radius: 16px; }
        .plt-empty-icon { font-size: 2.5rem; margin-bottom: 12px; }
        .plt-empty-title { font-size: 0.95rem; font-weight: 700; color: var(--txt); margin-bottom: 6px; }
        .plt-empty-sub { font-size: 0.8rem; color: var(--txt3); }

        /* ── MODAL ── */
        .plt-modal-overlay { position: fixed; inset: 0; background: rgba(15,21,32,0.55); backdrop-filter: blur(6px); z-index: 50; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .plt-modal { background: var(--white); border: 1px solid var(--border); border-radius: 20px; padding: 32px; width: 100%; max-width: 560px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); max-height: 90vh; overflow-y: auto; }
        .plt-modal-header { margin-bottom: 22px; }
        .plt-modal-eyebrow { font-size: 0.65rem; font-weight: 800; color: var(--blue); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px; }
        .plt-modal-title { font-size: 1.15rem; font-weight: 800; color: var(--txt); letter-spacing: -0.03em; margin-bottom: 4px; }
        .plt-modal-route { font-size: 0.82rem; color: var(--txt3); font-weight: 400; }
        .plt-modal-divider { height: 1px; background: var(--border); margin: 18px 0; }
        .plt-modal-fields { display: flex; flex-direction: column; gap: 12px; }
        .plt-modal-label { display: block; font-size: 0.68rem; font-weight: 700; color: var(--txt2); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 5px; }
        .plt-modal-input { width: 100%; padding: 10px 14px; border-radius: 10px; background: var(--bg); border: 1.5px solid var(--border2); color: var(--txt); font-size: 0.83rem; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; transition: border-color 0.15s, box-shadow 0.15s; }
        .plt-modal-input:focus { border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-l); }
        .plt-modal-input::placeholder { color: var(--txt4); }
        .plt-modal-actions { display: flex; gap: 10px; margin-top: 22px; }
        .plt-modal-submit { flex: 1; padding: 12px; border-radius: 10px; background: var(--blue); color: #fff; font-size: 0.84rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; }
        .plt-modal-submit:hover { background: var(--blue-h); transform: translateY(-1px); }
        .plt-modal-cancel { padding: 12px 20px; border-radius: 10px; background: var(--red-l); color: var(--red); font-size: 0.84rem; font-weight: 700; border: 1.5px solid #FEE2E2; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; }
        .plt-modal-cancel:hover { background: #FEE2E2; }

        /* RESPONSIVE */
        @media (max-width: 1000px) {
          .plt-filter-grid { grid-template-columns: 1fr 1fr; }
          .plt-load-meta { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 700px) {
          .plt-filter-grid { grid-template-columns: 1fr; }
          .plt-page { padding: 20px 4%; }
          .plt-load-meta { grid-template-columns: repeat(2, 1fr); }
          .plt-stats-row { flex-direction: row; }
        }
      `}</style>

      <div className="plt-page">

        {/* ── PAGE HEADER ── */}
        <div className="plt-header">
          <div className="plt-header-left">
            <div className="plt-eyebrow">
              <span className="plt-live-dot" />
              {" "}Live Load Board
            </div>
            <div className="plt-title">LoadOps <em>AI Platform</em></div>
            <div className="plt-sub">AI-powered freight matching — loads verified, brokers rated, zero spam calls.</div>
          </div>

          <div className="plt-stats-row">
            <div className="plt-stat">
              <div className="plt-stat-n blue">{filteredLoads.length}</div>
              <div className="plt-stat-l">Active Loads</div>
            </div>
            <div className="plt-stat">
              <div className="plt-stat-n green">2,340</div>
              <div className="plt-stat-l">Carriers Online</div>
            </div>
            <div className="plt-stat">
              <div className="plt-stat-n purple">{savedLoads.length}</div>
              <div className="plt-stat-l">Saved Loads</div>
            </div>
          </div>
        </div>

        {/* ── AI SECTION ── */}
        <div className="plt-ai">
          <div className="plt-ai-left">
            <div className="plt-ai-badge">🤖 AI Freight Assistant</div>
            <div className="plt-ai-title">AI matches your truck to the best loads — instantly</div>
            <div className="plt-ai-desc">Analyzes lanes, deadhead radius, equipment type, RPM, and broker reliability to surface the highest-value opportunities for your profile.</div>
          </div>
          <div className="plt-ai-btns">
            <button
  className="plt-ai-btn-primary"
  onClick={() => router.push("/ai-alerts")}
>
  ⚡ Enable AI Alerts
</button>
            <button className="plt-ai-btn-ghost"  onClick={() => {
    router.push("/route-planner");
  }}>🗺 Route Planner</button>
            <button
  className="plt-ai-btn-purple"
  onClick={() => router.push("/ai-email-matching")}
>
  📬 AI Email Matching
</button>
          </div>
        </div>

        {/* ── FILTERS ── */}
        <div className="plt-filters">
          <div className="plt-filter-header">
            <div className="plt-filter-title">
              🔍 Search & Filter
              {activeFilters > 0 && <span className="plt-filter-count">{activeFilters} active</span>}
            </div>
            {activeFilters > 0 && <button className="plt-reset-btn" onClick={resetFilters}>✕ Reset All</button>}
          </div>

          <div className="plt-filter-grid">
            <div className="plt-filter-group">
              <div className="plt-filter-label">Pickup Location</div>
              <input placeholder="City, State or ZIP" value={pickupSearch} onChange={(e) => setPickupSearch(e.target.value)} className="plt-input" />
              {pickupSearch && <iframe className="plt-minimap" loading="lazy" src={`https://www.google.com/maps?q=${encodeURIComponent(pickupSearch)}&output=embed`} />}
            </div>

            <div className="plt-filter-group">
              <div className="plt-filter-label">Delivery Location</div>
              <input placeholder="City, State or ZIP" value={deliverySearch} onChange={(e) => setDeliverySearch(e.target.value)} className="plt-input" />
              {deliverySearch && <iframe className="plt-minimap" loading="lazy" src={`https://www.google.com/maps?q=${encodeURIComponent(deliverySearch)}&output=embed`} />}
            </div>

            <div className="plt-filter-group">
              <div className="plt-filter-label">Pickup Deadhead (mi)</div>
              <input placeholder="e.g. 50" value={pickupDeadhead} onChange={(e) => setPickupDeadhead(e.target.value)} className="plt-input" />
            </div>

            <div className="plt-filter-group">
              <div className="plt-filter-label">Delivery Deadhead (mi)</div>
              <input placeholder="e.g. 50" value={deliveryDeadhead} onChange={(e) => setDeliveryDeadhead(e.target.value)} className="plt-input" />
            </div>

            <div className="plt-filter-group">
              <div className="plt-filter-label">Equipment Type</div>
              <select value={equipmentFilter} onChange={(e) => setEquipmentFilter(e.target.value)} className="plt-input">
                <option value="">All Equipment</option>
                <optgroup label="Van & Cargo">
                  <option>Dry Van</option>
                  <option>Reefer</option>
                  <option>Box Truck</option>
                  <option>Sprinter/Cargo Van</option>
                </optgroup>
                <optgroup label="Flatbed & Heavy">
                  <option>FlatBed</option>
                  <option>Step Deck</option>
                  <option>RGN / Lowboy</option>
                </optgroup>
                <optgroup label="Specialized">
                  <option>Tanker</option>
                  <option>HotShot</option>
                  <option>Power Only</option>
                  <option>Other</option>
                </optgroup>
              </select>
            </div>

            <div className="plt-filter-group">
              <div className="plt-filter-label">Load Type</div>
              <select value={loadType} onChange={(e) => setLoadType(e.target.value)} className="plt-input">
                <option value="">Any Load Type</option>
                <option value="FTL">Full Truck Load (FTL)</option>
                <option value="Partial">Partial Load (LTL)</option>
              </select>
            </div>

            <div className="plt-filter-group">
              <div className="plt-filter-label">Min Rate ($)</div>
              <input placeholder="e.g. 1500" value={rateFilter} onChange={(e) => setRateFilter(e.target.value)} className="plt-input" />
            </div>

            <div className="plt-filter-group">
              <div className="plt-filter-label">Max Weight (lbs)</div>
              <input placeholder="e.g. 44000" value={maxWeight} onChange={(e) => setMaxWeight(e.target.value)} className="plt-input" />
            </div>
          </div>

          <div className="plt-verified-row">
            <input type="checkbox" className="plt-checkbox" id="verified" checked={verifiedOnly} onChange={() => setVerifiedOnly(!verifiedOnly)} />
            <label className="plt-verified-label" htmlFor="verified">Show verified brokers only</label>
          </div>
        </div>

        {/* ── RESULTS HEADER ── */}
        <div className="plt-results-header">
          <div className="plt-results-title">
            {filteredLoads.length > 0 ? `Showing ${filteredLoads.length} load${filteredLoads.length !== 1 ? "s" : ""}` : "No loads match your filters"}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="plt-results-count">{filteredLoads.length} results</div>
            <div className="plt-results-live"><span className="plt-ldot" /> Updated live</div>
          </div>
        </div>

        {/* ── LOADS ── */}
        {loading ? (
          <div className="plt-loading">
            <div className="plt-spinner" />
            <div className="plt-loading-txt">Loading loads...</div>
          </div>

        ) : filteredLoads.length === 0 ? (
          <div className="plt-empty">
            <div className="plt-empty-icon">📭</div>
            <div className="plt-empty-title">No loads found</div>
            <div className="plt-empty-sub">Try adjusting your filters or check back soon for new postings.</div>
          </div>

        ) : (
          filteredLoads.map((load, idx) => {
            const eq = equipmentColors[load.equipment] || { bg: "#EFF1F5", color: "#6B7A8D" };
            const matchScore = aiMatch();
            const isSaved = savedLoads.includes(load.id);
            const isAiMatch = matchScore >= 92;

            return (
              <div key={load.id} className={`plt-load-card${isAiMatch ? " ai-match" : ""}`} style={{ animationDelay: `${idx * 0.04}s` }}>

                {/* TOP */}
                <div className="plt-load-top">
                  <div>
                    <div className="plt-load-name">
                      {cap(load.company_name)}
                      {load.broker_verified && <span className="plt-verified-badge">✓ VERIFIED</span>}
                      {isAiMatch && <span className="plt-ai-badge-pill">🤖 AI Match {matchScore}%</span>}
                    </div>
                    <div className="plt-load-route">
                      <span>{cap(load.pickup_location)}</span>
                      <span className="plt-load-arrow">→</span>
                      <span>{cap(load.delivery_location)}</span>
                    </div>
                  </div>
                  <div>
                    <div className="plt-rate">
                      ${load.total_rate}
                      <small>Total Rate</small>
                    </div>
                  </div>
                </div>

                {/* BODY: META + BOTTOM LEFT | MAP RIGHT */}
                <div className="plt-load-body">
                  <div className="plt-load-body-left">

                    {/* META */}
                    <div className="plt-load-meta">
                      <div className="plt-meta-item">
                        <div className="plt-meta-label">Equipment</div>
                        <div className="plt-meta-value">
                          <span className="plt-eq-tag" style={{ background: eq.bg, color: eq.color }}>{load.equipment}</span>
                        </div>
                      </div>
                      <div className="plt-meta-item">
                        <div className="plt-meta-label">Weight</div>
                        <div className="plt-meta-value">{load.weight || "N/A"}</div>
                      </div>
                      <div className="plt-meta-item">
                        <div className="plt-meta-label">MC Number</div>
                        <div className="plt-meta-value">{load.mc_number || "N/A"}</div>
                      </div>
                      <div className="plt-meta-item">
                        <div className="plt-meta-label">USDOT</div>
                        <div className="plt-meta-value">{load.usdot || "N/A"}</div>
                      </div>
                      <div className="plt-meta-item">
                        <div className="plt-meta-label">Pickup Date</div>
                        <div className="plt-meta-value" style={{ fontSize: "0.72rem" }}>{load.pickup_date ? new Date(load.pickup_date).toLocaleDateString() : "TBD"}</div>
                      </div>
                    </div>

                    {/* BOTTOM */}
                    <div className="plt-load-bottom">
                      <div className="plt-load-desc">
                        {load.description
                          ? <><b>Notes: </b>{load.description}</>
                          : <span style={{ color: "#6B7A8D" }}>No additional notes</span>
                        }
                      </div>
                      <div className="plt-load-actions">
                        <button className="plt-btn plt-btn-primary" onClick={() => setSelectedLoad(load)}>📋 Book Load</button>
                        <button className={`plt-btn plt-btn-save${isSaved ? " saved" : ""}`} onClick={() => toggleSaveLoad(load.id)}>
                          {isSaved ? "★ Saved" : "☆ Save"}
                        </button>
                        <button className="plt-btn plt-btn-ai">🤖 AI Assist</button>
                      </div>
                    </div>

                  </div>

                  {/* MAP PANEL */}
                  <div className="plt-load-map">
                    <iframe
                      loading="lazy"
                      src={`https://www.google.com/maps?q=${encodeURIComponent(load.pickup_location)}&output=embed`}
                      title={`Map for ${load.pickup_location}`}
                    />
                    <div className="plt-load-map-label">
                      📍 {cap(load.pickup_location)}
                    </div>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* ── BOOKING MODAL ── */}
      {selectedLoad && (
        <div className="plt-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setSelectedLoad(null); }}>
          <div className="plt-modal">
            <div className="plt-modal-header">
              <div className="plt-modal-eyebrow">📋 Booking Request</div>
              <div className="plt-modal-title">{cap(selectedLoad.company_name)}</div>
              <div className="plt-modal-route">
                {cap(selectedLoad.pickup_location)} → {cap(selectedLoad.delivery_location)} · ${selectedLoad.total_rate}
              </div>
            </div>

            <div className="plt-modal-divider" />

            <div className="plt-modal-fields">
              {[
                { label: "Carrier Name *",  placeholder: "Your company name",  key: "carrier_name", type: "text" },
                { label: "MC Number *",     placeholder: "MC-XXXXXX",          key: "mc_number",    type: "text" },
                { label: "Phone *",         placeholder: "Your phone number",  key: "phone",        type: "tel"  },
                { label: "Email *",         placeholder: "your@email.com",     key: "email",        type: "email" },
                { label: "Truck Type",      placeholder: "e.g. Dry Van 53ft",  key: "truck_type",   type: "text" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="plt-modal-label">{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={bookingForm[f.key as keyof typeof bookingForm]}
                    onChange={(e) => setBookingForm({ ...bookingForm, [f.key]: e.target.value })}
                    className="plt-modal-input"
                  />
                </div>
              ))}
              <div>
                <label className="plt-modal-label">Message (optional)</label>
                <textarea
                  placeholder="Any notes for the broker..."
                  value={bookingForm.message}
                  onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })}
                  className="plt-modal-input"
                  rows={3}
                  style={{ resize: "vertical" }}
                />
              </div>
            </div>

            <div className="plt-modal-actions">
              <button className="plt-modal-submit" onClick={handleBookLoad}>Submit Booking Request →</button>
              <button className="plt-modal-cancel" onClick={() => setSelectedLoad(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
