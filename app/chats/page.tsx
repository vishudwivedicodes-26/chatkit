"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const TABS = ["Chats", "Updates", "Communities", "Calls"];
const CHATS = [
  { id: "1", name: "Alex Storm", preview: "The encryption module is 100% ready ✓", time: "10:45 AM", unread: 2, online: true },
  { id: "2", name: "Pixel Ghost", preview: "🎤 Voice Message (0:32)", time: "9:12 AM", unread: 0, online: false },
  { id: "3", name: "Cyber Nova", preview: "Got it! Will check tonight 🔒", time: "Yesterday", unread: 5, online: true },
  { id: "4", name: "Shadow Fox", preview: "✓✓ Document received", time: "Yesterday", unread: 0, online: false },
  { id: "5", name: "Quantum", preview: "Typing...", time: "8:30 AM", unread: 1, online: true },
  { id: "6", name: "Neon Wolf", preview: "✓✓ See you tomorrow!", time: "Monday", unread: 0, online: false },
  { id: "7", name: "Zero Cool", preview: "📷 Photo", time: "Monday", unread: 0, online: false },
  { id: "8", name: "Dark Matter", preview: "Let me check that config...", time: "Sunday", unread: 0, online: false },
];

function getInitials(name: string) {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

const AVATAR_COLORS = ["#00c896", "#4a9eff", "#7c5cfc", "#ff6b6b", "#ffc048", "#ff85a1", "#00b4d8", "#06d6a0"];
function getAvatarColor(id: string) { return AVATAR_COLORS[parseInt(id) % AVATAR_COLORS.length]; }

export default function ChatsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Chats");
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "var(--bg-primary)", display: "flex", flexDirection: "column" }}>
      {/* TOP BAR */}
      <div className="glass" style={{ height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", flexShrink: 0, zIndex: 10 }}>
        <span style={{ fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #00c896, #4a9eff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ChatKit</span>
        <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
          <IconBtn onClick={() => {}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="1.8"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg></IconBtn>
          <IconBtn onClick={() => setShowSearch(!showSearch)}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="1.8"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg></IconBtn>
          <IconBtn onClick={() => router.push("/settings")}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="1.8"><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg></IconBtn>
        </div>
      </div>

      {/* TABS */}
      <div style={{ height: 44, display: "flex", borderBottom: "1px solid var(--border)", flexShrink: 0, background: "var(--bg-secondary)" }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, background: "none", border: "none", color: activeTab === tab ? "var(--accent)" : "var(--text-secondary)", fontSize: 13, fontWeight: activeTab === tab ? 600 : 400, cursor: "pointer", borderBottom: activeTab === tab ? "2.5px solid var(--accent)" : "2.5px solid transparent", transition: "all 0.2s" }}>
            {tab}
          </button>
        ))}
      </div>

      {/* SEARCH */}
      {showSearch && (
        <div className="animate-slideDown" style={{ padding: "8px 12px", backgroundColor: "var(--bg-secondary)", flexShrink: 0 }}>
          <div style={{ backgroundColor: "var(--bg-elevated)", borderRadius: 10, height: 38, display: "flex", alignItems: "center", padding: "0 12px", border: "1px solid var(--border)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input autoFocus placeholder="Search chats..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ flex: 1, marginLeft: 10, color: "var(--text-primary)", fontSize: 14 }} />
          </div>
        </div>
      )}

      {/* CHAT LIST */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* E2E Status bar */}
        <div className="e2e-badge" style={{ margin: "10px 12px 6px", display: "flex", alignItems: "center", gap: 8, padding: "8px 14px" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          <span style={{ color: "var(--accent)", fontSize: 11, fontWeight: 500, letterSpacing: 0.5 }}>ALL MESSAGES END-TO-END ENCRYPTED</span>
        </div>

        {CHATS.map(chat => (
          <div key={chat.id} onClick={() => router.push(`/chats/${chat.id}`)}
            style={{ height: 72, display: "flex", alignItems: "center", cursor: "pointer", transition: "background 0.12s" }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-hover)")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <div style={{ width: 72, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: `linear-gradient(135deg, ${getAvatarColor(chat.id)}, ${getAvatarColor(chat.id)}88)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", fontSize: 16, fontWeight: 700, color: "white" }}>
                {getInitials(chat.name)}
                {chat.online && <div style={{ position: "absolute", bottom: 1, right: 1, width: 12, height: 12, borderRadius: "50%", backgroundColor: "var(--accent)", border: "2px solid var(--bg-primary)" }} />}
              </div>
            </div>
            <div style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", paddingRight: 16, borderBottom: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                <span style={{ color: "var(--text-primary)", fontSize: 16, fontWeight: 500 }}>{chat.name}</span>
                <span style={{ color: chat.unread > 0 ? "var(--accent)" : "var(--text-timestamp)", fontSize: 12, flexShrink: 0 }}>{chat.time}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--text-secondary)", fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{chat.preview}</span>
                {chat.unread > 0 && (
                  <div style={{ minWidth: 20, height: 20, borderRadius: 10, background: "linear-gradient(135deg, #00c896, #00a87e)", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: 8 }}>
                    <span style={{ color: "white", fontSize: 11, fontWeight: 700 }}>{chat.unread}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FAB */}
      <button onClick={() => router.push("/friends")} className="btn-primary" style={{ position: "absolute", bottom: 84, right: 20, width: 56, height: 56, borderRadius: "50%", padding: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><line x1="12" y1="8" x2="12" y2="14" /><line x1="9" y1="11" x2="15" y2="11" /></svg>
      </button>

      {/* BOTTOM NAV */}
      <div className="glass" style={{ height: 60, display: "flex", borderTop: "1px solid var(--border)", flexShrink: 0 }}>
        <NavBtn icon="chat" label="Chats" active onClick={() => {}} />
        <NavBtn icon="status" label="Updates" onClick={() => {}} />
        <NavBtn icon="friends" label="Friends" onClick={() => router.push("/friends")} badge={3} />
        <NavBtn icon="settings" label="Settings" onClick={() => router.push("/settings")} />
      </div>
    </div>
  );
}

function IconBtn({ children, onClick }: any) {
  return <button onClick={onClick} style={{ background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, display: "flex" }}>{children}</button>;
}

function NavBtn({ icon, label, active, badge, onClick }: any) {
  const clr = active ? "var(--accent)" : "var(--text-secondary)";
  return (
    <button onClick={onClick} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", gap: 3, position: "relative" }}>
      <div style={{ position: "relative" }}>
        {icon === "chat" && <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? clr : "none"} stroke={clr} strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>}
        {icon === "status" && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={clr} strokeWidth="1.8"><circle cx="12" cy="12" r="10" strokeDasharray="4 2" /></svg>}
        {icon === "friends" && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={clr} strokeWidth="1.8"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></svg>}
        {icon === "settings" && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={clr} strokeWidth="1.8"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.6.77 1.05 1.38 1.14l.13.01H21a2 2 0 0 1 0 4h-.22a1.65 1.65 0 0 0-1.38 1.14z" /></svg>}
        {badge && <div style={{ position: "absolute", top: -5, right: -10, minWidth: 18, height: 18, borderRadius: 9, background: "linear-gradient(135deg, #00c896, #00a87e)", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "white", fontSize: 10, fontWeight: 700 }}>{badge}</span></div>}
      </div>
      <span style={{ color: clr, fontSize: 10, fontWeight: active ? 600 : 400 }}>{label}</span>
    </button>
  );
}
