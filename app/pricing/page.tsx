"use client";

import { useRouter } from "next/navigation";

export default function Pricing() {
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
        .pr-hero {
          padding: 80px 5% 70px;
          background: var(--white);
          text-align: center;
          position: relative; overflow: hidden;
        }
        .pr-hero::before {
          content: '';
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 90% 60% at 50% -5%, rgba(26,86,219,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 5%  90%, rgba(18,161,80,0.04)  0%, transparent 55%),
            radial-gradient(ellipse 40% 30% at 95% 80%, rgba(124,58,237,0.04) 0%, transparent 55%);
        }
        .pr-hero::after {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(26,86,219,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(26,86,219,0.035) 1px, transparent 1px);
          background-size: 52px 52px;
          mask-image: radial-gradient(ellipse 80% 70% at 50% 0%, black 0%, transparent 70%);
        }
        .pr-hero-inner { position: relative; z-index: 1; }

        .pr-badge {
          display: inline-flex; align-items: center; gap: 7px;
          background: var(--green-l); border: 1px solid var(--green-m);
          color: var(--green); border-radius: 20px;
          font-size: 0.7rem; font-weight: 700; letter-spacing: 0.06em;
          padding: 5px 14px; margin-bottom: 24px; text-transform: uppercase;
          animation: fadeUp 0.6s ease both;
        }
        .pr-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--green); animation: pulse 2s infinite; display: inline-block; }

        .pr-hero h1 {
          font-size: clamp(2.2rem, 5.5vw, 3.8rem);
          font-weight: 800; letter-spacing: -0.045em; line-height: 1.05;
          color: var(--txt); margin-bottom: 20px;
          max-width: 720px; margin-left: auto; margin-right: auto;
          animation: fadeUp 0.6s 0.1s ease both;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .pr-hero h1 em { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; color: var(--blue); }

        .pr-hero-sub {
          font-size: 1rem; color: var(--txt3); max-width: 500px;
          margin: 0 auto 16px; line-height: 1.75; font-weight: 400;
          animation: fadeUp 0.6s 0.2s ease both;
        }
        .pr-toggle-note {
          font-size: 0.78rem; color: var(--txt4); margin-bottom: 8px;
          animation: fadeUp 0.6s 0.25s ease both;
        }
        .pr-trust-row {
          display: flex; align-items: center; justify-content: center; gap: 20px; flex-wrap: wrap;
          margin-top: 24px; animation: fadeUp 0.6s 0.3s ease both;
        }
        .pr-trust-item { display: flex; align-items: center; gap: 6px; font-size: 0.74rem; color: var(--txt3); font-weight: 500; }
        .pr-trust-icon { font-size: 0.9rem; }
        .pr-tdiv { width: 1px; height: 16px; background: var(--border); }

        /* ── STATS ── */
        .pr-stats { display: grid; grid-template-columns: repeat(4,1fr); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); background: var(--bg); }
        .pr-sc { padding: 22px 20px; border-right: 1px solid var(--border); text-align: center; }
        .pr-sc:last-child { border-right: none; }
        .pr-sn { font-size: 1.7rem; font-weight: 800; color: var(--txt); letter-spacing: -0.04em; line-height: 1.1; font-family: 'Plus Jakarta Sans', sans-serif; }
        .pr-sn span { color: var(--green); }
        .pr-sl { font-size: 0.68rem; color: var(--txt3); font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; margin-top: 3px; }

        /* ── SECTION COMMONS ── */
        .pr-section { padding: 80px 5%; }
        .pr-section-alt { background: var(--bg); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
        .pr-eyebrow { display: flex; align-items: center; gap: 8px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--blue); margin-bottom: 12px; }
        .pr-eyebrow::before { content: ''; width: 20px; height: 2px; background: var(--blue); border-radius: 1px; }
        .pr-eyebrow.green { color: var(--green); }
        .pr-eyebrow.green::before { background: var(--green); }
        .pr-section-title { font-size: clamp(1.5rem,3vw,2.2rem); font-weight: 800; letter-spacing: -0.04em; color: var(--txt); margin-bottom: 8px; line-height: 1.12; font-family: 'Plus Jakarta Sans', sans-serif; }
        .pr-section-title em { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; color: var(--blue); }
        .pr-section-sub { font-size: 0.87rem; color: var(--txt3); max-width: 480px; margin-bottom: 44px; line-height: 1.7; font-weight: 400; }
        .pr-centered { text-align: center; }
        .pr-centered .pr-eyebrow { justify-content: center; }
        .pr-centered .pr-eyebrow::before { display: none; }
        .pr-centered .pr-section-sub { margin-left: auto; margin-right: auto; }

        /* ── PRICING CARDS ── */
        .pr-cards-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; max-width: 1100px; margin: 0 auto; }

        .pr-card { border-radius: 20px; border: 1px solid var(--border); background: var(--white); overflow: hidden; transition: transform 0.22s, box-shadow 0.22s; display: flex; flex-direction: column; }
        .pr-card:hover { transform: translateY(-5px); box-shadow: 0 20px 56px rgba(0,0,0,0.1); }
        .pr-card.featured { border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-l), 0 16px 48px rgba(26,86,219,0.12); }

        .pr-card-header { padding: 28px 28px 22px; }
        .pr-card-top-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
        .pr-plan-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }
        .pr-popular-tag { font-size: 0.6rem; font-weight: 800; padding: 3px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.07em; background: var(--blue); color: #fff; }

        .pr-plan-name { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px; }
        .pr-plan-tagline { font-size: 0.78rem; color: var(--txt3); line-height: 1.5; font-weight: 400; }

        .pr-price-row { margin: 20px 0 6px; display: flex; align-items: flex-end; gap: 4px; }
        .pr-price { font-size: 2.8rem; font-weight: 800; color: var(--txt); letter-spacing: -0.05em; line-height: 1; font-family: 'Plus Jakarta Sans', sans-serif; }
        .pr-price-per { font-size: 0.78rem; color: var(--txt4); padding-bottom: 5px; font-weight: 500; }
        .pr-price-note { font-size: 0.72rem; color: var(--txt4); font-weight: 400; }

        .pr-divider { height: 1px; background: var(--border); margin: 20px 0; }

        .pr-features { padding: 0 28px 24px; flex: 1; display: flex; flex-direction: column; gap: 9px; }
        .pr-feature { display: flex; align-items: center; gap: 9px; font-size: 0.78rem; color: var(--txt2); font-weight: 500; }
        .pr-feature-check { width: 18px; height: 18px; border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: 0.6rem; font-weight: 800; flex-shrink: 0; }
        .pr-feature.disabled { color: var(--txt4); }
        .pr-feature.disabled .pr-feature-check { background: var(--bg2); color: var(--txt4); }

        .pr-card-footer { padding: 20px 28px 24px; border-top: 1px solid var(--border); }
        .pr-cta-btn { width: 100%; padding: 12px; border-radius: 10px; font-size: 0.84rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; }

        /* Starter */
        .pr-starter .pr-card-header { background: linear-gradient(135deg, var(--bg) 0%, var(--white) 100%); }
        .pr-starter .pr-plan-icon  { background: var(--blue-l); }
        .pr-starter .pr-plan-name  { color: var(--blue); }
        .pr-starter .pr-feature-check { background: var(--blue-l); color: var(--blue); }
        .pr-starter .pr-cta-btn   { background: var(--white); color: var(--blue); border: 1.5px solid var(--blue-m); }
        .pr-starter .pr-cta-btn:hover { background: var(--blue-l); }

        /* Pro */
        .pr-pro .pr-card-header { background: linear-gradient(135deg, var(--blue-l) 0%, var(--white) 100%); }
        .pr-pro .pr-plan-icon  { background: var(--blue); color: #fff; }
        .pr-pro .pr-plan-name  { color: var(--blue); }
        .pr-pro .pr-price      { color: var(--blue); }
        .pr-pro .pr-feature-check { background: var(--blue-l); color: var(--blue); }
        .pr-pro .pr-cta-btn   { background: var(--blue); color: #fff; box-shadow: 0 4px 16px rgba(26,86,219,0.25); }
        .pr-pro .pr-cta-btn:hover { background: var(--blue-h); transform: translateY(-1px); }

        /* Enterprise */
        .pr-enterprise .pr-card-header { background: linear-gradient(135deg, var(--purple-l) 0%, var(--white) 100%); }
        .pr-enterprise .pr-plan-icon  { background: var(--purple); color: #fff; }
        .pr-enterprise .pr-plan-name  { color: var(--purple); }
        .pr-enterprise .pr-feature-check { background: var(--purple-l); color: var(--purple); }
        .pr-enterprise .pr-cta-btn   { background: var(--purple); color: #fff; }
        .pr-enterprise .pr-cta-btn:hover { background: #6D28D9; transform: translateY(-1px); }

        /* ── COMPARISON TABLE ── */
        .pr-table-wrap { background: var(--white); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; }
        .pr-table-head { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; padding: 14px 20px; background: var(--bg); border-bottom: 1px solid var(--border); gap: 8px; }
        .pr-th { font-size: 0.68rem; font-weight: 700; color: var(--txt4); text-transform: uppercase; letter-spacing: 0.08em; }
        .pr-th.blue   { color: var(--blue); }
        .pr-th.purple { color: var(--purple); }
        .pr-table-row { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; padding: 13px 20px; border-bottom: 1px solid var(--border); gap: 8px; align-items: center; }
        .pr-table-row:last-child { border-bottom: none; }
        .pr-table-row:nth-child(even) { background: var(--bg); }
        .pr-table-feature { font-size: 0.79rem; font-weight: 600; color: var(--txt2); }
        .pr-table-yes { font-size: 0.75rem; color: var(--green); font-weight: 700; display: flex; align-items: center; gap: 4px; }
        .pr-table-no  { font-size: 0.75rem; color: var(--txt4); font-weight: 500; display: flex; align-items: center; gap: 4px; }
        .pr-table-val { font-size: 0.75rem; color: var(--txt2); font-weight: 600; }

        /* ── WHY SECTION ── */
        .pr-why-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .pr-why-card { background: var(--white); border: 1px solid var(--border); border-radius: 16px; padding: 26px; transition: transform 0.2s, box-shadow 0.2s; }
        .pr-why-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(0,0,0,0.07); }
        .pr-why-icon { font-size: 1.5rem; margin-bottom: 12px; }
        .pr-why-title { font-size: 0.88rem; font-weight: 800; color: var(--txt); margin-bottom: 8px; letter-spacing: -0.02em; }
        .pr-why-desc  { font-size: 0.78rem; color: var(--txt3); line-height: 1.65; font-weight: 400; }

        /* ── FAQ ── */
        .pr-faq-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .pr-faq-item { background: var(--white); border: 1px solid var(--border); border-radius: 14px; padding: 22px; }
        .pr-faq-q { font-size: 0.84rem; font-weight: 700; color: var(--txt); margin-bottom: 8px; }
        .pr-faq-a { font-size: 0.78rem; color: var(--txt3); line-height: 1.65; font-weight: 400; }

        /* ── CTA BANNER ── */
        .pr-cta {
          margin: 0 5% 80px; padding: 60px 5%;
          background: var(--txt); border-radius: 20px;
          position: relative; overflow: hidden; text-align: center;
        }
        .pr-cta::before {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse 60% 80% at 100% 50%, rgba(26,86,219,0.28) 0%, transparent 55%),
                      radial-gradient(ellipse 40% 60% at 0% 50%,   rgba(18,161,80,0.12)  0%, transparent 55%);
        }
        .pr-cta-inner { position: relative; z-index: 1; max-width: 640px; margin: 0 auto; }
        .pr-cta h2 { font-size: clamp(1.5rem,3vw,2.2rem); font-weight: 800; color: #fff; letter-spacing: -0.04em; line-height: 1.15; margin-bottom: 14px; font-family: 'Plus Jakarta Sans', sans-serif; }
        .pr-cta h2 em { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; color: #93B5FA; }
        .pr-cta p { font-size: 0.9rem; color: #94A3B8; line-height: 1.75; margin-bottom: 32px; }
        .pr-cta-btns { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
        .pr-cta-btn { padding: 12px 24px; border-radius: 10px; font-size: 0.84rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; }
        .pr-cta-btn-white { background: #fff; color: var(--txt); }
        .pr-cta-btn-white:hover { background: #F0F0F0; }
        .pr-cta-btn-outline { background: transparent; color: #888; border: 1.5px solid #2A2A2A; }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .pr-cards-grid { grid-template-columns: 1fr; max-width: 500px; }
          .pr-why-grid { grid-template-columns: 1fr 1fr; }
          .pr-faq-grid  { grid-template-columns: 1fr; }
          .pr-stats { grid-template-columns: repeat(2, 1fr); }
          .pr-table-head, .pr-table-row { grid-template-columns: 2fr 1fr 1fr; }
          .pr-table-head > *:last-child, .pr-table-row > *:last-child { display: none; }
        }
        @media (max-width: 600px) {
          .pr-cards-grid, .pr-why-grid { grid-template-columns: 1fr; max-width: 100%; }
          .pr-stats { grid-template-columns: repeat(2, 1fr); }
          .pr-trust-row .pr-tdiv { display: none; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="pr-hero">
        <div className="pr-hero-inner">
          <div className="pr-badge">
            <span className="pr-dot" />
            {" "}Simple & Transparent Pricing
          </div>
          <h1>
            Plans That <em>Scale</em><br />
            With Your Business
          </h1>
          <p className="pr-hero-sub">
            Whether you're a single owner-operator or managing a full fleet, LoadOps AI
            has a plan that fits. No hidden fees, no long-term contracts.
          </p>
          <div className="pr-toggle-note">All plans include a 7-day free trial · Cancel anytime</div>
          <div className="pr-trust-row">
            <div className="pr-trust-item"><span className="pr-trust-icon">✓</span> No setup fees</div>
            <div className="pr-tdiv" />
            <div className="pr-trust-item"><span className="pr-trust-icon">✓</span> Cancel anytime</div>
            <div className="pr-tdiv" />
            <div className="pr-trust-item"><span className="pr-trust-icon">✓</span> 7-day free trial</div>
            <div className="pr-tdiv" />
            <div className="pr-trust-item"><span className="pr-trust-icon">🔒</span> SSL Secured</div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="pr-stats">
        <div className="pr-sc"><div className="pr-sn">12.4<span>K+</span></div><div className="pr-sl">Active Users</div></div>
        <div className="pr-sc"><div className="pr-sn">$0</div><div className="pr-sl">Setup Fee</div></div>
        <div className="pr-sc"><div className="pr-sn">7<span>days</span></div><div className="pr-sl">Free Trial</div></div>
        <div className="pr-sc"><div className="pr-sn">98<span>%</span></div><div className="pr-sl">Satisfaction Rate</div></div>
      </div>

      {/* ── PRICING CARDS ── */}
      <section className="pr-section">
        <div className="pr-centered">
          <div className="pr-eyebrow green">Pricing Plans</div>
          <div className="pr-section-title">Choose your <em>plan</em></div>
          <div className="pr-section-sub">Every plan includes AI load matching, verified load board access, and your dedicated dashboard.</div>
        </div>

        <div className="pr-cards-grid">

          {/* STARTER */}
          <div className="pr-card pr-starter">
            <div className="pr-card-header">
              <div className="pr-card-top-row">
                <div className="pr-plan-icon">🚀</div>
              </div>
              <div className="pr-plan-name">Starter</div>
              <div className="pr-plan-tagline">Best for new carriers and small owner-operators getting started with AI freight.</div>
              <div className="pr-price-row">
                <div className="pr-price">$19</div>
                <div className="pr-price-per">/month</div>
              </div>
              <div className="pr-price-note">or $190/year — save 2 months</div>
            </div>
            <div className="pr-divider" style={{ margin: "0 28px" }} />
            <div className="pr-features">
              {[
                { text: "AI matched loads to inbox",    on: true },
                { text: "Basic load alerts",            on: true },
                { text: "Up to 10 daily matches",       on: true },
                { text: "Single truck profile",         on: true },
                { text: "Email support",                on: true },
                { text: "Multi-truck support",          on: false },
                { text: "Dispatcher profile access",    on: false },
                { text: "Broker load posting",          on: false },
                { text: "Advanced analytics",           on: false },
              ].map((f, i) => (
                <div key={i} className={`pr-feature${f.on ? "" : " disabled"}`}>
                  <div className="pr-feature-check">{f.on ? "✓" : "—"}</div>
                  {f.text}
                </div>
              ))}
            </div>
            <div className="pr-card-footer">
              <button className="pr-cta-btn" onClick={() => router.push("/signup?role=carrier")}>
                Start Free Trial →
              </button>
            </div>
          </div>

          {/* PRO */}
          <div className="pr-card pr-pro featured">
            <div className="pr-card-header">
              <div className="pr-card-top-row">
                <div className="pr-plan-icon">⚡</div>
                <div className="pr-popular-tag">Most Popular</div>
              </div>
              <div className="pr-plan-name">Pro</div>
              <div className="pr-plan-tagline">For growing carriers, brokers, and dispatchers who need full platform access.</div>
              <div className="pr-price-row">
                <div className="pr-price">$49</div>
                <div className="pr-price-per">/month</div>
              </div>
              <div className="pr-price-note">or $490/year — save 2 months</div>
            </div>
            <div className="pr-divider" style={{ margin: "0 28px" }} />
            <div className="pr-features">
              {[
                { text: "Unlimited AI load matching",   on: true },
                { text: "Priority load alerts",         on: true },
                { text: "Multi-truck support",          on: true },
                { text: "Dispatcher profile access",    on: true },
                { text: "Broker load posting",          on: true },
                { text: "Faster booking visibility",    on: true },
                { text: "Performance tracking",         on: true },
                { text: "Advanced analytics dashboard", on: false },
                { text: "API & integrations",           on: false },
              ].map((f, i) => (
                <div key={i} className={`pr-feature${f.on ? "" : " disabled"}`}>
                  <div className="pr-feature-check">{f.on ? "✓" : "—"}</div>
                  {f.text}
                </div>
              ))}
            </div>
            <div className="pr-card-footer">
              <button className="pr-cta-btn" onClick={() => router.push("/signup?role=carrier")}>
                Start Pro Free Trial →
              </button>
            </div>
          </div>

          {/* ENTERPRISE */}
          <div className="pr-card pr-enterprise">
            <div className="pr-card-header">
              <div className="pr-card-top-row">
                <div className="pr-plan-icon">🏢</div>
              </div>
              <div className="pr-plan-name">Enterprise</div>
              <div className="pr-plan-tagline">For fleets, brokerages, and logistics companies needing full automation at scale.</div>
              <div className="pr-price-row">
                <div className="pr-price">$99</div>
                <div className="pr-price-per">/month</div>
              </div>
              <div className="pr-price-note">or $990/year — save 2 months</div>
            </div>
            <div className="pr-divider" style={{ margin: "0 28px" }} />
            <div className="pr-features">
              {[
                { text: "Full AI automation system",    on: true },
                { text: "Unlimited trucks & users",     on: true },
                { text: "Dedicated dispatcher tools",   on: true },
                { text: "Advanced analytics dashboard", on: true },
                { text: "Broker priority distribution", on: true },
                { text: "API & integrations (Q3 2026)", on: true },
                { text: "24/7 priority support",        on: true },
                { text: "Custom onboarding",            on: true },
                { text: "Dedicated account manager",    on: true },
              ].map((f, i) => (
                <div key={i} className={`pr-feature${f.on ? "" : " disabled"}`}>
                  <div className="pr-feature-check">{f.on ? "✓" : "—"}</div>
                  {f.text}
                </div>
              ))}
            </div>
            <div className="pr-card-footer">
              <button className="pr-cta-btn" onClick={() => router.push("/contact")}>
                Contact Sales →
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section className="pr-section pr-section-alt">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="pr-centered">
            <div className="pr-eyebrow">Feature Comparison</div>
            <div className="pr-section-title">See exactly <em>what's included</em></div>
            <div className="pr-section-sub">A full breakdown of every feature across all three plans so you know exactly what you're getting.</div>
          </div>
          <div className="pr-table-wrap">
            <div className="pr-table-head">
              <div className="pr-th">Feature</div>
              <div className="pr-th">Starter</div>
              <div className="pr-th blue">Pro</div>
              <div className="pr-th purple">Enterprise</div>
            </div>
            {[
              { feature: "AI Load Matching",           s: "10/day",    p: "Unlimited", e: "Unlimited" },
              { feature: "Load Board Access",           s: "✓",         p: "✓",         e: "✓" },
              { feature: "Load Alerts (Inbox)",         s: "Basic",     p: "Priority",  e: "Priority+" },
              { feature: "Truck Profiles",              s: "1 truck",   p: "Unlimited", e: "Unlimited" },
              { feature: "Dispatcher Profile",          s: "✗",         p: "✓",         e: "✓" },
              { feature: "Broker Load Posting",         s: "✗",         p: "✓",         e: "✓" },
              { feature: "Multi-Carrier Management",    s: "✗",         p: "✓",         e: "✓" },
              { feature: "Performance Analytics",       s: "Basic",     p: "Standard",  e: "Advanced" },
              { feature: "API & Integrations",          s: "✗",         p: "✗",         e: "Q3 2026" },
              { feature: "Support",                     s: "Email",     p: "Chat + Email", e: "24/7 Priority" },
              { feature: "Onboarding",                  s: "Self-serve",p: "Self-serve", e: "Dedicated" },
            ].map((r, i) => (
              <div key={i} className="pr-table-row">
                <div className="pr-table-feature">{r.feature}</div>
                <div className={r.s === "✗" ? "pr-table-no" : "pr-table-val"}>{r.s === "✗" ? "✕ No" : r.s}</div>
                <div className={r.p === "✗" ? "pr-table-no" : "pr-table-yes"}>{r.p === "✗" ? "✕ No" : "✓ " + r.p}</div>
                <div className={r.e === "✗" ? "pr-table-no" : "pr-table-yes"}>{r.e === "✗" ? "✕ No" : "✓ " + r.e}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY LOADOPS ── */}
      <section className="pr-section">
        <div className="pr-eyebrow green">Why LoadOps AI</div>
        <div className="pr-section-title">More value, <em>less friction</em></div>
        <div className="pr-section-sub">Unlike traditional freight systems, LoadOps AI is built around automation, intelligence, and real results.</div>
        <div className="pr-why-grid">
          {[
            { icon: "🤖", title: "AI Does the Heavy Lifting",   desc: "No more manual load board searching. The AI finds, ranks, and delivers the best loads for your exact setup — automatically." },
            { icon: "🚫", title: "Zero Cold Calls",             desc: "Every interaction is digital. No broker calls, no spam, no negotiations over the phone. Accept or decline with one click." },
            { icon: "📈", title: "Real Earnings Growth",        desc: "RPM optimization, backhaul matching, and lane intelligence help carriers consistently earn more per mile over time." },
            { icon: "🎯", title: "Role-Specific Dashboards",    desc: "Carriers, brokers, and dispatchers each get a purpose-built dashboard — not a generic tool adapted for everyone." },
            { icon: "✅", title: "Verified Brokers & Carriers", desc: "Every broker is rated. Every carrier is screened. Credit scores, payment history, and reviews are all visible." },
            { icon: "🔒", title: "No Lock-In Contracts",        desc: "Start with a free trial, upgrade when you're ready, and cancel anytime with no penalties or hidden fees." },
          ].map((w, i) => (
            <div key={i} className="pr-why-card">
              <div className="pr-why-icon">{w.icon}</div>
              <div className="pr-why-title">{w.title}</div>
              <div className="pr-why-desc">{w.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="pr-section pr-section-alt">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="pr-centered">
            <div className="pr-eyebrow">FAQ</div>
            <div className="pr-section-title">Common <em>questions</em></div>
            <div className="pr-section-sub">Everything you need to know before getting started.</div>
          </div>
          <div className="pr-faq-grid">
            {[
              { q: "Is there a free trial?",            a: "Yes — every plan starts with a 7-day free trial. No credit card required. You can explore the full platform before committing." },
              { q: "Can I switch plans later?",         a: "Absolutely. You can upgrade or downgrade your plan at any time. Changes take effect on the next billing cycle." },
              { q: "What does AI load matching mean?",  a: "The system automatically finds loads that match your equipment, preferred lanes, and availability — and sends them directly to your inbox." },
              { q: "Do brokers need a separate plan?",  a: "Brokers can use the Pro or Enterprise plan. The Pro plan includes load posting and carrier matching tools tailored for brokers." },
              { q: "Can dispatchers join the platform?",a: "Yes. Dispatchers build a verified professional profile visible to carriers, who can hire them directly through the Dispatcher Hub." },
              { q: "Is there a contract or commitment?",a: "No. All plans are month-to-month. You can cancel anytime from your dashboard with no cancellation fees or penalties." },
              { q: "How fast does the AI match loads?", a: "On average, matching takes 4.2 seconds. New loads are continuously scanned and delivered to carrier inboxes in real-time." },
              { q: "What support is available?",        a: "Starter includes email support. Pro includes live chat + email. Enterprise gets 24/7 priority support and a dedicated account manager." },
            ].map((f, i) => (
              <div key={i} className="pr-faq-item">
                <div className="pr-faq-q">{f.q}</div>
                <div className="pr-faq-a">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <div className="pr-cta">
        <div className="pr-cta-inner">
          <h2>Start Moving Freight<br /><em>Smarter Today</em></h2>
          <p>
            Join 12,400+ carriers, brokers, and dispatchers already using LoadOps AI.
            7-day free trial on every plan. No credit card required.
          </p>
          <div className="pr-cta-btns">
            <button className="pr-cta-btn pr-cta-btn-white" onClick={() => router.push("/signup")}>
              Start Free Trial →
            </button>
            <button className="pr-cta-btn pr-cta-btn-outline" onClick={() => router.push("/Talk-to-us")}>
              Talk to Sales
            </button>
          </div>
        </div>
      </div>

    </main>
  );
}
