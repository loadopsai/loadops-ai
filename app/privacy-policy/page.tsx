"use client";

import { useRouter } from "next/navigation";

export default function PrivacyPolicy() {
  const router = useRouter();
  const lastUpdated = "May 27, 2026";

  return (
    <main style={{ minHeight: "100vh", background: "#F7F8FA", fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#0F1520" }}>

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
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: none; }
        }

        /* ── HERO ── */
        .pp-hero {
          padding: 64px 5% 52px;
          background: var(--white);
          border-bottom: 1px solid var(--border);
          position: relative; overflow: hidden;
        }
        .pp-hero::before {
          content: '';
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 80% 60% at 50% -10%, rgba(26,86,219,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 95% 80%, rgba(124,58,237,0.03) 0%, transparent 55%);
        }
        .pp-hero-inner { position: relative; z-index: 1; max-width: 820px; }
        .pp-eyebrow { display: flex; align-items: center; gap: 8px; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--blue); margin-bottom: 14px; }
        .pp-eyebrow::before { content: ''; width: 20px; height: 2px; background: var(--blue); border-radius: 1px; }
        .pp-title { font-size: clamp(2rem, 4vw, 2.8rem); font-weight: 800; letter-spacing: -0.045em; color: var(--txt); line-height: 1.06; margin-bottom: 14px; font-family: 'Plus Jakarta Sans', sans-serif; }
        .pp-title em { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; color: var(--blue); }
        .pp-sub { font-size: 0.92rem; color: var(--txt3); line-height: 1.7; max-width: 580px; margin-bottom: 22px; }
        .pp-meta-row { display: flex; gap: 16px; flex-wrap: wrap; }
        .pp-meta-pill { display: flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 20px; font-size: 0.7rem; font-weight: 600; }
        .pp-meta-pill.date   { background: var(--blue-l); color: var(--blue); border: 1px solid var(--blue-m); }
        .pp-meta-pill.secure { background: var(--green-l); color: var(--green); border: 1px solid #A7F3C8; }
        .pp-meta-pill.fmcsa  { background: var(--amber-l); color: var(--amber); border: 1px solid #FDE68A; }

        /* ── LAYOUT ── */
        .pp-layout { display: grid; grid-template-columns: 240px 1fr; gap: 40px; max-width: 1100px; margin: 0 auto; padding: 40px 5% 80px; align-items: start; }

        /* ── SIDEBAR TOC ── */
        .pp-toc { position: sticky; top: 88px; background: var(--white); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; }
        .pp-toc-header { padding: 16px 18px; border-bottom: 1px solid var(--border); font-size: 0.72rem; font-weight: 800; color: var(--txt); text-transform: uppercase; letter-spacing: 0.08em; background: var(--bg); }
        .pp-toc-list { display: flex; flex-direction: column; padding: 8px 0; }
        .pp-toc-item { padding: 8px 18px; font-size: 0.76rem; color: var(--txt3); text-decoration: none; font-weight: 500; transition: all 0.15s; border-left: 2px solid transparent; display: block; }
        .pp-toc-item:hover { color: var(--blue); background: var(--blue-l); border-left-color: var(--blue); }
        .pp-toc-num { font-size: 0.62rem; color: var(--txt4); font-weight: 700; margin-right: 6px; }

        /* ── CONTENT ── */
        .pp-content { display: flex; flex-direction: column; gap: 28px; }

        /* SECTION CARD */
        .pp-section { background: var(--white); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; animation: fadeUp 0.5s ease both; }
        .pp-section-header { padding: 20px 26px 16px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 12px; }
        .pp-section-icon { width: 36px; height: 36px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
        .pp-section-num { font-size: 0.62rem; font-weight: 800; padding: 2px 8px; border-radius: 4px; background: var(--blue-l); color: var(--blue); letter-spacing: 0.06em; }
        .pp-section-title { font-size: 0.95rem; font-weight: 800; color: var(--txt); letter-spacing: -0.02em; flex: 1; }
        .pp-section-body { padding: 20px 26px 24px; display: flex; flex-direction: column; gap: 14px; }

        /* TEXT */
        .pp-p { font-size: 0.84rem; color: var(--txt3); line-height: 1.78; font-weight: 400; }
        .pp-p b { color: var(--txt2); font-weight: 700; }
        .pp-p a { color: var(--blue); text-decoration: none; font-weight: 600; }
        .pp-p a:hover { text-decoration: underline; }

        /* HIGHLIGHT BOX */
        .pp-highlight { border-radius: 10px; padding: 14px 16px; display: flex; gap: 10px; align-items: flex-start; }
        .pp-highlight.blue   { background: var(--blue-l);   border: 1px solid var(--blue-m); }
        .pp-highlight.green  { background: var(--green-l);  border: 1px solid #A7F3C8; }
        .pp-highlight.amber  { background: var(--amber-l);  border: 1px solid #FDE68A; }
        .pp-highlight.purple { background: var(--purple-l); border: 1px solid #C4B5FD; }
        .pp-highlight-icon { font-size: 1rem; flex-shrink: 0; margin-top: 1px; }
        .pp-highlight-text { font-size: 0.8rem; line-height: 1.65; font-weight: 500; }
        .pp-highlight.blue   .pp-highlight-text { color: var(--blue);   }
        .pp-highlight.green  .pp-highlight-text { color: var(--green);  }
        .pp-highlight.amber  .pp-highlight-text { color: var(--amber);  }
        .pp-highlight.purple .pp-highlight-text { color: var(--purple); }

        /* LIST */
        .pp-list { display: flex; flex-direction: column; gap: 8px; padding-left: 4px; }
        .pp-list-item { display: flex; align-items: flex-start; gap: 10px; font-size: 0.82rem; color: var(--txt3); line-height: 1.65; font-weight: 400; }
        .pp-list-item::before { content: '•'; color: var(--blue); font-weight: 800; font-size: 0.9rem; flex-shrink: 0; margin-top: 1px; }
        .pp-list-item b { color: var(--txt2); font-weight: 700; }

        /* CHECK LIST */
        .pp-check-list { display: flex; flex-direction: column; gap: 8px; }
        .pp-check-item { display: flex; align-items: flex-start; gap: 10px; font-size: 0.82rem; color: var(--txt3); line-height: 1.65; }
        .pp-check-item::before { content: '✓'; width: 18px; height: 18px; border-radius: 5px; background: var(--green-l); color: var(--green); display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 800; flex-shrink: 0; margin-top: 1px; }

        /* GRID CARDS */
        .pp-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .pp-info-card { background: var(--bg); border: 1px solid var(--border); border-radius: 10px; padding: 14px 16px; }
        .pp-info-card-title { font-size: 0.75rem; font-weight: 700; color: var(--txt); margin-bottom: 5px; }
        .pp-info-card-desc  { font-size: 0.75rem; color: var(--txt3); line-height: 1.55; }

        /* DIVIDER */
        .pp-divider { height: 1px; background: var(--border); }

        /* CONTACT CARD */
        .pp-contact-card { background: var(--white); border: 1px solid var(--border); border-radius: 16px; padding: 28px; text-align: center; }
        .pp-contact-icon { font-size: 2rem; margin-bottom: 12px; }
        .pp-contact-title { font-size: 1rem; font-weight: 800; color: var(--txt); margin-bottom: 8px; letter-spacing: -0.02em; }
        .pp-contact-sub   { font-size: 0.82rem; color: var(--txt3); line-height: 1.65; margin-bottom: 20px; }
        .pp-contact-btns  { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
        .pp-contact-btn { padding: 10px 22px; border-radius: 9px; font-size: 0.8rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; }
        .pp-contact-btn.primary { background: var(--blue); color: #fff; }
        .pp-contact-btn.primary:hover { background: #1446C0; transform: translateY(-1px); }
        .pp-contact-btn.ghost { background: var(--bg2); color: var(--txt2); border: 1.5px solid var(--border2); }
        .pp-contact-btn.ghost:hover { border-color: var(--blue-m); color: var(--blue); }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .pp-layout { grid-template-columns: 1fr; }
          .pp-toc { position: static; }
          .pp-grid-2 { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .pp-hero { padding: 40px 4% 36px; }
          .pp-layout { padding: 24px 4% 60px; gap: 20px; }
          .pp-section-body { padding: 16px 18px 20px; }
          .pp-section-header { padding: 16px 18px 12px; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="pp-hero">
        <div className="pp-hero-inner">
          <div className="pp-eyebrow">Legal</div>
          <div className="pp-title">Privacy <em>Policy</em></div>
          <p className="pp-sub">
            Your privacy matters to us. This policy explains how LoadOps AI collects, uses, and protects your personal information
            when you use our freight platform, dashboards, and AI-powered matching services.
          </p>
          <div className="pp-meta-row">
            <div className="pp-meta-pill date">📅 Last Updated: {lastUpdated}</div>
            <div className="pp-meta-pill secure">🔒 SSL Encrypted</div>
            <div className="pp-meta-pill fmcsa">✓ FMCSA Compliant</div>
          </div>
        </div>
      </section>

      {/* ── LAYOUT ── */}
      <div className="pp-layout">

        {/* ── SIDEBAR TOC ── */}
        <nav className="pp-toc">
          <div className="pp-toc-header">Table of Contents</div>
          <div className="pp-toc-list">
            {[
              { num: "01", label: "Information We Collect",    href: "#collect"     },
              { num: "02", label: "How We Use Your Data",      href: "#use"         },
              { num: "03", label: "Data Sharing",              href: "#sharing"     },
              { num: "04", label: "AI & Matching System",      href: "#ai"          },
              { num: "05", label: "Cookies & Tracking",        href: "#cookies"     },
              { num: "06", label: "Data Security",             href: "#security"    },
              { num: "07", label: "Your Rights",               href: "#rights"      },
              { num: "08", label: "Data Retention",            href: "#retention"   },
              { num: "09", label: "Third-Party Services",      href: "#third-party" },
              { num: "10", label: "Children's Privacy",        href: "#children"    },
              { num: "11", label: "Policy Changes",            href: "#changes"     },
              { num: "12", label: "Contact Us",                href: "#contact"     },
            ].map((item) => (
              <a key={item.href} href={item.href} className="pp-toc-item">
                <span className="pp-toc-num">{item.num}</span>{item.label}
              </a>
            ))}
          </div>
        </nav>

        {/* ── CONTENT ── */}
        <div className="pp-content">

          {/* INTRO HIGHLIGHT */}
          <div className="pp-highlight blue">
            <span className="pp-highlight-icon">ℹ️</span>
            <div className="pp-highlight-text">
              By accessing or using LoadOps AI — including our load board, AI matching engine, dispatcher hub, carrier dashboard, or broker tools — you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree, please discontinue use of the platform.
            </div>
          </div>

          {/* ── SECTION 1 ── */}
          <div className="pp-section" id="collect">
            <div className="pp-section-header">
              <div className="pp-section-icon" style={{ background: "#EBF1FD" }}>📋</div>
              <div className="pp-section-num">01</div>
              <div className="pp-section-title">Information We Collect</div>
            </div>
            <div className="pp-section-body">
              <p className="pp-p">We collect information you provide directly, information generated by your use of the platform, and limited data from third-party services. The types of data we collect depend on your role as a Carrier, Broker, or Dispatcher.</p>

              <div className="pp-grid-2">
                {[
                  { title: "Account Information",    desc: "Name, email, password, company name, phone number, and selected role (Carrier, Broker, or Dispatcher)." },
                  { title: "Identity & Compliance",  desc: "MC number, USDOT number, DOT authority documents, W9 forms, insurance certificates, and driver license for verification." },
                  { title: "Profile Data",           desc: "Dispatcher portfolios, carrier preferences, truck types, preferred lanes, experience years, dispatch fees, and bio." },
                  { title: "Load & Booking Data",    desc: "Load postings, pickup/delivery locations, equipment type, rates, weight, booking requests, and transaction records." },
                  { title: "Communication Data",     desc: "Chat messages, voice recordings, file attachments, and call records sent through the LoadOps AI chat and call system." },
                  { title: "Usage & Device Data",    desc: "IP address, browser type, device model, pages visited, time spent, clicks, search queries, and platform interactions." },
                ].map((c, i) => (
                  <div key={i} className="pp-info-card">
                    <div className="pp-info-card-title">{c.title}</div>
                    <div className="pp-info-card-desc">{c.desc}</div>
                  </div>
                ))}
              </div>

              <div className="pp-highlight green">
                <span className="pp-highlight-icon">✓</span>
                <div className="pp-highlight-text">
                  We only collect the information necessary to provide our services. We do not collect Social Security numbers, credit card numbers, or banking information directly — payment processing is handled by PCI-compliant third-party providers.
                </div>
              </div>
            </div>
          </div>

          {/* ── SECTION 2 ── */}
          <div className="pp-section" id="use">
            <div className="pp-section-header">
              <div className="pp-section-icon" style={{ background: "#E6F7EE" }}>⚙️</div>
              <div className="pp-section-num">02</div>
              <div className="pp-section-title">How We Use Your Data</div>
            </div>
            <div className="pp-section-body">
              <p className="pp-p">LoadOps AI uses your data to deliver, improve, and personalize our freight matching platform. We never sell your personal data to advertisers or third-party marketing companies.</p>
              <div className="pp-check-list">
                {[
                  "Provide and operate your role-specific dashboard (Carrier, Broker, or Dispatcher).",
                  "Power the AI matching engine to surface relevant loads and carrier matches based on your profile.",
                  "Send AI load alert emails to carriers and dispatchers with matching freight opportunities.",
                  "Verify compliance credentials such as MC numbers, USDOT, and insurance documents.",
                  "Enable real-time chat, voice calls, and file sharing between platform users.",
                  "Process load bookings, confirmations, and booking request submissions.",
                  "Detect and prevent fraud, spam, duplicate accounts, and unauthorized access.",
                  "Analyze platform usage to improve features, fix bugs, and optimize performance.",
                  "Send transactional emails such as account confirmations, password resets, and booking alerts.",
                  "Comply with FMCSA regulations, legal obligations, and law enforcement requests when required.",
                ].map((item, i) => (
                  <div key={i} className="pp-check-item">{item}</div>
                ))}
              </div>
            </div>
          </div>

          {/* ── SECTION 3 ── */}
          <div className="pp-section" id="sharing">
            <div className="pp-section-header">
              <div className="pp-section-icon" style={{ background: "#EDE9FE" }}>🤝</div>
              <div className="pp-section-num">03</div>
              <div className="pp-section-title">Data Sharing</div>
            </div>
            <div className="pp-section-body">
              <p className="pp-p">We do not sell, rent, or trade your personal information. We share data only in the following limited circumstances:</p>
              <div className="pp-list">
                {[
                  { label: "Between Platform Users:", text: "When a carrier contacts a dispatcher, or a broker posts a load, relevant profile and load data is shared between the involved parties to facilitate the transaction." },
                  { label: "Service Providers:", text: "We use trusted third-party providers for hosting (Supabase), cloud storage, email delivery, and analytics. These providers process data on our behalf under strict confidentiality agreements." },
                  { label: "Legal Compliance:", text: "We may disclose information to comply with applicable laws, respond to court orders, subpoenas, regulatory audits, or to protect the rights, safety, and property of LoadOps AI and its users." },
                  { label: "Business Transfers:", text: "If LoadOps AI is acquired, merged, or sold, your data may be transferred to the acquiring entity. You will be notified of any such change via email or platform notice." },
                  { label: "With Your Consent:", text: "We may share your data for purposes not described here if you provide explicit, informed consent." },
                ].map((item, i) => (
                  <div key={i} className="pp-list-item"><span><b>{item.label}</b> {item.text}</span></div>
                ))}
              </div>
              <div className="pp-highlight amber">
                <span className="pp-highlight-icon">⚠️</span>
                <div className="pp-highlight-text">
                  We never share your data with advertising networks, data brokers, or social media platforms for marketing purposes. LoadOps AI products are ad-free.
                </div>
              </div>
            </div>
          </div>

          {/* ── SECTION 4 ── */}
          <div className="pp-section" id="ai">
            <div className="pp-section-header">
              <div className="pp-section-icon" style={{ background: "#EBF1FD" }}>🤖</div>
              <div className="pp-section-num">04</div>
              <div className="pp-section-title">AI & Matching System</div>
            </div>
            <div className="pp-section-body">
              <p className="pp-p">LoadOps AI uses machine learning and algorithmic matching to connect loads with carriers and dispatchers. Understanding how this system uses your data is important.</p>
              <div className="pp-list">
                {[
                  { label: "Profile-Based Matching:", text: "Your equipment type, preferred lanes, availability, and location are used to surface relevant loads and dispatcher matches in real-time." },
                  { label: "Behavioral Learning:", text: "The AI observes which loads you book, decline, or save to improve future recommendations. This learning is tied to your account and improves over time." },
                  { label: "AI Email Alerts:", text: "Based on your preferences, the system automatically sends load opportunity emails. You can opt out of these at any time from your dashboard settings." },
                  { label: "No Automated Decisions:", text: "The AI assists in surfacing relevant matches but never makes binding decisions on your behalf. All bookings require explicit user action." },
                  { label: "Data Used by AI:", text: "Equipment type, home region, rate preferences, deadhead tolerance, pickup dates, and booking history are the primary signals used by the matching engine." },
                ].map((item, i) => (
                  <div key={i} className="pp-list-item"><span><b>{item.label}</b> {item.text}</span></div>
                ))}
              </div>
            </div>
          </div>

          {/* ── SECTION 5 ── */}
          <div className="pp-section" id="cookies">
            <div className="pp-section-header">
              <div className="pp-section-icon" style={{ background: "#FEF3C7" }}>🍪</div>
              <div className="pp-section-num">05</div>
              <div className="pp-section-title">Cookies & Tracking</div>
            </div>
            <div className="pp-section-body">
              <p className="pp-p">LoadOps AI uses cookies and similar tracking technologies to maintain your session, remember preferences, and analyze platform usage.</p>
              <div className="pp-grid-2">
                {[
                  { title: "Essential Cookies",     desc: "Required for authentication, session management, and core platform functionality. Cannot be disabled." },
                  { title: "Preference Cookies",    desc: "Store your dashboard settings, filter preferences, and language selections for a better experience." },
                  { title: "Analytics Cookies",     desc: "Help us understand how users interact with the platform so we can improve features and performance." },
                  { title: "Security Cookies",      desc: "Used to detect fraud, protect against CSRF attacks, and verify that requests come from legitimate users." },
                ].map((c, i) => (
                  <div key={i} className="pp-info-card">
                    <div className="pp-info-card-title">{c.title}</div>
                    <div className="pp-info-card-desc">{c.desc}</div>
                  </div>
                ))}
              </div>
              <p className="pp-p">You can manage or disable non-essential cookies through your browser settings. Note that disabling cookies may affect platform functionality.</p>
            </div>
          </div>

          {/* ── SECTION 6 ── */}
          <div className="pp-section" id="security">
            <div className="pp-section-header">
              <div className="pp-section-icon" style={{ background: "#E6F7EE" }}>🔒</div>
              <div className="pp-section-num">06</div>
              <div className="pp-section-title">Data Security</div>
            </div>
            <div className="pp-section-body">
              <p className="pp-p">We implement industry-standard technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction.</p>
              <div className="pp-check-list">
                {[
                  "All data is transmitted over HTTPS/TLS encrypted connections.",
                  "User passwords are hashed using bcrypt and never stored in plain text.",
                  "Database access is restricted with role-based permissions and multi-factor authentication.",
                  "File uploads are stored in isolated, access-controlled cloud storage buckets.",
                  "Real-time chat and calls use end-to-end encryption protocols.",
                  "Regular security audits and vulnerability assessments are conducted.",
                  "Supabase infrastructure includes SOC 2 compliant data centers.",
                ].map((item, i) => (
                  <div key={i} className="pp-check-item">{item}</div>
                ))}
              </div>
              <div className="pp-highlight amber">
                <span className="pp-highlight-icon">⚠️</span>
                <div className="pp-highlight-text">
                  While we implement strong security measures, no system is 100% secure. If you suspect unauthorized access to your account, contact us immediately at <b>security@loadopsai.com</b>.
                </div>
              </div>
            </div>
          </div>

          {/* ── SECTION 7 ── */}
          <div className="pp-section" id="rights">
            <div className="pp-section-header">
              <div className="pp-section-icon" style={{ background: "#EDE9FE" }}>⚖️</div>
              <div className="pp-section-num">07</div>
              <div className="pp-section-title">Your Rights</div>
            </div>
            <div className="pp-section-body">
              <p className="pp-p">Depending on your location, you may have certain rights regarding your personal information. LoadOps AI respects and supports these rights.</p>
              <div className="pp-grid-2">
                {[
                  { title: "Right to Access",      desc: "Request a copy of all personal data we hold about you." },
                  { title: "Right to Correction",  desc: "Update or correct inaccurate information in your profile." },
                  { title: "Right to Deletion",    desc: "Request deletion of your account and associated personal data." },
                  { title: "Right to Portability", desc: "Receive your data in a structured, machine-readable format." },
                  { title: "Right to Object",      desc: "Opt out of AI-based profiling or certain data processing activities." },
                  { title: "Right to Withdraw",    desc: "Withdraw consent for optional data uses such as AI email alerts at any time." },
                ].map((c, i) => (
                  <div key={i} className="pp-info-card">
                    <div className="pp-info-card-title">{c.title}</div>
                    <div className="pp-info-card-desc">{c.desc}</div>
                  </div>
                ))}
              </div>
              <p className="pp-p">To exercise any of these rights, contact us at <a href="mailto:privacy@loadopsai.com">privacy@loadopsai.com</a>. We will respond within 30 days. We may need to verify your identity before processing certain requests.</p>
            </div>
          </div>

          {/* ── SECTION 8 ── */}
          <div className="pp-section" id="retention">
            <div className="pp-section-header">
              <div className="pp-section-icon" style={{ background: "#FEF3C7" }}>📦</div>
              <div className="pp-section-num">08</div>
              <div className="pp-section-title">Data Retention</div>
            </div>
            <div className="pp-section-body">
              <p className="pp-p">We retain your personal data only as long as necessary to provide our services, comply with legal obligations, and resolve disputes.</p>
              <div className="pp-list">
                {[
                  { label: "Active Accounts:", text: "Data is retained for the lifetime of your account plus 90 days after deletion to allow for account recovery." },
                  { label: "Load & Booking Records:", text: "Retained for 7 years to comply with FMCSA recordkeeping requirements and for dispute resolution." },
                  { label: "Chat & Call Logs:", text: "Message history is retained for 12 months. Voice call recordings, if any, are deleted within 30 days." },
                  { label: "Compliance Documents:", text: "MC authority, insurance, and USDOT documents are retained for the duration of your account plus 3 years." },
                  { label: "Analytics Data:", text: "Aggregated, anonymized usage data may be retained indefinitely for product improvement purposes." },
                ].map((item, i) => (
                  <div key={i} className="pp-list-item"><span><b>{item.label}</b> {item.text}</span></div>
                ))}
              </div>
            </div>
          </div>

          {/* ── SECTION 9 ── */}
          <div className="pp-section" id="third-party">
            <div className="pp-section-header">
              <div className="pp-section-icon" style={{ background: "#EBF1FD" }}>🔗</div>
              <div className="pp-section-num">09</div>
              <div className="pp-section-title">Third-Party Services</div>
            </div>
            <div className="pp-section-body">
              <p className="pp-p">LoadOps AI integrates with trusted third-party services to deliver its features. Each service operates under its own privacy policy.</p>
              <div className="pp-list">
                {[
                  { label: "Supabase:", text: "Our backend database, authentication, real-time messaging, and file storage provider. Data is hosted on SOC 2 compliant infrastructure." },
                  { label: "Google Maps:", text: "Used to display pickup and delivery locations on load cards and the platform map. Google's privacy policy governs data submitted to their mapping API." },
                  { label: "Email Providers:", text: "Transactional emails and AI load alerts are delivered through a third-party email service provider under a data processing agreement." },
                  { label: "Payment Processors:", text: "Subscription billing is handled by a PCI-DSS compliant payment processor. LoadOps AI does not store card numbers or banking details." },
                ].map((item, i) => (
                  <div key={i} className="pp-list-item"><span><b>{item.label}</b> {item.text}</span></div>
                ))}
              </div>
              <p className="pp-p">We are not responsible for the privacy practices of third-party services. We encourage you to review their privacy policies before providing data directly to them.</p>
            </div>
          </div>

          {/* ── SECTION 10 ── */}
          <div className="pp-section" id="children">
            <div className="pp-section-header">
              <div className="pp-section-icon" style={{ background: "#E6F7EE" }}>🛡</div>
              <div className="pp-section-num">10</div>
              <div className="pp-section-title">Children's Privacy</div>
            </div>
            <div className="pp-section-body">
              <div className="pp-highlight amber">
                <span className="pp-highlight-icon">⚠️</span>
                <div className="pp-highlight-text">
                  LoadOps AI is a professional freight platform intended exclusively for users who are 18 years of age or older. We do not knowingly collect personal information from individuals under 18.
                </div>
              </div>
              <p className="pp-p">If we become aware that we have collected personal information from a minor without verified parental consent, we will take immediate steps to delete that information. If you believe a minor has provided us with personal data, please contact us at <a href="mailto:privacy@loadopsai.com">privacy@loadopsai.com</a>.</p>
            </div>
          </div>

          {/* ── SECTION 11 ── */}
          <div className="pp-section" id="changes">
            <div className="pp-section-header">
              <div className="pp-section-icon" style={{ background: "#EBF1FD" }}>📝</div>
              <div className="pp-section-num">11</div>
              <div className="pp-section-title">Policy Changes</div>
            </div>
            <div className="pp-section-body">
              <p className="pp-p">We may update this Privacy Policy from time to time to reflect changes in our services, legal requirements, or industry practices. When we make material changes, we will:</p>
              <div className="pp-check-list">
                {[
                  "Update the \"Last Updated\" date at the top of this page.",
                  "Send an email notification to your registered account email address.",
                  "Display a prominent notice in your dashboard upon next login.",
                  "For significant changes, request renewed consent where required by law.",
                ].map((item, i) => (
                  <div key={i} className="pp-check-item">{item}</div>
                ))}
              </div>
              <p className="pp-p">Your continued use of LoadOps AI after any policy update constitutes your acceptance of the revised terms. We encourage you to review this page periodically.</p>
            </div>
          </div>

          {/* ── SECTION 12: CONTACT ── */}
          <div id="contact" className="pp-contact-card">
            <div className="pp-contact-icon">✉️</div>
            <div className="pp-contact-title">Questions About This Policy?</div>
            <p className="pp-contact-sub">
              If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, our team is here to help. We aim to respond to all privacy inquiries within 30 days.
            </p>
            <div className="pp-contact-btns">
              <a href="mailto:privacy@loadopsai.com" className="pp-contact-btn primary">✉️ privacy@loadopsai.com</a>
              <button className="pp-contact-btn ghost" onClick={() => router.push("/contact")}>📞 Contact Page</button>
              <button className="pp-contact-btn ghost" onClick={() => router.push("/")}>← Back to Home</button>
            </div>
          </div>

          {/* FOOTER NOTE */}
          <div style={{ textAlign: "center", fontSize: "0.72rem", color: "var(--txt4)", lineHeight: 1.6, padding: "4px 0 8px" }}>
            LoadOps AI · Privacy Policy · Last Updated {lastUpdated}<br />
            This document is legally binding. By using our platform you agree to its terms.
          </div>

        </div>
      </div>
    </main>
  );
}
