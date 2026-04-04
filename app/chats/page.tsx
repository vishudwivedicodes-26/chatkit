"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CHATS = [
  { id: "1", name: "Alex Storm", msg: "The encryption module is ready ✓", time: "10:45 AM", unread: 2, online: true },
  { id: "2", name: "Pixel Ghost", msg: "🎤 Voice Message (0:32)", time: "9:12 AM", unread: 0, online: false },
  { id: "3", name: "Cyber Nova", msg: "Will check tonight 🔒", time: "Yesterday", unread: 5, online: true },
  { id: "4", name: "Shadow Fox", msg: "✓✓ Document received", time: "Yesterday", unread: 0, online: false },
  { id: "5", name: "Quantum", msg: "Typing...", time: "8:30 AM", unread: 1, online: true },
  { id: "6", name: "Neon Wolf", msg: "✓✓ See you tomorrow!", time: "Monday", unread: 0, online: false },
  { id: "7", name: "Zero Cool", msg: "📷 Photo", time: "Monday", unread: 0, online: false },
  { id: "8", name: "Dark Matter", msg: "Let me check that...", time: "Sunday", unread: 0, online: false },
];

const COLORS = ["#25d366","#1da1f2","#9b59b6","#e74c3c","#f39c12","#e91e63","#00bcd4","#2ecc71"];
const initials = (n: string) => n.split(" ").map(w => w[0]).join("").slice(0,2);

export default function ChatsPage() {
  const router = useRouter();
  const [tab, setTab] = useState("Chats");
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div style={{ position: "fixed", inset: 0, background: "var(--bg-0)", display: "flex", flexDirection: "column" }}>
      {/* header */}
      <div style={{ height: 52, background: "var(--bg-1)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", borderBottom: "1px solid var(--border)" }}>
        <span style={{ fontSize: 20, fontWeight: 700, color: "var(--accent)" }}>ChatKit</span>
        <div style={{ display: "flex", gap: 16 }}>
          <Btn onClick={() => setShowSearch(!showSearch)}><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--t2)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></Btn>
          <Btn onClick={() => router.push("/settings")}><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--t2)" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg></Btn>
        </div>
      </div>

      {/* tabs */}
      <div style={{ display: "flex", height: 40, borderBottom: "1px solid var(--border)", background: "var(--bg-1)" }}>
        {["Chats","Updates","Calls"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, background: "none", border: "none", borderBottom: tab === t ? "2px solid var(--accent)" : "2px solid transparent", color: tab === t ? "var(--t1)" : "var(--t3)", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>{t}</button>
        ))}
      </div>

      {/* search bar */}
      {showSearch && (
        <div style={{ padding: "8px 12px", background: "var(--bg-1)" }}>
          <div style={{ background: "var(--bg-2)", borderRadius: 8, height: 36, display: "flex", alignItems: "center", padding: "0 12px", border: "1px solid var(--border)" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--t3)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder="Search" style={{ flex: 1, marginLeft: 8, color: "var(--t1)", fontSize: 14 }} />
          </div>
        </div>
      )}

      {/* list */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {CHATS.map((c,i) => (
          <div key={c.id} onClick={() => router.push(`/chats/${c.id}`)} style={{ height: 72, display: "flex", alignItems: "center", cursor: "pointer", padding: "0 14px", borderBottom: "1px solid var(--border)" }}
            onMouseOver={e => e.currentTarget.style.background = "var(--bg-2)"}
            onMouseOut={e => e.currentTarget.style.background = "transparent"}>
            <div style={{ width: 46, height: 46, borderRadius: "50%", background: COLORS[i % COLORS.length], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#fff", position: "relative", flexShrink: 0 }}>
              {initials(c.name)}
              {c.online && <div style={{ position: "absolute", bottom: 0, right: 0, width: 11, height: 11, borderRadius: "50%", background: "var(--accent)", border: "2px solid var(--bg-0)" }} />}
            </div>
            <div style={{ flex: 1, marginLeft: 12, overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ color: "var(--t1)", fontSize: 15, fontWeight: 500 }}>{c.name}</span>
                <span style={{ color: c.unread ? "var(--accent)" : "var(--t3)", fontSize: 12 }}>{c.time}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--t2)", fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{c.msg}</span>
                {c.unread > 0 && <div style={{ minWidth: 18, height: 18, borderRadius: 9, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: 8 }}><span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>{c.unread}</span></div>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FAB */}
      <button onClick={() => router.push("/friends")} style={{ position: "absolute", bottom: 24, right: 20, width: 52, height: 52, borderRadius: "50%", background: "var(--accent)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="12" y1="8" x2="12" y2="14"/><line x1="9" y1="11" x2="15" y2="11"/></svg>
      </button>
    </div>
  );
}

function Btn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return <button onClick={onClick} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}>{children}</button>;
}
