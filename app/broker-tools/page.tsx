"use client";

import { useRouter } from "next/navigation";

export default function BrokerTools() {
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
          0%, 100% { box-shadow: 0 0 0 3px #E6F7EE; }
          50%       { box-shadow: 0 0 0 6px #E6F7EE; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: none; }
        }

        /* ── HERO ── */
        .bt-hero {
          padding: 80px 5% 70px;
          background: var(--white);
          text-align: center;
          position: relative; overflow: hidden;
        }
        .bt-hero::before {
          content: '';
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 90% 60% at 50% -5%, rgba(18,161,80,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 5% 90%,  rgba(26,86,219,0.04)  0%, transparent 55%),
            radial-gradient(ellipse 40% 30% at 95% 80%, rgba(124,58,237,0.04) 0%, transparent 55%);
        }
        .bt-hero::after {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(18,161,80,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(18,161,80,0.03) 1px, transparent 1px);
          background-size: 52px 52px;
          mask-image: radial-gradient(ellipse 80% 70% at 50% 0%, black 0%, transparent 70%);
        }
        .bt-hero-inner { position: relative; z-index: 1; }

        .bt-badge {
          display: inline-flex; align-items: center; gap: 7px;
          background: var(--green-l); border: 1px solid var(--green-m);
          color: var(--green); border-radius: 20px;
          font-size: 0.7rem; font-weight: 700; letter-spacing: 0.06em;
          padding: 5px 14px; margin-bottom: 24px; text-transform: uppercase;
          animation: fadeUp 0.6s ease both;
        }
        .bt-live-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--green); animation: pulse 2s infinite; display: inline-block; }

        .bt-hero h1 {
          font-size: clamp(2.2rem, 5.5vw, 3.8rem);
          font-weight: 800; letter-spacing: -0.045em; line-height: 1.05;
          color: var(--txt); margin-bottom: 20px;
          max-width: 780px; margin-left: auto; margin-right: auto;
          animation: fadeUp 0.6s 0.1s ease both;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .bt-hero h1 em { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; color: var(--green); }

        .bt-hero-sub {
          font-size: 1rem; color: var(--txt3); max-width: 520px;
          margin: 0 auto 36px; line-height: 1.75; font-weight: 400;
          animation: fadeUp 0.6s 0.2s ease both;
        }

        .bt-hero-cta { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; animation: fadeUp 0.6s 0.3s ease both; }
        .bt-btn {
          padding: 13px 26px; border-radius: 10px; font-size: 0.86rem; font-weight: 700;
          border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif;
          letter-spacing: -0.01em; transition: all 0.18s;
        }
        .bt-btn-primary { background: var(--green); color: #fff; box-shadow: 0 1px 3px rgba(18,161,80,0.3), 0 4px 16px rgba(18,161,80,0.2); }
        .bt-btn-primary:hover { background: #0e8f45; transform: translateY(-1px); }
        .bt-btn-ghost { background: transparent; color: var(--txt3); border: 1.5px solid var(--border2); }
        .bt-btn-ghost:hover { color: var(--txt); }

        .bt-hero-proof {
          display: flex; align-items: center; justify-content: center; gap: 16px;
          flex-wrap: wrap; margin-top: 36px; animation: fadeUp 0.6s 0.4s ease both;
        }
        .bt-proof-avs { display: flex; }
        .bt-proof-avs span { width: 28px; height: 28px; border-radius: 50%; background: var(--bg2); border: 2px solid #fff; display: flex; align-items: center; justify-content: center; font-size: 0.62rem; font-weight: 700; color: var(--txt3); margin-left: -8px; }
        .bt-proof-avs span:first-child { margin-left: 0; }
        .bt-proof-txt { font-size: 0.74rem; color: var(--txt3); }
        .bt-proof-txt b { color: var(--txt2); }
        .bt-pdiv { width: 1px; height: 18px; background: var(--border); }
        .bt-pstars { color: #F59E0B; font-size: 0.75rem; }

        /* ── STATS ── */
        .bt-stats { display: grid; grid-template-columns: repeat(4,1fr); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); background: var(--bg); }
        .bt-sc { padding: 26px 20px; border-right: 1px solid var(--border); text-align: center; }
        .bt-sc:last-child { border-right: none; }
        .bt-sn { font-size: 1.8rem; font-weight: 800; color: var(--txt); letter-spacing: -0.04em; line-height: 1.1; font-family: 'Plus Jakarta Sans', sans-serif; }
        .bt-sn span { color: var(--green); }
        .bt-sl { font-size: 0.7rem; color: var(--txt3); font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; margin-top: 3px; }

        /* ── SECTION COMMONS ── */
        .bt-section { padding: 80px 5%; }
        .bt-section-alt { background: var(--bg); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
        .bt-eyebrow { display: flex; align-items: center; gap: 8px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--green); margin-bottom: 12px; }
        .bt-eyebrow::before { content: ''; width: 20px; height: 2px; background: var(--green); border-radius: 1px; }
        .bt-eyebrow.blue   { color: var(--blue);   }
        .bt-eyebrow.blue::before   { background: var(--blue);   }
        .bt-eyebrow.purple { color: var(--purple); }
        .bt-eyebrow.purple::before { background: var(--purple); }
        .bt-section-title { font-size: clamp(1.5rem,3vw,2.2rem); font-weight: 800; letter-spacing: -0.04em; color: var(--txt); margin-bottom: 8px; line-height: 1.12; font-family: 'Plus Jakarta Sans', sans-serif; }
        .bt-section-title em { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; color: var(--green); }
        .bt-section-sub { font-size: 0.87rem; color: var(--txt3); max-width: 480px; margin-bottom: 44px; line-height: 1.7; font-weight: 400; }
        .bt-centered { text-align: center; }
        .bt-centered .bt-eyebrow { justify-content: center; }
        .bt-centered .bt-eyebrow::before { display: none; }
        .bt-centered .bt-section-sub { margin-left: auto; margin-right: auto; }

        /* ── CORE TOOLS — 3 CARD GRID ── */
        .bt-tools-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
        .bt-tool-card { border-radius: 18px; border: 1px solid var(--border); background: var(--white); overflow: hidden; transition: transform 0.22s, box-shadow 0.22s; }
        .bt-tool-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(0,0,0,0.09); }
        .bt-tool-header { padding: 26px 26px 20px; }
        .bt-tool-icon-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .bt-tool-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
        .bt-tool-badge { font-size: 0.6rem; font-weight: 800; padding: 3px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.07em; }
        .bt-tool-title { font-size: 1rem; font-weight: 800; color: var(--txt); letter-spacing: -0.02em; margin-bottom: 8px; }
        .bt-tool-desc { font-size: 0.79rem; color: var(--txt3); line-height: 1.65; font-weight: 400; }
        .bt-tool-features { padding: 0 26px 22px; display: flex; flex-direction: column; gap: 8px; }
        .bt-tool-feat { display: flex; align-items: center; gap: 8px; font-size: 0.77rem; color: var(--txt2); font-weight: 500; }
        .bt-tool-feat::before { content: '✓'; width: 18px; height: 18px; border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 800; flex-shrink: 0; }
        .bt-tool-footer { padding: 16px 26px; border-top: 1px solid var(--border); }
        .bt-tool-cta { width: 100%; padding: 11px; border-radius: 9px; font-size: 0.8rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: opacity 0.15s; }
        .bt-tool-cta:hover { opacity: 0.88; }

        /* Green card */
        .bt-card-green .bt-tool-header { background: linear-gradient(135deg, var(--green-l) 0%, var(--white) 100%); }
        .bt-card-green .bt-tool-icon   { background: var(--green); color: #fff; }
        .bt-card-green .bt-tool-badge  { background: var(--green-m); color: var(--green); }
        .bt-card-green .bt-tool-feat::before { background: var(--green-l); color: var(--green); }
        .bt-card-green .bt-tool-cta    { background: var(--green); color: #fff; }

        /* Blue card */
        .bt-card-blue .bt-tool-header  { background: linear-gradient(135deg, var(--blue-l) 0%, var(--white) 100%); }
        .bt-card-blue .bt-tool-icon    { background: var(--blue); color: #fff; }
        .bt-card-blue .bt-tool-badge   { background: var(--blue-m); color: var(--blue); }
        .bt-card-blue .bt-tool-feat::before { background: var(--blue-l); color: var(--blue); }
        .bt-card-blue .bt-tool-cta     { background: var(--blue); color: #fff; }

        /* Purple card */
        .bt-card-purple .bt-tool-header { background: linear-gradient(135deg, var(--purple-l) 0%, var(--white) 100%); }
        .bt-card-purple .bt-tool-icon   { background: var(--purple); color: #fff; }
        .bt-card-purple .bt-tool-badge  { background: var(--purple-m); color: var(--purple); }
        .bt-card-purple .bt-tool-feat::before { background: var(--purple-l); color: var(--purple); }
        .bt-card-purple .bt-tool-cta    { background: var(--purple); color: #fff; }

        /* ── POST LOAD MOCK ── */
        .bt-split-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
        .bt-form-mock { background: var(--white); border: 1px solid var(--border); border-radius: 18px; overflow: hidden; box-shadow: 0 12px 40px rgba(0,0,0,0.07); }
        .bt-form-mock-header { padding: 16px 20px; background: linear-gradient(135deg, var(--green-l) 0%, var(--white) 100%); border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 10px; }
        .bt-form-mock-icon { width: 32px; height: 32px; border-radius: 8px; background: var(--green); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; }
        .bt-form-mock-title { font-size: 0.82rem; font-weight: 700; color: var(--txt); }
        .bt-form-mock-body { padding: 16px 20px; display: flex; flex-direction: column; gap: 10px; }
        .bt-mock-field { background: var(--bg); border: 1.5px solid var(--border2); border-radius: 8px; padding: 10px 14px; }
        .bt-mock-field-label { font-size: 0.6rem; font-weight: 700; color: var(--txt4); text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 3px; }
        .bt-mock-field-val { font-size: 0.8rem; font-weight: 600; color: var(--txt2); }
        .bt-mock-field-val.green { color: var(--green); }
        .bt-mock-field-val.blue  { color: var(--blue); }
        .bt-mock-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .bt-mock-submit { margin: 4px 0 6px; width: 100%; padding: 11px; border-radius: 9px; background: var(--green); color: #fff; font-size: 0.8rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; }

        /* ── CARRIER MATCH MOCK ── */
        .bt-match-mock { background: var(--white); border: 1px solid var(--border); border-radius: 18px; overflow: hidden; box-shadow: 0 12px 40px rgba(0,0,0,0.07); }
        .bt-match-header { padding: 14px 20px; background: var(--bg); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
        .bt-match-title { font-size: 0.82rem; font-weight: 700; color: var(--txt); }
        .bt-match-badge { background: var(--blue); color: #fff; font-size: 0.62rem; font-weight: 800; padding: 2px 8px; border-radius: 10px; }
        .bt-match-item { padding: 14px 20px; border-bottom: 1px solid var(--border); display: flex; gap: 12px; align-items: center; transition: background 0.15s; cursor: pointer; }
        .bt-match-item:last-child { border-bottom: none; }
        .bt-match-item:hover { background: var(--bg); }
        .bt-match-avatar { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700; flex-shrink: 0; }
        .bt-match-info { flex: 1; }
        .bt-match-name { font-size: 0.78rem; font-weight: 700; color: var(--txt); margin-bottom: 2px; }
        .bt-match-detail { font-size: 0.7rem; color: var(--txt3); }
        .bt-match-score { font-size: 0.72rem; font-weight: 800; padding: 2px 8px; border-radius: 20px; }

        /* ── FEATURES 4-GRID ── */
        .bt-feat-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
        .bt-feat-card { background: var(--white); border: 1px solid var(--border); border-radius: 14px; padding: 22px 18px; transition: transform 0.2s, box-shadow 0.2s; }
        .bt-feat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(0,0,0,0.07); }
        .bt-feat-icon { font-size: 1.5rem; margin-bottom: 12px; }
        .bt-feat-label { font-size: 0.74rem; font-weight: 700; color: var(--green); text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 6px; }
        .bt-feat-desc { font-size: 0.78rem; color: var(--txt3); line-height: 1.6; font-weight: 400; }

        /* ── COMPARISON ── */
        .bt-compare-wrap { background: var(--white); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; }
        .bt-compare-head { display: grid; grid-template-columns: 2fr 1fr 1fr; padding: 12px 20px; background: var(--bg); border-bottom: 1px solid var(--border); gap: 8px; }
        .bt-ch { font-size: 0.68rem; font-weight: 700; color: var(--txt4); text-transform: uppercase; letter-spacing: 0.08em; }
        .bt-ch.green { color: var(--green); }
        .bt-compare-row { display: grid; grid-template-columns: 2fr 1fr 1fr; padding: 13px 20px; border-bottom: 1px solid var(--border); gap: 8px; align-items: center; }
        .bt-compare-row:last-child { border-bottom: none; }
        .bt-compare-row:nth-child(even) { background: var(--bg); }
        .bt-compare-feat { font-size: 0.79rem; font-weight: 600; color: var(--txt2); }
        .bt-compare-yes { font-size: 0.75rem; color: var(--green); font-weight: 700; }
        .bt-compare-no  { font-size: 0.75rem; color: var(--txt4); font-weight: 500; }

        /* ── HOW IT WORKS ── */
        .bt-steps { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
        .bt-step { padding: 26px 22px; background: var(--white); border: 1px solid var(--border); border-radius: 14px; position: relative; transition: transform 0.2s, box-shadow 0.2s; }
        .bt-step:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(0,0,0,0.07); }
        .bt-step-n { width: 32px; height: 32px; border-radius: 8px; background: var(--green-l); border: 1px solid var(--green-m); display: flex; align-items: center; justify-content: center; font-size: 0.78rem; font-weight: 800; color: var(--green); margin-bottom: 12px; }
        .bt-step-icon { font-size: 1.3rem; margin-bottom: 10px; }
        .bt-step-title { font-size: 0.84rem; font-weight: 700; color: var(--txt); margin-bottom: 6px; }
        .bt-step-desc  { font-size: 0.75rem; color: var(--txt3); line-height: 1.65; font-weight: 400; }
        .bt-step-arr { position: absolute; top: 32px; right: -13px; width: 26px; height: 26px; background: var(--white); border: 1px solid var(--border); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.68rem; color: var(--txt4); z-index: 1; }
        .bt-step:last-child .bt-step-arr { display: none; }

        /* ── CTA BANNER ── */
        .bt-cta {
          margin: 0 5% 80px; padding: 60px 5%;
          background: var(--txt); border-radius: 20px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 24px; flex-wrap: wrap; position: relative; overflow: hidden;
        }
        .bt-cta::before {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse 60% 80% at 100% 50%, rgba(18,161,80,0.28)  0%, transparent 55%),
                      radial-gradient(ellipse 40% 60% at 0%   50%, rgba(26,86,219,0.12)  0%, transparent 55%);
        }
        .bt-cta-text { position: relative; z-index: 1; }
        .bt-cta-text h2 { font-size: clamp(1.4rem,3vw,2rem); font-weight: 800; color: #fff; letter-spacing: -0.04em; line-height: 1.2; margin-bottom: 8px; font-family: 'Plus Jakarta Sans', sans-serif; }
        .bt-cta-text h2 em { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; color: #6EE7B7; }
        .bt-cta-text p { font-size: 0.86rem; color: #888; max-width: 400px; }
        .bt-cta-btns { display: flex; gap: 10px; flex-wrap: wrap; position: relative; z-index: 1; }
        .bt-cta-btn { padding: 12px 24px; border-radius: 10px; font-size: 0.84rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; }
        .bt-cta-btn-white { background: #fff; color: var(--txt); }
        .bt-cta-btn-white:hover { background: #F0F0F0; }
        .bt-cta-btn-outline { background: transparent; color: #888; border: 1.5px solid #2A2A2A; }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .bt-tools-grid, .bt-split-grid { grid-template-columns: 1fr; }
          .bt-feat-grid { grid-template-columns: 1fr 1fr; }
          .bt-steps { grid-template-columns: 1fr 1fr; }
          .bt-stats { grid-template-columns: repeat(2,1fr); }
        }
        @media (max-width: 600px) {
          .bt-feat-grid, .bt-steps { grid-template-columns: 1fr; }
          .bt-stats { grid-template-columns: repeat(2,1fr); }
          .bt-step-arr { display: none; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="bt-hero">
        <div className="bt-hero-inner">
          <div className="bt-badge">
            <span className="bt-live-dot" />
            {" "}Broker Tools & Dashboard
          </div>
          <h1>
            Post Loads. Find Carriers.<br />
            Cover Freight <em>Faster.</em>
          </h1>
          <p className="bt-hero-sub">
            LoadOps AI gives freight brokers a complete toolkit — post loads to 12,000+ verified carriers,
            get AI-matched carrier recommendations, track coverage in real-time, and manage everything from one dashboard.
          </p>
          <div className="bt-hero-cta">
            <button className="bt-btn bt-btn-primary" onClick={() => router.push("/signup?role=broker")}>
              Start as Broker Free →
            </button>
            <button className="bt-btn bt-btn-ghost" onClick={() => router.push("/platform")}>
              View Load Board
            </button>
          </div>
          <div className="bt-hero-proof">
            <div className="bt-proof-avs">
              <span>CB</span><span>MR</span><span>JT</span><span>AL</span><span>+</span>
            </div>
            <div className="bt-proof-txt">Trusted by <b>4,800+</b> brokers</div>
            <div className="bt-pdiv" />
            <div className="bt-pstars">★★★★★</div>
            <div className="bt-proof-txt"><b>4.8</b> / 5 rating</div>
            <div className="bt-pdiv" />
            <div className="bt-proof-txt"><b>98%</b> load coverage rate</div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="bt-stats">
        <div className="bt-sc"><div className="bt-sn">12<span>K+</span></div><div className="bt-sl">Verified Carriers</div></div>
        <div className="bt-sc"><div className="bt-sn">4.2<span>s</span></div><div className="bt-sl">Avg Carrier Match</div></div>
        <div className="bt-sc"><div className="bt-sn">98<span>%</span></div><div className="bt-sl">Load Coverage Rate</div></div>
        <div className="bt-sc"><div className="bt-sn">0</div><div className="bt-sl">Spam Calls</div></div>
      </div>

      {/* ── CORE TOOLS ── */}
      <section className="bt-section">
        <div className="bt-eyebrow">Core Tools</div>
        <div className="bt-section-title">Everything a broker needs,<br /><em>built in one place</em></div>
        <div className="bt-section-sub">Three purpose-built tools that replace your load board, carrier rolodex, and rate confirmation system — all working together automatically.</div>

        <div className="bt-tools-grid">
          {/* Load Posting */}
          <div className="bt-tool-card bt-card-green">
            <div className="bt-tool-header">
              <div className="bt-tool-icon-row">
                <div className="bt-tool-icon">📦</div>
                <div className="bt-tool-badge">Load Posting</div>
              </div>
              <div className="bt-tool-title">Post Loads in 60 Seconds</div>
              <div className="bt-tool-desc">
                Fill out one form — pickup, delivery, equipment, rate, and pickup date — and your load is live on the board instantly,
                visible to 12,000+ verified carriers and matched by AI.
              </div>
            </div>
            <div className="bt-tool-features">
              <div className="bt-tool-feat">Post to 12,000+ active carriers instantly</div>
              <div className="bt-tool-feat">AI carrier matching within 4.2 seconds</div>
              <div className="bt-tool-feat">Multi-equipment type support</div>
              <div className="bt-tool-feat">Pickup date & time scheduling</div>
              <div className="bt-tool-feat">Load status tracking (available / booked)</div>
              <div className="bt-tool-feat">Edit or delete loads at any time</div>
            </div>
            <div className="bt-tool-footer">
              <button className="bt-tool-cta" onClick={() => router.push("/signup?role=broker")}>Post Your First Load →</button>
            </div>
          </div>

          {/* AI Carrier Matching */}
          <div className="bt-tool-card bt-card-blue">
            <div className="bt-tool-header">
              <div className="bt-tool-icon-row">
                <div className="bt-tool-icon">🤖</div>
                <div className="bt-tool-badge">AI Matching</div>
              </div>
              <div className="bt-tool-title">AI Carrier Matching & Vetting</div>
              <div className="bt-tool-desc">
                Stop cold-calling carriers. The AI engine analyzes your load details and surfaces the top-matched carriers
                based on equipment, location, lane history, and reliability score — automatically.
              </div>
            </div>
            <div className="bt-tool-features">
              <div className="bt-tool-feat">Instant AI carrier recommendations</div>
              <div className="bt-tool-feat">Carrier reliability & performance scores</div>
              <div className="bt-tool-feat">Real-time carrier availability data</div>
              <div className="bt-tool-feat">Equipment & lane compatibility check</div>
              <div className="bt-tool-feat">Payment history & broker rating display</div>
              <div className="bt-tool-feat">Zero phone calls required</div>
            </div>
            <div className="bt-tool-footer">
              <button className="bt-tool-cta" onClick={() => router.push("/ai-matching")}>Explore AI Matching →</button>
            </div>
          </div>

          {/* Rate Confirmations */}
          <div className="bt-tool-card bt-card-purple">
            <div className="bt-tool-header">
              <div className="bt-tool-icon-row">
                <div className="bt-tool-icon">📋</div>
                <div className="bt-tool-badge">Rate Confirmations</div>
              </div>
              <div className="bt-tool-title">Digital Rate Confirmations</div>
              <div className="bt-tool-desc">
                When a carrier books your load, a digital rate confirmation is generated automatically.
                No back-and-forth emails. No faxes. Just a clean, legally sound confirmation in seconds.
              </div>
            </div>
            <div className="bt-tool-features">
              <div className="bt-tool-feat">Auto-generated on carrier booking</div>
              <div className="bt-tool-feat">Contains all load & rate details</div>
              <div className="bt-tool-feat">Carrier MC & USDOT auto-included</div>
              <div className="bt-tool-feat">Digital acceptance by carrier</div>
              <div className="bt-tool-feat">Stored in your broker dashboard</div>
              <div className="bt-tool-feat">Downloadable PDF format</div>
            </div>
            <div className="bt-tool-footer">
              <button className="bt-tool-cta" onClick={() => router.push("/signup?role=broker")}>Get Started Free →</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── POST LOAD FORM MOCK ── */}
      <section className="bt-section bt-section-alt">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="bt-split-grid">
            <div>
              <div className="bt-eyebrow">Load Posting</div>
              <div className="bt-section-title">Post a load in<br /><em>under 60 seconds</em></div>
              <div className="bt-section-sub" style={{ marginBottom: 28 }}>
                One simple form. Your load is live on the board the moment you submit — with AI matching already running in the background to find you the right carrier.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { icon: "⚡", title: "Instant Live Posting",      desc: "Load appears on the board immediately after submission — no review delay." },
                  { icon: "🤖", title: "AI Starts Matching",         desc: "The moment your load goes live, the AI scans carrier profiles for the best fit." },
                  { icon: "📬", title: "Carriers Get Alerted",       desc: "Matched carriers receive your load in their AI inbox before they even search for it." },
                  { icon: "📋", title: "Rate Con on Booking",        desc: "A digital rate confirmation is generated automatically when a carrier books." },
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

            {/* FORM MOCK */}
            <div className="bt-form-mock">
              <div className="bt-form-mock-header">
                <div className="bt-form-mock-icon">📦</div>
                <div className="bt-form-mock-title">Post New Load</div>
              </div>
              <div className="bt-form-mock-body">
                <div className="bt-mock-grid-2">
                  <div className="bt-mock-field">
                    <div className="bt-mock-field-label">Pickup Location</div>
                    <div className="bt-mock-field-val">Dallas, TX</div>
                  </div>
                  <div className="bt-mock-field">
                    <div className="bt-mock-field-label">Delivery Location</div>
                    <div className="bt-mock-field-val">Chicago, IL</div>
                  </div>
                </div>
                <div className="bt-mock-grid-2">
                  <div className="bt-mock-field">
                    <div className="bt-mock-field-label">Equipment</div>
                    <div className="bt-mock-field-val">Dry Van</div>
                  </div>
                  <div className="bt-mock-field">
                    <div className="bt-mock-field-label">Weight</div>
                    <div className="bt-mock-field-val">42,000 lbs</div>
                  </div>
                </div>
                <div className="bt-mock-grid-2">
                  <div className="bt-mock-field">
                    <div className="bt-mock-field-label">Total Rate</div>
                    <div className="bt-mock-field-val green">$2,840</div>
                  </div>
                  <div className="bt-mock-field">
                    <div className="bt-mock-field-label">Pickup Date</div>
                    <div className="bt-mock-field-val">Jun 02, 2026</div>
                  </div>
                </div>
                <div className="bt-mock-field">
                  <div className="bt-mock-field-label">Company & MC</div>
                  <div className="bt-mock-field-val">Coyote Logistics · MC-123456</div>
                </div>
                <div className="bt-mock-field">
                  <div className="bt-mock-field-label">Notes</div>
                  <div className="bt-mock-field-val" style={{ fontSize: "0.74rem", color: "var(--txt3)" }}>No-touch freight. Lumper available at delivery.</div>
                </div>
                <button className="bt-mock-submit">📦 Post Load Live →</button>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", display: "inline-block" }} />
                  <span style={{ fontSize: "0.65rem", color: "var(--txt4)", fontWeight: 600 }}>AI matching begins immediately after posting</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI CARRIER MATCHING MOCK ── */}
      <section className="bt-section">
        <div className="bt-split-grid">
          {/* MOCK */}
          <div className="bt-match-mock">
            <div className="bt-match-header">
              <div className="bt-match-title">🤖 AI Carrier Matches</div>
              <div className="bt-match-badge">5 Found</div>
            </div>
            {[
              { initials: "JT", bg: "#EBF1FD", color: "#1A56DB", name: "Johnson Transport", detail: "Dry Van · Dallas, TX · ★ 4.9 · Pays 14 days", score: 98, scoreBg: "#E6F7EE", scoreColor: "#12A150" },
              { initials: "MC", bg: "#E6F7EE", color: "#12A150", name: "MidCon Carriers",   detail: "Dry Van · Fort Worth, TX · ★ 4.7 · Pays 21 days", score: 94, scoreBg: "#EBF1FD", scoreColor: "#1A56DB" },
              { initials: "SR", bg: "#EDE9FE", color: "#7C3AED", name: "Sun Road Freight",  detail: "Dry Van · Irving, TX · ★ 4.6 · Pays 28 days", score: 91, scoreBg: "#EBF1FD", scoreColor: "#1A56DB" },
              { initials: "PL", bg: "#FEF3C7", color: "#D97706", name: "Plains Logistics",  detail: "Dry Van · Arlington, TX · ★ 4.5 · Pays 30 days", score: 87, scoreBg: "#FEF3C7", scoreColor: "#D97706" },
            ].map((m, i) => (
              <div key={i} className="bt-match-item">
                <div className="bt-match-avatar" style={{ background: m.bg, color: m.color }}>{m.initials}</div>
                <div className="bt-match-info">
                  <div className="bt-match-name">{m.name}</div>
                  <div className="bt-match-detail">{m.detail}</div>
                </div>
                <div className="bt-match-score" style={{ background: m.scoreBg, color: m.scoreColor }}>{m.score}% match</div>
              </div>
            ))}
          </div>

          <div>
            <div className="bt-eyebrow blue">AI Carrier Matching</div>
            <div className="bt-section-title">Stop calling carriers.<br /><em>Let AI find them.</em></div>
            <div className="bt-section-sub" style={{ marginBottom: 28 }}>
              Post your load and the AI engine instantly surfaces the most relevant carriers based on equipment, location, lane history, reliability, and availability — ranked by match score.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { icon: "📍", title: "Location-Based Matching",   desc: "Prioritizes carriers already in or near your pickup area to minimize deadhead and speed up acceptance." },
                { icon: "⭐", title: "Reliability Scoring",       desc: "Carriers are ranked by on-time delivery rate, booking speed, and rating history from other brokers." },
                { icon: "🔒", title: "Verified Credentials",      desc: "Every matched carrier has verified MC authority, active insurance, and a USDOT number on file." },
                { icon: "📊", title: "Payment History Visible",   desc: "See how quickly each broker pays — brokers are rated by carriers so everyone can make informed decisions." },
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
        </div>
      </section>

      {/* ── ALL FEATURES ── */}
      <section className="bt-section bt-section-alt">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="bt-centered">
            <div className="bt-eyebrow">All Features</div>
            <div className="bt-section-title">Every tool a broker <em>needs to scale</em></div>
            <div className="bt-section-sub">A complete freight operations toolkit — from load posting to carrier analytics — all in your broker dashboard.</div>
          </div>
          <div className="bt-feat-grid">
            {[
              { icon: "📦", label: "Load Posting",           desc: "Post loads in under 60 seconds with all required details and automatic carrier notification." },
              { icon: "🤖", label: "AI Carrier Matching",    desc: "AI instantly surfaces the most relevant, available, and reliable carriers for each load." },
              { icon: "📋", label: "Rate Confirmations",     desc: "Auto-generated digital rate cons when a carrier books. No email back-and-forth needed." },
              { icon: "📊", label: "Load Analytics",         desc: "Track posted loads, booking rates, average rates, and carrier response times." },
              { icon: "✅", label: "Carrier Verification",   desc: "Every carrier shows MC number, USDOT, insurance status, and broker rating on their profile." },
              { icon: "🔍", label: "Carrier Search",         desc: "Search and filter carriers by equipment, lane, location, availability, and performance score." },
              { icon: "💬", label: "Direct Messaging",       desc: "Chat directly with carriers through the platform — no phone calls, no email chains." },
              { icon: "📅", label: "Load Scheduling",        desc: "Set pickup windows, delivery deadlines, and manage multi-stop or recurring load templates." },
              { icon: "📬", label: "AI Email Alerts",        desc: "When you post a load, AI emails matched carriers automatically — increasing coverage speed." },
              { icon: "⭐", label: "Carrier Ratings",        desc: "Rate carriers after each load. Access the full rating history before you book." },
              { icon: "🗂",  label: "Load History",          desc: "Full audit trail of all posted loads, bookings, confirmations, and carrier communications." },
              { icon: "🔒", label: "Secure Platform",        desc: "SSL encrypted, SOC 2 compliant infrastructure. Your data and load details are protected." },
            ].map((f, i) => (
              <div key={i} className="bt-feat-card">
                <div className="bt-feat-icon">{f.icon}</div>
                <div className="bt-feat-label">{f.label}</div>
                <div className="bt-feat-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section className="bt-section">
        <div className="bt-eyebrow purple">Why LoadOps AI</div>
        <div className="bt-section-title">LoadOps AI vs <em>traditional methods</em></div>
        <div className="bt-section-sub">See why 4,800+ brokers are moving away from DAT, phone calls, and spreadsheets to LoadOps AI.</div>

        <div className="bt-compare-wrap">
          <div className="bt-compare-head">
            <div className="bt-ch">Feature</div>
            <div className="bt-ch">Traditional</div>
            <div className="bt-ch green">LoadOps AI</div>
          </div>
          {[
            { feat: "Carrier Discovery",       old: "Phone calls & DAT search",     now: "✓ AI instant matching"          },
            { feat: "Load Posting Speed",       old: "15–30 minutes per load",       now: "✓ Under 60 seconds"             },
            { feat: "Carrier Vetting",          old: "Manual SAFER check",           now: "✓ Auto-verified with score"     },
            { feat: "Rate Confirmation",        old: "Email PDF back-and-forth",     now: "✓ Auto-generated on booking"    },
            { feat: "Carrier Contact",          old: "Cold calls to 20+ carriers",   now: "✓ Zero calls — digital only"    },
            { feat: "Coverage Time",            old: "Hours to find a truck",        now: "✓ Average 4.2 seconds match"    },
            { feat: "Load Tracking",            old: "Phone calls & status emails",  now: "✓ Real-time dashboard tracking" },
            { feat: "Payment History",          old: "Not available upfront",        now: "✓ Visible on every carrier"     },
            { feat: "Dispatcher Access",        old: "Not available",                now: "✓ Full dispatcher marketplace"  },
            { feat: "Cost",                     old: "DAT: $150–$600/month",         now: "✓ From $49/month"               },
          ].map((r, i) => (
            <div key={i} className="bt-compare-row">
              <div className="bt-compare-feat">{r.feat}</div>
              <div className="bt-compare-no">✕ {r.old}</div>
              <div className="bt-compare-yes">{r.now}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bt-section bt-section-alt">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="bt-centered">
            <div className="bt-eyebrow">How It Works</div>
            <div className="bt-section-title">Cover your load in <em>4 steps</em></div>
            <div className="bt-section-sub">From account creation to covered load — the fastest coverage process in freight.</div>
          </div>
          <div className="bt-steps">
            {[
              { n: "01", icon: "📦", title: "Create Broker Account",  desc: "Sign up, verify your MC authority and FMCSA broker license, and get access to your broker dashboard instantly." },
              { n: "02", icon: "📝", title: "Post Your Load",          desc: "Fill in pickup, delivery, equipment, rate, and pickup date. Your load goes live in under 60 seconds." },
              { n: "03", icon: "🤖", title: "AI Finds Carriers",       desc: "The AI engine instantly matches your load to available, verified carriers and sends them inbox alerts automatically." },
              { n: "04", icon: "✅", title: "Carrier Books — Done",    desc: "A carrier accepts digitally. Rate con is auto-generated. Load is covered. Zero phone calls made." },
            ].map((s, i) => (
              <div key={i} className="bt-step">
                <div className="bt-step-icon">{s.icon}</div>
                <div className="bt-step-n">{s.n}</div>
                <div className="bt-step-title">{s.title}</div>
                <div className="bt-step-desc">{s.desc}</div>
                <div className="bt-step-arr">→</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <div className="bt-cta">
        <div className="bt-cta-text">
          <h2>Ready to cover loads<br /><em>without the chaos?</em></h2>
          <p>Join 4,800+ brokers already using LoadOps AI to post loads, find carriers, and cover freight faster than ever.</p>
        </div>
        <div className="bt-cta-btns">
          <button className="bt-cta-btn bt-cta-btn-white" onClick={() => router.push("/signup?role=broker")}>
            Start as Broker Free →
          </button>
          <button className="bt-cta-btn bt-cta-btn-outline" onClick={() => router.push("/pricing")}>
            View Pricing
          </button>
        </div>
      </div>

    </main>
  );
}
