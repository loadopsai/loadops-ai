import type { Metadata, Viewport } from "next";
import "./globals.css";
import Link from "next/link";
import Header from "./component/header";
import GlobalCallProvider from "@/app/component/GlobalCallProvider";
import Script from "next/script";
import MetaPixelPageView from "./component/MetaPixelPageView";

// ✅ This is the CORRECT way to set viewport in Next.js App Router
// Adding <meta viewport> inside <head> JSX does NOT work in production
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "LoadOps AI",
  description: "AI Freight Platform",
};
const META_PIXEL_ID = "940364195777525";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <Script
  id="meta-pixel"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');

      fbq('init', '${940364195777525}');
      fbq('track', 'PageView');
    `,
  }}
/>

<MetaPixelPageView />
        <GlobalCallProvider>
        <Header />

        <main>{children}</main>

        <footer style={{ background: "#F7F8FA", borderTop: "1px solid #E4E7ED", padding: "48px 5% 28px" }}>
          <div className="footer-grid">

            <div>
              <Link href="/" style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0F1520", letterSpacing: "-0.03em", textDecoration: "none", display: "inline-block", marginBottom: 10, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Load<span style={{ color: "#1A56DB" }}>Ops</span> AI
              </Link>
              <p style={{ fontSize: "0.77rem", color: "#4A5568", lineHeight: 1.65, maxWidth: 220 }}>
                The only freight platform built for carriers, brokers, and dispatchers equally — powered by AI.
              </p>
            </div>

            {[
              { title: "Platform", links: [
                { href: "/platform",       label: "Load Board"      },
                { href: "/ai-matching",    label: "AI Matching"     },
                { href: "/dispatcher-hub", label: "Dispatcher Hub"  },
                { href: "/carrier-tools",  label: "Carrier Tools"   },
                { href: "/broker-tools",   label: "Broker Tools"    },
              ]},
              { title: "Policies", links: [
                { href: "/privacy-policy",   label: "Privacy Policy"   },
                { href: "/terms-of-service", label: "Terms of Service" },
                { href: "/refund-policy",    label: "Refund Policy"    },
                { href: "/cookie-policy",    label: "Cookie Policy"    },
              ]},
              { title: "Support", links: [
                { href: "/contact-us",     label: "Contact Us"      },
                { href: "/help-center", label: "Help Center"     },
                { href: "mailto:support@loadopsai.co", label: "Email Support" },
                { href: "/assistance",  label: "24/7 Assistance" },
              ]},
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#3D4A5C", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
                  {col.title}
                </div>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                  {col.links.map(l => (
                    <li key={l.href}>
                      <Link href={l.href} style={{ fontSize: "0.78rem", color: "#4A5568", textDecoration: "none", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid #E4E7ED", paddingTop: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <span style={{ fontSize: "0.72rem", color: "#6B7A8D" }}>© 2026 LoadOps AI. All rights reserved.</span>
            <div style={{ display: "flex", gap: 8 }}>
              {["✓ SOC 2", "🔒 SSL", "FMCSA"].map(b => (
                <span key={b} style={{ fontSize: "0.65rem", fontWeight: 700, padding: "3px 10px", borderRadius: 4, background: "#EFF1F5", color: "#4A5568" }}>{b}</span>
              ))}
            </div>
          </div>
        </footer>

        <style>{`
          .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 36px; }
          @media (max-width: 900px) { .footer-grid { grid-template-columns: 1fr 1fr; } }
          @media (max-width: 600px) { .footer-grid { grid-template-columns: 1fr; } }
        `}</style>
</GlobalCallProvider>
      </body>
    </html>
  );
}
