"use client";

import { useState, useEffect } from "react";
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
};

export default function BrokerDashboard() {

  const capitalizeWords = (text: string) => {
    if (!text) return "";
    return text.toLowerCase().split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  };

  const [form, setForm] = useState({
    company_name: "",
    contact: "",
    email: "",
    pickup_location: "",
    delivery_location: "",
    equipment: "Box Truck",
    weight: "",
    total_rate: "",
    mc_number: "",
    usdot: "",
    pickup_date: "",
    delivery_date: "",
    description: "",
  });

  const [loads, setLoads] = useState<Load[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchLoads = async () => {
    const { data } = await supabase.from("loads").select("*").order("created_at", { ascending: false });
    setLoads(data || []);
  };

  useEffect(() => { fetchLoads(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "usdot" ? value.toUpperCase() : value });
  };

  const formatDate = (date: string) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString();
  };

  const handleSubmit = async () => {
    const payload = { ...form, pickup_date: form.pickup_date || null, delivery_date: form.delivery_date || null };
    let res;
    if (editingId) {
      res = await supabase.from("loads").update(payload).eq("id", editingId);
    } else {
      res = await supabase.from("loads").insert([{ ...payload, status: "available" }]);
    }
    if (res.error) { alert(res.error.message); return; }
    alert(editingId ? "Load Updated!" : "Load Posted!");
    setEditingId(null);
    setForm({ company_name: "", contact: "", email: "", pickup_location: "", delivery_location: "", equipment: "Box Truck", weight: "", total_rate: "", mc_number: "", usdot: "", pickup_date: "", delivery_date: "", description: "" });
    fetchLoads();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this load?")) return;
    const { error } = await supabase.from("loads").delete().eq("id", id);
    if (error) { alert(error.message); } else { fetchLoads(); }
  };

  const handleEdit = (load: Load) => {
    setEditingId(load.id);
    setForm({
      company_name: load.company_name || "", contact: load.contact || "", email: load.email || "",
      pickup_location: load.pickup_location || "", delivery_location: load.delivery_location || "",
      equipment: load.equipment || "Box Truck", weight: load.weight || "", total_rate: load.total_rate || "",
      mc_number: load.mc_number || "", usdot: load.usdot || "", pickup_date: load.pickup_date || "",
      delivery_date: load.delivery_date || "", description: load.description || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ company_name: "", contact: "", email: "", pickup_location: "", delivery_location: "", equipment: "Box Truck", weight: "", total_rate: "", mc_number: "", usdot: "", pickup_date: "", delivery_date: "", description: "" });
  };

  const equipmentColors: Record<string, { bg: string; color: string }> = {
    "Dry Van":           { bg: "#EBF1FD", color: "#1A56DB" },
    "Reefer":            { bg: "#E6F7EE", color: "#12A150" },
    "Flatbed":           { bg: "#FEF3C7", color: "#D97706" },
    "FlatBed":           { bg: "#FEF3C7", color: "#D97706" },
    "Box Truck":         { bg: "#EDE9FE", color: "#7C3AED" },
    "Sprinter/Cargo Van":{ bg: "#FFF7ED", color: "#C2410C" },
    "Tanker":            { bg: "#FFF1F2", color: "#E11D48" },
    "HotShot":           { bg: "#F0FDF4", color: "#166534" },
    "Other":             { bg: "#EFF1F5", color: "#4A5568" },
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
          --amber:    #D97706;
          --amber-l:  #FEF3C7;
          --purple:   #7C3AED;
          --purple-l: #EDE9FE;
          --red:      #DC2626;
          --red-l:    #FEF2F2;
          --yellow:   #D97706;
          --yellow-l: #FFFBEB;
        }

        * { box-sizing: border-box; }

        /* PAGE WRAPPER */
        .bd-page { padding: 40px 5%; max-width: 1200px; margin: 0 auto; }

        /* PAGE HEADER */
        .bd-page-header { margin-bottom: 32px; }
        .bd-page-eyebrow { display: flex; align-items: center; gap: 8px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--green); margin-bottom: 8px; }
        .bd-page-eyebrow::before { content: ''; width: 20px; height: 2px; background: var(--green); border-radius: 1px; }
        .bd-page-title { font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 800; letter-spacing: -0.04em; color: var(--txt); line-height: 1.1; margin-bottom: 6px; font-family: 'Plus Jakarta Sans', sans-serif; }
        .bd-page-title em { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; color: var(--green); }
        .bd-page-sub { font-size: 0.86rem; color: var(--txt3); line-height: 1.65; }

        /* STATS BAR */
        .bd-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 32px; }
        .bd-stat { background: var(--white); border: 1px solid var(--border); border-radius: 14px; padding: 18px 20px; }
        .bd-stat-n { font-size: 1.6rem; font-weight: 800; color: var(--txt); letter-spacing: -0.04em; line-height: 1; margin-bottom: 4px; font-family: 'Plus Jakarta Sans', sans-serif; }
        .bd-stat-n span { color: var(--green); }
        .bd-stat-l { font-size: 0.68rem; font-weight: 600; color: var(--txt3); text-transform: uppercase; letter-spacing: 0.07em; }

        /* FORM CARD */
        .bd-form-card { background: var(--white); border: 1px solid var(--border); border-radius: 18px; padding: 32px; margin-bottom: 36px; }
        .bd-form-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
        .bd-form-title { font-size: 1rem; font-weight: 800; color: var(--txt); letter-spacing: -0.02em; display: flex; align-items: center; gap: 8px; }
        .bd-form-title-icon { width: 32px; height: 32px; border-radius: 8px; background: var(--green-l); display: flex; align-items: center; justify-content: center; font-size: 1rem; }

        /* SECTION LABEL */
        .bd-section-label { font-size: 0.68rem; font-weight: 700; color: var(--txt3); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px; margin-top: 20px; }
        .bd-section-label:first-of-type { margin-top: 0; }

        /* FORM GRID */
        .bd-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .bd-form-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }

        /* INPUT */
        .bd-input {
          width: 100%;
          padding: 10px 14px;
          background: var(--bg);
          border: 1.5px solid var(--border2);
          border-radius: 10px;
          color: var(--txt);
          font-size: 0.83rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          appearance: none;
        }
        .bd-input:focus { border-color: var(--green); box-shadow: 0 0 0 3px rgba(18,161,80,0.1); background: var(--white); }
        .bd-input::placeholder { color: var(--txt4); }
        .bd-input-full { grid-column: 1 / -1; }

        /* DIVIDER */
        .bd-divider { height: 1px; background: var(--border); margin: 20px 0; }

        /* FORM ACTIONS */
        .bd-form-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 24px; }
        .bd-btn { padding: 10px 24px; border-radius: 10px; font-size: 0.83rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; display: inline-flex; align-items: center; gap: 6px; }
        .bd-btn-primary { background: var(--green); color: #fff; }
        .bd-btn-primary:hover { background: #0e8f45; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(18,161,80,0.25); }
        .bd-btn-ghost { background: transparent; color: var(--txt3); border: 1.5px solid var(--border2); }
        .bd-btn-ghost:hover { color: var(--txt); border-color: var(--border2); }

        /* LOADS SECTION HEADER */
        .bd-loads-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; flex-wrap: wrap; gap: 10px; }
        .bd-loads-title { font-size: 1rem; font-weight: 800; color: var(--txt); letter-spacing: -0.02em; }
        .bd-loads-count { font-size: 0.72rem; font-weight: 700; padding: 3px 10px; border-radius: 20px; background: var(--green-l); color: var(--green); }

        /* LOAD CARD */
        .bd-load-card { background: var(--white); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; transition: box-shadow 0.2s, transform 0.2s; margin-bottom: 14px; }
        .bd-load-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.08); transform: translateY(-2px); }

        .bd-load-top { padding: 20px 24px 16px; border-bottom: 1px solid var(--border); display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
        .bd-load-company { font-size: 1.05rem; font-weight: 800; color: var(--txt); letter-spacing: -0.02em; margin-bottom: 4px; }
        .bd-load-route { font-size: 0.85rem; color: var(--txt2); font-weight: 500; display: flex; align-items: center; gap: 6px; }
        .bd-load-route-arrow { color: var(--txt4); font-size: 0.75rem; }
        .bd-load-rate { font-size: 1.2rem; font-weight: 800; color: var(--green); letter-spacing: -0.03em; white-space: nowrap; }
        .bd-load-rate small { display: block; font-size: 0.65rem; font-weight: 500; color: var(--txt4); text-align: right; margin-top: 1px; }

        .bd-load-meta { padding: 14px 24px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; border-bottom: 1px solid var(--border); background: var(--bg); }
        .bd-meta-item {}
        .bd-meta-label { font-size: 0.62rem; font-weight: 700; color: var(--txt4); text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 3px; }
        .bd-meta-value { font-size: 0.8rem; font-weight: 600; color: var(--txt2); }

        .bd-eq-tag { display: inline-block; font-size: 0.65rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.04em; }

        .bd-load-bottom { padding: 14px 24px; display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
        .bd-load-desc { font-size: 0.78rem; color: var(--txt3); line-height: 1.5; flex: 1; }

        .bd-load-actions { display: flex; gap: 8px; flex-shrink: 0; }
        .bd-action-btn { padding: 7px 16px; border-radius: 8px; font-size: 0.75rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; }
        .bd-btn-edit { background: var(--yellow-l); color: var(--yellow); border: 1.5px solid var(--amber-l); }
        .bd-btn-edit:hover { background: var(--amber-l); }
        .bd-btn-delete { background: var(--red-l); color: var(--red); border: 1.5px solid #FEE2E2; }
        .bd-btn-delete:hover { background: #FEE2E2; }

        /* EMPTY STATE */
        .bd-empty { text-align: center; padding: 60px 20px; background: var(--white); border: 1px solid var(--border); border-radius: 16px; }
        .bd-empty-icon { font-size: 2.5rem; margin-bottom: 12px; }
        .bd-empty-title { font-size: 0.95rem; font-weight: 700; color: var(--txt); margin-bottom: 6px; }
        .bd-empty-sub { font-size: 0.8rem; color: var(--txt3); }

        /* EDIT MODE INDICATOR */
        .bd-edit-banner { background: var(--amber-l); border: 1.5px solid #FDE68A; border-radius: 10px; padding: 10px 16px; display: flex; align-items: center; gap: 10px; font-size: 0.8rem; font-weight: 600; color: var(--amber); margin-bottom: 20px; }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .bd-form-grid, .bd-form-grid-3 { grid-template-columns: 1fr 1fr; }
          .bd-load-meta { grid-template-columns: repeat(2, 1fr); }
          .bd-stats { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .bd-form-grid, .bd-form-grid-3 { grid-template-columns: 1fr; }
          .bd-load-meta { grid-template-columns: repeat(2, 1fr); }
          .bd-stats { grid-template-columns: repeat(2, 1fr); }
          .bd-page { padding: 24px 4%; }
        }
      `}</style>

      <div className="bd-page">

        {/* ── PAGE HEADER ── */}
        <div className="bd-page-header">
          <div className="bd-page-eyebrow">Broker Dashboard</div>
          <div className="bd-page-title">Manage Your <em>Loads</em></div>
          <div className="bd-page-sub">Post freight, track bookings, and connect with verified carriers — all in one place.</div>
        </div>

        {/* ── STATS ── */}
        <div className="bd-stats">
          <div className="bd-stat">
            <div className="bd-stat-n">{loads.length}<span></span></div>
            <div className="bd-stat-l">Total Loads Posted</div>
          </div>
          <div className="bd-stat">
            <div className="bd-stat-n" style={{ color: "#12A150" }}>
              {loads.filter(l => (l as any).status === "available").length || loads.length}
            </div>
            <div className="bd-stat-l">Available</div>
          </div>
          <div className="bd-stat">
            <div className="bd-stat-n" style={{ color: "#1A56DB" }}>
              {loads.length > 0
                ? `$${Math.round(loads.reduce((s, l) => s + (parseFloat(l.total_rate) || 0), 0) / loads.length).toLocaleString()}`
                : "$0"}
            </div>
            <div className="bd-stat-l">Avg Rate</div>
          </div>
          <div className="bd-stat">
            <div className="bd-stat-n" style={{ color: "#7C3AED" }}>
              {new Set(loads.map(l => l.equipment)).size}
            </div>
            <div className="bd-stat-l">Equipment Types</div>
          </div>
        </div>

        {/* ── FORM CARD ── */}
        <div className="bd-form-card">

          <div className="bd-form-header">
            <div className="bd-form-title">
              <div className="bd-form-title-icon">📦</div>
              {editingId ? "Edit Load" : "Post a New Load"}
            </div>
            {editingId && (
              <div style={{ fontSize: "0.75rem", color: "#D97706", fontWeight: 600, background: "#FFFBEB", border: "1.5px solid #FDE68A", padding: "5px 12px", borderRadius: "8px" }}>
                ✏️ Editing existing load
              </div>
            )}
          </div>

          {/* BROKER INFO */}
          <div className="bd-section-label">Broker Information</div>
          <div className="bd-form-grid">
            <input name="company_name" placeholder="Company Name" value={form.company_name} onChange={handleChange} className="bd-input" />
            <input name="contact" placeholder="Contact Person" value={form.contact} onChange={handleChange} className="bd-input" />
            <input name="email" placeholder="Email Address" value={form.email} onChange={handleChange} className="bd-input" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <input name="mc_number" placeholder="MC Number" value={form.mc_number} onChange={handleChange} className="bd-input" />
              <input name="usdot" placeholder="USDOT" value={form.usdot} onChange={handleChange} className="bd-input" />
            </div>
          </div>

          <div className="bd-divider" />

          {/* LOAD DETAILS */}
          <div className="bd-section-label">Load Details</div>
          <div className="bd-form-grid">
            <input name="pickup_location" placeholder="Pickup Location" value={form.pickup_location} onChange={handleChange} className="bd-input" />
            <input name="delivery_location" placeholder="Delivery Location" value={form.delivery_location} onChange={handleChange} className="bd-input" />
            <select name="equipment" value={form.equipment} onChange={handleChange} className="bd-input">
              <option>Box Truck</option>
              <option>Dry Van</option>
              <option>Sprinter/Cargo Van</option>
              <option>HotShot</option>
              <option>Reefer</option>
              <option>FlatBed</option>
              <option>Tanker</option>
              <option>Step Deck</option>
              <option>Power Only</option>
              <option>Other</option>
            </select>
            <input name="weight" placeholder="Weight (lbs)" value={form.weight} onChange={handleChange} className="bd-input" />
            <input name="total_rate" placeholder="Total Rate ($)" value={form.total_rate} onChange={handleChange} className="bd-input" />
          </div>

          <div className="bd-divider" />

          {/* DATES */}
          <div className="bd-section-label">Schedule</div>
          <div className="bd-form-grid">
            <div>
              <div style={{ fontSize: "0.72rem", color: "#4A5568", marginBottom: 4, fontWeight: 600 }}>Pickup Date & Time</div>
              <input type="datetime-local" name="pickup_date" value={form.pickup_date} onChange={handleChange} className="bd-input" />
            </div>
            <div>
              <div style={{ fontSize: "0.72rem", color: "#4A5568", marginBottom: 4, fontWeight: 600 }}>Delivery Date & Time</div>
              <input type="datetime-local" name="delivery_date" value={form.delivery_date} onChange={handleChange} className="bd-input" />
            </div>
          </div>

          <div className="bd-divider" />

          {/* DESCRIPTION */}
          <div className="bd-section-label">Additional Notes</div>
          <textarea
            name="description"
            placeholder="Add any special instructions, hazmat info, load requirements..."
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="bd-input"
            style={{ resize: "vertical", lineHeight: 1.6 }}
          />

          {/* ACTIONS */}
          <div className="bd-form-actions">
            {editingId && (
              <button onClick={cancelEdit} className="bd-btn bd-btn-ghost">✕ Cancel</button>
            )}
            <button onClick={handleSubmit} className="bd-btn bd-btn-primary">
              {editingId ? "✓ Update Load" : "📦 Post Load"}
            </button>
          </div>

        </div>

        {/* ── LOADS LIST ── */}
        <div className="bd-loads-header">
          <div className="bd-loads-title">Your Posted Loads</div>
          <div className="bd-loads-count">{loads.length} load{loads.length !== 1 ? "s" : ""}</div>
        </div>

        {loads.length === 0 ? (
          <div className="bd-empty">
            <div className="bd-empty-icon">📭</div>
            <div className="bd-empty-title">No loads posted yet</div>
            <div className="bd-empty-sub">Use the form above to post your first load and reach verified carriers.</div>
          </div>
        ) : (
          loads.map((l) => {
            const eq = equipmentColors[l.equipment] || { bg: "#EFF1F5", color: "#4A5568" };
            return (
              <div key={l.id} className="bd-load-card">

                {/* TOP ROW */}
                <div className="bd-load-top">
                  <div>
                    <div className="bd-load-company">{capitalizeWords(l.company_name)}</div>
                    <div className="bd-load-route">
                      <span>{capitalizeWords(l.pickup_location)}</span>
                      <span className="bd-load-route-arrow">→</span>
                      <span>{capitalizeWords(l.delivery_location)}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="bd-load-rate">
                      ${l.total_rate}
                      <small>Total Rate</small>
                    </div>
                  </div>
                </div>

                {/* META GRID */}
                <div className="bd-load-meta">
                  <div className="bd-meta-item">
                    <div className="bd-meta-label">Equipment</div>
                    <div className="bd-meta-value">
                      <span className="bd-eq-tag" style={{ background: eq.bg, color: eq.color }}>
                        {l.equipment}
                      </span>
                    </div>
                  </div>
                  <div className="bd-meta-item">
                    <div className="bd-meta-label">Weight</div>
                    <div className="bd-meta-value">{l.weight || "N/A"}</div>
                  </div>
                  <div className="bd-meta-item">
                    <div className="bd-meta-label">MC Number</div>
                    <div className="bd-meta-value">{l.mc_number || "N/A"}</div>
                  </div>
                  <div className="bd-meta-item">
                    <div className="bd-meta-label">USDOT</div>
                    <div className="bd-meta-value">{l.usdot || "N/A"}</div>
                  </div>
                  <div className="bd-meta-item">
                    <div className="bd-meta-label">Contact</div>
                    <div className="bd-meta-value">{capitalizeWords(l.contact)}</div>
                  </div>
                  <div className="bd-meta-item">
                    <div className="bd-meta-label">Email</div>
                    <div className="bd-meta-value" style={{ fontSize: "0.75rem" }}>{l.email}</div>
                  </div>
                  <div className="bd-meta-item">
                    <div className="bd-meta-label">Pickup Date</div>
                    <div className="bd-meta-value" style={{ fontSize: "0.75rem" }}>{formatDate(l.pickup_date)}</div>
                  </div>
                  <div className="bd-meta-item">
                    <div className="bd-meta-label">Delivery Date</div>
                    <div className="bd-meta-value" style={{ fontSize: "0.75rem" }}>{formatDate(l.delivery_date)}</div>
                  </div>
                </div>

                {/* BOTTOM ROW */}
                <div className="bd-load-bottom">
                  {l.description ? (
                    <div className="bd-load-desc">
                      <span style={{ fontWeight: 600, color: "#3D4A5C" }}>Notes: </span>
                      {capitalizeWords(l.description)}
                    </div>
                  ) : (
                    <div className="bd-load-desc" style={{ color: "#6B7A8D" }}>No additional notes</div>
                  )}
                  <div className="bd-load-actions">
                    <button onClick={() => handleEdit(l)} className="bd-action-btn bd-btn-edit">✏️ Edit</button>
                    <button onClick={() => handleDelete(l.id)} className="bd-action-btn bd-btn-delete">🗑 Delete</button>
                  </div>
                </div>

              </div>
            );
          })
        )}

      </div>
    </main>
  );
}
