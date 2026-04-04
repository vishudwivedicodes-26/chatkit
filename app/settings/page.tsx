"use client";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

const ITEMS = [
  { icon: "key", label: "Account", desc: "Security, two-factor authentication", href: "/settings/account" },
  { icon: "lock", label: "Privacy", desc: "Block users, disappearing messages", href: "/settings/privacy" },
  { icon: "chat", label: "Chats", desc: "Theme, wallpaper, chat history", href: "/settings/chats" },
  { icon: "bell", label: "Notifications", desc: "Message and call tones", href: "/settings/notifications" },
  { icon: "shield", label: "Security", desc: "Encryption keys, sessions", href: "/settings/security" },
  { icon: "db", label: "Storage & Data", desc: "Network usage, auto-download", href: "/settings/storage" },
  { icon: "globe", label: "Language", desc: "English", href: "/settings/language" },
  { icon: "help", label: "Help", desc: "FAQ, contact support", href: "/settings/help" },
];

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  return (
    <div style={{ position: "fixed", inset: 0, background: "var(--bg-0)", display: "flex", flexDirection: "column" }}>
      <div style={{ height: 52, background: "var(--bg-1)", display: "flex", alignItems: "center", padding: "0 16px", borderBottom: "1px solid var(--border)" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--t1)" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <span style={{ color: "var(--t1)", fontSize: 17, fontWeight: 600, marginLeft: 14 }}>Settings</span>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* profile */}
        <div style={{ display: "flex", alignItems: "center", padding: "20px 16px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
            {user?.display_name?.slice(0, 1).toUpperCase() || "?"}
          </div>
          <div style={{ flex: 1, marginLeft: 16 }}>
            <div style={{ color: "var(--t1)", fontSize: 18, fontWeight: 600 }}>{user?.display_name || "Anonymous User"}</div>
            <div style={{ color: "var(--accent)", fontSize: 13, fontWeight: 600, marginTop: 4, letterSpacing: 1 }}>UID: {user?.uid || "0000000000"}</div>
            <div style={{ color: "var(--t2)", fontSize: 13, marginTop: 4 }}>@{user?.username || "unknown"}</div>
          </div>
        </div>

        {ITEMS.map((item, i) => (
          <div key={i} onClick={() => router.push(item.href)} style={{ display: "flex", alignItems: "center", padding: "13px 18px", cursor: "pointer", borderBottom: "1px solid var(--border)" }}
            onMouseOver={e => e.currentTarget.style.background = "var(--bg-2)"}
            onMouseOut={e => e.currentTarget.style.background = "transparent"}>
            <div style={{ width: 34, display: "flex", justifyContent: "center", flexShrink: 0 }}><SIcon type={item.icon} /></div>
            <div style={{ marginLeft: 16 }}>
              <div style={{ color: "var(--t1)", fontSize: 15 }}>{item.label}</div>
              <div style={{ color: "var(--t2)", fontSize: 12, marginTop: 1 }}>{item.desc}</div>
            </div>
          </div>
        ))}

        <div style={{ padding: "18px", borderTop: "4px solid var(--bg-2)", marginTop: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
            <span style={{ color: "var(--accent)", fontSize: 14, fontWeight: 500 }}>Share UID with a friend</span>
          </div>
        </div>
        <p style={{ color: "var(--t3)", fontSize: 11, textAlign: "center", padding: "12px 0 28px" }}>CipherTalk v1.0 · Military-Grade E2E</p>
      </div>
    </div>
  );
}

function SIcon({ type }: { type: string }) {
  const c = "var(--t2)";
  switch (type) {
    case "key": return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>;
    case "lock": return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
    case "chat": return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
    case "bell": return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
    case "shield": return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
    case "db": return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/></svg>;
    case "globe": return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z"/></svg>;
    case "help": return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
    default: return null;
  }
}
