"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const INITIAL_MSGS = [
  { id: 1, text: "Hey! How's the encryption module going?", sender: "them", time: "10:42 AM", read: true },
  { id: 2, text: "Fully operational 🔒 X25519 key exchange + XSalsa20-Poly1305 symmetric encryption. Keys never leave the device.", sender: "me", time: "10:43 AM", read: true },
  { id: 3, text: "That's incredible! So even ChatKit servers can't read our messages?", sender: "them", time: "10:44 AM", read: true },
  { id: 4, text: "Correct. The server only sees encrypted ciphertext. Not even ISPs can intercept it. Plus we pad every message to hide the actual length.", sender: "me", time: "10:45 AM", read: true },
  { id: 5, text: "Perfect security 🛡️ Can you send the 800MB dataset through here?", sender: "them", time: "10:46 AM", read: false },
];

export default function ChatPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(INITIAL_MSGS);
  const [showAttach, setShowAttach] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages(p => [...p, { id: Date.now(), text: message, sender: "me", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), read: false }]);
    setMessage("");
    if (taRef.current) taRef.current.style.height = "44px";
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    const el = e.target;
    el.style.height = "44px";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "#080d12", display: "flex", flexDirection: "column" }}>
      {/* TOP BAR */}
      <div className="glass" style={{ height: 56, display: "flex", alignItems: "center", padding: "0 6px", flexShrink: 0, zIndex: 10 }}>
        <button onClick={() => router.push("/chats")} style={{ background: "none", border: "none", cursor: "pointer", padding: 8 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        </button>
        <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg, #00c896, #00c89688)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "white", marginLeft: 4 }}>AS</div>
        <div style={{ flex: 1, marginLeft: 10, cursor: "pointer" }}>
          <div style={{ color: "var(--text-primary)", fontSize: 16, fontWeight: 600, lineHeight: 1.2 }}>Alex Storm</div>
          <div style={{ color: "var(--accent)", fontSize: 12, lineHeight: 1.2 }}>● online</div>
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          <IconBtn><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="1.8"><path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 11 18.86a19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.18 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.72c.13.81.36 1.6.68 2.34a2 2 0 0 1-.45 2.11L8 9.4a16 16 0 0 0 6.6 6.6l1.23-1.23a2 2 0 0 1 2.11-.45c.74.32 1.53.55 2.34.68A2 2 0 0 1 22 16.92z" /></svg></IconBtn>
          <IconBtn><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="1.8"><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg></IconBtn>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="no-select chat-wallpaper" style={{ flex: 1, overflowY: "auto", padding: "8px 4%", display: "flex", flexDirection: "column" }}>
        {/* E2E Notice */}
        <div style={{ display: "flex", justifyContent: "center", margin: "12px 0" }}>
          <div className="e2e-badge" style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            <span style={{ color: "var(--text-secondary)", fontSize: 11 }}>Messages are end-to-end encrypted. Auto-delete in 15h.</span>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", margin: "4px 0 12px" }}>
          <span style={{ backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)", fontSize: 11, fontWeight: 600, padding: "4px 14px", borderRadius: 16, letterSpacing: 0.5 }}>TODAY</span>
        </div>

        {messages.map((msg) => {
          const isMe = msg.sender === "me";
          return (
            <div key={msg.id} className="animate-slideUp" style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", marginBottom: 3 }}>
              <div style={{
                maxWidth: "78%",
                backgroundColor: isMe ? "var(--bubble-out)" : "var(--bubble-in)",
                borderRadius: isMe ? "12px 2px 12px 12px" : "2px 12px 12px 12px",
                padding: "7px 10px",
                position: "relative",
                marginLeft: isMe ? 0 : 8,
                marginRight: isMe ? 8 : 0,
                border: `1px solid ${isMe ? "rgba(0,200,150,0.08)" : "var(--border)"}`,
              }}>
                <p style={{ color: "var(--text-primary)", fontSize: 14.5, lineHeight: 1.4, whiteSpace: "pre-wrap", wordBreak: "break-word", paddingRight: isMe ? 68 : 48, margin: 0 }}>
                  {msg.text}
                </p>
                <div style={{ position: "absolute", bottom: 4, right: 8, display: "flex", alignItems: "center", gap: 3 }}>
                  <span style={{ color: "var(--text-timestamp)", fontSize: 10 }}>{msg.time}</span>
                  {isMe && <span style={{ color: msg.read ? "var(--blue)" : "var(--text-timestamp)", fontSize: 13, marginLeft: 2 }}>✓✓</span>}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* ATTACH MENU */}
      {showAttach && (
        <div className="animate-slideUp glass" style={{ position: "absolute", bottom: 72, left: 12, right: 12, borderRadius: 16, padding: 16, zIndex: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[
              { icon: "📷", label: "Camera", color: "#ff6b6b" },
              { icon: "📁", label: "Document", color: "#4a9eff" },
              { icon: "🖼️", label: "Gallery", color: "#7c5cfc" },
              { icon: "🎵", label: "Audio", color: "#ffc048" },
              { icon: "📍", label: "Location", color: "#00c896" },
              { icon: "👤", label: "Contact", color: "#00b4d8" },
            ].map(item => (
              <button key={item.label} onClick={() => setShowAttach(false)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", backgroundColor: item.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                  {item.icon}
                </div>
                <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>{item.label}</span>
              </button>
            ))}
          </div>
          <p style={{ color: "var(--text-timestamp)", fontSize: 11, textAlign: "center", marginTop: 12 }}>
            📎 Send files up to 1GB — encrypted before upload
          </p>
        </div>
      )}

      {/* INPUT BAR */}
      <div className="glass" style={{ display: "flex", alignItems: "flex-end", padding: "6px 6px", flexShrink: 0, gap: 4 }}>
        <IconBtn><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.8"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg></IconBtn>

        <div style={{ flex: 1, backgroundColor: "var(--bg-elevated)", borderRadius: 22, display: "flex", alignItems: "flex-end", minHeight: 44, position: "relative", border: "1px solid var(--border)" }}>
          <textarea ref={taRef} value={message} onChange={handleInput}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Message" rows={1}
            style={{ width: "100%", color: "var(--text-primary)", fontSize: 15, padding: "11px 80px 11px 16px", resize: "none", overflowY: "auto", maxHeight: 120, minHeight: 44, lineHeight: 1.4, height: 44 }} />
          <button onClick={() => setShowAttach(!showAttach)} style={{ position: "absolute", right: 38, bottom: 10, background: "none", border: "none", cursor: "pointer" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.8"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
          </button>
          <button style={{ position: "absolute", right: 10, bottom: 10, background: "none", border: "none", cursor: "pointer" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.8"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
          </button>
        </div>

        <button onClick={handleSend} className="btn-primary" style={{ width: 46, height: 46, borderRadius: "50%", padding: 0, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {message.length > 0 ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>
          )}
        </button>
      </div>
    </div>
  );
}

function IconBtn({ children, onClick }: any) {
  return <button onClick={onClick} style={{ background: "none", border: "none", cursor: "pointer", padding: 8, borderRadius: 8, display: "flex" }}>{children}</button>;
}
