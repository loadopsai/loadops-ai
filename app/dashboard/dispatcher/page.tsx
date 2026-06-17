"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

type DispatcherProfile = {
  id?: string;
  user_id?: string;
  full_name: string;
  company_name: string;
  phone: string;
  email: string;
  experience: string;
  truck_types: string;
  lanes: string;
  mc_number: string;
  dot_number: string;
  dispatch_fee: string;
  website: string;
  linkedin: string;
  city: string;
  state: string;
  total_loads_booked: string;
  active_carriers: string;
  bio: string;
  available_24_7: boolean;
  setup_packets: boolean;
  factoring_help: boolean;
  profile_image?: string;
};

type DispatcherLoad = {
  id?: string;
  dispatcher_id?: string;
  title: string;
  pickup_location: string;
  delivery_location: string;
  equipment: string;
  load_type: string;
  weight: string;
  rate: string;
  miles: string;
  pickup_date: string;
  notes: string;
  created_at?: string;
};

const equipmentColors: Record<string, { bg: string; color: string }> = {
  "Dry Van":            { bg: "#EBF1FD", color: "#1A56DB" },
  "Reefer":             { bg: "#E6F7EE", color: "#12A150" },
  "Flatbed":            { bg: "#FEF3C7", color: "#D97706" },
  "Box Truck":          { bg: "#EDE9FE", color: "#7C3AED" },
  "Sprinter/Cargo Van": { bg: "#FFF7ED", color: "#C2410C" },
  "Tanker":             { bg: "#FFF1F2", color: "#E11D48" },
  "HotShot":            { bg: "#F0FDF4", color: "#166534" },
  "Power Only":         { bg: "#EFF1F5", color: "#4A5568" },
};

