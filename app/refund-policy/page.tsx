"use client";

import { useRouter } from "next/navigation";

export default function RefundPolicy() {
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

        .rp-hero {
          padding: 64px 5% 52px;
          background: var(--white);
          border-bottom: 1px solid var(--border);
          position: relative;
          overflow: hidden;
        }

        .rp-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(ellipse 80% 60% at 50% -10%, rgba(26,86,219,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 95% 80%, rgba(124,58,237,0.03) 0%, transparent 55%);
        }

        .rp-hero-inner {
          position: relative;
          z-index: 1;
          max-width: 820px;
        }

        .rp-eyebrow {
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

        .rp-eyebrow::before {
          content: '';
          width: 20px;
          height: 2px;
          background: var(--blue);
          border-radius: 1px;
        }

        .rp-title {
          font-size: clamp(2rem, 4vw, 2.8rem);
          font-weight: 800;
          letter-spacing: -0.045em;
          color: var(--txt);
          line-height: 1.06;
          margin-bottom: 14px;
        }

        .rp-title em {
          font-family: 'Instrument Serif', serif;
          font-style: italic;
          font-weight: 400;
          color: var(--blue);
        }

        .rp-sub {
          font-size: 0.92rem;
          color: var(--txt3);
          line-height: 1.7;
          max-width: 620px;
          margin-bottom: 22px;
        }

        .rp-meta-row {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .rp-meta-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 600;
        }

        .rp-meta-pill.date {
          background: var(--blue-l);
          color: var(--blue);
          border: 1px solid var(--blue-m);
        }

        .rp-meta-pill.secure {
          background: var(--green-l);
          color: var(--green);
          border: 1px solid #A7F3C8;
        }

        .rp-meta-pill.billing {
          background: var(--amber-l);
          color: var(--amber);
          border: 1px solid #FDE68A;
        }

        /* LAYOUT */

        .rp-layout {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 40px;
          max-width: 1100px;
          margin: 0 auto;
          padding: 40px 5% 80px;
          align-items: start;
        }

        /* TOC */

        .rp-toc {
          position: sticky;
          top: 88px;
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
        }

        .rp-toc-header {
          padding: 16px 18px;
          border-bottom: 1px solid var(--border);
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--txt);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          background: var(--bg);
        }

        .rp-toc-list {
          display: flex;
          flex-direction: column;
          padding: 8px 0;
        }

        .rp-toc-item {
          padding: 8px 18px;
          font-size: 0.76rem;
          color: var(--txt3);
          text-decoration: none;
          font-weight: 500;
          transition: all 0.15s;
          border-left: 2px solid transparent;
        }

        .rp-toc-item:hover {
          color: var(--blue);
          background: var(--blue-l);
          border-left-color: var(--blue);
        }

        .rp-toc-num {
          font-size: 0.62rem;
          color: var(--txt4);
          font-weight: 700;
          margin-right: 6px;
        }

        /* CONTENT */

        .rp-content {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .rp-section {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          animation: fadeUp 0.5s ease both;
        }

        .rp-section-header {
          padding: 20px 26px 16px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .rp-section-icon {
          width: 36px;
          height: 36px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          flex-shrink: 0;
        }

        .rp-section-num {
          font-size: 0.62rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 4px;
          background: var(--blue-l);
          color: var(--blue);
          letter-spacing: 0.06em;
        }

        .rp-section-title {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--txt);
          letter-spacing: -0.02em;
          flex: 1;
        }

        .rp-section-body {
          padding: 20px 26px 24px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .rp-p {
          font-size: 0.84rem;
          color: var(--txt3);
          line-height: 1.78;
        }

        .rp-p b {
          color: var(--txt2);
        }

        .rp-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .rp-list-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.82rem;
          color: var(--txt3);
          line-height: 1.7;
        }

        .rp-list-item::before {
          content: '•';
          color: var(--blue);
          font-weight: 800;
        }

        .rp-check-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .rp-check-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.82rem;
          color: var(--txt3);
          line-height: 1.65;
        }

        .rp-check-item::before {
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

        .rp-highlight {
          border-radius: 10px;
          padding: 14px 16px;
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }

        .rp-highlight.blue {
          background: var(--blue-l);
          border: 1px solid var(--blue-m);
        }

        .rp-highlight.green {
          background: var(--green-l);
          border: 1px solid #A7F3C8;
        }

        .rp-highlight.amber {
          background: var(--amber-l);
          border: 1px solid #FDE68A;
        }

        .rp-highlight.red {
          background: var(--red-l);
          border: 1px solid #FECACA;
        }

        .rp-highlight-icon {
          font-size: 1rem;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .rp-highlight-text {
          font-size: 0.8rem;
          line-height: 1.65;
          font-weight: 500;
        }

        .rp-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .rp-info-card {
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 14px 16px;
        }

        .rp-info-card-title {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--txt);
          margin-bottom: 5px;
        }

        .rp-info-card-desc {
          font-size: 0.75rem;
          color: var(--txt3);
          line-height: 1.55;
        }

        .rp-contact-card {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 28px;
          text-align: center;
        }

        .rp-contact-icon {
          font-size: 2rem;
          margin-bottom: 12px;
        }

        .rp-contact-title {
          font-size: 1rem;
          font-weight: 800;
          color: var(--txt);
          margin-bottom: 8px;
        }

        .rp-contact-sub {
          font-size: 0.82rem;
          color: var(--txt3);
          line-height: 1.65;
          margin-bottom: 20px;
        }

        .rp-contact-btns {
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .rp-contact-btn {
          padding: 10px 22px;
          border-radius: 9px;
          font-size: 0.8rem;
          font-weight: 700;
          border: none;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.15s;
        }

        .rp-contact-btn.primary {
          background: var(--blue);
          color: white;
        }

        .rp-contact-btn.primary:hover {
          background: #1446C0;
          transform: translateY(-1px);
        }

        .rp-contact-btn.ghost {
          background: var(--bg2);
          color: var(--txt2);
          border: 1.5px solid var(--border2);
        }

        .rp-contact-btn.ghost:hover {
          border-color: var(--blue-m);
          color: var(--blue);
        }

        @media (max-width: 900px) {
          .rp-layout {
            grid-template-columns: 1fr;
          }

          .rp-toc {
            position: static;
          }

          .rp-grid-2 {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .rp-hero {
            padding: 40px 4% 36px;
          }

          .rp-layout {
            padding: 24px 4% 60px;
            gap: 20px;
          }

          .rp-section-body {
            padding: 16px 18px 20px;
          }

          .rp-section-header {
            padding: 16px 18px 12px;
          }
        }

      `}</style>

      {/* HERO */}

      <section className="rp-hero">
        <div className="rp-hero-inner">

          <div className="rp-eyebrow">
            Billing & Payments
          </div>

          <div className="rp-title">
            Refund <em>Policy</em>
          </div>

          <p className="rp-sub">
            This Refund Policy explains how subscription payments,
            cancellations, billing disputes, and refund requests are
            handled across the LoadOps AI platform and AI freight services.
          </p>

          <div className="rp-meta-row">
            <div className="rp-meta-pill date">
              📅 Last Updated: {lastUpdated}
            </div>

            <div className="rp-meta-pill secure">
              🔒 Secure Billing
            </div>

            <div className="rp-meta-pill billing">
              ✓ Subscription Protected
            </div>
          </div>

        </div>
      </section>

      {/* LAYOUT */}

      <div className="rp-layout">

        {/* TOC */}

        <nav className="rp-toc">

          <div className="rp-toc-header">
            Table of Contents
          </div>

          <div className="rp-toc-list">

            {[
              { num: "01", label: "Overview", href: "#overview" },
              { num: "02", label: "Subscription Billing", href: "#billing" },
              { num: "03", label: "Eligible Refunds", href: "#eligible" },
              { num: "04", label: "Non-Refundable Items", href: "#non-refundable" },
              { num: "05", label: "Trial Access", href: "#trial" },
              { num: "06", label: "Chargebacks", href: "#chargebacks" },
              { num: "07", label: "Cancellation Policy", href: "#cancellation" },
              { num: "08", label: "Processing Time", href: "#processing" },
              { num: "09", label: "Fraud Prevention", href: "#fraud" },
              { num: "10", label: "Contact & Support", href: "#contact" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rp-toc-item"
              >
                <span className="rp-toc-num">
                  {item.num}
                </span>

                {item.label}
              </a>
            ))}

          </div>

        </nav>

        {/* CONTENT */}

        <div className="rp-content">

          <div className="rp-highlight blue">
            <span className="rp-highlight-icon">
              ℹ️
            </span>

            <div className="rp-highlight-text">
              By subscribing to LoadOps AI services, dashboards,
              AI load alerts, dispatcher tools, broker tools,
              or carrier systems, you agree to this Refund Policy.
            </div>
          </div>

          {/* SECTION 1 */}

          <div className="rp-section" id="overview">

            <div className="rp-section-header">

              <div
                className="rp-section-icon"
                style={{ background: "#EBF1FD" }}
              >
                📘
              </div>

              <div className="rp-section-num">
                01
              </div>

              <div className="rp-section-title">
                Overview
              </div>

            </div>

            <div className="rp-section-body">

              <p className="rp-p">
                LoadOps AI offers digital software services,
                AI-powered freight tools, load matching systems,
                communication dashboards, and subscription-based
                access plans for carriers, dispatchers, and brokers.
              </p>

              <p className="rp-p">
                Because our services are digital and immediately accessible,
                refunds are limited and subject to the conditions
                outlined in this policy.
              </p>

              <div className="rp-highlight green">

                <span className="rp-highlight-icon">
                  ✓
                </span>

                <div className="rp-highlight-text">
                  We believe in fair and transparent billing practices.
                  If a legitimate issue occurs, our support team will
                  review your case promptly.
                </div>

              </div>

            </div>

          </div>

          {/* SECTION 2 */}

          <div className="rp-section" id="billing">

            <div className="rp-section-header">

              <div
                className="rp-section-icon"
                style={{ background: "#E6F7EE" }}
              >
                💳
              </div>

              <div className="rp-section-num">
                02
              </div>

              <div className="rp-section-title">
                Subscription Billing
              </div>

            </div>

            <div className="rp-section-body">

              <div className="rp-check-list">

                {[
                  "Subscriptions are billed monthly or annually depending on the selected plan.",
                  "Payments are automatically renewed unless canceled before the next billing cycle.",
                  "Users are responsible for maintaining accurate billing information.",
                  "Invoices and receipts are automatically generated after successful payment.",
                  "Platform access may be restricted if payment fails or becomes overdue.",
                ].map((item, i) => (
                  <div key={i} className="rp-check-item">
                    {item}
                  </div>
                ))}

              </div>

            </div>

          </div>

          {/* SECTION 3 */}

          <div className="rp-section" id="eligible">

            <div className="rp-section-header">

              <div
                className="rp-section-icon"
                style={{ background: "#EDE9FE" }}
              >
                💰
              </div>

              <div className="rp-section-num">
                03
              </div>

              <div className="rp-section-title">
                Eligible Refunds
              </div>

            </div>

            <div className="rp-section-body">

              <p className="rp-p">
                Refunds may be approved under the following circumstances:
              </p>

              <div className="rp-list">

                {[
                  "Duplicate payments caused by a billing error.",
                  "Unauthorized transactions confirmed after investigation.",
                  "Platform-wide technical failures preventing access for extended periods.",
                  "Subscription charges made after a valid cancellation request.",
                  "Accidental overbilling verified by our finance team.",
                ].map((item, i) => (
                  <div key={i} className="rp-list-item">
                    {item}
                  </div>
                ))}

              </div>

              <div className="rp-highlight amber">

                <span className="rp-highlight-icon">
                  ⚠️
                </span>

                <div className="rp-highlight-text">
                  Refund requests must be submitted within 7 days
                  of the original payment date.
                </div>

              </div>

            </div>

          </div>

          {/* SECTION 4 */}

          <div className="rp-section" id="non-refundable">

            <div className="rp-section-header">

              <div
                className="rp-section-icon"
                style={{ background: "#FEF2F2" }}
              >
                🚫
              </div>

              <div className="rp-section-num">
                04
              </div>

              <div className="rp-section-title">
                Non-Refundable Items
              </div>

            </div>

            <div className="rp-section-body">

              <div className="rp-grid-2">

                {[
                  {
                    title: "Used Subscription Time",
                    desc: "Partial usage of subscription periods is non-refundable."
                  },
                  {
                    title: "Completed AI Services",
                    desc: "AI-generated load alerts and completed platform operations cannot be refunded."
                  },
                  {
                    title: "Custom Integrations",
                    desc: "Custom setup work and integrations are final once delivered."
                  },
                  {
                    title: "User Error",
                    desc: "Refunds are not issued for accidental purchases caused by user negligence."
                  },
                ].map((card, i) => (
                  <div key={i} className="rp-info-card">

                    <div className="rp-info-card-title">
                      {card.title}
                    </div>

                    <div className="rp-info-card-desc">
                      {card.desc}
                    </div>

                  </div>
                ))}

              </div>

            </div>

          </div>

          {/* SECTION 5 */}

          <div className="rp-section" id="trial">

            <div className="rp-section-header">

              <div
                className="rp-section-icon"
                style={{ background: "#EBF1FD" }}
              >
                🧪
              </div>

              <div className="rp-section-num">
                05
              </div>

              <div className="rp-section-title">
                Trial Access
              </div>

            </div>

            <div className="rp-section-body">

              <p className="rp-p">
                If LoadOps AI offers free trials or promotional access,
                users are responsible for canceling before the trial ends
                to avoid automatic billing.
              </p>

              <div className="rp-highlight blue">

                <span className="rp-highlight-icon">
                  ℹ️
                </span>

                <div className="rp-highlight-text">
                  Charges generated after a trial period ends
                  are considered valid unless canceled beforehand.
                </div>

              </div>

            </div>

          </div>

          {/* SECTION 6 */}

          <div className="rp-section" id="chargebacks">

            <div className="rp-section-header">

              <div
                className="rp-section-icon"
                style={{ background: "#FEF3C7" }}
              >
                ⚖️
              </div>

              <div className="rp-section-num">
                06
              </div>

              <div className="rp-section-title">
                Chargebacks
              </div>

            </div>

            <div className="rp-section-body">

              <p className="rp-p">
                Users are encouraged to contact LoadOps AI support
                before initiating a chargeback through their bank
                or payment provider.
              </p>

              <div className="rp-highlight red">

                <span className="rp-highlight-icon">
                  ⛔
                </span>

                <div className="rp-highlight-text">
                  Fraudulent or abusive chargebacks may result in
                  immediate account suspension and permanent restriction
                  from the platform.
                </div>

              </div>

            </div>

          </div>

          {/* SECTION 7 */}

          <div className="rp-section" id="cancellation">

            <div className="rp-section-header">

              <div
                className="rp-section-icon"
                style={{ background: "#E6F7EE" }}
              >
                📴
              </div>

              <div className="rp-section-num">
                07
              </div>

              <div className="rp-section-title">
                Cancellation Policy
              </div>

            </div>

            <div className="rp-section-body">

              <div className="rp-check-list">

                {[
                  "Subscriptions can be canceled anytime from the account dashboard.",
                  "Cancellation stops future billing but does not retroactively refund prior payments.",
                  "Access remains active until the current billing period expires.",
                  "Deleted accounts may lose access to stored load data and dashboard settings.",
                ].map((item, i) => (
                  <div key={i} className="rp-check-item">
                    {item}
                  </div>
                ))}

              </div>

            </div>

          </div>

          {/* SECTION 8 */}

          <div className="rp-section" id="processing">

            <div className="rp-section-header">

              <div
                className="rp-section-icon"
                style={{ background: "#EDE9FE" }}
              >
                ⏳
              </div>

              <div className="rp-section-num">
                08
              </div>

              <div className="rp-section-title">
                Processing Time
              </div>

            </div>

            <div className="rp-section-body">

              <p className="rp-p">
                Approved refunds are typically processed within
                5–10 business days depending on your payment provider
                and banking institution.
              </p>

              <div className="rp-list">

                {[
                  "Credit card refunds may take additional banking time.",
                  "International payment processing may experience delays.",
                  "Refund status updates may be sent through email notifications.",
                ].map((item, i) => (
                  <div key={i} className="rp-list-item">
                    {item}
                  </div>
                ))}

              </div>

            </div>

          </div>

          {/* SECTION 9 */}

          <div className="rp-section" id="fraud">

            <div className="rp-section-header">

              <div
                className="rp-section-icon"
                style={{ background: "#EBF1FD" }}
              >
                🛡️
              </div>

              <div className="rp-section-num">
                09
              </div>

              <div className="rp-section-title">
                Fraud Prevention
              </div>

            </div>

            <div className="rp-section-body">

              <p className="rp-p">
                LoadOps AI actively monitors suspicious activity,
                fake refund requests, payment abuse, and unauthorized
                access attempts to protect the platform and users.
              </p>

              <div className="rp-highlight amber">

                <span className="rp-highlight-icon">
                  ⚠️
                </span>

                <div className="rp-highlight-text">
                  Accounts associated with fraudulent behavior
                  may be permanently removed without refund eligibility.
                </div>

              </div>

            </div>

          </div>

          {/* CONTACT */}

          <div id="contact" className="rp-contact-card">

            <div className="rp-contact-icon">
              ✉️
            </div>

            <div className="rp-contact-title">
              Billing Questions?
            </div>

            <p className="rp-contact-sub">
              If you have questions regarding payments,
              cancellations, subscriptions, or refund eligibility,
              our support team is available to assist you.
            </p>

            <div className="rp-contact-btns">

              <button
                className="rp-contact-btn primary"
               onClick={() => { window.location.href = "mailto:support@loadopsai.co"; }}
              >
                Contact Support
              </button>

              <button
                className="rp-contact-btn ghost"
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
            LoadOps AI · Refund Policy · Last Updated {lastUpdated}
            <br />
            By using LoadOps AI services you agree to this policy.
          </div>

        </div>

      </div>

    </main>
  );
}