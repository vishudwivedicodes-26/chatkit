"use client";
import { useRouter } from "next/navigation";

const ITEMS = [
  { icon: "key", label: "Account", desc: "Security, two-factor auth, change UID" },
  { icon: "lock", label: "Privacy", desc: "Block users, disappearing messages" },
  { icon: "user", label: "Avatar", desc: "Choose animated avatar" },
  { icon: "chat", label: "Chats", desc: "Theme, wallpaper, chat history" },
  { icon: "bell", label: "Notifications", desc: "Message, group tones" },
  { icon: "shield", label: "Security", desc: "Encryption keys, session management" },
  { icon: "db", label: "Storage & Data", desc: "Network usage, auto-download" },
  { icon: "globe", label: "Language", desc: "English (device default)" },
  { icon: "help", label: "Help", desc: "FAQ, contact support" },
];

export default function SettingsPage() {
  const router = useRouter();
  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "var(--bg-primary)", display: "flex", flexDirection: "column" }}>
      <div className="glass" style={{ height: 56, display: "flex", alignItems: "center", padding: "0 16px", flexShrink: 0 }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", padding: 8, marginLeft: -8 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        </button>
        <span style={{ color: "var(--text-primary)", fontSize: 18, fontWeight: 600, marginLeft: 16 }}>Settings</span>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Profile card */}
        <div onClick={() => router.push("/profile")} style={{ display: "flex", alignItems: "center", padding: 16, cursor: "pointer", borderBottom: "1px solid var(--border)" }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-hover)")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #00c896, #4a9eff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, color: "white", flexShrink: 0 }}>
            A
          </div>
          <div style={{ flex: 1, marginLeft: 16 }}>
            <div style={{ color: "var(--text-primary)", fontSize: 18, fontWeight: 600 }}>Anonymous User</div>
            <div style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 2 }}>Hey there! I am using ChatKit</div>
          </div>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="3" height="3" /><rect x="18" y="18" width="3" height="3" /></svg>
        </div>

        {ITEMS.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", padding: "14px 20px", cursor: "pointer", transition: "background 0.12s" }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-hover)")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
            <div style={{ width: 38, display: "flex", justifyContent: "center", flexShrink: 0 }}>
              <SIcon type={item.icon} />
            </div>
            <div style={{ marginLeft: 18 }}>
              <div style={{ color: "var(--text-primary)", fontSize: 16 }}>{item.label}</div>
              <div style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 2 }}>{item.desc}</div>
            </div>
          </div>
        ))}

        <div style={{ padding: "20px 20px", borderTop: "1px solid var(--border)", marginTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></svg>
            <span style={{ color: "var(--accent)", fontSize: 15, fontWeight: 500 }}>Invite a friend</span>
          </div>
        </div>

        <p style={{ color: "var(--text-timestamp)", fontSize: 12, textAlign: "center", padding: "16px 0 32px" }}>
          ChatKit v1.0.0 · E2E Encrypted
        </p>
      </div>
    </div>
  );
}

function SIcon({ type }: { type: string }) {
  const c = "var(--text-secondary)";
  const icons: Record<string, React.ReactNode> = {
    key: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4" /></svg>,
    lock: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><rect width="18" height="11" x="3" y="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
    user: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
    chat: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
    bell: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>,
    shield: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
    db: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" /><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" /></svg>,
    globe: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z" /></svg>,
    help: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
  };
  return icons[type] || null;
}
