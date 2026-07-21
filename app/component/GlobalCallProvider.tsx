"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useVideoCall, type VideoCallApi } from "@/app/lib/webrtc/useVideoCall";
import VideoCallModal from "@/app/component/VideoCallModal";

const CallContext = createContext<VideoCallApi | null>(null);

/**
 * Use this anywhere inside <GlobalCallProvider> to start a call:
 *   const call = useCall();
 *   call.startCall(otherUserId, "Display Name");
 */
export function useCall(): VideoCallApi {
  const ctx = useContext(CallContext);
  if (!ctx) {
    throw new Error("useCall() must be used inside <GlobalCallProvider>. Wrap it around your app in app/layout.tsx.");
  }
  return ctx;
}

export default function GlobalCallProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      setUserId(data.user?.id ?? null);
      setUserName(data.user?.email || "User");
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
      setUserName(session?.user?.email || "User");
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // The hook is always called (even with userId === null) — it simply won't
  // subscribe to a channel until a real id is available. This keeps the
  // context value stable across login/logout.
  const call = useVideoCall(userId, userName);

  return (
    <CallContext.Provider value={call}>
      {children}
      <VideoCallModal call={call} />
    </CallContext.Provider>
  );
}
