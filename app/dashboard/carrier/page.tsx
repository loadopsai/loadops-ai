"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

type Load = {
  id: string;
  company_name: string;
  contact: string;
  email: string;
  pickup_location: string;
  delivery_location: string;
  equipment: string;
  weight: string;
  total_rate: string;
  mc_number: string;
  usdot: string;
  pickup_date: string;
  delivery_date: string;
  description: string;
  status: string;
};

const equipmentColors: Record<string, { bg: string; color: string }> = {
  "Dry Van":            { bg: "#EBF1FD", color: "#1A56DB" },
  "Reefer":             { bg: "#E6F7EE", color: "#12A150" },
  "Flatbed":            { bg: "#FEF3C7", color: "#D97706" },
  "FlatBed":            { bg: "#FEF3C7", color: "#D97706" },
  "Box Truck":          { bg: "#EDE9FE", color: "#7C3AED" },
  "Sprinter/Cargo Van": { bg: "#FFF7ED", color: "#C2410C" },
  "Tanker":             { bg: "#FFF1F2", color: "#E11D48" },
  "HotShot":            { bg: "#F0FDF4", color: "#166534" },
  "Power Only":         { bg: "#EFF1F5", color: "#4A5568" },
};

export default function CarrierDashboard() {
  const DISPATCHER_ID = "7375649c-9e73-4341-b881-436614e375fa";
  const CARRIER_ID    = "f04084ee-60d8-4701-ad24-1a87a5dbc71d";

  const [loads, setLoads] = useState<Load[]>([]);
  const [filteredLoads, setFilteredLoads] = useState<Load[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [equipmentFilter, setEquipmentFilter] = useState("All");
  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null);
  const [activeTab, setActiveTab] = useState<"loads" | "profile" | "documents">("loads");

  const [profile, setProfile] = useState({
    company_name: "", owner_name: "", phone: "", email: "",
    mc_number: "", usdot: "", equipment: "", city: "", state: "",
    experience: "", preferred_lanes: "", about: "",
  });

  const fetchLoads = async () => {
    setLoading(true);
    const { data } = await supabase.from("loads").select("*").order("created_at", { ascending: false });
    if (data) { setLoads(data); setFilteredLoads(data); }
    setLoading(false);
  };

  useEffect(() => { fetchLoads(); }, []);

  useEffect(() => {
    const saved = localStorage.getItem("carrierProfile");
    if (saved) setProfile(JSON.parse(saved));
  }, []);

  useEffect(() => {
    let filtered = loads;
    if (search) filtered = filtered.filter((l) => `${l.pickup_location} ${l.delivery_location} ${l.company_name}`.toLowerCase().includes(search.toLowerCase()));
    if (equipmentFilter !== "All") filtered = filtered.filter((l) => l.equipment === equipmentFilter);
    setFilteredLoads(filtered);
  }, [search, equipmentFilter, loads]);

  const handleBookLoad = async (id: string) => {
    if (!confirm("Book this load?")) return;
    const { error } = await supabase.from("loads").update({ status: "booked" }).eq("id", id);
    if (error) { alert(error.message); } else { alert("Load booked successfully"); fetchLoads(); }
  };

  const saveProfile = () => {
    localStorage.setItem("carrierProfile", JSON.stringify(profile));
    alert("Profile saved");
  };

  const resetProfile = () => {
    if (!confirm("Reset profile?")) return;
    const empty = { company_name: "", owner_name: "", phone: "", email: "", mc_number: "", usdot: "", equipment: "", city: "", state: "", experience: "", preferred_lanes: "", about: "" };
    setProfile(empty);
    localStorage.removeItem("carrierProfile");
  };

  const cap = (text: string) => {
    if (!text) return "";
    return text.toLowerCase().split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  };

  const bookedLoads = loads.filter(l => l.status === "booked");
  const availableLoads = loads.filter(l => l.status === "available" || l.status !== "booked");
  const monthlyRevenue = bookedLoads.reduce((acc, l) => acc + Number(l.total_rate || 0), 0);

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

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 3px #E6F7EE; }
          50%       { box-shadow: 0 0 0 6px #E6F7EE; }
        }

        /* ── PAGE ── */
        .cd-page { max-width: 1200px; margin: 0 auto; padding: 36px 5% 80px; }

        /* ── HEADER ── */
        .cd-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; margin-bottom: 24px; flex-wrap: wrap; animation: fadeUp 0.5s ease both; }
        .cd-eyebrow { display: flex; align-items: center; gap: 8px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--blue); margin-bottom: 8px; }
        .cd-eyebrow::before { content: ''; width: 20px; height: 2px; background: var(--blue); border-radius: 1px; }
        .cd-live-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--green); animation: pulse 2s infinite; display: inline-block; }
        .cd-title { font-size: clamp(1.7rem, 3.5vw, 2.4rem); font-weight: 800; letter-spacing: -0.045em; color: var(--txt); line-height: 1.06; font-family: 'Plus Jakarta Sans', sans-serif; margin-bottom: 6px; }
        .cd-title em { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; color: var(--blue); }
        .cd-sub { font-size: 0.84rem; color: var(--txt3); font-weight: 400; }

        /* ── STATS ── */
        .cd-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; animation: fadeUp 0.5s 0.05s ease both; }
        .cd-stat { background: var(--white); border: 1px solid var(--border); border-radius: 14px; padding: 16px 18px; }
        .cd-stat-n { font-size: 1.55rem; font-weight: 800; color: var(--txt); letter-spacing: -0.04em; line-height: 1; margin-bottom: 4px; font-family: 'Plus Jakarta Sans', sans-serif; }
        .cd-stat-n.blue   { color: var(--blue);   }
        .cd-stat-n.green  { color: var(--green);  }
        .cd-stat-n.amber  { color: var(--amber);  }
        .cd-stat-l { font-size: 0.65rem; color: var(--txt3); font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; }

        /* ── TABS ── */
        .cd-tabs { display: flex; gap: 4px; background: var(--white); border: 1px solid var(--border); border-radius: 12px; padding: 4px; margin-bottom: 24px; width: fit-content; animation: fadeUp 0.5s 0.1s ease both; }
        .cd-tab { padding: 9px 20px; border-radius: 9px; font-size: 0.8rem; font-weight: 700; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; border: none; background: transparent; color: var(--txt3); transition: all 0.15s; display: flex; align-items: center; gap: 6px; }
        .cd-tab:hover { color: var(--txt); background: var(--bg); }
        .cd-tab.active { background: var(--blue); color: #fff; }
        .cd-tab-count { font-size: 0.6rem; font-weight: 800; padding: 1px 6px; border-radius: 8px; background: rgba(255,255,255,0.25); }

        /* ── SEARCH BAR ── */
        .cd-search-bar { background: var(--white); border: 1px solid var(--border); border-radius: 14px; padding: 16px 20px; margin-bottom: 20px; display: flex; gap: 10px; flex-wrap: wrap; animation: fadeUp 0.5s 0.12s ease both; }
        .cd-search-input { flex: 1; min-width: 220px; padding: 9px 14px; border-radius: 9px; background: var(--bg); border: 1.5px solid var(--border2); color: var(--txt); font-size: 0.82rem; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; transition: border-color 0.15s, box-shadow 0.15s; }
        .cd-search-input:focus { border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-l); }
        .cd-search-input::placeholder { color: var(--txt4); }
        .cd-filter-select { padding: 9px 14px; border-radius: 9px; background: var(--bg); border: 1.5px solid var(--border2); color: var(--txt); font-size: 0.82rem; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; cursor: pointer; }
        .cd-results-info { display: flex; align-items: center; gap: 8px; margin-left: auto; font-size: 0.72rem; color: var(--txt3); }
        .cd-results-count { font-size: 0.68rem; font-weight: 700; padding: 3px 10px; border-radius: 20px; background: var(--blue-l); color: var(--blue); }

        /* ── LOAD CARD ── */
        .cd-load-card { background: var(--white); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; margin-bottom: 14px; transition: box-shadow 0.2s; animation: fadeUp 0.4s ease both; }
        .cd-load-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.08); }
        .cd-load-card.booked { border-color: var(--green-m); background: linear-gradient(90deg, rgba(18,161,80,0.03) 0%, var(--white) 25%); }

        .cd-load-top { padding: 18px 22px 14px; border-bottom: 1px solid var(--border); display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
        .cd-load-route { font-size: 1.05rem; font-weight: 800; color: var(--txt); letter-spacing: -0.02em; margin-bottom: 5px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .cd-load-arrow { color: var(--txt4); font-weight: 400; }
        .cd-booked-badge { font-size: 0.6rem; font-weight: 800; padding: 2px 8px; border-radius: 4px; background: var(--green-l); color: var(--green); letter-spacing: 0.06em; text-transform: uppercase; }
        .cd-available-badge { font-size: 0.6rem; font-weight: 800; padding: 2px 8px; border-radius: 4px; background: var(--blue-l); color: var(--blue); letter-spacing: 0.06em; text-transform: uppercase; }
        .cd-company-row { font-size: 0.78rem; color: var(--txt3); font-weight: 400; }
        .cd-rate { font-size: 1.2rem; font-weight: 800; color: var(--green); letter-spacing: -0.03em; white-space: nowrap; }
        .cd-rate small { display: block; font-size: 0.65rem; font-weight: 400; color: var(--txt4); text-align: right; margin-top: 1px; }

        .cd-load-meta { display: grid; grid-template-columns: repeat(5, 1fr); padding: 12px 22px; background: var(--bg); border-bottom: 1px solid var(--border); gap: 12px; }
        .cd-meta-label { font-size: 0.6rem; font-weight: 700; color: var(--txt4); text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 3px; }
        .cd-meta-value { font-size: 0.78rem; font-weight: 600; color: var(--txt2); }
        .cd-eq-tag { display: inline-block; font-size: 0.63rem; font-weight: 700; padding: 2px 7px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.04em; }

        .cd-load-bottom { padding: 14px 22px; display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
        .cd-load-desc { font-size: 0.76rem; color: var(--txt3); line-height: 1.55; flex: 1; font-weight: 400; }
        .cd-load-desc b { color: var(--txt2); font-weight: 600; }
        .cd-load-actions { display: flex; gap: 8px; flex-shrink: 0; flex-wrap: wrap; }
        .cd-btn { padding: 8px 16px; border-radius: 8px; font-size: 0.74rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; display: inline-flex; align-items: center; gap: 5px; text-decoration: none; }
        .cd-btn-view   { background: var(--bg2); color: var(--txt2); border: 1.5px solid var(--border2); }
        .cd-btn-view:hover { border-color: var(--blue-m); color: var(--blue); }
        .cd-btn-book   { background: var(--blue); color: #fff; }
        .cd-btn-book:hover { background: var(--blue-h); transform: translateY(-1px); }
        .cd-btn-booked { background: var(--green-l); color: var(--green); border: 1.5px solid var(--green-m); cursor: not-allowed; }
        .cd-btn-chat   { background: var(--green); color: #fff; }
        .cd-btn-chat:hover { background: #0e8f45; transform: translateY(-1px); }

        /* ── LOADING / EMPTY ── */
        .cd-loading { text-align: center; padding: 80px 20px; }
        .cd-spinner { width: 38px; height: 38px; border: 3px solid var(--border); border-top-color: var(--blue); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 14px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .cd-loading-txt { font-size: 0.84rem; color: var(--txt3); font-weight: 500; }
        .cd-empty { text-align: center; padding: 80px 20px; background: var(--white); border: 1px solid var(--border); border-radius: 16px; }
        .cd-empty-icon { font-size: 2.2rem; margin-bottom: 10px; }
        .cd-empty-title { font-size: 0.9rem; font-weight: 700; color: var(--txt); margin-bottom: 5px; }
        .cd-empty-sub { font-size: 0.76rem; color: var(--txt3); }

        /* ── PROFILE CARD ── */
        .cd-card { background: var(--white); border: 1px solid var(--border); border-radius: 18px; overflow: hidden; margin-bottom: 20px; animation: fadeUp 0.5s ease both; }
        .cd-card-header { padding: 20px 24px 16px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
        .cd-card-title { font-size: 0.95rem; font-weight: 800; color: var(--txt); display: flex; align-items: center; gap: 8px; }
        .cd-card-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.95rem; }
        .cd-card-body { padding: 22px 24px 24px; }
        .cd-section-label { font-size: 0.65rem; font-weight: 700; color: var(--txt4); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 14px; margin-top: 20px; padding-bottom: 8px; border-bottom: 1px solid var(--border); }
        .cd-section-label:first-child { margin-top: 0; }
        .cd-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .cd-field {}
        .cd-label { display: block; font-size: 0.68rem; font-weight: 700; color: var(--txt2); margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.06em; }
        .cd-input { width: 100%; padding: 10px 13px; border-radius: 9px; background: var(--bg); border: 1.5px solid var(--border2); color: var(--txt); font-size: 0.82rem; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; transition: border-color 0.15s, box-shadow 0.15s; }
        .cd-input:focus { border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-l); background: var(--white); }
        .cd-input::placeholder { color: var(--txt4); }
        .cd-textarea { width: 100%; min-height: 100px; padding: 10px 13px; border-radius: 9px; background: var(--bg); border: 1.5px solid var(--border2); color: var(--txt); font-size: 0.82rem; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; transition: border-color 0.15s, box-shadow 0.15s; resize: vertical; line-height: 1.6; }
        .cd-textarea:focus { border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-l); background: var(--white); }
        .cd-textarea::placeholder { color: var(--txt4); }
        .cd-profile-actions { display: flex; gap: 10px; margin-top: 22px; flex-wrap: wrap; }
        .cd-save-btn { padding: 10px 24px; border-radius: 10px; background: var(--blue); color: #fff; font-size: 0.83rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; }
        .cd-save-btn:hover { background: var(--blue-h); transform: translateY(-1px); }
        .cd-reset-btn { padding: 10px 20px; border-radius: 10px; background: var(--red-l); color: var(--red); font-size: 0.83rem; font-weight: 700; border: 1.5px solid #FEE2E2; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; }
        .cd-reset-btn:hover { background: #FEE2E2; }

        /* ── DOCUMENTS ── */
        .cd-doc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .cd-doc-item { background: var(--bg); border: 1px solid var(--border); border-radius: 12px; padding: 16px; }
        .cd-doc-label { font-size: 0.72rem; font-weight: 700; color: var(--txt2); margin-bottom: 8px; display: flex; align-items: center; gap: 6px; text-transform: uppercase; letter-spacing: 0.06em; }
        .cd-doc-input { width: 100%; padding: 8px; border-radius: 8px; background: var(--white); border: 1.5px solid var(--border2); color: var(--txt); font-size: 0.78rem; font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer; }
        .cd-upload-btn { padding: 10px 24px; border-radius: 10px; background: var(--green); color: #fff; font-size: 0.83rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; margin-top: 18px; }
        .cd-upload-btn:hover { background: #0e8f45; transform: translateY(-1px); }

        /* ── MODAL ── */
        .cd-modal-overlay { position: fixed; inset: 0; background: rgba(15,21,32,0.55); backdrop-filter: blur(6px); z-index: 50; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .cd-modal { background: var(--white); border: 1px solid var(--border); border-radius: 20px; padding: 30px; width: 100%; max-width: 540px; box-shadow: 0 20px 60px rgba(0,0,0,0.14); max-height: 90vh; overflow-y: auto; }
        .cd-modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .cd-modal-title { font-size: 1.1rem; font-weight: 800; color: var(--txt); letter-spacing: -0.02em; }
        .cd-modal-close { width: 32px; height: 32px; border-radius: 8px; background: var(--bg2); border: none; cursor: pointer; font-size: 0.9rem; color: var(--txt3); display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
        .cd-modal-close:hover { background: var(--red-l); color: var(--red); }
        .cd-modal-divider { height: 1px; background: var(--border); margin: 14px 0; }
        .cd-modal-rows { display: flex; flex-direction: column; gap: 10px; }
        .cd-modal-row { display: flex; justify-content: space-between; align-items: flex-start; padding: 8px 0; border-bottom: 1px solid var(--border); }
        .cd-modal-row:last-child { border-bottom: none; }
        .cd-modal-row-label { font-size: 0.68rem; font-weight: 700; color: var(--txt4); text-transform: uppercase; letter-spacing: 0.07em; }
        .cd-modal-row-value { font-size: 0.8rem; font-weight: 600; color: var(--txt2); text-align: right; max-width: 60%; }
        .cd-modal-rate { font-size: 1.4rem; font-weight: 800; color: var(--green); letter-spacing: -0.03em; margin: 14px 0; }
        .cd-modal-actions { display: flex; gap: 10px; margin-top: 20px; }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .cd-stats { grid-template-columns: repeat(2, 1fr); }
          .cd-load-meta { grid-template-columns: repeat(3, 1fr); }
          .cd-doc-grid { grid-template-columns: 1fr; }
          .cd-grid-2 { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .cd-page { padding: 20px 4% 60px; }
          .cd-stats { grid-template-columns: repeat(2, 1fr); }
          .cd-load-meta { grid-template-columns: repeat(2, 1fr); }
          .cd-tabs { width: 100%; overflow-x: auto; }
        }
      `}</style>

      <div className="cd-page">

        {/* ── PAGE HEADER ── */}
        <div className="cd-header">
          <div>
            <div className="cd-eyebrow">
              <span className="cd-live-dot" />
              {" "}Carrier Dashboard
            </div>
            <div className="cd-title">Your <em>Load Board</em></div>
            <div className="cd-sub">AI-matched loads, broker verified, zero spam calls.</div>
          </div>
        </div>

        {/* ── STATS ── */}
        <div className="cd-stats">
          <div className="cd-stat">
            <div className="cd-stat-n blue">{filteredLoads.length}</div>
            <div className="cd-stat-l">Available Loads</div>
          </div>
          <div className="cd-stat">
            <div className="cd-stat-n">{bookedLoads.length}</div>
            <div className="cd-stat-l">Loads Booked</div>
          </div>
          <div className="cd-stat">
            <div className="cd-stat-n green">${monthlyRevenue.toLocaleString()}</div>
            <div className="cd-stat-l">Total Revenue</div>
          </div>
          <div className="cd-stat">
            <div className="cd-stat-n amber">{profile.mc_number || "—"}</div>
            <div className="cd-stat-l">MC Number</div>
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="cd-tabs">
          <button className={`cd-tab${activeTab === "loads" ? " active" : ""}`} onClick={() => setActiveTab("loads")}>
            🚛 Load Board
            {filteredLoads.length > 0 && <span className="cd-tab-count">{filteredLoads.length}</span>}
          </button>
          <button className={`cd-tab${activeTab === "profile" ? " active" : ""}`} onClick={() => setActiveTab("profile")}>
            👤 My Profile
          </button>
          <button className={`cd-tab${activeTab === "documents" ? " active" : ""}`} onClick={() => setActiveTab("documents")}>
            📋 Documents
          </button>
        </div>

        {/* ═══════════════════════════════ */}
        {/* TAB: LOAD BOARD                */}
        {/* ═══════════════════════════════ */}
        {activeTab === "loads" && (
          <>
            {/* SEARCH BAR */}
            <div className="cd-search-bar">
              <input
                className="cd-search-input"
                placeholder="🔍  Search by city, company, or route..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select className="cd-filter-select" value={equipmentFilter} onChange={(e) => setEquipmentFilter(e.target.value)}>
                <option value="All">All Equipment</option>
                <optgroup label="Van & Cargo">
                  <option>Dry Van</option>
                  <option>Reefer</option>
                  <option>Box Truck</option>
                  <option>Sprinter/Cargo Van</option>
                </optgroup>
                <optgroup label="Flatbed & Heavy">
                  <option>FlatBed</option>
                  <option>Step Deck</option>
                </optgroup>
                <optgroup label="Specialized">
                  <option>Tanker</option>
                  <option>HotShot</option>
                  <option>Power Only</option>
                </optgroup>
              </select>
              <div className="cd-results-info">
                <div className="cd-results-count">{filteredLoads.length} results</div>
              </div>
            </div>

            {/* LOADS */}
            {loading ? (
              <div className="cd-loading">
                <div className="cd-spinner" />
                <div className="cd-loading-txt">Loading loads...</div>
              </div>

            ) : filteredLoads.length === 0 ? (
              <div className="cd-empty">
                <div className="cd-empty-icon">📭</div>
                <div className="cd-empty-title">No loads found</div>
                <div className="cd-empty-sub">Try adjusting your search or equipment filter.</div>
              </div>

            ) : (
              filteredLoads.map((load, idx) => {
                const eq = equipmentColors[load.equipment] || { bg: "#EFF1F5", color: "#6B7A8D" };
                const isBooked = load.status === "booked";
                return (
                  <div key={load.id} className={`cd-load-card${isBooked ? " booked" : ""}`} style={{ animationDelay: `${idx * 0.04}s` }}>

                    <div className="cd-load-top">
                      <div>
                        <div className="cd-load-route">
                          {cap(load.pickup_location)}
                          <span className="cd-load-arrow">→</span>
                          {cap(load.delivery_location)}
                          {isBooked
                            ? <span className="cd-booked-badge">✓ Booked</span>
                            : <span className="cd-available-badge">Available</span>
                          }
                        </div>
                        <div className="cd-company-row">{load.company_name} · {load.contact} · {load.email}</div>
                      </div>
                      <div>
                        <div className="cd-rate">${load.total_rate}<small>Total Rate</small></div>
                      </div>
                    </div>

                    <div className="cd-load-meta">
                      <div>
                        <div className="cd-meta-label">Equipment</div>
                        <div className="cd-meta-value">
                          <span className="cd-eq-tag" style={{ background: eq.bg, color: eq.color }}>{load.equipment}</span>
                        </div>
                      </div>
                      <div>
                        <div className="cd-meta-label">Weight</div>
                        <div className="cd-meta-value">{load.weight || "N/A"}</div>
                      </div>
                      <div>
                        <div className="cd-meta-label">MC Number</div>
                        <div className="cd-meta-value">{load.mc_number || "N/A"}</div>
                      </div>
                      <div>
                        <div className="cd-meta-label">USDOT</div>
                        <div className="cd-meta-value">{load.usdot || "N/A"}</div>
                      </div>
                      <div>
                        <div className="cd-meta-label">Pickup Date</div>
                        <div className="cd-meta-value" style={{ fontSize: "0.72rem" }}>
                          {load.pickup_date ? new Date(load.pickup_date).toLocaleDateString() : "TBD"}
                        </div>
                      </div>
                    </div>

                    <div className="cd-load-bottom">
                      <div className="cd-load-desc">
                        {load.description
                          ? <><b>Notes: </b>{load.description}</>
                          : <span style={{ color: "#6B7A8D" }}>No additional notes</span>
                        }
                      </div>
                      <div className="cd-load-actions">
                        <button className="cd-btn cd-btn-view" onClick={() => setSelectedLoad(load)}>📄 Details</button>
                        {isBooked
                          ? <button className="cd-btn cd-btn-booked" disabled>✓ Booked</button>
                          : <button className="cd-btn cd-btn-book" onClick={() => handleBookLoad(load.id)}>📋 Book Load</button>
                        }
                        <a className="cd-btn cd-btn-chat" href={`/chat?receiver=${DISPATCHER_ID}`}>
                          💬 Chat
                        </a>
                      </div>
                    </div>

                  </div>
                );
              })
            )}
          </>
        )}

        {/* ═══════════════════════════════ */}
        {/* TAB: PROFILE                   */}
        {/* ═══════════════════════════════ */}
        {activeTab === "profile" && (
          <div className="cd-card">
            <div className="cd-card-header">
              <div className="cd-card-title">
                <div className="cd-card-icon" style={{ background: "#EBF1FD" }}>🚛</div>
                Carrier Profile
              </div>
              <button className="cd-reset-btn" onClick={resetProfile}>✕ Reset</button>
            </div>
            <div className="cd-card-body">

              <div className="cd-section-label">Company & Contact</div>
              <div className="cd-grid-2">
                {[
                  { key: "company_name",   label: "Company Name",  placeholder: "Smith Trucking LLC" },
                  { key: "owner_name",     label: "Owner Name",    placeholder: "John Smith"         },
                  { key: "phone",          label: "Phone",         placeholder: "+1 234 567 890"     },
                  { key: "email",          label: "Email",         placeholder: "john@trucking.com"  },
                  { key: "city",           label: "City",          placeholder: "Dallas"             },
                  { key: "state",          label: "State",         placeholder: "TX"                 },
                ].map((f) => (
                  <div key={f.key} className="cd-field">
                    <label className="cd-label">{f.label}</label>
                    <input
                      className="cd-input"
                      placeholder={f.placeholder}
                      value={(profile as any)[f.key]}
                      onChange={(e) => setProfile({ ...profile, [f.key]: e.target.value })}
                    />
                  </div>
                ))}
              </div>

              <div className="cd-section-label">Compliance & Equipment</div>
              <div className="cd-grid-2">
                {[
                  { key: "mc_number",   label: "MC Number",      placeholder: "MC-123456"      },
                  { key: "usdot",       label: "USDOT",          placeholder: "USDOT-123456"   },
                  { key: "equipment",   label: "Equipment Type", placeholder: "Dry Van 53ft"   },
                  { key: "experience",  label: "Experience",     placeholder: "5 Years"        },
                ].map((f) => (
                  <div key={f.key} className="cd-field">
                    <label className="cd-label">{f.label}</label>
                    <input
                      className="cd-input"
                      placeholder={f.placeholder}
                      value={(profile as any)[f.key]}
                      onChange={(e) => setProfile({ ...profile, [f.key]: f.key === "usdot" ? e.target.value.toUpperCase() : e.target.value })}
                    />
                  </div>
                ))}
              </div>

              <div className="cd-section-label">Preferences</div>
              <div className="cd-field" style={{ marginBottom: 14 }}>
                <label className="cd-label">Preferred Lanes</label>
                <input className="cd-input" placeholder="e.g. TX → CA, Midwest OTR" value={profile.preferred_lanes} onChange={(e) => setProfile({ ...profile, preferred_lanes: e.target.value })} />
              </div>
              <div className="cd-field">
                <label className="cd-label">About Your Company</label>
                <textarea className="cd-textarea" placeholder="Describe your company, specialties, and what makes you reliable..." value={profile.about} onChange={(e) => setProfile({ ...profile, about: e.target.value })} />
              </div>

              <div className="cd-profile-actions">
                <button className="cd-save-btn" onClick={saveProfile}>✓ Save Profile</button>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════ */}
        {/* TAB: DOCUMENTS                 */}
        {/* ═══════════════════════════════ */}
        {activeTab === "documents" && (
          <div className="cd-card">
            <div className="cd-card-header">
              <div className="cd-card-title">
                <div className="cd-card-icon" style={{ background: "#E6F7EE" }}>📋</div>
                Carrier Documents
              </div>
            </div>
            <div className="cd-card-body">
              <div className="cd-section-label">Upload Required Documents</div>
              <div className="cd-doc-grid">
                {[
                  { label: "📄 MC Authority",          icon: "📄" },
                  { label: "🔒 Insurance Certificate", icon: "🔒" },
                  { label: "📝 W9 Form",               icon: "📝" },
                  { label: "🪪 Driver License",        icon: "🪪" },
                  { label: "🚛 Vehicle Registration",  icon: "🚛" },
                  { label: "🛡 FMCSA Safety Rating",   icon: "🛡" },
                ].map((d, i) => (
                  <div key={i} className="cd-doc-item">
                    <div className="cd-doc-label">{d.label}</div>
                    <input type="file" className="cd-doc-input" />
                  </div>
                ))}
              </div>
              <button className="cd-upload-btn">📤 Upload All Documents</button>
            </div>
          </div>
        )}

      </div>

      {/* ── LOAD DETAILS MODAL ── */}
      {selectedLoad && (
        <div className="cd-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setSelectedLoad(null); }}>
          <div className="cd-modal">
            <div className="cd-modal-header">
              <div className="cd-modal-title">📄 Load Details</div>
              <button className="cd-modal-close" onClick={() => setSelectedLoad(null)}>✕</button>
            </div>

            <div className="cd-modal-rate">${selectedLoad.total_rate}</div>

            <div className="cd-modal-divider" />

            <div className="cd-modal-rows">
              {[
                { label: "Pickup",      value: cap(selectedLoad.pickup_location)    },
                { label: "Delivery",    value: cap(selectedLoad.delivery_location)  },
                { label: "Equipment",   value: selectedLoad.equipment               },
                { label: "Weight",      value: selectedLoad.weight || "N/A"         },
                { label: "Company",     value: selectedLoad.company_name            },
                { label: "Contact",     value: selectedLoad.contact || "N/A"        },
                { label: "Email",       value: selectedLoad.email || "N/A"          },
                { label: "MC Number",   value: selectedLoad.mc_number || "N/A"      },
                { label: "USDOT",       value: selectedLoad.usdot || "N/A"          },
                { label: "Pickup Date", value: selectedLoad.pickup_date ? new Date(selectedLoad.pickup_date).toLocaleDateString() : "TBD" },
                { label: "Status",      value: selectedLoad.status || "available"   },
              ].map((r, i) => (
                <div key={i} className="cd-modal-row">
                  <span className="cd-modal-row-label">{r.label}</span>
                  <span className="cd-modal-row-value">{r.value}</span>
                </div>
              ))}
              {selectedLoad.description && (
                <div style={{ paddingTop: 10 }}>
                  <div className="cd-modal-row-label" style={{ marginBottom: 6 }}>Notes</div>
                  <div style={{ fontSize: "0.8rem", color: "#4A5568", lineHeight: 1.6 }}>{selectedLoad.description}</div>
                </div>
              )}
            </div>

            <div className="cd-modal-actions">
              {selectedLoad.status !== "booked"
                ? <button className="cd-btn cd-btn-book" style={{ flex: 1, justifyContent: "center" }} onClick={() => { handleBookLoad(selectedLoad.id); setSelectedLoad(null); }}>📋 Book This Load</button>
                : <button className="cd-btn cd-btn-booked" style={{ flex: 1, justifyContent: "center" }} disabled>✓ Already Booked</button>
              }
              <a className="cd-btn cd-btn-chat" href={`/chat?receiver=${DISPATCHER_ID}`}>💬 Chat</a>
              <button className="cd-btn cd-btn-view" onClick={() => setSelectedLoad(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
