"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TalkToUsPage() {
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [role, setRole] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 2000);
  };

  return (
    <main style={{ minHeight: "100vh", background: "#F7F8FA", fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#0F1520", overflowX: "hidden" }}>

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

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 3px #E6F7EE; }
          50%       { box-shadow: 0 0 0 7px #E6F7EE; }
        }
        @keyframes successPop {
          0%   { opacity: 0; transform: scale(0.92) translateY(10px); }
          100% { opacity: 1; transform: none; }
        }
        @keyframes checkBounce {
          0%   { transform: scale(0); }
          60%  { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        /* ── HERO ── */
        .tt-hero {
          padding: 72px 5% 56px;
          background: var(--white);
          border-bottom: 1px solid var(--border);
          position: relative; overflow: hidden;
        }
        .tt-hero::before {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 80% 60% at 50% -10%, rgba(26,86,219,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 95% 80%, rgba(124,58,237,0.03) 0%, transparent 55%);
        }
        .tt-hero::after {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(26,86,219,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(26,86,219,0.03) 1px, transparent 1px);
          background-size: 52px 52px;
          mask-image: radial-gradient(ellipse 70% 60% at 50% 0%, black 0%, transparent 70%);
        }
        .tt-hero-inner { position: relative; z-index: 1; max-width: 640px; }

        .tt-eyebrow { display: flex; align-items: center; gap: 8px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--blue); margin-bottom: 14px; animation: fadeUp 0.5s ease both; }
        .tt-eyebrow::before { content: ''; width: 20px; height: 2px; background: var(--blue); border-radius: 1px; }
        .tt-live-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--green); animation: pulse 2s infinite; display: inline-block; }

        .tt-title { font-size: clamp(1.9rem, 4vw, 2.9rem); font-weight: 800; letter-spacing: -0.045em; color: var(--txt); line-height: 1.06; margin-bottom: 14px; animation: fadeUp 0.5s 0.08s ease both; font-family: 'Plus Jakarta Sans', sans-serif; }
        .tt-title em { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; color: var(--blue); }

        .tt-sub { font-size: 0.9rem; color: var(--txt3); line-height: 1.75; max-width: 500px; margin-bottom: 24px; animation: fadeUp 0.5s 0.14s ease both; }

        .tt-meta-row { display: flex; gap: 10px; flex-wrap: wrap; animation: fadeUp 0.5s 0.2s ease both; }
        .tt-pill { display: flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 20px; font-size: 0.7rem; font-weight: 600; }
        .tt-pill.blue   { background: var(--blue-l);   color: var(--blue);   border: 1px solid var(--blue-m); }
        .tt-pill.green  { background: var(--green-l);  color: var(--green);  border: 1px solid var(--green-m); }
        .tt-pill.amber  { background: var(--amber-l);  color: var(--amber);  border: 1px solid #FDE68A; }
        .tt-pill.purple { background: var(--purple-l); color: var(--purple); border: 1px solid var(--purple-m); }

        /* ── LAYOUT ── */
        .tt-layout { display: grid; grid-template-columns: 1fr 380px; gap: 24px; max-width: 1160px; margin: 0 auto; padding: 40px 5% 80px; align-items: start; }

        /* ── FORM CARD ── */
        .tt-form-card { background: var(--white); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; animation: fadeUp 0.5s 0.05s ease both; }
        .tt-form-header { padding: 20px 26px 16px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 12px; }
        .tt-form-header-icon { width: 36px; height: 36px; border-radius: 9px; background: var(--blue-l); border: 1px solid var(--blue-m); display: flex; align-items: center; justify-content: center; font-size: 0.95rem; }
        .tt-form-header-title { font-size: 0.95rem; font-weight: 800; color: var(--txt); letter-spacing: -0.02em; }
        .tt-form-header-sub { font-size: 0.72rem; color: var(--txt3); margin-top: 1px; }
        .tt-form-body { padding: 22px 26px 28px; }

        /* ROLE SELECTOR */
        .tt-role-label { font-size: 0.67rem; font-weight: 700; color: var(--txt2); text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 8px; display: block; }
        .tt-role-pills { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
        .tt-role-pill { padding: 7px 16px; border-radius: 20px; font-size: 0.76rem; font-weight: 700; border: 1.5px solid var(--border2); background: var(--bg); color: var(--txt3); cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; }
        .tt-role-pill:hover { border-color: var(--blue-m); color: var(--blue); background: var(--blue-l); }
        .tt-role-pill.carrier.active    { background: var(--blue-l);   color: var(--blue);   border-color: var(--blue-m); }
        .tt-role-pill.broker.active     { background: var(--green-l);  color: var(--green);  border-color: var(--green-m); }
        .tt-role-pill.dispatcher.active { background: var(--purple-l); color: var(--purple); border-color: var(--purple-m); }
        .tt-role-pill.other.active      { background: var(--amber-l);  color: var(--amber);  border-color: #FDE68A; }

        /* FORM GRID */
        .tt-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .tt-field { display: flex; flex-direction: column; gap: 5px; }
        .tt-field.full { grid-column: span 2; }
        .tt-label { font-size: 0.67rem; font-weight: 700; color: var(--txt2); text-transform: uppercase; letter-spacing: 0.07em; }
        .tt-input, .tt-textarea {
          width: 100%; padding: 10px 14px; border-radius: 9px;
          background: var(--bg); border: 1.5px solid var(--border2);
          color: var(--txt); font-size: 0.83rem; font-family: 'Plus Jakarta Sans', sans-serif;
          outline: none; transition: border-color 0.15s, box-shadow 0.15s;
        }
        .tt-input:focus, .tt-textarea:focus { border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-l); background: var(--white); }
        .tt-input::placeholder, .tt-textarea::placeholder { color: var(--txt4); }
        .tt-textarea { min-height: 120px; resize: vertical; line-height: 1.6; }
        .tt-divider { height: 1px; background: var(--border); grid-column: span 2; }

        .tt-submit-row { grid-column: span 2; display: flex; align-items: center; gap: 14px; margin-top: 4px; }
        .tt-submit { flex: 1; padding: 12px; border-radius: 10px; background: var(--blue); color: #fff; font-size: 0.86rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.18s; box-shadow: 0 2px 10px rgba(26,86,219,0.25); display: flex; align-items: center; justify-content: center; gap: 8px; }
        .tt-submit:hover { background: var(--blue-h); transform: translateY(-1px); box-shadow: 0 4px 20px rgba(26,86,219,0.35); }
        .tt-submit:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }
        .tt-secure { font-size: 0.68rem; color: var(--txt4); display: flex; align-items: center; gap: 5px; white-space: nowrap; }

        /* SUCCESS */
        .tt-success { padding: 48px 26px; display: flex; flex-direction: column; align-items: center; text-align: center; animation: successPop 0.5s ease both; }
        .tt-success-check { width: 60px; height: 60px; border-radius: 50%; background: var(--green-l); border: 2px solid var(--green-m); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 16px; animation: checkBounce 0.5s 0.2s ease both; }
        .tt-success-title { font-size: 1rem; font-weight: 800; color: var(--txt); margin-bottom: 8px; }
        .tt-success-sub { font-size: 0.82rem; color: var(--txt3); line-height: 1.65; max-width: 300px; margin-bottom: 20px; }
        .tt-success-btn { padding: 9px 22px; border-radius: 9px; background: var(--blue); color: #fff; font-size: 0.78rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; }

        /* ── SIDEBAR ── */
        .tt-sidebar { display: flex; flex-direction: column; gap: 14px; animation: fadeUp 0.5s 0.1s ease both; }

        /* INFO CARDS */
        .tt-info-card { background: var(--white); border: 1px solid var(--border); border-radius: 16px; padding: 20px; display: flex; gap: 14px; align-items: flex-start; transition: transform 0.2s, box-shadow 0.2s; }
        .tt-info-card:hover { transform: translateY(-2px); box-shadow: 0 6px 22px rgba(0,0,0,0.07); }
        .tt-info-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.05rem; flex-shrink: 0; }
        .tt-info-title { font-size: 0.84rem; font-weight: 700; color: var(--txt); margin-bottom: 4px; }
        .tt-info-desc { font-size: 0.74rem; color: var(--txt3); line-height: 1.6; font-weight: 400; }

        /* TRUST CARD */
        .tt-trust { background: var(--txt); border-radius: 16px; padding: 22px; position: relative; overflow: hidden; }
        .tt-trust::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 80% 70% at 100% 0%, rgba(26,86,219,0.28) 0%, transparent 55%); pointer-events: none; }
        .tt-trust-title { font-size: 0.9rem; font-weight: 800; color: #fff; margin-bottom: 5px; letter-spacing: -0.02em; position: relative; z-index: 1; font-family: 'Plus Jakarta Sans', sans-serif; }
        .tt-trust-title em { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; color: #93B5FA; }
        .tt-trust-sub { font-size: 0.72rem; color: rgba(255,255,255,0.45); line-height: 1.55; margin-bottom: 14px; position: relative; z-index: 1; }
        .tt-trust-items { display: flex; flex-direction: column; gap: 7px; position: relative; z-index: 1; }
        .tt-trust-item { display: flex; align-items: center; gap: 8px; font-size: 0.72rem; color: rgba(255,255,255,0.7); }
        .tt-trust-item::before { content: '✓'; width: 16px; height: 16px; border-radius: 4px; background: rgba(18,161,80,0.2); color: #6EE7B7; display: flex; align-items: center; justify-content: center; font-size: 0.58rem; font-weight: 800; flex-shrink: 0; }
        .tt-trust-btns { display: flex; gap: 8px; margin-top: 16px; position: relative; z-index: 1; }
        .tt-trust-btn { padding: 8px 16px; border-radius: 8px; font-size: 0.74rem; font-weight: 700; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; border: none; }
        .tt-trust-btn.white { background: #fff; color: var(--txt); }
        .tt-trust-btn.white:hover { background: #f0f0f0; }
        .tt-trust-btn.ghost { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.55); border: 1px solid rgba(255,255,255,0.12); }

        /* RESPONSIVE */
        @media (max-width: 1000px) { .tt-layout { grid-template-columns: 1fr; } .tt-sidebar { order: -1; } }
        @media (max-width: 600px) {
          .tt-layout { padding: 24px 4% 60px; }
          .tt-hero { padding: 44px 4% 36px; }
          .tt-form-grid { grid-template-columns: 1fr; }
          .tt-field.full { grid-column: span 1; }
          .tt-divider { grid-column: span 1; }
          .tt-submit-row { grid-column: span 1; flex-direction: column; }
          .tt-form-body { padding: 18px 18px 22px; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="tt-hero">
        <div className="tt-hero-inner">
          <div className="tt-eyebrow">
            <span className="tt-live-dot" />
            {" "}AI Freight Communication
          </div>
          <h1 className="tt-title">Talk to <em>LoadOps AI</em></h1>
          <p className="tt-sub">
            Connect with our team directly. Whether you're a carrier looking for loads, a broker needing coverage,
            or a dispatcher growing your business — we're here to help.
          </p>
          <div className="tt-meta-row">
            <div className="tt-pill blue">⚡ Fast Response</div>
            <div className="tt-pill green">✓ FMCSA Compliant</div>
            <div className="tt-pill amber">🔒 Secure & Private</div>
            <div className="tt-pill purple">🤖 AI Powered</div>
          </div>
        </div>
      </section>

      {/* ── LAYOUT ── */}
      <div className="tt-layout">

        {/* ── FORM CARD ── */}
        <div className="tt-form-card">
          <div className="tt-form-header">
            <div className="tt-form-header-icon">✉️</div>
            <div>
              <div className="tt-form-header-title">Send Us a Message</div>
              <div className="tt-form-header-sub">We'll respond within 1 business day</div>
            </div>
          </div>

          {sent ? (
            <div className="tt-success">
              <div className="tt-success-check">✓</div>
              <div className="tt-success-title">Message Sent!</div>
              <p className="tt-success-sub">Thanks for reaching out. Our team will get back to you within 1 business day.</p>
              <button className="tt-success-btn" onClick={() => setSent(false)}>Send Another</button>
            </div>
          ) : (
            <div className="tt-form-body">
              <label className="tt-role-label">I am a...</label>
              <div className="tt-role-pills">
                {[
                  { label: "🚛 Carrier",    value: "carrier"    },
                  { label: "📦 Broker",     value: "broker"     },
                  { label: "🎯 Dispatcher", value: "dispatcher" },
                  { label: "❓ Other",      value: "other"      },
                ].map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    className={`tt-role-pill ${r.value}${role === r.value ? " active" : ""}`}
                    onClick={() => setRole(r.value)}
                  >
                    {r.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit}>
                <div className="tt-form-grid">
                  <div className="tt-field">
                    <label className="tt-label">Full Name *</label>
                    <input type="text" className="tt-input" placeholder="John Smith" required />
                  </div>
                  <div className="tt-field">
                    <label className="tt-label">Company</label>
                    <input type="text" className="tt-input" placeholder="Smith Trucking LLC" />
                  </div>
                  <div className="tt-field">
                    <label className="tt-label">Email Address *</label>
                    <input type="email" className="tt-input" placeholder="john@company.com" required />
                  </div>
                  <div className="tt-field">
                    <label className="tt-label">Phone Number</label>
                    <input type="tel" className="tt-input" placeholder="+1 234 567 890" />
                  </div>
                  <div className="tt-divider" />
                  <div className="tt-field full">
                    <label className="tt-label">Message *</label>
                    <textarea className="tt-textarea" placeholder="Tell us how LoadOps AI can help your freight operations..." required />
                  </div>
                  <div className="tt-submit-row">
                    <button type="submit" className="tt-submit" disabled={sending}>
                      {sending ? "⏳ Sending..." : "✉️ Send Message →"}
                    </button>
                    <div className="tt-secure">🔒 SSL Secure</div>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* ── SIDEBAR ── */}
        <div className="tt-sidebar">

          {[
            { icon: "🤖", bg: "#EBF1FD", title: "AI-Powered Platform",    desc: "LoadOps AI uses machine learning to match carriers with loads, surface rate intel, and automate your entire freight workflow." },
            { icon: "📡", bg: "#E6F7EE", title: "Real-Time Operations",   desc: "Live load board, instant booking, realtime chat and calls — everything updates instantly so you never miss a load." },
            { icon: "🚛", bg: "#EDE9FE", title: "Built for Freight",      desc: "Designed specifically for carriers, brokers, and dispatchers — not a generic logistics tool. Every feature is freight-first." },
          ].map((card, i) => (
            <div key={i} className="tt-info-card">
              <div className="tt-info-icon" style={{ background: card.bg }}>{card.icon}</div>
              <div>
                <div className="tt-info-title">{card.title}</div>
                <div className="tt-info-desc">{card.desc}</div>
              </div>
            </div>
          ))}

          <div className="tt-trust">
            <div className="tt-trust-title">Join LoadOps <em>AI Today</em></div>
            <div className="tt-trust-sub">Trusted by 12,000+ freight professionals across the US.</div>
            <div className="tt-trust-items">
              {[
                "Zero spam calls — digital booking only",
                "AI-matched loads to your inbox",
                "Verified broker credit scores",
                "FMCSA compliant & SSL encrypted",
                "Free to start — no credit card",
              ].map((item, i) => (
                <div key={i} className="tt-trust-item">{item}</div>
              ))}
            </div>
            <div className="tt-trust-btns">
              <button className="tt-trust-btn white" onClick={() => router.push("/signup")}>Get Started Free →</button>
              <button className="tt-trust-btn ghost" onClick={() => router.push("/platform")}>View Load Board</button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
