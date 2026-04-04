"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PENDING_REQUESTS = [
  { id: "r1", name: "Quantum Flux", uid: "7382910456" },
  { id: "r2", name: "Nova Star", uid: "9201384756" },
  { id: "r3", name: "Echo Shadow", uid: "1029384756" },
];

const FRIENDS_LIST = [
  { id: "f1", name: "Alex Storm", uid: "3847291056", online: true },
  { id: "f2", name: "Cyber Nova", uid: "5839201746", online: true },
  { id: "f3", name: "Pixel Ghost", uid: "6719203845", online: false },
  { id: "f4", name: "Shadow Fox", uid: "8291037465", online: false },
  { id: "f5", name: "Neon Wolf", uid: "4018293756", online: false },
];

export default function FriendsPage() {
  const router = useRouter();
  const [searchUid, setSearchUid] = useState("");
  const [activeTab, setActiveTab] = useState<"friends" | "requests">("friends");

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
        <span style={{ color: "white", fontSize: 20, fontWeight: 600, marginLeft: 16 }}>Friends</span>
      </div>

      {/* Search UID */}
      <div style={{ padding: "12px 16px", backgroundColor: "#111B21", flexShrink: 0 }}>
        <div style={{
          backgroundColor: "#2A3942",
          borderRadius: 8,
          height: 40,
          display: "flex",
          alignItems: "center",
          padding: "0 12px",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8696A0" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input
            placeholder="Search by UID (10-digit number)"
            value={searchUid}
            onChange={(e) => setSearchUid(e.target.value.replace(/[^0-9]/g, ""))}
            maxLength={10}
            style={{
              flex: 1,
              marginLeft: 8,
              color: "#E9EDEF",
              fontSize: 15,
              fontFamily: "monospace",
              letterSpacing: 1,
            }}
          />
          {searchUid.length >= 10 && (
            <button style={{
              background: "none",
              border: "none",
              color: "#00A884",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}>
              Add
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #2A3942", flexShrink: 0 }}>
        <button
          onClick={() => setActiveTab("friends")}
          style={{
            flex: 1,
            padding: "14px 0",
            background: "none",
            border: "none",
            color: activeTab === "friends" ? "white" : "#8696A0",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
            borderBottom: activeTab === "friends" ? "2px solid #00A884" : "2px solid transparent",
          }}
        >
          Friends ({FRIENDS_LIST.length})
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          style={{
            flex: 1,
            padding: "14px 0",
            background: "none",
            border: "none",
            color: activeTab === "requests" ? "white" : "#8696A0",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
            borderBottom: activeTab === "requests" ? "2px solid #00A884" : "2px solid transparent",
            position: "relative",
          }}
        >
          Requests ({PENDING_REQUESTS.length})
          {PENDING_REQUESTS.length > 0 && (
            <span style={{
              position: "absolute",
              top: 8,
              right: "30%",
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#00A884",
            }} />
          )}
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {activeTab === "friends" ? (
          FRIENDS_LIST.map(friend => (
            <div
              key={friend.id}
              onClick={() => router.push(`/chats/${friend.id}`)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px 16px",
                cursor: "pointer",
                transition: "background 0.15s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#2A3942")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <div style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: "#2A3942", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", flexShrink: 0 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8696A0" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                {friend.online && <div style={{ position: "absolute", bottom: 0, right: 0, width: 12, height: 12, borderRadius: "50%", backgroundColor: "#00A884", border: "2px solid #111B21" }} />}
              </div>
              <div style={{ flex: 1, marginLeft: 14 }}>
                <div style={{ color: "#E9EDEF", fontSize: 16, fontWeight: 500 }}>{friend.name}</div>
                <div style={{ color: "#8696A0", fontSize: 13, fontFamily: "monospace" }}>UID: {friend.uid}</div>
              </div>
              {/* Chat icon */}
              <button style={{ background: "none", border: "none", cursor: "pointer", padding: 8 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00A884" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
              </button>
            </div>
          ))
        ) : (
          PENDING_REQUESTS.map(req => (
            <div
              key={req.id}
              className="animate-slide-up"
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px 16px",
                borderBottom: "1px solid #1F2C34",
              }}
            >
              <div style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: "#2A3942", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8696A0" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              </div>
              <div style={{ flex: 1, marginLeft: 14 }}>
                <div style={{ color: "#E9EDEF", fontSize: 16, fontWeight: 500 }}>{req.name}</div>
                <div style={{ color: "#8696A0", fontSize: 13, fontFamily: "monospace" }}>UID: {req.uid}</div>
              </div>
              {/* Accept */}
              <button style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                backgroundColor: "#00A884",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 8,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
              </button>
              {/* Reject */}
              <button style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                backgroundColor: "#2A3942",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF5252" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
