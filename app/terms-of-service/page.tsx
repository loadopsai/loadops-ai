"use client";

import { useRouter } from "next/navigation";

export default function TermsOfService() {
  const router = useRouter();
  const lastUpdated = "May 27, 2026";
  const effectiveDate = "January 1, 2026";

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
          --green-m:  #A7F3C8;
          --amber:    #D97706;
          --amber-l:  #FEF3C7;
          --purple:   #7C3AED;
          --purple-l: #EDE9FE;
          --purple-m: #C4B5FD;
          --red:      #DC2626;
          --red-l:    #FEF2F2;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: none; }
        }

        /* ── HERO ── */
        .tos-hero {
          padding: 64px 5% 52px;
          background: var(--white);
          border-bottom: 1px solid var(--border);
          position: relative; overflow: hidden;
        }
        .tos-hero::before {
          content: '';
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 80% 60% at 50% -10%, rgba(26,86,219,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 5% 90%, rgba(18,161,80,0.03) 0%, transparent 55%),
            radial-gradient(ellipse 40% 30% at 95% 80%, rgba(124,58,237,0.03) 0%, transparent 55%);
        }
        .tos-hero::after {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(26,86,219,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(26,86,219,0.03) 1px, transparent 1px);
          background-size: 52px 52px;
          mask-image: radial-gradient(ellipse 70% 60% at 50% 0%, black 0%, transparent 70%);
        }
        .tos-hero-inner { position: relative; z-index: 1; max-width: 820px; }
        .tos-eyebrow { display: flex; align-items: center; gap: 8px; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--blue); margin-bottom: 14px; }
        .tos-eyebrow::before { content: ''; width: 20px; height: 2px; background: var(--blue); border-radius: 1px; }
        .tos-title { font-size: clamp(2rem, 4vw, 2.8rem); font-weight: 800; letter-spacing: -0.045em; color: var(--txt); line-height: 1.06; margin-bottom: 14px; font-family: 'Plus Jakarta Sans', sans-serif; }
        .tos-title em { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; color: var(--blue); }
        .tos-sub { font-size: 0.92rem; color: var(--txt3); line-height: 1.7; max-width: 600px; margin-bottom: 22px; }
        .tos-meta-row { display: flex; gap: 12px; flex-wrap: wrap; }
        .tos-meta-pill { display: flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 20px; font-size: 0.7rem; font-weight: 600; }
        .tos-meta-pill.updated   { background: var(--blue-l);   color: var(--blue);   border: 1px solid var(--blue-m); }
        .tos-meta-pill.effective { background: var(--green-l);  color: var(--green);  border: 1px solid var(--green-m); }
        .tos-meta-pill.legal     { background: var(--amber-l);  color: var(--amber);  border: 1px solid #FDE68A; }
        .tos-meta-pill.binding   { background: var(--red-l);    color: var(--red);    border: 1px solid #FEE2E2; }

        /* ── LAYOUT ── */
        .tos-layout { display: grid; grid-template-columns: 240px 1fr; gap: 40px; max-width: 1100px; margin: 0 auto; padding: 40px 5% 80px; align-items: start; }

        /* ── SIDEBAR TOC ── */
        .tos-toc { position: sticky; top: 88px; background: var(--white); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; }
        .tos-toc-header { padding: 16px 18px; border-bottom: 1px solid var(--border); font-size: 0.72rem; font-weight: 800; color: var(--txt); text-transform: uppercase; letter-spacing: 0.08em; background: var(--bg); }
        .tos-toc-list { display: flex; flex-direction: column; padding: 8px 0; }
        .tos-toc-item { padding: 8px 18px; font-size: 0.75rem; color: var(--txt3); text-decoration: none; font-weight: 500; transition: all 0.15s; border-left: 2px solid transparent; display: block; }
        .tos-toc-item:hover { color: var(--blue); background: var(--blue-l); border-left-color: var(--blue); }
        .tos-toc-num { font-size: 0.62rem; color: var(--txt4); font-weight: 700; margin-right: 6px; }

        /* ── CONTENT ── */
        .tos-content { display: flex; flex-direction: column; gap: 24px; }

        /* SECTION CARD */
        .tos-section { background: var(--white); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; animation: fadeUp 0.5s ease both; }
        .tos-section-header { padding: 20px 26px 16px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 12px; }
        .tos-section-icon { width: 36px; height: 36px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
        .tos-section-num { font-size: 0.62rem; font-weight: 800; padding: 2px 8px; border-radius: 4px; background: var(--blue-l); color: var(--blue); letter-spacing: 0.06em; flex-shrink: 0; }
        .tos-section-title { font-size: 0.95rem; font-weight: 800; color: var(--txt); letter-spacing: -0.02em; flex: 1; }
        .tos-section-body { padding: 20px 26px 24px; display: flex; flex-direction: column; gap: 14px; }

        /* TEXT */
        .tos-p { font-size: 0.84rem; color: var(--txt3); line-height: 1.78; font-weight: 400; }
        .tos-p b { color: var(--txt2); font-weight: 700; }
        .tos-p a { color: var(--blue); text-decoration: none; font-weight: 600; }
        .tos-p a:hover { text-decoration: underline; }

        /* HIGHLIGHT BOX */
        .tos-highlight { border-radius: 10px; padding: 14px 16px; display: flex; gap: 10px; align-items: flex-start; }
        .tos-highlight.blue   { background: var(--blue-l);   border: 1px solid var(--blue-m); }
        .tos-highlight.green  { background: var(--green-l);  border: 1px solid var(--green-m); }
        .tos-highlight.amber  { background: var(--amber-l);  border: 1px solid #FDE68A; }
        .tos-highlight.purple { background: var(--purple-l); border: 1px solid var(--purple-m); }
        .tos-highlight.red    { background: var(--red-l);    border: 1px solid #FEE2E2; }
        .tos-highlight-icon { font-size: 1rem; flex-shrink: 0; margin-top: 1px; }
        .tos-highlight-text { font-size: 0.8rem; line-height: 1.65; font-weight: 500; }
        .tos-highlight.blue   .tos-highlight-text { color: var(--blue);   }
        .tos-highlight.green  .tos-highlight-text { color: var(--green);  }
        .tos-highlight.amber  .tos-highlight-text { color: var(--amber);  }
        .tos-highlight.purple .tos-highlight-text { color: var(--purple); }
        .tos-highlight.red    .tos-highlight-text { color: var(--red);    }

        /* LIST */
        .tos-list { display: flex; flex-direction: column; gap: 8px; padding-left: 4px; }
        .tos-list-item { display: flex; align-items: flex-start; gap: 10px; font-size: 0.82rem; color: var(--txt3); line-height: 1.65; font-weight: 400; }
        .tos-list-item::before { content: '•'; color: var(--blue); font-weight: 800; font-size: 0.9rem; flex-shrink: 0; margin-top: 1px; }
        .tos-list-item b { color: var(--txt2); font-weight: 700; }

        /* CHECK LIST */
        .tos-check-list { display: flex; flex-direction: column; gap: 8px; }
        .tos-check-item { display: flex; align-items: flex-start; gap: 10px; font-size: 0.82rem; color: var(--txt3); line-height: 1.65; }
        .tos-check-item::before { content: '✓'; width: 18px; height: 18px; border-radius: 5px; background: var(--green-l); color: var(--green); display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 800; flex-shrink: 0; margin-top: 1px; }

        /* CROSS LIST */
        .tos-cross-list { display: flex; flex-direction: column; gap: 8px; }
        .tos-cross-item { display: flex; align-items: flex-start; gap: 10px; font-size: 0.82rem; color: var(--txt3); line-height: 1.65; }
        .tos-cross-item::before { content: '✕'; width: 18px; height: 18px; border-radius: 5px; background: var(--red-l); color: var(--red); display: flex; align-items: center; justify-content: center; font-size: 0.6rem; font-weight: 800; flex-shrink: 0; margin-top: 1px; }

        /* GRID */
        .tos-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .tos-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
        .tos-info-card { background: var(--bg); border: 1px solid var(--border); border-radius: 10px; padding: 14px 16px; }
        .tos-info-card-title { font-size: 0.75rem; font-weight: 700; color: var(--txt); margin-bottom: 5px; }
        .tos-info-card-desc  { font-size: 0.74rem; color: var(--txt3); line-height: 1.55; }

        /* ROLE PILLS */
        .tos-role-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .tos-role-card { border-radius: 12px; padding: 16px; border: 1px solid var(--border); }
        .tos-role-card.carrier    { background: var(--blue-l);   border-color: var(--blue-m); }
        .tos-role-card.broker     { background: var(--green-l);  border-color: var(--green-m); }
        .tos-role-card.dispatcher { background: var(--purple-l); border-color: var(--purple-m); }
        .tos-role-card-icon  { font-size: 1.3rem; margin-bottom: 8px; }
        .tos-role-card-title { font-size: 0.78rem; font-weight: 800; margin-bottom: 6px; }
        .tos-role-card.carrier    .tos-role-card-title { color: var(--blue); }
        .tos-role-card.broker     .tos-role-card-title { color: var(--green); }
        .tos-role-card.dispatcher .tos-role-card-title { color: var(--purple); }
        .tos-role-card-desc  { font-size: 0.72rem; color: var(--txt3); line-height: 1.55; font-weight: 400; }

        /* DIVIDER */
        .tos-divider { height: 1px; background: var(--border); }

        /* CONTACT CARD */
        .tos-contact-card { background: var(--white); border: 1px solid var(--border); border-radius: 16px; padding: 32px; text-align: center; }
        .tos-contact-icon { font-size: 2.2rem; margin-bottom: 12px; }
        .tos-contact-title { font-size: 1rem; font-weight: 800; color: var(--txt); margin-bottom: 8px; letter-spacing: -0.02em; }
        .tos-contact-sub { font-size: 0.82rem; color: var(--txt3); line-height: 1.65; margin-bottom: 22px; max-width: 460px; margin-left: auto; margin-right: auto; }
        .tos-contact-btns { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
        .tos-contact-btn { padding: 10px 22px; border-radius: 9px; font-size: 0.8rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; }
        .tos-contact-btn.primary { background: var(--blue); color: #fff; }
        .tos-contact-btn.primary:hover { background: #1446C0; transform: translateY(-1px); }
        .tos-contact-btn.ghost { background: var(--bg2); color: var(--txt2); border: 1.5px solid var(--border2); }
        .tos-contact-btn.ghost:hover { border-color: var(--blue-m); color: var(--blue); }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .tos-layout { grid-template-columns: 1fr; }
          .tos-toc { position: static; }
          .tos-grid-2, .tos-grid-3, .tos-role-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .tos-hero { padding: 40px 4% 36px; }
          .tos-layout { padding: 24px 4% 60px; gap: 20px; }
          .tos-section-body { padding: 16px 18px 20px; }
          .tos-section-header { padding: 16px 18px 12px; }
          .tos-grid-2 { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="tos-hero">
        <div className="tos-hero-inner">
          <div className="tos-eyebrow">Legal</div>
          <div className="tos-title">Terms of <em>Service</em></div>
          <p className="tos-sub">
            These Terms of Service govern your access to and use of LoadOps AI — including our load board, AI matching engine,
            dispatcher hub, carrier and broker dashboards, chat system, and all related services. Please read them carefully.
          </p>
          <div className="tos-meta-row">
            <div className="tos-meta-pill updated">📅 Last Updated: {lastUpdated}</div>
            <div className="tos-meta-pill effective">✓ Effective: {effectiveDate}</div>
            <div className="tos-meta-pill legal">⚖️ Legally Binding</div>
          </div>
        </div>
      </section>

      {/* ── LAYOUT ── */}
      <div className="tos-layout">

        {/* ── SIDEBAR TOC ── */}
        <nav className="tos-toc">
          <div className="tos-toc-header">Table of Contents</div>
          <div className="tos-toc-list">
            {[
              { num: "01", label: "Acceptance of Terms",        href: "#acceptance"    },
              { num: "02", label: "Eligibility",                href: "#eligibility"   },
              { num: "03", label: "Platform Description",       href: "#platform"      },
              { num: "04", label: "User Roles & Accounts",      href: "#accounts"      },
              { num: "05", label: "Permitted Use",              href: "#permitted"     },
              { num: "06", label: "Prohibited Activities",      href: "#prohibited"    },
              { num: "07", label: "AI Matching System",         href: "#ai"            },
              { num: "08", label: "Load Posting & Booking",     href: "#loads"         },
              { num: "09", label: "Dispatcher Profiles",        href: "#dispatchers"   },
              { num: "10", label: "Payments & Subscriptions",   href: "#payments"      },
              { num: "11", label: "Communication & Chat",       href: "#chat"          },
              { num: "12", label: "Intellectual Property",      href: "#ip"            },
              { num: "13", label: "Disclaimers",                href: "#disclaimers"   },
              { num: "14", label: "Limitation of Liability",   href: "#liability"     },
              { num: "15", label: "Indemnification",            href: "#indemnity"     },
              { num: "16", label: "Termination",                href: "#termination"   },
              { num: "17", label: "Governing Law",              href: "#governing"     },
              { num: "18", label: "Changes to Terms",           href: "#changes"       },
              { num: "19", label: "Contact Us",                 href: "#contact"       },
            ].map((item) => (
              <a key={item.href} href={item.href} className="tos-toc-item">
                <span className="tos-toc-num">{item.num}</span>{item.label}
              </a>
            ))}
          </div>
        </nav>

        {/* ── CONTENT ── */}
        <div className="tos-content">

          {/* BINDING NOTICE */}
          <div className="tos-highlight red">
            <span className="tos-highlight-icon">⚠️</span>
            <div className="tos-highlight-text">
              <b>IMPORTANT — PLEASE READ CAREFULLY.</b> By creating an account, accessing, or using LoadOps AI in any way, you agree to be legally bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, you must immediately discontinue use of the platform. These terms contain a limitation of liability clause and dispute resolution provisions.
            </div>
          </div>

          {/* ── SECTION 1 ── */}
          <div className="tos-section" id="acceptance">
            <div className="tos-section-header">
              <div className="tos-section-icon" style={{ background: "#EBF1FD" }}>📜</div>
              <div className="tos-section-num">01</div>
              <div className="tos-section-title">Acceptance of Terms</div>
            </div>
            <div className="tos-section-body">
              <p className="tos-p">
                These Terms of Service ("Terms") constitute a legally binding agreement between you ("User," "you," or "your") and LoadOps AI ("Company," "we," "us," or "our"), governing your use of the LoadOps AI platform, website, mobile applications, APIs, dashboards, and all associated services (collectively, the "Platform").
              </p>
              <p className="tos-p">
                By clicking "I Agree," creating an account, signing up, logging in, or otherwise accessing or using any part of the Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms and our <a href="/privacy-policy">Privacy Policy</a>, which is incorporated herein by reference.
              </p>
              <div className="tos-highlight blue">
                <span className="tos-highlight-icon">ℹ️</span>
                <div className="tos-highlight-text">
                  These Terms apply to all users of the Platform, including Carriers, Brokers, Dispatchers, and any other individuals or entities who access or use LoadOps AI in any capacity.
                </div>
              </div>
            </div>
          </div>

          {/* ── SECTION 2 ── */}
          <div className="tos-section" id="eligibility">
            <div className="tos-section-header">
              <div className="tos-section-icon" style={{ background: "#E6F7EE" }}>✅</div>
              <div className="tos-section-num">02</div>
              <div className="tos-section-title">Eligibility</div>
            </div>
            <div className="tos-section-body">
              <p className="tos-p">To use LoadOps AI, you must meet all of the following eligibility requirements:</p>
              <div className="tos-check-list">
                {[
                  "Be at least 18 years of age or the age of majority in your jurisdiction, whichever is greater.",
                  "Have the legal capacity and authority to enter into binding contracts.",
                  "Be a resident of, or operate a business legally registered in, the United States.",
                  "Not be barred from using the Platform under any applicable law.",
                  "Not have had a previous LoadOps AI account terminated for violation of these Terms.",
                  "Possess or represent a business with valid operating authority as required by FMCSA regulations (for Carriers and Brokers).",
                  "Provide accurate, current, and complete information during registration and maintain it thereafter.",
                ].map((item, i) => <div key={i} className="tos-check-item">{item}</div>)}
              </div>
              <div className="tos-highlight amber">
                <span className="tos-highlight-icon">⚠️</span>
                <div className="tos-highlight-text">
                  By using the Platform, you represent and warrant that you meet all eligibility requirements. LoadOps AI reserves the right to verify eligibility at any time and to suspend or terminate accounts that do not meet these requirements.
                </div>
              </div>
            </div>
          </div>

          {/* ── SECTION 3 ── */}
          <div className="tos-section" id="platform">
            <div className="tos-section-header">
              <div className="tos-section-icon" style={{ background: "#EBF1FD" }}>🚛</div>
              <div className="tos-section-num">03</div>
              <div className="tos-section-title">Platform Description</div>
            </div>
            <div className="tos-section-body">
              <p className="tos-p">
                LoadOps AI is an AI-powered freight technology platform that connects carriers, freight brokers, and dispatchers through intelligent automation, verified load opportunities, and smart load booking systems. The Platform includes:
              </p>
              <div className="tos-grid-2">
                {[
                  { title: "AI Load Board",        desc: "A live, searchable database of available freight loads posted by verified brokers, with AI-powered filtering and sorting." },
                  { title: "AI Matching Engine",   desc: "An intelligent system that analyzes carrier profiles, equipment, lanes, and availability to surface relevant load opportunities automatically." },
                  { title: "Dispatcher Hub",       desc: "A professional marketplace where dispatchers build portfolios, post loads, and get discovered by carriers based on verified performance." },
                  { title: "Role Dashboards",      desc: "Three dedicated dashboards tailored specifically for Carriers, Brokers, and Dispatchers with role-specific tools and features." },
                  { title: "AI Email Alerts",      desc: "Automated email notifications delivering matched load opportunities directly to carrier and dispatcher inboxes in real-time." },
                  { title: "Chat & Call System",   desc: "Real-time messaging, file sharing, voice notes, and encrypted video/voice calling between platform users." },
                ].map((c, i) => (
                  <div key={i} className="tos-info-card">
                    <div className="tos-info-card-title">{c.title}</div>
                    <div className="tos-info-card-desc">{c.desc}</div>
                  </div>
                ))}
              </div>
              <div className="tos-highlight blue">
                <span className="tos-highlight-icon">ℹ️</span>
                <div className="tos-highlight-text">
                  LoadOps AI is a technology platform and marketplace — not a freight broker, carrier, dispatcher, or logistics provider. We do not take possession of freight, guarantee load availability, or act as a party to any freight transaction between users.
                </div>
              </div>
            </div>
          </div>

          {/* ── SECTION 4 ── */}
          <div className="tos-section" id="accounts">
            <div className="tos-section-header">
              <div className="tos-section-icon" style={{ background: "#EDE9FE" }}>👤</div>
              <div className="tos-section-num">04</div>
              <div className="tos-section-title">User Roles & Accounts</div>
            </div>
            <div className="tos-section-body">
              <p className="tos-p">LoadOps AI offers three distinct user roles, each with its own dashboard, tools, and responsibilities:</p>
              <div className="tos-role-grid">
                <div className="tos-role-card carrier">
                  <div className="tos-role-card-icon">🚛</div>
                  <div className="tos-role-card-title">Carrier</div>
                  <div className="tos-role-card-desc">Owner-operators and trucking companies. Must hold valid MC authority, insurance, and USDOT number. Responsible for all loads booked through the Platform.</div>
                </div>
                <div className="tos-role-card broker">
                  <div className="tos-role-card-icon">📦</div>
                  <div className="tos-role-card-title">Broker</div>
                  <div className="tos-role-card-desc">Licensed freight brokers posting loads. Must hold a valid FMCSA broker authority. Responsible for the accuracy of load details and payment terms posted.</div>
                </div>
                <div className="tos-role-card dispatcher">
                  <div className="tos-role-card-icon">🎯</div>
                  <div className="tos-role-card-title">Dispatcher</div>
                  <div className="tos-role-card-desc">Freight dispatchers managing carrier operations. Responsible for the accuracy of their profile, lane specialties, and load posting information.</div>
                </div>
              </div>
              <p className="tos-p">You are responsible for maintaining the confidentiality of your account credentials. You must immediately notify LoadOps AI of any unauthorized use of your account. You may not share, transfer, or sell your account to any other party. Each user may only maintain one active account per role.</p>
            </div>
          </div>

          {/* ── SECTION 5 ── */}
          <div className="tos-section" id="permitted">
            <div className="tos-section-header">
              <div className="tos-section-icon" style={{ background: "#E6F7EE" }}>✅</div>
              <div className="tos-section-num">05</div>
              <div className="tos-section-title">Permitted Use</div>
            </div>
            <div className="tos-section-body">
              <p className="tos-p">Subject to your compliance with these Terms, LoadOps AI grants you a limited, non-exclusive, non-transferable, revocable license to access and use the Platform for your legitimate freight business purposes, including:</p>
              <div className="tos-check-list">
                {[
                  "Searching, filtering, and viewing available freight loads on the load board.",
                  "Submitting booking requests for available loads that match your equipment and qualifications.",
                  "Posting freight loads as a licensed broker with accurate and complete load information.",
                  "Creating and maintaining a professional dispatcher profile with truthful information.",
                  "Communicating with other platform users through the built-in chat and call system.",
                  "Setting up AI load alert preferences to receive relevant freight opportunities.",
                  "Uploading compliance documents including MC authority, insurance, W9, and USDOT certificates.",
                  "Reviewing broker ratings, payment history, and carrier performance data.",
                ].map((item, i) => <div key={i} className="tos-check-item">{item}</div>)}
              </div>
            </div>
          </div>

          {/* ── SECTION 6 ── */}
          <div className="tos-section" id="prohibited">
            <div className="tos-section-header">
              <div className="tos-section-icon" style={{ background: "#FEF2F2" }}>🚫</div>
              <div className="tos-section-num">06</div>
              <div className="tos-section-title">Prohibited Activities</div>
            </div>
            <div className="tos-section-body">
              <p className="tos-p">The following activities are strictly prohibited on LoadOps AI and may result in immediate account termination, legal action, or referral to law enforcement:</p>
              <div className="tos-cross-list">
                {[
                  "Posting fraudulent, false, or misleading load information, rates, or broker credentials.",
                  "Impersonating another user, company, broker, or FMCSA-regulated entity.",
                  "Using the Platform to solicit carriers or dispatchers for purposes outside of legitimate freight operations.",
                  "Attempting to bypass, circumvent, or disable any security, authentication, or access control features.",
                  "Scraping, crawling, or harvesting data from the Platform using automated tools or bots.",
                  "Transmitting spam, phishing messages, malware, or unsolicited commercial communications through the chat system.",
                  "Using the Platform for any activity that violates FMCSA regulations, DOT rules, or applicable federal or state law.",
                  "Reverse engineering, decompiling, or attempting to access the source code or underlying algorithms of the Platform.",
                  "Reselling, sublicensing, or redistributing Platform access without explicit written permission from LoadOps AI.",
                  "Posting, transmitting, or sharing content that is defamatory, obscene, discriminatory, harassing, or otherwise objectionable.",
                  "Double-brokering loads, re-brokering without authorization, or engaging in freight fraud of any kind.",
                  "Creating multiple accounts to circumvent suspensions, bans, or rating systems.",
                ].map((item, i) => <div key={i} className="tos-cross-item">{item}</div>)}
              </div>
              <div className="tos-highlight red">
                <span className="tos-highlight-icon">🚨</span>
                <div className="tos-highlight-text">
                  Freight fraud, double-brokering, identity fraud, or any violation of FMCSA regulations discovered on the Platform will be immediately reported to the appropriate law enforcement and regulatory authorities. LoadOps AI cooperates fully with FMCSA investigations.
                </div>
              </div>
            </div>
          </div>

          {/* ── SECTION 7 ── */}
          <div className="tos-section" id="ai">
            <div className="tos-section-header">
              <div className="tos-section-icon" style={{ background: "#EBF1FD" }}>🤖</div>
              <div className="tos-section-num">07</div>
              <div className="tos-section-title">AI Matching System</div>
            </div>
            <div className="tos-section-body">
              <p className="tos-p">
                The LoadOps AI matching engine uses machine learning algorithms to connect loads with carriers and dispatchers. By using the Platform, you acknowledge and agree to the following:
              </p>
              <div className="tos-list">
                {[
                  { label: "No Guarantee of Matches:", text: "The AI matching system provides recommendations based on your profile data but does not guarantee that you will receive loads, find carriers, or be matched with any particular party." },
                  { label: "Accuracy of Profile Data:", text: "The quality of AI matches depends entirely on the accuracy and completeness of your profile. You are solely responsible for keeping your equipment, lanes, and availability current." },
                  { label: "No Employment Relationship:", text: "AI-facilitated connections between dispatchers and carriers, or between brokers and carriers, do not create an employment, agency, joint venture, or partnership relationship with LoadOps AI." },
                  { label: "Email Alert Opt-Out:", text: "AI load alert emails are sent based on your preferences. You may opt out at any time from your dashboard settings. Standard email unsubscribe links are also included in every alert email." },
                  { label: "Algorithm Updates:", text: "LoadOps AI reserves the right to modify, retrain, or replace the AI matching algorithm at any time without notice to improve accuracy, performance, or compliance." },
                ].map((item, i) => (
                  <div key={i} className="tos-list-item"><span><b>{item.label}</b> {item.text}</span></div>
                ))}
              </div>
            </div>
          </div>

          {/* ── SECTION 8 ── */}
          <div className="tos-section" id="loads">
            <div className="tos-section-header">
              <div className="tos-section-icon" style={{ background: "#E6F7EE" }}>📦</div>
              <div className="tos-section-num">08</div>
              <div className="tos-section-title">Load Posting & Booking</div>
            </div>
            <div className="tos-section-body">
              <p className="tos-p">LoadOps AI facilitates load postings by brokers and booking requests by carriers. The following terms govern these transactions:</p>
              <div className="tos-list">
                {[
                  { label: "Broker Responsibility:", text: "Brokers are solely responsible for the accuracy of all load details, including pickup/delivery locations, equipment requirements, weight, rates, payment terms, and pickup dates. Posting inaccurate information is a violation of these Terms." },
                  { label: "Carrier Responsibility:", text: "Carriers are solely responsible for verifying load suitability, confirming their equipment meets requirements, holding appropriate insurance, and fulfilling all obligations upon booking." },
                  { label: "No Transaction Guarantee:", text: "Submission of a booking request does not guarantee confirmation of the load. Brokers retain the right to accept or decline booking requests at their discretion." },
                  { label: "Rate Confirmations:", text: "Digital rate confirmations generated through the Platform serve as the primary agreement between broker and carrier. LoadOps AI is not a party to any such agreement." },
                  { label: "Disputes:", text: "Disputes between brokers and carriers regarding load execution, payment, or performance are the sole responsibility of the parties involved. LoadOps AI does not arbitrate or mediate freight disputes but may provide communication records upon lawful request." },
                  { label: "Platform Role:", text: "LoadOps AI acts as a neutral technology marketplace. We do not take title to freight, negotiate rates, or guarantee delivery performance between users." },
                ].map((item, i) => (
                  <div key={i} className="tos-list-item"><span><b>{item.label}</b> {item.text}</span></div>
                ))}
              </div>
            </div>
          </div>

          {/* ── SECTION 9 ── */}
          <div className="tos-section" id="dispatchers">
            <div className="tos-section-header">
              <div className="tos-section-icon" style={{ background: "#EDE9FE" }}>🎯</div>
              <div className="tos-section-num">09</div>
              <div className="tos-section-title">Dispatcher Profiles</div>
            </div>
            <div className="tos-section-body">
              <p className="tos-p">Dispatchers on LoadOps AI create professional profiles to be discovered by carriers. The following terms apply to dispatcher profile listings:</p>
              <div className="tos-check-list">
                {[
                  "All information in a dispatcher profile — including experience, lanes, truck types, and rates — must be truthful and accurate.",
                  "Dispatchers must not misrepresent their qualifications, load volume, active carrier count, or earnings history.",
                  "Dispatcher profiles are publicly visible to all registered carriers on the Platform.",
                  "Reviews and ratings submitted by carriers about dispatchers must reflect genuine experiences and cannot be manipulated.",
                  "Dispatchers agree that LoadOps AI may display their profile information to facilitate carrier connections.",
                  "Dispatchers who manage carrier accounts must have explicit written authorization from each carrier they represent.",
                  "A carrier-dispatcher relationship established through the Platform does not create employment with LoadOps AI.",
                ].map((item, i) => <div key={i} className="tos-check-item">{item}</div>)}
              </div>
            </div>
          </div>

          {/* ── SECTION 10 ── */}
          <div className="tos-section" id="payments">
            <div className="tos-section-header">
              <div className="tos-section-icon" style={{ background: "#FEF3C7" }}>💳</div>
              <div className="tos-section-num">10</div>
              <div className="tos-section-title">Payments & Subscriptions</div>
            </div>
            <div className="tos-section-body">
              <p className="tos-p">Access to certain features of LoadOps AI requires a paid subscription. By subscribing, you agree to the following payment terms:</p>
              <div className="tos-grid-2">
                {[
                  { title: "Billing Cycle",        desc: "Subscriptions are billed monthly or annually in advance. Your billing date is set at the time of initial subscription." },
                  { title: "Auto-Renewal",          desc: "Subscriptions automatically renew at the end of each billing period unless cancelled before the renewal date." },
                  { title: "Refund Policy",         desc: "We offer a 7-day free trial. Payments made after the trial period are non-refundable unless required by applicable law." },
                  { title: "Price Changes",         desc: "We reserve the right to modify subscription pricing. You will be notified at least 30 days before any price increase takes effect." },
                  { title: "Payment Failure",       desc: "If payment fails, your account may be downgraded or suspended. We will attempt to re-charge within 3 days before suspending access." },
                  { title: "Cancellation",          desc: "You may cancel at any time from your account settings. Cancellation takes effect at the end of your current billing period." },
                ].map((c, i) => (
                  <div key={i} className="tos-info-card">
                    <div className="tos-info-card-title">{c.title}</div>
                    <div className="tos-info-card-desc">{c.desc}</div>
                  </div>
                ))}
              </div>
              <p className="tos-p">Freight payments, dispatcher fees, and broker-carrier transactions are separate from LoadOps AI subscription fees and are governed solely by the agreements between the parties involved.</p>
            </div>
          </div>

          {/* ── SECTION 11 ── */}
          <div className="tos-section" id="chat">
            <div className="tos-section-header">
              <div className="tos-section-icon" style={{ background: "#EBF1FD" }}>💬</div>
              <div className="tos-section-num">11</div>
              <div className="tos-section-title">Communication & Chat</div>
            </div>
            <div className="tos-section-body">
              <p className="tos-p">The LoadOps AI platform includes real-time chat, file sharing, voice notes, and video/voice calling features. By using these communication tools, you agree that:</p>
              <div className="tos-list">
                {[
                  { label: "Professional Use Only:", text: "All communications through the platform must be professional, freight-related, and compliant with applicable laws. Harassment, threats, discrimination, or solicitation for non-freight purposes is strictly prohibited." },
                  { label: "Message Retention:", text: "Chat messages are stored on our servers for up to 12 months for operational and safety purposes. Voice recordings are deleted within 30 days." },
                  { label: "No Expectation of Privacy:", text: "While messages are encrypted in transit, LoadOps AI may review communications to investigate violations, fraud, or safety concerns. Do not share sensitive financial or personal information through the chat system." },
                  { label: "File Sharing:", text: "Files shared through the platform must be business-related and free of malware, illegal content, or material that infringes intellectual property rights." },
                  { label: "Call Recording:", text: "Video and voice calls through the Platform are not automatically recorded. Any recording of calls must comply with applicable wiretapping and consent laws in your jurisdiction." },
                ].map((item, i) => (
                  <div key={i} className="tos-list-item"><span><b>{item.label}</b> {item.text}</span></div>
                ))}
              </div>
            </div>
          </div>

          {/* ── SECTION 12 ── */}
          <div className="tos-section" id="ip">
            <div className="tos-section-header">
              <div className="tos-section-icon" style={{ background: "#EDE9FE" }}>©</div>
              <div className="tos-section-num">12</div>
              <div className="tos-section-title">Intellectual Property</div>
            </div>
            <div className="tos-section-body">
              <p className="tos-p">
                The LoadOps AI Platform — including its name, logo, design, source code, algorithms, AI models, dashboards, features, text, graphics, and all related intellectual property — is owned exclusively by LoadOps AI and is protected by applicable copyright, trademark, patent, and trade secret laws.
              </p>
              <div className="tos-list">
                {[
                  { label: "License to You:", text: "We grant you a limited, revocable, non-exclusive, non-transferable license to use the Platform for your legitimate freight business purposes only. No other rights are granted." },
                  { label: "Your Content:", text: "By posting load information, profile content, or other materials on the Platform, you grant LoadOps AI a worldwide, royalty-free license to use, display, and process that content to operate and improve the Platform." },
                  { label: "No Reverse Engineering:", text: "You may not copy, modify, reverse engineer, decompile, disassemble, or attempt to derive source code from any part of the Platform." },
                  { label: "Feedback:", text: "Any feedback, suggestions, or ideas you provide about the Platform may be used by LoadOps AI without compensation or attribution to you." },
                ].map((item, i) => (
                  <div key={i} className="tos-list-item"><span><b>{item.label}</b> {item.text}</span></div>
                ))}
              </div>
            </div>
          </div>

          {/* ── SECTION 13 ── */}
          <div className="tos-section" id="disclaimers">
            <div className="tos-section-header">
              <div className="tos-section-icon" style={{ background: "#FEF3C7" }}>⚠️</div>
              <div className="tos-section-num">13</div>
              <div className="tos-section-title">Disclaimers</div>
            </div>
            <div className="tos-section-body">
              <div className="tos-highlight amber">
                <span className="tos-highlight-icon">⚠️</span>
                <div className="tos-highlight-text">
                  <b>THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND.</b> LoadOps AI expressly disclaims all warranties, whether express, implied, or statutory, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
                </div>
              </div>
              <p className="tos-p">LoadOps AI does not warrant or represent that:</p>
              <div className="tos-cross-list">
                {[
                  "The Platform will be uninterrupted, error-free, secure, or free of viruses or other harmful components.",
                  "Load information posted by brokers is accurate, current, available, or legally compliant.",
                  "Carrier, dispatcher, or broker profiles are accurate, verified, or representative of actual qualifications.",
                  "AI matching results will be suitable, profitable, or optimal for your specific situation.",
                  "Any load will be successfully booked, executed, or paid for as a result of using the Platform.",
                  "The Platform will meet your specific business requirements or expectations.",
                ].map((item, i) => <div key={i} className="tos-cross-item">{item}</div>)}
              </div>
            </div>
          </div>

          {/* ── SECTION 14 ── */}
          <div className="tos-section" id="liability">
            <div className="tos-section-header">
              <div className="tos-section-icon" style={{ background: "#FEF2F2" }}>⚖️</div>
              <div className="tos-section-num">14</div>
              <div className="tos-section-title">Limitation of Liability</div>
            </div>
            <div className="tos-section-body">
              <div className="tos-highlight red">
                <span className="tos-highlight-icon">🚨</span>
                <div className="tos-highlight-text">
                  <b>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW,</b> LoadOps AI, its officers, directors, employees, affiliates, agents, and licensors shall not be liable for any indirect, incidental, special, consequential, exemplary, or punitive damages arising from or related to your use of the Platform.
                </div>
              </div>
              <p className="tos-p">This includes, without limitation, damages for:</p>
              <div className="tos-cross-list">
                {[
                  "Loss of revenue, income, profits, or business opportunities.",
                  "Loss of data, loads, bookings, or business relationships.",
                  "Cargo damage, freight loss, or delivery failures resulting from transactions facilitated through the Platform.",
                  "Disputes, fraud, or misconduct by other users of the Platform.",
                  "Platform downtime, technical failures, or interruptions to AI matching services.",
                  "Unauthorized access to your account or data by third parties.",
                ].map((item, i) => <div key={i} className="tos-cross-item">{item}</div>)}
              </div>
              <p className="tos-p">
                In jurisdictions where the exclusion of liability is not permitted, our liability shall be limited to the maximum extent allowed by law. In no event shall LoadOps AI's total aggregate liability exceed the greater of <b>(a) $100 USD</b> or <b>(b) the total amount you paid to LoadOps AI in the 3 months preceding the claim.</b>
              </p>
            </div>
          </div>

          {/* ── SECTION 15 ── */}
          <div className="tos-section" id="indemnity">
            <div className="tos-section-header">
              <div className="tos-section-icon" style={{ background: "#EBF1FD" }}>🛡</div>
              <div className="tos-section-num">15</div>
              <div className="tos-section-title">Indemnification</div>
            </div>
            <div className="tos-section-body">
              <p className="tos-p">
                You agree to indemnify, defend, and hold harmless LoadOps AI and its officers, directors, employees, agents, successors, and assigns from and against any and all claims, liabilities, damages, losses, costs, and expenses (including reasonable attorneys' fees) arising out of or relating to:
              </p>
              <div className="tos-list">
                {[
                  { label: "", text: "Your use of or access to the Platform." },
                  { label: "", text: "Your violation of these Terms or any applicable law, regulation, or rule." },
                  { label: "", text: "Your violation of any third-party rights, including intellectual property, privacy, or contractual rights." },
                  { label: "", text: "Any load posting, booking, or freight transaction you conduct through the Platform." },
                  { label: "", text: "Any content, data, or information you submit, post, or transmit through the Platform." },
                  { label: "", text: "Any dispute between you and another user of the Platform." },
                ].map((item, i) => (
                  <div key={i} className="tos-list-item"><span>{item.text}</span></div>
                ))}
              </div>
            </div>
          </div>

          {/* ── SECTION 16 ── */}
          <div className="tos-section" id="termination">
            <div className="tos-section-header">
              <div className="tos-section-icon" style={{ background: "#FEF2F2" }}>🔐</div>
              <div className="tos-section-num">16</div>
              <div className="tos-section-title">Termination</div>
            </div>
            <div className="tos-section-body">
              <p className="tos-p">Either party may terminate the user relationship at any time:</p>
              <div className="tos-list">
                {[
                  { label: "By You:", text: "You may close your account at any time from your dashboard settings. Account closure takes effect within 24 hours. Termination does not entitle you to a refund of any prepaid subscription fees." },
                  { label: "By LoadOps AI:", text: "We may suspend or terminate your account immediately, without notice, if we determine in our sole discretion that you have violated these Terms, engaged in fraudulent activity, or your continued use poses a risk to other users or the Platform." },
                  { label: "Effect of Termination:", text: "Upon termination, your right to access the Platform ceases immediately. Your data will be handled in accordance with our Privacy Policy and applicable data retention obligations." },
                  { label: "Surviving Provisions:", text: "Sections relating to intellectual property, disclaimers, limitation of liability, indemnification, and governing law shall survive any termination of these Terms." },
                ].map((item, i) => (
                  <div key={i} className="tos-list-item"><span><b>{item.label}</b> {item.text}</span></div>
                ))}
              </div>
            </div>
          </div>

          {/* ── SECTION 17 ── */}
          <div className="tos-section" id="governing">
            <div className="tos-section-header">
              <div className="tos-section-icon" style={{ background: "#EDE9FE" }}>🏛</div>
              <div className="tos-section-num">17</div>
              <div className="tos-section-title">Governing Law & Disputes</div>
            </div>
            <div className="tos-section-body">
              <p className="tos-p">
                These Terms shall be governed by and construed in accordance with the laws of the <b>State of Texas, United States of America</b>, without regard to its conflict of law provisions. Any dispute arising from or relating to these Terms or the Platform shall be resolved as follows:
              </p>
              <div className="tos-list">
                {[
                  { label: "Informal Resolution:", text: "Before initiating formal proceedings, both parties agree to attempt good-faith resolution through direct negotiation for a period of 30 days." },
                  { label: "Binding Arbitration:", text: "If informal resolution fails, disputes shall be submitted to binding arbitration administered by the American Arbitration Association (AAA) under its Commercial Arbitration Rules, in Dallas, Texas." },
                  { label: "Class Action Waiver:", text: "YOU AGREE TO WAIVE YOUR RIGHT TO PARTICIPATE IN CLASS ACTION LAWSUITS OR CLASS-WIDE ARBITRATION AGAINST LOADOPS AI. All disputes must be brought in your individual capacity only." },
                  { label: "Exception:", text: "Either party may seek emergency injunctive or equitable relief from a court of competent jurisdiction in Dallas County, Texas to prevent irreparable harm, without waiving the right to arbitration." },
                ].map((item, i) => (
                  <div key={i} className="tos-list-item"><span><b>{item.label}</b> {item.text}</span></div>
                ))}
              </div>
            </div>
          </div>

          {/* ── SECTION 18 ── */}
          <div className="tos-section" id="changes">
            <div className="tos-section-header">
              <div className="tos-section-icon" style={{ background: "#EBF1FD" }}>📝</div>
              <div className="tos-section-num">18</div>
              <div className="tos-section-title">Changes to Terms</div>
            </div>
            <div className="tos-section-body">
              <p className="tos-p">
                LoadOps AI reserves the right to modify these Terms of Service at any time. When we make material changes, we will notify you by:
              </p>
              <div className="tos-check-list">
                {[
                  "Updating the \"Last Updated\" date at the top of this page.",
                  "Sending an email notification to your registered account email address at least 14 days before changes take effect.",
                  "Displaying a prominent notice within your dashboard on next login.",
                  "For material changes affecting payment terms or liability, obtaining renewed consent where required by law.",
                ].map((item, i) => <div key={i} className="tos-check-item">{item}</div>)}
              </div>
              <p className="tos-p">
                Your continued use of the Platform after the effective date of any revised Terms constitutes your binding acceptance of those changes. If you disagree with updated Terms, you must stop using the Platform and close your account before the effective date.
              </p>
              <div className="tos-highlight blue">
                <span className="tos-highlight-icon">ℹ️</span>
                <div className="tos-highlight-text">
                  We recommend bookmarking this page and reviewing it periodically. The most current version of the Terms of Service is always available at <b>loadopsai.com/terms-of-service</b>.
                </div>
              </div>
            </div>
          </div>

          {/* ── SECTION 19: CONTACT ── */}
          <div id="contact" className="tos-contact-card">
            <div className="tos-contact-icon">⚖️</div>
            <div className="tos-contact-title">Questions About These Terms?</div>
            <p className="tos-contact-sub">
              If you have any questions, concerns, or need clarification about these Terms of Service, please contact our legal team. We aim to respond to all legal inquiries within 5 business days.
            </p>
            <div className="tos-contact-btns">
              <a href="mailto:support@loadopsai.co" className="tos-contact-btn primary">⚖️ support@loadopsai.co</a>
              <button className="tos-contact-btn ghost" onClick={() => router.push("/")}>← Back to Home</button>
            </div>
          </div>

          {/* FOOTER NOTE */}
          <div style={{ textAlign: "center", fontSize: "0.72rem", color: "var(--txt4)", lineHeight: 1.65, padding: "4px 0 8px" }}>
            LoadOps AI · Terms of Service · Last Updated {lastUpdated} · Effective {effectiveDate}<br />
            By using our platform you agree to be legally bound by these terms. © 2026 LoadOps AI. All rights reserved.
          </div>

        </div>
      </div>
    </main>
  );
}
