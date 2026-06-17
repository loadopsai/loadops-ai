"use client";

import { useRouter } from "next/navigation";

export default function AIMatching() {
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
          --cyan:     #0891B2;
          --cyan-l:   #ECFEFF;
          --rose:     #E11D48;
          --rose-l:   #FFF1F2;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 3px #E6F7EE; }
          50%       { box-shadow: 0 0 0 6px #E6F7EE; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes radarPing {
          0%   { transform: scale(1);   opacity: 1; }
          100% { transform: scale(2.2); opacity: 0; }
        }

        /* ── HERO ── */
        .aim-hero {
          padding: 80px 5% 70px;
          background: var(--white);
          text-align: center;
          position: relative; overflow: hidden;
        }
        .aim-hero::before {
          content: '';
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 90% 60% at 50% -5%, rgba(26,86,219,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 5% 90%,  rgba(8,145,178,0.04)  0%, transparent 55%),
            radial-gradient(ellipse 40% 30% at 95% 80%, rgba(18,161,80,0.04)  0%, transparent 55%);
        }
        .aim-hero::after {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(26,86,219,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(26,86,219,0.035) 1px, transparent 1px);
          background-size: 52px 52px;
          mask-image: radial-gradient(ellipse 80% 70% at 50% 0%, black 0%, transparent 70%);
        }
        .aim-hero-inner { position: relative; z-index: 1; }

        .aim-badge {
          display: inline-flex; align-items: center; gap: 7px;
          background: var(--blue-l); border: 1px solid var(--blue-m);
          color: var(--blue); border-radius: 20px;
          font-size: 0.7rem; font-weight: 700; letter-spacing: 0.06em;
          padding: 5px 14px; margin-bottom: 24px; text-transform: uppercase;
          animation: fadeUp 0.6s ease both;
        }
        .live-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--green); animation: pulse 2s infinite; display: inline-block; }

        .aim-hero h1 {
          font-size: clamp(2.2rem, 5.5vw, 3.8rem);
          font-weight: 800; letter-spacing: -0.045em; line-height: 1.05;
          color: var(--txt); margin-bottom: 20px;
          max-width: 780px; margin-left: auto; margin-right: auto;
          animation: fadeUp 0.6s 0.1s ease both;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .aim-hero h1 em { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; color: var(--blue); }

        .aim-hero-sub {
          font-size: 1rem; color: var(--txt3); max-width: 560px;
          margin: 0 auto 36px; line-height: 1.75; font-weight: 400;
          animation: fadeUp 0.6s 0.2s ease both;
        }

        .aim-hero-cta { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; animation: fadeUp 0.6s 0.3s ease both; }
        .aim-btn {
          padding: 13px 26px; border-radius: 10px; font-size: 0.86rem; font-weight: 700;
          border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif;
          letter-spacing: -0.01em; transition: all 0.18s;
        }
        .aim-btn-primary { background: var(--blue); color: #fff; box-shadow: 0 1px 3px rgba(26,86,219,0.3), 0 4px 16px rgba(26,86,219,0.2); }
        .aim-btn-primary:hover { background: var(--blue-h); transform: translateY(-1px); }
        .aim-btn-ghost { background: transparent; color: var(--txt3); border: 1.5px solid var(--border2); }
        .aim-btn-ghost:hover { color: var(--txt); }

        /* ── STATS ── */
        .aim-stats { display: grid; grid-template-columns: repeat(4,1fr); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); background: var(--bg); }
        .aim-sc { padding: 26px 20px; border-right: 1px solid var(--border); text-align: center; }
        .aim-sc:last-child { border-right: none; }
        .aim-sn { font-size: 1.8rem; font-weight: 800; color: var(--txt); letter-spacing: -0.04em; line-height: 1.1; font-family: 'Plus Jakarta Sans', sans-serif; }
        .aim-sn span { color: var(--blue); }
        .aim-sl { font-size: 0.7rem; color: var(--txt3); font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; margin-top: 3px; }

        /* ── SECTION COMMONS ── */
        .aim-section { padding: 80px 5%; }
        .aim-section-alt { background: var(--bg); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
        .aim-eyebrow { display: flex; align-items: center; gap: 8px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--blue); margin-bottom: 12px; }
        .aim-eyebrow::before { content: ''; width: 20px; height: 2px; background: var(--blue); border-radius: 1px; }
        .aim-eyebrow.green { color: var(--green); }
        .aim-eyebrow.green::before { background: var(--green); }
        .aim-eyebrow.purple { color: var(--purple); }
        .aim-eyebrow.purple::before { background: var(--purple); }
        .aim-section-title { font-size: clamp(1.5rem,3vw,2.2rem); font-weight: 800; letter-spacing: -0.04em; color: var(--txt); margin-bottom: 8px; line-height: 1.12; font-family: 'Plus Jakarta Sans', sans-serif; }
        .aim-section-title em { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; color: var(--blue); }
        .aim-section-sub { font-size: 0.87rem; color: var(--txt3); max-width: 480px; margin-bottom: 44px; line-height: 1.7; font-weight: 400; }
        .aim-centered { text-align: center; }
        .aim-centered .aim-eyebrow { justify-content: center; }
        .aim-centered .aim-eyebrow::before { display: none; }
        .aim-centered .aim-section-sub { margin-left: auto; margin-right: auto; }

        /* ── HOW IT WORKS — 3 CARDS ── */
        .aim-grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }

        .aim-card {
          border-radius: 18px; border: 1px solid var(--border);
          background: var(--white); overflow: hidden;
          transition: transform 0.22s, box-shadow 0.22s;
        }
        .aim-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(0,0,0,0.08); }

        .aim-card-top { padding: 28px 28px 20px; }
        .aim-card-icon-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .aim-card-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; }
        .aim-card-num { font-size: 0.65rem; font-weight: 800; padding: 3px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.08em; }
        .aim-card-title { font-size: 1rem; font-weight: 800; color: var(--txt); letter-spacing: -0.02em; margin-bottom: 8px; }
        .aim-card-desc { font-size: 0.8rem; color: var(--txt3); line-height: 1.65; font-weight: 400; }

        .aim-card-footer { padding: 14px 28px; border-top: 1px solid var(--border); background: var(--bg); display: flex; gap: 6px; flex-wrap: wrap; }
        .aim-tag { font-size: 0.63rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; }

        /* Blue card */
        .aim-card-blue .aim-card-top { background: linear-gradient(135deg, var(--blue-l) 0%, var(--white) 100%); }
        .aim-card-blue .aim-card-icon { background: var(--blue); color: #fff; }
        .aim-card-blue .aim-card-num { background: var(--blue-m); color: var(--blue); }

        /* Green card */
        .aim-card-green .aim-card-top { background: linear-gradient(135deg, var(--green-l) 0%, var(--white) 100%); }
        .aim-card-green .aim-card-icon { background: var(--green); color: #fff; }
        .aim-card-green .aim-card-num { background: var(--green-m); color: var(--green); }

        /* Purple card */
        .aim-card-purple .aim-card-top { background: linear-gradient(135deg, var(--purple-l) 0%, var(--white) 100%); }
        .aim-card-purple .aim-card-icon { background: var(--purple); color: #fff; }
        .aim-card-purple .aim-card-num { background: var(--purple-m); color: var(--purple); }

        /* ── ADVANCED FACTORS — 4 COLS ── */
        .aim-grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
        .aim-factor {
          background: var(--white); border: 1px solid var(--border); border-radius: 14px;
          padding: 24px 20px; transition: transform 0.2s, box-shadow 0.2s;
        }
        .aim-factor:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(0,0,0,0.07); }
        .aim-factor-icon { font-size: 1.5rem; margin-bottom: 12px; }
        .aim-factor-label { font-size: 0.75rem; font-weight: 700; color: var(--blue); text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 6px; }
        .aim-factor-desc { font-size: 0.78rem; color: var(--txt3); line-height: 1.6; font-weight: 400; }

        /* ── LIVE RADAR ── */
        .aim-radar-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }

        .aim-radar-card {
          border-radius: 14px; padding: 22px 20px;
          border: 1px solid var(--border); background: var(--white);
          position: relative; overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .aim-radar-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(0,0,0,0.07); }
        .aim-radar-card.live { border-color: var(--blue-m); background: var(--blue-l); }
        .aim-radar-card.hot  { border-color: #FDE68A;       background: var(--amber-l); }
        .aim-radar-card.ai   { border-color: var(--green-m); background: var(--green-l); }

        .aim-radar-type { font-size: 0.62rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
        .aim-radar-type.blue   { color: var(--blue); }
        .aim-radar-type.amber  { color: var(--amber); }
        .aim-radar-type.green  { color: var(--green); }
        .aim-radar-ping { width: 8px; height: 8px; border-radius: 50%; position: relative; display: inline-block; }
        .aim-radar-ping::after { content: ''; position: absolute; inset: 0; border-radius: 50%; animation: radarPing 1.5s infinite; }
        .aim-radar-ping.blue  { background: var(--blue); }
        .aim-radar-ping.blue::after  { background: rgba(26,86,219,0.3); }
        .aim-radar-ping.amber { background: var(--amber); }
        .aim-radar-ping.amber::after { background: rgba(217,119,6,0.3); }
        .aim-radar-ping.green { background: var(--green); }
        .aim-radar-ping.green::after { background: rgba(18,161,80,0.3); }

        .aim-radar-main { font-size: 0.88rem; font-weight: 700; color: var(--txt); margin-bottom: 4px; }
        .aim-radar-sub  { font-size: 0.76rem; color: var(--txt3); line-height: 1.5; font-weight: 400; }
        .aim-radar-value { font-size: 1.1rem; font-weight: 800; color: var(--blue); margin-top: 8px; letter-spacing: -0.02em; }
        .aim-radar-value.amber { color: var(--amber); }
        .aim-radar-value.green { color: var(--green); }

        /* ── MAP ── */
        .aim-map-wrap { border-radius: 16px; overflow: hidden; border: 1px solid var(--border); box-shadow: 0 8px 32px rgba(0,0,0,0.07); }

        /* ── ROLE BENEFITS ── */
        .aim-role-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
        .aim-role-card {
          background: var(--white); border: 1px solid var(--border); border-radius: 16px; padding: 28px;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .aim-role-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(0,0,0,0.07); }
        .aim-role-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; margin-bottom: 16px; }
        .aim-role-title { font-size: 0.95rem; font-weight: 800; color: var(--txt); margin-bottom: 10px; letter-spacing: -0.02em; }
        .aim-role-desc { font-size: 0.8rem; color: var(--txt3); line-height: 1.7; font-weight: 400; }
        .aim-role-features { margin-top: 16px; display: flex; flex-direction: column; gap: 6px; }
        .aim-role-feat { display: flex; align-items: center; gap: 7px; font-size: 0.76rem; color: var(--txt2); font-weight: 500; }
        .aim-role-feat::before { content: '✓'; width: 16px; height: 16px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 0.6rem; font-weight: 800; flex-shrink: 0; }

        .aim-role-carrier .aim-role-icon { background: var(--blue-l); }
        .aim-role-carrier .aim-role-title { color: var(--blue); }
        .aim-role-carrier .aim-role-feat::before { background: var(--blue-l); color: var(--blue); }

        .aim-role-broker .aim-role-icon { background: var(--green-l); }
        .aim-role-broker .aim-role-title { color: var(--green); }
        .aim-role-broker .aim-role-feat::before { background: var(--green-l); color: var(--green); }

        .aim-role-dispatcher .aim-role-icon { background: var(--purple-l); }
        .aim-role-dispatcher .aim-role-title { color: var(--purple); }
        .aim-role-dispatcher .aim-role-feat::before { background: var(--purple-l); color: var(--purple); }

        /* ── FUTURE BANNER ── */
        .aim-future {
          margin: 0 5% 80px; padding: 60px 5%;
          background: var(--txt); border-radius: 20px;
          position: relative; overflow: hidden; text-align: center;
        }
        .aim-future::before {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse 60% 80% at 100% 50%, rgba(26,86,219,0.25) 0%, transparent 55%),
                      radial-gradient(ellipse 40% 60% at 0% 50%,  rgba(18,161,80,0.12)  0%, transparent 55%);
        }
        .aim-future-inner { position: relative; z-index: 1; max-width: 660px; margin: 0 auto; }
        .aim-future h2 { font-size: clamp(1.5rem, 3vw, 2.2rem); font-weight: 800; color: #fff; letter-spacing: -0.04em; line-height: 1.15; margin-bottom: 16px; font-family: 'Plus Jakarta Sans', sans-serif; }
        .aim-future h2 em { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; color: #93B5FA; }
        .aim-future p { font-size: 0.9rem; color: #94A3B8; line-height: 1.75; margin-bottom: 32px; }
        .aim-future-btns { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
        .aim-future-btn { padding: 12px 24px; border-radius: 10px; font-size: 0.84rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; }
        .aim-future-btn-white { background: #fff; color: var(--txt); }
        .aim-future-btn-white:hover { background: #F0F0F0; }
        .aim-future-btn-outline { background: transparent; color: #888; border: 1.5px solid #2A2A2A; }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .aim-grid-3, .aim-role-grid { grid-template-columns: 1fr 1fr; }
          .aim-grid-4 { grid-template-columns: 1fr 1fr; }
          .aim-radar-grid { grid-template-columns: 1fr 1fr; }
          .aim-stats { grid-template-columns: repeat(2,1fr); }
        }
        @media (max-width: 600px) {
          .aim-grid-3, .aim-role-grid, .aim-grid-4, .aim-radar-grid { grid-template-columns: 1fr; }
          .aim-stats { grid-template-columns: repeat(2,1fr); }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="aim-hero">
        <div className="aim-hero-inner">
          <div className="aim-badge">
            <span className="live-dot" />
            {" "}Real-Time AI Matching Engine
          </div>
          <h1>
            Smarter Freight Matching,<br />
            Powered by <em>Artificial Intelligence</em>
          </h1>
          <p className="aim-hero-sub">
            LoadOps AI uses a real-time intelligent matching system to connect freight with the most
            suitable carriers — automatically analyzing routes, equipment, rates, and availability
            to deliver the best load opportunities instantly.
          </p>
          <div className="aim-hero-cta">
            <button className="aim-btn aim-btn-primary" onClick={() => router.push("/signup?role=carrier")}>
              Get AI Matched Now →
            </button>
            <button className="aim-btn aim-btn-ghost" onClick={() => router.push("/dispatchers")}>
              Find Dispatchers
            </button>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="aim-stats">
        <div className="aim-sc"><div className="aim-sn">4.2<span>s</span></div><div className="aim-sl">Avg Match Time</div></div>
        <div className="aim-sc"><div className="aim-sn">96<span>%</span></div><div className="aim-sl">Match Accuracy</div></div>
        <div className="aim-sc"><div className="aim-sn">48<span>K+</span></div><div className="aim-sl">Daily Load Signals</div></div>
        <div className="aim-sc"><div className="aim-sn">0<span></span></div><div className="aim-sl">Spam Calls</div></div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section className="aim-section">
        <div className="aim-eyebrow">How It Works</div>
        <div className="aim-section-title">Three layers of <em>intelligent matching</em></div>
        <div className="aim-section-sub">The engine combines location data, equipment profiles, and performance scores to surface only the most relevant loads for each carrier.</div>

        <div className="aim-grid-3">
          {/* Location */}
          <div className="aim-card aim-card-blue">
            <div className="aim-card-top">
              <div className="aim-card-icon-row">
                <div className="aim-card-icon">📍</div>
                <div className="aim-card-num">Layer 01</div>
              </div>
              <div className="aim-card-title">Location Intelligence</div>
              <div className="aim-card-desc">
                The system detects your current position and calculates the nearest available loads,
                minimizing deadhead miles and maximizing time on the road earning.
              </div>
            </div>
            <div className="aim-card-footer">
              <span className="aim-tag" style={{ background: "#EBF1FD", color: "#1A56DB" }}>GPS Tracking</span>
              <span className="aim-tag" style={{ background: "#EBF1FD", color: "#1A56DB" }}>Deadhead Reduction</span>
              <span className="aim-tag" style={{ background: "#EBF1FD", color: "#1A56DB" }}>Lane Analysis</span>
            </div>
          </div>

          {/* Equipment */}
          <div className="aim-card aim-card-green">
            <div className="aim-card-top">
              <div className="aim-card-icon-row">
                <div className="aim-card-icon">🚛</div>
                <div className="aim-card-num">Layer 02</div>
              </div>
              <div className="aim-card-title">Equipment Matching</div>
              <div className="aim-card-desc">
                Whether you run a Sprinter Van, Box Truck, Dry Van, Reefer, or Flatbed —
                the AI only surfaces loads your truck can legally and physically haul.
              </div>
            </div>
            <div className="aim-card-footer">
              <span className="aim-tag" style={{ background: "#E6F7EE", color: "#12A150" }}>Truck Type</span>
              <span className="aim-tag" style={{ background: "#E6F7EE", color: "#12A150" }}>Weight Limits</span>
              <span className="aim-tag" style={{ background: "#E6F7EE", color: "#12A150" }}>Hazmat Check</span>
            </div>
          </div>

          {/* Performance */}
          <div className="aim-card aim-card-purple">
            <div className="aim-card-top">
              <div className="aim-card-icon-row">
                <div className="aim-card-icon">🏆</div>
                <div className="aim-card-num">Layer 03</div>
              </div>
              <div className="aim-card-title">Performance Scoring</div>
              <div className="aim-card-desc">
                Carriers are ranked based on reliability, on-time delivery rate, and booking speed.
                High-scoring carriers unlock priority access to premium loads.
              </div>
            </div>
            <div className="aim-card-footer">
              <span className="aim-tag" style={{ background: "#EDE9FE", color: "#7C3AED" }}>Reliability Score</span>
              <span className="aim-tag" style={{ background: "#EDE9FE", color: "#7C3AED" }}>On-Time Rate</span>
              <span className="aim-tag" style={{ background: "#EDE9FE", color: "#7C3AED" }}>Priority Access</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── ADVANCED FACTORS ── */}
      <section className="aim-section aim-section-alt">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="aim-centered">
            <div className="aim-eyebrow">Advanced Factors</div>
            <div className="aim-section-title">Every variable, <em>optimized</em></div>
            <div className="aim-section-sub">
              The matching engine weighs multiple data points simultaneously to produce the highest-value load recommendation for each carrier.
            </div>
          </div>

          <div className="aim-grid-4">
            {[
              { icon: "📏", label: "Distance",        desc: "Calculates optimal routes and reduces empty miles on every trip.",         color: "#1A56DB", bg: "#EBF1FD" },
              { icon: "💰", label: "RPM Optimization", desc: "Prioritizes loads with the highest revenue per mile for your lane.",        color: "#12A150", bg: "#E6F7EE" },
              { icon: "⏱",  label: "Urgency Scoring",  desc: "Time-sensitive loads are flagged and surfaced before they're gone.",       color: "#D97706", bg: "#FEF3C7" },
              { icon: "📅", label: "Availability",     desc: "Matches only loads that fit your current schedule and pickup window.",     color: "#7C3AED", bg: "#EDE9FE" },
              { icon: "⭐", label: "Broker Rating",    desc: "Only shows loads from brokers with verified payment history and ratings.",  color: "#0891B2", bg: "#ECFEFF" },
              { icon: "🔁", label: "Return Loads",     desc: "Finds backhaul opportunities so you never run empty on the return trip.",  color: "#E11D48", bg: "#FFF1F2" },
              { icon: "📦", label: "Load Frequency",   desc: "Learns which lanes you prefer and surfaces more of what you actually book.", color: "#1A56DB", bg: "#EBF1FD" },
              { icon: "🧭", label: "Home Base",        desc: "Keeps your routes within preferred regions to reduce overnight stays.",    color: "#12A150", bg: "#E6F7EE" },
            ].map((f, i) => (
              <div key={i} className="aim-factor">
                <div className="aim-factor-icon">{f.icon}</div>
                <div className="aim-factor-label" style={{ color: f.color }}>{f.label}</div>
                <div className="aim-factor-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE RADAR ── */}
      <section className="aim-section">
        <div className="aim-eyebrow">Live Signals</div>
        <div className="aim-section-title">AI Load Radar — <em>right now</em></div>
        <div className="aim-section-sub">Real-time intelligence signals from the matching engine. Updated every few seconds as new loads post and conditions change.</div>

        <div className="aim-radar-grid">
          {[
            { type: "LIVE MATCH",   pingColor: "blue",  cardClass: "live", main: "Chicago, IL → Dallas, TX", sub: "Dry Van · 920 mi · Pickup Today 3PM",           value: "$2,750 · $2.99/mi",  valueColor: "" },
            { type: "HOT ZONE",     pingColor: "amber", cardClass: "hot",  main: "Southeast Region Demand Rising",sub: "Atlanta, Charlotte, Nashville — High volume",    value: "+34% loads this week", valueColor: "amber" },
            { type: "AI SCORE",     pingColor: "green", cardClass: "ai",   main: "Your Match Confidence",    sub: "Based on your lane history and equipment profile", value: "96% Match",          valueColor: "green" },
            { type: "INBOX ALERT",  pingColor: "blue",  cardClass: "live", main: "3 New Loads for Your Truck",sub: "Dry Van · Midwest · $2.80+ RPM",                  value: "View Inbox →",       valueColor: "" },
            { type: "RATE ALERT",   pingColor: "amber", cardClass: "hot",  main: "Dallas → Chicago Rates Up", sub: "Avg rate increased $0.22/mi in last 24 hours",   value: "+8.2% this week",    valueColor: "amber" },
            { type: "ZERO SPAM",    pingColor: "green", cardClass: "ai",   main: "All Loads are Broker-Verified", sub: "Every match comes with broker rating and pay history", value: "100% Verified",valueColor: "green" },
          ].map((r, i) => (
            <div key={i} className={`aim-radar-card ${r.cardClass}`}>
              <div className={`aim-radar-type ${r.pingColor}`}>
                <span className={`aim-radar-ping ${r.pingColor}`} />
                {r.type}
              </div>
              <div className="aim-radar-main">{r.main}</div>
              <div className="aim-radar-sub">{r.sub}</div>
              <div className={`aim-radar-value ${r.valueColor}`}>{r.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MAP ── */}
      <section className="aim-section aim-section-alt">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="aim-centered">
            <div className="aim-eyebrow">Coverage</div>
            <div className="aim-section-title">Nationwide <em>matching coverage</em></div>
            <div className="aim-section-sub">Active load signals across all 48 contiguous states. The AI matches loads wherever you are.</div>
          </div>
          <div className="aim-map-wrap">
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
      <section className="aim-section">
        <div className="aim-eyebrow green">Who Benefits</div>
        <div className="aim-section-title">Built for every role <em>on the road</em></div>
        <div className="aim-section-sub">Whether you move freight, broker it, or dispatch it — the AI engine is working for you.</div>

        <div className="aim-role-grid">
          {/* Carrier */}
          <div className="aim-role-card aim-role-carrier">
            <div className="aim-role-icon">🚛</div>
            <div className="aim-role-title">Carriers</div>
            <div className="aim-role-desc">
              Receive high-quality, pre-matched loads instantly. Reduce empty miles, increase
              profitability, and never chase freight again.
            </div>
            <div className="aim-role-features">
              <div className="aim-role-feat">Loads delivered to inbox</div>
              <div className="aim-role-feat">Equipment-specific matching</div>
              <div className="aim-role-feat">Real-time rate intelligence</div>
              <div className="aim-role-feat">Zero broker cold calls</div>
            </div>
          </div>

          {/* Broker */}
          <div className="aim-role-card aim-role-broker">
            <div className="aim-role-icon">📦</div>
            <div className="aim-role-title">Brokers</div>
            <div className="aim-role-desc">
              Cover loads faster by reaching only qualified, available carriers. Improve
              booking speed and eliminate wasted outreach.
            </div>
            <div className="aim-role-features">
              <div className="aim-role-feat">AI carrier surface & vetting</div>
              <div className="aim-role-feat">Real-time availability data</div>
              <div className="aim-role-feat">Digital rate confirmations</div>
              <div className="aim-role-feat">Faster load coverage</div>
            </div>
          </div>

          {/* Dispatcher */}
          <div className="aim-role-card aim-role-dispatcher">
            <div className="aim-role-icon">🎯</div>
            <div className="aim-role-title">Dispatchers</div>
            <div className="aim-role-desc">
              Manage multiple carriers efficiently with AI insights surfacing the best
              opportunities for each truck in your fleet.
            </div>
            <div className="aim-role-features">
              <div className="aim-role-feat">Multi-carrier load management</div>
              <div className="aim-role-feat">AI load recommendations</div>
              <div className="aim-role-feat">Lane & rate performance data</div>
              <div className="aim-role-feat">Client portfolio tools</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FUTURE BANNER ── */}
      <div className="aim-future">
        <div className="aim-future-inner">
          <h2>The Future of Freight<br />is <em>Already Here</em></h2>
          <p>
            Freight is moving toward automation, data intelligence, and predictive logistics.
            AI Matching is not just a feature — it is the foundation of the next-generation
            freight ecosystem where decisions are made faster, smarter, and more efficiently
            than ever before.
          </p>
          <div className="aim-future-btns">
            <button className="aim-future-btn aim-future-btn-white" onClick={() => router.push("/signup")}>
              Start Matching Free →
            </button>
            <button className="aim-future-btn aim-future-btn-outline" onClick={() => router.push("/Talk-to-us")}>
              Talk to Us
            </button>
          </div>
        </div>
      </div>

    </main>
  );
}
