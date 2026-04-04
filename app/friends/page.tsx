"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const FRIENDS = [
  { id: "f1", name: "Alex Storm", uid: "3847291056", online: true },
  { id: "f2", name: "Cyber Nova", uid: "5839201746", online: true },
  { id: "f3", name: "Pixel Ghost", uid: "6719203845", online: false },
  { id: "f4", name: "Shadow Fox", uid: "8291037465", online: false },
  { id: "f5", name: "Neon Wolf", uid: "4018293756", online: false },
];

const REQUESTS = [
  { id: "r1", name: "Quantum Flux", uid: "7382910456" },
  { id: "r2", name: "Nova Star", uid: "9201384756" },
];

const COLORS = ["#25d366","#1da1f2","#9b59b6","#e74c3c","#f39c12"];
const initials = (n: string) => n.split(" ").map(w => w[0]).join("").slice(0,2);

export default function FriendsPage() {
  const router = useRouter();
  const [uid, setUid] = useState("");
  const [tab, setTab] = useState<"friends"|"requests">("friends");

  return (
    <div style={{ position: "fixed", inset: 0, background: "var(--bg-0)", display: "flex", flexDirection: "column" }}>
      <div style={{ height: 52, background: "var(--bg-1)", display: "flex", alignItems: "center", padding: "0 16px", borderBottom: "1px solid var(--border)" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--t1)" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <span style={{ color: "var(--t1)", fontSize: 17, fontWeight: 600, marginLeft: 14 }}>Friends</span>
      </div>

      {/* search */}
      <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 8, height: 38, display: "flex", alignItems: "center", padding: "0 12px" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--t3)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input value={uid} onChange={e => setUid(e.target.value.replace(/\D/g,""))} maxLength={10} placeholder="Add by UID" style={{ flex: 1, marginLeft: 8, color: "var(--t1)", fontSize: 14, fontFamily: "monospace", letterSpacing: 1 }} />
          {uid.length >= 10 && <button style={{ background: "none", border: "none", color: "var(--accent)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Add</button>}
        </div>
      </div>

      {/* tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)" }}>
        {(["friends","requests"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, height: 40, background: "none", border: "none", borderBottom: tab === t ? "2px solid var(--accent)" : "2px solid transparent", color: tab === t ? "var(--t1)" : "var(--t3)", fontSize: 13, fontWeight: 500, cursor: "pointer", textTransform: "capitalize" }}>
            {t} ({t === "friends" ? FRIENDS.length : REQUESTS.length})
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {tab === "friends" ? FRIENDS.map((f, i) => (
          <div key={f.id} onClick={() => router.push(`/chats/${f.id}`)} style={{ display: "flex", alignItems: "center", padding: "10px 14px", cursor: "pointer", borderBottom: "1px solid var(--border)" }}
            onMouseOver={e => e.currentTarget.style.background = "var(--bg-2)"}
            onMouseOut={e => e.currentTarget.style.background = "transparent"}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: COLORS[i % COLORS.length], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff", position: "relative", flexShrink: 0 }}>
              {initials(f.name)}
              {f.online && <div style={{ position: "absolute", bottom: 0, right: 0, width: 10, height: 10, borderRadius: "50%", background: "var(--accent)", border: "2px solid var(--bg-0)" }} />}
            </div>
            <div style={{ flex: 1, marginLeft: 12 }}>
              <div style={{ color: "var(--t1)", fontSize: 15, fontWeight: 500 }}>{f.name}</div>
              <div style={{ color: "var(--t3)", fontSize: 12, fontFamily: "monospace" }}>{f.uid}</div>
            </div>
          </div>
        )) : REQUESTS.map((r, i) => (
          <div key={r.id} style={{ display: "flex", alignItems: "center", padding: "10px 14px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: COLORS[(i+2) % COLORS.length], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{initials(r.name)}</div>
            <div style={{ flex: 1, marginLeft: 12 }}>
              <div style={{ color: "var(--t1)", fontSize: 15, fontWeight: 500 }}>{r.name}</div>
              <div style={{ color: "var(--t3)", fontSize: 12, fontFamily: "monospace" }}>{r.uid}</div>
            </div>
            <button style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--accent)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", marginRight: 6 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </button>
            <button style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--bg-3)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
