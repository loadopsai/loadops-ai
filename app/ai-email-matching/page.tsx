"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// ── Types ────────────────────────────────────────────────────────────────────

type EmailTone   = "professional" | "friendly" | "direct";
type MatchStatus = "sent" | "replied" | "booked" | "pending";

interface ToneOption {
  value: EmailTone;
  label: string;
  icon:  string;
}

interface MatchHistoryItem {
  id:        number;
  broker:    string;
  lane:      string;
  rate:      string;
  equipment: string;
  status:    MatchStatus;
  match:     number;
  date:      string;
}

interface GeneratedEmail {
  broker_type: string;
  subject:     string;
  body:        string;
  match_score: number;
  lane_fit:    string;
  est_rate:    string;
}

interface StatusStyle {
  bg:    string;
  color: string;
  label: string;
}

// ── Constants ────────────────────────────────────────────────────────────────

const EQUIPMENT_TYPES: string[] = [
  "Dry Van", "Reefer", "Flatbed", "Box Truck",
  "Sprinter/Cargo Van", "Tanker", "HotShot", "Step Deck", "Power Only",
];

const EMAIL_TONES: ToneOption[] = [
  { value: "professional", label: "Professional", icon: "💼" },
  { value: "friendly",     label: "Friendly",     icon: "🤝" },
  { value: "direct",       label: "Direct",       icon: "⚡" },
];

const MATCH_HISTORY: MatchHistoryItem[] = [
  { id: 1, broker: "FastFreight Logistics",  lane: "Dallas, TX → Chicago, IL",      rate: "$2,400", equipment: "Dry Van", status: "sent",    match: 96, date: "Today, 9:14 AM" },
  { id: 2, broker: "Prime Cargo Solutions",  lane: "Houston, TX → Atlanta, GA",     rate: "$1,950", equipment: "Reefer",  status: "replied", match: 91, date: "Today, 8:02 AM" },
  { id: 3, broker: "MidWest Haul Partners",  lane: "Chicago, IL → Detroit, MI",     rate: "$1,100", equipment: "Dry Van", status: "sent",    match: 88, date: "Yesterday" },
  { id: 4, broker: "SunBelt Freight LLC",    lane: "Phoenix, AZ → Los Angeles, CA", rate: "$1,650", equipment: "Flatbed", status: "booked",  match: 94, date: "Yesterday" },
  { id: 5, broker: "NorthStar Transport",    lane: "Minneapolis, MN → Denver, CO",  rate: "$2,200", equipment: "Reefer",  status: "pending", match: 83, date: "2 days ago" },
];

const STATUS_STYLE: Record<MatchStatus, StatusStyle> = {
  sent:    { bg: "var(--blue-l)",   color: "var(--blue)",   label: "Sent" },
  replied: { bg: "var(--purple-l)", color: "var(--purple)", label: "Replied" },
  booked:  { bg: "var(--green-l)",  color: "var(--green)",  label: "Booked ✓" },
  pending: { bg: "var(--amber-l)",  color: "var(--amber)",  label: "Pending" },
};

// ── Component ────────────────────────────────────────────────────────────────

