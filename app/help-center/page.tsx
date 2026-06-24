"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type FaqItem = { question: string; answer: string };

const faqData: Record<string, FaqItem[]> = {
  general: [
    { question: "What is LoadOps AI?", answer: "LoadOps AI is an AI-powered freight operations platform built specifically for carriers, brokers, dispatchers, and logistics teams. It combines a live load board, AI matching engine, dispatcher marketplace, real-time chat and calling, and role-specific dashboards into one unified platform — replacing the patchwork of DAT searches, cold calls, and email chains." },
    { question: "Who can use LoadOps AI?", answer: "LoadOps AI is built for three primary user types: Carriers (owner-operators and trucking companies looking for loads), Brokers (licensed freight brokers posting and covering loads), and Dispatchers (professional freight dispatchers building their client base and posting available loads). Each role gets a dedicated dashboard with purpose-built tools." },
    { question: "Is LoadOps AI FMCSA compliant?", answer: "Yes. All carriers and brokers on LoadOps AI are required to provide their MC number, USDOT number, and insurance documentation during verification. The platform follows FMCSA recordkeeping requirements for load history, booking records, and compliance documents." },
    { question: "How does the AI matching system work?", answer: "When a load is posted or a carrier creates a profile, the AI engine analyzes equipment type, home region, preferred lanes, availability, rate preferences, and historical booking data to generate match scores. Matched loads are pushed to carrier inboxes before they appear publicly on the load board — giving verified carriers a first-mover advantage." },
    { question: "Is LoadOps AI free to use?", answer: "LoadOps AI offers a free trial period. After the trial, access to premium features — including AI inbox alerts, broker credit scores, dispatcher marketplace, and advanced filtering — requires a paid subscription starting at $19/month. Visit our Pricing page for full plan details." },
    { question: "How do I contact support?", answer: "You can reach our support team at support@loadopsai.com, through the Contact page on the platform, or by using the in-platform chat system. We respond to all inquiries within 1 business day." },
  ],
  carriers: [
    { question: "How do I find loads as a carrier?", answer: "After creating your carrier account and setting your preferences (equipment type, home region, preferred lanes, minimum rate), the AI matching engine will start pushing relevant loads to your inbox automatically. You can also search and filter the live load board manually using pickup/delivery location, equipment type, rate, and weight filters." },
    { question: "What is the AI Load Inbox?", answer: "The AI Load Inbox delivers matched loads directly to your carrier dashboard — typically before they appear publicly on the load board. The AI learns your preferences over time, improving match quality with every booking. You also receive email alerts for high-priority matches even when you're not logged in." },
    { question: "How do I book a load?", answer: "Click 'Book Load' on any load card. A booking request is submitted to the broker instantly. Once the broker accepts, a digital rate confirmation is generated automatically and stored in your dashboard. No phone calls, no email chains — the entire process is digital." },
    { question: "How do I verify my MC and USDOT?", answer: "During account setup, you'll be prompted to upload your MC authority certificate, USDOT registration, and insurance certificate. Our team verifies these documents within 24 hours. Once verified, your profile will display a 'Verified' badge, increasing load acceptance rates from brokers." },
    { question: "Can I see broker credit scores before booking?", answer: "Yes. Every load card and broker profile on LoadOps AI displays the broker's credit score, average payment timeline (e.g., 'Pays avg 14 days'), and carrier ratings from previous hauls. This helps you make informed booking decisions and avoid slow-pay or problematic brokers." },
    { question: "How do I find a dispatcher through LoadOps AI?", answer: "Navigate to the Dispatcher Hub from the main navigation. Browse verified dispatcher profiles, filter by equipment specialties, lanes, and dispatch fee, and contact dispatchers directly through the platform's chat system. You can review their ratings and load history before committing." },
    { question: "Can I save loads for later?", answer: "Yes. On every load card there is a 'Save' button (☆). Saved loads are stored in your carrier dashboard under Saved Loads for easy access. The saved count is displayed in your stats bar so you always know how many loads you have saved." },
    { question: "What documents do I need to upload?", answer: "To fully verify your carrier account, you should upload: MC Authority certificate, Insurance Certificate (with current dates), USDOT registration, W9 form, and Driver License. These documents are stored securely and are accessible only to brokers you engage with on the platform." },
  ],
  brokers: [
    { question: "How do I post a load as a broker?", answer: "From your Broker Dashboard, go to the 'Post Load' tab. Fill in pickup location, delivery location, equipment type, load type (FTL or Partial), weight, total rate, pickup date, and any special instructions. Your load goes live on the board instantly — AI matching begins within seconds of posting." },
    { question: "How does AI carrier matching work for brokers?", answer: "The moment your load is posted, the AI engine scans carrier profiles across the platform and surfaces the top-matching carriers based on equipment, location, lane history, and reliability score. Matched carriers are notified via their AI inbox and email alerts — dramatically reducing the time to coverage." },
    { question: "How are rate confirmations handled?", answer: "When a carrier submits a booking request and you accept, a digital rate confirmation is automatically generated. It includes all load details, the carrier's MC number and USDOT, your broker information, and the agreed rate. Rate cons are stored in your dashboard and available for download as PDF." },
    { question: "Can I verify a carrier's credentials before accepting a booking?", answer: "Yes. Every booking request includes the carrier's MC number, USDOT, insurance status, and platform rating. You can click through to their full carrier profile to review their verification status, booking history, and ratings from other brokers before accepting any booking request." },
    { question: "How do I manage my posted loads?", answer: "All your posted loads are visible in the 'Posted Loads' tab of your Broker Dashboard. Each load shows its current status (Available or Booked), booking requests received, and the carrier assigned. You can edit load details or mark a load as unavailable at any time." },
    { question: "What happens if a carrier doesn't show up?", answer: "If a carrier fails to pick up a load, you should first contact them via the platform's chat or call system. If unresponsive, you can re-post the load and file a dispute report through the platform. LoadOps AI maintains a record of carrier no-shows which affects their reliability score and visibility." },
    { question: "Is there a limit on how many loads I can post?", answer: "Load posting limits depend on your subscription plan. The Starter plan includes up to 10 active loads, the Pro plan includes unlimited loads, and the Enterprise plan includes unlimited loads plus priority placement. Visit the Pricing page for full plan details." },
    { question: "How do I contact a carrier after they book a load?", answer: "Once a booking is confirmed, you can message the carrier directly through the LoadOps AI chat system from your dashboard. You can also initiate a video or voice call through the platform's call feature — all without sharing personal phone numbers or email addresses." },
  ],
  dispatchers: [
    { question: "How do I set up my dispatcher profile?", answer: "Go to your Dispatcher Dashboard and complete the Profile tab. Fill in your full name, company name, contact information, years of experience, truck types you specialize in, preferred lanes, dispatch fee, and a professional bio. Upload a profile photo and toggle your service features (Available 24/7, Factoring Assistance, Setup Packets). Save your profile to make it visible to carriers on the Dispatcher Hub." },
    { question: "How do carriers find me on LoadOps AI?", answer: "Your dispatcher profile is listed in the Dispatcher Hub, which is accessible to all registered carriers. Carriers can filter dispatchers by equipment type, preferred lanes, and dispatch fee. A complete, professional profile with strong reviews significantly increases your visibility and carrier inquiries." },
    { question: "Can I post loads as a dispatcher?", answer: "Yes. The Dispatcher Dashboard includes a 'Post Load' tab where you can list available loads you're managing on behalf of your carrier clients. Posted loads appear on the platform's load board and are visible to all registered carriers, with your dispatcher profile linked." },
    { question: "What is the dispatch fee field in my profile?", answer: "The dispatch fee is what you charge carriers for your dispatch services — typically expressed as a percentage of the gross load revenue (e.g., 5–8%) or a flat weekly/monthly rate. This fee is displayed on your public dispatcher profile so carriers know your rates before reaching out." },
    { question: "How do carrier reviews work for dispatchers?", answer: "After working with a dispatcher, carriers can leave a rating and written review on the dispatcher's profile. These reviews are publicly visible and directly affect your profile ranking in the Dispatcher Hub. Maintaining a high rating increases your chances of being discovered by quality carriers." },
    { question: "Can I manage multiple carriers as a dispatcher?", answer: "Yes. LoadOps AI is designed for dispatchers managing multiple carrier clients. Your dashboard shows all loads posted across your carrier accounts, and you can use the messaging system to communicate with different brokers simultaneously on behalf of your carriers." },
  ],
  account: [
    { question: "How do I reset my password?", answer: "From the login page, click 'Forgot Password' and enter your registered email address. You'll receive a password reset link within a few minutes. The link is valid for 1 hour. If you don't see the email, check your spam folder or contact support@loadopsai.com." },
    { question: "Can I change my role after signing up?", answer: "Role changes are not supported directly through the dashboard at this time. If you need to switch from Carrier to Broker or Dispatcher, please contact support@loadopsai.com with your account email and the role you'd like to switch to. Our team will process the change within 24 hours." },
    { question: "How do I cancel my subscription?", answer: "You can cancel your subscription at any time from your account settings under Billing. Cancellation takes effect at the end of your current billing period — you retain full access until then. We do not offer prorated refunds for mid-cycle cancellations." },
    { question: "How do I delete my account?", answer: "To delete your account, go to Account Settings and click 'Delete Account.' This action is permanent. Per our Privacy Policy and FMCSA recordkeeping requirements, certain load history and booking records may be retained for up to 7 years after deletion. Contact privacy@loadopsai.com for data deletion inquiries." },
    { question: "Can I have multiple accounts?", answer: "Each user is permitted one account per role. You may not create duplicate accounts to circumvent suspensions, ratings, or subscription limits. Violations of this policy may result in permanent banning of all associated accounts." },
  ],
  billing: [
    { question: "What plans does LoadOps AI offer?", answer: "LoadOps AI offers three subscription plans: Starter ($19/month) — for individual carriers and owner-operators getting started; Pro ($49/month) — for active carriers, brokers, and dispatchers needing unlimited access; Enterprise ($99/month) — for teams and high-volume operations requiring advanced analytics, priority support, and API access." },
    { question: "Is there a free trial?", answer: "Yes. All new accounts receive a 7-day free trial with access to all Pro plan features. No credit card is required to start your trial. At the end of the trial period, you'll be prompted to select a plan to continue accessing premium features." },
    { question: "What payment methods are accepted?", answer: "We accept all major credit and debit cards (Visa, Mastercard, Amex, Discover) through our PCI-DSS compliant payment processor. We do not store card numbers directly. Annual plan payment via ACH bank transfer is available for Enterprise customers." },
    { question: "Can I get a refund?", answer: "Payments made after the 7-day free trial are non-refundable, except where required by applicable law. If you believe you were charged in error, contact billing@loadopsai.com within 7 days of the charge and we'll investigate promptly." },
    { question: "Do you offer annual billing discounts?", answer: "Yes. Annual billing is available at a 20% discount compared to monthly pricing. The discounted rates are: Starter Annual — $182/year ($15.17/month equivalent), Pro Annual — $470/year ($39.17/month equivalent), Enterprise Annual — $950/year ($79.17/month equivalent)." },
  ],
};

