"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("carrier");
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { alert("Please fill all fields"); return; }
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setLoading(false); alert(error.message); return; }
    const { data: profile, error: profileError } = await supabase
      .from("profiles").select("*").eq("id", data.user.id).eq("role", role).single();
    setLoading(false);
    if (profileError || !profile) { alert(`No ${role} account found with this email.`); return; }
    if (role === "carrier")    { router.push("/dashboard/carrier");    return; }
    if (role === "broker")     { router.push("/dashboard/broker");     return; }
    if (role === "dispatcher") { router.push("/dashboard/dispatcher"); return; }
  };

  const handleForgotPassword = async () => {
    if (!email) { alert("Please enter your email first"); return; }
    setResetLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: "http://localhost:3000/reset-password" });
    setResetLoading(false);
    if (error) { alert(error.message); } else { alert("Password reset email sent. Please check your inbox."); }
  };

  const roles = [
    { value: "carrier",    icon: "🚛", label: "Carrier",    desc: "Find loads & AI matches"  },
    { value: "broker",     icon: "📦", label: "Broker",     desc: "Post loads, find carriers" },
    { value: "dispatcher", icon: "🎯", label: "Dispatcher", desc: "Manage & dispatch freight" },
  ];

  const roleColors: Record<string, { border: string; bg: string; color: string }> = {
    carrier:    { border: "#C7D9FA", bg: "#EBF1FD", color: "#1A56DB" },
    broker:     { border: "#A7F3C8", bg: "#E6F7EE", color: "#12A150" },
    dispatcher: { border: "#C4B5FD", bg: "#EDE9FE", color: "#7C3AED" },
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
          --purple:   #7C3AED;
          --purple-l: #EDE9FE;
          --purple-m: #C4B5FD;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 3px #EBF1FD; }
          50%       { box-shadow: 0 0 0 6px #EBF1FD; }
        }

        /* BG DECORATIONS */
        .lg-bg-grid {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(26,86,219,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(26,86,219,0.035) 1px, transparent 1px);
          background-size: 52px 52px;
        }
        .lg-bg-glow {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background:
            radial-gradient(ellipse 60% 50% at 15% 0%,   rgba(26,86,219,0.06)  0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 85% 100%, rgba(124,58,237,0.05) 0%, transparent 60%);
        }

        /* LAYOUT */
        .lg-layout {
          position: relative; z-index: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          max-width: 960px;
          width: 100%;
          margin: 40px auto;
          padding: 0 20px;
          gap: 48px;
          align-items: center;
        }

        /* LEFT PANEL */
        .lg-left { padding: 20px 0; animation: fadeUp 0.5s ease both; }
        .lg-left-logo { font-size: 1.2rem; font-weight: 800; color: var(--txt); letter-spacing: -0.03em; margin-bottom: 32px; font-family: 'Plus Jakarta Sans', sans-serif; }
        .lg-left-logo span { color: var(--blue); }
        .lg-left-title { font-size: clamp(1.6rem, 3vw, 2.1rem); font-weight: 800; letter-spacing: -0.045em; color: var(--txt); line-height: 1.08; margin-bottom: 14px; font-family: 'Plus Jakarta Sans', sans-serif; }
        .lg-left-title em { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; color: var(--blue); }
        .lg-left-sub { font-size: 0.87rem; color: var(--txt3); line-height: 1.7; margin-bottom: 32px; font-weight: 400; }

        /* DASHBOARD PREVIEWS */
        .lg-dashboards { display: flex; flex-direction: column; gap: 10px; margin-bottom: 32px; }
        .lg-dash-item {
          background: var(--white); border: 1px solid var(--border); border-radius: 12px;
          padding: 12px 16px; display: flex; align-items: center; gap: 12px;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .lg-dash-item:hover { border-color: var(--blue-m); box-shadow: 0 4px 16px rgba(26,86,219,0.07); }
        .lg-dash-icon { width: 36px; height: 36px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
        .lg-dash-info { flex: 1; }
        .lg-dash-name { font-size: 0.8rem; font-weight: 700; color: var(--txt); margin-bottom: 2px; }
        .lg-dash-desc { font-size: 0.7rem; color: var(--txt3); font-weight: 400; }
        .lg-dash-arr  { font-size: 0.75rem; color: var(--txt4); }

        /* PROOF */
        .lg-proof { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .lg-proof-avs { display: flex; }
        .lg-proof-avs span { width: 26px; height: 26px; border-radius: 50%; background: var(--bg); border: 2px solid #fff; display: flex; align-items: center; justify-content: center; font-size: 0.58rem; font-weight: 700; color: var(--txt3); margin-left: -7px; }
        .lg-proof-avs span:first-child { margin-left: 0; }
        .lg-proof-txt { font-size: 0.72rem; color: var(--txt3); }
        .lg-proof-txt b { color: var(--txt2); }
        .lg-pstars { color: #F59E0B; font-size: 0.72rem; }

        /* FORM CARD */
        .lg-card {
          background: var(--white); border: 1px solid var(--border); border-radius: 20px;
          padding: 32px; box-shadow: 0 8px 40px rgba(0,0,0,0.07);
          animation: fadeUp 0.5s 0.1s ease both;
        }

        /* CARD HEADER */
        .lg-card-header { text-align: center; margin-bottom: 24px; }
        .lg-logo-icon { width: 50px; height: 50px; border-radius: 13px; background: var(--blue); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1rem; font-weight: 800; margin: 0 auto 12px; font-family: 'Plus Jakarta Sans', sans-serif; box-shadow: 0 4px 16px rgba(26,86,219,0.28); }
        .lg-card-title { font-size: 1.2rem; font-weight: 800; color: var(--txt); letter-spacing: -0.03em; margin-bottom: 4px; font-family: 'Plus Jakarta Sans', sans-serif; }
        .lg-card-sub { font-size: 0.76rem; color: var(--txt3); font-weight: 400; }

        /* ROLE TABS */
        .lg-role-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; margin-bottom: 16px; }
        .lg-role-btn {
          padding: 10px 6px; border-radius: 10px; border: 1.5px solid var(--border2);
          background: var(--bg); cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.15s; text-align: center;
        }
        .lg-role-btn:hover { border-color: var(--blue-m); background: var(--blue-l); }
        .lg-role-icon { font-size: 1.05rem; margin-bottom: 3px; }
        .lg-role-name { font-size: 0.7rem; font-weight: 700; color: var(--txt); }
        .lg-role-desc { font-size: 0.58rem; color: var(--txt4); margin-top: 1px; }

        /* ROLE PILL */
        .lg-role-pill {
          display: flex; align-items: center; gap: 6px;
          border-radius: 8px; padding: 7px 12px; margin-bottom: 18px;
          font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.07em;
        }

        /* FIELD */
        .lg-field { margin-bottom: 14px; }
        .lg-label { display: block; font-size: 0.7rem; font-weight: 700; color: var(--txt2); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.06em; }
        .lg-input-wrap { position: relative; }
        .lg-input {
          width: 100%; padding: 11px 14px; border-radius: 10px;
          background: var(--bg); border: 1.5px solid var(--border2);
          color: var(--txt); font-size: 0.84rem; font-family: 'Plus Jakarta Sans', sans-serif;
          outline: none; transition: border-color 0.15s, box-shadow 0.15s;
        }
        .lg-input:focus { border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-l); background: var(--white); }
        .lg-input::placeholder { color: var(--txt4); }
        .lg-input-icon { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); font-size: 0.88rem; color: var(--txt4); background: none; border: none; cursor: pointer; padding: 0; }

        /* FORGOT ROW */
        .lg-forgot-row { display: flex; justify-content: flex-end; margin-bottom: 18px; margin-top: -6px; }
        .lg-forgot-btn { background: none; border: none; color: var(--blue); font-size: 0.74rem; font-weight: 600; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: color 0.15s; }
        .lg-forgot-btn:hover { color: var(--blue-h); text-decoration: underline; }
        .lg-forgot-btn:disabled { color: var(--txt4); cursor: not-allowed; }

        /* SUBMIT */
        .lg-submit {
          width: 100%; padding: 13px; border-radius: 10px;
          background: var(--blue); color: #fff;
          font-size: 0.88rem; font-weight: 700; border: none; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif; letter-spacing: -0.01em;
          transition: all 0.18s;
          box-shadow: 0 1px 3px rgba(26,86,219,0.3), 0 4px 16px rgba(26,86,219,0.2);
        }
        .lg-submit:hover:not(:disabled) { background: var(--blue-h); transform: translateY(-1px); box-shadow: 0 4px 20px rgba(26,86,219,0.3); }
        .lg-submit:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }

        /* DIVIDER */
        .lg-divider { display: flex; align-items: center; gap: 10px; margin: 16px 0; }
        .lg-divider-line { flex: 1; height: 1px; background: var(--border); }
        .lg-divider-txt { font-size: 0.7rem; color: var(--txt4); font-weight: 500; white-space: nowrap; }

        /* SIGNUP LINK */
        .lg-signup-row { text-align: center; font-size: 0.78rem; color: var(--txt3); }
        .lg-signup-link { color: var(--blue); font-weight: 700; background: none; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.78rem; margin-left: 4px; }
        .lg-signup-link:hover { text-decoration: underline; }

        /* BADGES */
        .lg-badges { display: flex; gap: 6px; justify-content: center; margin-top: 16px; flex-wrap: wrap; }
        .lg-badge { font-size: 0.61rem; font-weight: 700; padding: 3px 9px; border-radius: 4px; background: var(--bg); border: 1px solid var(--border); color: var(--txt3); }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .lg-layout { grid-template-columns: 1fr; margin: 20px auto; gap: 0; }
          .lg-left { display: none; }
        }
      `}</style>

      {/* BACKGROUNDS */}
      <div className="lg-bg-grid" />
      <div className="lg-bg-glow" />

      <div className="lg-layout">

        {/* ── LEFT PANEL ── */}
        <div className="lg-left">
          <div className="lg-left-logo">Load<span>Ops</span> AI</div>
          <div className="lg-left-title">
            Welcome back to<br /><em>LoadOps AI</em>
          </div>
          <p className="lg-left-sub">
            Log in to your dedicated dashboard and get back to moving freight smarter.
            Your AI-matched loads are waiting.
          </p>

          {/* DASHBOARD PREVIEWS */}
          <div className="lg-dashboards">
            {[
              { icon: "🚛", bg: "#EBF1FD", name: "Carrier Dashboard",    desc: "AI loads, rate intel, broker reviews" },
              { icon: "📦", bg: "#E6F7EE", name: "Broker Dashboard",     desc: "Post loads, find verified carriers"   },
              { icon: "🎯", bg: "#EDE9FE", name: "Dispatcher Dashboard", desc: "Profile, clients, earnings tracking"  },
            ].map((d, i) => (
              <div key={i} className="lg-dash-item">
                <div className="lg-dash-icon" style={{ background: d.bg }}>{d.icon}</div>
                <div className="lg-dash-info">
                  <div className="lg-dash-name">{d.name}</div>
                  <div className="lg-dash-desc">{d.desc}</div>
                </div>
                <div className="lg-dash-arr">→</div>
              </div>
            ))}
          </div>

          <div className="lg-proof">
            <div className="lg-proof-avs">
              <span>JM</span><span>KR</span><span>TS</span><span>AB</span><span>+</span>
            </div>
            <div>
              <div className="lg-proof-txt">Trusted by <b>12,400+</b> professionals</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                <span className="lg-pstars">★★★★★</span>
                <span className="lg-proof-txt"><b>4.9</b> / 5 rating</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── FORM CARD ── */}
        <div className="lg-card">

          <div className="lg-card-header">
            <div className="lg-logo-icon">AI</div>
            <div className="lg-card-title">Login to LoadOps AI</div>
            <div className="lg-card-sub">Select your role and sign in to your dashboard</div>
          </div>

          {/* ROLE SELECTOR */}
          <div style={{ marginBottom: 8 }}>
            <div className="lg-label">Login as</div>
            <div className="lg-role-grid">
              {roles.map((r) => {
                const isActive = role === r.value;
                const c = roleColors[r.value];
                return (
                  <div
                    key={r.value}
                    className="lg-role-btn"
                    onClick={() => setRole(r.value)}
                    style={isActive ? { borderColor: c.border, background: c.bg } : {}}
                  >
                    <div className="lg-role-icon">{r.icon}</div>
                    <div className="lg-role-name" style={isActive ? { color: c.color } : {}}>{r.label}</div>
                    <div className="lg-role-desc">{r.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ROLE INDICATOR */}
          <div
            className="lg-role-pill"
            style={{ background: active.bg, border: `1px solid ${active.border}`, color: active.color }}
          >
            <span>✓ Logging in as {role.charAt(0).toUpperCase() + role.slice(1)}</span>
            <span style={{ marginLeft: "auto", fontSize: "0.62rem", fontWeight: 500, textTransform: "none", letterSpacing: 0, color: active.color, opacity: 0.8 }}>
              → {role === "carrier" ? "/dashboard/carrier" : role === "broker" ? "/dashboard/broker" : "/dashboard/dispatcher"}
            </span>
          </div>

          {/* EMAIL */}
          <div className="lg-field">
            <label className="lg-label">Email Address</label>
            <div className="lg-input-wrap">
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="lg-input"
                style={{ paddingRight: 36 }}
              />
              <span className="lg-input-icon">✉️</span>
            </div>
          </div>

          {/* PASSWORD */}
          <div className="lg-field">
            <label className="lg-label">Password</label>
            <div className="lg-input-wrap">
              <input
                type={showPass ? "text" : "password"}
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="lg-input"
                style={{ paddingRight: 36 }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <button className="lg-input-icon" onClick={() => setShowPass(!showPass)}>
                {showPass ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {/* FORGOT PASSWORD */}
          <div className="lg-forgot-row">
            <button
              onClick={handleForgotPassword}
              disabled={resetLoading}
              className="lg-forgot-btn"
            >
              {resetLoading ? "Sending reset email..." : "Forgot Password?"}
            </button>
          </div>

          {/* LOGIN BUTTON */}
          <button className="lg-submit" onClick={handleLogin} disabled={loading}>
            {loading ? "Logging In..." : `Login as ${role.charAt(0).toUpperCase() + role.slice(1)} →`}
          </button>

          <div className="lg-divider">
            <div className="lg-divider-line" />
            <div className="lg-divider-txt">Don&apos;t have an account?</div>
            <div className="lg-divider-line" />
          </div>

          <div className="lg-signup-row">
            <button className="lg-signup-link" onClick={() => router.push("/signup")}>
              Create Free Account →
            </button>
          </div>

          <div className="lg-badges">
            <div className="lg-badge">🔒 SSL Secured</div>
            <div className="lg-badge">✓ FMCSA Verified</div>
            <div className="lg-badge">No Spam</div>
          </div>

        </div>
      </div>
    </main>
  );
}