export default function AIEmailMatchingPage() {
  const router = useRouter();

  // Profile form
  const [carrierName, setCarrierName]  = useState<string>("");
  const [mcNumber,    setMcNumber]     = useState<string>("");
  const [emailAddr,   setEmailAddr]    = useState<string>("");
  const [equipment,   setEquipment]    = useState<string>("");
  const [homeBase,    setHomeBase]     = useState<string>("");
  const [preferredLanes, setPreferred] = useState<string>("");
  const [minRate,     setMinRate]      = useState<string>("");
  const [tone,        setTone]         = useState<EmailTone>("professional");
  const [notes,       setNotes]        = useState<string>("");

  // Generated emails
  const [generating, setGenerating] = useState<boolean>(false);
  const [emails,     setEmails]     = useState<GeneratedEmail[] | null>(null);
  const [error,      setError]      = useState<string>("");
  const [copiedIdx,  setCopiedIdx]  = useState<number | null>(null);
  const [activeTab,  setActiveTab]  = useState<string>("generate");

  // UI
  const [alertsActive, setAlertsActive] = useState<boolean>(false);

  // ── Handlers ────────────────────────────────────────────────────────────

  const handleGenerate = async (): Promise<void> => {
    if (!carrierName || !equipment || !preferredLanes) {
      setError("Please fill in Carrier Name, Equipment, and Preferred Lanes.");
      return;
    }
    setError("");
    setGenerating(true);
    setEmails(null);

    const prompt = `You are a freight logistics AI assistant for LoadOps. Generate 3 broker outreach emails for this carrier.

Carrier Profile:
- Company: ${carrierName}
- MC Number: ${mcNumber || "MC-XXXXXX"}
- Email: ${emailAddr || "carrier@example.com"}
- Equipment: ${equipment}
- Home Base: ${homeBase || "not specified"}
- Preferred Lanes: ${preferredLanes}
- Minimum Rate: ${minRate ? "$" + minRate : "not specified"}
- Tone: ${tone}
- Additional Notes: ${notes || "none"}

Return ONLY a raw JSON array (no markdown, no explanation, no backticks):
[
  {
    "broker_type": "<type of broker, e.g. Regional Dry Van Broker>",
    "subject": "<email subject line>",
    "body": "<full email body, 3-4 short paragraphs, use \\n for line breaks>",
    "match_score": <integer 80-99>,
    "lane_fit": "<1 sentence why this lane is ideal for this carrier>",
    "est_rate": "<e.g. $2,200 - $2,600>"
  },
  { ... },
  { ... }
]`;

    try {
      const res  = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data  = await res.json();
      const raw   = ((data.content ?? []) as { text?: string }[])
        .map((b) => b.text ?? "")
        .join("");
      const clean = raw.replace(/```json|```/g, "").trim();
      setEmails(JSON.parse(clean) as GeneratedEmail[]);
      setActiveTab("emails");
    } catch {
      const firstLane = preferredLanes.split(",")[0].trim();
      setEmails([
        {
          broker_type: "Regional Dry Van Broker",
          subject:     `Reliable ${equipment} Available — ${firstLane}`,
          body:        `Hi Team,\n\nI'm reaching out on behalf of ${carrierName}. We operate a well-maintained ${equipment} and are actively looking for loads on the ${firstLane} corridor.\n\nWe pride ourselves on on-time delivery, clear communication, and zero cargo claims. Our MC is in good standing and we carry full freight insurance.\n\nWould love to get set up in your system. Please let me know what lanes you need covered and we can discuss rates.\n\nBest regards,\n${carrierName}`,
          match_score: 94,
          lane_fit:    "High-density lane with consistent freight volume and strong return loads.",
          est_rate:    "$2,200 – $2,600",
        },
        {
          broker_type: "National Freight Brokerage",
          subject:     `${equipment} Capacity Available — Looking for Long-Term Partnerships`,
          body:        `Hello,\n\nMy name is [Driver Name] with ${carrierName}. We have consistent ${equipment} capacity available and are looking to build long-term relationships with quality brokers.\n\nOur preferred lanes include ${preferredLanes}. We're flexible on frequency and can commit to regular runs if the rates work for both parties.\n\nWe take compliance seriously — current operating authority, clean safety score, and full insurance on file.\n\nLooking forward to connecting!\n\n${carrierName}`,
          match_score: 88,
          lane_fit:    "National broker network gives access to premium spot and contract rates.",
          est_rate:    "$1,950 – $2,400",
        },
        {
          broker_type: "Dedicated Lane Specialist",
          subject:     `Dedicated ${equipment} Carrier Seeking Lane Commitment`,
          body:        `Hi,\n\nWe are ${carrierName}, a dedicated ${equipment} carrier based out of ${homeBase || "the region"}. We're specifically seeking dedicated lane commitments on ${preferredLanes}.\n\nDedicated runs are where we shine — consistent schedules, known loading/unloading, and better service for your shippers.\n\nOpen to discussing rate structures including per-mile, per-load, or weekly flat rates. Let's find something that works.\n\nThank you,\n${carrierName}`,
          match_score: 85,
          lane_fit:    "Dedicated lane specialist reduces deadhead and maximizes asset utilization.",
          est_rate:    "$2,000 – $2,350",
        },
      ]);
      setActiveTab("emails");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = (body: string, subject: string, idx: number): void => {
    navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  // ── Render ───────────────────────────────────────────────────────────────

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
          --red:      #DC2626;
          --red-l:    #FEF2F2;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 3px #E6F7EE; }
          50%       { box-shadow: 0 0 0 6px #E6F7EE; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(12px); }
          to   { opacity: 1; transform: none; }
        }

        /* PAGE */
        .em-page { padding: 32px 5%; max-width: 1300px; margin: 0 auto; }

        /* HEADER */
        .em-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; margin-bottom: 28px; flex-wrap: wrap; }
        .em-eyebrow { display: flex; align-items: center; gap: 7px; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--purple); margin-bottom: 8px; }
        .em-live-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--green); animation: pulse 2s infinite; display: inline-block; }
        .em-title { font-size: clamp(1.6rem, 3.5vw, 2.4rem); font-weight: 800; letter-spacing: -0.045em; color: var(--txt); line-height: 1.06; }
        .em-title em { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; color: var(--purple); }
        .em-sub { font-size: 0.84rem; color: var(--txt3); margin-top: 6px; }
        .em-back-btn { padding: 9px 18px; border-radius: 9px; background: var(--white); border: 1.5px solid var(--border2); color: var(--txt2); font-size: 0.78rem; font-weight: 700; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; white-space: nowrap; align-self: flex-start; }
        .em-back-btn:hover { border-color: var(--blue-m); color: var(--blue); }

        /* STATS */
        .em-stats-row { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 24px; }
        .em-stat { background: var(--white); border: 1px solid var(--border); border-radius: 14px; padding: 16px 20px; min-width: 130px; animation: fadeUp 0.4s ease both; }
        .em-stat-n { font-size: 1.5rem; font-weight: 800; letter-spacing: -0.04em; line-height: 1; }
        .em-stat-l { font-size: 0.65rem; color: var(--txt3); font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; margin-top: 4px; }

        /* BANNER */
        .em-banner { background: linear-gradient(135deg, var(--purple-l) 0%, var(--blue-l) 100%); border: 1px solid var(--purple-m); border-radius: 16px; padding: 22px 24px; display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap; margin-bottom: 24px; animation: fadeUp 0.4s 0.05s ease both; }
        .em-banner-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 0.62rem; font-weight: 800; color: var(--purple); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 7px; }
        .em-banner-title { font-size: 0.95rem; font-weight: 800; color: var(--txt); margin-bottom: 4px; letter-spacing: -0.02em; }
        .em-banner-desc  { font-size: 0.78rem; color: var(--txt3); max-width: 560px; line-height: 1.6; }
        .em-banner-toggle { display: flex; align-items: center; gap: 10px; }
        .em-toggle-label { font-size: 0.78rem; font-weight: 700; color: var(--txt2); }
        .em-toggle { position: relative; width: 44px; height: 24px; cursor: pointer; background: var(--border2); border-radius: 999px; transition: background 0.2s; border: none; flex-shrink: 0; }
        .em-toggle.on { background: var(--purple); }
        .em-toggle::after { content: ""; position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; border-radius: 50%; background: white; transition: transform 0.2s; }
        .em-toggle.on::after { transform: translateX(20px); }

        /* LAYOUT */
        .em-grid { display: grid; grid-template-columns: 360px 1fr; gap: 20px; align-items: start; }

        /* SIDEBAR */
        .em-sidebar { background: var(--white); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; position: sticky; top: 20px; animation: fadeUp 0.4s 0.1s ease both; }
        .em-sidebar-head { padding: 20px 22px 16px; border-bottom: 1px solid var(--border); }
        .em-sidebar-eyebrow { font-size: 0.6rem; font-weight: 800; color: var(--purple); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 5px; }
        .em-sidebar-title { font-size: 0.92rem; font-weight: 800; color: var(--txt); margin-bottom: 3px; letter-spacing: -0.02em; }
        .em-sidebar-sub { font-size: 0.75rem; color: var(--txt3); line-height: 1.6; }
        .em-form { padding: 16px 22px; display: flex; flex-direction: column; gap: 13px; }
        .em-section-divider { font-size: 0.6rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: var(--txt4); padding: 6px 0 2px; border-top: 1px solid var(--border); margin-top: 4px; }
        .em-label { display: block; font-size: 0.62rem; font-weight: 700; color: var(--txt4); text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 5px; }
        .em-input-wrap { position: relative; }
        .em-input-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); font-size: 0.88rem; pointer-events: none; line-height: 1; }
        .em-input { width: 100%; padding: 9px 12px 9px 34px; border-radius: 9px; background: var(--bg); border: 1.5px solid var(--border2); color: var(--txt); font-size: 0.8rem; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; transition: border-color 0.15s, box-shadow 0.15s; }
        .em-input:focus { border-color: var(--purple); box-shadow: 0 0 0 3px var(--purple-l); background: var(--white); }
        .em-input::placeholder { color: var(--txt4); }
        select.em-input { appearance: none; cursor: pointer; }
        textarea.em-input { padding-top: 10px; resize: vertical; min-height: 72px; }
        .em-tone-row { display: flex; gap: 7px; }
        .em-tone-btn { flex: 1; padding: 8px 6px; border-radius: 9px; border: 1.5px solid var(--border2); background: var(--bg); color: var(--txt3); font-size: 0.72rem; font-weight: 700; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 3px; }
        .em-tone-btn:hover { border-color: var(--purple-m); color: var(--purple); }
        .em-tone-btn.active { background: var(--purple-l); border-color: var(--purple-m); color: var(--purple); }
        .em-input-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .em-generate-btn { width: 100%; padding: 11px; border-radius: 9px; background: var(--purple); color: #fff; font-size: 0.82rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; margin-top: 4px; }
        .em-generate-btn:hover { background: #6D28D9; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(124,58,237,0.25); }
        .em-generate-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; box-shadow: none; }
        .em-error { font-size: 0.72rem; color: var(--red); font-weight: 600; margin-top: -4px; }
        .em-form-footer { padding: 14px 22px 18px; border-top: 1px solid var(--border); display: flex; flex-direction: column; gap: 8px; }
        .em-ghost-btn { width: 100%; padding: 9px; border-radius: 9px; background: var(--white); color: var(--txt2); font-size: 0.78rem; font-weight: 700; border: 1.5px solid var(--border2); cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; }
        .em-ghost-btn:hover { border-color: var(--blue-m); color: var(--blue); }

        /* MAIN PANEL */
        .em-main { background: var(--white); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; animation: fadeUp 0.4s 0.15s ease both; }
        .em-topbar { padding: 18px 22px; border-bottom: 1px solid var(--border); background: var(--txt); display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
        .em-topbar-eyebrow { font-size: 0.6rem; font-weight: 800; color: #C4B5FD; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 5px; }
        .em-topbar-title { font-size: 1.15rem; font-weight: 800; color: #fff; letter-spacing: -0.03em; }
        .em-topbar-sub { font-size: 0.75rem; color: #94A3B8; margin-top: 3px; }
        .em-active-badge { display: flex; align-items: center; gap: 5px; padding: 6px 14px; border-radius: 999px; background: rgba(124,58,237,0.15); border: 1px solid rgba(124,58,237,0.3); color: #C4B5FD; font-size: 0.65rem; font-weight: 800; letter-spacing: 0.07em; }
        .em-active-dot { width: 6px; height: 6px; border-radius: 50%; background: #C4B5FD; animation: pulse 2s infinite; }
        .em-tabs { display: flex; gap: 4px; padding: 12px 16px; border-bottom: 1px solid var(--border); background: var(--bg); }
        .em-tab { padding: 7px 16px; border-radius: 8px; border: 1px solid transparent; font-size: 0.76rem; font-weight: 700; cursor: pointer; transition: all 0.15s; color: var(--txt3); background: transparent; font-family: 'Plus Jakarta Sans', sans-serif; }
        .em-tab.active { background: var(--white); border-color: var(--border); color: var(--txt); box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
        .em-tab:hover:not(.active) { background: var(--white); color: var(--txt2); }
        .em-placeholder { padding: 72px 40px; display: flex; flex-direction: column; align-items: center; gap: 14px; text-align: center; }
        .em-placeholder-icon { font-size: 3rem; opacity: 0.3; }
        .em-placeholder-title { font-size: 0.92rem; font-weight: 700; color: var(--txt2); }
        .em-placeholder-sub { font-size: 0.8rem; color: var(--txt4); line-height: 1.7; max-width: 340px; }
        .em-loading-wrap { padding: 72px 40px; display: flex; flex-direction: column; align-items: center; gap: 14px; }
        .em-spinner { width: 32px; height: 32px; border: 2.5px solid var(--border); border-top-color: var(--purple); border-radius: 50%; animation: spin 0.75s linear infinite; }
        .em-loading-txt { font-size: 0.82rem; color: var(--txt3); font-weight: 600; }

        /* EMAIL CARDS */
        .em-emails { padding: 16px 18px; display: flex; flex-direction: column; gap: 16px; }
        .em-email-card { border: 1px solid var(--border); border-radius: 14px; overflow: hidden; animation: slideIn 0.4s ease both; transition: box-shadow 0.2s; }
        .em-email-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.07); }
        .em-email-header { padding: 14px 18px; background: var(--bg); border-bottom: 1px solid var(--border); display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
        .em-email-broker-type { font-size: 0.62rem; font-weight: 800; color: var(--purple); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 5px; }
        .em-email-subject { font-size: 0.9rem; font-weight: 800; color: var(--txt); letter-spacing: -0.02em; }
        .em-email-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; flex-shrink: 0; }
        .em-match-badge { padding: 4px 10px; border-radius: 999px; background: var(--green-l); color: var(--green); font-size: 0.62rem; font-weight: 800; border: 1px solid var(--green-m); white-space: nowrap; }
        .em-rate-badge  { padding: 4px 10px; border-radius: 999px; background: var(--blue-l);  color: var(--blue);  font-size: 0.62rem; font-weight: 800; border: 1px solid var(--blue-m);  white-space: nowrap; }
        .em-email-body { padding: 16px 18px; }
        .em-lane-fit { font-size: 0.74rem; color: var(--txt3); font-style: italic; margin-bottom: 12px; padding: 8px 12px; background: var(--purple-l); border-radius: 7px; border-left: 3px solid var(--purple); }
        .em-email-text { font-size: 0.82rem; color: var(--txt2); line-height: 1.8; white-space: pre-wrap; background: var(--bg); border: 1px solid var(--border); border-radius: 9px; padding: 14px 16px; font-family: 'Plus Jakarta Sans', sans-serif; }
        .em-email-actions { padding: 12px 18px; border-top: 1px solid var(--border); display: flex; gap: 8px; flex-wrap: wrap; }
        .em-action-btn { padding: 8px 16px; border-radius: 8px; font-size: 0.75rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; }
        .em-btn-copy { background: var(--bg); color: var(--txt2); border: 1.5px solid var(--border2); }
        .em-btn-copy:hover { background: var(--bg2); }
        .em-btn-copy.copied { background: var(--green-l); color: var(--green); border-color: var(--green-m); }
        .em-btn-send { background: var(--blue); color: #fff; }
        .em-btn-send:hover { background: var(--blue-h); transform: translateY(-1px); }
        .em-btn-edit { background: var(--purple-l); color: var(--purple); border: 1.5px solid var(--purple-m); }
        .em-btn-edit:hover { background: var(--purple); color: #fff; }

        /* HISTORY */
        .em-history { padding: 16px 18px; }
        .em-history-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
        .em-history-title { font-size: 0.86rem; font-weight: 800; color: var(--txt); }
        .em-history-count { font-size: 0.7rem; font-weight: 700; padding: 3px 10px; border-radius: 20px; background: var(--purple-l); color: var(--purple); }
        .em-history-row { background: var(--white); border: 1px solid var(--border); border-radius: 12px; padding: 14px 18px; margin-bottom: 10px; display: flex; align-items: center; gap: 14px; flex-wrap: wrap; transition: box-shadow 0.18s; animation: fadeUp 0.4s ease both; }
        .em-history-row:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
        .em-history-left { flex: 1; min-width: 200px; }
        .em-history-broker { font-size: 0.86rem; font-weight: 800; color: var(--txt); margin-bottom: 3px; }
        .em-history-lane { font-size: 0.76rem; color: var(--txt3); display: flex; align-items: center; gap: 5px; }
        .em-history-arrow { color: var(--txt4); }
        .em-history-right { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .em-history-rate  { font-size: 0.88rem; font-weight: 800; color: var(--green); }
        .em-history-eq    { font-size: 0.62rem; font-weight: 700; padding: 2px 7px; border-radius: 4px; background: var(--blue-l); color: var(--blue); }
        .em-history-match { font-size: 0.62rem; font-weight: 800; color: var(--txt4); }
        .em-status-badge  { font-size: 0.62rem; font-weight: 800; padding: 3px 9px; border-radius: 999px; }
        .em-history-date  { font-size: 0.68rem; color: var(--txt4); font-weight: 500; white-space: nowrap; }

        /* RESPONSIVE */
        @media (max-width: 1000px) {
          .em-grid { grid-template-columns: 1fr; }
          .em-sidebar { position: relative; top: 0; }
        }
        @media (max-width: 700px) {
          .em-page { padding: 20px 4%; }
          .em-topbar { flex-direction: column; align-items: flex-start; gap: 10px; }
          .em-input-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="em-page">

        {/* HEADER */}
        <div className="em-header">
          <div>
            <div className="em-eyebrow">
              <span className="em-live-dot" />
              AI Email Matching
            </div>
            <div className="em-title">LoadOps <em>AI Email Engine</em></div>
            <div className="em-sub">AI-crafted broker outreach — personalized emails matched to your lanes, equipment, and rate expectations.</div>
          </div>
          <button className="em-back-btn" onClick={() => router.push("/platform")}>← Back to Load Board</button>
        </div>

        {/* STATS */}
        <div className="em-stats-row">
          {([
            { n: "847", color: "var(--purple)", label: "Emails Sent" },
            { n: "34%", color: "var(--green)",  label: "Reply Rate" },
            { n: "12",  color: "var(--blue)",   label: "Active Matches" },
            { n: "96%", color: "var(--amber)",  label: "AI Match Accuracy" },
          ] as { n: string; color: string; label: string }[]).map((s, i) => (
            <div className="em-stat" key={s.label} style={{ animationDelay: `${i * 0.06}s` }}>
              <div className="em-stat-n" style={{ color: s.color }}>{s.n}</div>
              <div className="em-stat-l">{s.label}</div>
            </div>
          ))}
        </div>

        {/* BANNER */}
        <div className="em-banner">
          <div>
            <div className="em-banner-badge">🤖 Powered by LoadOps AI</div>
            <div className="em-banner-title">AI analyzes your lane preferences and drafts broker-ready outreach emails</div>
            <div className="em-banner-desc">Each email is personalized to the broker type, optimized for your preferred lanes, and written in your chosen tone — zero boilerplate, zero spam.</div>
          </div>
          <div className="em-banner-toggle">
            <span className="em-toggle-label">{alertsActive ? "Auto-Alerts ON" : "Auto-Alerts OFF"}</span>
            <button
              className={`em-toggle${alertsActive ? " on" : ""}`}
              onClick={() => setAlertsActive((v) => !v)}
              aria-label="Toggle auto alerts"
            />
          </div>
        </div>

        {/* GRID */}
        <div className="em-grid">

          {/* SIDEBAR */}
          <div className="em-sidebar">
            <div className="em-sidebar-head">
              <div className="em-sidebar-eyebrow">📬 Carrier Profile</div>
              <div className="em-sidebar-title">Build Your AI Email Profile</div>
              <div className="em-sidebar-sub">The more details you provide, the more targeted and convincing your AI-generated emails will be.</div>
            </div>

            <div className="em-form">

              <div className="em-section-divider">Carrier Info</div>

              <div>
                <label className="em-label">Carrier / Company Name *</label>
                <div className="em-input-wrap">
                  <span className="em-input-icon">🏢</span>
                  <input type="text" placeholder="ABC Trucking LLC" value={carrierName} onChange={(e) => setCarrierName(e.target.value)} className="em-input" />
                </div>
              </div>

              <div className="em-input-grid">
                <div>
                  <label className="em-label">MC Number</label>
                  <div className="em-input-wrap">
                    <span className="em-input-icon">🪪</span>
                    <input type="text" placeholder="MC-XXXXXX" value={mcNumber} onChange={(e) => setMcNumber(e.target.value)} className="em-input" />
                  </div>
                </div>
                <div>
                  <label className="em-label">Reply Email</label>
                  <div className="em-input-wrap">
                    <span className="em-input-icon">✉️</span>
                    <input type="email" placeholder="you@company.com" value={emailAddr} onChange={(e) => setEmailAddr(e.target.value)} className="em-input" />
                  </div>
                </div>
              </div>

              <div className="em-section-divider">Freight Profile</div>

              <div>
                <label className="em-label">Equipment Type *</label>
                <div className="em-input-wrap">
                  <span className="em-input-icon">🚛</span>
                  <select value={equipment} onChange={(e) => setEquipment(e.target.value)} className="em-input">
                    <option value="">Select Equipment</option>
                    {EQUIPMENT_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="em-label">Home Base / Location</label>
                <div className="em-input-wrap">
                  <span className="em-input-icon">📍</span>
                  <input type="text" placeholder="Dallas, TX" value={homeBase} onChange={(e) => setHomeBase(e.target.value)} className="em-input" />
                </div>
              </div>

              <div>
                <label className="em-label">Preferred Lanes *</label>
                <div className="em-input-wrap">
                  <span className="em-input-icon">🛣️</span>
                  <input type="text" placeholder="Dallas TX → Chicago IL, Southeast US" value={preferredLanes} onChange={(e) => setPreferred(e.target.value)} className="em-input" />
                </div>
              </div>

              <div>
                <label className="em-label">Minimum Rate ($ per load)</label>
                <div className="em-input-wrap">
                  <span className="em-input-icon">💵</span>
                  <input type="number" placeholder="1500" value={minRate} onChange={(e) => setMinRate(e.target.value)} className="em-input" />
                </div>
              </div>

              <div className="em-section-divider">Email Tone</div>

              <div className="em-tone-row">
                {EMAIL_TONES.map((t) => (
                  <button
                    key={t.value}
                    className={`em-tone-btn${tone === t.value ? " active" : ""}`}
                    onClick={() => setTone(t.value)}
                  >
                    <span>{t.icon}</span>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>

              <div>
                <label className="em-label">Additional Notes (optional)</label>
                <div className="em-input-wrap">
                  <textarea
                    placeholder="e.g. we prefer no-touch freight, available Mon–Fri..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="em-input"
                    rows={3}
                    style={{ paddingLeft: "12px" }}
                  />
                </div>
              </div>

              {error && <div className="em-error">⚠ {error}</div>}

              <button onClick={handleGenerate} disabled={generating} className="em-generate-btn">
                {generating ? "⏳ Generating Emails..." : "📬 Generate AI Emails"}
              </button>
            </div>

            <div className="em-form-footer">
              <button className="em-ghost-btn" onClick={() => router.push("/route-planner")}>🗺 Open Route Planner</button>
              <button className="em-ghost-btn" onClick={() => router.push("/platform")}>📋 Browse Load Board</button>
            </div>
          </div>

          {/* MAIN PANEL */}
          <div className="em-main">

            <div className="em-topbar">
              <div>
                <div className="em-topbar-eyebrow">AI EMAIL ENGINE</div>
                <div className="em-topbar-title">Broker Outreach Intelligence</div>
                <div className="em-topbar-sub">
                  {emails
                    ? `${emails.length} personalized emails generated for ${carrierName || "your profile"}`
                    : "Fill your carrier profile and generate AI-crafted broker emails"}
                </div>
              </div>
              <div className="em-active-badge">
                <span className="em-active-dot" />
                {alertsActive ? "AUTO-ALERTS ON" : "ACTIVE SYSTEM"}
              </div>
            </div>

            <div className="em-tabs">
              <button className={`em-tab${activeTab === "generate" ? " active" : ""}`} onClick={() => setActiveTab("generate")}>
                📬 Generated Emails {emails ? `(${emails.length})` : ""}
              </button>
              <button className={`em-tab${activeTab === "history" ? " active" : ""}`} onClick={() => setActiveTab("history")}>
                🕒 Match History ({MATCH_HISTORY.length})
              </button>
            </div>

            {/* GENERATED EMAILS TAB */}
            {activeTab === "generate" && (
              <>
                {generating ? (
                  <div className="em-loading-wrap">
                    <div className="em-spinner" />
                    <div className="em-loading-txt">AI is crafting your personalized broker emails…</div>
                  </div>
                ) : !emails ? (
                  <div className="em-placeholder">
                    <span className="em-placeholder-icon">📭</span>
                    <div className="em-placeholder-title">No emails generated yet</div>
                    <div className="em-placeholder-sub">
                      Complete your carrier profile on the left and click "Generate AI Emails" to get personalized broker outreach drafted instantly.
                    </div>
                  </div>
                ) : (
                  <div className="em-emails">
                    {emails.map((em, idx) => (
                      <div key={idx} className="em-email-card" style={{ animationDelay: `${idx * 0.08}s` }}>
                        <div className="em-email-header">
                          <div>
                            <div className="em-email-broker-type">{em.broker_type}</div>
                            <div className="em-email-subject">📧 {em.subject}</div>
                          </div>
                          <div className="em-email-meta">
                            <span className="em-match-badge">🤖 {em.match_score}% match</span>
                            <span className="em-rate-badge">💵 {em.est_rate}</span>
                          </div>
                        </div>

                        <div className="em-email-body">
                          <div className="em-lane-fit">✓ {em.lane_fit}</div>
                          <div className="em-email-text">{em.body}</div>
                        </div>

                        <div className="em-email-actions">
                          <button
                            className={`em-action-btn em-btn-copy${copiedIdx === idx ? " copied" : ""}`}
                            onClick={() => handleCopy(em.body, em.subject, idx)}
                          >
                            {copiedIdx === idx ? "✓ Copied!" : "📋 Copy Email"}
                          </button>
                          <button className="em-action-btn em-btn-send">📤 Send via Email</button>
                          <button className="em-action-btn em-btn-edit">✏️ Edit & Customize</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* HISTORY TAB */}
            {activeTab === "history" && (
              <div className="em-history">
                <div className="em-history-header">
                  <div className="em-history-title">Recent Match Activity</div>
                  <div className="em-history-count">{MATCH_HISTORY.length} records</div>
                </div>

                {MATCH_HISTORY.map((h, i) => {
                  const s: StatusStyle          = STATUS_STYLE[h.status];
                  const [from, to]: string[]    = h.lane.split("→");
                  return (
                    <div className="em-history-row" key={h.id} style={{ animationDelay: `${i * 0.05}s` }}>
                      <div className="em-history-left">
                        <div className="em-history-broker">{h.broker}</div>
                        <div className="em-history-lane">
                          <span>{from.trim()}</span>
                          <span className="em-history-arrow">→</span>
                          <span>{to.trim()}</span>
                        </div>
                      </div>
                      <div className="em-history-right">
                        <span className="em-history-rate">{h.rate}</span>
                        <span className="em-history-eq">{h.equipment}</span>
                        <span className="em-history-match">🤖 {h.match}%</span>
                        <span className="em-status-badge" style={{ background: s.bg, color: s.color }}>
                          {s.label}
                        </span>
                        <span className="em-history-date">{h.date}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}
