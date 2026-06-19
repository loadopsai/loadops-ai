"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Header.module.css";

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
      <header className={styles.header}>

        <Link href="/" className={styles.logo} onClick={() => setOpen(false)}>
          Load<span>Ops</span> AI
        </Link>

        {/* Desktop nav */}
        <nav className={styles.nav}>
          {navLinks.map(l => (
            <Link key={l.href} href={l.href}>{l.label}</Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className={styles.actions}>
          <Link href="/login"  className={styles.loginBtn}>Log In</Link>
          <Link href="/signup" className={styles.signupBtn}>Get Started</Link>
        </div>

        {/* Hamburger — shown via CSS at mobile */}
        <button
          className={styles.hamburger}
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span className={styles.bar} style={{
            transform: open ? "translateY(7.5px) rotate(45deg)" : "none",
          }} />
          <span className={styles.bar} style={{
            opacity: open ? 0 : 1,
          }} />
          <span className={styles.bar} style={{
            transform: open ? "translateY(-7.5px) rotate(-45deg)" : "none",
          }} />
        </button>

      </header>

      {/* Mobile drawer */}
      <div className={`${styles.drawer}${open ? ` ${styles.drawerOpen}` : ""}`}>
        {navLinks.map(l => (
          <Link
            key={l.href}
            href={l.href}
            className={styles.drawerLink}
            onClick={() => setOpen(false)}
          >
            {l.label}
          </Link>
        ))}
        <div className={styles.drawerDivider} />
        <div className={styles.drawerBtns}>
          <Link href="/login"  className={styles.drawerLogin}  onClick={() => setOpen(false)}>Log In</Link>
          <Link href="/signup" className={styles.drawerSignup} onClick={() => setOpen(false)}>Get Started</Link>
        </div>
      </div>
    </>
  );
}
