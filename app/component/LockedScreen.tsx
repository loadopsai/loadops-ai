"use client";

import Link from "next/link";

export function LockedScreen({
  name,
  plan,
  url,
}: {
  name: string;
  plan: string;
  url: string;
}) {
  const planColor =
    plan.toLowerCase().includes("pro")
      ? { bg: "#1A56DB", light: "#EBF1FD", text: "#1A56DB" }
      : plan.toLowerCase().includes("enterprise")
      ? { bg: "#7C3AED", light: "#EDE9FE", text: "#7C3AED" }
      : { bg: "#12A150", light: "#E6F7EE", text: "#12A150" };

  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#F7F8FA",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        padding: "40px 20px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes lockBounce {
          0%   { transform: scale(0.8) rotate(-8deg); opacity: 0; }
          60%  { transform: scale(1.1) rotate(4deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }

        .ls-card {
          background: #fff;
          border: 1px solid #E4E7ED;
          border-radius: 20px;
          padding: 44px 36px;
          max-width: 420px;
          width: 100%;
          text-align: center;
          box-shadow: 0 8px 32px rgba(0,0,0,0.07);
          animation: fadeUp 0.5s ease both;
        }

        .ls-logo {
          font-size: 0.95rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-decoration: none;
        }

        .ls-lock-wrap {
          width: 72px;
          height: 72px;
          border-radius: 18px;
          background: #F7F8FA;
          border: 1px solid #E4E7ED;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 2rem;
          animation: lockBounce 0.6s 0.1s ease both;
        }

        .ls-plan-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.65rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 16px;
        }

        .ls-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0F1520;
          letter-spacing: -0.03em;
          margin-bottom: 10px;
          line-height: 1.2;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .ls-desc {
          font-size: 0.83rem;
          color: #6B7A8D;
          line-height: 1.65;
          margin-bottom: 28px;
          font-weight: 400;
        }
        .ls-desc strong { color: #3D4A5C; font-weight: 700; }

        .ls-divider { height: 1px; background: #E4E7ED; margin-bottom: 24px; }

        .ls-features {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 28px;
          text-align: left;
        }
        .ls-feat {
          display: flex;
          align-items: center;
          gap: 9px;
          font-size: 0.78rem;
          color: #3D4A5C;
          font-weight: 500;
        }
        .ls-feat-dot {
          width: 18px;
          height: 18px;
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.6rem;
          font-weight: 800;
          flex-shrink: 0;
          color: #fff;
        }

        .ls-upgrade-btn {
          display: block;
          width: 100%;
          padding: 13px;
          border-radius: 11px;
          font-size: 0.88rem;
          font-weight: 700;
          color: #fff;
          text-decoration: none;
          text-align: center;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.15s;
          margin-bottom: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.15);
        }
        .ls-upgrade-btn:hover { opacity: 0.9; transform: translateY(-1px); }

        .ls-back-link {
          font-size: 0.76rem;
          color: #6B7A8D;
          text-decoration: none;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: color 0.15s;
        }
        .ls-back-link:hover { color: #0F1520; }
      `}</style>

      <div className="ls-card">

        {/* LOADOPS AI LOGO */}
        <Link href="/" className="ls-logo">
          <span style={{
            width: 24, height: 24, borderRadius: 6,
            background: "#1A56DB", display: "flex",
            alignItems: "center", justifyContent: "center",
            fontSize: "0.7rem", color: "#fff", fontWeight: 800,
          }}>L</span>
          <span style={{ color: "#0F1520" }}>Load<span style={{ color: "#1A56DB" }}>Ops</span> AI</span>
        </Link>

        {/* LOCK ICON */}
        <div className="ls-lock-wrap">🔒</div>

        {/* PLAN BADGE */}
        <div
          className="ls-plan-pill"
          style={{ background: planColor.light, color: planColor.text }}
        >
          ⚡ {plan} Feature
        </div>

        {/* TITLE */}
        <div className="ls-title">{name} is locked</div>

        {/* DESCRIPTION */}
        <div className="ls-desc">
          This feature requires the <strong>{plan}</strong> plan.
          Upgrade to unlock it and get full access to the LoadOps AI platform.
        </div>

        <div className="ls-divider" />

        {/* WHAT YOU UNLOCK */}
        <div className="ls-features">
          {[
            { icon: "🤖", label: "AI load matching & inbox alerts"   },
            { icon: "📦", label: "Unlimited load posting & booking"   },
            { icon: "📊", label: "Live rate intelligence by lane"     },
            { icon: "⭐", label: "Broker credit scores & history"     },
            { icon: "💬", label: "Direct chat & call with brokers"    },
          ].map((f, i) => (
            <div key={i} className="ls-feat">
              <div className="ls-feat-dot" style={{ background: planColor.bg }}>
                ✓
              </div>
              {f.label}
            </div>
          ))}
        </div>

        {/* UPGRADE BUTTON */}
        <a
          href={url}
          className="ls-upgrade-btn"
          style={{ background: planColor.bg }}
        >
          Upgrade to {plan} →
        </a>

        {/* BACK LINK */}
        <Link href="/pricing" className="ls-back-link">
          ← View all plans
        </Link>

      </div>
    </div>
  );
}
