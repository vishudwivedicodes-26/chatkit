"use client";

import { useRouter } from "next/navigation";

export default function ProfilePage() {
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
        <span style={{ color: "white", fontSize: 20, fontWeight: 600, marginLeft: 16 }}>Profile</span>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Avatar */}
        <div style={{ display: "flex", justifyContent: "center", padding: "32px 0" }}>
          <div style={{
            width: 140,
            height: 140,
            borderRadius: "50%",
            backgroundColor: "#2A3942",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            cursor: "pointer",
          }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#8696A0" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
            {/* Camera overlay */}
            <div style={{
              position: "absolute",
              bottom: 4,
              right: 4,
              width: 40,
              height: 40,
              borderRadius: "50%",
              backgroundColor: "#00A884",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Profile fields */}
        <ProfileField icon="user" label="Name" value="Anonymous User" />
        <ProfileField icon="info" label="About" value="Hey there! I am using ChatKit" />
        <ProfileField icon="id" label="UID" value="4829103756" mono />
        <ProfileField icon="at" label="Username" value="@anonymous_user" />

        {/* UID QR Section */}
        <div style={{ padding: "24px 0", borderTop: "8px solid #0B141A", marginTop: 16 }}>
          <div style={{ padding: "0 20px", marginBottom: 16 }}>
            <span style={{ color: "#8696A0", fontSize: 14 }}>Your UID QR Code</span>
          </div>
          <div style={{ display: "flex", justifyContent: "center", padding: "16px 0" }}>
            <div style={{
              width: 200,
              height: 200,
              backgroundColor: "white",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 12,
            }}>
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#111B21" strokeWidth="1">
                <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="3" height="3" /><rect x="18" y="18" width="3" height="3" /><rect x="14" y="18" width="3" height="3" />
                <rect x="18" y="14" width="3" height="3" />
              </svg>
              <span style={{ color: "#111B21", fontSize: 14, fontWeight: 600, fontFamily: "monospace" }}>4829103756</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileField({ icon, label, value, mono }: any) {
  return (
    <div style={{
      display: "flex",
      alignItems: "flex-start",
      padding: "16px 20px",
      borderBottom: "1px solid #1F2C34",
    }}>
      <div style={{ width: 32, display: "flex", justifyContent: "center", flexShrink: 0, paddingTop: 2 }}>
        {icon === "user" && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8696A0" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>}
        {icon === "info" && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8696A0" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>}
        {icon === "id" && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8696A0" strokeWidth="2"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>}
        {icon === "at" && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8696A0" strokeWidth="2"><circle cx="12" cy="12" r="4" /><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" /></svg>}
      </div>
      <div style={{ marginLeft: 20, flex: 1 }}>
        <div style={{ color: "#8696A0", fontSize: 13, marginBottom: 4 }}>{label}</div>
        <div style={{
          color: "#E9EDEF",
          fontSize: 16,
          fontFamily: mono ? "monospace" : "inherit",
          letterSpacing: mono ? 2 : 0,
        }}>{value}</div>
      </div>
      <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00A884" strokeWidth="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </button>
    </div>
  );
}
