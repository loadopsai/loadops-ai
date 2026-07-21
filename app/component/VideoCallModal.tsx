"use client";

import type { VideoCallApi } from "@/app/lib/webrtc/useVideoCall";

export default function VideoCallModal({ call }: { call: VideoCallApi }) {
  const { status } = call;

  if (status === "idle") return null;

  return (
    <div className="vc-overlay">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');

        .vc-overlay { position: fixed; inset: 0; background: rgba(10,12,18,0.85); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px; font-family: 'Plus Jakarta Sans', sans-serif; }
        .vc-modal { background: #0F1520; border-radius: 20px; width: 100%; max-width: 480px; box-shadow: 0 24px 70px rgba(0,0,0,0.45); overflow: hidden; }

        .vc-header { padding: 18px 22px; display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.04); }
        .vc-title { font-size: 0.88rem; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 8px; }
        .vc-close { width: 30px; height: 30px; border-radius: 8px; background: rgba(255,255,255,0.08); border: none; cursor: pointer; font-size: 0.85rem; color: #fff; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
        .vc-close:hover { background: rgba(255,255,255,0.16); }

        .vc-stage { position: relative; background: #060810; min-height: 320px; display: flex; align-items: center; justify-content: center; }
        .vc-remote-video { width: 100%; max-height: 380px; object-fit: cover; background: #060810; display: block; }
        .vc-local-pip { position: absolute; bottom: 14px; right: 14px; width: 96px; height: 72px; border-radius: 10px; overflow: hidden; border: 2px solid rgba(255,255,255,0.25); background: #000; }
        .vc-local-pip video { width: 100%; height: 100%; object-fit: cover; }
        .vc-pip-label { position: absolute; bottom: 12px; left: 14px; font-size: 0.68rem; font-weight: 700; color: #fff; background: rgba(0,0,0,0.45); padding: 3px 10px; border-radius: 20px; }

        .vc-status { text-align: center; padding: 40px 24px; color: #9CA3AF; }
        .vc-avatar { width: 76px; height: 76px; border-radius: 50%; background: #1E293B; color: #fff; font-size: 1.6rem; font-weight: 700; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
        .vc-avatar.ringing { animation: vc-pulse 1.4s infinite; }
        @keyframes vc-pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(124,58,237,0.45); } 50% { box-shadow: 0 0 0 14px rgba(124,58,237,0); } }
        .vc-status-title { font-size: 0.92rem; font-weight: 700; color: #fff; margin-bottom: 6px; }
        .vc-status-sub { font-size: 0.78rem; color: #9CA3AF; line-height: 1.6; }
        .vc-spinner { width: 32px; height: 32px; border: 3px solid rgba(255,255,255,0.15); border-top-color: #7C3AED; border-radius: 50%; animation: vc-spin 0.8s linear infinite; margin: 0 auto 14px; }
        @keyframes vc-spin { to { transform: rotate(360deg); } }

        .vc-controls { display: flex; align-items: center; justify-content: center; gap: 14px; padding: 18px 22px 24px; }
        .vc-ctrl-btn { width: 48px; height: 48px; border-radius: 50%; border: none; cursor: pointer; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; transition: all 0.15s; background: rgba(255,255,255,0.1); color: #fff; }
        .vc-ctrl-btn:hover { background: rgba(255,255,255,0.18); }
        .vc-ctrl-btn.off { background: rgba(220,38,38,0.85); }
        .vc-ctrl-btn.end { background: #DC2626; width: 56px; }
        .vc-ctrl-btn.end:hover { background: #B91C1C; }

        .vc-incoming-actions { display: flex; gap: 14px; justify-content: center; padding: 0 24px 28px; }
        .vc-big-btn { flex: 1; max-width: 160px; padding: 13px; border-radius: 12px; font-weight: 700; font-size: 0.86rem; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; }
        .vc-big-btn.accept { background: #12A150; color: #fff; }
        .vc-big-btn.accept:hover { background: #0e8f45; }
        .vc-big-btn.decline { background: #DC2626; color: #fff; }
        .vc-big-btn.decline:hover { background: #B91C1C; }

        .vc-cancel-btn { display: block; margin: 0 auto 26px; padding: 10px 22px; border-radius: 10px; background: rgba(255,255,255,0.08); color: #fff; font-weight: 700; font-size: 0.82rem; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; }
        .vc-cancel-btn:hover { background: rgba(255,255,255,0.16); }

        .vc-retry-btn { padding: 9px 20px; border-radius: 9px; background: #7C3AED; color: #fff; font-size: 0.8rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; margin-top: 16px; }
        .vc-retry-btn:hover { background: #6D28D9; }
      `}</style>

      <div className="vc-modal" onClick={(e) => e.stopPropagation()}>

        <div className="vc-header">
          <div className="vc-title">
            📹 {call.peerName ? call.peerName : "Video Call"}
          </div>
          {(status === "error" || status === "ended") && (
            <button className="vc-close" onClick={call.dismiss}>✕</button>
          )}
        </div>

        {/* ── OUTGOING: RINGING ── */}
        {status === "outgoing-ringing" && (
          <>
            <div className="vc-status">
              <div className="vc-avatar ringing">{(call.peerName || "?").charAt(0).toUpperCase()}</div>
              <div className="vc-status-title">Calling {call.peerName || "the other party"}…</div>
              <div className="vc-status-sub">Waiting for them to answer</div>
            </div>
            <button className="vc-cancel-btn" onClick={call.cancelOutgoing}>Cancel Call</button>
          </>
        )}

        {/* ── INCOMING: RINGING ── */}
        {status === "incoming-ringing" && (
          <>
            <div className="vc-status">
              <div className="vc-avatar ringing">{(call.peerName || "?").charAt(0).toUpperCase()}</div>
              <div className="vc-status-title">Incoming call from {call.peerName || "Someone"}</div>
              <div className="vc-status-sub">They'd like to start a video call with you</div>
            </div>
            <div className="vc-incoming-actions">
              <button className="vc-big-btn decline" onClick={call.declineCall}>✕ Decline</button>
              <button className="vc-big-btn accept" onClick={call.acceptCall}>✓ Accept</button>
            </div>
          </>
        )}

        {/* ── CONNECTING ── */}
        {status === "connecting" && (
          <div className="vc-status">
            <div className="vc-spinner" />
            <div className="vc-status-title">Connecting…</div>
            <div className="vc-status-sub">Setting up secure audio &amp; video</div>
          </div>
        )}

        {/* ── CONNECTED ── */}
        {status === "connected" && (
          <>
            <div className="vc-stage">
              <video ref={call.remoteVideoRef} className="vc-remote-video" autoPlay playsInline />
              <div className="vc-local-pip">
                <video ref={call.localVideoRef} autoPlay playsInline muted />
              </div>
              <div className="vc-pip-label">{call.peerName || "Connected"}</div>
            </div>
            <div className="vc-controls">
              <button className={`vc-ctrl-btn${!call.micOn ? " off" : ""}`} onClick={call.toggleMic} title={call.micOn ? "Mute" : "Unmute"}>
                {call.micOn ? "🎙️" : "🔇"}
              </button>
              <button className={`vc-ctrl-btn${!call.camOn ? " off" : ""}`} onClick={call.toggleCam} title={call.camOn ? "Camera off" : "Camera on"}>
                {call.camOn ? "📷" : "🚫"}
              </button>
              <button className="vc-ctrl-btn end" onClick={call.endCall} title="End call">📞</button>
            </div>
          </>
        )}

        {/* ── ERROR ── */}
        {status === "error" && (
          <div className="vc-status">
            <div className="vc-status-title">🚫 Call failed</div>
            <div className="vc-status-sub">{call.errorMsg}</div>
          </div>
        )}

        {/* ── ENDED ── */}
        {status === "ended" && (
          <div className="vc-status">
            <div className="vc-status-title">📞 {call.errorMsg || "Call ended"}</div>
          </div>
        )}

      </div>
    </div>
  );
}
