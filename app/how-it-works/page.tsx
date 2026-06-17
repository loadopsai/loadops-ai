"use client";

import { useRouter } from "next/navigation";

export default function HowItWorks() {
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
          0%, 100% { box-shadow: 0 0 0 3px #EBF1FD; }
          50%       { box-shadow: 0 0 0 6px #EBF1FD; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: none; }
        }

        /* ── HERO ── */
        .hiw-hero {
          padding: 80px 5% 70px;
          background: var(--white);
          text-align: center;
          position: relative; overflow: hidden;
        }
        .hiw-hero::before {
          content: '';
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 90% 60% at 50% -5%, rgba(26,86,219,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 5%  90%, rgba(18,161,80,0.04)  0%, transparent 55%),
            radial-gradient(ellipse 40% 30% at 95% 80%, rgba(124,58,237,0.04) 0%, transparent 55%);
        }
        .hiw-hero::after {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(26,86,219,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(26,86,219,0.035) 1px, transparent 1px);
          background-size: 52px 52px;
          mask-image: radial-gradient(ellipse 80% 70% at 50% 0%, black 0%, transparent 70%);
        }
        .hiw-hero-inner { position: relative; z-index: 1; }

        .hiw-badge {
          display: inline-flex; align-items: center; gap: 7px;
          background: var(--blue-l); border: 1px solid var(--blue-m);
          color: var(--blue); border-radius: 20px;
          font-size: 0.7rem; font-weight: 700; letter-spacing: 0.06em;
          padding: 5px 14px; margin-bottom: 24px; text-transform: uppercase;
          animation: fadeUp 0.6s ease both;
        }
        .hiw-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--blue); animation: pulse 2s infinite; display: inline-block; }

        .hiw-hero h1 {
          font-size: clamp(2.2rem, 5.5vw, 3.8rem);
          font-weight: 800; letter-spacing: -0.045em; line-height: 1.05;
          color: var(--txt); margin-bottom: 20px;
          max-width: 760px; margin-left: auto; margin-right: auto;
          animation: fadeUp 0.6s 0.1s ease both;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .hiw-hero h1 em { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; color: var(--blue); }

        .hiw-hero-sub {
          font-size: 1rem; color: var(--txt3); max-width: 560px;
          margin: 0 auto 36px; line-height: 1.75; font-weight: 400;
          animation: fadeUp 0.6s 0.2s ease both;
        }

        .hiw-hero-cta { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; animation: fadeUp 0.6s 0.3s ease both; }
        .hiw-btn {
          padding: 13px 26px; border-radius: 10px; font-size: 0.86rem; font-weight: 700;
          border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif;
          letter-spacing: -0.01em; transition: all 0.18s;
        }
        .hiw-btn-primary { background: var(--blue); color: #fff; box-shadow: 0 1px 3px rgba(26,86,219,0.3), 0 4px 16px rgba(26,86,219,0.2); }
        .hiw-btn-primary:hover { background: var(--blue-h); transform: translateY(-1px); }
        .hiw-btn-ghost { background: transparent; color: var(--txt3); border: 1.5px solid var(--border2); }
        .hiw-btn-ghost:hover { color: var(--txt); }

        /* ── STATS ── */
        .hiw-stats { display: grid; grid-template-columns: repeat(4,1fr); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); background: var(--bg); }
        .hiw-sc { padding: 26px 20px; border-right: 1px solid var(--border); text-align: center; }
        .hiw-sc:last-child { border-right: none; }
        .hiw-sn { font-size: 1.8rem; font-weight: 800; color: var(--txt); letter-spacing: -0.04em; line-height: 1.1; font-family: 'Plus Jakarta Sans', sans-serif; }
        .hiw-sn span { color: var(--blue); }
        .hiw-sl { font-size: 0.7rem; color: var(--txt3); font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; margin-top: 3px; }

        /* ── SECTION COMMONS ── */
        .hiw-section { padding: 80px 5%; }
        .hiw-section-alt { background: var(--bg); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
        .hiw-eyebrow { display: flex; align-items: center; gap: 8px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--blue); margin-bottom: 12px; }
        .hiw-eyebrow::before { content: ''; width: 20px; height: 2px; background: var(--blue); border-radius: 1px; }
        .hiw-eyebrow.green  { color: var(--green);  }
        .hiw-eyebrow.green::before  { background: var(--green);  }
        .hiw-eyebrow.purple { color: var(--purple); }
        .hiw-eyebrow.purple::before { background: var(--purple); }
        .hiw-section-title { font-size: clamp(1.5rem,3vw,2.2rem); font-weight: 800; letter-spacing: -0.04em; color: var(--txt); margin-bottom: 8px; line-height: 1.12; font-family: 'Plus Jakarta Sans', sans-serif; }
        .hiw-section-title em { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; color: var(--blue); }
        .hiw-section-sub { font-size: 0.87rem; color: var(--txt3); max-width: 480px; margin-bottom: 44px; line-height: 1.7; font-weight: 400; }
        .hiw-centered { text-align: center; }
        .hiw-centered .hiw-eyebrow { justify-content: center; }
        .hiw-centered .hiw-eyebrow::before { display: none; }
        .hiw-centered .hiw-section-sub { margin-left: auto; margin-right: auto; }

        /* ── PROCESS STEPS ── */
        .hiw-steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; border: 1px solid var(--border); border-radius: 18px; overflow: hidden; }
        .hiw-step-card { padding: 32px 28px; border-right: 1px solid var(--border); position: relative; background: var(--white); transition: background 0.2s; }
        .hiw-step-card:last-child { border-right: none; }
        .hiw-step-card:hover { background: var(--bg); }
        .hiw-step-num-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .hiw-step-num { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 800; }
        .hiw-step-icon { font-size: 1.6rem; }
        .hiw-step-title { font-size: 1rem; font-weight: 800; color: var(--txt); letter-spacing: -0.02em; margin-bottom: 10px; }
        .hiw-step-desc { font-size: 0.8rem; color: var(--txt3); line-height: 1.7; font-weight: 400; }
        .hiw-step-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 16px; }
        .hiw-stag { font-size: 0.62rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; }

        /* Blue step */
        .hiw-step-blue .hiw-step-num { background: var(--blue-l); color: var(--blue); border: 1px solid var(--blue-m); }
        .hiw-step-blue .hiw-step-title { color: var(--blue); }
        .hiw-step-blue .hiw-stag { background: var(--blue-l); color: var(--blue); }
        /* Green step */
        .hiw-step-green .hiw-step-num { background: var(--green-l); color: var(--green); border: 1px solid var(--green-m); }
        .hiw-step-green .hiw-step-title { color: var(--green); }
        .hiw-step-green .hiw-stag { background: var(--green-l); color: var(--green); }
        /* Purple step */
        .hiw-step-purple .hiw-step-num { background: var(--purple-l); color: var(--purple); border: 1px solid var(--purple-m); }
        .hiw-step-purple .hiw-step-title { color: var(--purple); }
        .hiw-step-purple .hiw-stag { background: var(--purple-l); color: var(--purple); }

        /* ── CONNECTOR ARROW STRIP ── */
        .hiw-arrow-strip { display: grid; grid-template-columns: repeat(3,1fr); gap: 0; margin-top: -1px; border-left: 1px solid var(--border); border-right: 1px solid var(--border); border-bottom: 1px solid var(--border); border-radius: 0 0 18px 18px; overflow: hidden; }
        .hiw-arrow-cell { padding: 12px 28px; background: var(--bg); border-right: 1px solid var(--border); display: flex; align-items: center; gap: 8px; font-size: 0.72rem; font-weight: 600; color: var(--txt3); }
        .hiw-arrow-cell:last-child { border-right: none; }
        .hiw-arrow-icon { font-size: 0.8rem; }

        /* ── FULL FLOW — 4 STEPS ── */
        .hiw-flow { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
        .hiw-flow-step { padding: 24px 20px; background: var(--white); border: 1px solid var(--border); border-radius: 14px; position: relative; transition: transform 0.2s, box-shadow 0.2s; }
        .hiw-flow-step:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(0,0,0,0.07); }
        .hiw-flow-n { width: 32px; height: 32px; border-radius: 8px; background: var(--blue-l); border: 1px solid var(--blue-m); display: flex; align-items: center; justify-content: center; font-size: 0.78rem; font-weight: 800; color: var(--blue); margin-bottom: 14px; }
        .hiw-flow-icon { font-size: 1.4rem; margin-bottom: 10px; }
        .hiw-flow-title { font-size: 0.85rem; font-weight: 700; color: var(--txt); margin-bottom: 6px; }
        .hiw-flow-desc { font-size: 0.76rem; color: var(--txt3); line-height: 1.65; font-weight: 400; }
        .hiw-flow-arr { position: absolute; top: 28px; right: -13px; width: 26px; height: 26px; background: var(--white); border: 1px solid var(--border); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.68rem; color: var(--txt4); z-index: 1; }
        .hiw-flow-step:last-child .hiw-flow-arr { display: none; }

        /* ── WHY IT MATTERS — SPLIT ── */
        .hiw-why-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
        .hiw-why-body { font-size: 0.88rem; color: var(--txt3); line-height: 1.8; font-weight: 400; margin-bottom: 20px; }
        .hiw-why-points { display: flex; flex-direction: column; gap: 14px; }
        .hiw-why-point { display: flex; gap: 12px; align-items: flex-start; }
        .hiw-why-point-icon { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; flex-shrink: 0; }
        .hiw-why-point-title { font-size: 0.83rem; font-weight: 700; color: var(--txt); margin-bottom: 2px; }
        .hiw-why-point-desc  { font-size: 0.75rem; color: var(--txt3); line-height: 1.55; font-weight: 400; }

        /* COMPARISON TABLE */
        .hiw-compare { background: var(--white); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; }
        .hiw-compare-head { display: grid; grid-template-columns: 1fr 1fr 1fr; background: var(--bg); border-bottom: 1px solid var(--border); padding: 12px 16px; gap: 8px; }
        .hiw-compare-hcell { font-size: 0.68rem; font-weight: 700; color: var(--txt4); text-transform: uppercase; letter-spacing: 0.08em; }
        .hiw-compare-row { display: grid; grid-template-columns: 1fr 1fr 1fr; padding: 12px 16px; border-bottom: 1px solid var(--border); gap: 8px; align-items: center; }
        .hiw-compare-row:last-child { border-bottom: none; }
        .hiw-compare-row:nth-child(even) { background: var(--bg); }
        .hiw-compare-topic { font-size: 0.78rem; font-weight: 600; color: var(--txt2); }
        .hiw-compare-bad  { font-size: 0.74rem; color: #DC2626; display: flex; align-items: center; gap: 5px; font-weight: 500; }
        .hiw-compare-good { font-size: 0.74rem; color: var(--green); display: flex; align-items: center; gap: 5px; font-weight: 600; }

        /* ── MAP ── */
        .hiw-map-wrap { border-radius: 16px; overflow: hidden; border: 1px solid var(--border); box-shadow: 0 8px 32px rgba(0,0,0,0.06); }

        /* ── ROLE CARDS ── */
        .hiw-roles-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
        .hiw-role-card { background: var(--white); border: 1px solid var(--border); border-radius: 16px; padding: 28px; transition: transform 0.2s, box-shadow 0.2s; }
        .hiw-role-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(0,0,0,0.07); }
        .hiw-role-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; margin-bottom: 16px; }
        .hiw-role-title { font-size: 0.95rem; font-weight: 800; margin-bottom: 10px; letter-spacing: -0.02em; }
        .hiw-role-desc { font-size: 0.8rem; color: var(--txt3); line-height: 1.7; font-weight: 400; margin-bottom: 16px; }
        .hiw-role-feats { display: flex; flex-direction: column; gap: 7px; }
        .hiw-role-feat { display: flex; align-items: center; gap: 7px; font-size: 0.76rem; color: var(--txt2); font-weight: 500; }
        .hiw-role-feat::before { content: '✓'; width: 16px; height: 16px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 0.6rem; font-weight: 800; flex-shrink: 0; }

        .hiw-role-carrier .hiw-role-icon  { background: var(--blue-l); }
        .hiw-role-carrier .hiw-role-title { color: var(--blue); }
        .hiw-role-carrier .hiw-role-feat::before { background: var(--blue-l); color: var(--blue); }
        .hiw-role-broker  .hiw-role-icon  { background: var(--green-l); }
        .hiw-role-broker  .hiw-role-title { color: var(--green); }
        .hiw-role-broker  .hiw-role-feat::before { background: var(--green-l); color: var(--green); }
        .hiw-role-dispatch .hiw-role-icon  { background: var(--purple-l); }
        .hiw-role-dispatch .hiw-role-title { color: var(--purple); }
        .hiw-role-dispatch .hiw-role-feat::before { background: var(--purple-l); color: var(--purple); }

        /* ── CTA BANNER ── */
        .hiw-cta {
          margin: 0 5% 80px; padding: 60px 5%;
          background: var(--txt); border-radius: 20px;
          position: relative; overflow: hidden; text-align: center;
        }
        .hiw-cta::before {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse 60% 80% at 100% 50%, rgba(26,86,219,0.25) 0%, transparent 55%),
                      radial-gradient(ellipse 40% 60% at 0%   50%, rgba(18,161,80,0.12)  0%, transparent 55%);
        }
        .hiw-cta-inner { position: relative; z-index: 1; max-width: 640px; margin: 0 auto; }
        .hiw-cta h2 { font-size: clamp(1.5rem,3vw,2.2rem); font-weight: 800; color: #fff; letter-spacing: -0.04em; line-height: 1.15; margin-bottom: 14px; font-family: 'Plus Jakarta Sans', sans-serif; }
        .hiw-cta h2 em { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; color: #93B5FA; }
        .hiw-cta p { font-size: 0.9rem; color: #94A3B8; line-height: 1.75; margin-bottom: 32px; }
        .hiw-cta-btns { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
        .hiw-cta-btn { padding: 12px 24px; border-radius: 10px; font-size: 0.84rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; }
        .hiw-cta-btn-white { background: #fff; color: var(--txt); }
        .hiw-cta-btn-white:hover { background: #F0F0F0; }
        .hiw-cta-btn-outline { background: transparent; color: #888; border: 1.5px solid #2A2A2A; }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .hiw-steps-grid, .hiw-arrow-strip { grid-template-columns: 1fr; }
          .hiw-step-card, .hiw-arrow-cell { border-right: none; border-bottom: 1px solid var(--border); }
          .hiw-step-card:last-child, .hiw-arrow-cell:last-child { border-bottom: none; }
          .hiw-flow { grid-template-columns: 1fr 1fr; }
          .hiw-flow-arr { display: none; }
          .hiw-why-grid { grid-template-columns: 1fr; }
          .hiw-roles-grid { grid-template-columns: 1fr 1fr; }
          .hiw-stats { grid-template-columns: repeat(2,1fr); }
        }
        @media (max-width: 600px) {
          .hiw-flow, .hiw-roles-grid { grid-template-columns: 1fr; }
          .hiw-stats { grid-template-columns: repeat(2,1fr); }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="hiw-hero">
        <div className="hiw-hero-inner">
          <div className="hiw-badge">
            <span className="hiw-dot" />
            {" "}Simple · Fast · Intelligent
          </div>
          <h1>
            How <em>LoadOps AI</em><br />
            Works for You
          </h1>
          <p className="hiw-hero-sub">
            LoadOps AI eliminates manual freight searching, cold calls, and wasted hours.
            The platform connects the right load with the right truck — automatically,
            intelligently, and instantly.
          </p>
          <div className="hiw-hero-cta">
            <button className="hiw-btn hiw-btn-primary" onClick={() => router.push("/signup")}>
              Get Started Free →
            </button>
            <button className="hiw-btn hiw-btn-ghost" onClick={() => router.push("/ai-matching")}>
              Explore AI Matching
            </button>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="hiw-stats">
        <div className="hiw-sc"><div className="hiw-sn">60<span>s</span></div><div className="hiw-sl">Search to Booked</div></div>
        <div className="hiw-sc"><div className="hiw-sn">48<span>K+</span></div><div className="hiw-sl">Daily Loads Matched</div></div>
        <div className="hiw-sc"><div className="hiw-sn">0</div><div className="hiw-sl">Spam Calls</div></div>
        <div className="hiw-sc"><div className="hiw-sn">3</div><div className="hiw-sl">Dedicated Dashboards</div></div>
      </div>

      {/* ── CORE 3-STEP PROCESS ── */}
      <section className="hiw-section">
        <div className="hiw-eyebrow">The Process</div>
        <div className="hiw-section-title">Three steps to <em>booked freight</em></div>
        <div className="hiw-section-sub">Everything happens automatically. You set your preferences once — the platform handles the rest.</div>

        <div className="hiw-steps-grid">
          {/* Step 1 */}
          <div className="hiw-step-card hiw-step-blue">
            <div className="hiw-step-num-row">
              <div className="hiw-step-num">01</div>
              <div className="hiw-step-icon">👤</div>
            </div>
            <div className="hiw-step-title">Profile Setup</div>
            <div className="hiw-step-desc">
              Carriers add their truck type, preferred lanes, working regions, and availability.
              Brokers post load requirements. Dispatchers build professional profiles.
              This one-time setup powers everything the AI does for you going forward.
            </div>
            <div className="hiw-step-tags">
              <span className="hiw-stag">Truck Type</span>
              <span className="hiw-stag">Preferred Lanes</span>
              <span className="hiw-stag">Availability</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="hiw-step-card hiw-step-green">
            <div className="hiw-step-num-row">
              <div className="hiw-step-num">02</div>
              <div className="hiw-step-icon">🤖</div>
            </div>
            <div className="hiw-step-title">AI Matching Engine</div>
            <div className="hiw-step-desc">
              The system analyzes thousands of data points — distance, deadhead miles, urgency,
              load type, weight, and carrier performance — ranking the best possible
              carrier for each load in real-time and delivering matches to inboxes instantly.
            </div>
            <div className="hiw-step-tags">
              <span className="hiw-stag">Real-Time Analysis</span>
              <span className="hiw-stag">Smart Ranking</span>
              <span className="hiw-stag">Inbox Delivery</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="hiw-step-card hiw-step-purple">
            <div className="hiw-step-num-row">
              <div className="hiw-step-num">03</div>
              <div className="hiw-step-icon">✅</div>
            </div>
            <div className="hiw-step-title">Smart Booking</div>
            <div className="hiw-step-desc">
              Loads are offered directly to the most suitable carrier first.
              No bidding wars, no spam calls, no confusion.
              Accept digitally, get your rate confirmation, and roll —
              all handled in under 60 seconds.
            </div>
            <div className="hiw-step-tags">
              <span className="hiw-stag">One-Click Accept</span>
              <span className="hiw-stag">Digital Rate Con</span>
              <span className="hiw-stag">Zero Calls</span>
            </div>
          </div>
        </div>

        {/* Arrow strip */}
        <div className="hiw-arrow-strip">
          <div className="hiw-arrow-cell"><span className="hiw-arrow-icon">→</span> Preferences feed the AI engine</div>
          <div className="hiw-arrow-cell"><span className="hiw-arrow-icon">→</span> Engine surfaces the best match</div>
          <div className="hiw-arrow-cell"><span className="hiw-arrow-icon">✓</span> Carrier books and moves freight</div>
        </div>
      </section>

      {/* ── FULL 4-STEP FLOW ── */}
      <section className="hiw-section hiw-section-alt">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="hiw-centered">
            <div className="hiw-eyebrow">Detailed Workflow</div>
            <div className="hiw-section-title">From sign-up to <em>first load booked</em></div>
            <div className="hiw-section-sub">The complete step-by-step journey for every user on the platform.</div>
          </div>
          <div className="hiw-flow">
            {[
              { n:"01", icon:"🎯", title:"Choose Your Role",     desc:"Sign up as a Carrier, Broker, or Dispatcher. Each role gets its own dedicated dashboard, tools, and AI features built specifically for how you work." },
              { n:"02", icon:"⚙️", title:"Set Preferences",      desc:"Tell the system your equipment type, home region, preferred lanes, and rate expectations. Brokers post load requirements and volume." },
              { n:"03", icon:"🤖", title:"AI Works For You",     desc:"The matching engine continuously scans new loads, compares them to your profile, and pushes the best opportunities directly to your inbox." },
              { n:"04", icon:"🚛", title:"Book & Roll",          desc:"Accept digitally, receive your rate confirmation instantly, and hit the road. No calls, no negotiation, no wasted time." },
            ].map((s, i) => (
              <div key={i} className="hiw-flow-step">
                <div className="hiw-flow-icon">{s.icon}</div>
                <div className="hiw-flow-n">{s.n}</div>
                <div className="hiw-flow-title">{s.title}</div>
                <div className="hiw-flow-desc">{s.desc}</div>
                <div className="hiw-flow-arr">→</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY IT MATTERS ── */}
      <section className="hiw-section">
        <div className="hiw-why-grid">
          <div>
            <div className="hiw-eyebrow">Why It Matters</div>
            <div className="hiw-section-title">Replacing manual<br /><em>with intelligent</em></div>
            <p className="hiw-why-body">
              Traditional freight relies on calling brokers, negotiating rates over the phone,
              and manually scanning load boards for hours. This wastes time, creates inconsistency,
              and leaves trucks running empty far too often.
            </p>
            <p className="hiw-why-body">
              LoadOps AI creates a structured ecosystem where carriers, brokers, and dispatchers
              operate in sync. The AI removes guesswork, reduces empty miles, and improves
              profitability for every participant.
            </p>
            <div className="hiw-why-points">
              {[
                { icon: "🚫", bg: "#FFF1F2", title: "No More Cold Calls",    desc: "Every interaction is digital. Carriers get loads sent to them — they never have to chase." },
                { icon: "📉", bg: "#EBF1FD", title: "Fewer Empty Miles",     desc: "AI finds the next load before you finish the current one, keeping trucks earning continuously." },
                { icon: "💰", bg: "#E6F7EE", title: "Higher Earnings / Mile", desc: "RPM optimization ensures you're always matched to the highest-value load for your lane." },
              ].map((p, i) => (
                <div key={i} className="hiw-why-point">
                  <div className="hiw-why-point-icon" style={{ background: p.bg }}>{p.icon}</div>
                  <div>
                    <div className="hiw-why-point-title">{p.title}</div>
                    <div className="hiw-why-point-desc">{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COMPARISON TABLE */}
          <div className="hiw-compare">
            <div className="hiw-compare-head">
              <div className="hiw-compare-hcell">Topic</div>
              <div className="hiw-compare-hcell">Traditional</div>
              <div className="hiw-compare-hcell">LoadOps AI</div>
            </div>
            {[
              { topic: "Finding Loads",      bad: "Manual search hours",     good: "AI inbox delivery" },
              { topic: "Broker Contact",     bad: "Cold calls & negotiation", good: "Zero calls needed" },
              { topic: "Rate Information",   bad: "Guesswork",               good: "Live rate intel" },
              { topic: "Empty Miles",        bad: "20–40% of driving",       good: "Minimized by AI" },
              { topic: "Dispatcher Access",  bad: "Word of mouth only",      good: "Verified profiles" },
              { topic: "Booking Speed",      bad: "Hours to days",           good: "Under 60 seconds" },
              { topic: "Carrier Vetting",    bad: "No standard process",     good: "Credit scores & reviews" },
            ].map((r, i) => (
              <div key={i} className="hiw-compare-row">
                <div className="hiw-compare-topic">{r.topic}</div>
                <div className="hiw-compare-bad">✕ {r.bad}</div>
                <div className="hiw-compare-good">✓ {r.good}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAP ── */}
      <section className="hiw-section hiw-section-alt">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="hiw-centered">
            <div className="hiw-eyebrow">Real-Time Coverage</div>
            <div className="hiw-section-title">Freight moving <em>nationwide</em></div>
            <div className="hiw-section-sub">Active load signals across all 48 contiguous states — AI connects supply and demand instantly wherever you are.</div>
          </div>
          <div className="hiw-map-wrap">
            <iframe
              src="https://www.google.com/maps?q=United+States&output=embed"
              width="100%"
              height="460"
              loading="lazy"
              style={{ display: "block", border: "none" }}
            />
          </div>
        </div>
      </section>

      {/* ── ROLE BENEFITS ── */}
      <section className="hiw-section">
        <div className="hiw-eyebrow green">Role Benefits</div>
        <div className="hiw-section-title">How it helps <em>each role</em></div>
        <div className="hiw-section-sub">Whether you move freight, broker it, or dispatch it — the platform is purpose-built for your workflow.</div>

        <div className="hiw-roles-grid">
          <div className="hiw-role-card hiw-role-carrier">
            <div className="hiw-role-icon">🚛</div>
            <div className="hiw-role-title">Carriers</div>
            <div className="hiw-role-desc">Get high-quality loads automatically. Reduce dead miles, increase earnings, and never waste time searching load boards again.</div>
            <div className="hiw-role-feats">
              <div className="hiw-role-feat">AI loads sent to your inbox</div>
              <div className="hiw-role-feat">Equipment-specific matching</div>
              <div className="hiw-role-feat">Live rate intelligence by lane</div>
              <div className="hiw-role-feat">Broker reviews & credit scores</div>
            </div>
          </div>
          <div className="hiw-role-card hiw-role-broker">
            <div className="hiw-role-icon">📦</div>
            <div className="hiw-role-title">Brokers</div>
            <div className="hiw-role-desc">Cover loads faster with verified, available carriers. Eliminate unnecessary calls, negotiations, and coverage delays.</div>
            <div className="hiw-role-feats">
              <div className="hiw-role-feat">AI carrier matching & vetting</div>
              <div className="hiw-role-feat">Real-time carrier availability</div>
              <div className="hiw-role-feat">Digital rate confirmations</div>
              <div className="hiw-role-feat">Load tracking & analytics</div>
            </div>
          </div>
          <div className="hiw-role-card hiw-role-dispatch">
            <div className="hiw-role-icon">🎯</div>
            <div className="hiw-role-title">Dispatchers</div>
            <div className="hiw-role-desc">Build a verified professional profile, get discovered by carriers, and manage multiple accounts with full structure and clarity.</div>
            <div className="hiw-role-feats">
              <div className="hiw-role-feat">Professional profile & portfolio</div>
              <div className="hiw-role-feat">AI-matched carrier connections</div>
              <div className="hiw-role-feat">Multi-carrier load management</div>
              <div className="hiw-role-feat">Earnings & performance tracking</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <div className="hiw-cta">
        <div className="hiw-cta-inner">
          <h2>The Future of Trucking<br />is <em>Already Here</em></h2>
          <p>
            Freight is moving toward automation, data intelligence, and predictive logistics.
            Stop doing it manually. Join 12,400+ carriers, brokers, and dispatchers already
            running smarter on LoadOps AI.
          </p>
          <div className="hiw-cta-btns">
            <button className="hiw-cta-btn hiw-cta-btn-white" onClick={() => router.push("/signup")}>
              Get Started Free →
            </button>
            <button className="hiw-cta-btn hiw-cta-btn-outline" onClick={() => router.push("/Talk-to-us")}>
              Talk to Us
            </button>
          </div>
        </div>
      </div>

    </main>
  );
}
