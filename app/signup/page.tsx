"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useSearchParams, useRouter } from "next/navigation";

export default function Signup() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const defaultRole = searchParams.get("role") || "carrier";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(defaultRole);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => { setTimeout(() => setShow(true), 60); }, []);

  const handleSignup = async () => {
    if (!email || !password) { alert("Please fill all fields"); return; }
    if (password.length < 6) { alert("Password must be at least 6 characters"); return; }
    if (!agreed) { alert("Please agree to the Terms of Service and Privacy Policy"); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { role } } });
      if (error) { setLoading(false); alert(error.message); return; }
      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert([{ id: data.user.id, email, role }]);
        if (profileError) console.log(profileError);
      }
      setLoading(false);
      alert("Account created successfully! Please confirm your email and then login.");
      router.push("/login");
    } catch (err) {
      console.log(err);
      setLoading(false);
      alert("Something went wrong");
    }
  };

  const roles = [
    { value: "carrier",    icon: "🚛", label: "Carrier",    desc: "Find loads & get AI matches" },
    { value: "broker",     icon: "📦", label: "Broker",     desc: "Post loads, find carriers"   },
    { value: "dispatcher", icon: "🎯", label: "Dispatcher", desc: "Build profile, find clients"  },
  ];

  const roleColors: Record<string, { border: string; bg: string; color: string; check: string }> = {
    carrier:    { border: "#C7D9FA", bg: "#EBF1FD", color: "#1A56DB", check: "#1A56DB" },
    broker:     { border: "#A7F3C8", bg: "#E6F7EE", color: "#12A150", check: "#12A150" },
    dispatcher: { border: "#C4B5FD", bg: "#EDE9FE", color: "#7C3AED", check: "#7C3AED" },
  };

  const active = roleColors[role];

  return (
    <main style={{ minHeight: "100vh", background: "#F7F8FA", fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#0F1520", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap');

        :root {
          --white:    #FFFFFF;
          --bg:       #F7F8FA;
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
          --purple:   #7C3AED;
          --purple-l: #EDE9FE;
          --purple-m: #C4B5FD;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 3px #E6F7EE; }
          50%       { box-shadow: 0 0 0 6px #E6F7EE; }
        }

        /* ── PAGE BACKGROUND ── */
        .sg-bg-grid {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(26,86,219,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(26,86,219,0.035) 1px, transparent 1px);
          background-size: 52px 52px;
        }
        .sg-bg-glow {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background:
            radial-gradient(ellipse 70% 50% at 20% 0%,  rgba(26,86,219,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 80% 100%, rgba(124,58,237,0.05) 0%, transparent 60%);
        }

        /* ── LAYOUT ── */
        .sg-layout {
          position: relative; z-index: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          max-width: 1000px;
          width: 100%;
          margin: 40px auto;
          padding: 0 20px;
          gap: 40px;
          align-items: center;
        }

        /* ── LEFT PANEL ── */
        .sg-left { padding: 20px 0; }
        .sg-left-logo { font-size: 1.2rem; font-weight: 800; color: var(--txt); letter-spacing: -0.03em; margin-bottom: 32px; font-family: 'Plus Jakarta Sans', sans-serif; }
        .sg-left-logo span { color: var(--blue); }
        .sg-left-title { font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 800; letter-spacing: -0.045em; color: var(--txt); line-height: 1.08; margin-bottom: 14px; font-family: 'Plus Jakarta Sans', sans-serif; }
        .sg-left-title em { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; color: var(--blue); }
        .sg-left-sub { font-size: 0.88rem; color: var(--txt3); line-height: 1.7; margin-bottom: 32px; font-weight: 400; }

        .sg-features { display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px; }
        .sg-feat { display: flex; gap: 12px; align-items: flex-start; }
        .sg-feat-icon { width: 34px; height: 34px; border-radius: 9px; border: 1px solid var(--border); background: var(--white); display: flex; align-items: center; justify-content: center; font-size: 0.9rem; flex-shrink: 0; }
        .sg-feat-title { font-size: 0.82rem; font-weight: 700; color: var(--txt); margin-bottom: 2px; }
        .sg-feat-desc  { font-size: 0.74rem; color: var(--txt3); line-height: 1.5; font-weight: 400; }

        .sg-proof { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .sg-proof-avs { display: flex; }
        .sg-proof-avs span { width: 26px; height: 26px; border-radius: 50%; background: var(--bg); border: 2px solid #fff; display: flex; align-items: center; justify-content: center; font-size: 0.58rem; font-weight: 700; color: var(--txt3); margin-left: -7px; }
        .sg-proof-avs span:first-child { margin-left: 0; }
        .sg-proof-txt { font-size: 0.72rem; color: var(--txt3); }
        .sg-proof-txt b { color: var(--txt2); }
        .sg-pstars { color: #F59E0B; font-size: 0.72rem; }

        /* ── FORM CARD ── */
        .sg-card {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.07);
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .sg-card.visible { opacity: 1; transform: translateY(0); }

        .sg-card-header { text-align: center; margin-bottom: 24px; }
        .sg-logo-icon { width: 52px; height: 52px; border-radius: 14px; background: var(--blue); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1rem; font-weight: 800; margin: 0 auto 14px; font-family: 'Plus Jakarta Sans', sans-serif; box-shadow: 0 4px 16px rgba(26,86,219,0.3); }
        .sg-card-title { font-size: 1.25rem; font-weight: 800; color: var(--txt); letter-spacing: -0.03em; margin-bottom: 4px; font-family: 'Plus Jakarta Sans', sans-serif; }
        .sg-card-sub { font-size: 0.78rem; color: var(--txt3); font-weight: 400; }

        /* ROLE SELECTOR */
        .sg-role-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 20px; }
        .sg-role-btn {
          padding: 10px 8px; border-radius: 10px; border: 1.5px solid var(--border2);
          background: var(--bg); cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.15s; text-align: center;
        }
        .sg-role-btn:hover { border-color: var(--blue-m); background: var(--blue-l); }
        .sg-role-icon  { font-size: 1.1rem; margin-bottom: 4px; }
        .sg-role-name  { font-size: 0.72rem; font-weight: 700; color: var(--txt); }
        .sg-role-desc  { font-size: 0.6rem; color: var(--txt4); margin-top: 1px; font-weight: 400; }

        /* FIELD */
        .sg-field { margin-bottom: 14px; }
        .sg-label { display: block; font-size: 0.72rem; font-weight: 700; color: var(--txt2); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.06em; }
        .sg-input-wrap { position: relative; }
        .sg-input {
          width: 100%; padding: 11px 14px; border-radius: 10px;
          background: var(--bg); border: 1.5px solid var(--border2);
          color: var(--txt); font-size: 0.84rem; font-family: 'Plus Jakarta Sans', sans-serif;
          outline: none; transition: border-color 0.15s, box-shadow 0.15s;
        }
        .sg-input:focus { border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-l); background: var(--white); }
        .sg-input::placeholder { color: var(--txt4); }
        .sg-input-icon { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); cursor: pointer; font-size: 0.9rem; color: var(--txt4); background: none; border: none; padding: 0; }

        /* AGREE */
        .sg-agree { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 20px; margin-top: 4px; }
        .sg-checkbox { width: 16px; height: 16px; border-radius: 4px; border: 1.5px solid var(--border2); background: var(--bg); cursor: pointer; flex-shrink: 0; margin-top: 1px; appearance: none; outline: none; transition: all 0.15s; }
        .sg-checkbox:checked { background: var(--blue); border-color: var(--blue); }
        .sg-agree-txt { font-size: 0.74rem; color: var(--txt3); line-height: 1.5; font-weight: 400; }
        .sg-agree-txt a { color: var(--blue); text-decoration: none; font-weight: 600; }
        .sg-agree-txt a:hover { text-decoration: underline; }

        /* SUBMIT */
        .sg-submit {
          width: 100%; padding: 13px; border-radius: 10px;
          background: var(--blue); color: #fff;
          font-size: 0.88rem; font-weight: 700; border: none; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif; letter-spacing: -0.01em;
          transition: all 0.18s;
          box-shadow: 0 1px 3px rgba(26,86,219,0.3), 0 4px 16px rgba(26,86,219,0.2);
        }
        .sg-submit:hover:not(:disabled) { background: var(--blue-h); transform: translateY(-1px); box-shadow: 0 4px 20px rgba(26,86,219,0.3); }
        .sg-submit:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }

        /* DIVIDER */
        .sg-divider { display: flex; align-items: center; gap: 10px; margin: 16px 0; }
        .sg-divider-line { flex: 1; height: 1px; background: var(--border); }
        .sg-divider-txt { font-size: 0.7rem; color: var(--txt4); font-weight: 500; }

        /* LOGIN LINK */
        .sg-login-row { text-align: center; font-size: 0.78rem; color: var(--txt3); }
        .sg-login-link { color: var(--blue); font-weight: 700; background: none; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.78rem; margin-left: 4px; }
        .sg-login-link:hover { text-decoration: underline; }

        /* TRUST BADGES */
        .sg-badges { display: flex; gap: 6px; justify-content: center; margin-top: 16px; flex-wrap: wrap; }
        .sg-badge { font-size: 0.62rem; font-weight: 700; padding: 3px 9px; border-radius: 4px; background: var(--bg); border: 1px solid var(--border); color: var(--txt3); }

        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
          .sg-layout { grid-template-columns: 1fr; margin: 20px auto; }
          .sg-left { display: none; }
          .sg-card { margin: 0; }
        }
      `}</style>

      {/* BACKGROUND */}
      <div className="sg-bg-grid" />
      <div className="sg-bg-glow" />

      <div className="sg-layout">

        {/* ── LEFT PANEL ── */}
        <div className="sg-left">
          <div className="sg-left-logo">Load<span>Ops</span> AI</div>
          <div className="sg-left-title">
            The smarter way<br />to move <em>freight</em>
          </div>
          <p className="sg-left-sub">
            AI freight matching, verified load boards, dispatcher portfolios,
            and 3 dedicated dashboards — all in one platform. No cold calls, no chaos.
          </p>

          <div className="sg-features">
            {[
              { icon: "⚡", title: "AI Loads to Your Inbox",   desc: "Matching loads land in your inbox in under 4 seconds — before other carriers even see them." },
              { icon: "🎯", title: "Role-Specific Dashboard",  desc: "Carriers, brokers, and dispatchers each get a custom dashboard built for their workflow." },
              { icon: "🔇", title: "Zero Spam Calls",          desc: "Everything is handled digitally. Accept loads, confirm rates, and go — no phone calls needed." },
              { icon: "✅", title: "Verified Brokers & Loads", desc: "Every broker has a credit score and payment history. Every load is verified before it posts." },
            ].map((f, i) => (
              <div key={i} className="sg-feat">
                <div className="sg-feat-icon">{f.icon}</div>
                <div>
                  <div className="sg-feat-title">{f.title}</div>
                  <div className="sg-feat-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="sg-proof">
            <div className="sg-proof-avs">
              <span>JM</span><span>KR</span><span>TS</span><span>AB</span><span>+</span>
            </div>
            <div>
              <div className="sg-proof-txt">Trusted by <b>12,400+</b> professionals</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                <span className="sg-pstars">★★★★★</span>
                <span className="sg-proof-txt"><b>4.9</b> / 5 rating</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── FORM CARD ── */}
        <div className={`sg-card${show ? " visible" : ""}`}>

          <div className="sg-card-header">
            <div className="sg-logo-icon">AI</div>
            <div className="sg-card-title">Join LoadOps AI</div>
            <div className="sg-card-sub">Create your free account in under a minute</div>
          </div>

          {/* ROLE SELECTOR */}
          <div style={{ marginBottom: 8 }}>
            <div className="sg-label">I am a</div>
            <div className="sg-role-grid">
              {roles.map((r) => {
                const isActive = role === r.value;
                const c = roleColors[r.value];
                return (
                  <div
                    key={r.value}
                    className="sg-role-btn"
                    onClick={() => setRole(r.value)}
                    style={isActive ? { borderColor: c.border, background: c.bg } : {}}
                  >
                    <div className="sg-role-icon">{r.icon}</div>
                    <div className="sg-role-name" style={isActive ? { color: c.color } : {}}>{r.label}</div>
                    <div className="sg-role-desc">{r.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SELECTED ROLE INDICATOR */}
          <div style={{ display: "flex", alignItems: "center", gap: 7, background: active.bg, border: `1px solid ${active.border}`, borderRadius: 8, padding: "7px 12px", marginBottom: 18 }}>
            <span style={{ fontSize: "0.65rem", fontWeight: 800, color: active.color, textTransform: "uppercase", letterSpacing: "0.07em" }}>
              ✓ Signing up as {role.charAt(0).toUpperCase() + role.slice(1)}
            </span>
            <span style={{ fontSize: "0.68rem", color: active.color, marginLeft: "auto" }}>
              {role === "carrier" ? "Get AI load matches" : role === "broker" ? "Post & manage loads" : "Build your profile"}
            </span>
          </div>

          {/* EMAIL */}
          <div className="sg-field">
            <label className="sg-label">Email Address</label>
            <div className="sg-input-wrap">
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="sg-input"
                style={{ paddingRight: 38 }}
              />
              <span className="sg-input-icon">✉️</span>
            </div>
          </div>

          {/* PASSWORD */}
          <div className="sg-field">
            <label className="sg-label">Password</label>
            <div className="sg-input-wrap">
              <input
                type={showPass ? "text" : "password"}
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="sg-input"
                style={{ paddingRight: 38 }}
              />
              <button className="sg-input-icon" onClick={() => setShowPass(!showPass)}>
                {showPass ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {/* AGREE */}
          <div className="sg-agree">
            <input
              type="checkbox"
              className="sg-checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <div className="sg-agree-txt">
              I agree to the <a href="/terms-of-service">Terms of Service</a> and <a href="/privacy-policy">Privacy Policy</a>. I confirm I am at least 18 years old.
            </div>
          </div>

          {/* SUBMIT */}
          <button className="sg-submit" onClick={handleSignup} disabled={loading}>
            {loading ? "Creating Account..." : `Create ${role.charAt(0).toUpperCase() + role.slice(1)} Account →`}
          </button>

          <div className="sg-divider">
            <div className="sg-divider-line" />
            <div className="sg-divider-txt">Already have an account?</div>
            <div className="sg-divider-line" />
          </div>

          <div className="sg-login-row">
            <button className="sg-login-link" onClick={() => router.push("/login")}>
              Log In →
            </button>
          </div>

          <div className="sg-badges">
            <div className="sg-badge">✓ Free 7-Day Trial</div>
            <div className="sg-badge">🔒 SSL Secured</div>
            <div className="sg-badge">No Credit Card</div>
            <div className="sg-badge">FMCSA Verified</div>
          </div>

        </div>

      </div>
    </main>
  );
}
