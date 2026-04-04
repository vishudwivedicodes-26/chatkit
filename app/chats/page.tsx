"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const TABS = ["Chats", "Updates", "Communities", "Calls"];

const DUMMY_CHATS = [
  { id: "1", name: "Alex Storm", preview: "Hey, the keys are sorted ✓", time: "10:45 AM", unread: 2, online: true },
  { id: "2", name: "Pixel Ghost", preview: "Voice Message (0:32)", time: "9:12 AM", unread: 0, online: false },
  { id: "3", name: "Cyber Nova", preview: "Got it! Will check tonight 🔒", time: "Yesterday", unread: 5, online: true },
  { id: "4", name: "Shadow Fox", preview: "✓✓ Document received", time: "Yesterday", unread: 0, online: false },
  { id: "5", name: "Quantum", preview: "Typing...", time: "8:30 AM", unread: 1, online: true },
  { id: "6", name: "Neon Wolf", preview: "✓✓ See you tomorrow!", time: "Monday", unread: 0, online: false },
  { id: "7", name: "Zero Cool", preview: "Photo 📷", time: "Monday", unread: 0, online: false },
  { id: "8", name: "Dark Matter", preview: "Let me check that link...", time: "Sunday", unread: 0, online: false },
];

export default function ChatsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Chats");
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="fixed inset-0 flex flex-col" style={{ backgroundColor: "#111B21" }}>
      {/* === TOP APP BAR === */}
      <div style={{
        height: 56,
        backgroundColor: "#1F2C34",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        flexShrink: 0,
      }}>
        <span style={{ color: "#E9EDEF", fontSize: 20, fontWeight: 700 }}>ChatKit</span>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          {/* Camera */}
          <button onClick={() => {}} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E9EDEF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </button>
          {/* Search */}
          <button onClick={() => setShowSearch(!showSearch)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E9EDEF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          {/* More */}
          <button onClick={() => router.push("/settings")} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E9EDEF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" />
            </svg>
          </button>
        </div>
      </div>

      {/* === TAB BAR === */}
      <div style={{
        height: 48,
        backgroundColor: "#1F2C34",
        display: "flex",
        flexShrink: 0,
      }}>
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              color: activeTab === tab ? "white" : "#8696A0",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              position: "relative",
              transition: "color 0.2s",
              borderBottom: activeTab === tab ? "3px solid #00A884" : "3px solid transparent",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* === SEARCH BAR (toggleable) === */}
      {showSearch && (
        <div className="animate-slide-up" style={{ padding: "8px 12px", backgroundColor: "#111B21", flexShrink: 0 }}>
          <div style={{
            backgroundColor: "#2A3942",
            borderRadius: 8,
            height: 36,
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8696A0" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input
              autoFocus
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                marginLeft: 8,
                color: "#E9EDEF",
                fontSize: 15,
              }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8696A0" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* === CHAT LIST === */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {DUMMY_CHATS.map(chat => (
          <div
            key={chat.id}
            onClick={() => router.push(`/chats/${chat.id}`)}
            style={{
              height: 72,
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              transition: "background 0.15s",
              backgroundColor: "#111B21",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#2A3942")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#111B21")}
          >
            {/* Avatar */}
            <div style={{ width: 72, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                backgroundColor: "#2A3942",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8696A0" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
                {/* Online indicator */}
                {chat.online && (
                  <div style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: "#00A884",
                    border: "2px solid #111B21",
                  }} />
                )}
              </div>
            </div>

            {/* Content */}
            <div style={{
              flex: 1,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              paddingRight: 16,
              borderBottom: "1px solid #1F2C34",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                <span style={{ color: "#E9EDEF", fontSize: 16, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {chat.name}
                </span>
                <span style={{ color: chat.unread > 0 ? "#00A884" : "#8696A0", fontSize: 12, flexShrink: 0, marginLeft: 8 }}>
                  {chat.time}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#8696A0", fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                  {chat.preview}
                </span>
                {chat.unread > 0 && (
                  <div style={{
                    minWidth: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: "#00A884",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: 8,
                    flexShrink: 0,
                  }}>
                    <span style={{ color: "#111B21", fontSize: 11, fontWeight: 700 }}>{chat.unread}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* === FAB (New Chat) === */}
      <button
        onClick={() => router.push("/friends")}
        style={{
          position: "absolute",
          bottom: 80,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: "50%",
          backgroundColor: "#00A884",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          transition: "transform 0.2s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <line x1="12" y1="8" x2="12" y2="14" /><line x1="9" y1="11" x2="15" y2="11" />
        </svg>
      </button>

      {/* === BOTTOM NAV BAR (Mobile) === */}
      <div style={{
        height: 64,
        backgroundColor: "#1F2C34",
        display: "flex",
        borderTop: "1px solid #2A3942",
        flexShrink: 0,
      }}>
        <BottomTab icon="chats" label="Chats" active onClick={() => router.push("/chats")} />
        <BottomTab icon="status" label="Updates" onClick={() => {}} />
        <BottomTab icon="friends" label="Friends" onClick={() => router.push("/friends")} badge={3} />
        <BottomTab icon="settings" label="Settings" onClick={() => router.push("/settings")} />
      </div>
    </div>
  );
}

function BottomTab({ icon, label, active, badge, onClick }: any) {
  const iconColor = active ? "#00A884" : "#8696A0";
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "none",
        border: "none",
        cursor: "pointer",
        position: "relative",
        gap: 4,
      }}
    >
      <div style={{ position: "relative" }}>
        {icon === "chats" && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
        {icon === "status" && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" strokeDasharray="4 2" />
          </svg>
        )}
        {icon === "friends" && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
            <line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
          </svg>
        )}
        {icon === "settings" && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        )}
        {badge && (
          <div style={{
            position: "absolute",
            top: -4,
            right: -8,
            minWidth: 18,
            height: 18,
            borderRadius: 9,
            backgroundColor: "#00A884",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <span style={{ color: "#111B21", fontSize: 10, fontWeight: 700 }}>{badge}</span>
          </div>
        )}
      </div>
      <span style={{ color: active ? "#00A884" : "#8696A0", fontSize: 11, fontWeight: active ? 600 : 400 }}>{label}</span>
    </button>
  );
}
