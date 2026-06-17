"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function CarrierTools() {
  const router = useRouter();
  const [isPremium, setIsPremium] = useState(false);
  useEffect(() => {
  async function checkPlan() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("subscription_plan")
      .eq("id", user.id)
      .single();

    if (data?.subscription_plan === "pro") {
      setIsPremium(true);
    }
  }

  checkPlan();
}, []);

  return (
    <main style={{ minHeight: "100vh", background: "#FFFFFF", fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#0F1520", overflowX: "hidden" }}>

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

        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 3px #EBF1FD; }
          50%       { box-shadow: 0 0 0 6px #EBF1FD; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes inboxSlide {
          from { opacity: 0; transform: translateX(12px); }
          to   { opacity: 1; transform: none; }
        }

        /* ── HERO ── */
        .ct-hero {
          padding: 80px 5% 70px;
          background: var(--white);
          text-align: center;
          position: relative; overflow: hidden;
        }
        .ct-hero::before {
          content: '';
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 90% 60% at 50% -5%, rgba(26,86,219,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 5%  90%, rgba(18,161,80,0.04)  0%, transparent 55%),
            radial-gradient(ellipse 40% 30% at 95% 80%, rgba(124,58,237,0.04) 0%, transparent 55%);
        }
        .ct-hero::after {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(26,86,219,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(26,86,219,0.035) 1px, transparent 1px);
          background-size: 52px 52px;
          mask-image: radial-gradient(ellipse 80% 70% at 50% 0%, black 0%, transparent 70%);
        }
        .ct-hero-inner { position: relative; z-index: 1; }

        .ct-badge {
          display: inline-flex; align-items: center; gap: 7px;
          background: var(--blue-l); border: 1px solid var(--blue-m);
          color: var(--blue); border-radius: 20px;
          font-size: 0.7rem; font-weight: 700; letter-spacing: 0.06em;
          padding: 5px 14px; margin-bottom: 24px; text-transform: uppercase;
          animation: fadeUp 0.6s ease both;
        }
        .ct-live-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--green); animation: pulse 2s infinite; display: inline-block; }

        .ct-hero h1 {
          font-size: clamp(2.2rem, 5.5vw, 3.8rem);
          font-weight: 800; letter-spacing: -0.045em; line-height: 1.05;
          color: var(--txt); margin-bottom: 20px;
          max-width: 800px; margin-left: auto; margin-right: auto;
          animation: fadeUp 0.6s 0.1s ease both;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .ct-hero h1 em { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; color: var(--blue); }

        .ct-hero-sub {
          font-size: 1rem; color: var(--txt3); max-width: 540px;
          margin: 0 auto 36px; line-height: 1.75; font-weight: 400;
          animation: fadeUp 0.6s 0.2s ease both;
        }

        .ct-hero-cta { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; animation: fadeUp 0.6s 0.3s ease both; }
        .ct-btn {
          padding: 13px 26px; border-radius: 10px; font-size: 0.86rem; font-weight: 700;
          border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif;
          letter-spacing: -0.01em; transition: all 0.18s;
        }
        .ct-btn-primary { background: var(--blue); color: #fff; box-shadow: 0 1px 3px rgba(26,86,219,0.3), 0 4px 16px rgba(26,86,219,0.2); }
        .ct-btn-primary:hover { background: var(--blue-h); transform: translateY(-1px); }
        .ct-btn-ghost { background: transparent; color: var(--txt3); border: 1.5px solid var(--border2); }
        .ct-btn-ghost:hover { color: var(--txt); }

        .ct-hero-proof {
          display: flex; align-items: center; justify-content: center; gap: 16px;
          flex-wrap: wrap; margin-top: 36px; animation: fadeUp 0.6s 0.4s ease both;
        }
        .ct-proof-avs { display: flex; }
        .ct-proof-avs span { width: 28px; height: 28px; border-radius: 50%; background: var(--bg2); border: 2px solid #fff; display: flex; align-items: center; justify-content: center; font-size: 0.62rem; font-weight: 700; color: var(--txt3); margin-left: -8px; }
        .ct-proof-avs span:first-child { margin-left: 0; }
        .ct-proof-txt { font-size: 0.74rem; color: var(--txt3); }
        .ct-proof-txt b { color: var(--txt2); }
        .ct-pdiv { width: 1px; height: 18px; background: var(--border); }
        .ct-pstars { color: #F59E0B; font-size: 0.75rem; }

        /* ── STATS ── */
        .ct-stats { display: grid; grid-template-columns: repeat(4,1fr); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); background: var(--bg); }
        .ct-sc { padding: 26px 20px; border-right: 1px solid var(--border); text-align: center; }
        .ct-sc:last-child { border-right: none; }
        .ct-sn { font-size: 1.8rem; font-weight: 800; color: var(--txt); letter-spacing: -0.04em; line-height: 1.1; font-family: 'Plus Jakarta Sans', sans-serif; }
        .ct-sn span { color: var(--blue); }
        .ct-sl { font-size: 0.7rem; color: var(--txt3); font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; margin-top: 3px; }

        /* ── SECTION COMMONS ── */
        .ct-section { padding: 80px 5%; }
        .ct-section-alt { background: var(--bg); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
        .ct-eyebrow { display: flex; align-items: center; gap: 8px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--blue); margin-bottom: 12px; }
        .ct-eyebrow::before { content: ''; width: 20px; height: 2px; background: var(--blue); border-radius: 1px; }
        .ct-eyebrow.green  { color: var(--green);  } .ct-eyebrow.green::before  { background: var(--green);  }
        .ct-eyebrow.purple { color: var(--purple); } .ct-eyebrow.purple::before { background: var(--purple); }
        .ct-section-title { font-size: clamp(1.5rem,3vw,2.2rem); font-weight: 800; letter-spacing: -0.04em; color: var(--txt); margin-bottom: 8px; line-height: 1.12; font-family: 'Plus Jakarta Sans', sans-serif; }
        .ct-section-title em { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; color: var(--blue); }
        .ct-section-sub { font-size: 0.87rem; color: var(--txt3); max-width: 480px; margin-bottom: 44px; line-height: 1.7; font-weight: 400; }
        .ct-centered { text-align: center; }
        .ct-centered .ct-eyebrow { justify-content: center; }
        .ct-centered .ct-eyebrow::before { display: none; }
        .ct-centered .ct-section-sub { margin-left: auto; margin-right: auto; }

        /* ── 3 CORE TOOL CARDS ── */
        .ct-tools-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
        .ct-tool-card { border-radius: 18px; border: 1px solid var(--border); background: var(--white); overflow: hidden; transition: transform 0.22s, box-shadow 0.22s; }
        .ct-tool-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(0,0,0,0.09); }
        .ct-tool-header { padding: 26px 26px 20px; }
        .ct-tool-icon-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .ct-tool-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
        .ct-tool-badge { font-size: 0.6rem; font-weight: 800; padding: 3px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.07em; }
        .ct-tool-title { font-size: 1rem; font-weight: 800; color: var(--txt); letter-spacing: -0.02em; margin-bottom: 8px; }
        .ct-tool-desc { font-size: 0.79rem; color: var(--txt3); line-height: 1.65; font-weight: 400; }
        .ct-tool-features { padding: 0 26px 22px; display: flex; flex-direction: column; gap: 8px; }
        .ct-tool-feat { display: flex; align-items: center; gap: 8px; font-size: 0.77rem; color: var(--txt2); font-weight: 500; }
        .ct-tool-feat::before { content: '✓'; width: 18px; height: 18px; border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 800; flex-shrink: 0; }
        .ct-tool-footer { padding: 16px 26px; border-top: 1px solid var(--border); }
        .ct-tool-cta { width: 100%; padding: 11px; border-radius: 9px; font-size: 0.8rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: opacity 0.15s; }
        .ct-tool-cta:hover { opacity: 0.88; }

        /* Blue card */
        .ct-card-blue .ct-tool-header { background: linear-gradient(135deg, var(--blue-l) 0%, var(--white) 100%); }
        .ct-card-blue .ct-tool-icon   { background: var(--blue); color: #fff; }
        .ct-card-blue .ct-tool-badge  { background: var(--blue-m); color: var(--blue); }
        .ct-card-blue .ct-tool-feat::before { background: var(--blue-l); color: var(--blue); }
        .ct-card-blue .ct-tool-cta    { background: var(--blue); color: #fff; }

        /* Green card */
        .ct-card-green .ct-tool-header { background: linear-gradient(135deg, var(--green-l) 0%, var(--white) 100%); }
        .ct-card-green .ct-tool-icon   { background: var(--green); color: #fff; }
        .ct-card-green .ct-tool-badge  { background: var(--green-m); color: var(--green); }
        .ct-card-green .ct-tool-feat::before { background: var(--green-l); color: var(--green); }
        .ct-card-green .ct-tool-cta    { background: var(--green); color: #fff; }

        /* Purple card */
        .ct-card-purple .ct-tool-header { background: linear-gradient(135deg, var(--purple-l) 0%, var(--white) 100%); }
        .ct-card-purple .ct-tool-icon   { background: var(--purple); color: #fff; }
        .ct-card-purple .ct-tool-badge  { background: var(--purple-m); color: var(--purple); }
        .ct-card-purple .ct-tool-feat::before { background: var(--purple-l); color: var(--purple); }
        .ct-card-purple .ct-tool-cta    { background: var(--purple); color: #fff; }

        /* ── SPLIT GRID ── */
        .ct-split-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }

        /* ── AI INBOX MOCK ── */
        .ct-inbox-mock { background: var(--white); border: 1px solid var(--border); border-radius: 18px; overflow: hidden; box-shadow: 0 12px 40px rgba(0,0,0,0.08); }
        .ct-inbox-header { padding: 16px 20px; background: var(--bg); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
        .ct-inbox-title { font-size: 0.82rem; font-weight: 700; color: var(--txt); }
        .ct-inbox-badge { background: var(--blue); color: #fff; font-size: 0.62rem; font-weight: 800; padding: 2px 8px; border-radius: 10px; }
        .ct-inbox-item { padding: 14px 20px; border-bottom: 1px solid var(--border); display: flex; gap: 12px; align-items: flex-start; cursor: pointer; transition: background 0.15s; }
        .ct-inbox-item:last-child { border-bottom: none; }
        .ct-inbox-item:hover { background: var(--bg); }
        .ct-inbox-item.unread { border-left: 3px solid var(--blue); background: var(--blue-l); }
        .ct-inbox-item.unread:hover { background: #dde9fd; }
        .ct-inbox-avatar { width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; }
        .ct-inbox-body { flex: 1; }
        .ct-inbox-from { font-size: 0.78rem; font-weight: 700; color: var(--txt); margin-bottom: 2px; display: flex; align-items: center; gap: 6px; }
        .ct-vbadge { font-size: 0.58rem; font-weight: 800; padding: 1px 5px; border-radius: 3px; background: var(--green-l); color: var(--green); }
        .ct-inbox-route { font-size: 0.74rem; color: var(--txt3); margin-bottom: 2px; font-weight: 400; }
        .ct-inbox-meta { display: flex; align-items: center; gap: 8px; }
        .ct-inbox-rate { font-size: 0.72rem; font-weight: 700; color: var(--green); }
        .ct-inbox-time { font-size: 0.67rem; color: var(--txt4); margin-left: auto; }
        .ct-inbox-ai-tag { font-size: 0.58rem; font-weight: 800; padding: 1px 6px; border-radius: 3px; background: var(--purple-l); color: var(--purple); }

        /* ── RATE INTEL MOCK ── */
        .ct-rate-mock { background: var(--white); border: 1px solid var(--border); border-radius: 18px; overflow: hidden; box-shadow: 0 12px 40px rgba(0,0,0,0.08); }
        .ct-rate-mock-header { padding: 14px 20px; background: var(--bg); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
        .ct-rate-mock-title { font-size: 0.82rem; font-weight: 700; color: var(--txt); }
        .ct-rate-mock-live { display: flex; align-items: center; gap: 5px; font-size: 0.65rem; color: var(--green); font-weight: 700; }
        .ct-rate-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); display: inline-block; animation: pulse 2s infinite; }
        .ct-rate-row { padding: 13px 20px; border-bottom: 1px solid var(--border); display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 8px; align-items: center; }
        .ct-rate-row:last-child { border-bottom: none; }
        .ct-rate-row:nth-child(even) { background: var(--bg); }
        .ct-rate-lane { font-size: 0.78rem; font-weight: 600; color: var(--txt2); }
        .ct-rate-rpm { font-size: 0.82rem; font-weight: 800; color: var(--green); }
        .ct-rate-trend { font-size: 0.7rem; font-weight: 700; padding: 2px 7px; border-radius: 4px; }
        .ct-rate-trend.up   { background: var(--green-l); color: var(--green); }
        .ct-rate-trend.down { background: var(--amber-l); color: var(--amber); }

        /* ── BROKER SCORE MOCK ── */
        .ct-broker-mock { background: var(--white); border: 1px solid var(--border); border-radius: 18px; overflow: hidden; box-shadow: 0 12px 40px rgba(0,0,0,0.08); }
        .ct-broker-mock-header { padding: 14px 20px; background: var(--bg); border-bottom: 1px solid var(--border); }
        .ct-broker-mock-title { font-size: 0.82rem; font-weight: 700; color: var(--txt); }
        .ct-broker-item { padding: 14px 20px; border-bottom: 1px solid var(--border); display: flex; gap: 12px; align-items: center; }
        .ct-broker-item:last-child { border-bottom: none; }
        .ct-broker-avatar { width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; }
        .ct-broker-info { flex: 1; }
        .ct-broker-name { font-size: 0.78rem; font-weight: 700; color: var(--txt); margin-bottom: 2px; }
        .ct-broker-detail { font-size: 0.68rem; color: var(--txt3); }
        .ct-broker-score { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }
        .ct-broker-stars { color: #F59E0B; font-size: 0.72rem; }
        .ct-broker-pay { font-size: 0.65rem; color: var(--txt4); font-weight: 500; }

        /* ── FEATURE GRID 4-COL ── */
        .ct-feat-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
        .ct-feat-card { background: var(--white); border: 1px solid var(--border); border-radius: 14px; padding: 22px 18px; transition: transform 0.2s, box-shadow 0.2s; }
        .ct-feat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(0,0,0,0.07); }
        .ct-feat-icon { font-size: 1.5rem; margin-bottom: 12px; }
        .ct-feat-label { font-size: 0.74rem; font-weight: 700; color: var(--blue); text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 6px; }
        .ct-feat-desc { font-size: 0.78rem; color: var(--txt3); line-height: 1.6; font-weight: 400; }

        /* ── COMPARISON TABLE ── */
        .ct-compare-wrap { background: var(--white); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; }
        .ct-compare-head { display: grid; grid-template-columns: 2fr 1fr 1fr; padding: 12px 20px; background: var(--bg); border-bottom: 1px solid var(--border); gap: 8px; }
        .ct-ch { font-size: 0.68rem; font-weight: 700; color: var(--txt4); text-transform: uppercase; letter-spacing: 0.08em; }
        .ct-ch.blue { color: var(--blue); }
        .ct-compare-row { display: grid; grid-template-columns: 2fr 1fr 1fr; padding: 13px 20px; border-bottom: 1px solid var(--border); gap: 8px; align-items: center; }
        .ct-compare-row:last-child { border-bottom: none; }
        .ct-compare-row:nth-child(even) { background: var(--bg); }
        .ct-compare-feat { font-size: 0.79rem; font-weight: 600; color: var(--txt2); }
        .ct-compare-yes { font-size: 0.75rem; color: var(--blue); font-weight: 700; }
        .ct-compare-no  { font-size: 0.75rem; color: var(--txt4); font-weight: 500; }

        /* ── HOW IT WORKS STEPS ── */
        .ct-steps { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
        .ct-step { padding: 26px 22px; background: var(--white); border: 1px solid var(--border); border-radius: 14px; position: relative; transition: transform 0.2s, box-shadow 0.2s; }
        .ct-step:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(0,0,0,0.07); }
        .ct-step-n { width: 32px; height: 32px; border-radius: 8px; background: var(--blue-l); border: 1px solid var(--blue-m); display: flex; align-items: center; justify-content: center; font-size: 0.78rem; font-weight: 800; color: var(--blue); margin-bottom: 12px; }
        .ct-step-icon { font-size: 1.3rem; margin-bottom: 10px; }
        .ct-step-title { font-size: 0.84rem; font-weight: 700; color: var(--txt); margin-bottom: 6px; }
        .ct-step-desc  { font-size: 0.75rem; color: var(--txt3); line-height: 1.65; font-weight: 400; }
        .ct-step-arr { position: absolute; top: 32px; right: -13px; width: 26px; height: 26px; background: var(--white); border: 1px solid var(--border); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.68rem; color: var(--txt4); z-index: 1; }
        .ct-step:last-child .ct-step-arr { display: none; }

        /* ── CTA BANNER ── */
        .ct-cta {
          margin: 0 5% 80px; padding: 60px 5%;
          background: var(--txt); border-radius: 20px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 24px; flex-wrap: wrap; position: relative; overflow: hidden;
        }
        .ct-cta::before {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse 60% 80% at 100% 50%, rgba(26,86,219,0.28)  0%, transparent 55%),
                      radial-gradient(ellipse 40% 60% at 0%   50%, rgba(18,161,80,0.12)  0%, transparent 55%);
        }
        .ct-cta-text { position: relative; z-index: 1; }
        .ct-cta-text h2 { font-size: clamp(1.4rem,3vw,2rem); font-weight: 800; color: #fff; letter-spacing: -0.04em; line-height: 1.2; margin-bottom: 8px; font-family: 'Plus Jakarta Sans', sans-serif; }
        .ct-cta-text h2 em { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; color: #93B5FA; }
        .ct-cta-text p { font-size: 0.86rem; color: #888; max-width: 400px; }
        .ct-cta-btns { display: flex; gap: 10px; flex-wrap: wrap; position: relative; z-index: 1; }
        .ct-cta-btn { padding: 12px 24px; border-radius: 10px; font-size: 0.84rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; }
        .ct-cta-btn-white { background: #fff; color: var(--txt); }
        .ct-cta-btn-white:hover { background: #F0F0F0; }
        .ct-cta-btn-outline { background: transparent; color: #888; border: 1.5px solid #2A2A2A; }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .ct-tools-grid, .ct-split-grid { grid-template-columns: 1fr; }
          .ct-feat-grid { grid-template-columns: 1fr 1fr; }
          .ct-steps { grid-template-columns: 1fr 1fr; }
          .ct-stats { grid-template-columns: repeat(2,1fr); }
        }
        @media (max-width: 600px) {
          .ct-feat-grid, .ct-steps { grid-template-columns: 1fr; }
          .ct-stats { grid-template-columns: repeat(2,1fr); }
          .ct-step-arr { display: none; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="ct-hero">
        <div className="ct-hero-inner">
          <div className="ct-badge">
            <span className="ct-live-dot" />
            {" "}Carrier Tools & Dashboard
          </div>
          <h1>
            Find Loads. Book Fast.<br />
            Keep Your Truck <em>Moving.</em>
          </h1>
          <p className="ct-hero-sub">
            LoadOps AI gives carriers a complete toolkit — AI-matched loads delivered to your inbox,
            live rate intelligence, verified broker scores, dispatcher access, and one-click booking.
            No cold calls. No wasted time.
          </p>
          <div className="ct-hero-cta">
            <button className="ct-btn ct-btn-primary" onClick={() => router.push("/signup?role=carrier")}>
              Start as Carrier Free →
            </button>
            <button className="ct-btn ct-btn-ghost" onClick={() => router.push("/platform")}>
              View Live Load Board
            </button>
          </div>
          <div className="ct-hero-proof">
            <div className="ct-proof-avs">
              <span>JT</span><span>MK</span><span>SR</span><span>PL</span><span>+</span>
            </div>
            <div className="ct-proof-txt">Trusted by <b>7,600+</b> carriers</div>
            <div className="ct-pdiv" />
            <div className="ct-pstars">★★★★★</div>
            <div className="ct-proof-txt"><b>4.9</b> / 5 rating</div>
            <div className="ct-pdiv" />
            <div className="ct-proof-txt"><b>Zero</b> spam calls</div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="ct-stats">
        <div className="ct-sc"><div className="ct-sn">48<span>K+</span></div><div className="ct-sl">Daily Loads Posted</div></div>
        <div className="ct-sc"><div className="ct-sn">4.2<span>s</span></div><div className="ct-sl">AI Match Speed</div></div>
        <div className="ct-sc"><div className="ct-sn">98<span>%</span></div><div className="ct-sl">Verified Brokers</div></div>
        <div className="ct-sc"><div className="ct-sn">0</div><div className="ct-sl">Spam Calls</div></div>
      </div>

      {/* ── CORE TOOLS ── */}
      <section className="ct-section">
        <div className="ct-eyebrow">Core Tools</div>
        <div className="ct-section-title">Three tools that keep your<br /><em>truck earning every mile</em></div>
        <div className="ct-section-sub">Purpose-built for owner-operators and carriers who want better loads, better rates, and zero phone call chaos.</div>

        <div className="ct-tools-grid">
          {/* AI Load Inbox */}
          <div className="ct-tool-card ct-card-blue">
            <div className="ct-tool-header">
              <div className="ct-tool-icon-row">
                <div className="ct-tool-icon">📬</div>
                <div className="ct-tool-badge">AI Load Inbox</div>
              </div>
              <div className="ct-tool-title">Loads Delivered to Your Inbox</div>
              <div className="ct-tool-desc">
                No more searching load boards manually. Our AI learns your lanes, equipment,
                and preferences — then pushes the best matching loads directly to your inbox
                before other carriers even see them on the board.
              </div>
            </div>
            <div className="ct-tool-features">
              <div className="ct-tool-feat">AI-matched loads sent directly to inbox</div>
              <div className="ct-tool-feat">Learns your preferences over time</div>
              <div className="ct-tool-feat">Inbox delivery before board posting</div>
              <div className="ct-tool-feat">Equipment & lane-specific filtering</div>
              <div className="ct-tool-feat">Real-time load alerts via email</div>
              <div className="ct-tool-feat">One-click booking from inbox</div>
            </div>
            <div className="ct-tool-footer">
              <button className="ct-tool-cta" onClick={() => router.push("/signup?role=carrier")}>Activate AI Inbox →</button>
            </div>
          </div>

          {/* Live Rate Intelligence */}
          <div className="ct-tool-card ct-card-green">
            <div className="ct-tool-header">
              <div className="ct-tool-icon-row">
                <div className="ct-tool-icon">📊</div>
                <div className="ct-tool-badge">Rate Intelligence</div>
              </div>
              <div className="ct-tool-title">Live Rate Intelligence by Lane</div>
              <div className="ct-tool-desc">
                Stop guessing what a load should pay. LoadOps AI shows you real-time market
                rates by lane so you always know if a load is worth booking — and when to
                hold out for a better rate on your preferred corridor.
              </div>
            </div>
            <div className="ct-tool-features">
              <div className="ct-tool-feat">Live RPM data by lane & corridor</div>
              <div className="ct-tool-feat">Historical rate trend analysis</div>
              <div className="ct-tool-feat">Market demand heat map by region</div>
              <div className="ct-tool-feat">Rate comparison vs platform average</div>
              <div className="ct-tool-feat">Seasonal rate forecasting signals</div>
              <div className="ct-tool-feat">Backhaul opportunity detection</div>
            </div>
            <div className="ct-tool-footer">
              <button
  className="ct-tool-cta"
  onClick={() => {
    if (!isPremium) {
      router.push("/pricing");
      return;
    }

    router.push("/rate-intelligence");
  }}
>
  {isPremium ? "View Rate Intel →" : "🔒 Upgrade Required"}
</button>
            </div>
          </div>

          {/* Broker Credit Scores */}
          <div className="ct-tool-card ct-card-purple">
            <div className="ct-tool-header">
              <div className="ct-tool-icon-row">
                <div className="ct-tool-icon">⭐</div>
                <div className="ct-tool-badge">Broker Scores</div>
              </div>
              <div className="ct-tool-title">Broker Credit Scores & Reviews</div>
              <div className="ct-tool-desc">
                Every broker on LoadOps AI has a visible credit score, average payment timeline,
                and carrier review rating. Know who pays fast, who pays slow, and who to avoid
                — before you ever accept a load from them.
              </div>
            </div>
            <div className="ct-tool-features">
              <div className="ct-tool-feat">Credit score on every broker profile</div>
              <div className="ct-tool-feat">Average payment days displayed</div>
              <div className="ct-tool-feat">Carrier reviews & ratings visible</div>
              <div className="ct-tool-feat">FMCSA authority verification</div>
              <div className="ct-tool-feat">Load history & reliability data</div>
              <div className="ct-tool-feat">Fraud risk indicators & flags</div>
            </div>
            <div className="ct-tool-footer">
              <button className="ct-tool-cta" onClick={() => router.push("/signup?role=carrier")}>Check Broker Scores →</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI INBOX SECTION ── */}
      <section className="ct-section ct-section-alt">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="ct-split-grid">
            <div>
              <div className="ct-eyebrow">AI Load Inbox</div>
              <div className="ct-section-title">Loads come to <em>you.</em><br />Not the other way around.</div>
              <div className="ct-section-sub" style={{ marginBottom: 28 }}>
                Set your preferences once — equipment type, home region, preferred lanes, and minimum rate.
                The AI does the rest, pushing the best loads to your inbox automatically.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { icon: "⚡", title: "Inbox Before the Board",     desc: "AI-matched loads land in your inbox seconds before they appear on the public load board — giving you first-mover advantage." },
                  { icon: "🧠", title: "Smarter with Every Book",    desc: "The AI tracks what you accept and decline, learning your preferences to surface better and better matches over time." },
                  { icon: "🔇", title: "Zero Cold Calls",            desc: "No broker calling you out of the blue. Accept or decline loads digitally — no negotiation, no phone tag." },
                  { icon: "📬", title: "Email Alerts Too",           desc: "Receive load alert emails matching your profile even when you're not on the platform — never miss a great load." },
                ].map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: "var(--blue-l)", border: "1px solid var(--blue-m)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>{f.icon}</div>
                    <div>
                      <div style={{ fontSize: "0.83rem", fontWeight: 700, color: "var(--txt)", marginBottom: 3 }}>{f.title}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--txt3)", lineHeight: 1.55, fontWeight: 400 }}>{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI INBOX MOCK */}
            <div className="ct-inbox-mock">
              <div className="ct-inbox-header">
                <div className="ct-inbox-title">📬 AI Load Inbox</div>
                <div className="ct-inbox-badge">4 New</div>
              </div>
              {[
                { init: "CL", bg: "#EBF1FD", color: "#1A56DB", name: "Coyote Logistics",  route: "Dallas, TX → Chicago, IL · 1,042 mi · Dry Van",      rate: "$2,840 · $2.73/mi", time: "Just now",  unread: true,  ai: true  },
                { init: "EG", bg: "#E6F7EE", color: "#12A150", name: "Echo Global",        route: "Atlanta, GA → Miami, FL · 662 mi · Reefer",           rate: "$2,210 · $3.34/mi", time: "4 min ago", unread: true,  ai: false },
                { init: "XP", bg: "#FEF3C7", color: "#D97706", name: "XPO Logistics",      route: "Los Angeles, CA → Phoenix, AZ · 370 mi · Flatbed",    rate: "$1,480 · $4.00/mi", time: "9 min ago", unread: true,  ai: true  },
                { init: "CH", bg: "#EDE9FE", color: "#7C3AED", name: "CH Robinson",        route: "Houston, TX → Nashville, TN · 890 mi · Dry Van",      rate: "$2,670 · $3.00/mi", time: "22 min",    unread: false, ai: false },
              ].map((item, i) => (
                <div key={i} className={`ct-inbox-item${item.unread ? " unread" : ""}`}>
                  <div className="ct-inbox-avatar" style={{ background: item.bg, color: item.color }}>{item.init}</div>
                  <div className="ct-inbox-body">
                    <div className="ct-inbox-from">
                      {item.name}
                      <span className="ct-vbadge">✓ VERIFIED</span>
                      {item.ai && <span className="ct-inbox-ai-tag">AI MATCH</span>}
                    </div>
                    <div className="ct-inbox-route">{item.route}</div>
                    <div className="ct-inbox-meta">
                      <span className="ct-inbox-rate">{item.rate}</span>
                      <span className="ct-inbox-time">{item.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── RATE INTEL SECTION ── */}
      <section className="ct-section">
        <div className="ct-split-grid">
          {/* RATE MOCK */}
          <div className="ct-rate-mock">
            <div className="ct-rate-mock-header">
              <div className="ct-rate-mock-title">📊 Live Rate Intelligence</div>
              <div className="ct-rate-mock-live"><span className="ct-rate-dot" /> Updated live</div>
            </div>
            {[
              { lane: "Dallas, TX → Chicago, IL",      rpm: "$2.73/mi", trend: "up",   trendTxt: "↑ +$0.12" },
              { lane: "Atlanta, GA → Miami, FL",        rpm: "$3.34/mi", trend: "up",   trendTxt: "↑ +$0.08" },
              { lane: "Los Angeles, CA → Phoenix, AZ",  rpm: "$4.00/mi", trend: "up",   trendTxt: "↑ +$0.22" },
              { lane: "Houston, TX → Nashville, TN",    rpm: "$3.00/mi", trend: "down", trendTxt: "↓ -$0.05" },
              { lane: "Chicago, IL → Detroit, MI",      rpm: "$2.92/mi", trend: "up",   trendTxt: "↑ +$0.14" },
              { lane: "Seattle, WA → Portland, OR",     rpm: "$2.56/mi", trend: "down", trendTxt: "↓ -$0.03" },
            ].map((r, i) => (
              <div key={i} className="ct-rate-row">
                <div className="ct-rate-lane">{r.lane}</div>
                <div className="ct-rate-rpm">{r.rpm}</div>
                <div className={`ct-rate-trend ${r.trend}`}>{r.trendTxt}</div>
              </div>
            ))}
          </div>

          <div>
            <div className="ct-eyebrow green">Rate Intelligence</div>
            <div className="ct-section-title">Know the market rate<br /><em>before you book</em></div>
            <div className="ct-section-sub" style={{ marginBottom: 28 }}>
              Live RPM data by lane means you never accept below-market rates again.
              See exactly what other carriers are earning on your routes — right now.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { icon: "📈", title: "Live Lane RPM Data",       desc: "Real-time revenue-per-mile rates for every major freight corridor, updated as loads post and book." },
                { icon: "🌎", title: "Regional Demand Heat Map", desc: "See which regions have high freight demand right now so you can position your truck for maximum earnings." },
                { icon: "📅", title: "Seasonal Rate Forecasting", desc: "Understand which months have peak rates on your lanes so you can plan your calendar and route strategy." },
                { icon: "🔄", title: "Backhaul Detection",       desc: "AI automatically surfaces return loads matching your delivery location before you finish your current run." },
              ].map((f, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: "var(--green-l)", border: "1px solid var(--green-m)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>{f.icon}</div>
                  <div>
                    <div style={{ fontSize: "0.83rem", fontWeight: 700, color: "var(--txt)", marginBottom: 3 }}>{f.title}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--txt3)", lineHeight: 1.55, fontWeight: 400 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── BROKER SCORES SECTION ── */}
      <section className="ct-section ct-section-alt">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="ct-split-grid">
            <div>
              <div className="ct-eyebrow purple">Broker Scores</div>
              <div className="ct-section-title">Know who pays fast<br /><em>before you haul</em></div>
              <div className="ct-section-sub" style={{ marginBottom: 28 }}>
                Every broker on LoadOps AI has a transparent credit score, average payment timeline,
                and carrier ratings. Never get stuck waiting 90 days on a bad broker again.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { icon: "⭐", title: "Credit Score on Every Broker",  desc: "See a broker's financial reliability score before accepting any load — updated from real payment data." },
                  { icon: "💰", title: "Average Payment Days",          desc: "Know upfront whether a broker typically pays in 7 days or 60 days. No more surprises after delivery." },
                  { icon: "🛡",  title: "FMCSA Authority Verified",      desc: "Every broker's FMCSA broker authority and insurance are verified before they can post on the platform." },
                  { icon: "🚩", title: "Fraud Risk Flags",              desc: "AI flags brokers with patterns of late payments, disputes, or double-brokering complaints from other carriers." },
                ].map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: "var(--purple-l)", border: "1px solid var(--purple-m)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>{f.icon}</div>
                    <div>
                      <div style={{ fontSize: "0.83rem", fontWeight: 700, color: "var(--txt)", marginBottom: 3 }}>{f.title}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--txt3)", lineHeight: 1.55, fontWeight: 400 }}>{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BROKER SCORE MOCK */}
            <div className="ct-broker-mock">
              <div className="ct-broker-mock-header">
                <div className="ct-broker-mock-title">⭐ Broker Credit Scores</div>
              </div>
              {[
                { init: "CL", bg: "#E6F7EE", color: "#12A150", name: "Coyote Logistics",  detail: "FMCSA Verified · MC-123456", stars: "★★★★★", pay: "Pays avg 14 days", score: "A+" },
                { init: "EG", bg: "#EBF1FD", color: "#1A56DB", name: "Echo Global",        detail: "FMCSA Verified · MC-456789", stars: "★★★★☆", pay: "Pays avg 21 days", score: "A"  },
                { init: "XP", bg: "#EDE9FE", color: "#7C3AED", name: "XPO Logistics",      detail: "FMCSA Verified · MC-789012", stars: "★★★★☆", pay: "Pays avg 14 days", score: "A"  },
                { init: "CH", bg: "#FEF3C7", color: "#D97706", name: "CH Robinson",        detail: "FMCSA Verified · MC-321654", stars: "★★★★☆", pay: "Pays avg 30 days", score: "B+" },
                { init: "TQ", bg: "#FFF1F2", color: "#E11D48", name: "Total Quality",      detail: "FMCSA Verified · MC-654321", stars: "★★★☆☆", pay: "Pays avg 45 days", score: "B"  },
              ].map((b, i) => (
                <div key={i} className="ct-broker-item">
                  <div className="ct-broker-avatar" style={{ background: b.bg, color: b.color }}>{b.init}</div>
                  <div className="ct-broker-info">
                    <div className="ct-broker-name">{b.name}</div>
                    <div className="ct-broker-detail">{b.detail}</div>
                  </div>
                  <div className="ct-broker-score">
                    <div className="ct-broker-stars">{b.stars}</div>
                    <div className="ct-broker-pay">{b.pay}</div>
                    <div style={{ fontSize: "0.72rem", fontWeight: 800, color: i < 3 ? "var(--green)" : i === 3 ? "var(--amber)" : "var(--txt4)" }}>{b.score}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ALL FEATURES ── */}
      <section className="ct-section">
        <div className="ct-centered">
          <div className="ct-eyebrow">All Features</div>
          <div className="ct-section-title">Everything in your <em>carrier toolkit</em></div>
          <div className="ct-section-sub">From AI load matching to dispatcher access — everything a professional carrier needs to run a profitable operation.</div>
        </div>
        <div className="ct-feat-grid">
          {[
            { icon: "📬", label: "AI Load Inbox",           desc: "AI-matched loads delivered to your inbox before the load board, based on your equipment and lane preferences." },
            { icon: "📊", label: "Rate Intelligence",        desc: "Live RPM data by lane, regional demand heat maps, and rate trend history to maximize every load you book." },
            { icon: "⭐", label: "Broker Credit Scores",     desc: "Credit ratings, payment timeline, and carrier reviews for every broker before you accept their load." },
            { icon: "🎯", label: "Dispatcher Marketplace",   desc: "Browse verified dispatcher profiles, compare rates and specialties, and hire the right dispatcher for your operation." },
            { icon: "🤖", label: "AI Freight Matching",      desc: "Machine learning that surfaces the best loads for your truck, improving accuracy with every booking you make." },
            { icon: "📋", label: "One-Click Booking",        desc: "Accept loads digitally. Rate confirmation generated instantly. No phone calls, no email chains, no negotiation." },
            { icon: "📅", label: "Load Scheduling",          desc: "View upcoming load pickups, manage your calendar, and plan your week with the scheduling tools in your dashboard." },
            { icon: "💬", label: "Direct Broker Chat",       desc: "Message brokers directly through the platform for any questions — without exchanging personal contact info." },
            { icon: "📄", label: "Document Management",      desc: "Upload and store your MC authority, insurance, W9, USDOT, and driver license — all accessible in one place." },
            { icon: "🔄", label: "Backhaul Detection",       desc: "AI automatically finds return loads at your delivery location before you finish your current run." },
            { icon: "📈", label: "Earnings Tracking",        desc: "Track revenue per mile, total monthly earnings, and booking history from your carrier dashboard." },
            { icon: "🔒", label: "Verified & Secure",        desc: "SSL encrypted platform with verified broker credentials and FMCSA compliance checks on every posted load." },
          ].map((f, i) => (
            <div key={i} className="ct-feat-card">
              <div className="ct-feat-icon">{f.icon}</div>
              <div className="ct-feat-label">{f.label}</div>
              <div className="ct-feat-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section className="ct-section ct-section-alt">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="ct-eyebrow purple">Why LoadOps AI</div>
          <div className="ct-section-title">LoadOps AI vs <em>searching other loadboards manually</em></div>
          <div className="ct-section-sub">See why 7,600+ carriers are switching from manual load board searching to AI-powered inbox delivery.</div>

          <div className="ct-compare-wrap">
            <div className="ct-compare-head">
              <div className="ct-ch">Feature</div>
              <div className="ct-ch">Manual / DAT</div>
              <div className="ct-ch blue">LoadOps AI</div>
            </div>
            {[
              { feat: "Finding Loads",          old: "Manual search — hours daily",    now: "✓ AI inbox delivery — automatic" },
              { feat: "Broker Reliability",      old: "Unknown until after delivery",   now: "✓ Credit score visible upfront"  },
              { feat: "Rate Information",        old: "Guesswork or DAT rate tool",     now: "✓ Live lane RPM data built in"   },
              { feat: "Broker Contact",          old: "Cold calls — time-consuming",    now: "✓ Digital only — zero calls"     },
              { feat: "Payment Timeline",        old: "Not visible before booking",     now: "✓ Avg pay days on every broker"  },
              { feat: "Dispatcher Access",       old: "Word of mouth only",             now: "✓ Verified dispatcher marketplace"},
              { feat: "Rate Confirmation",       old: "Email PDF — back and forth",     now: "✓ Auto-generated on booking"     },
              { feat: "Load Alerts",             old: "Manual refresh every hour",      now: "✓ AI email alerts in real-time"  },
              { feat: "Backhaul Loads",          old: "Search again after delivery",    now: "✓ AI detects backhaul auto"      },
              { feat: "Cost",                    old: "DAT: $50–$200/month per seat",   now: "✓ From $19/month all-in"         },
            ].map((r, i) => (
              <div key={i} className="ct-compare-row">
                <div className="ct-compare-feat">{r.feat}</div>
                <div className="ct-compare-no">✕ {r.old}</div>
                <div className="ct-compare-yes">{r.now}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="ct-section">
        <div className="ct-centered">
          <div className="ct-eyebrow">How It Works</div>
          <div className="ct-section-title">From sign-up to <em>first load booked</em></div>
          <div className="ct-section-sub">The fastest onboarding in freight. Set your preferences once and the AI does the rest.</div>
        </div>
        <div className="ct-steps">
          {[
            { n: "01", icon: "🚛", title: "Create Carrier Account", desc: "Sign up, choose Carrier as your role, and get instant access to your dedicated carrier dashboard." },
            { n: "02", icon: "⚙️", title: "Set Your Preferences",   desc: "Enter your equipment type, home region, preferred lanes, and minimum rate. Done once — used forever." },
            { n: "03", icon: "📬", title: "AI Loads Hit Your Inbox", desc: "Matching loads start arriving in your inbox automatically. Check broker scores and rate intel before deciding." },
            { n: "04", icon: "✅", title: "Book & Roll",             desc: "Accept digitally, get your rate confirmation instantly, and go. No calls. No paperwork. No wasted time." },
          ].map((s, i) => (
            <div key={i} className="ct-step">
              <div className="ct-step-icon">{s.icon}</div>
              <div className="ct-step-n">{s.n}</div>
              <div className="ct-step-title">{s.title}</div>
              <div className="ct-step-desc">{s.desc}</div>
              <div className="ct-step-arr">→</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <div className="ct-cta">
        <div className="ct-cta-text">
          <h2>Ready to stop chasing loads<br />and start <em>receiving them?</em></h2>
          <p>Join 7,600+ carriers already using LoadOps AI to find better loads, earn more per mile, and eliminate cold calls forever.</p>
        </div>
        <div className="ct-cta-btns">
          <button className="ct-cta-btn ct-cta-btn-white" onClick={() => router.push("/signup?role=carrier")}>
            Start as Carrier Free →
          </button>
          <button className="ct-cta-btn ct-cta-btn-outline" onClick={() => router.push("/pricing")}>
            View Pricing
          </button>
        </div>
      </div>

    </main>
  );
}
