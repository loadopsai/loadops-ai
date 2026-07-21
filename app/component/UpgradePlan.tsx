"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type UpgradePlanProps = {
  open: boolean;
  onClose: () => void;
  currentPlan: string;
  recommendedPlan: string;
  title: string;
  description: string;
  upgradeUrl: string;
  features?: string[];
  viewAllPlansUrl?: string;
};

export default function UpgradePlan({
  open,
  onClose,
  currentPlan,
  recommendedPlan,
  title,
  description,
  upgradeUrl,
  features = [
    "AI load matching & inbox alerts",
    "Unlimited load posting & booking",
    "Live rate intelligence by lane",
    "Broker credit scores & history",
    "Direct chat & call with brokers",
  ],
  viewAllPlansUrl = "/pricing",
}: UpgradePlanProps) {
  const router = useRouter();

  // lock background scroll + close on Escape while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="up-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

        .up-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(15, 21, 32, 0.55);
          backdrop-filter: blur(3px);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: up-fade-in 0.18s ease;
        }
        @keyframes up-fade-in { from { opacity: 0; } to { opacity: 1; } }

        .up-modal {
          width: 100%; max-width: 440px;
          background: #FFFFFF;
          border-radius: 22px;
          padding: 38px 36px 32px;
          box-shadow: 0 30px 70px rgba(15,21,32,0.22);
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #0F1520;
          animation: up-rise-in 0.22s ease;
          position: relative;
        }
        @keyframes up-rise-in {
          from { opacity: 0; transform: translateY(14px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .up-close {
          position: absolute; top: 16px; right: 16px;
          width: 28px; height: 28px; border-radius: 8px;
          border: none; background: transparent;
          color: #9CA3AF; font-size: 0.85rem; font-weight: 700;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: all 0.15s;
        }
        .up-close:hover { background: #F3F4F6; color: #374151; }

        /* ── BRAND LOCKUP ── */
        .up-brand { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 22px; }
        .up-brand-badge {
          width: 26px; height: 26px; border-radius: 8px;
          background: #2563EB; color: #fff; font-weight: 800; font-size: 0.8rem;
          display: flex; align-items: center; justify-content: center;
        }
        .up-brand-text { font-size: 0.95rem; font-weight: 800; color: #0F1520; letter-spacing: -0.01em; }
        .up-brand-text span { color: #2563EB; }

        /* ── LOCK ICON ── */
        .up-lock {
          width: 60px; height: 60px; margin: 0 auto 16px;
          background: #F3F4F6; border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.6rem;
        }

        /* ── PRO BADGE ── */
        .up-badge-row { display: flex; justify-content: center; margin-bottom: 16px; }
        .up-badge {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 0.66rem; font-weight: 800; letter-spacing: 0.05em;
          padding: 5px 12px; border-radius: 20px;
          background: #EBF1FD; color: #2563EB;
        }

        .up-title {
          text-align: center; font-weight: 800; font-size: 1.25rem;
          letter-spacing: -0.02em; line-height: 1.25; margin-bottom: 10px; color: #0F1520;
        }

        .up-desc {
          text-align: center; color: #6B7280; font-size: 0.84rem; line-height: 1.7; margin-bottom: 22px;
        }
        .up-desc b { color: #0F1520; font-weight: 700; }

        .up-divider { height: 1px; background: #EEF0F4; margin-bottom: 20px; }

        /* ── FEATURE LIST ── */
        .up-features { list-style: none; margin: 0 0 26px; padding: 0; display: flex; flex-direction: column; gap: 13px; }
        .up-feature-item {
          display: flex; align-items: center; gap: 10px;
          font-size: 0.83rem; color: #374151; font-weight: 500; line-height: 1.4;
        }
        .up-feature-check {
          flex-shrink: 0; width: 18px; height: 18px; border-radius: 5px;
          background: #2563EB; color: #fff; font-size: 0.62rem; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
        }

        /* ── ACTIONS ── */
        .up-btn-primary {
          width: 100%; border: none; border-radius: 12px; padding: 14px;
          font-weight: 700; font-size: 0.92rem; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s;
          background: #2563EB; color: #fff; margin-bottom: 14px;
          box-shadow: 0 1px 3px rgba(37,99,235,0.3), 0 4px 16px rgba(37,99,235,0.22);
        }
        .up-btn-primary:hover { background: #1D4ED8; transform: translateY(-1px); box-shadow: 0 8px 22px rgba(37,99,235,0.3); }

        .up-view-plans {
          display: block; width: 100%; text-align: center;
          background: none; border: none; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.78rem; font-weight: 600; color: #9CA3AF;
          transition: color 0.15s;
        }
        .up-view-plans:hover { color: #4B5563; }

        @media (max-width: 480px) {
          .up-modal { padding: 30px 24px 26px; border-radius: 18px; }
        }
      `}</style>

      <div className="up-modal" role="dialog" aria-modal="true" aria-labelledby="up-title-heading">
        <button className="up-close" onClick={onClose} aria-label="Close">✕</button>

        {/* BRAND */}
        <div className="up-brand">
          <div className="up-brand-badge">L</div>
          <div className="up-brand-text">Load<span>Ops</span> AI</div>
        </div>

        {/* LOCK ICON */}
        <div className="up-lock">🔒</div>

        {/* PRO BADGE */}
        <div className="up-badge-row">
          <span className="up-badge">⚡ {recommendedPlan.toUpperCase()} FEATURE</span>
        </div>

        <h2 id="up-title-heading" className="up-title">{title}</h2>
        <p className="up-desc">{description}</p>

        <div className="up-divider" />

        {/* FEATURE CHECKLIST */}
        {features.length > 0 && (
          <ul className="up-features">
            {features.map((f, i) => (
              <li key={i} className="up-feature-item">
                <span className="up-feature-check">✓</span>
                {f}
              </li>
            ))}
          </ul>
        )}

        <button className="up-btn-primary" onClick={() => router.push(upgradeUrl)}>
          Upgrade to {recommendedPlan} →
        </button>

        <button className="up-view-plans" onClick={() => router.push(viewAllPlansUrl)}>
          ← View all plans
        </button>
      </div>
    </div>
  );
}
