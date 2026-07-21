"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/app/lib/supabase";

export type CallStatus =
  | "idle"
  | "outgoing-ringing"
  | "incoming-ringing"
  | "connecting"
  | "connected"
  | "ended"
  | "error";

type SignalPayload =
  | { kind: "call-request"; callId: string; from: string; fromName?: string }
  | { kind: "call-accept"; callId: string; from: string }
  | { kind: "call-decline"; callId: string; from: string }
  | { kind: "call-cancel"; callId: string; from: string }
  | { kind: "call-end"; callId: string; from: string }
  | { kind: "offer"; callId: string; from: string; sdp: RTCSessionDescriptionInit }
  | { kind: "answer"; callId: string; from: string; sdp: RTCSessionDescriptionInit }
  | { kind: "ice-candidate"; callId: string; from: string; candidate: RTCIceCandidateInit };

function describeMediaError(err: any): string {
  if (err?.name === "NotAllowedError" || err?.name === "PermissionDeniedError") {
    return "Camera/microphone access was blocked. Allow access in your browser's address bar and try again.";
  }
  if (err?.name === "NotFoundError" || err?.name === "DevicesNotFoundError") {
    return "No camera or microphone was found on this device.";
  }
  if (err?.name === "NotReadableError" || err?.name === "TrackStartError") {
    return "Your camera is already in use by another app or browser tab.";
  }
  return err?.message || "Couldn't access your camera or microphone.";
}

/**
 * Two-way video calling over Supabase Realtime broadcast (signaling) + WebRTC (media).
 * Mount ONE instance per logged-in user, ideally inside a provider in the root layout,
 * so the user can receive calls from any page in the app.
 */