const categories = [
  { key: "general",     icon: "💡", label: "General Questions"   },
  { key: "carriers",    icon: "🚛", label: "Carrier Support"     },
  { key: "brokers",     icon: "📦", label: "Broker Support"      },
  { key: "dispatchers", icon: "🎯", label: "Dispatcher Support"  },
  { key: "account",     icon: "👤", label: "Account & Settings"  },
  { key: "billing",     icon: "💳", label: "Billing & Plans"     },
];

export default function HelpCenterPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("general");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const currentFaqs = faqData[activeTab] || [];
  const filtered = search.trim()
    ? currentFaqs.filter(f =>
        f.question.toLowerCase().includes(search.toLowerCase()) ||
        f.answer.toLowerCase().includes(search.toLowerCase())
      )
    : currentFaqs;

  const activeCat = categories.find(c => c.key === activeTab);

  return (
    <main style={{ minHeight: "100vh", background: "#F7F8FA", fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#0F1520", overflowX: "hidden" }}>

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
          --blue-h:   #1446C0;
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
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 3px #EBF1FD; }
          50%       { box-shadow: 0 0 0 7px #EBF1FD; }
        }
        @keyframes accordionOpen {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: none; }
        }

        /* ── HERO ── */
        .hc-hero {
          padding: 68px 5% 52px;
          background: var(--white);
          border-bottom: 1px solid var(--border);
          position: relative; overflow: hidden;
        }
        .hc-hero::before {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 80% 60% at 50% -10%, rgba(26,86,219,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 95% 80%,  rgba(124,58,237,0.03) 0%, transparent 55%);
        }
        .hc-hero::after {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(26,86,219,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(26,86,219,0.03) 1px, transparent 1px);
          background-size: 52px 52px;
          mask-image: radial-gradient(ellipse 70% 60% at 50% 0%, black 0%, transparent 70%);
        }
        .hc-hero-inner { position: relative; z-index: 1; }
        .hc-eyebrow { display: flex; align-items: center; gap: 8px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--blue); margin-bottom: 12px; animation: fadeUp 0.5s ease both; }
        .hc-eyebrow::before { content: ''; width: 20px; height: 2px; background: var(--blue); border-radius: 1px; }
        .hc-live-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--green); animation: pulse 2s infinite; display: inline-block; }
        .hc-title { font-size: clamp(1.9rem, 4vw, 2.8rem); font-weight: 800; letter-spacing: -0.045em; color: var(--txt); line-height: 1.06; margin-bottom: 12px; animation: fadeUp 0.5s 0.08s ease both; font-family: 'Plus Jakarta Sans', sans-serif; }
        .hc-title em { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; color: var(--blue); }
        .hc-sub { font-size: 0.9rem; color: var(--txt3); line-height: 1.75; max-width: 560px; margin-bottom: 28px; animation: fadeUp 0.5s 0.12s ease both; }

        /* SEARCH */
        .hc-search-wrap { max-width: 540px; position: relative; animation: fadeUp 0.5s 0.18s ease both; }
        .hc-search { width: 100%; padding: 11px 16px 11px 40px; border-radius: 10px; background: var(--bg); border: 1.5px solid var(--border2); color: var(--txt); font-size: 0.84rem; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; transition: border-color 0.15s, box-shadow 0.15s; }
        .hc-search:focus { border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-l); background: var(--white); }
        .hc-search::placeholder { color: var(--txt4); }
        .hc-search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 0.85rem; color: var(--txt4); pointer-events: none; }

        /* ── LAYOUT ── */
        .hc-layout { display: grid; grid-template-columns: 260px 1fr; gap: 20px; max-width: 1200px; margin: 0 auto; padding: 36px 5% 80px; align-items: start; }

        /* ── SIDEBAR ── */
        .hc-sidebar { position: sticky; top: 80px; background: var(--white); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; animation: fadeUp 0.5s 0.05s ease both; }
        .hc-sidebar-header { padding: 14px 18px; background: var(--bg); border-bottom: 1px solid var(--border); font-size: 0.68rem; font-weight: 800; color: var(--txt4); text-transform: uppercase; letter-spacing: 0.09em; }
        .hc-sidebar-list { display: flex; flex-direction: column; padding: 6px 0; }
        .hc-tab-btn { width: 100%; padding: 10px 18px; border: none; background: transparent; text-align: left; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; display: flex; align-items: center; gap: 10px; font-size: 0.79rem; font-weight: 600; color: var(--txt3); transition: all 0.15s; border-left: 2px solid transparent; }
        .hc-tab-btn:hover { background: var(--bg); color: var(--txt); }
        .hc-tab-btn.active { background: var(--blue-l); color: var(--blue); border-left-color: var(--blue); font-weight: 700; }
        .hc-tab-icon { font-size: 0.9rem; flex-shrink: 0; }
        .hc-tab-count { margin-left: auto; font-size: 0.6rem; font-weight: 800; padding: 1px 6px; border-radius: 8px; background: var(--bg2); color: var(--txt4); }
        .hc-tab-btn.active .hc-tab-count { background: var(--blue-m); color: var(--blue); }

        /* QUICK HELP */
        .hc-quick { margin-top: 12px; background: var(--white); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; }
        .hc-quick-header { padding: 12px 16px; background: var(--bg); border-bottom: 1px solid var(--border); font-size: 0.68rem; font-weight: 800; color: var(--txt4); text-transform: uppercase; letter-spacing: 0.09em; }
        .hc-quick-item { padding: 10px 16px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: background 0.15s; text-decoration: none; }
        .hc-quick-item:last-child { border-bottom: none; }
        .hc-quick-item:hover { background: var(--bg); }
        .hc-quick-item-label { font-size: 0.76rem; font-weight: 600; color: var(--txt2); }
        .hc-quick-item-arr { font-size: 0.72rem; color: var(--txt4); }

        /* ── CONTENT PANEL ── */
        .hc-content { animation: fadeUp 0.5s 0.1s ease both; }

        /* CONTENT HEADER */
        .hc-content-header { background: var(--white); border: 1px solid var(--border); border-radius: 16px; padding: 20px 24px; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
        .hc-content-header-left { display: flex; align-items: center; gap: 12px; }
        .hc-content-cat-icon { width: 38px; height: 38px; border-radius: 9px; background: var(--blue-l); border: 1px solid var(--blue-m); display: flex; align-items: center; justify-content: center; font-size: 1rem; }
        .hc-content-title { font-size: 0.95rem; font-weight: 800; color: var(--txt); letter-spacing: -0.02em; }
        .hc-content-sub { font-size: 0.72rem; color: var(--txt3); margin-top: 1px; }
        .hc-result-count { font-size: 0.68rem; font-weight: 700; padding: 3px 10px; border-radius: 20px; background: var(--blue-l); color: var(--blue); border: 1px solid var(--blue-m); }

        /* FAQ ACCORDION */
        .hc-faq-list { display: flex; flex-direction: column; gap: 8px; }
        .hc-faq-card { background: var(--white); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; transition: box-shadow 0.2s; }
        .hc-faq-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
        .hc-faq-card.open { border-color: var(--blue-m); }
        .hc-faq-q { width: 100%; padding: 18px 20px; background: transparent; border: none; cursor: pointer; text-align: left; display: flex; align-items: flex-start; gap: 14px; font-family: 'Plus Jakarta Sans', sans-serif; transition: background 0.15s; }
        .hc-faq-q:hover { background: var(--bg); }
        .hc-faq-card.open .hc-faq-q { background: var(--blue-l); }
        .hc-faq-num { width: 24px; height: 24px; border-radius: 6px; background: var(--bg2); border: 1px solid var(--border2); display: flex; align-items: center; justify-content: center; font-size: 0.62rem; font-weight: 800; color: var(--txt4); flex-shrink: 0; margin-top: 1px; }
        .hc-faq-card.open .hc-faq-num { background: var(--blue); color: #fff; border-color: var(--blue); }
        .hc-faq-q-text { flex: 1; font-size: 0.86rem; font-weight: 700; color: var(--txt); letter-spacing: -0.01em; text-align: left; line-height: 1.45; }
        .hc-faq-card.open .hc-faq-q-text { color: var(--blue); }
        .hc-faq-chevron { flex-shrink: 0; font-size: 0.75rem; color: var(--txt4); transition: transform 0.2s; margin-top: 2px; }
        .hc-faq-card.open .hc-faq-chevron { transform: rotate(180deg); color: var(--blue); }
        .hc-faq-a { padding: 0 20px 18px 58px; font-size: 0.82rem; color: var(--txt3); line-height: 1.78; font-weight: 400; animation: accordionOpen 0.25s ease both; }

        /* EMPTY */
        .hc-empty { background: var(--white); border: 1px solid var(--border); border-radius: 14px; padding: 48px 20px; text-align: center; }
        .hc-empty-icon { font-size: 2rem; margin-bottom: 10px; }
        .hc-empty-title { font-size: 0.88rem; font-weight: 700; color: var(--txt); margin-bottom: 5px; }
        .hc-empty-sub { font-size: 0.76rem; color: var(--txt3); }

        /* CTA CARD */
        .hc-cta-card { background: var(--txt); border-radius: 16px; padding: 28px; margin-top: 16px; position: relative; overflow: hidden; }
        .hc-cta-card::before { content: ''; position: absolute; inset: 0; pointer-events: none; background: radial-gradient(ellipse 70% 80% at 100% 0%, rgba(26,86,219,0.3) 0%, transparent 55%); }
        .hc-cta-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 20px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); font-size: 0.62rem; font-weight: 700; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 14px; position: relative; z-index: 1; }
        .hc-cta-title { font-size: 1rem; font-weight: 800; color: #fff; letter-spacing: -0.03em; margin-bottom: 6px; position: relative; z-index: 1; font-family: 'Plus Jakarta Sans', sans-serif; }
        .hc-cta-title em { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; color: #93B5FA; }
        .hc-cta-sub { font-size: 0.76rem; color: rgba(255,255,255,0.5); line-height: 1.6; margin-bottom: 18px; position: relative; z-index: 1; max-width: 380px; }
        .hc-cta-btns { display: flex; gap: 8px; flex-wrap: wrap; position: relative; z-index: 1; }
        .hc-cta-btn { padding: 9px 18px; border-radius: 8px; font-size: 0.76rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; }
        .hc-cta-btn-white { background: #fff; color: var(--txt); }
        .hc-cta-btn-white:hover { background: #f0f0f0; }
        .hc-cta-btn-ghost { background: transparent; color: rgba(255,255,255,0.55); border: 1.5px solid rgba(255,255,255,0.12); }
        .hc-cta-btn-ghost:hover { border-color: rgba(255,255,255,0.25); color: rgba(255,255,255,0.8); }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .hc-layout { grid-template-columns: 1fr; }
          .hc-sidebar { position: static; }
          .hc-sidebar-list { flex-direction: row; flex-wrap: wrap; padding: 8px; gap: 4px; }
          .hc-tab-btn { width: auto; border-left: none; border-radius: 8px; padding: 8px 14px; }
          .hc-tab-btn.active { border-left: none; }
        }
        @media (max-width: 600px) {
          .hc-layout { padding: 20px 4% 60px; }
          .hc-hero { padding: 44px 4% 36px; }
          .hc-faq-a { padding: 0 16px 16px 16px; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="hc-hero">
        <div className="hc-hero-inner">
          <div className="hc-eyebrow">
            <span className="hc-live-dot" />
            {" "}Support Center
          </div>
          <h1 className="hc-title">LoadOps AI <em>Help Center</em></h1>
          <p className="hc-sub">
            Find answers for carriers, brokers, dispatchers, and logistics teams.
            Browse our FAQ library or search for a specific topic below.
          </p>
          <div className="hc-search-wrap">
            <span className="hc-search-icon">🔍</span>
            <input
              className="hc-search"
              placeholder={`Search ${activeCat?.label ?? "Help Center"}...`}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setOpenIndex(null); }}
            />
          </div>
        </div>
      </section>

      {/* ── LAYOUT ── */}
      <div className="hc-layout">

        {/* ── SIDEBAR ── */}
        <div>
          <div className="hc-sidebar">
            <div className="hc-sidebar-header">Categories</div>
            <div className="hc-sidebar-list">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  className={`hc-tab-btn${activeTab === cat.key ? " active" : ""}`}
                  onClick={() => { setActiveTab(cat.key); setOpenIndex(null); setSearch(""); }}
                >
                  <span className="hc-tab-icon">{cat.icon}</span>
                  {cat.label}
                  <span className="hc-tab-count">{faqData[cat.key]?.length ?? 0}</span>
                </button>
              ))}
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="hc-quick">
            <div className="hc-quick-header">Quick Links</div>
            {[
              { label: "View Load Board",     href: "/platform"        },
              { label: "AI Matching",          href: "/ai-matching"     },
              { label: "Pricing Plans",        href: "/pricing"         },
              { label: "Contact Support",      href: "/contact"         },
              { label: "Privacy Policy",       href: "/privacy-policy"  },
              { label: "Terms of Service",     href: "/terms-of-service"},
            ].map((l, i) => (
              <a key={i} href={l.href} className="hc-quick-item">
                <span className="hc-quick-item-label">{l.label}</span>
                <span className="hc-quick-item-arr">→</span>
              </a>
            ))}
          </div>
        </div>

        {/* ── CONTENT PANEL ── */}
        <div className="hc-content">

          {/* HEADER */}
          <div className="hc-content-header">
            <div className="hc-content-header-left">
              <div className="hc-content-cat-icon">{activeCat?.icon}</div>
              <div>
                <div className="hc-content-title">{activeCat?.label}</div>
                <div className="hc-content-sub">
                  {search ? `Showing results for "${search}"` : `${filtered.length} question${filtered.length !== 1 ? "s" : ""} in this category`}
                </div>
              </div>
            </div>
            <div className="hc-result-count">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</div>
          </div>

          {/* FAQ ACCORDION */}
          {filtered.length === 0 ? (
            <div className="hc-empty">
              <div className="hc-empty-icon">🔍</div>
              <div className="hc-empty-title">No results found for "{search}"</div>
              <div className="hc-empty-sub">Try a different keyword or browse another category.</div>
            </div>
          ) : (
            <div className="hc-faq-list">
              {filtered.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div key={idx} className={`hc-faq-card${isOpen ? " open" : ""}`}>
                    <button className="hc-faq-q" onClick={() => setOpenIndex(isOpen ? null : idx)}>
                      <div className="hc-faq-num">{String(idx + 1).padStart(2, "0")}</div>
                      <div className="hc-faq-q-text">{faq.question}</div>
                      <div className="hc-faq-chevron">▾</div>
                    </button>
                    {isOpen && <div className="hc-faq-a">{faq.answer}</div>}
                  </div>
                );
              })}
            </div>
          )}

          {/* CTA CARD */}
          <div className="hc-cta-card">
            <div className="hc-cta-badge">⚡ Still need help?</div>
            <div className="hc-cta-title">Can't find what you're looking for?<br /><em>Our team is here.</em></div>
            <p className="hc-cta-sub">
              Our support team responds to all inquiries within 1 business day.
              For urgent freight issues, use the direct email below.
            </p>
            <div className="hc-cta-btns">
              <a className="hc-cta-btn hc-cta-btn-white" href="mailto:support@loadopsai.co">
  ✉️ Contact Support
</a>
              <a className="hc-cta-btn hc-cta-btn-ghost" href="mailto:support@loadopsai.co">
                support@loadopsai.co
              </a>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
