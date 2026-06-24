"use client";

import { useRouter } from "next/navigation";

export default function CookiePolicy() {
  const router = useRouter();
  const lastUpdated = "May 27, 2026";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#F7F8FA",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: "#0F1520",
      }}
    >
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
          --blue-l:   #EBF1FD;
          --blue-m:   #C7D9FA;
          --green:    #12A150;
          --green-l:  #E6F7EE;
          --purple:   #7C3AED;
          --purple-l: #EDE9FE;
          --amber:    #D97706;
          --amber-l:  #FEF3C7;
          --red:      #DC2626;
          --red-l:    #FEF2F2;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html {
          scroll-behavior: smooth;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }

        /* HERO */

        .cp-hero {
          padding: 64px 5% 52px;
          background: var(--white);
          border-bottom: 1px solid var(--border);
          position: relative;
          overflow: hidden;
        }

        .cp-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(ellipse 80% 60% at 50% -10%, rgba(26,86,219,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 95% 80%, rgba(124,58,237,0.03) 0%, transparent 55%);
        }

        .cp-hero-inner {
          position: relative;
          z-index: 1;
          max-width: 820px;
        }

        .cp-eyebrow {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--blue);
          margin-bottom: 14px;
        }

        .cp-eyebrow::before {
          content: '';
          width: 20px;
          height: 2px;
          background: var(--blue);
          border-radius: 1px;
        }

        .cp-title {
          font-size: clamp(2rem, 4vw, 2.8rem);
          font-weight: 800;
          letter-spacing: -0.045em;
          color: var(--txt);
          line-height: 1.06;
          margin-bottom: 14px;
        }

        .cp-title em {
          font-family: 'Instrument Serif', serif;
          font-style: italic;
          font-weight: 400;
          color: var(--blue);
        }

        .cp-sub {
          font-size: 0.92rem;
          color: var(--txt3);
          line-height: 1.7;
          max-width: 620px;
          margin-bottom: 22px;
        }

        .cp-meta-row {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .cp-meta-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 600;
        }

        .cp-meta-pill.date {
          background: var(--blue-l);
          color: var(--blue);
          border: 1px solid var(--blue-m);
        }

        .cp-meta-pill.secure {
          background: var(--green-l);
          color: var(--green);
          border: 1px solid #A7F3C8;
        }

        .cp-meta-pill.cookies {
          background: var(--amber-l);
          color: var(--amber);
          border: 1px solid #FDE68A;
        }

        /* LAYOUT */

        .cp-layout {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 40px;
          max-width: 1100px;
          margin: 0 auto;
          padding: 40px 5% 80px;
          align-items: start;
        }

        /* TOC */

        .cp-toc {
          position: sticky;
          top: 88px;
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
        }

        .cp-toc-header {
          padding: 16px 18px;
          border-bottom: 1px solid var(--border);
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--txt);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          background: var(--bg);
        }

        .cp-toc-list {
          display: flex;
          flex-direction: column;
          padding: 8px 0;
        }

        .cp-toc-item {
          padding: 8px 18px;
          font-size: 0.76rem;
          color: var(--txt3);
          text-decoration: none;
          font-weight: 500;
          transition: all 0.15s;
          border-left: 2px solid transparent;
        }

        .cp-toc-item:hover {
          color: var(--blue);
          background: var(--blue-l);
          border-left-color: var(--blue);
        }

        .cp-toc-num {
          font-size: 0.62rem;
          color: var(--txt4);
          font-weight: 700;
          margin-right: 6px;
        }

        /* CONTENT */

        .cp-content {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .cp-section {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          animation: fadeUp 0.5s ease both;
        }

        .cp-section-header {
          padding: 20px 26px 16px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .cp-section-icon {
          width: 36px;
          height: 36px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          flex-shrink: 0;
        }

        .cp-section-num {
          font-size: 0.62rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 4px;
          background: var(--blue-l);
          color: var(--blue);
          letter-spacing: 0.06em;
        }

        .cp-section-title {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--txt);
          letter-spacing: -0.02em;
          flex: 1;
        }

        .cp-section-body {
          padding: 20px 26px 24px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .cp-p {
          font-size: 0.84rem;
          color: var(--txt3);
          line-height: 1.78;
        }

        .cp-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .cp-list-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.82rem;
          color: var(--txt3);
          line-height: 1.7;
        }

        .cp-list-item::before {
          content: '•';
          color: var(--blue);
          font-weight: 800;
        }

        .cp-check-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .cp-check-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.82rem;
          color: var(--txt3);
          line-height: 1.65;
        }

        .cp-check-item::before {
          content: '✓';
          width: 18px;
          height: 18px;
          border-radius: 5px;
          background: var(--green-l);
          color: var(--green);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
          font-weight: 800;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .cp-highlight {
          border-radius: 10px;
          padding: 14px 16px;
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }

        .cp-highlight.blue {
          background: var(--blue-l);
          border: 1px solid var(--blue-m);
        }

        .cp-highlight.green {
          background: var(--green-l);
          border: 1px solid #A7F3C8;
        }

        .cp-highlight.amber {
          background: var(--amber-l);
          border: 1px solid #FDE68A;
        }

        .cp-highlight.red {
          background: var(--red-l);
          border: 1px solid #FECACA;
        }

        .cp-highlight-icon {
          font-size: 1rem;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .cp-highlight-text {
          font-size: 0.8rem;
          line-height: 1.65;
          font-weight: 500;
        }

        .cp-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .cp-info-card {
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 14px 16px;
        }

        .cp-info-card-title {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--txt);
          margin-bottom: 5px;
        }

        .cp-info-card-desc {
          font-size: 0.75rem;
          color: var(--txt3);
          line-height: 1.55;
        }

        .cp-contact-card {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 28px;
          text-align: center;
        }

        .cp-contact-icon {
          font-size: 2rem;
          margin-bottom: 12px;
        }

        .cp-contact-title {
          font-size: 1rem;
          font-weight: 800;
          color: var(--txt);
          margin-bottom: 8px;
        }

        .cp-contact-sub {
          font-size: 0.82rem;
          color: var(--txt3);
          line-height: 1.65;
          margin-bottom: 20px;
        }

        .cp-contact-btns {
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .cp-contact-btn {
          padding: 10px 22px;
          border-radius: 9px;
          font-size: 0.8rem;
          font-weight: 700;
          border: none;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.15s;
        }

        .cp-contact-btn.primary {
          background: var(--blue);
          color: white;
        }

        .cp-contact-btn.primary:hover {
          background: #1446C0;
          transform: translateY(-1px);
        }

        .cp-contact-btn.ghost {
          background: var(--bg2);
          color: var(--txt2);
          border: 1.5px solid var(--border2);
        }

        .cp-contact-btn.ghost:hover {
          border-color: var(--blue-m);
          color: var(--blue);
        }

        @media (max-width: 900px) {
          .cp-layout {
            grid-template-columns: 1fr;
          }

          .cp-toc {
            position: static;
          }

          .cp-grid-2 {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .cp-hero {
            padding: 40px 4% 36px;
          }

          .cp-layout {
            padding: 24px 4% 60px;
            gap: 20px;
          }

          .cp-section-body {
            padding: 16px 18px 20px;
          }

          .cp-section-header {
            padding: 16px 18px 12px;
          }
        }

      `}</style>

      {/* HERO */}

      <section className="cp-hero">

        <div className="cp-hero-inner">

          <div className="cp-eyebrow">
            Website Data & Tracking
          </div>

          <div className="cp-title">
            Cookie <em>Policy</em>
          </div>

          <p className="cp-sub">
            This Cookie Policy explains how LoadOps AI uses cookies,
            analytics technologies, and tracking tools across our
            AI freight platform, dashboards, and web services.
          </p>

          <div className="cp-meta-row">

            <div className="cp-meta-pill date">
              📅 Last Updated: {lastUpdated}
            </div>

            <div className="cp-meta-pill secure">
              🔒 Secure Platform
            </div>

            <div className="cp-meta-pill cookies">
              🍪 Cookie Management
            </div>

          </div>

        </div>

      </section>

      {/* LAYOUT */}

      <div className="cp-layout">

        {/* TOC */}

        <nav className="cp-toc">

          <div className="cp-toc-header">
            Table of Contents
          </div>

          <div className="cp-toc-list">

            {[
              { num: "01", label: "What Are Cookies", href: "#what" },
              { num: "02", label: "Why We Use Cookies", href: "#why" },
              { num: "03", label: "Types of Cookies", href: "#types" },
              { num: "04", label: "Analytics & Tracking", href: "#analytics" },
              { num: "05", label: "Third-Party Cookies", href: "#thirdparty" },
              { num: "06", label: "Managing Cookies", href: "#manage" },
              { num: "07", label: "Security & Privacy", href: "#security" },
              { num: "08", label: "Policy Updates", href: "#updates" },
              { num: "09", label: "Contact Us", href: "#contact" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="cp-toc-item"
              >
                <span className="cp-toc-num">
                  {item.num}
                </span>

                {item.label}
              </a>
            ))}

          </div>

        </nav>

        {/* CONTENT */}

        <div className="cp-content">

          <div className="cp-highlight blue">

            <span className="cp-highlight-icon">
              ℹ️
            </span>

            <div className="cp-highlight-text">
              By continuing to use LoadOps AI services,
              dashboards, and freight tools, you consent
              to the use of cookies and similar technologies
              as described in this policy.
            </div>

          </div>

          {/* SECTION 1 */}

          <div className="cp-section" id="what">

            <div className="cp-section-header">

              <div
                className="cp-section-icon"
                style={{ background: "#EBF1FD" }}
              >
                🍪
              </div>

              <div className="cp-section-num">
                01
              </div>

              <div className="cp-section-title">
                What Are Cookies
              </div>

            </div>

            <div className="cp-section-body">

              <p className="cp-p">
                Cookies are small text files stored on your device
                when you visit a website. They help websites remember
                user preferences, improve performance, maintain sessions,
                and provide secure functionality.
              </p>

              <p className="cp-p">
                LoadOps AI uses cookies and related technologies
                to improve user experience across the platform.
              </p>

            </div>

          </div>

          {/* SECTION 2 */}

          <div className="cp-section" id="why">

            <div className="cp-section-header">

              <div
                className="cp-section-icon"
                style={{ background: "#E6F7EE" }}
              >
                ⚙️
              </div>

              <div className="cp-section-num">
                02
              </div>

              <div className="cp-section-title">
                Why We Use Cookies
              </div>

            </div>

            <div className="cp-section-body">

              <div className="cp-check-list">

                {[
                  "Maintain secure login sessions and account authentication.",
                  "Remember dashboard preferences and saved filters.",
                  "Improve website speed and performance.",
                  "Analyze platform usage and feature engagement.",
                  "Protect against fraud and unauthorized access attempts.",
                  "Support AI-powered recommendations and personalized experiences.",
                ].map((item, i) => (
                  <div key={i} className="cp-check-item">
                    {item}
                  </div>
                ))}

              </div>

            </div>

          </div>

          {/* SECTION 3 */}

          <div className="cp-section" id="types">

            <div className="cp-section-header">

              <div
                className="cp-section-icon"
                style={{ background: "#EDE9FE" }}
              >
                📂
              </div>

              <div className="cp-section-num">
                03
              </div>

              <div className="cp-section-title">
                Types of Cookies We Use
              </div>

            </div>

            <div className="cp-section-body">

              <div className="cp-grid-2">

                {[
                  {
                    title: "Essential Cookies",
                    desc: "Required for core website functionality, authentication, and account security."
                  },
                  {
                    title: "Performance Cookies",
                    desc: "Help improve loading speed, responsiveness, and system reliability."
                  },
                  {
                    title: "Preference Cookies",
                    desc: "Store user settings such as themes, filters, and dashboard preferences."
                  },
                  {
                    title: "Analytics Cookies",
                    desc: "Track platform usage and user interactions for improvement purposes."
                  },
                ].map((card, i) => (
                  <div key={i} className="cp-info-card">

                    <div className="cp-info-card-title">
                      {card.title}
                    </div>

                    <div className="cp-info-card-desc">
                      {card.desc}
                    </div>

                  </div>
                ))}

              </div>

            </div>

          </div>

          {/* SECTION 4 */}

          <div className="cp-section" id="analytics">

            <div className="cp-section-header">

              <div
                className="cp-section-icon"
                style={{ background: "#FEF3C7" }}
              >
                📊
              </div>

              <div className="cp-section-num">
                04
              </div>

              <div className="cp-section-title">
                Analytics & Tracking
              </div>

            </div>

            <div className="cp-section-body">

              <p className="cp-p">
                LoadOps AI may use analytics tools to understand
                how users interact with our freight platform,
                dashboards, and AI systems.
              </p>

              <div className="cp-list">

                {[
                  "Page visits and navigation behavior.",
                  "Feature engagement and dashboard activity.",
                  "Device type and browser information.",
                  "Session duration and interaction patterns.",
                  "Performance metrics and error monitoring.",
                ].map((item, i) => (
                  <div key={i} className="cp-list-item">
                    {item}
                  </div>
                ))}

              </div>

              <div className="cp-highlight amber">

                <span className="cp-highlight-icon">
                  ⚠️
                </span>

                <div className="cp-highlight-text">
                  Analytics information is used solely
                  to improve platform functionality,
                  security, and user experience.
                </div>

              </div>

            </div>

          </div>

          {/* SECTION 5 */}

          <div className="cp-section" id="thirdparty">

            <div className="cp-section-header">

              <div
                className="cp-section-icon"
                style={{ background: "#EBF1FD" }}
              >
                🔗
              </div>

              <div className="cp-section-num">
                05
              </div>

              <div className="cp-section-title">
                Third-Party Cookies
              </div>

            </div>

            <div className="cp-section-body">

              <p className="cp-p">
                Some third-party services integrated into
                LoadOps AI may place cookies on your device.
              </p>

              <div className="cp-list">

                {[
                  "Authentication and secure login providers.",
                  "Payment processing systems.",
                  "Cloud hosting infrastructure services.",
                  "Analytics and monitoring tools.",
                  "Embedded mapping and communication services.",
                ].map((item, i) => (
                  <div key={i} className="cp-list-item">
                    {item}
                  </div>
                ))}

              </div>

            </div>

          </div>

          {/* SECTION 6 */}

          <div className="cp-section" id="manage">

            <div className="cp-section-header">

              <div
                className="cp-section-icon"
                style={{ background: "#E6F7EE" }}
              >
                🛠️
              </div>

              <div className="cp-section-num">
                06
              </div>

              <div className="cp-section-title">
                Managing Cookies
              </div>

            </div>

            <div className="cp-section-body">

              <p className="cp-p">
                You can manage or disable cookies through
                your browser settings at any time.
              </p>

              <div className="cp-check-list">

                {[
                  "Block all cookies through browser settings.",
                  "Delete previously stored cookies.",
                  "Disable non-essential analytics cookies.",
                  "Control permissions for specific websites.",
                ].map((item, i) => (
                  <div key={i} className="cp-check-item">
                    {item}
                  </div>
                ))}

              </div>

              <div className="cp-highlight red">

                <span className="cp-highlight-icon">
                  ⛔
                </span>

                <div className="cp-highlight-text">
                  Disabling essential cookies may affect
                  login functionality, dashboard access,
                  and other core platform features.
                </div>

              </div>

            </div>

          </div>

          {/* SECTION 7 */}

          <div className="cp-section" id="security">

            <div className="cp-section-header">

              <div
                className="cp-section-icon"
                style={{ background: "#EDE9FE" }}
              >
                🔒
              </div>

              <div className="cp-section-num">
                07
              </div>

              <div className="cp-section-title">
                Security & Privacy
              </div>

            </div>

            <div className="cp-section-body">

              <p className="cp-p">
                LoadOps AI prioritizes user privacy and
                secure data handling across all systems.
              </p>

              <div className="cp-highlight green">

                <span className="cp-highlight-icon">
                  ✓
                </span>

                <div className="cp-highlight-text">
                  We do not sell cookie data or browsing
                  behavior to advertising networks or
                  third-party marketing companies.
                </div>

              </div>

            </div>

          </div>

          {/* SECTION 8 */}

          <div className="cp-section" id="updates">

            <div className="cp-section-header">

              <div
                className="cp-section-icon"
                style={{ background: "#EBF1FD" }}
              >
                📝
              </div>

              <div className="cp-section-num">
                08
              </div>

              <div className="cp-section-title">
                Policy Updates
              </div>

            </div>

            <div className="cp-section-body">

              <p className="cp-p">
                We may update this Cookie Policy periodically
                to reflect changes in technology, legal requirements,
                or platform functionality.
              </p>

              <div className="cp-check-list">

                {[
                  "Updated versions will appear on this page.",
                  "The Last Updated date will be revised.",
                  "Major changes may be announced through the platform.",
                ].map((item, i) => (
                  <div key={i} className="cp-check-item">
                    {item}
                  </div>
                ))}

              </div>

            </div>

          </div>

          {/* CONTACT */}

          <div id="contact" className="cp-contact-card">

            <div className="cp-contact-icon">
              ✉️
            </div>

            <div className="cp-contact-title">
              Questions About Cookies?
            </div>

            <p className="cp-contact-sub">
              If you have questions regarding cookies,
              tracking technologies, or browser privacy,
              our support team is available to help.
            </p>

            <div className="cp-contact-btns">

              <a
  className="cp-contact-btn primary"
  onClick={() => window.location.href = "mailto:support@loadopsai.co"}
>
  Contact Support
</a>

              <button
                className="cp-contact-btn ghost"
                onClick={() => router.push("/")}
              >
                ← Back To Home
              </button>

            </div>

          </div>

          {/* FOOTER */}

          <div
            style={{
              textAlign: "center",
              fontSize: "0.72rem",
              color: "var(--txt4)",
              lineHeight: 1.6,
              padding: "4px 0 8px",
            }}
          >
            LoadOps AI · Cookie Policy · Last Updated {lastUpdated}
            <br />
            By using LoadOps AI you consent to our cookie usage.
          </div>

        </div>

      </div>

    </main>
  );
}