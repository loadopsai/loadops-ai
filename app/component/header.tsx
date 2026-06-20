"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/platform",       label: "Load Board"     },
  { href: "/ai-matching",    label: "AI Matching"    },
  { href: "/dispatcher-hub", label: "Dispatcher Hub" },
  { href: "/how-it-works",   label: "How It Works"   },
  { href: "/pricing",        label: "Pricing"        },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <style>{`
        .hd { position:sticky;top:0;z-index:100;background:rgba(255,255,255,.96);backdrop-filter:blur(14px);border-bottom:1px solid #E4E7ED;padding:0 5%;height:64px;display:flex;align-items:center;gap:24px;font-family:'Plus Jakarta Sans',sans-serif; }
        .hd-logo { font-size:1.1rem;font-weight:800;color:#0F1520;letter-spacing:-.03em;text-decoration:none;flex-shrink:0; }
        .hd-logo span { color:#1A56DB; }
        .hd-nav { display:flex;gap:28px;flex:1; }
        .hd-nav a { font-size:.8rem;font-weight:500;color:#4A5568;text-decoration:none;white-space:nowrap; }
        .hd-nav a:hover { color:#0F1520; }
        .hd-actions { display:flex;gap:8px;align-items:center;flex-shrink:0; }
        .hd-login { padding:8px 18px;border-radius:9px;font-size:.8rem;font-weight:600;color:#4A5568;border:1.5px solid #D0D5E0;text-decoration:none;background:transparent;font-family:'Plus Jakarta Sans',sans-serif; }
        .hd-signup { padding:8px 18px;border-radius:9px;font-size:.8rem;font-weight:600;color:#fff;background:#1A56DB;text-decoration:none;font-family:'Plus Jakarta Sans',sans-serif; }
        .hd-burger { display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:6px;border-radius:8px;margin-left:auto;flex-shrink:0; }
        .hd-bar { display:block;width:22px;height:2.5px;background:#0F1520;border-radius:2px;transition:all .22s ease;transform-origin:center; }
        .hd-drawer { display:none;position:fixed;top:64px;left:0;right:0;z-index:99;background:#fff;border-bottom:1px solid #E4E7ED;box-shadow:0 8px 24px rgba(0,0,0,.09);padding:10px 5% 18px;flex-direction:column;gap:2px; }
        .hd-drawer.open { display:flex; }
        .hd-dlink { padding:13px 12px;border-radius:10px;font-size:.92rem;font-weight:600;color:#3D4A5C;text-decoration:none;display:block;font-family:'Plus Jakarta Sans',sans-serif; }
        .hd-dlink:hover { background:#EBF1FD;color:#1A56DB; }
        .hd-ddiv { height:1px;background:#E4E7ED;margin:8px 0; }
        .hd-dbtns { display:flex;gap:8px; }
        .hd-dlogin { flex:1;padding:11px 0;border-radius:9px;font-size:.84rem;font-weight:700;color:#3D4A5C;background:#F7F8FA;border:1.5px solid #D0D5E0;text-decoration:none;display:flex;align-items:center;justify-content:center;font-family:'Plus Jakarta Sans',sans-serif; }
        .hd-dsignup { flex:1;padding:11px 0;border-radius:9px;font-size:.84rem;font-weight:700;color:#fff;background:#1A56DB;text-decoration:none;display:flex;align-items:center;justify-content:center;font-family:'Plus Jakarta Sans',sans-serif; }

        @media (max-width: 768px) {
          .hd-nav     { display: none !important; }
          .hd-actions { display: none !important; }
          .hd-burger  { display: flex !important; }
        }
      `}</style>

      <header className="hd">
        <Link href="/" className="hd-logo" onClick={() => setOpen(false)}>
          Load<span>Ops</span> AI
        </Link>

        <nav className="hd-nav">
          {navLinks.map(l => <Link key={l.href} href={l.href}>{l.label}</Link>)}
        </nav>

        <div className="hd-actions">
          <Link href="/login"  className="hd-login">Log In</Link>
          <Link href="/signup" className="hd-signup">Get Started</Link>
        </div>

        <button className="hd-burger" onClick={() => setOpen(o => !o)} aria-label="Toggle menu">
          <span className="hd-bar" style={{ transform: open ? "translateY(7.5px) rotate(45deg)" : "none" }} />
          <span className="hd-bar" style={{ opacity: open ? 0 : 1 }} />
          <span className="hd-bar" style={{ transform: open ? "translateY(-7.5px) rotate(-45deg)" : "none" }} />
        </button>
      </header>

      <div className={`hd-drawer${open ? " open" : ""}`}>
        {navLinks.map(l => (
          <Link key={l.href} href={l.href} className="hd-dlink" onClick={() => setOpen(false)}>
            {l.label}
          </Link>
        ))}
        <div className="hd-ddiv" />
        <div className="hd-dbtns">
          <Link href="/login"  className="hd-dlogin"  onClick={() => setOpen(false)}>Log In</Link>
          <Link href="/signup" className="hd-dsignup" onClick={() => setOpen(false)}>Get Started</Link>
        </div>
      </div>
    </>
  );
}
