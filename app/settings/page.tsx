"use client";

import { useRouter } from "next/navigation";

const SETTINGS_ITEMS = [
  { icon: "key", label: "Account", desc: "Security notifications, change number" },
  { icon: "lock", label: "Privacy", desc: "Block contacts, disappearing messages" },
  { icon: "user", label: "Avatar", desc: "Create, edit, profile photo" },
  { icon: "message", label: "Chats", desc: "Theme, wallpaper, chat history" },
  { icon: "bell", label: "Notifications", desc: "Message, group, call tones" },
  { icon: "database", label: "Storage and Data", desc: "Network usage, auto-download" },
  { icon: "globe", label: "App Language", desc: "English (device's language)" },
  { icon: "help", label: "Help", desc: "Help centre, contact us, privacy policy" },
];

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="fixed inset-0 flex flex-col" style={{ backgroundColor: "#111B21" }}>
      {/* Header */}
      <div style={{
        height: 56,
        backgroundColor: "#1F2C34",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        flexShrink: 0,
      }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", padding: 8, marginLeft: -8 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        </button>
        <span style={{ color: "white", fontSize: 20, fontWeight: 600, marginLeft: 16 }}>Settings</span>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Profile Card */}
        <div
          onClick={() => router.push("/profile")}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "16px",
            cursor: "pointer",
            borderBottom: "1px solid #2A3942",
          }}
        >
          <div style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            backgroundColor: "#2A3942",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#8696A0" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div style={{ flex: 1, marginLeft: 16 }}>
            <div style={{ color: "#E9EDEF", fontSize: 18, fontWeight: 500 }}>Anonymous User</div>
            <div style={{ color: "#8696A0", fontSize: 14, marginTop: 2 }}>Hey there! I am using ChatKit</div>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            {/* QR Icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00A884" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="3" height="3" /><rect x="18" y="18" width="3" height="3" />
            </svg>
          </div>
        </div>

        {/* Settings items */}
        {SETTINGS_ITEMS.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "16px 20px",
              cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#2A3942")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <div style={{ width: 40, display: "flex", justifyContent: "center", flexShrink: 0 }}>
              <SettingsIcon type={item.icon} />
            </div>
            <div style={{ marginLeft: 20 }}>
              <div style={{ color: "#E9EDEF", fontSize: 16, fontWeight: 400 }}>{item.label}</div>
              <div style={{ color: "#8696A0", fontSize: 13, marginTop: 2 }}>{item.desc}</div>
            </div>
          </div>
        ))}

        {/* Invite and footer */}
        <div style={{ padding: "24px 20px", borderTop: "1px solid #2A3942", marginTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, cursor: "pointer" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8696A0" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></svg>
            <span style={{ color: "#00A884", fontSize: 16 }}>Invite a friend</span>
          </div>
        </div>

        <p style={{ color: "#8696A0", fontSize: 13, textAlign: "center", padding: "16px 0 32px" }}>
          ChatKit v1.0.0
        </p>
      </div>
    </div>
  );
}

function SettingsIcon({ type }: { type: string }) {
  const c = "#8696A0";
  switch (type) {
    case "key": return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4" /></svg>;
    case "lock": return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
    case "user": return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
    case "message": return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;
    case "bell": return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>;
    case "database": return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" /><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" /></svg>;
    case "globe": return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z" /></svg>;
    case "help": return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>;
    default: return null;
  }
}
