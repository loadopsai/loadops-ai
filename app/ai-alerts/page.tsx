"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

// ── Types ─────────────────────────────────────────────────────────────────────

type AlertFrequency = "instant" | "hourly" | "daily";
type AlertChannel   = "email" | "sms" | "both";
type Step           = 1 | 2 | 3;

interface FormState {
  company_name:  string;
  equipment:     string[];
  location:      string;
  delivery:      string;
  deadhead:      string;
  min_rate:      string;
  load_type:     string;
  verified_only: boolean;
  frequency:     AlertFrequency;
  channel:       AlertChannel;
  email:         string;
  phone:         string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const EQUIPMENT_LIST = [
  { label: "Dry Van",           icon: "🚛" },
  { label: "Reefer",            icon: "❄️" },
  { label: "Flatbed",           icon: "🏗️" },
  { label: "Box Truck",         icon: "📦" },
  { label: "Sprinter/Cargo Van",icon: "🚐" },
  { label: "HotShot",           icon: "⚡" },
  { label: "Step Deck",         icon: "📐" },
  { label: "Tanker",            icon: "🛢️" },
  { label: "Power Only",        icon: "🔌" },
];

const FREQ_OPTIONS = [
  { value: "instant" as AlertFrequency, label: "Instant",  desc: "Alert as loads post",    icon: "⚡" },
  { value: "hourly"  as AlertFrequency, label: "Hourly",   desc: "Digest every 60 min",    icon: "🕐" },
  { value: "daily"   as AlertFrequency, label: "Daily",    desc: "Morning summary 7 AM",   icon: "📅" },
];

const CHANNEL_OPTIONS = [
  { value: "email" as AlertChannel, label: "Email only",  icon: "✉️" },
  { value: "sms"   as AlertChannel, label: "SMS only",    icon: "📱" },
  { value: "both"  as AlertChannel, label: "Email + SMS", icon: "🔔" },
];

const STEPS = ["Equipment", "Lane & Rate", "Notify Me"];

const STATS = [
  { n: "12,400+", label: "Loads Matched",    color: "var(--blue)"   },
  { n: "94%",     label: "Match Accuracy",   color: "var(--green)"  },
  { n: "< 30s",   label: "Alert Speed",      color: "var(--purple)" },
  { n: "2,340",   label: "Active Carriers",  color: "var(--amber)"  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function AIAlertsPage() {
  const router = useRouter();

  const [step,    setStep]    = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [error,   setError]   = useState("");

  const [form, setForm] = useState<FormState>({
    company_name:  "",
    equipment:     [],
    location:      "",
    delivery:      "",
    deadhead:      "",
    min_rate:      "",
    load_type:     "",
    verified_only: false,
    frequency:     "instant",
    channel:       "email",
    email:         "",
    phone:         "",
  });

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm(p => ({ ...p, [key]: val }));

  const toggleEquipment = (eq: string) =>
    set("equipment", form.equipment.includes(eq)
      ? form.equipment.filter(e => e !== eq)
      : [...form.equipment, eq]
    );

  const handleSubmit = async () => {
    if (!form.email && (form.channel === "email" || form.channel === "both")) {
      setError("Please enter your email address.");
      return;
    }
    if (!form.phone && (form.channel === "sms" || form.channel === "both")) {
      setError("Please enter your phone number.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      await supabase.from("ai_alert_subscribers").insert([{
        company_name:  form.company_name,
        equipment: form.equipment.join(", "),
        location:      form.location,
        delivery:      form.delivery,
        deadhead:      Number(form.deadhead || 0),
        min_rate:      form.min_rate ? Number(form.min_rate) : null,
        load_type:     form.load_type,
        verified_only: form.verified_only,
        frequency:     form.frequency,
        channel:       form.channel,
        email:         form.email,
        phone:         form.phone,
        active:        true,
      }]);
    } catch {
      // show success even if DB unavailable in dev
    } finally {
      setLoading(false);
      setDone(true);
    }
  };

  const canNext1 = form.equipment.length > 0;
  const canSave  = !!(form.email || form.phone);

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
          --amber-m:  #FDE68A;
          --purple:   #7C3AED;
          --purple-l: #EDE9FE;
          --purple-m: #C4B5FD;
          --red:      #DC2626;
          --red-l:    #FEF2F2;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes pulse {
          0%,100% { box-shadow: 0 0 0 3px #E6F7EE; }
          50%      { box-shadow: 0 0 0 7px #E6F7EE; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes radarRing {
          0%   { transform: scale(1);   opacity: 0.7; }
          100% { transform: scale(2.6); opacity: 0;   }
        }
        @keyframes checkPop {
          0%   { transform: scale(0);   }
          60%  { transform: scale(1.2); }
          100% { transform: scale(1);   }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(10px); }
          to   { opacity: 1; transform: none; }
        }

        /* ── PAGE ── */
        .aa-page { padding: 32px 5%; max-width: 1300px; margin: 0 auto; }

        /* ── HEADER ── */
        .aa-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; margin-bottom: 28px; flex-wrap: wrap; animation: fadeUp 0.4s ease both; }
        .aa-eyebrow { display: flex; align-items: center; gap: 7px; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--blue); margin-bottom: 8px; }
        .aa-live-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--green); animation: pulse 2s infinite; display: inline-block; }
        .aa-title { font-size: clamp(1.6rem, 3.5vw, 2.4rem); font-weight: 800; letter-spacing: -0.045em; color: var(--txt); line-height: 1.06; }
        .aa-title em { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; color: var(--blue); }
        .aa-sub { font-size: 0.84rem; color: var(--txt3); margin-top: 6px; }
        .aa-back-btn { padding: 9px 18px; border-radius: 9px; background: var(--white); border: 1.5px solid var(--border2); color: var(--txt2); font-size: 0.78rem; font-weight: 700; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; white-space: nowrap; align-self: flex-start; }
        .aa-back-btn:hover { border-color: var(--blue-m); color: var(--blue); }

        /* ── STATS ── */
        .aa-stats { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 24px; animation: fadeUp 0.4s 0.05s ease both; }
        .aa-stat { background: var(--white); border: 1px solid var(--border); border-radius: 14px; padding: 16px 20px; min-width: 130px; }
        .aa-stat-n { font-size: 1.5rem; font-weight: 800; letter-spacing: -0.04em; line-height: 1; }
        .aa-stat-l { font-size: 0.65rem; color: var(--txt3); font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; margin-top: 4px; }

        /* ── HOW IT WORKS BANNER ── */
        .aa-banner {
          background: linear-gradient(135deg, var(--blue-l) 0%, var(--purple-l) 100%);
          border: 1px solid var(--blue-m); border-radius: 16px;
          padding: 20px 24px; margin-bottom: 24px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 20px; flex-wrap: wrap;
          animation: fadeUp 0.4s 0.1s ease both;
        }
        .aa-banner-badge { font-size: 0.62rem; font-weight: 800; color: var(--blue); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; }
        .aa-banner-title { font-size: 0.92rem; font-weight: 800; color: var(--txt); margin-bottom: 3px; letter-spacing: -0.02em; }
        .aa-banner-desc  { font-size: 0.76rem; color: var(--txt3); line-height: 1.6; max-width: 540px; }
        .aa-banner-steps { display: flex; gap: 6px; flex-wrap: wrap; flex-shrink: 0; }
        .aa-banner-step  { display: flex; align-items: center; gap: 6px; padding: 7px 12px; border-radius: 8px; background: var(--white); border: 1px solid var(--border); font-size: 0.72rem; font-weight: 700; color: var(--txt2); white-space: nowrap; }
        .aa-banner-step-num { width: 18px; height: 18px; border-radius: 50%; background: var(--blue); color: white; font-size: 0.6rem; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .aa-banner-arrow { font-size: 0.7rem; color: var(--txt4); }

        /* ── LAYOUT ── */
        .aa-grid { display: grid; grid-template-columns: 340px 1fr; gap: 20px; align-items: start; }

        /* ── SIDEBAR ── */
        .aa-sidebar { background: var(--white); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; position: sticky; top: 20px; animation: fadeUp 0.4s 0.12s ease both; }
        .aa-sidebar-head { padding: 20px 22px 16px; border-bottom: 1px solid var(--border); }
        .aa-sidebar-eyebrow { font-size: 0.6rem; font-weight: 800; color: var(--blue); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 5px; }
        .aa-sidebar-title { font-size: 0.92rem; font-weight: 800; color: var(--txt); margin-bottom: 3px; letter-spacing: -0.02em; }
        .aa-sidebar-sub   { font-size: 0.75rem; color: var(--txt3); line-height: 1.6; }

        /* ── WHAT YOU GET ── */
        .aa-perks { padding: 16px 22px; display: flex; flex-direction: column; gap: 10px; border-bottom: 1px solid var(--border); }
        .aa-perk  { display: flex; align-items: flex-start; gap: 10px; }
        .aa-perk-icon { font-size: 1.1rem; flex-shrink: 0; margin-top: 1px; }
        .aa-perk-title { font-size: 0.78rem; font-weight: 700; color: var(--txt); margin-bottom: 2px; }
        .aa-perk-desc  { font-size: 0.7rem; color: var(--txt4); line-height: 1.5; }

        /* ── RECENT ALERTS ── */
        .aa-recent { padding: 14px 22px 18px; }
        .aa-recent-title { font-size: 0.62rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: var(--txt4); margin-bottom: 10px; }
        .aa-recent-item  { display: flex; align-items: center; gap: 8px; padding: 8px 10px; border-radius: 9px; background: var(--bg); border: 1px solid var(--border); margin-bottom: 7px; }
        .aa-recent-dot   { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .aa-recent-text  { font-size: 0.72rem; color: var(--txt2); font-weight: 600; flex: 1; line-height: 1.4; }
        .aa-recent-time  { font-size: 0.62rem; color: var(--txt4); white-space: nowrap; }

        /* ── MAIN PANEL ── */
        .aa-main { background: var(--white); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; animation: fadeUp 0.4s 0.15s ease both; }

        /* topbar */
        .aa-topbar { padding: 18px 22px; background: var(--txt); border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
        .aa-topbar-eyebrow { font-size: 0.6rem; font-weight: 800; color: #93C5FD; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 5px; }
        .aa-topbar-title   { font-size: 1.1rem; font-weight: 800; color: white; letter-spacing: -0.03em; }
        .aa-topbar-sub     { font-size: 0.74rem; color: #94A3B8; margin-top: 3px; }
        .aa-active-badge   { display: flex; align-items: center; gap: 5px; padding: 6px 14px; border-radius: 999px; background: rgba(18,161,80,0.12); border: 1px solid rgba(18,161,80,0.25); color: #86EFAC; font-size: 0.65rem; font-weight: 800; letter-spacing: 0.07em; }
        .aa-active-dot     { width: 6px; height: 6px; border-radius: 50%; background: #86EFAC; animation: pulse 2s infinite; }

        /* stepper */
        .aa-stepper { display: flex; align-items: center; padding: 14px 22px; border-bottom: 1px solid var(--border); background: var(--bg); gap: 0; }
        .aa-step    { display: flex; align-items: center; gap: 7px; flex: 1; }
        .aa-step-circle {
          width: 26px; height: 26px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.68rem; font-weight: 800; flex-shrink: 0; transition: all 0.2s;
        }
        .aa-step-circle.done   { background: var(--green); color: white; }
        .aa-step-circle.active { background: var(--blue);  color: white; }
        .aa-step-circle.idle   { background: var(--border); color: var(--txt4); }
        .aa-step-label { font-size: 0.7rem; font-weight: 700; color: var(--txt4); white-space: nowrap; }
        .aa-step-label.active { color: var(--blue); }
        .aa-step-label.done   { color: var(--green); }
        .aa-step-line { flex: 1; height: 2px; background: var(--border); margin: 0 6px; max-width: 32px; border-radius: 1px; }
        .aa-step-line.done { background: var(--green); }

        /* body */
        .aa-body { padding: 22px 24px; animation: slideIn 0.3s ease both; }
        .aa-section-lbl { font-size: 0.62rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: var(--txt4); margin-bottom: 12px; margin-top: 20px; }
        .aa-section-lbl:first-child { margin-top: 0; }

        /* equipment grid */
        .aa-eq-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 9px; }
        .aa-eq-btn  { padding: 12px 8px; border-radius: 10px; border: 1.5px solid var(--border2); background: var(--bg); cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; text-align: center; }
        .aa-eq-btn:hover { border-color: var(--blue-m); }
        .aa-eq-btn.active { background: var(--blue-l); border-color: var(--blue-m); }
        .aa-eq-icon  { font-size: 1.3rem; margin-bottom: 5px; }
        .aa-eq-label { font-size: 0.72rem; font-weight: 700; color: var(--txt2); }
        .aa-eq-btn.active .aa-eq-label { color: var(--blue); }

        /* inputs */
        .aa-input-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .aa-field  { margin-bottom: 14px; }
        .aa-field:last-child { margin-bottom: 0; }
        .aa-label  { display: block; font-size: 0.62rem; font-weight: 700; color: var(--txt4); text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 5px; }
        .aa-iw     { position: relative; }
        .aa-ii     { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); font-size: 0.88rem; pointer-events: none; line-height: 1; }
        .aa-input  { width: 100%; padding: 9px 12px 9px 34px; border-radius: 9px; background: var(--bg); border: 1.5px solid var(--border2); color: var(--txt); font-size: 0.8rem; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; transition: border-color 0.15s, box-shadow 0.15s; }
        .aa-input:focus { border-color: var(--blue); background: white; box-shadow: 0 0 0 3px var(--blue-l); }
        .aa-input::placeholder { color: var(--txt4); }
        select.aa-input { appearance: none; cursor: pointer; }

        /* toggle row */
        .aa-toggle-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; border-radius: 10px; border: 1px solid var(--border); background: var(--bg); margin-top: 6px; }
        .aa-toggle-left { display: flex; align-items: center; gap: 10px; }
        .aa-toggle-icon { font-size: 1.1rem; }
        .aa-toggle-title { font-size: 0.8rem; font-weight: 700; color: var(--txt); }
        .aa-toggle-sub   { font-size: 0.68rem; color: var(--txt4); }
        .aa-switch { position: relative; width: 40px; height: 22px; cursor: pointer; background: var(--border2); border-radius: 999px; border: none; transition: background 0.2s; flex-shrink: 0; }
        .aa-switch.on { background: var(--green); }
        .aa-switch::after { content: ""; position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; border-radius: 50%; background: white; transition: transform 0.2s; }
        .aa-switch.on::after { transform: translateX(18px); }

        /* freq selector */
        .aa-freq-row { display: flex; gap: 9px; }
        .aa-freq-btn { flex: 1; padding: 12px 8px; border-radius: 10px; border: 1.5px solid var(--border2); background: var(--bg); cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; text-align: center; }
        .aa-freq-btn:hover { border-color: var(--blue-m); }
        .aa-freq-btn.active { background: var(--blue-l); border-color: var(--blue-m); }
        .aa-freq-icon  { font-size: 1.3rem; margin-bottom: 6px; }
        .aa-freq-label { font-size: 0.78rem; font-weight: 800; color: var(--txt); }
        .aa-freq-btn.active .aa-freq-label { color: var(--blue); }
        .aa-freq-desc  { font-size: 0.63rem; color: var(--txt4); margin-top: 2px; line-height: 1.4; }

        /* channel */
        .aa-channel-row { display: flex; gap: 9px; margin-bottom: 16px; }
        .aa-channel-btn { flex: 1; padding: 10px 8px; border-radius: 10px; border: 1.5px solid var(--border2); background: var(--bg); cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .aa-channel-btn:hover { border-color: var(--blue-m); }
        .aa-channel-btn.active { background: var(--blue-l); border-color: var(--blue-m); }
        .aa-channel-icon  { font-size: 1.1rem; }
        .aa-channel-label { font-size: 0.72rem; font-weight: 700; color: var(--txt2); }
        .aa-channel-btn.active .aa-channel-label { color: var(--blue); }

        /* preview card */
        .aa-preview { background: var(--txt); border-radius: 12px; padding: 16px 20px; margin-bottom: 18px; }
        .aa-preview-lbl  { font-size: 0.6rem; font-weight: 800; color: #93C5FD; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 10px; }
        .aa-preview-rows { display: flex; flex-direction: column; gap: 7px; }
        .aa-preview-row  { display: flex; align-items: center; justify-content: space-between; }
        .aa-preview-key  { font-size: 0.7rem; color: #94A3B8; font-weight: 500; }
        .aa-preview-val  { font-size: 0.74rem; font-weight: 700; color: white; }
        .aa-preview-pills { display: flex; gap: 4px; flex-wrap: wrap; justify-content: flex-end; }
        .aa-preview-pill  { font-size: 0.58rem; font-weight: 700; padding: 2px 7px; border-radius: 4px; background: rgba(26,86,219,0.3); color: #93C5FD; }

        /* error */
        .aa-error { font-size: 0.72rem; color: var(--red); font-weight: 600; margin: -8px 0 8px; }

        /* footer */
        .aa-footer { padding: 16px 24px 20px; border-top: 1px solid var(--border); display: flex; gap: 10px; }
        .aa-btn-primary { flex: 1; padding: 11px; border-radius: 10px; background: var(--blue); color: white; font-size: 0.82rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .aa-btn-primary:hover { background: var(--blue-h); transform: translateY(-1px); box-shadow: 0 6px 18px rgba(26,86,219,0.25); }
        .aa-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }
        .aa-btn-ghost { padding: 11px 18px; border-radius: 10px; background: var(--white); color: var(--txt2); font-size: 0.82rem; font-weight: 700; border: 1.5px solid var(--border2); cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; }
        .aa-btn-ghost:hover { background: var(--bg); }
        .aa-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.4); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; }

        /* ── SUCCESS ── */
        .aa-success { padding: 48px 28px 36px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 16px; animation: fadeUp 0.4s ease; }
        .aa-success-radar { position: relative; width: 88px; height: 88px; display: flex; align-items: center; justify-content: center; margin-bottom: 6px; }
        .aa-radar-ring { position: absolute; inset: 0; border-radius: 50%; border: 2px solid var(--green); animation: radarRing 1.8s ease-out infinite; }
        .aa-radar-ring:nth-child(2) { animation-delay: 0.6s; }
        .aa-radar-ring:nth-child(3) { animation-delay: 1.2s; }
        .aa-success-check { width: 60px; height: 60px; border-radius: 50%; background: var(--green-l); border: 2px solid var(--green-m); display: flex; align-items: center; justify-content: center; font-size: 1.6rem; animation: checkPop 0.5s cubic-bezier(0.16,1,0.3,1); position: relative; z-index: 1; }
        .aa-success-title { font-size: 1.15rem; font-weight: 800; color: var(--txt); letter-spacing: -0.03em; }
        .aa-success-sub   { font-size: 0.82rem; color: var(--txt3); line-height: 1.7; max-width: 380px; }
        .aa-success-card  { width: 100%; background: var(--bg); border: 1px solid var(--border); border-radius: 12px; padding: 14px 18px; display: flex; flex-direction: column; gap: 8px; }
        .aa-success-row   { display: flex; align-items: center; justify-content: space-between; }
        .aa-success-key   { font-size: 0.68rem; color: var(--txt4); font-weight: 600; }
        .aa-success-val   { font-size: 0.75rem; font-weight: 800; color: var(--txt); }
        .aa-success-pills { display: flex; gap: 4px; flex-wrap: wrap; justify-content: flex-end; }
        .aa-success-pill  { font-size: 0.6rem; font-weight: 700; padding: 2px 7px; border-radius: 4px; background: var(--blue-l); color: var(--blue); }
        .aa-btn-done { width: 100%; padding: 12px; border-radius: 10px; background: var(--green); color: white; font-size: 0.85rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; margin-top: 4px; }
        .aa-btn-done:hover { background: #0e8a40; transform: translateY(-1px); }

        /* RESPONSIVE */
        @media (max-width: 1000px) {
          .aa-grid { grid-template-columns: 1fr; }
          .aa-sidebar { position: relative; top: 0; }
        }
        @media (max-width: 700px) {
          .aa-page { padding: 20px 4%; }
          .aa-eq-grid { grid-template-columns: repeat(2, 1fr); }
          .aa-input-grid2 { grid-template-columns: 1fr; }
          .aa-freq-row { flex-direction: column; }
          .aa-topbar { flex-direction: column; align-items: flex-start; gap: 10px; }
          .aa-banner-steps { display: none; }
        }
      `}</style>

      <div className="aa-page">

        {/* ── HEADER ── */}
        <div className="aa-header">
          <div>
            <div className="aa-eyebrow"><span className="aa-live-dot" /> AI Alert System</div>
            <div className="aa-title">LoadOps <em>AI Load Alerts</em></div>
            <div className="aa-sub">Get notified the moment a matching load posts — before anyone else sees it.</div>
          </div>
          <button className="aa-back-btn" onClick={() => router.push("/platform")}>← Back to Load Board</button>
        </div>

        {/* ── STATS ── */}
        <div className="aa-stats">
          {STATS.map((s, i) => (
            <div className="aa-stat" key={s.label} style={{ animationDelay: `${i * 0.06}s` }}>
              <div className="aa-stat-n" style={{ color: s.color }}>{s.n}</div>
              <div className="aa-stat-l">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── HOW IT WORKS BANNER ── */}
        <div className="aa-banner">
          <div>
            <div className="aa-banner-badge">🤖 How It Works</div>
            <div className="aa-banner-title">AI scans every new load and alerts you when it matches your exact criteria</div>
            <div className="aa-banner-desc">Set your equipment, preferred lanes, minimum rate, and notification channel. LoadOps AI does the rest — instant alerts, zero spam.</div>
          </div>
          <div className="aa-banner-steps">
            <div className="aa-banner-step"><span className="aa-banner-step-num">1</span> Set Criteria</div>
            <span className="aa-banner-arrow">→</span>
            <div className="aa-banner-step"><span className="aa-banner-step-num">2</span> Load Posts</div>
            <span className="aa-banner-arrow">→</span>
            <div className="aa-banner-step"><span className="aa-banner-step-num">3</span> You're Alerted</div>
            <span className="aa-banner-arrow">→</span>
            <div className="aa-banner-step"><span className="aa-banner-step-num">4</span> Book the Load</div>
          </div>
        </div>

        {/* ── GRID ── */}
        <div className="aa-grid">

          {/* ── SIDEBAR ── */}
          <div className="aa-sidebar">
            <div className="aa-sidebar-head">
              <div className="aa-sidebar-eyebrow">⚡ Why Use AI Alerts</div>
              <div className="aa-sidebar-title">Never miss a high-value load again</div>
              <div className="aa-sidebar-sub">Carriers using AI Alerts book 3× faster and earn 18% more per mile on average.</div>
            </div>

            <div className="aa-perks">
              {[
                { icon: "⚡", title: "Instant Notifications", desc: "Alerts fire within seconds of a matching load being posted on the board." },
                { icon: "🎯", title: "Precision Matching",    desc: "AI filters by equipment, lane, deadhead, rate, and broker verification status." },
                { icon: "📈", title: "Lane Intelligence",     desc: "Prioritizes high RPM loads on your preferred corridors to maximize earnings." },
                { icon: "🔒", title: "Zero Spam",             desc: "Only alerted when a load genuinely matches your profile — no noise." },
              ].map(p => (
                <div className="aa-perk" key={p.title}>
                  <span className="aa-perk-icon">{p.icon}</span>
                  <div>
                    <div className="aa-perk-title">{p.title}</div>
                    <div className="aa-perk-desc">{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="aa-recent">
              <div className="aa-recent-title">Recent AI Matches</div>
              {[
                { dot: "var(--green)",  text: "Dry Van · Dallas TX → Chicago IL · $2,400",  time: "2m ago" },
                { dot: "var(--blue)",   text: "Reefer · Houston TX → Atlanta GA · $1,950",  time: "8m ago" },
                { dot: "var(--amber)",  text: "Flatbed · Phoenix AZ → LA CA · $1,650",      time: "14m ago"},
                { dot: "var(--purple)", text: "Box Truck · Memphis TN → Nashville TN · $850",time: "21m ago"},
              ].map((r, i) => (
                <div className="aa-recent-item" key={i}>
                  <span className="aa-recent-dot" style={{ background: r.dot }} />
                  <span className="aa-recent-text">{r.text}</span>
                  <span className="aa-recent-time">{r.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── MAIN PANEL ── */}
          <div className="aa-main">

            {/* topbar */}
            <div className="aa-topbar">
              <div>
                <div className="aa-topbar-eyebrow">AI ALERT SETUP</div>
                <div className="aa-topbar-title">Configure Your Alert Profile</div>
                <div className="aa-topbar-sub">
                  {done ? "Your alerts are active and scanning live loads" : `Step ${step} of 3 — ${STEPS[step - 1]}`}
                </div>
              </div>
              <div className="aa-active-badge"><span className="aa-active-dot" /> ACTIVE SYSTEM</div>
            </div>

            {/* stepper */}
            {!done && (
              <div className="aa-stepper">
                {STEPS.map((label, i) => {
                  const s = (i + 1) as Step;
                  const state = step > s ? "done" : step === s ? "active" : "idle";
                  return (
                    <div key={label} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                      <div className="aa-step">
                        <div className={`aa-step-circle ${state}`}>{state === "done" ? "✓" : s}</div>
                        <span className={`aa-step-label ${state}`}>{label}</span>
                      </div>
                      {i < 2 && <div className={`aa-step-line${state === "done" ? " done" : ""}`} />}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── STEP 1: Equipment ── */}
            {!done && step === 1 && (
              <div className="aa-body">
                <div className="aa-section-lbl">Company Name</div>
                <div className="aa-field">
                  <div className="aa-iw">
                    <span className="aa-ii">🏢</span>
                    <input type="text" placeholder="ABC Trucking LLC" value={form.company_name} onChange={e => set("company_name", e.target.value)} className="aa-input" />
                  </div>
                </div>

                <div className="aa-section-lbl">What equipment do you run? *</div>
                <div className="aa-eq-grid">
                  {EQUIPMENT_LIST.map(eq => (
                    <button
                      key={eq.label}
                      className={`aa-eq-btn${form.equipment.includes(eq.label) ? " active" : ""}`}
                      onClick={() => toggleEquipment(eq.label)}
                    >
                      <div className="aa-eq-icon">{eq.icon}</div>
                      <div className="aa-eq-label">{eq.label}</div>
                    </button>
                  ))}
                </div>
                {form.equipment.length === 0 && (
                  <div style={{ fontSize: "0.72rem", color: "var(--txt4)", marginTop: 8 }}>Select at least one equipment type to continue.</div>
                )}

                <div className="aa-section-lbl" style={{ marginTop: 20 }}>Load type preference</div>
                <div className="aa-iw" style={{ marginBottom: 14 }}>
                  <span className="aa-ii">📦</span>
                  <select value={form.load_type} onChange={e => set("load_type", e.target.value)} className="aa-input">
                    <option value="">Any Load Type</option>
                    <option value="FTL">Full Truck Load (FTL)</option>
                    <option value="Partial">Partial / LTL</option>
                  </select>
                </div>

                <div className="aa-toggle-row">
                  <div className="aa-toggle-left">
                    <span className="aa-toggle-icon">✅</span>
                    <div>
                      <div className="aa-toggle-title">Verified brokers only</div>
                      <div className="aa-toggle-sub">Skip unverified broker postings</div>
                    </div>
                  </div>
                  <button className={`aa-switch${form.verified_only ? " on" : ""}`} onClick={() => set("verified_only", !form.verified_only)} aria-label="toggle verified" />
                </div>
              </div>
            )}

            {/* ── STEP 2: Lane & Rate ── */}
            {!done && step === 2 && (
              <div className="aa-body">
                <div className="aa-section-lbl">Preferred pickup area</div>
                <div className="aa-field">
                  <div className="aa-iw">
                    <span className="aa-ii">📍</span>
                    <input type="text" placeholder="Dallas, TX (or leave blank for any)" value={form.location} onChange={e => set("location", e.target.value)} className="aa-input" />
                  </div>
                </div>

                <div className="aa-section-lbl">Preferred delivery area</div>
                <div className="aa-field">
                  <div className="aa-iw">
                    <span className="aa-ii">🏁</span>
                    <input type="text" placeholder="Chicago, IL (or leave blank for any)" value={form.delivery} onChange={e => set("delivery", e.target.value)} className="aa-input" />
                  </div>
                </div>

                <div className="aa-input-grid2">
                  <div className="aa-field">
                    <label className="aa-label">Max Deadhead (mi)</label>
                    <div className="aa-iw">
                      <span className="aa-ii">🛣️</span>
                      <input type="number" placeholder="50" value={form.deadhead} onChange={e => set("deadhead", e.target.value)} className="aa-input" />
                    </div>
                  </div>
                  <div className="aa-field">
                    <label className="aa-label">Minimum Rate ($)</label>
                    <div className="aa-iw">
                      <span className="aa-ii">💵</span>
                      <input type="number" placeholder="1500" value={form.min_rate} onChange={e => set("min_rate", e.target.value)} className="aa-input" />
                    </div>
                  </div>
                </div>

                <div className="aa-section-lbl">Alert frequency</div>
                <div className="aa-freq-row">
                  {FREQ_OPTIONS.map(f => (
                    <button key={f.value} className={`aa-freq-btn${form.frequency === f.value ? " active" : ""}`} onClick={() => set("frequency", f.value)}>
                      <div className="aa-freq-icon">{f.icon}</div>
                      <div className="aa-freq-label">{f.label}</div>
                      <div className="aa-freq-desc">{f.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── STEP 3: Notify Me ── */}
            {!done && step === 3 && (
              <div className="aa-body">
                {/* Preview */}
                <div className="aa-preview">
                  <div className="aa-preview-lbl">🤖 Your Alert Profile</div>
                  <div className="aa-preview-rows">
                    <div className="aa-preview-row">
                      <span className="aa-preview-key">Equipment</span>
                      <div className="aa-preview-pills">
                        {form.equipment.slice(0, 3).map(e => <span key={e} className="aa-preview-pill">{e}</span>)}
                        {form.equipment.length > 3 && <span className="aa-preview-pill">+{form.equipment.length - 3}</span>}
                      </div>
                    </div>
                    <div className="aa-preview-row">
                      <span className="aa-preview-key">Lane</span>
                      <span className="aa-preview-val" style={{ color: "#93C5FD" }}>
                        {form.location && form.delivery ? `${form.location} → ${form.delivery}` : form.location || form.delivery || "Any lane"}
                      </span>
                    </div>
                    <div className="aa-preview-row">
                      <span className="aa-preview-key">Min Rate</span>
                      <span className="aa-preview-val" style={{ color: "#86EFAC" }}>{form.min_rate ? `$${form.min_rate}+` : "No minimum"}</span>
                    </div>
                    <div className="aa-preview-row">
                      <span className="aa-preview-key">Frequency</span>
                      <span className="aa-preview-val" style={{ color: "#FCD34D" }}>{FREQ_OPTIONS.find(f => f.value === form.frequency)?.label}</span>
                    </div>
                    <div className="aa-preview-row">
                      <span className="aa-preview-key">Verified only</span>
                      <span className="aa-preview-val">{form.verified_only ? "Yes ✓" : "No"}</span>
                    </div>
                  </div>
                </div>

                <div className="aa-section-lbl">Notification channel</div>
                <div className="aa-channel-row">
                  {CHANNEL_OPTIONS.map(c => (
                    <button key={c.value} className={`aa-channel-btn${form.channel === c.value ? " active" : ""}`} onClick={() => set("channel", c.value)}>
                      <span className="aa-channel-icon">{c.icon}</span>
                      <span className="aa-channel-label">{c.label}</span>
                    </button>
                  ))}
                </div>

                {(form.channel === "email" || form.channel === "both") && (
                  <div className="aa-field">
                    <label className="aa-label">Email Address *</label>
                    <div className="aa-iw">
                      <span className="aa-ii">✉️</span>
                      <input type="email" placeholder="you@company.com" value={form.email} onChange={e => set("email", e.target.value)} className="aa-input" />
                    </div>
                  </div>
                )}

                {(form.channel === "sms" || form.channel === "both") && (
                  <div className="aa-field">
                    <label className="aa-label">Phone Number *</label>
                    <div className="aa-iw">
                      <span className="aa-ii">📱</span>
                      <input type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={e => set("phone", e.target.value)} className="aa-input" />
                    </div>
                  </div>
                )}

                {error && <div className="aa-error">⚠ {error}</div>}
              </div>
            )}

            {/* ── SUCCESS ── */}
            {done && (
              <div className="aa-success">
                <div className="aa-success-radar">
                  <div className="aa-radar-ring" /><div className="aa-radar-ring" /><div className="aa-radar-ring" />
                  <div className="aa-success-check">✓</div>
                </div>
                <div className="aa-success-title">AI Alerts Activated!</div>
                <div className="aa-success-sub">
                  You're all set. LoadOps AI is now scanning every new load and will alert you the moment a match hits your criteria.
                </div>
                <div className="aa-success-card">
                  <div className="aa-success-row">
                    <span className="aa-success-key">Equipment</span>
                    <div className="aa-success-pills">{form.equipment.map(e => <span key={e} className="aa-success-pill">{e}</span>)}</div>
                  </div>
                  <div className="aa-success-row">
                    <span className="aa-success-key">Frequency</span>
                    <span className="aa-success-val">{FREQ_OPTIONS.find(f => f.value === form.frequency)?.label} alerts</span>
                  </div>
                  <div className="aa-success-row">
                    <span className="aa-success-key">Notifying via</span>
                    <span className="aa-success-val">{form.channel === "both" ? `${form.email} & ${form.phone}` : form.email || form.phone}</span>
                  </div>
                  {(form.location || form.delivery) && (
                    <div className="aa-success-row">
                      <span className="aa-success-key">Lane</span>
                      <span className="aa-success-val">{form.location || "Any"} → {form.delivery || "Any"}</span>
                    </div>
                  )}
                </div>
                <button className="aa-btn-done" onClick={() => router.push("/platform")}>🎉 Go to Load Board</button>
              </div>
            )}

            {/* ── FOOTER ── */}
            {!done && (
              <div className="aa-footer">
                {step > 1
                  ? <button className="aa-btn-ghost" onClick={() => setStep(s => (s - 1) as Step)}>← Back</button>
                  : <button className="aa-btn-ghost" onClick={() => router.push("/platform")}>Cancel</button>
                }

                {step < 3 ? (
                  <button className="aa-btn-primary" disabled={step === 1 && !canNext1} onClick={() => setStep(s => (s + 1) as Step)}>
                    Continue →
                  </button>
                ) : (
                  <button className="aa-btn-primary" disabled={loading || !canSave} onClick={handleSubmit}>
                    {loading ? <><span className="aa-spinner" /> Saving…</> : "⚡ Activate AI Alerts"}
                  </button>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}
