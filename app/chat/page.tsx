"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

type Message = {
  id?: string;
  sender_id: string;
  receiver_id: string;
  message?: string;
  file_url?: string;
  file_type?: string;
  created_at?: string;
};

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [userId, setUserId] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [online, setOnline] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewFile, setPreviewFile] = useState("");
  const [typing, setTyping] = useState(false);
  const [lastSeen, setLastSeen] = useState("Online");
  const [sending, setSending] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // ── INIT ──
  useEffect(() => {
    let realtimeChannel: any;
    const initialize = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const currentUserId = user.id;
      setUserId(currentUserId);
      let receiver = searchParams.get("receiver");
      if (currentUserId === "f04084ee-60d8-4701-ad24-1a87a5dbc71d") {
        receiver = "7375649c-9e73-4341-b881-436614e375fa";
      } else {
        receiver = "f04084ee-60d8-4701-ad24-1a87a5dbc71d";
      }
      if (!receiver) return;
      setReceiverId(receiver);
      await fetchMessages(currentUserId, receiver);
      const channels = supabase.getChannels();
      channels.forEach(channel => supabase.removeChannel(channel));
      realtimeChannel = supabase
        .channel(`chat-${currentUserId}-${receiver}`)
        .on("postgres_changes", { event: "*", schema: "public", table: "chats" }, async (payload) => {
          const newMessage = payload.new as Message;
          if (!newMessage) return;
          const isCurrentChat =
            (newMessage.sender_id === currentUserId && newMessage.receiver_id === receiver) ||
            (newMessage.sender_id === receiver && newMessage.receiver_id === currentUserId);
          if (isCurrentChat) await fetchMessages(currentUserId, receiver);
        })
        .subscribe((status) => {
          if (status === "SUBSCRIBED") {
            setOnline(true); setLastSeen("Online"); setConnectionStatus("Secure · Live");
          } else {
            setOnline(false); setLastSeen("Offline"); setConnectionStatus("Reconnecting...");
          }
        });
    };
    initialize();
    return () => { if (realtimeChannel) supabase.removeChannel(realtimeChannel); };
  }, [router, searchParams]);

  const fetchMessages = async (currentUserId: string, currentReceiverId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("chats").select("*")
      .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${currentReceiverId}),and(sender_id.eq.${currentReceiverId},receiver_id.eq.${currentUserId})`)
      .order("created_at", { ascending: true });
    if (!error && data) { setMessages(data); setMessageCount(data.length); setTimeout(() => scrollToBottom(), 100); }
    setLoading(false);
  };

  const scrollToBottom = () => bottomRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      setShowScrollBtn(container.scrollTop < container.scrollHeight - container.clientHeight - 300);
    };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const sendMessage = async () => {
    if (!message.trim()) return;
    setSending(true);
    const cleanMessage = message.trim();
    setMessage(""); setTyping(false);
    const tempMessage: Message = { id: Date.now().toString(), sender_id: userId, receiver_id: receiverId, message: cleanMessage, created_at: new Date().toISOString() };
    setMessages(prev => [...prev, tempMessage]);
    scrollToBottom();
    const { error } = await supabase.from("chats").insert([{ sender_id: userId, receiver_id: receiverId, message: cleanMessage }]);
    if (error) { console.log(error); alert(error.message); }
    setSending(false);
  };

  const deleteMessage = async (id?: string) => {
    if (!id || !confirm("Delete this message?")) return;
    const { error } = await supabase.from("chats").delete().eq("id", id);
    if (!error) setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fileName = `${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from("chat-files").upload(fileName, file);
    if (uploadError) { alert(uploadError.message); setUploading(false); return; }
    const { data: publicUrlData } = supabase.storage.from("chat-files").getPublicUrl(fileName);
    const { error } = await supabase.from("chats").insert([{ sender_id: userId, receiver_id: receiverId, file_url: publicUrlData.publicUrl, file_type: file.type }]);
    if (error) alert(error.message);
    setUploading(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const fileName = `${Date.now()}-voice.webm`;
        const { error } = await supabase.storage.from("chat-files").upload(fileName, audioBlob);
        if (error) { alert(error.message); return; }
        const { data: publicUrlData } = supabase.storage.from("chat-files").getPublicUrl(fileName);
        await supabase.from("chats").insert([{ sender_id: userId, receiver_id: receiverId, file_url: publicUrlData.publicUrl, file_type: "audio/webm" }]);
      };
      mediaRecorder.start();
      setRecording(true);
    } catch { alert("Microphone permission denied"); }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) { mediaRecorderRef.current.stop(); setRecording(false); }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter") sendMessage(); };
  const openFile = (url: string) => window.open(url, "_blank");

  const startCall = async () => {
    try {
      const roomId = `loadops-${Date.now()}`;
      await supabase.from("calls").insert([{ caller_id: userId, receiver_id: receiverId, room_id: roomId, status: "calling" }]);
      router.push(`/call?room=${roomId}&receiver=${receiverId}`);
    } catch { alert("Unable to start call"); }
  };

  const filteredMessages = messages.filter(msg =>
    !searchText || msg.message?.toLowerCase().includes(searchText.toLowerCase()) || false
  );

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <main style={{ minHeight: "100vh", background: "#F7F8FA", fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#0F1520", display: "flex", flexDirection: "column" }}>

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
          --purple:   #7C3AED;
          --purple-l: #EDE9FE;
          --red:      #DC2626;
          --red-l:    #FEF2F2;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 3px #E6F7EE; }
          50%       { box-shadow: 0 0 0 6px #E6F7EE; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.35; }
        }
        @keyframes msgIn {
          from { opacity: 0; transform: translateY(6px) scale(0.98); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes recordPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(220,38,38,0.4); }
          50%       { box-shadow: 0 0 0 8px rgba(220,38,38,0); }
        }

        /* ── CHAT HEADER ── */
        .ch-header {
          background: var(--white);
          border-bottom: 1px solid var(--border);
          padding: 0 5%;
          display: flex; align-items: center; justify-content: space-between;
          height: 64px; gap: 16px; flex-shrink: 0;
          position: sticky; top: 0; z-index: 10;
        }
        .ch-header-left { display: flex; align-items: center; gap: 14px; }
        .ch-back-btn { width: 34px; height: 34px; border-radius: 9px; background: var(--bg2); border: none; cursor: pointer; font-size: 0.9rem; display: flex; align-items: center; justify-content: center; color: var(--txt3); transition: all 0.15s; }
        .ch-back-btn:hover { background: var(--blue-l); color: var(--blue); }
        .ch-logo { font-size: 1rem; font-weight: 800; color: var(--txt); letter-spacing: -0.03em; font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer; }
        .ch-logo span { color: var(--blue); }
        .ch-divider { width: 1px; height: 24px; background: var(--border); }
        .ch-contact { display: flex; align-items: center; gap: 10px; }
        .ch-avatar { width: 34px; height: 34px; border-radius: 50%; background: var(--blue-l); border: 2px solid var(--blue-m); display: flex; align-items: center; justify-content: center; font-size: 0.9rem; }
        .ch-contact-info {}
        .ch-contact-name { font-size: 0.82rem; font-weight: 700; color: var(--txt); }
        .ch-contact-status { font-size: 0.65rem; font-weight: 600; display: flex; align-items: center; gap: 4px; margin-top: 1px; }
        .ch-status-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
        .ch-status-dot.online  { background: var(--green); animation: pulse 2s infinite; }
        .ch-status-dot.offline { background: var(--red); }
        .ch-header-right { display: flex; align-items: center; gap: 8px; }
        .ch-stat-pill { display: flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 20px; background: var(--bg2); border: 1px solid var(--border); font-size: 0.68rem; font-weight: 600; color: var(--txt3); }
        .ch-secure-pill { display: flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 20px; background: var(--green-l); border: 1px solid var(--green-m); font-size: 0.68rem; font-weight: 700; color: var(--green); }
        .ch-call-btn { padding: 8px 16px; border-radius: 9px; background: var(--blue); color: #fff; font-size: 0.76rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; display: flex; align-items: center; gap: 6px; }
        .ch-call-btn:hover { background: var(--blue-h); transform: translateY(-1px); }

        /* ── SEARCH BAR ── */
        .ch-search-bar { background: var(--white); border-bottom: 1px solid var(--border); padding: 10px 5%; flex-shrink: 0; }
        .ch-search-input { width: 100%; max-width: 600px; padding: 8px 14px; border-radius: 20px; background: var(--bg); border: 1.5px solid var(--border2); color: var(--txt); font-size: 0.8rem; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; transition: border-color 0.15s; }
        .ch-search-input:focus { border-color: var(--blue); }
        .ch-search-input::placeholder { color: var(--txt4); }

        /* ── CHAT AREA ── */
        .ch-chat-area {
          flex: 1; overflow-y: auto; padding: 24px 5%;
          display: flex; flex-direction: column; gap: 4px;
          background: var(--bg);
        }
        .ch-chat-area::-webkit-scrollbar { width: 5px; }
        .ch-chat-area::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 999px; }

        /* DATE DIVIDER */
        .ch-date-divider { display: flex; align-items: center; gap: 10px; margin: 12px 0 8px; }
        .ch-date-divider-line { flex: 1; height: 1px; background: var(--border); }
        .ch-date-divider-txt { font-size: 0.65rem; font-weight: 700; color: var(--txt4); text-transform: uppercase; letter-spacing: 0.07em; padding: 2px 10px; background: var(--bg2); border-radius: 10px; }

        /* EMPTY / LOADING */
        .ch-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 40px 20px; }
        .ch-empty-icon { font-size: 2.5rem; margin-bottom: 12px; }
        .ch-empty-title { font-size: 0.9rem; font-weight: 700; color: var(--txt); margin-bottom: 5px; }
        .ch-empty-sub { font-size: 0.76rem; color: var(--txt3); }
        .ch-spinner { width: 32px; height: 32px; border: 3px solid var(--border); border-top-color: var(--blue); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 12px; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* MESSAGE WRAPPERS */
        .ch-msg-wrapper { display: flex; margin-bottom: 4px; animation: msgIn 0.2s ease both; }
        .ch-msg-wrapper.mine { justify-content: flex-end; }
        .ch-msg-wrapper.theirs { justify-content: flex-start; }

        /* CONSECUTIVE MESSAGES */
        .ch-msg-wrapper.mine + .ch-msg-wrapper.mine { margin-bottom: 2px; }
        .ch-msg-wrapper.theirs + .ch-msg-wrapper.theirs { margin-bottom: 2px; }

        /* BUBBLES */
        .ch-bubble {
          max-width: 62%;
          padding: 10px 14px;
          position: relative;
          word-break: break-word;
        }
        .ch-bubble.mine {
          background: var(--blue);
          color: #fff;
          border-radius: 18px 18px 4px 18px;
          box-shadow: 0 2px 12px rgba(26,86,219,0.18);
        }
        .ch-bubble.theirs {
          background: var(--white);
          color: var(--txt);
          border-radius: 18px 18px 18px 4px;
          border: 1px solid var(--border);
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .ch-msg-text { font-size: 0.84rem; line-height: 1.6; font-weight: 400; }
        .ch-bubble.mine .ch-msg-text { color: rgba(255,255,255,0.96); }

        /* MEDIA */
        .ch-chat-img { width: 100%; max-width: 280px; border-radius: 12px; cursor: pointer; transition: transform 0.2s; margin-top: 6px; display: block; }
        .ch-chat-img:hover { transform: scale(1.02); }
        .ch-audio { width: 100%; margin-top: 6px; border-radius: 8px; }
        .ch-file-btn { margin-top: 6px; padding: 7px 14px; border-radius: 8px; background: rgba(255,255,255,0.15); border: none; color: #fff; font-size: 0.76rem; font-weight: 600; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; display: flex; align-items: center; gap: 6px; transition: background 0.15s; }
        .ch-file-btn:hover { background: rgba(255,255,255,0.25); }
        .ch-bubble.theirs .ch-file-btn { background: var(--blue-l); color: var(--blue); }
        .ch-bubble.theirs .ch-file-btn:hover { background: var(--blue-m); }

        /* MSG FOOTER */
        .ch-msg-footer { display: flex; align-items: center; justify-content: flex-end; gap: 8px; margin-top: 4px; }
        .ch-msg-time { font-size: 0.62rem; font-weight: 500; opacity: 0.65; }
        .ch-bubble.theirs .ch-msg-time { color: var(--txt4); opacity: 1; }
        .ch-delete-btn { background: none; border: none; font-size: 0.62rem; cursor: pointer; opacity: 0; transition: opacity 0.15s; color: rgba(255,255,255,0.7); padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; }
        .ch-bubble:hover .ch-delete-btn { opacity: 1; }
        .ch-bubble.theirs .ch-delete-btn { color: var(--red); }

        /* TYPING */
        .ch-typing { display: flex; align-items: center; gap: 6px; padding: 8px 14px; background: var(--white); border: 1px solid var(--border); border-radius: 18px; width: fit-content; }
        .ch-typing-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--txt4); animation: blink 1.2s infinite; }
        .ch-typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .ch-typing-dot:nth-child(3) { animation-delay: 0.4s; }

        /* ── INPUT AREA ── */
        .ch-input-area {
          background: var(--white); border-top: 1px solid var(--border);
          padding: 12px 5%; display: flex; align-items: center; gap: 8px; flex-shrink: 0;
        }
        .ch-icon-btn { width: 40px; height: 40px; border-radius: 10px; background: var(--bg2); border: 1.5px solid var(--border2); cursor: pointer; font-size: 1.05rem; display: flex; align-items: center; justify-content: center; color: var(--txt3); transition: all 0.15s; flex-shrink: 0; }
        .ch-icon-btn:hover { background: var(--blue-l); border-color: var(--blue-m); color: var(--blue); }
        .ch-record-btn { width: 40px; height: 40px; border-radius: 10px; background: var(--red-l); border: 1.5px solid #FEE2E2; cursor: pointer; font-size: 1.05rem; display: flex; align-items: center; justify-content: center; color: var(--red); flex-shrink: 0; animation: recordPulse 1s infinite; }
        .ch-msg-input { flex: 1; padding: 10px 16px; border-radius: 22px; background: var(--bg); border: 1.5px solid var(--border2); color: var(--txt); font-size: 0.84rem; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; transition: border-color 0.15s, box-shadow 0.15s; }
        .ch-msg-input:focus { border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-l); background: var(--white); }
        .ch-msg-input::placeholder { color: var(--txt4); }
        .ch-send-btn { padding: 10px 22px; border-radius: 22px; background: var(--blue); color: #fff; font-size: 0.82rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; flex-shrink: 0; box-shadow: 0 2px 10px rgba(26,86,219,0.25); display: flex; align-items: center; gap: 6px; }
        .ch-send-btn:hover { background: var(--blue-h); transform: translateY(-1px); }
        .ch-send-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        /* SCROLL BTN */
        .ch-scroll-btn { position: fixed; bottom: 90px; right: 24px; width: 40px; height: 40px; border-radius: 50%; background: var(--blue); color: #fff; font-size: 1rem; border: none; cursor: pointer; z-index: 20; box-shadow: 0 4px 16px rgba(26,86,219,0.3); transition: all 0.15s; }
        .ch-scroll-btn:hover { background: var(--blue-h); transform: translateY(-2px); }

        /* PREVIEW MODALS */
        .ch-preview-overlay { position: fixed; inset: 0; background: rgba(15,21,32,0.85); backdrop-filter: blur(8px); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px; cursor: pointer; }
        .ch-preview-img { max-width: 90%; max-height: 90%; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
        .ch-preview-iframe { width: 88%; height: 88%; border: none; border-radius: 16px; background: #fff; }
        .ch-preview-close { position: fixed; top: 20px; right: 20px; width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.15); border: none; color: #fff; font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .ch-header { padding: 0 4%; }
          .ch-search-bar, .ch-chat-area, .ch-input-area { padding-left: 4%; padding-right: 4%; }
          .ch-bubble { max-width: 88%; }
          .ch-stat-pill, .ch-secure-pill { display: none; }
          .ch-send-btn span { display: none; }
        }
      `}</style>

      {/* ── IMAGE PREVIEW ── */}
      {previewImage && (
        <div className="ch-preview-overlay" onClick={() => setPreviewImage("")}>
          <button className="ch-preview-close" onClick={() => setPreviewImage("")}>✕</button>
          <img src={previewImage} alt="preview" className="ch-preview-img" />
        </div>
      )}

      {/* ── FILE PREVIEW ── */}
      {previewFile && (
        <div className="ch-preview-overlay" onClick={() => setPreviewFile("")}>
          <button className="ch-preview-close" onClick={() => setPreviewFile("")}>✕</button>
          <iframe src={previewFile} className="ch-preview-iframe" />
        </div>
      )}

      {/* ── HEADER ── */}
      <div className="ch-header">
        <div className="ch-header-left">
          <button className="ch-back-btn" onClick={() => router.back()}>←</button>
          <div className="ch-logo" onClick={() => router.push("/")}>Load<span>Ops</span> AI</div>
          <div className="ch-divider" />
          <div className="ch-contact">
            <div className="ch-avatar">🎯</div>
            <div className="ch-contact-info">
              <div className="ch-contact-name">Dispatcher Chat</div>
              <div className="ch-contact-status" style={{ color: online ? "#12A150" : "#DC2626" }}>
                <span className={`ch-status-dot ${online ? "online" : "offline"}`} />
                {lastSeen}
              </div>
            </div>
          </div>
        </div>

        <div className="ch-header-right">
          <div className="ch-stat-pill">💬 {messageCount} messages</div>
          <div className="ch-secure-pill">🔒 {connectionStatus}</div>
          <button className="ch-call-btn" onClick={startCall}>📞 <span>Start Call</span></button>
        </div>
      </div>

      {/* ── SEARCH ── */}
      <div className="ch-search-bar">
        <input
          type="text"
          className="ch-search-input"
          placeholder="🔍  Search messages..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* ── CHAT AREA ── */}
      <div className="ch-chat-area" ref={chatContainerRef}>
        {loading ? (
          <div className="ch-empty">
            <div className="ch-spinner" />
            <div className="ch-empty-title">Loading messages...</div>
          </div>

        ) : filteredMessages.length === 0 ? (
          <div className="ch-empty">
            <div className="ch-empty-icon">💬</div>
            <div className="ch-empty-title">{searchText ? "No messages match your search" : "No messages yet"}</div>
            <div className="ch-empty-sub">{searchText ? "Try a different keyword." : "Send a message to start the conversation."}</div>
          </div>

        ) : (
          filteredMessages.map((msg, idx) => {
            const isMine = msg.sender_id === userId;
            const prevMsg = filteredMessages[idx - 1];
            const showDate = !prevMsg || formatDate(msg.created_at) !== formatDate(prevMsg.created_at);

            return (
              <div key={msg.id}>
                {showDate && (
                  <div className="ch-date-divider">
                    <div className="ch-date-divider-line" />
                    <div className="ch-date-divider-txt">{formatDate(msg.created_at)}</div>
                    <div className="ch-date-divider-line" />
                  </div>
                )}
                <div className={`ch-msg-wrapper ${isMine ? "mine" : "theirs"}`}>
                  <div className={`ch-bubble ${isMine ? "mine" : "theirs"}`}>
                    {/* TEXT */}
                    {msg.message && <div className="ch-msg-text">{msg.message}</div>}

                    {/* IMAGE */}
                    {msg.file_url && msg.file_type?.startsWith("image") && (
                      <img src={msg.file_url} alt="img" className="ch-chat-img" onClick={() => setPreviewImage(msg.file_url!)} />
                    )}

                    {/* AUDIO */}
                    {msg.file_url && msg.file_type?.startsWith("audio") && (
                      <audio controls className="ch-audio"><source src={msg.file_url} /></audio>
                    )}

                    {/* OTHER FILE */}
                    {msg.file_url && !msg.file_type?.startsWith("image") && !msg.file_type?.startsWith("audio") && (
                      <button className="ch-file-btn" onClick={() => openFile(msg.file_url!)}>📄 Open File</button>
                    )}

                    <div className="ch-msg-footer">
                      <span className="ch-msg-time">{formatTime(msg.created_at)}</span>
                      {isMine && (
                        <button className="ch-delete-btn" onClick={() => deleteMessage(msg.id)}>Delete</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* TYPING */}
        {typing && (
          <div className="ch-msg-wrapper theirs">
            <div className="ch-typing">
              <span className="ch-typing-dot" />
              <span className="ch-typing-dot" />
              <span className="ch-typing-dot" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* SCROLL TO BOTTOM */}
      {showScrollBtn && (
        <button className="ch-scroll-btn" onClick={scrollToBottom}>↓</button>
      )}

      {/* ── INPUT AREA ── */}
      <div className="ch-input-area">
        <button className="ch-icon-btn" onClick={() => fileInputRef.current?.click()} title="Attach file">
          📎
        </button>
        <input type="file" hidden ref={fileInputRef} onChange={uploadFile} />

        <button
          className={recording ? "ch-record-btn" : "ch-icon-btn"}
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          title="Hold to record voice"
        >
          🎤
        </button>

        <input
          type="text"
          className="ch-msg-input"
          placeholder={uploading ? "Uploading file..." : recording ? "Recording... release to send" : "Type a message..."}
          value={message}
          onChange={(e) => { setMessage(e.target.value); setTyping(e.target.value.length > 0); }}
          onKeyDown={handleKeyDown}
          disabled={uploading}
        />

        <button className="ch-send-btn" onClick={sendMessage} disabled={sending || uploading || !message.trim()}>
          {sending ? "..." : uploading ? "⏳" : <><span>Send</span> ↗</>}
        </button>
      </div>

    </main>
  );
}
