import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "LoadOps AI",
  description: "AI Freight Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: "#FFFFFF", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap');

          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          html { scroll-behavior: smooth; }
          body { font-family: 'Plus Jakarta Sans', sans-serif; background: #FFFFFF; }

          /* ── HEADER ── */
          .site-header {
            position: sticky;
            top: 0;
            z-index: 100;
            background: rgba(255, 255, 255, 0.92);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-bottom: 1px solid #E4E7ED;
            padding: 0 5%;
            display: flex;
            align-items: center;
            height: 64px;
            gap: 32px;
          }

          .header-logo {
            font-size: 1.1rem;
            font-weight: 800;
            color: #0F1520;
            letter-spacing: -0.03em;
            white-space: nowrap;
            text-decoration: none;
            font-family: 'Plus Jakarta Sans', sans-serif;
          }
          .header-logo span { color: #1A56DB; }

          .header-nav {
            display: flex;
            gap: 28px;
            flex: 1;
          }
          .header-nav a {
            font-size: 0.8rem;
            font-weight: 500;
            color: #4A5568;
            text-decoration: none;
            transition: color 0.15s;
            font-family: 'Plus Jakarta Sans', sans-serif;
          }
          .header-nav a:hover { color: #0F1520; }

          .header-actions {
            display: flex;
            gap: 8px;
            align-items: center;
          }

          .hdr-btn {
            padding: 8px 18px;
            border-radius: 9px;
            font-size: 0.8rem;
            font-weight: 600;
            border: none;
            cursor: pointer;
            font-family: 'Plus Jakarta Sans', sans-serif;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            transition: all 0.15s;
          }
          .hdr-btn-ghost {
            background: transparent;
            color: #4A5568;
            border: 1.5px solid #D0D5E0;
          }
          .hdr-btn-ghost:hover { color: #0F1520; border-color: #6B7A8D; }
          .hdr-btn-solid {
            background: #1A56DB;
            color: #ffffff;
          }
          .hdr-btn-solid:hover { background: #1446C0; }

          /* ── FOOTER ── */
          .site-footer {
            background: #F7F8FA;
            border-top: 1px solid #E4E7ED;
            padding: 48px 5% 28px;
          }

          .footer-grid {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr 1fr;
            gap: 40px;
            margin-bottom: 36px;
          }

          .footer-brand-logo {
            font-size: 1.05rem;
            font-weight: 800;
            color: #0F1520;
            letter-spacing: -0.03em;
            text-decoration: none;
            display: inline-block;
            margin-bottom: 10px;
            font-family: 'Plus Jakarta Sans', sans-serif;
          }
          .footer-brand-logo span { color: #1A56DB; }

          .footer-tagline {
            font-size: 0.77rem;
            color: #4A5568;
            line-height: 1.65;
            max-width: 220px;
          }

          .footer-col-title {
            font-size: 0.72rem;
            font-weight: 700;
            color: #3D4A5C;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            margin-bottom: 14px;
          }

          .footer-col ul {
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .footer-col ul li a {
            font-size: 0.78rem;
            color: #4A5568;
            text-decoration: none;
            transition: color 0.15s;
            font-family: 'Plus Jakarta Sans', sans-serif;
          }
          .footer-col ul li a:hover { color: #0F1520; }

          .footer-bottom {
            border-top: 1px solid #E4E7ED;
            padding-top: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 10px;
          }

          .footer-copy {
            font-size: 0.72rem;
            color: #6B7A8D;
          }

          .footer-badges {
            display: flex;
            gap: 8px;
          }
          .footer-badge {
            font-size: 0.65rem;
            font-weight: 700;
            padding: 3px 10px;
            border-radius: 4px;
            background: #EFF1F5;
            color: #4A5568;
          }

          /* ── RESPONSIVE ── */
          @media (max-width: 900px) {
            .footer-grid { grid-template-columns: 1fr 1fr; }
          }
          @media (max-width: 600px) {
            .header-nav { display: none; }
            .footer-grid { grid-template-columns: 1fr; }
          }
        `}</style>

        {/* ── HEADER ── */}
        <header className="site-header">

          <Link href="/" className="header-logo">
            Load<span>Ops</span> AI
          </Link>

          <nav className="header-nav">
            <Link href="/platform">Load Board</Link>
            <Link href="/ai-matching">AI Matching</Link>
            <Link href="/dispatcher-hub">Dispatchers Hub</Link>
            <Link href="/how-it-works">How It Works</Link>
            <Link href="/pricing">Pricing</Link>
          </nav>

          <div className="header-actions">
            <Link href="/login" className="hdr-btn hdr-btn-ghost">
              Log In
            </Link>
            <Link href="/signup" className="hdr-btn hdr-btn-solid">
              Get Started
            </Link>
          </div>

        </header>

        {/* ── PAGE CONTENT ── */}
        <main>
          {children}
        </main>

        {/* ── FOOTER ── */}
        <footer className="site-footer">

          <div className="footer-grid">

            {/* Brand */}
            <div>
              <Link href="/" className="footer-brand-logo">
                Load<span>Ops</span> AI
              </Link>
              <p className="footer-tagline">
                The only freight platform built for carriers, brokers, and dispatchers equally — powered by AI.
              </p>
            </div>

            {/* Platform */}
            <div className="footer-col">
              <div className="footer-col-title">Platform</div>
              <ul>
                <li><Link href="/platform">Load Board</Link></li>
                <li><Link href="/ai-matching">AI Matching</Link></li>
                <li><Link href="/dispatcher-hub">Dispatcher Hub</Link></li>
                <li><Link href="/carrier-tools">Carrier Tools</Link></li>
                <li><Link href="/broker-tools">Broker Tools</Link></li>
              </ul>
            </div>

            {/* Policies */}
            <div className="footer-col">
              <div className="footer-col-title">Policies</div>
              <ul>
                <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service">Terms of Service</Link></li>
                <li><Link href="/refund-policy">Refund Policy</Link></li>
                <li><Link href="/cookie-policy">Cookie Policy</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div className="footer-col">
              <div className="footer-col-title">Support</div>
              <ul>
                <li><Link href="/contact-us">Contact Us</Link></li>
                <li><Link href="/help-center">Help Center</Link></li>
                <li><a href="mailto:support@loadopsai.com">Email Support</a></li>
                <li><a href="/assistance">24/7 Assistance</a></li>
              </ul>
            </div>

          </div>

          <div className="footer-bottom">
            <div className="footer-copy">© 2026 LoadOps AI. All rights reserved.</div>
            <div className="footer-badges">
              <div className="footer-badge">✓ SOC 2 Compliant</div>
              <div className="footer-badge">🔒 SSL Secured</div>
              <div className="footer-badge">FMCSA Verified</div>
            </div>
          </div>

        </footer>

      </body>
    </html>
  );
}
