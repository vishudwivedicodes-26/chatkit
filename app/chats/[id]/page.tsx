"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const INITIAL_MESSAGES = [
  { id: 1, text: "Hey! How are you doing?", sender: "them", time: "10:42 AM", read: true },
  { id: 2, text: "I'm good! Working on the encryption module 🔒", sender: "me", time: "10:43 AM", read: true },
  { id: 3, text: "That's awesome! Is the X25519 key exchange working?", sender: "them", time: "10:44 AM", read: true },
  { id: 4, text: "Yeah fully functional now. Client-side only, keys never leave the device", sender: "me", time: "10:45 AM", read: true },
  { id: 5, text: "Perfect 🔥 That's exactly what we needed", sender: "them", time: "10:45 AM", read: false },
];

export default function ChatPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: message,
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: false,
    }]);
    setMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "44px";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    const el = e.target;
    el.style.height = "44px";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  return (
    <div className="fixed inset-0 flex flex-col" style={{ backgroundColor: "#0B141A" }}>
      {/* === TOP BAR === */}
      <div style={{
        height: 56,
        backgroundColor: "#1F2C34",
        display: "flex",
        alignItems: "center",
        padding: "0 8px",
        flexShrink: 0,
        zIndex: 10,
      }}>
        <button onClick={() => router.push("/chats")} style={{ background: "none", border: "none", cursor: "pointer", padding: 8 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        </button>

        {/* Avatar */}
        <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: "#2A3942", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: 4 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8696A0" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
        </div>

        {/* Name & status */}
        <div style={{ flex: 1, marginLeft: 10, cursor: "pointer" }}>
          <div style={{ color: "#E9EDEF", fontSize: 16, fontWeight: 500, lineHeight: 1.2 }}>Alex Storm</div>
          <div style={{ color: "#8696A0", fontSize: 13, lineHeight: 1.2 }}>online</div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <button style={{ background: "none", border: "none", cursor: "pointer" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="m15.6 11.6-4.8 4.8a3 3 0 1 1-4.2-4.2l4.8-4.8"/><path d="M22 2 11 13"/><path d="M16 8l0 5h5"/></svg>
          </button>
          <button style={{ background: "none", border: "none", cursor: "pointer" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
          </button>
          <button style={{ background: "none", border: "none", cursor: "pointer" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg>
          </button>
        </div>
      </div>

      {/* === MESSAGES AREA === */}
      <div className="no-select chat-wallpaper" style={{
        flex: 1,
        overflowY: "auto",
        padding: "8px 5%",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* E2E notice */}
        <div style={{ display: "flex", justifyContent: "center", margin: "16px 0" }}>
          <div style={{
            backgroundColor: "#1F2C34",
            borderRadius: 8,
            padding: "8px 16px",
            maxWidth: 340,
            textAlign: "center",
          }}>
            <span style={{ color: "#FFD55F", fontSize: 12 }}>🔒 </span>
            <span style={{ color: "#8696A0", fontSize: 12 }}>
              Messages are end-to-end encrypted. They auto-delete after 15 hours.
            </span>
          </div>
        </div>

        {/* Date pill */}
        <div style={{ display: "flex", justifyContent: "center", margin: "8px 0 16px" }}>
          <span style={{
            backgroundColor: "#1F2C34",
            color: "#8696A0",
            fontSize: 12,
            fontWeight: 500,
            padding: "4px 12px",
            borderRadius: 16,
          }}>
            TODAY
          </span>
        </div>

        {/* Messages */}
        {messages.map((msg) => {
          const isMe = msg.sender === "me";
          return (
            <div
              key={msg.id}
              className="animate-slide-up"
              style={{
                display: "flex",
                justifyContent: isMe ? "flex-end" : "flex-start",
                marginBottom: 2,
              }}
            >
              <div style={{
                maxWidth: "75%",
                backgroundColor: isMe ? "#005C4B" : "#1F2C34",
                borderRadius: isMe ? "8px 0 8px 8px" : "0 8px 8px 8px",
                padding: "6px 10px",
                position: "relative",
                marginLeft: isMe ? 0 : 12,
                marginRight: isMe ? 12 : 0,
              }}>
                <p style={{
                  color: "#E9EDEF",
                  fontSize: 14.5,
                  lineHeight: 1.35,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  paddingRight: isMe ? 65 : 45,
                  margin: 0,
                }}>
                  {msg.text}
                </p>
                <div style={{
                  position: "absolute",
                  bottom: 4,
                  right: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                }}>
                  <span style={{ color: "rgba(134,150,160,0.7)", fontSize: 11 }}>{msg.time}</span>
                  {isMe && (
                    <span style={{ color: msg.read ? "#53BDEB" : "#8696A0", fontSize: 14, marginLeft: 2 }}>✓✓</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* === INPUT BAR === */}
      <div style={{
        backgroundColor: "#1F2C34",
        display: "flex",
        alignItems: "flex-end",
        padding: "8px 8px",
        flexShrink: 0,
        gap: 6,
      }}>
        {/* Emoji */}
        <button style={{ background: "none", border: "none", cursor: "pointer", padding: 10, flexShrink: 0 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8696A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
        </button>

        {/* Text input */}
        <div style={{
          flex: 1,
          backgroundColor: "#2A3942",
          borderRadius: 22,
          display: "flex",
          alignItems: "flex-end",
          minHeight: 44,
          position: "relative",
        }}>
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Message"
            rows={1}
            style={{
              width: "100%",
              color: "#E9EDEF",
              fontSize: 15,
              padding: "11px 80px 11px 16px",
              resize: "none",
              overflowY: "auto",
              maxHeight: 120,
              minHeight: 44,
              lineHeight: 1.4,
              height: 44,
            }}
          />
          {/* Attach */}
          <button style={{ position: "absolute", right: 40, bottom: 10, background: "none", border: "none", cursor: "pointer" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8696A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
          </button>
          {/* Camera */}
          <button style={{ position: "absolute", right: 10, bottom: 10, background: "none", border: "none", cursor: "pointer" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8696A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" />
            </svg>
          </button>
        </div>

        {/* Send / Mic button */}
        <button
          onClick={handleSend}
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            backgroundColor: "#00A884",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "transform 0.15s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          {message.length > 0 ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
