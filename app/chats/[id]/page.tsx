"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const MSGS = [
  { id: 1, text: "Hey! How's the encryption module going?", from: "them", time: "10:42 AM", read: true },
  { id: 2, text: "Fully operational. X25519 key exchange + XSalsa20-Poly1305. Keys never leave the device.", from: "me", time: "10:43 AM", read: true },
  { id: 3, text: "So even ChatKit servers can't read messages?", from: "them", time: "10:44 AM", read: true },
  { id: 4, text: "Correct. Server only sees ciphertext. ISPs can't intercept either. Every message is padded to hide length.", from: "me", time: "10:45 AM", read: true },
  { id: 5, text: "Can you send the 800MB dataset through here?", from: "them", time: "10:46 AM", read: false },
];

const MENU_ITEMS = [
  { label: "View contact", icon: "user" },
  { label: "Media & docs", icon: "image" },
  { label: "Search", icon: "search" },
  { label: "Mute notifications", icon: "mute" },
  { label: "Disappearing messages", icon: "clock" },
  { label: "Wallpaper", icon: "palette" },
  { label: "Clear chat", icon: "trash" },
];

export default function ChatPage() {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const [msgs, setMsgs] = useState(MSGS);
  const [menu, setMenu] = useState(false);
  const [attach, setAttach] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  // close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenu(false);
    };
    if (menu) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menu]);

  const send = () => {
    if (!msg.trim()) return;
    setMsgs(p => [...p, { id: Date.now(), text: msg, from: "me", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), read: false }]);
    setMsg("");
    if (taRef.current) taRef.current.style.height = "42px";
  };

  return (
    <div style={{ position: "relative", height: "100%", background: "var(--bg-0)", display: "flex", flexDirection: "column" }}>
      {/* TOP BAR */}
      <div style={{ height: 54, background: "var(--bg-1)", display: "flex", alignItems: "center", padding: "0 8px", borderBottom: "1px solid var(--border)", position: "relative", zIndex: 20 }}>
        <button className="mobile-back" onClick={() => router.push("/chats")} style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--t1)" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#25d366", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", marginLeft: 4 }}>AS</div>
        <div style={{ flex: 1, marginLeft: 10 }}>
          <div style={{ color: "var(--t1)", fontSize: 15, fontWeight: 600, lineHeight: 1.2 }}>Alex Storm</div>
          <div style={{ color: "var(--accent)", fontSize: 12 }}>online</div>
        </div>
        <button style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--t2)" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 11 18.86a19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.18 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.72c.13.81.36 1.6.68 2.34a2 2 0 0 1-.45 2.11L8 9.4a16 16 0 0 0 6.6 6.6l1.23-1.23a2 2 0 0 1 2.11-.45c.74.32 1.53.55 2.34.68A2 2 0 0 1 22 16.92z"/></svg>
        </button>

        {/* 3-DOT MENU BUTTON */}
        <div ref={menuRef} style={{ position: "relative" }}>
          <button onClick={() => { setMenu(!menu); setAttach(false); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--t2)" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
          </button>

          {/* DROPDOWN MENU */}
          {menu && (
            <div style={{ position: "absolute", top: "100%", right: 0, marginTop: 4, width: 220, background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.4)", zIndex: 50 }}>
              {MENU_ITEMS.map((item, i) => (
                <button key={i} onClick={() => setMenu(false)}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "none", border: "none", cursor: "pointer", color: item.icon === "trash" ? "var(--red)" : "var(--t1)", fontSize: 14, textAlign: "left", borderBottom: i < MENU_ITEMS.length - 1 ? "1px solid var(--border)" : "none" }}
                  onMouseOver={e => e.currentTarget.style.background = "var(--bg-3)"}
                  onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                  <MenuIcon type={item.icon} danger={item.icon === "trash"} />
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MESSAGES */}
      <div className="chat-wall" style={{ flex: 1, overflowY: "auto", padding: "8px 5%" }}>
        {/* encryption notice */}
        <div style={{ display: "flex", justifyContent: "center", margin: "12px 0" }}>
          <div style={{ background: "var(--accent-dim)", border: "1px solid rgba(37,211,102,0.1)", borderRadius: 6, padding: "6px 14px", display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span style={{ color: "var(--t2)", fontSize: 11 }}>Messages are end-to-end encrypted</span>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", margin: "4px 0 12px" }}>
          <span style={{ background: "var(--bg-2)", color: "var(--t3)", fontSize: 11, fontWeight: 500, padding: "3px 12px", borderRadius: 4 }}>TODAY</span>
        </div>

        {msgs.map(m => {
          const me = m.from === "me";
          return (
            <div key={m.id} style={{ display: "flex", justifyContent: me ? "flex-end" : "flex-start", marginBottom: 2 }}>
              <div style={{ maxWidth: "78%", background: me ? "var(--bubble-out)" : "var(--bubble-in)", borderRadius: me ? "10px 2px 10px 10px" : "2px 10px 10px 10px", padding: "6px 10px", position: "relative", marginLeft: me ? 0 : 4, marginRight: me ? 4 : 0, border: `1px solid ${me ? "rgba(37,211,102,0.06)" : "var(--border)"}` }}>
                <p style={{ color: "var(--t1)", fontSize: 14, lineHeight: 1.35, whiteSpace: "pre-wrap", wordBreak: "break-word", paddingRight: me ? 64 : 44, margin: 0 }}>{m.text}</p>
                <div style={{ position: "absolute", bottom: 4, right: 8, display: "flex", alignItems: "center", gap: 3 }}>
                  <span style={{ color: "var(--t3)", fontSize: 10 }}>{m.time}</span>
                  {me && <span style={{ color: m.read ? "var(--blue)" : "var(--t3)", fontSize: 12, marginLeft: 1 }}>✓✓</span>}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {attach && (
        <div style={{ background: "var(--bg-1)", borderTop: "1px solid var(--border)", padding: "20px 16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {[
              { label: "Document", icon: "doc" },
              { label: "Camera", icon: "cam" },
              { label: "Gallery", icon: "img" },
              { label: "Audio", icon: "audio" },
              { label: "Location", icon: "loc" },
              { label: "Contact", icon: "user" },
            ].map(a => (
              <button key={a.label} onClick={() => setAttach(false)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ width: 50, height: 50, borderRadius: 14, background: "var(--bg-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--t1)", transition: "background 0.2s" }}
                  onMouseOver={e => e.currentTarget.style.background = "var(--bg-3)"}
                  onMouseOut={e => e.currentTarget.style.background = "var(--bg-2)"}>
                  <AttachIcon type={a.icon} />
                </div>
                <span style={{ color: "var(--t1)", fontSize: 13, fontWeight: 500 }}>{a.label}</span>
              </button>
            ))}
          </div>
          <p style={{ color: "var(--t3)", fontSize: 11, textAlign: "center", marginTop: 16 }}>Files up to 1 GB · Encrypted before upload</p>
        </div>
      )}

      {/* INPUT */}
      <div style={{ background: "var(--bg-1)", display: "flex", alignItems: "flex-end", padding: "6px 6px", borderTop: "1px solid var(--border)", gap: 4 }}>
        <button onClick={() => {}} style={{ background: "none", border: "none", cursor: "pointer", padding: 8, flexShrink: 0 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--t2)" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
        </button>

        <div style={{ flex: 1, background: "var(--bg-2)", borderRadius: 20, display: "flex", alignItems: "flex-end", minHeight: 42, border: "1px solid var(--border)", position: "relative" }}>
          <textarea ref={taRef} value={msg} onChange={e => { setMsg(e.target.value); const el = e.target; el.style.height = "42px"; el.style.height = Math.min(el.scrollHeight, 120) + "px"; }}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Message" rows={1}
            style={{ width: "100%", color: "var(--t1)", fontSize: 14, padding: "10px 46px 10px 14px", resize: "none", overflowY: "auto", maxHeight: 120, minHeight: 42, lineHeight: 1.4, height: 42 }} />
          <button onClick={() => { setAttach(!attach); setMenu(false); }} style={{ position: "absolute", right: 8, bottom: 9, background: "none", border: "none", cursor: "pointer" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--t2)" strokeWidth="1.8"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
          </button>
        </div>

        <button onClick={send} style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--accent)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {msg.length > 0 ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
          )}
        </button>
      </div>
    </div>
  );
}

function MenuIcon({ type, danger }: { type: string; danger?: boolean }) {
  const c = danger ? "var(--red)" : "var(--t2)";
  const s = { width: 16, height: 16 };
  switch (type) {
    case "user": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
    case "image": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>;
    case "search": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
    case "mute": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
    case "clock": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
    case "palette": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>;
    case "trash": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
    default: return null;
  }
}

function AttachIcon({ type }: { type: string }) {
  const c = "currentColor";
  const s = { width: 22, height: 22 };
  switch (type) {
    case "doc": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
    case "cam": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>;
    case "img": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
    case "audio": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>;
    case "loc": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
    case "user": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
    default: return null;
  }
}
