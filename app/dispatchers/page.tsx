"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

type Dispatcher = {
  id: string;
  user_id: string;
  full_name: string;
  company_name: string;
  phone: string;
  email: string;
  experience: string;
  truck_types: string;
  lanes: string;
  bio: string;
  city: string;
  state: string;
  profile_image?: string;
  verified?: boolean;
};

type DispatcherLoad = {
  id: string;
  dispatcher_id: string;
  title: string;
  pickup_location: string;
  delivery_location: string;
  equipment: string;
  rate: string;
  weight: string;
  load_type: string;
  miles: string;
  broker_name: string;
  broker_phone: string;
  notes: string;
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
  "Step Deck":          { bg: "#FEF3C7", color: "#D97706" },
  "Power Only":         { bg: "#EFF1F5", color: "#4A5568" },
  "Other":              { bg: "#EFF1F5", color: "#6B7A8D" },
};

export default function DispatchersPage() {
  const [dispatchers, setDispatchers] = useState<Dispatcher[]>([]);
  const [loads, setLoads] = useState<DispatcherLoad[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Dry Van", "Reefer", "Flatbed", "Box Truck", "Sprinter Van", "Tanker", "OTR", "Hotshot"];

  useEffect(() => { fetchDispatchers(); }, []);

  const fetchDispatchers = async () => {
    setLoading(true);
    const { data: dispatcherData, error: dispatcherError } = await supabase
      .from("dispatcher_profiles").select("*").order("created_at", { ascending: false });
    const { data: loadData, error: loadError } = await supabase
      .from("dispatcher_loads").select("*").order("created_at", { ascending: false });
    if (!dispatcherError && dispatcherData) setDispatchers(dispatcherData);
    if (!loadError && loadData) setLoads(loadData);
    setLoading(false);
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

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 3px #EDE9FE; }
          50%       { box-shadow: 0 0 0 6px #EDE9FE; }
        }

        /* ── PAGE WRAPPER ── */
        .dp-page { max-width: 1200px; margin: 0 auto; padding: 40px 5% 80px; }

        /* ── PAGE HEADER ── */
        .dp-page-header { margin-bottom: 36px; animation: fadeUp 0.5s ease both; }
        .dp-eyebrow { display: flex; align-items: center; gap: 8px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--purple); margin-bottom: 10px; }
        .dp-eyebrow::before { content: ''; width: 20px; height: 2px; background: var(--purple); border-radius: 1px; }
        .dp-page-title { font-size: clamp(1.8rem, 4vw, 2.6rem); font-weight: 800; letter-spacing: -0.045em; color: var(--txt); line-height: 1.05; margin-bottom: 12px; font-family: 'Plus Jakarta Sans', sans-serif; }
        .dp-page-title em { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; color: var(--purple); }
        .dp-page-sub { font-size: 0.92rem; color: var(--txt3); max-width: 560px; line-height: 1.75; font-weight: 400; }

        /* ── STATS BAR ── */
        .dp-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 32px; animation: fadeUp 0.5s 0.1s ease both; }
        .dp-stat { background: var(--white); border: 1px solid var(--border); border-radius: 14px; padding: 18px 20px; }
        .dp-stat-n { font-size: 1.55rem; font-weight: 800; color: var(--txt); letter-spacing: -0.04em; line-height: 1; margin-bottom: 4px; font-family: 'Plus Jakarta Sans', sans-serif; }
        .dp-stat-n span { color: var(--purple); }
        .dp-stat-l { font-size: 0.68rem; font-weight: 600; color: var(--txt3); text-transform: uppercase; letter-spacing: 0.07em; }

        /* ── FILTER PILLS ── */
        .dp-filters { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 28px; animation: fadeUp 0.5s 0.15s ease both; }
        .dp-fpill { padding: 6px 16px; border-radius: 20px; font-size: 0.74rem; font-weight: 600; border: 1.5px solid var(--border2); background: var(--white); color: var(--txt3); cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; }
        .dp-fpill:hover { border-color: var(--purple-m); color: var(--purple); background: var(--purple-l); }
        .dp-fpill.active { background: var(--purple-l); border-color: var(--purple-m); color: var(--purple); }

        /* ── LOADING / EMPTY ── */
        .dp-loading { text-align: center; padding: 80px 20px; }
        .dp-loading-spinner { width: 40px; height: 40px; border: 3px solid var(--border); border-top-color: var(--purple); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .dp-loading-txt { font-size: 0.86rem; color: var(--txt3); font-weight: 500; }
        .dp-empty { text-align: center; padding: 80px 20px; background: var(--white); border: 1px solid var(--border); border-radius: 18px; }
        .dp-empty-icon { font-size: 2.5rem; margin-bottom: 12px; }
        .dp-empty-title { font-size: 0.95rem; font-weight: 700; color: var(--txt); margin-bottom: 6px; }
        .dp-empty-sub { font-size: 0.8rem; color: var(--txt3); }

        /* ── DISPATCHER CARD ── */
        .dp-card { background: var(--white); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; margin-bottom: 20px; transition: box-shadow 0.2s; animation: fadeUp 0.5s ease both; }
        .dp-card:hover { box-shadow: 0 12px 40px rgba(0,0,0,0.08); }

        /* CARD TOP */
        .dp-card-top { padding: 28px 28px 24px; border-bottom: 1px solid var(--border); display: flex; gap: 24px; justify-content: space-between; flex-wrap: wrap; }
        .dp-card-left { display: flex; gap: 20px; flex: 1; min-width: 0; }
        .dp-avatar { width: 88px; height: 88px; border-radius: 18px; object-fit: cover; border: 2px solid var(--border); flex-shrink: 0; background: var(--purple-l); }
        .dp-avatar-fallback { width: 88px; height: 88px; border-radius: 18px; background: var(--purple-l); border: 2px solid var(--purple-m); display: flex; align-items: center; justify-content: center; font-size: 2rem; flex-shrink: 0; }
        .dp-info { flex: 1; min-width: 0; }
        .dp-name-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 4px; }
        .dp-name { font-size: 1.25rem; font-weight: 800; color: var(--txt); letter-spacing: -0.03em; font-family: 'Plus Jakarta Sans', sans-serif; }
        .dp-verified { font-size: 0.6rem; font-weight: 800; padding: 2px 8px; border-radius: 4px; background: var(--green-l); color: var(--green); letter-spacing: 0.06em; text-transform: uppercase; }
        .dp-company { font-size: 0.85rem; font-weight: 600; color: var(--purple); margin-bottom: 8px; }
        .dp-bio { font-size: 0.8rem; color: var(--txt3); line-height: 1.7; max-width: 560px; margin-bottom: 16px; font-weight: 400; }

        /* META GRID */
        .dp-meta { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        .dp-meta-item {}
        .dp-meta-label { font-size: 0.62rem; font-weight: 700; color: var(--txt4); text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 4px; }
        .dp-meta-value { font-size: 0.8rem; font-weight: 600; color: var(--txt2); }

        /* CONTACT PANEL */
        .dp-contact-panel { display: flex; flex-direction: column; gap: 10px; min-width: 200px; flex-shrink: 0; }
        .dp-cbtn { width: 100%; padding: 11px 18px; border-radius: 10px; font-size: 0.78rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; display: flex; align-items: center; justify-content: center; gap: 7px; text-decoration: none; }
        .dp-cbtn-email  { background: var(--blue);   color: #fff; }
        .dp-cbtn-email:hover  { background: #1446C0; transform: translateY(-1px); }
        .dp-cbtn-phone  { background: var(--white);  color: var(--txt2); border: 1.5px solid var(--border2); }
        .dp-cbtn-phone:hover  { border-color: var(--green); color: var(--green); }
        .dp-cbtn-chat   { background: var(--green);  color: #fff; }
        .dp-cbtn-chat:hover   { background: #0e8f45; transform: translateY(-1px); }

        /* ── LOADS SECTION ── */
        .dp-loads-section { padding: 20px 28px 24px; background: var(--bg); }
        .dp-loads-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 10px; }
        .dp-loads-title { font-size: 0.9rem; font-weight: 800; color: var(--txt); letter-spacing: -0.02em; display: flex; align-items: center; gap: 8px; }
        .dp-loads-count { font-size: 0.65rem; font-weight: 800; padding: 3px 10px; border-radius: 20px; background: var(--purple-l); color: var(--purple); }
        .dp-loads-live { display: flex; align-items: center; gap: 5px; font-size: 0.68rem; color: var(--txt3); font-weight: 600; }
        .dp-ldot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); animation: pulse 2s infinite; display: inline-block; }

        /* EMPTY LOADS */
        .dp-loads-empty { background: var(--white); border: 1.5px dashed var(--border2); border-radius: 12px; padding: 28px; text-align: center; font-size: 0.8rem; color: var(--txt4); }

        /* LOAD CARD */
        .dp-load-card { background: var(--white); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; margin-bottom: 12px; transition: box-shadow 0.15s; }
        .dp-load-card:last-child { margin-bottom: 0; }
        .dp-load-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.07); }

        .dp-load-top { padding: 16px 20px 14px; border-bottom: 1px solid var(--border); display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
        .dp-load-title { font-size: 0.88rem; font-weight: 800; color: var(--txt); margin-bottom: 4px; letter-spacing: -0.02em; }
        .dp-load-route { font-size: 0.78rem; color: var(--txt3); display: flex; align-items: center; gap: 6px; font-weight: 400; }
        .dp-load-arrow { color: var(--txt4); }
        .dp-load-rate { font-size: 1.15rem; font-weight: 800; color: var(--green); letter-spacing: -0.03em; white-space: nowrap; }
        .dp-load-miles { font-size: 0.68rem; color: var(--txt4); text-align: right; margin-top: 2px; }

        .dp-load-meta { padding: 12px 20px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; background: var(--bg); border-bottom: 1px solid var(--border); }
        .dp-lmeta-label { font-size: 0.6rem; font-weight: 700; color: var(--txt4); text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 3px; }
        .dp-lmeta-value { font-size: 0.77rem; font-weight: 600; color: var(--txt2); }
        .dp-eq-tag { display: inline-block; font-size: 0.63rem; font-weight: 700; padding: 2px 7px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.04em; }

        .dp-load-bottom { padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
        .dp-load-notes { font-size: 0.76rem; color: var(--txt3); line-height: 1.55; flex: 1; font-weight: 400; }
        .dp-load-notes b { color: var(--txt2); font-weight: 600; }
        .dp-load-actions { display: flex; gap: 8px; flex-shrink: 0; flex-wrap: wrap; }
        .dp-lbtn { padding: 7px 16px; border-radius: 8px; font-size: 0.73rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; text-decoration: none; display: inline-flex; align-items: center; gap: 5px; }
        .dp-lbtn-email { background: var(--blue-l);   color: var(--blue);   border: 1.5px solid var(--blue-m); }
        .dp-lbtn-email:hover { background: var(--blue); color: #fff; }
        .dp-lbtn-phone { background: var(--white);    color: var(--txt2);   border: 1.5px solid var(--border2); }
        .dp-lbtn-phone:hover { border-color: var(--green); color: var(--green); }
        .dp-lbtn-chat  { background: var(--green-l);  color: var(--green);  border: 1.5px solid var(--green-m); }
        .dp-lbtn-chat:hover  { background: var(--green); color: #fff; }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .dp-stats { grid-template-columns: repeat(2, 1fr); }
          .dp-meta { grid-template-columns: repeat(2, 1fr); }
          .dp-load-meta { grid-template-columns: repeat(2, 1fr); }
          .dp-card-top { flex-direction: column; }
          .dp-contact-panel { flex-direction: row; flex-wrap: wrap; min-width: unset; }
          .dp-cbtn { flex: 1; min-width: 140px; }
        }
        @media (max-width: 600px) {
          .dp-page { padding: 24px 4% 60px; }
          .dp-stats { grid-template-columns: repeat(2, 1fr); }
          .dp-card-left { flex-direction: column; }
          .dp-meta { grid-template-columns: 1fr 1fr; }
          .dp-load-meta { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <div className="dp-page">

        {/* ── PAGE HEADER ── */}
        <div className="dp-page-header">
          <div className="dp-eyebrow">Dispatcher Network</div>
          <div className="dp-page-title">Find Your Perfect <em>Dispatcher</em></div>
          <p className="dp-page-sub">
            Connect with experienced, verified freight dispatchers. View their live posted loads,
            check their specialties, and choose the right partner for your trucking operation.
          </p>
        </div>

        {/* ── STATS ── */}
        <div className="dp-stats">
          <div className="dp-stat">
            <div className="dp-stat-n">{loading ? "—" : dispatchers.length}<span>+</span></div>
            <div className="dp-stat-l">Active Dispatchers</div>
          </div>
          <div className="dp-stat">
            <div className="dp-stat-n" style={{ color: "#12A150" }}>
              {loading ? "—" : dispatchers.filter(d => d.verified).length}
            </div>
            <div className="dp-stat-l">Verified Profiles</div>
          </div>
          <div className="dp-stat">
            <div className="dp-stat-n" style={{ color: "#1A56DB" }}>
              {loading ? "—" : loads.length}<span></span>
            </div>
            <div className="dp-stat-l">Live Posted Loads</div>
          </div>
          <div className="dp-stat">
            <div className="dp-stat-n" style={{ color: "#7C3AED" }}>4.8<span>★</span></div>
            <div className="dp-stat-l">Avg Profile Rating</div>
          </div>
        </div>

        {/* ── FILTER PILLS ── */}
        <div className="dp-filters">
          {filters.map(f => (
            <div
              key={f}
              className={`dp-fpill${activeFilter === f ? " active" : ""}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </div>
          ))}
        </div>

        {/* ── LOADING ── */}
        {loading ? (
          <div className="dp-loading">
            <div className="dp-loading-spinner" />
            <div className="dp-loading-txt">Loading dispatchers...</div>
          </div>

        ) : dispatchers.length === 0 ? (
          <div className="dp-empty">
            <div className="dp-empty-icon">🎯</div>
            <div className="dp-empty-title">No dispatchers found</div>
            <div className="dp-empty-sub">Check back soon — new dispatchers are joining every day.</div>
          </div>

        ) : (
          <div>
            {dispatchers.map((dispatcher, idx) => {
              const dispatcherLoads = loads.filter(l => l.dispatcher_id === dispatcher.user_id);

              return (
                <div key={dispatcher.id} className="dp-card" style={{ animationDelay: `${idx * 0.06}s` }}>

                  {/* ── CARD TOP ── */}
                  <div className="dp-card-top">
                    <div className="dp-card-left">

                      {/* AVATAR */}
                      {dispatcher.profile_image ? (
                        <img src={dispatcher.profile_image} alt={dispatcher.full_name} className="dp-avatar" />
                      ) : (
                        <div className="dp-avatar-fallback">👤</div>
                      )}

                      {/* INFO */}
                      <div className="dp-info">
                        <div className="dp-name-row">
                          <span className="dp-name">{dispatcher.full_name}</span>
                          {dispatcher.verified && <span className="dp-verified">✓ VERIFIED</span>}
                        </div>
                        <div className="dp-company">{dispatcher.company_name}</div>
                        {dispatcher.bio && <p className="dp-bio">{dispatcher.bio}</p>}

                        <div className="dp-meta">
                          <div className="dp-meta-item">
                            <div className="dp-meta-label">Experience</div>
                            <div className="dp-meta-value">{dispatcher.experience} yrs</div>
                          </div>
                          <div className="dp-meta-item">
                            <div className="dp-meta-label">Truck Types</div>
                            <div className="dp-meta-value">{dispatcher.truck_types}</div>
                          </div>
                          <div className="dp-meta-item">
                            <div className="dp-meta-label">Preferred Lanes</div>
                            <div className="dp-meta-value">{dispatcher.lanes}</div>
                          </div>
                          <div className="dp-meta-item">
                            <div className="dp-meta-label">Location</div>
                            <div className="dp-meta-value">{dispatcher.city}, {dispatcher.state}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CONTACT PANEL */}
                    <div className="dp-contact-panel">
                      <a
                        className="dp-cbtn dp-cbtn-email"
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${dispatcher.email}&su=Interested%20In%20Your%20Dispatch%20Services`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        ✉️ Email Dispatcher
                      </a>
                      <a className="dp-cbtn dp-cbtn-phone" href={`tel:${dispatcher.phone}`}>
                        📞 Call Dispatcher
                      </a>
                      <a className="dp-cbtn dp-cbtn-chat" href={`/chat?receiver=${dispatcher.user_id}`}>
                        💬 Chat Now
                      </a>
                    </div>
                  </div>

                  {/* ── LOADS SECTION ── */}
                  <div className="dp-loads-section">
                    <div className="dp-loads-header">
                      <div className="dp-loads-title">
                        📦 Live Posted Loads
                        <span className="dp-loads-count">{dispatcherLoads.length} loads</span>
                      </div>
                      <div className="dp-loads-live">
                        <span className="dp-ldot" /> Updated live
                      </div>
                    </div>

                    {dispatcherLoads.length === 0 ? (
                      <div className="dp-loads-empty">
                        No loads posted yet by this dispatcher.
                      </div>
                    ) : (
                      dispatcherLoads.map((load) => {
                        const eq = equipmentColors[load.equipment] || { bg: "#EFF1F5", color: "#6B7A8D" };
                        return (
                          <div key={load.id} className="dp-load-card">

                            {/* LOAD TOP */}
                            <div className="dp-load-top">
                              <div>
                                <div className="dp-load-title">{load.title}</div>
                                <div className="dp-load-route">
                                  <span>{load.pickup_location}</span>
                                  <span className="dp-load-arrow">→</span>
                                  <span>{load.delivery_location}</span>
                                </div>
                              </div>
                              <div style={{ textAlign: "right" }}>
                                <div className="dp-load-rate">${load.rate}</div>
                                <div className="dp-load-miles">{load.miles} miles</div>
                              </div>
                            </div>

                            {/* LOAD META */}
                            <div className="dp-load-meta">
                              <div>
                                <div className="dp-lmeta-label">Equipment</div>
                                <div className="dp-lmeta-value">
                                  <span className="dp-eq-tag" style={{ background: eq.bg, color: eq.color }}>
                                    {load.equipment}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <div className="dp-lmeta-label">Load Type</div>
                                <div className="dp-lmeta-value">{load.load_type}</div>
                              </div>
                              <div>
                                <div className="dp-lmeta-label">Weight</div>
                                <div className="dp-lmeta-value">{load.weight}</div>
                              </div>
                              <div>
                                <div className="dp-lmeta-label">Broker</div>
                                <div className="dp-lmeta-value">{load.broker_name}</div>
                              </div>
                            </div>

                            {/* LOAD BOTTOM */}
                            <div className="dp-load-bottom">
                              <div className="dp-load-notes">
                                {load.notes
                                  ? <><b>Notes: </b>{load.notes}</>
                                  : <span style={{ color: "#6B7A8D" }}>No additional notes</span>
                                }
                              </div>
                              <div className="dp-load-actions">
                                <a
                                  className="dp-lbtn dp-lbtn-email"
                                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${dispatcher.email}&su=Interested%20In%20Your%20Load`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  ✉️ Email
                                </a>
                                <a className="dp-lbtn dp-lbtn-phone" href={`tel:${dispatcher.phone}`}>
                                  📞 Call
                                </a>
                                <a className="dp-lbtn dp-lbtn-chat" href={`/chat?receiver=${dispatcher.user_id}`}>
                                  💬 Chat
                                </a>
                              </div>
                            </div>

                          </div>
                        );
                      })
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}