export default function DispatcherDashboard() {
  const [loading, setLoading] = useState(false);
  const [loadLoading, setLoadLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [dispatcherLoads, setDispatcherLoads] = useState<DispatcherLoad[]>([]);
  const [activeTab, setActiveTab] = useState<"profile" | "loads" | "posted">("profile");

  const [form, setForm] = useState<DispatcherProfile>({
    full_name: "", company_name: "", phone: "", email: "", experience: "",
    truck_types: "", lanes: "", mc_number: "", dot_number: "", dispatch_fee: "",
    website: "", linkedin: "", city: "", state: "", total_loads_booked: "",
    active_carriers: "", bio: "", available_24_7: false, setup_packets: false, factoring_help: false,
  });

  const [loadForm, setLoadForm] = useState<DispatcherLoad>({
    title: "", pickup_location: "", delivery_location: "", equipment: "",
    load_type: "", weight: "", rate: "", miles: "", pickup_date: "", notes: "",
  });

  useEffect(() => { fetchProfile(); fetchLoads(); }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("dispatcher_profiles").select("*").eq("user_id", user.id).single();
    if (data) setForm(data);
  };

  const fetchLoads = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("dispatcher_loads").select("*").eq("dispatcher_id", user.id).order("created_at", { ascending: false });
    if (data) setDispatcherLoads(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value });
  };

  const handleLoadChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setLoadForm({ ...loadForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { alert("Please login first"); setLoading(false); return; }
    let profileImageUrl = form.profile_image || "";
    if (profileImage) {
      const fileName = `${Date.now()}-${profileImage.name}`;
      const { error } = await supabase.storage.from("dispatcher-files").upload(`profiles/${fileName}`, profileImage);
      if (!error) {
        const { data } = supabase.storage.from("dispatcher-files").getPublicUrl(`profiles/${fileName}`);
        profileImageUrl = data.publicUrl;
      }
    }
    const { error } = await supabase.from("dispatcher_profiles").upsert([{ user_id: user.id, ...form, profile_image: profileImageUrl }]);
    setLoading(false);
    if (error) { alert(error.message); } else { alert("Dispatcher profile saved successfully"); }
  };

  const handlePostLoad = async () => {
    setLoadLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { alert("Please login first"); setLoadLoading(false); return; }
    const { error } = await supabase.from("dispatcher_loads").insert([{ dispatcher_id: user.id, ...loadForm }]);
    setLoadLoading(false);
    if (error) { alert(error.message); } else {
      alert("Load posted");
      setLoadForm({ title: "", pickup_location: "", delivery_location: "", equipment: "", load_type: "", weight: "", rate: "", miles: "", pickup_date: "", notes: "" });
      fetchLoads();
      setActiveTab("posted");
    }
  };

  const deleteLoad = async (id?: string) => {
    if (!id) return;
    if (!confirm("Delete this load?")) return;
    await supabase.from("dispatcher_loads").delete().eq("id", id);
    fetchLoads();
  };

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
          0%, 100% { box-shadow: 0 0 0 3px #EDE9FE; }
          50%       { box-shadow: 0 0 0 6px #EDE9FE; }
        }

        /* ── PAGE ── */
        .dd-page { max-width: 1200px; margin: 0 auto; padding: 36px 5% 80px; }

        /* ── PAGE HEADER ── */
        .dd-header { margin-bottom: 28px; animation: fadeUp 0.5s ease both; }
        .dd-eyebrow { display: flex; align-items: center; gap: 8px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--purple); margin-bottom: 10px; }
        .dd-eyebrow::before { content: ''; width: 20px; height: 2px; background: var(--purple); border-radius: 1px; }
        .dd-title { font-size: clamp(1.7rem, 3.5vw, 2.4rem); font-weight: 800; letter-spacing: -0.045em; color: var(--txt); line-height: 1.06; margin-bottom: 6px; font-family: 'Plus Jakarta Sans', sans-serif; }
        .dd-title em { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; color: var(--purple); }
        .dd-sub { font-size: 0.84rem; color: var(--txt3); font-weight: 400; }

        /* ── STATS ── */
        .dd-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; animation: fadeUp 0.5s 0.05s ease both; }
        .dd-stat { background: var(--white); border: 1px solid var(--border); border-radius: 14px; padding: 16px 18px; }
        .dd-stat-n { font-size: 1.45rem; font-weight: 800; color: var(--txt); letter-spacing: -0.04em; line-height: 1; margin-bottom: 4px; font-family: 'Plus Jakarta Sans', sans-serif; }
        .dd-stat-n.purple { color: var(--purple); }
        .dd-stat-n.green  { color: var(--green);  }
        .dd-stat-n.blue   { color: var(--blue);   }
        .dd-stat-l { font-size: 0.65rem; color: var(--txt3); font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; }

        /* ── TABS ── */
        .dd-tabs { display: flex; gap: 4px; background: var(--white); border: 1px solid var(--border); border-radius: 12px; padding: 4px; margin-bottom: 24px; width: fit-content; animation: fadeUp 0.5s 0.1s ease both; }
        .dd-tab { padding: 9px 20px; border-radius: 9px; font-size: 0.8rem; font-weight: 700; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; border: none; background: transparent; color: var(--txt3); transition: all 0.15s; display: flex; align-items: center; gap: 6px; }
        .dd-tab:hover { color: var(--txt); background: var(--bg); }
        .dd-tab.active { background: var(--purple); color: #fff; }
        .dd-tab-count { font-size: 0.6rem; font-weight: 800; padding: 1px 6px; border-radius: 8px; background: rgba(255,255,255,0.25); }

        /* ── CARD ── */
        .dd-card { background: var(--white); border: 1px solid var(--border); border-radius: 18px; overflow: hidden; margin-bottom: 20px; animation: fadeUp 0.5s ease both; }

        /* ── CARD HEADER ── */
        .dd-card-header { padding: 22px 26px 18px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
        .dd-card-title { font-size: 1rem; font-weight: 800; color: var(--txt); letter-spacing: -0.02em; display: flex; align-items: center; gap: 8px; }
        .dd-card-title-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.95rem; }
        .dd-verified-badge { font-size: 0.6rem; font-weight: 800; padding: 3px 10px; border-radius: 20px; background: var(--green-l); color: var(--green); letter-spacing: 0.06em; text-transform: uppercase; }

        /* ── PROFILE IMAGE ── */
        .dd-img-section { padding: 22px 26px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 20px; background: linear-gradient(135deg, var(--purple-l) 0%, var(--white) 100%); }
        .dd-avatar { width: 88px; height: 88px; border-radius: 50%; object-fit: cover; border: 3px solid var(--purple); flex-shrink: 0; }
        .dd-avatar-placeholder { width: 88px; height: 88px; border-radius: 50%; background: var(--purple-l); border: 3px solid var(--purple-m); display: flex; align-items: center; justify-content: center; font-size: 2rem; flex-shrink: 0; }
        .dd-img-info { flex: 1; }
        .dd-img-name { font-size: 1rem; font-weight: 800; color: var(--txt); margin-bottom: 4px; }
        .dd-img-company { font-size: 0.8rem; color: var(--purple); font-weight: 600; margin-bottom: 10px; }
        .dd-upload-label { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 8px; background: var(--purple-l); color: var(--purple); font-size: 0.74rem; font-weight: 700; cursor: pointer; border: 1.5px solid var(--purple-m); transition: all 0.15s; font-family: 'Plus Jakarta Sans', sans-serif; }
        .dd-upload-label:hover { background: var(--purple); color: #fff; }
        .dd-upload-input { display: none; }

        /* ── FORM BODY ── */
        .dd-form-body { padding: 22px 26px 26px; }
        .dd-section-label { font-size: 0.65rem; font-weight: 700; color: var(--txt4); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 14px; margin-top: 22px; padding-bottom: 8px; border-bottom: 1px solid var(--border); }
        .dd-section-label:first-child { margin-top: 0; }
        .dd-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .dd-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }

        /* ── FIELD ── */
        .dd-field {}
        .dd-label { display: block; font-size: 0.68rem; font-weight: 700; color: var(--txt2); margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.06em; }
        .dd-required { color: var(--red); margin-left: 2px; }
        .dd-input {
          width: 100%; padding: 10px 13px; border-radius: 9px;
          background: var(--bg); border: 1.5px solid var(--border2);
          color: var(--txt); font-size: 0.82rem; font-family: 'Plus Jakarta Sans', sans-serif;
          outline: none; transition: border-color 0.15s, box-shadow 0.15s;
        }
        .dd-input:focus { border-color: var(--purple); box-shadow: 0 0 0 3px var(--purple-l); background: var(--white); }
        .dd-input::placeholder { color: var(--txt4); }
        .dd-textarea { width: 100%; min-height: 110px; padding: 10px 13px; border-radius: 9px; background: var(--bg); border: 1.5px solid var(--border2); color: var(--txt); font-size: 0.82rem; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; transition: border-color 0.15s, box-shadow 0.15s; resize: vertical; line-height: 1.6; }
        .dd-textarea:focus { border-color: var(--purple); box-shadow: 0 0 0 3px var(--purple-l); background: var(--white); }
        .dd-textarea::placeholder { color: var(--txt4); }

        /* ── CHECKBOXES ── */
        .dd-check-grid { display: flex; gap: 16px; flex-wrap: wrap; margin: 16px 0 22px; }
        .dd-check-item { display: flex; align-items: center; gap: 9px; padding: 10px 16px; border-radius: 10px; border: 1.5px solid var(--border2); background: var(--white); cursor: pointer; transition: all 0.15s; font-family: 'Plus Jakarta Sans', sans-serif; }
        .dd-check-item:hover { border-color: var(--purple-m); background: var(--purple-l); }
        .dd-check-item.checked { border-color: var(--purple-m); background: var(--purple-l); }
        .dd-checkbox { width: 16px; height: 16px; border-radius: 4px; border: 1.5px solid var(--border2); background: var(--bg); appearance: none; outline: none; cursor: pointer; transition: all 0.15s; flex-shrink: 0; }
        .dd-checkbox:checked { background: var(--purple); border-color: var(--purple); }
        .dd-check-label { font-size: 0.78rem; font-weight: 600; color: var(--txt2); }

        /* ── SAVE BUTTON ── */
        .dd-save-btn { padding: 11px 28px; border-radius: 10px; background: var(--purple); color: #fff; font-size: 0.84rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; box-shadow: 0 1px 3px rgba(124,58,237,0.3), 0 4px 16px rgba(124,58,237,0.2); }
        .dd-save-btn:hover { background: #6D28D9; transform: translateY(-1px); }
        .dd-save-btn:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }

        /* ── POST LOAD FORM ── */
        .dd-post-btn { padding: 11px 28px; border-radius: 10px; background: var(--blue); color: #fff; font-size: 0.84rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; box-shadow: 0 1px 3px rgba(26,86,219,0.3), 0 4px 16px rgba(26,86,219,0.2); }
        .dd-post-btn:hover { background: var(--blue-h); transform: translateY(-1px); }
        .dd-post-btn:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }

        /* ── LOAD CARDS ── */
        .dd-load-card { background: var(--white); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; margin-bottom: 12px; transition: box-shadow 0.18s; }
        .dd-load-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.07); }

        .dd-lcard-top { padding: 16px 20px 14px; border-bottom: 1px solid var(--border); display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
        .dd-lcard-title { font-size: 0.95rem; font-weight: 800; color: var(--txt); letter-spacing: -0.02em; margin-bottom: 4px; }
        .dd-lcard-route { font-size: 0.78rem; color: var(--txt3); display: flex; align-items: center; gap: 6px; font-weight: 400; }
        .dd-lcard-arrow { color: var(--txt4); }
        .dd-lcard-rate { font-size: 1.15rem; font-weight: 800; color: var(--green); letter-spacing: -0.03em; white-space: nowrap; }
        .dd-lcard-miles { font-size: 0.68rem; color: var(--txt4); text-align: right; margin-top: 2px; }

        .dd-lcard-meta { padding: 12px 20px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; background: var(--bg); border-bottom: 1px solid var(--border); }
        .dd-lmeta-label { font-size: 0.6rem; font-weight: 700; color: var(--txt4); text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 3px; }
        .dd-lmeta-value { font-size: 0.77rem; font-weight: 600; color: var(--txt2); }
        .dd-eq-tag { display: inline-block; font-size: 0.63rem; font-weight: 700; padding: 2px 7px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.04em; }

        .dd-lcard-bottom { padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
        .dd-lcard-notes { font-size: 0.76rem; color: var(--txt3); line-height: 1.55; flex: 1; font-weight: 400; }
        .dd-lcard-notes b { color: var(--txt2); font-weight: 600; }
        .dd-lcard-actions { display: flex; gap: 8px; flex-shrink: 0; }
        .dd-lbtn { padding: 7px 16px; border-radius: 8px; font-size: 0.73rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; text-decoration: none; display: inline-flex; align-items: center; gap: 5px; }
        .dd-lbtn-chat   { background: var(--green-l);  color: var(--green);  border: 1.5px solid var(--green-m); }
        .dd-lbtn-chat:hover  { background: var(--green);  color: #fff; }
        .dd-lbtn-delete { background: var(--red-l);    color: var(--red);    border: 1.5px solid #FEE2E2; }
        .dd-lbtn-delete:hover { background: #FEE2E2; }

        /* ── EMPTY ── */
        .dd-empty { text-align: center; padding: 60px 20px; background: var(--white); border: 1px solid var(--border); border-radius: 14px; }
        .dd-empty-icon { font-size: 2.2rem; margin-bottom: 10px; }
        .dd-empty-title { font-size: 0.9rem; font-weight: 700; color: var(--txt); margin-bottom: 5px; }
        .dd-empty-sub { font-size: 0.76rem; color: var(--txt3); }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .dd-grid-2, .dd-grid-3 { grid-template-columns: 1fr 1fr; }
          .dd-stats { grid-template-columns: repeat(2, 1fr); }
          .dd-lcard-meta { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .dd-page { padding: 20px 4% 60px; }
          .dd-grid-2, .dd-grid-3 { grid-template-columns: 1fr; }
          .dd-stats { grid-template-columns: repeat(2, 1fr); }
          .dd-tabs { width: 100%; overflow-x: auto; }
        }
      `}</style>

      <div className="dd-page">

        {/* ── PAGE HEADER ── */}
        <div className="dd-header">
          <div className="dd-eyebrow">Dispatcher Dashboard</div>
          <div className="dd-title">Your Professional <em>Dispatch Hub</em></div>
          <div className="dd-sub">Manage your profile, post available loads, and grow your carrier network.</div>
        </div>

        {/* ── STATS ── */}
        <div className="dd-stats">
          <div className="dd-stat">
            <div className="dd-stat-n purple">{form.active_carriers || "—"}</div>
            <div className="dd-stat-l">Active Carriers</div>
          </div>
          <div className="dd-stat">
            <div className="dd-stat-n green">{form.total_loads_booked || "—"}</div>
            <div className="dd-stat-l">Loads Booked</div>
          </div>
          <div className="dd-stat">
            <div className="dd-stat-n blue">{dispatcherLoads.length}</div>
            <div className="dd-stat-l">Posted Loads</div>
          </div>
          <div className="dd-stat">
            <div className="dd-stat-n">{form.experience ? `${form.experience}yr` : "—"}</div>
            <div className="dd-stat-l">Experience</div>
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="dd-tabs">
          <button className={`dd-tab${activeTab === "profile" ? " active" : ""}`} onClick={() => setActiveTab("profile")}>
            👤 Profile
          </button>
          <button className={`dd-tab${activeTab === "loads" ? " active" : ""}`} onClick={() => setActiveTab("loads")}>
            📦 Post Load
          </button>
          <button className={`dd-tab${activeTab === "posted" ? " active" : ""}`} onClick={() => setActiveTab("posted")}>
            📋 My Loads
            {dispatcherLoads.length > 0 && <span className="dd-tab-count">{dispatcherLoads.length}</span>}
          </button>
        </div>

        {/* ═══════════════════════════════ */}
        {/* TAB: PROFILE                   */}
        {/* ═══════════════════════════════ */}
        {activeTab === "profile" && (
          <div className="dd-card">

            {/* CARD HEADER */}
            <div className="dd-card-header">
              <div className="dd-card-title">
                <div className="dd-card-title-icon" style={{ background: "#EDE9FE" }}>🎯</div>
                Dispatcher Profile
              </div>
              <div className="dd-verified-badge">✓ VERIFIED DISPATCHER</div>
            </div>

            {/* PROFILE IMAGE */}
            <div className="dd-img-section">
              {form.profile_image
                ? <img src={form.profile_image} alt="profile" className="dd-avatar" />
                : <div className="dd-avatar-placeholder">👤</div>
              }
              <div className="dd-img-info">
                <div className="dd-img-name">{form.full_name || "Your Name"}</div>
                <div className="dd-img-company">{form.company_name || "Your Company"}</div>
                <label className="dd-upload-label">
                  📷 Upload Photo
                  <input type="file" accept="image/*" className="dd-upload-input" onChange={(e) => setProfileImage(e.target.files?.[0] || null)} />
                </label>
              </div>
            </div>

            <div className="dd-form-body">

              {/* PERSONAL INFO */}
              <div className="dd-section-label">Personal & Contact Information</div>
              <div className="dd-grid-2">
                {[
                  { name: "full_name",    label: "Full Name",    placeholder: "John Smith",          required: true  },
                  { name: "company_name", label: "Company Name", placeholder: "Elite Dispatch LLC",  required: true  },
                  { name: "phone",        label: "Phone",        placeholder: "+1 234 567 890",       required: true  },
                  { name: "email",        label: "Email",        placeholder: "dispatch@email.com",   required: true  },
                  { name: "city",         label: "City",         placeholder: "Dallas",               required: false },
                  { name: "state",        label: "State",        placeholder: "TX",                   required: false },
                  { name: "website",      label: "Website",      placeholder: "https://yoursite.com", required: false },
                  { name: "linkedin",     label: "LinkedIn",     placeholder: "linkedin.com/in/...",  required: false },
                ].map((f) => (
                  <div key={f.name} className="dd-field">
                    <label className="dd-label">
                      {f.label}{f.required && <span className="dd-required">*</span>}
                    </label>
                    <input name={f.name} value={(form as any)[f.name]} onChange={handleChange} placeholder={f.placeholder} className="dd-input" />
                  </div>
                ))}
              </div>

              {/* DISPATCH EXPERTISE */}
              <div className="dd-section-label">Dispatch Expertise</div>
              <div className="dd-grid-3">
                {[
                  { name: "experience",    label: "Years of Experience", placeholder: "5 Years"         },
                  { name: "truck_types",   label: "Truck Types",         placeholder: "Dry Van, Reefer" },
                  { name: "lanes",         label: "Preferred Lanes",     placeholder: "TX → CA"         },
                  { name: "dispatch_fee",  label: "Dispatch Fee",        placeholder: "5% or $300/week" },
                  { name: "mc_number",     label: "MC Number",           placeholder: "MC-123456"       },
                  { name: "dot_number",    label: "DOT Number",          placeholder: "USDOT-123456"    },
                ].map((f) => (
                  <div key={f.name} className="dd-field">
                    <label className="dd-label">{f.label}</label>
                    <input name={f.name} value={(form as any)[f.name]} onChange={handleChange} placeholder={f.placeholder} className="dd-input" />
                  </div>
                ))}
              </div>

              {/* PERFORMANCE */}
              <div className="dd-section-label">Performance Stats</div>
              <div className="dd-grid-2">
                <div className="dd-field">
                  <label className="dd-label">Total Loads Booked</label>
                  <input name="total_loads_booked" value={form.total_loads_booked} onChange={handleChange} placeholder="e.g. 1,240" className="dd-input" />
                </div>
                <div className="dd-field">
                  <label className="dd-label">Active Carriers Managed</label>
                  <input name="active_carriers" value={form.active_carriers} onChange={handleChange} placeholder="e.g. 12" className="dd-input" />
                </div>
              </div>

              {/* BIO */}
              <div className="dd-section-label">About You</div>
              <div className="dd-field">
                <label className="dd-label">Dispatcher Bio</label>
                <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Tell carriers about your dispatch service, specialties, and what makes you reliable..." className="dd-textarea" />
              </div>

              {/* SERVICES */}
              <div className="dd-section-label">Additional Services</div>
              <div className="dd-check-grid">
                {[
                  { name: "available_24_7",  label: "⏰ Available 24/7"        },
                  { name: "factoring_help",   label: "💳 Factoring Assistance"  },
                  { name: "setup_packets",    label: "📋 Setup Packets"         },
                ].map((c) => (
                  <label key={c.name} className={`dd-check-item${(form as any)[c.name] ? " checked" : ""}`}>
                    <input type="checkbox" name={c.name} checked={(form as any)[c.name]} onChange={handleChange} className="dd-checkbox" />
                    <span className="dd-check-label">{c.label}</span>
                  </label>
                ))}
              </div>

              <button className="dd-save-btn" onClick={handleSubmit} disabled={loading}>
                {loading ? "Saving..." : "✓ Save Profile"}
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════ */}
        {/* TAB: POST LOAD                 */}
        {/* ═══════════════════════════════ */}
        {activeTab === "loads" && (
          <div className="dd-card">
            <div className="dd-card-header">
              <div className="dd-card-title">
                <div className="dd-card-title-icon" style={{ background: "#EBF1FD" }}>📦</div>
                Post Available Load
              </div>
            </div>
            <div className="dd-form-body">

              <div className="dd-section-label">Load Details</div>
              <div className="dd-grid-2">
                <div className="dd-field" style={{ gridColumn: "1 / -1" }}>
                  <label className="dd-label">Load Title</label>
                  <input name="title" value={loadForm.title} onChange={handleLoadChange} placeholder="e.g. Dallas TX to Chicago IL – Dry Van" className="dd-input" />
                </div>
                <div className="dd-field">
                  <label className="dd-label">Pickup Location</label>
                  <input name="pickup_location" value={loadForm.pickup_location} onChange={handleLoadChange} placeholder="City, State" className="dd-input" />
                </div>
                <div className="dd-field">
                  <label className="dd-label">Delivery Location</label>
                  <input name="delivery_location" value={loadForm.delivery_location} onChange={handleLoadChange} placeholder="City, State" className="dd-input" />
                </div>
                <div className="dd-field">
                  <label className="dd-label">Equipment Type</label>
                  <select name="equipment" value={loadForm.equipment} onChange={handleLoadChange} className="dd-input">
                    <option value="">Select Equipment</option>
                    <optgroup label="Van & Cargo">
                      <option>Dry Van</option>
                      <option>Reefer</option>
                      <option>Box Truck</option>
                      <option>Sprinter/Cargo Van</option>
                    </optgroup>
                    <optgroup label="Flatbed & Heavy">
                      <option>Flatbed</option>
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
                <div className="dd-field">
                  <label className="dd-label">Load Type</label>
                  <select name="load_type" value={loadForm.load_type} onChange={handleLoadChange} className="dd-input">
                    <option value="">Select Load Type</option>
                    <option value="FTL">Full Truckload (FTL)</option>
                    <option value="Partial">Partial (LTL)</option>
                  </select>
                </div>
              </div>

              <div className="dd-section-label">Rate & Logistics</div>
              <div className="dd-grid-3">
                <div className="dd-field">
                  <label className="dd-label">Rate ($)</label>
                  <input name="rate" value={loadForm.rate} onChange={handleLoadChange} placeholder="e.g. 2800" className="dd-input" />
                </div>
                <div className="dd-field">
                  <label className="dd-label">Weight (lbs)</label>
                  <input name="weight" value={loadForm.weight} onChange={handleLoadChange} placeholder="e.g. 42000" className="dd-input" />
                </div>
                <div className="dd-field">
                  <label className="dd-label">Miles</label>
                  <input name="miles" value={loadForm.miles} onChange={handleLoadChange} placeholder="e.g. 1042" className="dd-input" />
                </div>
              </div>

              <div className="dd-section-label">Schedule</div>
              <div className="dd-grid-2">
                <div className="dd-field">
                  <label className="dd-label">Pickup Date & Time</label>
                  <input type="datetime-local" name="pickup_date" value={loadForm.pickup_date} onChange={handleLoadChange} className="dd-input" />
                </div>
              </div>

              <div className="dd-section-label">Notes</div>
              <div className="dd-field">
                <label className="dd-label">Special Instructions</label>
                <textarea name="notes" value={loadForm.notes} onChange={handleLoadChange} placeholder="Any special requirements, hazmat info, or instructions for the carrier..." className="dd-textarea" />
              </div>

              <button className="dd-post-btn" onClick={handlePostLoad} disabled={loadLoading}>
                {loadLoading ? "Posting..." : "📦 Post Load"}
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════ */}
        {/* TAB: POSTED LOADS              */}
        {/* ═══════════════════════════════ */}
        {activeTab === "posted" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
              <div style={{ fontSize: "0.86rem", fontWeight: 800, color: "var(--txt)" }}>Your Posted Loads</div>
              <div style={{ fontSize: "0.7rem", fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "var(--purple-l)", color: "var(--purple)" }}>
                {dispatcherLoads.length} load{dispatcherLoads.length !== 1 ? "s" : ""}
              </div>
            </div>

            {dispatcherLoads.length === 0 ? (
              <div className="dd-empty">
                <div className="dd-empty-icon">📭</div>
                <div className="dd-empty-title">No loads posted yet</div>
                <div className="dd-empty-sub">Switch to the "Post Load" tab to add your first available load.</div>
              </div>
            ) : (
              dispatcherLoads.map((load) => {
                const eq = equipmentColors[load.equipment] || { bg: "#EFF1F5", color: "#6B7A8D" };
                return (
                  <div key={load.id} className="dd-load-card">
                    <div className="dd-lcard-top">
                      <div>
                        <div className="dd-lcard-title">{load.title}</div>
                        <div className="dd-lcard-route">
                          <span>{load.pickup_location}</span>
                          <span className="dd-lcard-arrow">→</span>
                          <span>{load.delivery_location}</span>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div className="dd-lcard-rate">${load.rate}</div>
                        <div className="dd-lcard-miles">{load.miles} miles</div>
                      </div>
                    </div>

                    <div className="dd-lcard-meta">
                      <div>
                        <div className="dd-lmeta-label">Equipment</div>
                        <div className="dd-lmeta-value">
                          <span className="dd-eq-tag" style={{ background: eq.bg, color: eq.color }}>{load.equipment}</span>
                        </div>
                      </div>
                      <div>
                        <div className="dd-lmeta-label">Load Type</div>
                        <div className="dd-lmeta-value">{load.load_type || "N/A"}</div>
                      </div>
                      <div>
                        <div className="dd-lmeta-label">Weight</div>
                        <div className="dd-lmeta-value">{load.weight || "N/A"}</div>
                      </div>
                      <div>
                        <div className="dd-lmeta-label">Pickup Date</div>
                        <div className="dd-lmeta-value" style={{ fontSize: "0.72rem" }}>
                          {load.pickup_date ? new Date(load.pickup_date).toLocaleDateString() : "TBD"}
                        </div>
                      </div>
                    </div>

                    <div className="dd-lcard-bottom">
                      <div className="dd-lcard-notes">
                        {load.notes ? <><b>Notes: </b>{load.notes}</> : <span style={{ color: "#6B7A8D" }}>No additional notes</span>}
                      </div>
                      <div className="dd-lcard-actions">
                        <a className="dd-lbtn dd-lbtn-chat" href={`/chat?receiver=${load.dispatcher_id}`}>
                          💬 Open Chat
                        </a>
                        <button className="dd-lbtn dd-lbtn-delete" onClick={() => deleteLoad(load.id)}>
                          🗑 Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

      </div>
    </main>
  );
}
