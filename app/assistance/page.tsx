"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AssistancePage() {
  const router = useRouter();

  const [chatMessages, setChatMessages] = useState([
    { from: "ai", text: "Hi! I'm the LoadOps AI Assistant — available 24/7. Ask me anything about loads, bookings, brokers, dispatchers, or your account." }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const handleSend = async () => {
  if (!chatInput.trim() || chatLoading) return;

  const userMsg = chatInput.trim();

  setChatInput("");

  setChatMessages(prev => [
    ...prev,
    { from: "user", text: userMsg }
  ]);

  setChatLoading(true);

  try {
    const res = await fetch("/api/ai-chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userMsg,
      }),
    });

    const data = await res.json();

    setChatMessages(prev => [
      ...prev,
      {
        from: "ai",
        text: data.reply,
      },
    ]);
  } catch (error) {
    setChatMessages(prev => [
      ...prev,
      {
        from: "ai",
        text: "AI assistant is currently unavailable.",
      },
    ]);
  }

  setChatLoading(false);
};

  return (
    <main style={{ minHeight: "100vh", background: "#F7F8FA", fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#0F1520" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap');

        :root {
          --white:  #FFFFFF;
          --bg:     #F7F8FA;
          --border: #E4E7ED;
          --txt:    #0F1520;
          --txt2:   #3D4A5C;
          --txt3:   #4A5568;
          --txt4:   #6B7A8D;
          --blue:   #1A56DB;
          --blue-l: #EBF1FD;
          --blue-m: #C7D9FA;
          --green:  #12A150;
          --green-l:#E6F7EE;
          --green-m:#A7F3C8;
          --red:    #DC2626;
          --red-l:  #FEF2F2;
          --amber:  #D97706;
          --amber-l:#FEF3C7;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes pulse {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.4; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes msgIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* PAGE */
        .pg { max-width: 900px; margin: 0 auto; padding: 48px 5% 80px; }

        /* HEADER */
        .hd { margin-bottom: 36px; animation: fadeUp 0.5s ease both; }
        .hd-eyebrow { display: flex; align-items: center; gap: 8px; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--blue); margin-bottom: 10px; }
        .hd-eyebrow::before { content: ''; width: 18px; height: 2px; background: var(--blue); border-radius: 1px; }
        .hd-live { width: 7px; height: 7px; border-radius: 50%; background: var(--green); display: inline-block; animation: pulse 1.8s infinite; }
        .hd-title { font-size: clamp(1.7rem, 3.5vw, 2.4rem); font-weight: 800; letter-spacing: -0.045em; color: var(--txt); line-height: 1.06; margin-bottom: 8px; font-family: 'Plus Jakarta Sans', sans-serif; }
        .hd-title em { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; color: var(--blue); }
        .hd-sub { font-size: 0.88rem; color: var(--txt3); line-height: 1.7; }

        /* CONTACT CARDS */
        .cc-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 28px; animation: fadeUp 0.5s 0.05s ease both; }
        .cc { background: var(--white); border: 1px solid var(--border); border-radius: 14px; padding: 18px 16px; transition: box-shadow 0.18s; text-decoration: none; display: block; }
        .cc:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.07); }
        .cc-icon { font-size: 1.3rem; margin-bottom: 10px; }
        .cc-title { font-size: 0.82rem; font-weight: 700; color: var(--txt); margin-bottom: 4px; }
        .cc-email { font-size: 0.72rem; font-weight: 600; color: var(--blue); margin-bottom: 6px; }
        .cc-tag { display: inline-flex; align-items: center; gap: 5px; font-size: 0.62rem; font-weight: 700; padding: 2px 8px; border-radius: 10px; }

        /* CHAT CARD */
        .chat-card { background: var(--white); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; margin-bottom: 24px; animation: fadeUp 0.5s 0.1s ease both; }
        .chat-top { padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 10px; }
        .chat-avatar { width: 36px; height: 36px; border-radius: 9px; background: var(--blue); display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
        .chat-name { font-size: 0.86rem; font-weight: 700; color: var(--txt); }
        .chat-status { font-size: 0.63rem; color: var(--green); font-weight: 600; display: flex; align-items: center; gap: 4px; margin-top: 2px; }
        .chat-sdot { width: 5px; height: 5px; border-radius: 50%; background: var(--green); display: inline-block; animation: pulse 1.8s infinite; }
        .chat-badge { margin-left: auto; font-size: 0.6rem; font-weight: 800; padding: 3px 9px; border-radius: 20px; background: var(--green-l); color: var(--green); border: 1px solid var(--green-m); }

        .chat-msgs { padding: 16px 18px; min-height: 240px; max-height: 320px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; background: var(--bg); }
        .chat-msgs::-webkit-scrollbar { width: 4px; }
        .chat-msgs::-webkit-scrollbar-thumb { background: var(--border); border-radius: 999px; }

        .msg { max-width: 78%; animation: msgIn 0.22s ease both; }
        .msg.ai   { align-self: flex-start; }
        .msg.user { align-self: flex-end; }
        .msg-bubble { padding: 9px 13px; font-size: 0.8rem; line-height: 1.65; font-weight: 400; }
        .msg.ai   .msg-bubble { background: var(--white); border: 1px solid var(--border); color: var(--txt2); border-radius: 12px 12px 12px 3px; }
        .msg.user .msg-bubble { background: var(--blue); color: #fff; border-radius: 12px 12px 3px 12px; }
        .msg-time { font-size: 0.58rem; color: var(--txt4); margin-top: 3px; padding: 0 2px; }
        .msg.user .msg-time { text-align: right; }

        .typing-row { display: flex; align-items: center; gap: 4px; padding: 9px 13px; background: var(--white); border: 1px solid var(--border); border-radius: 12px; width: fit-content; }
        .td { width: 5px; height: 5px; border-radius: 50%; background: var(--txt4); animation: pulse 1.1s infinite; }
        .td:nth-child(2) { animation-delay: 0.18s; }
        .td:nth-child(3) { animation-delay: 0.36s; }

        .chat-input-row { padding: 12px 16px; border-top: 1px solid var(--border); display: flex; gap: 8px; }
        .chat-input { flex: 1; padding: 9px 14px; border-radius: 22px; background: var(--bg); border: 1.5px solid #D0D5E0; color: var(--txt); font-size: 0.82rem; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; transition: border-color 0.15s; }
        .chat-input:focus { border-color: var(--blue); background: var(--white); }
        .chat-input::placeholder { color: var(--txt4); }
        .chat-send { width: 36px; height: 36px; border-radius: 9px; background: var(--blue); color: #fff; border: none; cursor: pointer; font-size: 0.9rem; display: flex; align-items: center; justify-content: center; transition: all 0.15s; flex-shrink: 0; }
        .chat-send:hover { background: #1446C0; }
        .chat-send:disabled { opacity: 0.4; cursor: not-allowed; }

        /* QUICK QUESTIONS */
        .quick-label { font-size: 0.65rem; font-weight: 700; color: var(--txt4); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; }
        .quick-chips { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 28px; animation: fadeUp 0.5s 0.15s ease both; }
        .qchip { padding: 6px 13px; border-radius: 20px; background: var(--white); border: 1.5px solid #D0D5E0; color: var(--txt3); font-size: 0.74rem; font-weight: 600; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; }
        .qchip:hover { border-color: var(--blue-m); color: var(--blue); background: var(--blue-l); }

        /* INFO ROW */
        .info-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 28px; animation: fadeUp 0.5s 0.2s ease both; }
        .info-card { background: var(--white); border: 1px solid var(--border); border-radius: 14px; padding: 18px; }
        .info-card-title { font-size: 0.8rem; font-weight: 700; color: var(--txt); margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }
        .info-list { display: flex; flex-direction: column; gap: 7px; }
        .info-item { display: flex; align-items: flex-start; gap: 8px; font-size: 0.76rem; color: var(--txt3); line-height: 1.55; }
        .info-item::before { content: '•'; color: var(--blue); font-weight: 800; flex-shrink: 0; margin-top: 1px; }
        .info-item b { color: var(--txt2); font-weight: 600; }

        /* CTA STRIP */
        .cta-strip { background: var(--txt); border-radius: 14px; padding: 28px 28px; display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap; position: relative; overflow: hidden; animation: fadeUp 0.5s 0.25s ease both; }
        .cta-strip::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 70% 80% at 100% 50%, rgba(26,86,219,0.2) 0%, transparent 60%); pointer-events: none; }
        .cta-strip-text { position: relative; z-index: 1; }
        .cta-strip-text h3 { font-size: 0.96rem; font-weight: 800; color: #fff; letter-spacing: -0.02em; margin-bottom: 4px; font-family: 'Plus Jakarta Sans', sans-serif; }
        .cta-strip-text p { font-size: 0.74rem; color: rgba(255,255,255,0.45); }
        .cta-strip-btns { display: flex; gap: 8px; position: relative; z-index: 1; flex-shrink: 0; }
        .cta-btn { padding: 9px 18px; border-radius: 8px; font-size: 0.76rem; font-weight: 700; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; border: none; text-decoration: none; display: inline-flex; align-items: center; gap: 5px; }
        .cta-btn.white { background: #fff; color: var(--txt); }
        .cta-btn.white:hover { background: #f0f0f0; }
        .cta-btn.ghost { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.6); border: 1px solid rgba(255,255,255,0.12); }

        @media (max-width: 700px) {
          .cc-grid { grid-template-columns: 1fr; }
          .info-row { grid-template-columns: 1fr; }
          .pg { padding: 32px 4% 60px; }
        }
      `}</style>

      <div className="pg">

        {/* HEADER */}
        <div className="hd">
          <div className="hd-eyebrow">
            <span className="hd-live" /> Support Center
          </div>
          <div className="hd-title">24/7 <em>Assistance</em></div>
          <p className="hd-sub">Our AI assistant and support team are available around the clock. Get help with loads, brokers, dispatchers, accounts, and more.</p>
        </div>

        {/* CONTACT CARDS */}
        <div className="cc-grid">
          <a href="mailto:support@loadopsai.com" className="cc">
            <div className="cc-icon">✉️</div>
            <div className="cc-title">General Support</div>
            <div className="cc-email">support@loadopsai.com</div>
            <div className="cc-tag" style={{ background: "#E6F7EE", color: "#12A150" }}>✓ &lt; 1hr response</div>
          </a>
          <a href="mailto:urgent@loadopsai.com" className="cc">
            <div className="cc-icon">🚨</div>
            <div className="cc-title">Urgent Freight Issues</div>
            <div className="cc-email">urgent@loadopsai.com</div>
            <div className="cc-tag" style={{ background: "#FEF2F2", color: "#DC2626" }}>🔴 &lt; 30min response</div>
          </a>
          <a href="mailto:legal@loadopsai.com" className="cc">
            <div className="cc-icon">⚖️</div>
            <div className="cc-title">Legal & Fraud Reports</div>
            <div className="cc-email">legal@loadopsai.com</div>
            <div className="cc-tag" style={{ background: "#EDE9FE", color: "#7C3AED" }}>⚖️ &lt; 2hr response</div>
          </a>
        </div>

        {/* QUICK QUESTIONS */}
        <div style={{ marginBottom: 10 }}>
          <div className="quick-label">Quick questions — click to ask</div>
        </div>
        <div className="quick-chips">
          {[
            "My load disappeared from the board",
            "Carrier didn't show up",
            "Broker is not paying me",
            "I can't log into my account",
            "My MC number isn't verified",
            "Suspicious broker activity",
          ].map((q, i) => (
            <button key={i} className="qchip" onClick={() => { setChatInput(q); }}>
              {q}
            </button>
          ))}
        </div>

        {/* AI CHAT */}
        <div className="chat-card">
          <div className="chat-top">
            <div className="chat-avatar">🤖</div>
            <div>
              <div className="chat-name">LoadOps AI Assistant</div>
              <div className="chat-status">
                <span className="chat-sdot" /> Active now
              </div>
            </div>
            <div className="chat-badge">24/7 Live</div>
          </div>

          <div className="chat-msgs">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`msg ${msg.from}`}>
                <div className="msg-bubble">{msg.text}</div>
                <div className="msg-time">{msg.from === "ai" ? "LoadOps AI" : "You"}</div>
              </div>
            ))}
            {chatLoading && (
              <div className="msg ai">
                <div className="typing-row">
                  <span className="td" /><span className="td" /><span className="td" />
                </div>
              </div>
            )}
          </div>

          <div className="chat-input-row">
            <input
              className="chat-input"
              placeholder="Describe your issue..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
            />
            <button
              className="chat-send"
              onClick={handleSend}
              disabled={chatLoading || !chatInput.trim()}
            >
              ↗
            </button>
          </div>
        </div>

        {/* INFO CARDS */}
        <div className="info-row">
          <div className="info-card">
            <div className="info-card-title">⚡ Common Issues</div>
            <div className="info-list">
              {[
                { b: "Load missing?", t: "Re-check your broker dashboard. Filter by status." },
                { b: "No AI alerts?", t: "Check spam folder and verify alert preferences." },
                { b: "Carrier no-show?", t: "Contact via chat, then re-post the load." },
                { b: "Rate con missing?", t: "Check booking history in your dashboard." },
                { b: "Map not loading?", t: "Refresh or try a different browser." },
              ].map((item, i) => (
                <div key={i} className="info-item"><span><b>{item.b}</b> {item.t}</span></div>
              ))}
            </div>
          </div>
          <div className="info-card">
            <div className="info-card-title">🕐 Response Times</div>
            <div className="info-list">
              {[
                { b: "AI Assistant:",       t: "Instant — available 24/7" },
                { b: "Email Support:",      t: "Within 1 business hour" },
                { b: "Urgent Freight:",     t: "Within 30 minutes" },
                { b: "Legal & Fraud:",      t: "Within 2 hours" },
                { b: "Account Issues:",     t: "Within 1 hour" },
              ].map((item, i) => (
                <div key={i} className="info-item"><span><b>{item.b}</b> {item.t}</span></div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="cta-strip">
          <div className="cta-strip-text">
            <h3>Still need help? Our team is standing by.</h3>
            <p>Real humans available around the clock for urgent freight situations.</p>
          </div>
          <div className="cta-strip-btns">
            <button className="cta-btn white" onClick={() => router.push("/contact")}>✉️ Contact Us</button>
            <button className="cta-btn ghost" onClick={() => router.push("/help-center")}>Help Center</button>
          </div>
        </div>

      </div>
    </main>
  );
}
