"use client";

import { useRouter } from "next/navigation";

export default function DispatcherHub() {
  const router = useRouter();

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
          0%, 100% { box-shadow: 0 0 0 3px #EDE9FE; }
          50%       { box-shadow: 0 0 0 6px #EDE9FE; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: none; }
        }

        /* ── HERO ── */
        .dh-hero {
          padding: 80px 5% 70px;
          background: var(--white);
          text-align: center;
          position: relative; overflow: hidden;
        }
        .dh-hero::before {
          content: '';
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 90% 60% at 50% -5%, rgba(124,58,237,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 5% 90%,  rgba(26,86,219,0.04)  0%, transparent 55%),
            radial-gradient(ellipse 40% 30% at 95% 80%, rgba(18,161,80,0.04)  0%, transparent 55%);
        }
        .dh-hero::after {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(124,58,237,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124,58,237,0.03) 1px, transparent 1px);
          background-size: 52px 52px;
          mask-image: radial-gradient(ellipse 80% 70% at 50% 0%, black 0%, transparent 70%);
        }
        .dh-hero-inner { position: relative; z-index: 1; }

        .dh-badge {
          display: inline-flex; align-items: center; gap: 7px;
          background: var(--purple-l); border: 1px solid var(--purple-m);
          color: var(--purple); border-radius: 20px;
          font-size: 0.7rem; font-weight: 700; letter-spacing: 0.06em;
          padding: 5px 14px; margin-bottom: 24px; text-transform: uppercase;
          animation: fadeUp 0.6s ease both;
        }
        .dh-pulse { width: 7px; height: 7px; border-radius: 50%; background: var(--purple); animation: pulse 2s infinite; display: inline-block; }

        .dh-hero h1 {
          font-size: clamp(2.2rem, 5.5vw, 3.8rem);
          font-weight: 800; letter-spacing: -0.045em; line-height: 1.05;
          color: var(--txt); margin-bottom: 20px;
          max-width: 780px; margin-left: auto; margin-right: auto;
          animation: fadeUp 0.6s 0.1s ease both;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .dh-hero h1 em { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; color: var(--purple); }

        .dh-hero-sub {
          font-size: 1rem; color: var(--txt3); max-width: 560px;
          margin: 0 auto 36px; line-height: 1.75; font-weight: 400;
          animation: fadeUp 0.6s 0.2s ease both;
        }

        .dh-hero-cta { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; animation: fadeUp 0.6s 0.3s ease both; }
        .dh-btn {
          padding: 13px 26px; border-radius: 10px; font-size: 0.86rem; font-weight: 700;
          border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif;
          letter-spacing: -0.01em; transition: all 0.18s;
        }
        .dh-btn-primary { background: var(--purple); color: #fff; box-shadow: 0 1px 3px rgba(124,58,237,0.3), 0 4px 16px rgba(124,58,237,0.2); }
        .dh-btn-primary:hover { background: #6D28D9; transform: translateY(-1px); }
        .dh-btn-ghost { background: transparent; color: var(--txt3); border: 1.5px solid var(--border2); }
        .dh-btn-ghost:hover { color: var(--txt); }

        /* HERO PROOF */
        .dh-hero-proof { display: flex; align-items: center; justify-content: center; gap: 16px; flex-wrap: wrap; margin-top: 36px; animation: fadeUp 0.6s 0.4s ease both; }
        .dh-proof-avs { display: flex; }
        .dh-proof-avs span { width: 28px; height: 28px; border-radius: 50%; background: var(--bg2); border: 2px solid #fff; display: flex; align-items: center; justify-content: center; font-size: 0.62rem; font-weight: 700; color: var(--txt3); margin-left: -8px; }
        .dh-proof-avs span:first-child { margin-left: 0; }
        .dh-proof-txt { font-size: 0.74rem; color: var(--txt3); }
        .dh-proof-txt b { color: var(--txt2); }
        .dh-pdiv { width: 1px; height: 18px; background: var(--border); }
        .dh-pstars { color: #F59E0B; font-size: 0.75rem; }

        /* ── STATS ── */
        .dh-stats { display: grid; grid-template-columns: repeat(4,1fr); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); background: var(--bg); }
        .dh-sc { padding: 26px 20px; border-right: 1px solid var(--border); text-align: center; }
        .dh-sc:last-child { border-right: none; }
        .dh-sn { font-size: 1.8rem; font-weight: 800; color: var(--txt); letter-spacing: -0.04em; line-height: 1.1; font-family: 'Plus Jakarta Sans', sans-serif; }
        .dh-sn span { color: var(--purple); }
        .dh-sl { font-size: 0.7rem; color: var(--txt3); font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; margin-top: 3px; }

        /* ── SECTION COMMONS ── */
        .dh-section { padding: 80px 5%; }
        .dh-section-alt { background: var(--bg); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
        .dh-eyebrow { display: flex; align-items: center; gap: 8px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--purple); margin-bottom: 12px; }
        .dh-eyebrow::before { content: ''; width: 20px; height: 2px; background: var(--purple); border-radius: 1px; }
        .dh-eyebrow.blue { color: var(--blue); }
        .dh-eyebrow.blue::before { background: var(--blue); }
        .dh-eyebrow.green { color: var(--green); }
        .dh-eyebrow.green::before { background: var(--green); }
        .dh-section-title { font-size: clamp(1.5rem,3vw,2.2rem); font-weight: 800; letter-spacing: -0.04em; color: var(--txt); margin-bottom: 8px; line-height: 1.12; font-family: 'Plus Jakarta Sans', sans-serif; }
        .dh-section-title em { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; color: var(--purple); }
        .dh-section-sub { font-size: 0.87rem; color: var(--txt3); max-width: 480px; margin-bottom: 44px; line-height: 1.7; font-weight: 400; }
        .dh-centered { text-align: center; }
        .dh-centered .dh-eyebrow { justify-content: center; }
        .dh-centered .dh-eyebrow::before { display: none; }
        .dh-centered .dh-section-sub { margin-left: auto; margin-right: auto; }

        /* ── CORE IDEA — 2 COL ── */
        .dh-intro-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
        .dh-intro-text {}
        .dh-intro-body { font-size: 0.88rem; color: var(--txt3); line-height: 1.8; font-weight: 400; margin-bottom: 24px; }
        .dh-intro-points { display: flex; flex-direction: column; gap: 12px; }
        .dh-intro-point { display: flex; gap: 12px; align-items: flex-start; }
        .dh-intro-point-icon { width: 34px; height: 34px; border-radius: 9px; background: var(--purple-l); border: 1px solid var(--purple-m); display: flex; align-items: center; justify-content: center; font-size: 0.9rem; flex-shrink: 0; }
        .dh-intro-point-title { font-size: 0.83rem; font-weight: 700; color: var(--txt); margin-bottom: 2px; }
        .dh-intro-point-desc  { font-size: 0.75rem; color: var(--txt3); line-height: 1.55; font-weight: 400; }

        /* PROFILE MOCK */
        .dh-profile-mock { background: var(--white); border: 1px solid var(--border); border-radius: 18px; overflow: hidden; box-shadow: 0 12px 40px rgba(0,0,0,0.07); }
        .dh-profile-header { padding: 20px; background: linear-gradient(135deg, var(--purple-l) 0%, var(--white) 100%); border-bottom: 1px solid var(--border); display: flex; gap: 14px; align-items: center; }
        .dh-profile-avatar { width: 52px; height: 52px; border-radius: 14px; background: var(--purple); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; flex-shrink: 0; }
        .dh-profile-name { font-size: 0.95rem; font-weight: 800; color: var(--txt); margin-bottom: 3px; display: flex; align-items: center; gap: 7px; }
        .dh-verified { font-size: 0.58rem; font-weight: 800; padding: 1px 6px; border-radius: 3px; background: var(--green-l); color: var(--green); }
        .dh-profile-spec { font-size: 0.75rem; color: var(--txt3); font-weight: 400; }
        .dh-profile-body { padding: 16px 20px; }
        .dh-profile-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--border); }
        .dh-profile-row:last-child { border-bottom: none; }
        .dh-profile-row-label { font-size: 0.72rem; font-weight: 600; color: var(--txt4); text-transform: uppercase; letter-spacing: 0.06em; }
        .dh-profile-row-value { font-size: 0.8rem; font-weight: 700; color: var(--txt2); }
        .dh-profile-tags { display: flex; gap: 5px; flex-wrap: wrap; margin-top: 12px; }
        .dh-ptag { font-size: 0.62rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; background: var(--purple-l); color: var(--purple); }
        .dh-profile-rate { padding: 14px 20px; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; background: var(--bg); }
        .dh-profile-rate-num { font-size: 1.2rem; font-weight: 800; color: var(--txt); letter-spacing: -0.03em; }
        .dh-profile-rate-num small { font-size: 0.65rem; font-weight: 400; color: var(--txt4); margin-left: 3px; }
        .dh-hire-btn { padding: 9px 20px; border-radius: 9px; background: var(--purple); color: #fff; font-size: 0.78rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: background 0.15s; }
        .dh-hire-btn:hover { background: #6D28D9; }

        /* ── HOW IT WORKS — STEPS ── */
        .dh-steps { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
        .dh-step { background: var(--white); border: 1px solid var(--border); border-radius: 18px; overflow: hidden; transition: transform 0.22s, box-shadow 0.22s; }
        .dh-step:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(0,0,0,0.08); }
        .dh-step-top { padding: 28px 28px 20px; background: linear-gradient(135deg, var(--purple-l) 0%, var(--white) 100%); }
        .dh-step-num-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .dh-step-num { width: 36px; height: 36px; border-radius: 10px; background: var(--purple); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 800; }
        .dh-step-icon { font-size: 1.4rem; }
        .dh-step-title { font-size: 1rem; font-weight: 800; color: var(--txt); letter-spacing: -0.02em; margin-bottom: 8px; }
        .dh-step-desc { font-size: 0.8rem; color: var(--txt3); line-height: 1.65; font-weight: 400; }
        .dh-step-footer { padding: 14px 28px; border-top: 1px solid var(--border); display: flex; gap: 6px; flex-wrap: wrap; }
        .dh-stag { font-size: 0.63rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; background: var(--purple-l); color: var(--purple); }

        /* ── FEATURES GRID ── */
        .dh-grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
        .dh-feature { background: var(--white); border: 1px solid var(--border); border-radius: 14px; padding: 24px 20px; transition: transform 0.2s, box-shadow 0.2s; }
        .dh-feature:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(0,0,0,0.07); }
        .dh-feature-icon { font-size: 1.5rem; margin-bottom: 12px; }
        .dh-feature-label { font-size: 0.75rem; font-weight: 700; color: var(--purple); text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 6px; }
        .dh-feature-desc { font-size: 0.78rem; color: var(--txt3); line-height: 1.6; font-weight: 400; }

        /* ── DISPATCHER PROFILES LIST ── */
        .dh-profiles-grid { display: flex; flex-direction: column; gap: 14px; }
        .dh-dispatcher-card { background: var(--white); border: 1px solid var(--border); border-radius: 14px; padding: 18px 20px; display: flex; gap: 14px; align-items: center; transition: border-color 0.18s, box-shadow 0.18s; cursor: pointer; }
        .dh-dispatcher-card:hover { border-color: var(--purple-m); box-shadow: 0 6px 24px rgba(124,58,237,0.09); }
        .dh-dcard-avatar { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0; }
        .dh-dcard-info { flex: 1; }
        .dh-dcard-name { font-size: 0.86rem; font-weight: 700; color: var(--txt); margin-bottom: 2px; display: flex; align-items: center; gap: 6px; }
        .dh-dcard-spec { font-size: 0.74rem; color: var(--txt3); margin-bottom: 6px; font-weight: 400; }
        .dh-dcard-tags { display: flex; gap: 5px; flex-wrap: wrap; }
        .dh-dtag { font-size: 0.62rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; background: var(--bg2); color: var(--txt3); }
        .dh-dcard-rate { font-size: 0.88rem; font-weight: 800; color: var(--txt); white-space: nowrap; text-align: right; }
        .dh-dcard-rate small { display: block; font-size: 0.65rem; font-weight: 400; color: var(--txt4); }

        .dh-filter-pills { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
        .dh-fpill { padding: 5px 14px; border-radius: 20px; font-size: 0.72rem; font-weight: 600; border: 1.5px solid var(--border2); background: var(--white); color: var(--txt3); cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; }
        .dh-fpill:hover, .dh-fpill.active { background: var(--purple-l); border-color: var(--purple-m); color: var(--purple); }

        /* ── MAP ── */
        .dh-map-wrap { border-radius: 16px; overflow: hidden; border: 1px solid var(--border); box-shadow: 0 8px 32px rgba(0,0,0,0.06); }

        /* ── BENEFITS ── */
        .dh-benefits-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
        .dh-benefit { background: var(--white); border: 1px solid var(--border); border-radius: 16px; padding: 28px; transition: transform 0.2s, box-shadow 0.2s; }
        .dh-benefit:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(0,0,0,0.07); }
        .dh-benefit-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; margin-bottom: 16px; }
        .dh-benefit-title { font-size: 0.95rem; font-weight: 800; color: var(--txt); margin-bottom: 10px; letter-spacing: -0.02em; }
        .dh-benefit-desc { font-size: 0.8rem; color: var(--txt3); line-height: 1.7; font-weight: 400; }
        .dh-benefit-feats { margin-top: 16px; display: flex; flex-direction: column; gap: 7px; }
        .dh-benefit-feat { display: flex; align-items: center; gap: 7px; font-size: 0.76rem; color: var(--txt2); font-weight: 500; }
        .dh-benefit-feat::before { content: '✓'; width: 16px; height: 16px; border-radius: 4px; background: var(--purple-l); color: var(--purple); display: flex; align-items: center; justify-content: center; font-size: 0.6rem; font-weight: 800; flex-shrink: 0; }

        /* ── CTA BANNER ── */
        .dh-cta {
          margin: 0 5% 80px; padding: 60px 5%;
          background: var(--txt); border-radius: 20px;
          position: relative; overflow: hidden; text-align: center;
        }
        .dh-cta::before {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse 60% 80% at 100% 50%, rgba(124,58,237,0.3) 0%, transparent 55%),
                      radial-gradient(ellipse 40% 60% at 0%   50%, rgba(26,86,219,0.12) 0%, transparent 55%);
        }
        .dh-cta-inner { position: relative; z-index: 1; max-width: 620px; margin: 0 auto; }
        .dh-cta h2 { font-size: clamp(1.5rem,3vw,2.2rem); font-weight: 800; color: #fff; letter-spacing: -0.04em; line-height: 1.15; margin-bottom: 14px; font-family: 'Plus Jakarta Sans', sans-serif; }
        .dh-cta h2 em { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; color: #C4B5FD; }
        .dh-cta p { font-size: 0.9rem; color: #94A3B8; line-height: 1.75; margin-bottom: 32px; }
        .dh-cta-btns { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
        .dh-cta-btn { padding: 12px 24px; border-radius: 10px; font-size: 0.84rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; }
        .dh-cta-btn-white { background: #fff; color: var(--txt); }
        .dh-cta-btn-white:hover { background: #F0F0F0; }
        .dh-cta-btn-outline { background: transparent; color: #888; border: 1.5px solid #2A2A2A; }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .dh-intro-grid { grid-template-columns: 1fr; }
          .dh-steps { grid-template-columns: 1fr 1fr; }
          .dh-grid-4 { grid-template-columns: 1fr 1fr; }
          .dh-benefits-grid { grid-template-columns: 1fr 1fr; }
          .dh-stats { grid-template-columns: repeat(2,1fr); }
        }
        @media (max-width: 600px) {
          .dh-steps, .dh-benefits-grid, .dh-grid-4 { grid-template-columns: 1fr; }
          .dh-stats { grid-template-columns: repeat(2,1fr); }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="dh-hero">
        <div className="dh-hero-inner">
          <div className="dh-badge">
            <span className="dh-pulse" />
            {" "}Professional Dispatcher Network
          </div>
          <h1>
            The Smarter Way to<br />
            <em>Dispatch Freight</em>
          </h1>
          <p className="dh-hero-sub">
            LoadOps AI gives dispatchers a professional home — build your portfolio, get discovered
            by carriers, and manage operations with structure, transparency, and technology.
          </p>
          <div className="dh-hero-cta">
            <button className="dh-btn dh-btn-primary" onClick={() => router.push("/signup?role=dispatcher")}>
              Build Your Profile →
            </button>
            <button className="dh-btn dh-btn-ghost" onClick={() => router.push("/signup?role=carrier")}>
              Find a Dispatcher
            </button>
          </div>
          <div className="dh-hero-proof">
            <div className="dh-proof-avs">
              <span>MR</span><span>TB</span><span>JO</span><span>KL</span><span>+</span>
            </div>
            <div className="dh-proof-txt">Trusted by <b>3,200+</b> dispatchers</div>
            <div className="dh-pdiv" />
            <div className="dh-pstars">★★★★★</div>
            <div className="dh-proof-txt"><b>4.8</b> / 5 avg rating</div>
            <div className="dh-pdiv" />
            <div className="dh-proof-txt"><b>Verified</b> profiles only</div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="dh-stats">
        <div className="dh-sc"><div className="dh-sn">3.2<span>K+</span></div><div className="dh-sl">Active Dispatchers</div></div>
        <div className="dh-sc"><div className="dh-sn">4.8<span>★</span></div><div className="dh-sl">Avg Profile Rating</div></div>
        <div className="dh-sc"><div className="dh-sn">100<span>%</span></div><div className="dh-sl">Verified Profiles</div></div>
        <div className="dh-sc"><div className="dh-sn">48<span>h</span></div><div className="dh-sl">Avg Match Time</div></div>
      </div>

      {/* ── CORE IDEA ── */}
      <section className="dh-section">
        <div className="dh-intro-grid">
          <div className="dh-intro-text">
            <div className="dh-eyebrow">A New Way to Dispatch</div>
            <div className="dh-section-title">Dispatching, <em>reimagined</em></div>
            <p className="dh-intro-body">
              Traditional dispatching depends on cold calls, manual outreach, and constant
              negotiation with no structure or accountability. LoadOps AI changes that —
              creating a transparent ecosystem where dispatchers are selected based on their
              verified performance, experience, and track record.
            </p>
            <div className="dh-intro-points">
              {[
                { icon: "🚫", title: "No More Cold Calling", desc: "Carriers find you through your profile. No outreach, no chasing clients." },
                { icon: "📊", title: "Performance-Based Trust", desc: "Your ratings and history speak louder than any pitch ever could." },
                { icon: "⚡", title: "Instant Carrier Matching", desc: "AI connects you with carriers whose equipment and lanes match your expertise." },
              ].map((p, i) => (
                <div key={i} className="dh-intro-point">
                  <div className="dh-intro-point-icon">{p.icon}</div>
                  <div>
                    <div className="dh-intro-point-title">{p.title}</div>
                    <div className="dh-intro-point-desc">{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PROFILE MOCK */}
          <div className="dh-profile-mock">
            <div className="dh-profile-header">
              <div className="dh-profile-avatar">🎯</div>
              <div>
                <div className="dh-profile-name">
                  Marcus Reid
                  <span className="dh-verified">✓ VERIFIED</span>
                </div>
                <div className="dh-profile-spec">Dry Van · OTR Specialist · 7 yrs experience</div>
              </div>
            </div>
            <div className="dh-profile-body">
              {[
                { label: "Specialization", value: "Dry Van, Box Truck" },
                { label: "Coverage",       value: "Midwest, Southeast" },
                { label: "Avg RPM",        value: "$2.85 / mile" },
                { label: "On-Time Rate",   value: "98.4%" },
                { label: "Carriers Managed", value: "12 active" },
              ].map((r, i) => (
                <div key={i} className="dh-profile-row">
                  <span className="dh-profile-row-label">{r.label}</span>
                  <span className="dh-profile-row-value">{r.value}</span>
                </div>
              ))}
              <div className="dh-profile-tags">
                {["OTR", "Full Truckload", "Midwest", "Southeast", "Flatbed"].map(t => (
                  <span key={t} className="dh-ptag">{t}</span>
                ))}
              </div>
            </div>
            <div className="dh-profile-rate">
              <div>
                <div className="dh-profile-rate-num">$350<small>/week</small></div>
                <div style={{ fontSize: "0.68rem", color: "#6B7A8D", marginTop: 2 }}>Per truck managed</div>
              </div>
              <button className="dh-hire-btn">Hire Dispatcher</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="dh-section dh-section-alt">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="dh-centered">
            <div className="dh-eyebrow">How It Works</div>
            <div className="dh-section-title">From profile to <em>paid in 3 steps</em></div>
            <div className="dh-section-sub">Everything a dispatcher needs to go from unknown freelancer to in-demand professional.</div>
          </div>

          <div className="dh-steps">
            {[
              {
                n: "01", icon: "👤",
                title: "Create Your Profile",
                desc: "Build a detailed professional profile — experience, lanes, truck types, past results, and hourly or weekly rates. Your profile is your storefront.",
                tags: ["Experience", "Lanes", "Equipment", "Rate Card"],
              },
              {
                n: "02", icon: "🔍",
                title: "Get Discovered",
                desc: "Carriers actively searching for dispatchers filter by specialty, location, and rating. Your verified profile surfaces to the right clients automatically.",
                tags: ["AI Matching", "Carrier Search", "Ratings Filter"],
              },
              {
                n: "03", icon: "⚙️",
                title: "Manage & Grow",
                desc: "Handle loads, communicate with brokers, and track earnings for multiple carriers through a streamlined dashboard built for professional dispatchers.",
                tags: ["Multi-Carrier", "Load Access", "Earnings Tracking"],
              },
            ].map((s, i) => (
              <div key={i} className="dh-step">
                <div className="dh-step-top">
                  <div className="dh-step-num-row">
                    <div className="dh-step-num">{s.n}</div>
                    <div className="dh-step-icon">{s.icon}</div>
                  </div>
                  <div className="dh-step-title">{s.title}</div>
                  <div className="dh-step-desc">{s.desc}</div>
                </div>
                <div className="dh-step-footer">
                  {s.tags.map(t => <span key={t} className="dh-stag">{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOOLS & FEATURES ── */}
      <section className="dh-section">
        <div className="dh-eyebrow">Tools & Features</div>
        <div className="dh-section-title">Everything a dispatcher <em>needs to thrive</em></div>
        <div className="dh-section-sub">Built specifically for freight dispatchers — not adapted from something else.</div>

        <div className="dh-grid-4">
          {[
            { icon: "📋", label: "Profile System",      desc: "Showcase your lanes, truck types, experience, and verified results to attract quality clients." },
            { icon: "🤝", label: "Carrier Matching",     desc: "AI connects you with carriers whose equipment and preferred lanes align with your expertise." },
            { icon: "📦", label: "Load Access",          desc: "Get access to AI-selected load opportunities across the platform for your carrier clients." },
            { icon: "⭐", label: "Reputation System",    desc: "Build long-term trust through verified carrier reviews and a transparent ratings history." },
            { icon: "💼", label: "Multi-Carrier Mgmt",   desc: "Handle multiple carrier accounts from a single dashboard with organized load pipelines." },
            { icon: "💰", label: "Earnings Tracking",    desc: "Track weekly earnings, commission per carrier, and revenue trends over time." },
            { icon: "📅", label: "Availability Status",  desc: "Set your availability so carriers know when you're open to taking on new clients." },
            { icon: "📈", label: "Performance Analytics",desc: "See your on-time rates, average RPM achieved, and booking speed to improve and grow." },
          ].map((f, i) => (
            <div key={i} className="dh-feature">
              <div className="dh-feature-icon">{f.icon}</div>
              <div className="dh-feature-label">{f.label}</div>
              <div className="dh-feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SAMPLE DISPATCHERS ── */}
      <section className="dh-section dh-section-alt">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "flex-start" }}>
            <div>
              <div className="dh-eyebrow green">Dispatcher Network</div>
              <div className="dh-section-title">Browse verified<br /><em>dispatcher profiles</em></div>
              <div className="dh-section-sub" style={{ marginBottom: 20 }}>
                Every dispatcher on LoadOps AI has a fully verified profile with real ratings, lane history, and transparent pricing.
              </div>
              <div className="dh-filter-pills">
                <div className="dh-fpill active">All</div>
                <div className="dh-fpill">Dry Van</div>
                <div className="dh-fpill">Reefer</div>
                <div className="dh-fpill">Flatbed</div>
                <div className="dh-fpill">Box Truck</div>
                <div className="dh-fpill">Sprinter Van</div>
                <div className="dh-fpill">OTR</div>
              </div>
              <button className="dh-btn dh-btn-primary" style={{ marginTop: 8 }} onClick={() => router.push("/dispatchers")}>
                View All Dispatchers →
              </button>
            </div>

            <div className="dh-profiles-grid">
              {[
                { bg: "#EBF1FD", name: "Marcus Reid",   spec: "Dry Van · OTR · 7 yrs",          tags: ["Midwest", "Southeast", "FTL"], rate: "$350", per: "/week" },
                { bg: "#E6F7EE", name: "Tanya Brooks",  spec: "Reefer · Temp Control · 5 yrs",   tags: ["Northeast", "Texas"],         rate: "$300", per: "/week" },
                { bg: "#EDE9FE", name: "James Okafor",  spec: "Flatbed · Oversize · 10 yrs",     tags: ["West Coast", "Heavy Haul"],   rate: "$400", per: "/week" },
                { bg: "#FEF3C7", name: "Sofia Reyes",   spec: "Box Truck · Last Mile · 4 yrs",   tags: ["Southwest", "Urban"],         rate: "$275", per: "/week" },
              ].map((d, i) => (
                <div key={i} className="dh-dispatcher-card" onClick={() => router.push("/dispatchers")}>
                  <div className="dh-dcard-avatar" style={{ background: d.bg }}>👤</div>
                  <div className="dh-dcard-info">
                    <div className="dh-dcard-name">{d.name} <span className="dh-verified">✓ VERIFIED</span></div>
                    <div className="dh-dcard-spec">{d.spec}</div>
                    <div className="dh-dcard-tags">{d.tags.map(t => <span key={t} className="dh-dtag">{t}</span>)}</div>
                  </div>
                  <div className="dh-dcard-rate">{d.rate}<small>{d.per}</small></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MAP ── */}
      <section className="dh-section">
        <div className="dh-centered">
          <div className="dh-eyebrow blue">Coverage</div>
          <div className="dh-section-title">Dispatcher network <em>nationwide</em></div>
          <div className="dh-section-sub">Active dispatchers covering every major lane and region across the US.</div>
        </div>
        <div className="dh-map-wrap">
          <iframe
            src="https://www.google.com/maps?q=United+States&output=embed"
            width="100%"
            height="460"
            loading="lazy"
            style={{ display: "block", border: "none" }}
          />
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className="dh-section dh-section-alt">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="dh-centered">
            <div className="dh-eyebrow">Why Dispatchers Choose LoadOps AI</div>
            <div className="dh-section-title">Built for your <em>professional growth</em></div>
            <div className="dh-section-sub">Stop hustling for clients. Let your verified track record do the work.</div>
          </div>
          <div className="dh-benefits-grid">
            {[
              {
                icon: "🎯", bg: "#EDE9FE", title: "More Clients",
                desc: "Get discovered by carriers actively searching for qualified dispatchers in your lane and equipment niche.",
                feats: ["Profile-based discovery", "AI carrier matching", "Inbound client requests"],
              },
              {
                icon: "⚡", bg: "#E6F7EE", title: "Better Efficiency",
                desc: "Manage multiple carriers without chaos. Load pipelines, broker communication, and tracking all in one place.",
                feats: ["Multi-carrier dashboard", "Organized load pipeline", "Digital communications"],
              },
              {
                icon: "🏆", bg: "#EBF1FD", title: "Build Your Reputation",
                desc: "Every load you handle contributes to your verified profile rating. Your track record becomes your competitive advantage.",
                feats: ["Verified review system", "Performance history", "Trust-based ranking"],
              },
            ].map((b, i) => (
              <div key={i} className="dh-benefit">
                <div className="dh-benefit-icon" style={{ background: b.bg }}>{b.icon}</div>
                <div className="dh-benefit-title">{b.title}</div>
                <div className="dh-benefit-desc">{b.desc}</div>
                <div className="dh-benefit-feats">
                  {b.feats.map(f => <div key={f} className="dh-benefit-feat">{f}</div>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <div className="dh-cta">
        <div className="dh-cta-inner">
          <h2>Dispatching is Evolving.<br /><em>Are You Ready?</em></h2>
          <p>
            LoadOps AI enables dispatchers to operate like professionals in a connected ecosystem
            where efficiency, transparency, and trust define success. Join 3,200+ dispatchers
            already building their future on the platform.
          </p>
          <div className="dh-cta-btns">
            <button className="dh-cta-btn dh-cta-btn-white" onClick={() => router.push("/signup?role=dispatcher")}>
              Build Your Profile →
            </button>
            <button className="dh-cta-btn dh-cta-btn-outline" onClick={() => router.push("/Talk-to-us")}>
              Talk to Us
            </button>
          </div>
        </div>
      </div>

    </main>
  );
}