export function useVideoCall(selfId: string | null, selfName?: string) {
  const [status, setStatus] = useState<CallStatus>("idle");
  const [peerName, setPeerName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  // Engine state lives in refs so the long-lived realtime listener (registered once)
  // never reads stale values — it always reads .current.
  const statusRef = useRef<CallStatus>("idle");
  const callIdRef = useRef<string | null>(null);
  const peerIdRef = useRef<string | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const pendingOfferRef = useRef<(SignalPayload & { kind: "offer" }) | null>(null);
  const peerChannelRef = useRef<{ channel: any; peerId: string; ready: boolean } | null>(null);
  const ringTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  const setStatusBoth = (s: CallStatus) => {
    statusRef.current = s;
    setStatus(s);
  };

  // ── signaling channel helpers ──
  const ensurePeerChannel = (peerId: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      const existing = peerChannelRef.current;
      if (existing && existing.peerId === peerId && existing.ready) {
        resolve(existing.channel);
        return;
      }
      if (existing?.channel) {
        try { supabase.removeChannel(existing.channel); } catch {}
      }
      const channel = supabase.channel(`call-inbox-${peerId}`);
      const wrapper = { channel, peerId, ready: false };
      peerChannelRef.current = wrapper;
      channel.subscribe((s: string) => {
        if (s === "SUBSCRIBED") {
          wrapper.ready = true;
          resolve(channel);
        } else if (s === "CHANNEL_ERROR" || s === "TIMED_OUT" || s === "CLOSED") {
          reject(new Error("Could not reach the other party right now."));
        }
      });
    });
  };

  const sendSignal = async (peerId: string, payload: SignalPayload) => {
    try {
      const channel = await ensurePeerChannel(peerId);
      channel.send({ type: "broadcast", event: "signal", payload });
    } catch (err) {
      console.error("sendSignal failed:", err);
    }
  };

  // ── media ──
  const getLocalMedia = async () => {
    if (localStreamRef.current) return localStreamRef.current;
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      throw new Error("Camera access isn't supported in this browser.");
    }
    if (window.location.protocol !== "https:" && window.location.hostname !== "localhost") {
      throw new Error("Camera access requires HTTPS. Open this app over https:// to make calls.");
    }
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
      audio: true,
    });
    localStreamRef.current = stream;
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
      localVideoRef.current.play().catch(() => {});
    }
    return stream;
  };

  const stopLocalMedia = () => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
  };

  // ── peer connection ──
  const createPeerConnection = (peerId: string, callId: string) => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    });

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        sendSignal(peerId, { kind: "ice-candidate", callId, from: selfId as string, candidate: e.candidate.toJSON() });
      }
    };

    pc.ontrack = (e) => {
      const stream = e.streams[0] || new MediaStream([e.track]);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
        remoteVideoRef.current.play().catch(() => {});
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "connected") {
        setStatusBoth("connected");
        if (ringTimeoutRef.current) { clearTimeout(ringTimeoutRef.current); ringTimeoutRef.current = null; }
      }
      if (["failed", "disconnected", "closed"].includes(pc.connectionState)) {
        if (statusRef.current === "connected" || statusRef.current === "connecting") {
          cleanupCall("Call ended.");
        }
      }
    };

    pcRef.current = pc;
    return pc;
  };

  const attachLocalTracks = (pc: RTCPeerConnection, stream: MediaStream) => {
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));
  };

  const flushPendingCandidates = async () => {
    const pc = pcRef.current;
    if (!pc) return;
    for (const c of pendingCandidatesRef.current) {
      try { await pc.addIceCandidate(c); } catch (err) { console.error("addIceCandidate failed:", err); }
    }
    pendingCandidatesRef.current = [];
  };

  // ── outgoing call ──
  const startCall = async (peerId: string, peerDisplayName?: string) => {
    if (!selfId) { setErrorMsg("You must be logged in to make calls."); setStatusBoth("error"); return; }
    if (statusRef.current !== "idle") return;

    const callId = crypto.randomUUID();
    callIdRef.current = callId;
    peerIdRef.current = peerId;
    setPeerName(peerDisplayName || "");
    setErrorMsg("");
    setStatusBoth("outgoing-ringing");

    try {
      await getLocalMedia();
    } catch (err: any) {
      setErrorMsg(describeMediaError(err));
      setStatusBoth("error");
      return;
    }

    sendSignal(peerId, { kind: "call-request", callId, from: selfId, fromName: selfName });

    ringTimeoutRef.current = setTimeout(() => {
      if (statusRef.current === "outgoing-ringing") {
        sendSignal(peerId, { kind: "call-cancel", callId, from: selfId });
        cleanupCall("No answer. Try again later.");
      }
    }, 45000);
  };

  const cancelOutgoing = () => {
    if (peerIdRef.current && callIdRef.current && selfId) {
      sendSignal(peerIdRef.current, { kind: "call-cancel", callId: callIdRef.current, from: selfId });
    }
    cleanupCall();
  };

  // ── incoming call ──
  const acceptCall = async () => {
    const peerId = peerIdRef.current;
    const callId = callIdRef.current;
    if (!peerId || !callId || !selfId) return;

    setStatusBoth("connecting");
    sendSignal(peerId, { kind: "call-accept", callId, from: selfId });

    try {
      const stream = await getLocalMedia();
      const pc = createPeerConnection(peerId, callId);
      attachLocalTracks(pc, stream);

      if (pendingOfferRef.current && pendingOfferRef.current.callId === callId) {
        await applyOffer(pendingOfferRef.current);
        pendingOfferRef.current = null;
      }
    } catch (err: any) {
      setErrorMsg(describeMediaError(err));
      setStatusBoth("error");
      sendSignal(peerId, { kind: "call-end", callId, from: selfId });
    }
  };

  const declineCall = () => {
    if (peerIdRef.current && callIdRef.current && selfId) {
      sendSignal(peerIdRef.current, { kind: "call-decline", callId: callIdRef.current, from: selfId });
    }
    cleanupCall();
  };

  // ── offer / answer ──
  const applyOffer = async (payload: SignalPayload & { kind: "offer" }) => {
    const pc = pcRef.current;
    if (!pc) { pendingOfferRef.current = payload; return; }
    if (!selfId) return;
    await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
    await flushPendingCandidates();
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    sendSignal(payload.from, { kind: "answer", callId: payload.callId, from: selfId, sdp: answer });
  };

  const createAndSendOffer = async (peerId: string, callId: string) => {
    if (!selfId) return;
    try {
      const stream = await getLocalMedia();
      const pc = createPeerConnection(peerId, callId);
      attachLocalTracks(pc, stream);
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      sendSignal(peerId, { kind: "offer", callId, from: selfId, sdp: offer });
    } catch (err: any) {
      setErrorMsg(describeMediaError(err));
      setStatusBoth("error");
    }
  };

  // ── cleanup ──
  const cleanupCall = (message?: string) => {
    if (ringTimeoutRef.current) { clearTimeout(ringTimeoutRef.current); ringTimeoutRef.current = null; }
    pcRef.current?.close();
    pcRef.current = null;
    stopLocalMedia();
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    pendingCandidatesRef.current = [];
    pendingOfferRef.current = null;
    callIdRef.current = null;
    peerIdRef.current = null;
    setPeerName("");
    setMicOn(true);
    setCamOn(true);

    if (message) {
      setErrorMsg(message);
      setStatusBoth("ended");
      setTimeout(() => { setStatusBoth("idle"); setErrorMsg(""); }, 2500);
    } else {
      setErrorMsg("");
      setStatusBoth("idle");
    }
  };

  const endCall = () => {
    if (peerIdRef.current && callIdRef.current && selfId) {
      sendSignal(peerIdRef.current, { kind: "call-end", callId: callIdRef.current, from: selfId });
    }
    cleanupCall();
  };

  const dismiss = () => cleanupCall();

  // ── incoming signal router ──
  const handleSignal = (payload: SignalPayload) => {
    if (!selfId) return;
    switch (payload.kind) {
      case "call-request": {
        if (statusRef.current !== "idle") {
          sendSignal(payload.from, { kind: "call-decline", callId: payload.callId, from: selfId });
          return;
        }
        callIdRef.current = payload.callId;
        peerIdRef.current = payload.from;
        setPeerName(payload.fromName || "Someone");
        setErrorMsg("");
        setStatusBoth("incoming-ringing");
        break;
      }
      case "call-accept": {
        if (statusRef.current === "outgoing-ringing" && payload.callId === callIdRef.current) {
          if (ringTimeoutRef.current) { clearTimeout(ringTimeoutRef.current); ringTimeoutRef.current = null; }
          setStatusBoth("connecting");
          createAndSendOffer(payload.from, payload.callId);
        }
        break;
      }
      case "call-decline": {
        if (payload.callId === callIdRef.current) cleanupCall("Call declined.");
        break;
      }
      case "call-cancel": {
        if (payload.callId === callIdRef.current) cleanupCall("The caller canceled the call.");
        break;
      }
      case "call-end": {
        if (payload.callId === callIdRef.current) cleanupCall("Call ended.");
        break;
      }
      case "offer": {
        if (payload.callId === callIdRef.current) applyOffer(payload);
        break;
      }
      case "answer": {
        if (payload.callId === callIdRef.current && pcRef.current) {
          pcRef.current
            .setRemoteDescription(new RTCSessionDescription(payload.sdp))
            .then(flushPendingCandidates)
            .catch((err) => console.error("setRemoteDescription(answer) failed:", err));
        }
        break;
      }
      case "ice-candidate": {
        if (payload.callId === callIdRef.current) {
          const pc = pcRef.current;
          if (pc && pc.remoteDescription) {
            pc.addIceCandidate(payload.candidate).catch((err) => console.error("addIceCandidate failed:", err));
          } else {
            pendingCandidatesRef.current.push(payload.candidate);
          }
        }
        break;
      }
    }
  };

  // ── subscribe to own inbox for the lifetime of this hook instance ──
  useEffect(() => {
    if (!selfId) return;
    const channel = supabase.channel(`call-inbox-${selfId}`);
    channel.on("broadcast", { event: "signal" }, ({ payload }: any) => handleSignal(payload));
    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
      if (peerChannelRef.current?.channel) supabase.removeChannel(peerChannelRef.current.channel);
      pcRef.current?.close();
      stopLocalMedia();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selfId]);

  // ── mic / cam toggles ──
  const toggleMic = () => {
    const next = !micOn;
    localStreamRef.current?.getAudioTracks().forEach((t) => (t.enabled = next));
    setMicOn(next);
  };
  const toggleCam = () => {
    const next = !camOn;
    localStreamRef.current?.getVideoTracks().forEach((t) => (t.enabled = next));
    setCamOn(next);
  };

  return {
    status,
    peerName,
    errorMsg,
    micOn,
    camOn,
    localVideoRef,
    remoteVideoRef,
    startCall,
    cancelOutgoing,
    acceptCall,
    declineCall,
    endCall,
    dismiss,
    toggleMic,
    toggleCam,
  };
}

export type VideoCallApi = ReturnType<typeof useVideoCall>;