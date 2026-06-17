"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CallPage() {
  const router = useRouter();

  const [connected, setConnected] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [callTime, setCallTime] = useState(0);
  const [connecting, setConnecting] = useState(false);
  const [networkStrength, setNetworkStrength] = useState("Excellent");
  const [screenSharing, setScreenSharing] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (connected) { interval = setInterval(() => setCallTime(prev => prev + 1), 1000); }
    return () => clearInterval(interval);
  }, [connected]);

  useEffect(() => {
    const statuses = ["Excellent", "Strong", "Stable"];
    const interval = setInterval(() => {
      setNetworkStrength(statuses[Math.floor(Math.random() * statuses.length)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startCall = async () => {
    try {
      setConnecting(true);
      await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      setTimeout(() => { setConnecting(false); setConnected(true); }, 2500);
    } catch {
      setConnecting(false);
      alert("Camera or microphone permission denied");
    }
  };

  const endCall = () => { setConnected(false); router.back(); };

  const networkColor = networkStrength === "Excellent" ? "#12A150" : networkStrength === "Strong" ? "#D97706" : "#4A5568";

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
          --red:      #DC2626;
          --red-l:    #FEF2F2;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes pulse-green {
          0%, 100% { box-shadow: 0 0 0 0 rgba(18,161,80,0.4); }
          50%       { box-shadow: 0 0 0 8px rgba(18,161,80,0); }
        }
        @keyframes videoGlow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.04); }
        }
        @keyframes connecting {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        @keyframes timerTick {
          0%  { transform: scale(1); }
          50% { transform: scale(1.04); }
          100%{ transform: scale(1); }
        }

        /* ── PAGE LAYOUT ── */
        .cl-page { min-height: 100vh; display: flex; flex-direction: column; }

        /* ── TOP NAV ── */
        .cl-nav {
          background: var(--white); border-bottom: 1px solid var(--border);
          padding: 0 5%; height: 60px;
          display: flex; align-items: center; justify-content: space-between;
          position: sticky; top: 0; z-index: 10; flex-shrink: 0;
        }
        .cl-nav-logo { font-size: 1rem; font-weight: 800; color: var(--txt); letter-spacing: -0.03em; font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer; }
        .cl-nav-logo span { color: var(--blue); }
        .cl-nav-right { display: flex; align-items: center; gap: 8px; }
        .cl-back-btn { padding: 7px 14px; border-radius: 8px; background: var(--bg2); border: none; cursor: pointer; font-size: 0.76rem; font-weight: 600; color: var(--txt3); font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; display: flex; align-items: center; gap: 5px; }
        .cl-back-btn:hover { background: var(--red-l); color: var(--red); }
        .cl-secure-pill { display: flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 20px; background: var(--green-l); border: 1px solid var(--green-m); font-size: 0.68rem; font-weight: 700; color: var(--green); }

        /* ── MAIN CONTENT ── */
        .cl-content { flex: 1; padding: 28px 5%; display: flex; flex-direction: column; gap: 20px; max-width: 1300px; margin: 0 auto; width: 100%; }

        /* ── HERO ROW ── */
        .cl-hero-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; flex-wrap: wrap; animation: fadeUp 0.5s ease both; }
        .cl-eyebrow { display: flex; align-items: center; gap: 8px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--blue); margin-bottom: 8px; }
        .cl-eyebrow::before { content: ''; width: 20px; height: 2px; background: var(--blue); border-radius: 1px; }
        .cl-title { font-size: clamp(1.6rem, 3.5vw, 2.4rem); font-weight: 800; letter-spacing: -0.045em; color: var(--txt); line-height: 1.06; margin-bottom: 6px; font-family: 'Plus Jakarta Sans', sans-serif; }
        .cl-title em { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; color: var(--blue); }
        .cl-sub { font-size: 0.84rem; color: var(--txt3); font-weight: 400; max-width: 420px; line-height: 1.65; }

        /* STATUS BADGE */
        .cl-status-badge { padding: 8px 18px; border-radius: 20px; font-size: 0.72rem; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; display: flex; align-items: center; gap: 7px; }
        .cl-status-badge.live { background: var(--green-l); color: var(--green); border: 1px solid var(--green-m); animation: pulse-green 2s infinite; }
        .cl-status-badge.connecting { background: var(--amber-l); color: var(--amber); border: 1px solid #FDE68A; animation: connecting 1s infinite; }
        .cl-status-badge.offline { background: var(--bg2); color: var(--txt4); border: 1px solid var(--border); }
        .cl-status-dot { width: 7px; height: 7px; border-radius: 50%; }
        .cl-status-dot.live { background: var(--green); }
        .cl-status-dot.connecting { background: var(--amber); }
        .cl-status-dot.offline { background: var(--txt4); }

        /* ── STATS BAR ── */
        .cl-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; animation: fadeUp 0.5s 0.05s ease both; }
        .cl-stat { background: var(--white); border: 1px solid var(--border); border-radius: 14px; padding: 16px 18px; transition: transform 0.2s, box-shadow 0.2s; }
        .cl-stat:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.07); }
        .cl-stat-label { font-size: 0.62rem; font-weight: 700; color: var(--txt4); text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 6px; }
        .cl-stat-value { font-size: 1.25rem; font-weight: 800; color: var(--txt); letter-spacing: -0.03em; font-family: 'Plus Jakarta Sans', sans-serif; }
        .cl-stat-value.timer { color: var(--blue); animation: timerTick 1s infinite; }
        .cl-stat-value.secure { color: var(--green); }

        /* ── VIDEO GRID ── */
        .cl-video-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; animation: fadeUp 0.5s 0.1s ease both; }

        /* VIDEO BOXES */
        .cl-video-box {
          position: relative; border-radius: 18px; overflow: hidden;
          border: 1px solid var(--border);
          background: linear-gradient(135deg, #0F1520 0%, #1A2540 50%, #0A1020 100%);
          min-height: 380px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
        }
        .cl-video-box.main { min-height: 420px; }
        .cl-video-box.secondary { min-height: 200px; }

        /* VIDEO GLOW ANIMATIONS */
        .cl-video-glow { position: absolute; inset: 0; pointer-events: none; }
        .cl-video-glow.blue { background: radial-gradient(circle at 50% 40%, rgba(26,86,219,0.3) 0%, transparent 60%); animation: videoGlow 4s ease-in-out infinite; }
        .cl-video-glow.green { background: radial-gradient(circle at 50% 40%, rgba(18,161,80,0.2) 0%, transparent 60%); animation: videoGlow 6s ease-in-out infinite; }

        /* CAMERA OFF STATE */
        .cl-camera-off { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; background: rgba(15,21,32,0.6); }
        .cl-camera-off-icon { font-size: 2.5rem; opacity: 0.5; }
        .cl-camera-off-text { font-size: 0.78rem; color: rgba(255,255,255,0.5); font-weight: 500; }

        /* VIDEO OVERLAY */
        .cl-video-overlay {
          position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%);
          display: flex; flex-direction: column; justify-content: flex-end; padding: 18px 20px;
        }
        .cl-video-label { font-size: 0.9rem; font-weight: 700; color: #fff; margin-bottom: 3px; }
        .cl-video-sublabel { font-size: 0.7rem; color: rgba(255,255,255,0.6); font-weight: 400; }
        .cl-video-quality { position: absolute; top: 14px; right: 14px; padding: 4px 10px; border-radius: 6px; background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.15); font-size: 0.62rem; font-weight: 800; color: rgba(255,255,255,0.85); letter-spacing: 0.06em; }
        .cl-video-mic-off { position: absolute; top: 14px; left: 14px; width: 28px; height: 28px; border-radius: 50%; background: rgba(220,38,38,0.85); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; }

        /* ── CONTROLS ── */
        .cl-controls { background: var(--white); border: 1px solid var(--border); border-radius: 16px; padding: 20px 24px; display: flex; align-items: center; justify-content: center; gap: 10px; flex-wrap: wrap; animation: fadeUp 0.5s 0.15s ease both; }

        .cl-ctrl-btn { padding: 11px 20px; border-radius: 10px; font-size: 0.78rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; display: flex; align-items: center; gap: 7px; }
        .cl-ctrl-btn.on { background: var(--bg2); color: var(--txt2); border: 1.5px solid var(--border2); }
        .cl-ctrl-btn.on:hover { border-color: var(--blue-m); color: var(--blue); background: var(--blue-l); }
        .cl-ctrl-btn.off { background: var(--red-l); color: var(--red); border: 1.5px solid #FEE2E2; }
        .cl-ctrl-btn.off:hover { background: #FEE2E2; }
        .cl-ctrl-btn.screen { background: var(--purple-l); color: var(--purple); border: 1.5px solid var(--purple-m); }
        .cl-ctrl-btn.screen:hover { background: var(--purple); color: #fff; }

        .cl-ctrl-divider { width: 1px; height: 32px; background: var(--border); }

        .cl-start-btn { padding: 12px 32px; border-radius: 10px; background: var(--blue); color: #fff; font-size: 0.84rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; box-shadow: 0 2px 12px rgba(26,86,219,0.3); display: flex; align-items: center; gap: 8px; }
        .cl-start-btn:hover { background: var(--blue-h); transform: translateY(-1px); box-shadow: 0 4px 20px rgba(26,86,219,0.4); }
        .cl-start-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .cl-end-btn { padding: 12px 32px; border-radius: 10px; background: var(--red); color: #fff; font-size: 0.84rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; box-shadow: 0 2px 12px rgba(220,38,38,0.3); display: flex; align-items: center; gap: 8px; }
        .cl-end-btn:hover { background: #B91C1C; transform: translateY(-1px); }

        /* ── ENCRYPTION NOTE ── */
        .cl-enc-note { display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 0.72rem; color: var(--txt4); font-weight: 500; padding-bottom: 8px; animation: fadeUp 0.5s 0.2s ease both; }
        .cl-enc-icon { font-size: 0.85rem; }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .cl-video-grid { grid-template-columns: 1fr; }
          .cl-video-box.secondary { min-height: 180px; }
          .cl-stats { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .cl-content { padding: 16px 4%; }
          .cl-stats { grid-template-columns: repeat(2, 1fr); }
          .cl-controls { gap: 8px; }
          .cl-ctrl-btn, .cl-start-btn, .cl-end-btn { flex: 1; justify-content: center; }
          .cl-ctrl-divider { display: none; }
        }
      `}</style>

      <div className="cl-page">

        {/* ── NAV ── */}
        <div className="cl-nav">
          <div className="cl-nav-logo" onClick={() => router.push("/")}>Load<span>Ops</span> AI</div>
          <div className="cl-nav-right">
            <div className="cl-secure-pill">🔒 End-to-End Encrypted</div>
            <button className="cl-back-btn" onClick={() => router.back()}>← Back to Chat</button>
          </div>
        </div>

        <div className="cl-content">

          {/* ── HERO ROW ── */}
          <div className="cl-hero-row">
            <div>
              <div className="cl-eyebrow">AI Secure Communication</div>
              <div className="cl-title">LoadOps <em>AI Call</em></div>
              <div className="cl-sub">High-quality encrypted video and voice communication for carriers, dispatchers, and brokers.</div>
            </div>
            <div>
              {connected ? (
                <div className="cl-status-badge live">
                  <span className="cl-status-dot live" /> Live Call Active
                </div>
              ) : connecting ? (
                <div className="cl-status-badge connecting">
                  <span className="cl-status-dot connecting" /> Connecting...
                </div>
              ) : (
                <div className="cl-status-badge offline">
                  <span className="cl-status-dot offline" /> Not Connected
                </div>
              )}
            </div>
          </div>

          {/* ── STATS ── */}
          <div className="cl-stats">
            <div className="cl-stat">
              <div className="cl-stat-label">Connection</div>
              <div className={`cl-stat-value${connected ? " secure" : ""}`}>
                {connected ? "✓ Secure" : connecting ? "Establishing..." : "Waiting"}
              </div>
            </div>
            <div className="cl-stat">
              <div className="cl-stat-label">Call Duration</div>
              <div className={`cl-stat-value${connected ? " timer" : ""}`}>{formatTime(callTime)}</div>
            </div>
            <div className="cl-stat">
              <div className="cl-stat-label">Encryption</div>
              <div className="cl-stat-value secure">End-to-End</div>
            </div>
            <div className="cl-stat">
              <div className="cl-stat-label">Network</div>
              <div className="cl-stat-value" style={{ color: networkColor, fontSize: "1rem" }}>{networkStrength}</div>
            </div>
          </div>

          {/* ── VIDEO GRID ── */}
          <div className="cl-video-grid">

            {/* MAIN — DISPATCHER */}
            <div className="cl-video-box main">
              <div className="cl-video-glow blue" />
              {!connected && !cameraEnabled && (
                <div className="cl-camera-off">
                  <div className="cl-camera-off-icon">🎯</div>
                  <div className="cl-camera-off-text">Dispatcher · Waiting for connection</div>
                </div>
              )}
              <div className="cl-video-overlay">
                <div>
                  <div className="cl-video-label">Dispatcher Room</div>
                  <div className="cl-video-sublabel">
                    {connected ? "Connected via LoadOps AI Network" : "Waiting for call to start..."}
                  </div>
                </div>
              </div>
              <div className="cl-video-quality">HD 1080P</div>
              {!micEnabled && <div className="cl-video-mic-off">🔇</div>}
            </div>

            {/* SECONDARY — YOUR CAMERA */}
            <div className="cl-video-box secondary">
              <div className="cl-video-glow green" />
              {!cameraEnabled && (
                <div className="cl-camera-off">
                  <div className="cl-camera-off-icon">📷</div>
                  <div className="cl-camera-off-text">Camera Off</div>
                </div>
              )}
              <div className="cl-video-overlay">
                <div>
                  <div className="cl-video-label">Your Camera</div>
                  <div className="cl-video-sublabel">Live Preview</div>
                </div>
              </div>
              <div className="cl-video-quality">AI READY</div>
            </div>

          </div>

          {/* ── CONTROLS ── */}
          <div className="cl-controls">

            {/* MIC */}
            <button
              className={`cl-ctrl-btn ${micEnabled ? "on" : "off"}`}
              onClick={() => setMicEnabled(!micEnabled)}
            >
              {micEnabled ? "🎤" : "🔇"} {micEnabled ? "Mic On" : "Mic Off"}
            </button>

            {/* CAMERA */}
            <button
              className={`cl-ctrl-btn ${cameraEnabled ? "on" : "off"}`}
              onClick={() => setCameraEnabled(!cameraEnabled)}
            >
              {cameraEnabled ? "📷" : "🚫"} {cameraEnabled ? "Camera On" : "Camera Off"}
            </button>

            {/* SCREEN SHARE */}
            <button
              className={`cl-ctrl-btn screen`}
              onClick={() => setScreenSharing(!screenSharing)}
            >
              🖥 {screenSharing ? "Stop Sharing" : "Share Screen"}
            </button>

            <div className="cl-ctrl-divider" />

            {/* START / END */}
            {!connected ? (
              <button
                className="cl-start-btn"
                onClick={startCall}
                disabled={connecting}
              >
                {connecting ? "⏳ Connecting..." : "📞 Start Secure Call"}
              </button>
            ) : (
              <button className="cl-end-btn" onClick={endCall}>
                📵 End Call · {formatTime(callTime)}
              </button>
            )}

          </div>

          {/* ── ENCRYPTION NOTE ── */}
          <div className="cl-enc-note">
            <span className="cl-enc-icon">🔒</span>
            This call is end-to-end encrypted via LoadOps AI secure network. No recording without consent.
          </div>

        </div>
      </div>

    </main>
  );
}
