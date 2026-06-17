"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ContactUsPage() {
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [role, setRole] = useState("");
  const [subject, setSubject] = useState("");

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
          0%, 100% { box-shadow: 0 0 0 3px #EBF1FD; }
          50%       { box-shadow: 0 0 0 7px #EBF1FD; }
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
        .cu-hero {
          padding: 72px 5% 56px;
          background: var(--white);
          border-bottom: 1px solid var(--border);
          position: relative; overflow: hidden;
        }
        .cu-hero::before {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 80% 60% at 50% -10%, rgba(26,86,219,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 95% 80%,  rgba(124,58,237,0.03) 0%, transparent 55%);
        }
        .cu-hero::after {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(26,86,219,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(26,86,219,0.03) 1px, transparent 1px);
          background-size: 52px 52px;
          mask-image: radial-gradient(ellipse 70% 60% at 50% 0%, black 0%, transparent 70%);
        }
        .cu-hero-inner { position: relative; z-index: 1; max-width: 700px; }
        .cu-eyebrow { display: flex; align-items: center; gap: 8px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--blue); margin-bottom: 14px; animation: fadeUp 0.5s ease both; }
        .cu-eyebrow::before { content: ''; width: 20px; height: 2px; background: var(--blue); border-radius: 1px; }
        .cu-live-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--green); animation: pulse 2s infinite; display: inline-block; }
        .cu-title { font-size: clamp(1.9rem, 4.5vw, 3rem); font-weight: 800; letter-spacing: -0.045em; color: var(--txt); line-height: 1.06; margin-bottom: 14px; animation: fadeUp 0.5s 0.1s ease both; font-family: 'Plus Jakarta Sans', sans-serif; }
        .cu-title em { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; color: var(--blue); }
        .cu-sub { font-size: 0.92rem; color: var(--txt3); line-height: 1.75; max-width: 520px; margin-bottom: 24px; animation: fadeUp 0.5s 0.15s ease both; }

        /* META PILLS */
        .cu-meta-row { display: flex; gap: 10px; flex-wrap: wrap; animation: fadeUp 0.5s 0.2s ease both; }
        .cu-meta-pill { display: flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 20px; font-size: 0.7rem; font-weight: 600; }
        .cu-meta-pill.blue   { background: var(--blue-l);  color: var(--blue);   border: 1px solid var(--blue-m); }
        .cu-meta-pill.green  { background: var(--green-l); color: var(--green);  border: 1px solid var(--green-m); }
        .cu-meta-pill.amber  { background: var(--amber-l); color: var(--amber);  border: 1px solid #FDE68A; }
        .cu-meta-pill.purple { background: var(--purple-l);color: var(--purple); border: 1px solid var(--purple-m); }

        /* ── LAYOUT ── */
        .cu-layout { display: grid; grid-template-columns: 1fr 400px; gap: 24px; max-width: 1200px; margin: 0 auto; padding: 40px 5% 80px; align-items: start; }

        /* ── FORM CARD ── */
        .cu-form-card { background: var(--white); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; animation: fadeUp 0.5s 0.05s ease both; }
        .cu-form-card-header { padding: 22px 28px 18px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 12px; }
        .cu-form-card-icon { width: 36px; height: 36px; border-radius: 9px; background: var(--blue-l); border: 1px solid var(--blue-m); display: flex; align-items: center; justify-content: center; font-size: 0.95rem; }
        .cu-form-card-title { font-size: 0.95rem; font-weight: 800; color: var(--txt); letter-spacing: -0.02em; }
        .cu-form-card-sub { font-size: 0.72rem; color: var(--txt3); margin-top: 1px; }
        .cu-form-body { padding: 24px 28px 28px; }

        /* ROLE SELECTOR */
        .cu-role-label { font-size: 0.67rem; font-weight: 700; color: var(--txt2); text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 8px; display: block; }
        .cu-role-pills { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
        .cu-role-pill { padding: 7px 16px; border-radius: 20px; font-size: 0.76rem; font-weight: 700; border: 1.5px solid var(--border2); background: var(--bg); color: var(--txt3); cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; }
        .cu-role-pill:hover { border-color: var(--blue-m); color: var(--blue); background: var(--blue-l); }
        .cu-role-pill.carrier.active  { background: var(--blue-l);   color: var(--blue);   border-color: var(--blue-m); }
        .cu-role-pill.broker.active   { background: var(--green-l);  color: var(--green);  border-color: var(--green-m); }
        .cu-role-pill.dispatcher.active { background: var(--purple-l); color: var(--purple); border-color: var(--purple-m); }
        .cu-role-pill.other.active    { background: var(--amber-l);  color: var(--amber);  border-color: #FDE68A; }

        /* FORM GRID */
        .cu-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .cu-field { display: flex; flex-direction: column; gap: 5px; }
        .cu-field.full { grid-column: span 2; }
        .cu-label { font-size: 0.67rem; font-weight: 700; color: var(--txt2); text-transform: uppercase; letter-spacing: 0.07em; }
        .cu-input, .cu-select, .cu-textarea {
          width: 100%; padding: 10px 14px; border-radius: 9px;
          background: var(--bg); border: 1.5px solid var(--border2);
          color: var(--txt); font-size: 0.83rem; font-family: 'Plus Jakarta Sans', sans-serif;
          outline: none; transition: border-color 0.15s, box-shadow 0.15s;
        }
        .cu-input:focus, .cu-select:focus, .cu-textarea:focus {
          border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-l); background: var(--white);
        }
        .cu-input::placeholder, .cu-textarea::placeholder { color: var(--txt4); }
        .cu-textarea { min-height: 130px; resize: vertical; line-height: 1.6; }

        .cu-form-divider { height: 1px; background: var(--border); grid-column: span 2; }

        /* SUBMIT */
        .cu-submit-wrap { grid-column: span 2; display: flex; align-items: center; gap: 14px; margin-top: 4px; }
        .cu-submit {
          flex: 1; padding: 12px; border-radius: 10px;
          background: var(--blue); color: #fff;
          font-size: 0.86rem; font-weight: 700; border: none; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.18s;
          box-shadow: 0 2px 10px rgba(26,86,219,0.25);
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .cu-submit:hover { background: var(--blue-h); transform: translateY(-1px); box-shadow: 0 4px 20px rgba(26,86,219,0.35); }
        .cu-submit:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }
        .cu-secure-note { font-size: 0.68rem; color: var(--txt4); display: flex; align-items: center; gap: 5px; white-space: nowrap; }

        /* SUCCESS STATE */
        .cu-success { padding: 48px 28px; display: flex; flex-direction: column; align-items: center; text-align: center; animation: successPop 0.5s ease both; }
        .cu-success-check { width: 60px; height: 60px; border-radius: 50%; background: var(--green-l); border: 2px solid var(--green-m); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 16px; animation: checkBounce 0.5s 0.2s ease both; }
        .cu-success-title { font-size: 1rem; font-weight: 800; color: var(--txt); margin-bottom: 8px; }
        .cu-success-sub { font-size: 0.82rem; color: var(--txt3); line-height: 1.65; max-width: 320px; margin-bottom: 22px; }
        .cu-success-btn { padding: 10px 22px; border-radius: 9px; background: var(--blue); color: #fff; font-size: 0.8rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; }
        .cu-success-btn:hover { background: var(--blue-h); }

        /* ── SIDEBAR ── */
        .cu-sidebar { display: flex; flex-direction: column; gap: 16px; animation: fadeUp 0.5s 0.1s ease both; }

        /* CONTACT METHOD CARDS */
        .cu-method-card { background: var(--white); border: 1px solid var(--border); border-radius: 16px; padding: 20px; display: flex; gap: 14px; align-items: flex-start; transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; text-decoration: none; }
        .cu-method-card:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(0,0,0,0.07); }
        .cu-method-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.05rem; flex-shrink: 0; }
        .cu-method-content {}
        .cu-method-title { font-size: 0.82rem; font-weight: 700; color: var(--txt); margin-bottom: 3px; }
        .cu-method-desc { font-size: 0.73rem; color: var(--txt3); line-height: 1.55; margin-bottom: 5px; }
        .cu-method-link { font-size: 0.73rem; font-weight: 700; color: var(--blue); }

        /* QUICK LINKS CARD */
        .cu-quick-card { background: var(--white); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; }
        .cu-quick-header { padding: 14px 18px; border-bottom: 1px solid var(--border); font-size: 0.72rem; font-weight: 800; color: var(--txt); text-transform: uppercase; letter-spacing: 0.08em; background: var(--bg); }
        .cu-quick-list { display: flex; flex-direction: column; }
        .cu-quick-item { padding: 12px 18px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: background 0.15s; text-decoration: none; }
        .cu-quick-item:last-child { border-bottom: none; }
        .cu-quick-item:hover { background: var(--bg); }
        .cu-quick-item-left { display: flex; align-items: center; gap: 8px; font-size: 0.78rem; font-weight: 600; color: var(--txt2); }
        .cu-quick-item-icon { font-size: 0.9rem; }
        .cu-quick-item-arr { font-size: 0.75rem; color: var(--txt4); }

        /* TRUST CARD */
        .cu-trust-card { background: linear-gradient(135deg, var(--txt) 0%, #1A2540 100%); border-radius: 16px; padding: 22px; position: relative; overflow: hidden; }
        .cu-trust-card::before { content: ''; position: absolute; inset: 0; pointer-events: none; background: radial-gradient(ellipse 80% 70% at 100% 0%, rgba(26,86,219,0.25) 0%, transparent 55%); }
        .cu-trust-title { font-size: 0.86rem; font-weight: 800; color: #fff; margin-bottom: 5px; position: relative; z-index: 1; }
        .cu-trust-sub { font-size: 0.72rem; color: rgba(255,255,255,0.55); line-height: 1.55; margin-bottom: 14px; position: relative; z-index: 1; }
        .cu-trust-items { display: flex; flex-direction: column; gap: 8px; position: relative; z-index: 1; }
        .cu-trust-item { display: flex; align-items: center; gap: 8px; font-size: 0.73rem; color: rgba(255,255,255,0.75); font-weight: 500; }
        .cu-trust-item::before { content: '✓'; width: 16px; height: 16px; border-radius: 4px; background: rgba(18,161,80,0.25); color: var(--green-m); display: flex; align-items: center; justify-content: center; font-size: 0.6rem; font-weight: 800; flex-shrink: 0; }

        /* RESPONSIVE */
        @media (max-width: 1000px) {
          .cu-layout { grid-template-columns: 1fr; }
          .cu-sidebar { order: -1; flex-direction: row; flex-wrap: wrap; }
          .cu-method-card { flex: 1; min-width: 200px; }
          .cu-quick-card, .cu-trust-card { width: 100%; }
        }
        @media (max-width: 600px) {
          .cu-layout { padding: 24px 4% 60px; }
          .cu-hero { padding: 44px 4% 36px; }
          .cu-form-grid { grid-template-columns: 1fr; }
          .cu-field.full { grid-column: span 1; }
          .cu-submit-wrap { flex-direction: column; }
          .cu-form-body { padding: 18px 18px 22px; }
          .cu-form-card-header { padding: 16px 18px 14px; }
          .cu-sidebar { flex-direction: column; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="cu-hero">
        <div className="cu-hero-inner">
          <div className="cu-eyebrow">
            <span className="cu-live-dot" />
            {" "}Get in Touch
          </div>
          <h1 className="cu-title">Contact <em>LoadOps AI</em></h1>
          <p className="cu-sub">
            Whether you're a carrier looking for better loads, a broker needing faster coverage,
            or a dispatcher wanting to grow your business — our team is here to help you get started.
          </p>
          <div className="cu-meta-row">
            <div className="cu-meta-pill blue">⚡ Fast Response</div>
            <div className="cu-meta-pill green">✓ FMCSA Compliant</div>
            <div className="cu-meta-pill amber">🔒 Secure & Private</div>
            <div className="cu-meta-pill purple">🤖 AI Powered</div>
          </div>
        </div>
      </section>

      {/* ── LAYOUT ── */}
      <div className="cu-layout">

        {/* ── FORM CARD ── */}
        <div className="cu-form-card">
          <div className="cu-form-card-header">
            <div className="cu-form-card-icon">✉️</div>
            <div>
              <div className="cu-form-card-title">Send Us a Message</div>
              <div className="cu-form-card-sub">We'll respond within 1 business day</div>
            </div>
          </div>

          {sent ? (
            <div className="cu-success">
              <div className="cu-success-check">✓</div>
              <div className="cu-success-title">Message Sent Successfully!</div>
              <p className="cu-success-sub">
                Thanks for reaching out. Our team will review your message and get back to you within 1 business day.
              </p>
              <button className="cu-success-btn" onClick={() => setSent(false)}>Send Another Message</button>
            </div>
          ) : (
            <div className="cu-form-body">

              {/* ROLE SELECTOR */}
              <label className="cu-role-label">I am a...</label>
              <div className="cu-role-pills">
                {[
                  { label: "🚛 Carrier",    value: "carrier"    },
                  { label: "📦 Broker",     value: "broker"     },
                  { label: "🎯 Dispatcher", value: "dispatcher" },
                  { label: "❓ Other",      value: "other"      },
                ].map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    className={`cu-role-pill ${r.value}${role === r.value ? " active" : ""}`}
                    onClick={() => setRole(r.value)}
                  >
                    {r.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit}>
                <div className="cu-form-grid">
                  <div className="cu-field">
                    <label className="cu-label">Full Name *</label>
                    <input type="text" className="cu-input" placeholder="John Smith" required />
                  </div>
                  <div className="cu-field">
                    <label className="cu-label">Company Name</label>
                    <input type="text" className="cu-input" placeholder="Smith Trucking LLC" />
                  </div>
                  <div className="cu-field">
                    <label className="cu-label">Email Address *</label>
                    <input type="email" className="cu-input" placeholder="john@company.com" required />
                  </div>
                  <div className="cu-field">
                    <label className="cu-label">Phone Number</label>
                    <input type="tel" className="cu-input" placeholder="+1 234 567 890" />
                  </div>

                  <div className="cu-field full">
                    <label className="cu-label">Subject</label>
                    <select className="cu-select" value={subject} onChange={(e) => setSubject(e.target.value)}>
                      <option value="">Select a subject...</option>
                      <optgroup label="Carriers">
                        <option value="carrier-load-board">Load Board Access</option>
                        <option value="carrier-ai-inbox">AI Load Inbox Setup</option>
                        <option value="carrier-booking">Booking Support</option>
                        <option value="carrier-verification">MC / USDOT Verification</option>
                      </optgroup>
                      <optgroup label="Brokers">
                        <option value="broker-post-load">Posting Loads</option>
                        <option value="broker-carrier-match">AI Carrier Matching</option>
                        <option value="broker-rate-con">Rate Confirmations</option>
                        <option value="broker-account">Broker Account</option>
                      </optgroup>
                      <optgroup label="Dispatchers">
                        <option value="dispatcher-profile">Dispatcher Profile</option>
                        <option value="dispatcher-carrier">Managing Carriers</option>
                        <option value="dispatcher-loads">Dispatcher Load Posting</option>
                      </optgroup>
                      <optgroup label="General">
                        <option value="pricing">Pricing & Plans</option>
                        <option value="technical">Technical Support</option>
                        <option value="partnership">Partnership Inquiry</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                      </optgroup>
                    </select>
                  </div>

                  <div className="cu-form-divider" />

                  <div className="cu-field full">
                    <label className="cu-label">Message *</label>
                    <textarea
                      className="cu-textarea"
                      placeholder="Tell us how LoadOps AI can help your freight operations. The more detail you provide, the better we can assist you."
                      required
                    />
                  </div>

                  <div className="cu-submit-wrap">
                    <button type="submit" className="cu-submit" disabled={sending}>
                      {sending ? "⏳ Sending..." : "✉️ Send Message →"}
                    </button>
                    <div className="cu-secure-note">🔒 SSL Secure</div>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* ── SIDEBAR ── */}
        <div className="cu-sidebar">

          {/* CONTACT METHODS */}
          {[
            { icon: "✉️", bg: "#EBF1FD", title: "Email Support",       desc: "For general inquiries, account help, and platform questions.",      link: "support@loadopsai.com",      href: "mailto:support@loadopsai.com" },
          ].map((m, i) => (
            <a key={i} className="cu-method-card" href={m.href}>
              <div className="cu-method-icon" style={{ background: m.bg }}>{m.icon}</div>
              <div className="cu-method-content">
                <div className="cu-method-title">{m.title}</div>
                <div className="cu-method-desc">{m.desc}</div>
                <div className="cu-method-link">{m.link}</div>
              </div>
            </a>
          ))}

          {/* QUICK LINKS */}
          <div className="cu-quick-card">
            <div className="cu-quick-header">Quick Links</div>
            <div className="cu-quick-list">
              {[
                { icon: "🚛", label: "Carrier Dashboard",    href: "/dashboard/carrier"    },
                { icon: "📦", label: "Broker Dashboard",     href: "/dashboard/broker"     },
                { icon: "🎯", label: "Dispatcher Hub",       href: "/dispatcher-hub"       },
                { icon: "🤖", label: "AI Matching",          href: "/ai-matching"          },
                { icon: "💰", label: "Pricing Plans",        href: "/pricing"              },
                { icon: "📋", label: "Terms of Service",     href: "/terms-of-service"     },
                { icon: "🔒", label: "Privacy Policy",       href: "/privacy-policy"       },
              ].map((item, i) => (
                <a key={i} href={item.href} className="cu-quick-item">
                  <div className="cu-quick-item-left">
                    <span className="cu-quick-item-icon">{item.icon}</span>
                    {item.label}
                  </div>
                  <span className="cu-quick-item-arr">→</span>
                </a>
              ))}
            </div>
          </div>

          {/* TRUST CARD */}
          <div className="cu-trust-card">
            <div className="cu-trust-title">Why carriers trust LoadOps AI</div>
            <div className="cu-trust-sub">Join 12,000+ freight professionals already on the platform.</div>
            <div className="cu-trust-items">
              {[
                "Zero spam calls — digital-only booking",
                "AI-matched loads to your inbox",
                "Verified broker credit scores",
                "FMCSA compliant & SSL encrypted",
                "Real-time rate intelligence by lane",
                "Free to start — no credit card",
              ].map((item, i) => (
                <div key={i} className="cu-trust-item">{item}</div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
