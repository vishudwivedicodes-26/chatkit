"use client";
import { useRouter } from "next/navigation";

const ITEMS = [
  { icon: "help", label: "Help Center", desc: "Get help with using ChatKit" },
  { icon: "contact", label: "Contact us", desc: "Questions? Need help?" },
  { icon: "file", label: "Terms and Privacy Policy", desc: "Read our policies" },
  { icon: "info", label: "App info", desc: "Version 1.0.0 (Public Beta)" },
];

export default function HelpSettingsPage() {
  const router = useRouter();
  return (
    <div style={{ position: "fixed", inset: 0, background: "var(--bg-0)", display: "flex", flexDirection: "column" }}>
      <div style={{ height: 52, background: "var(--bg-1)", display: "flex", alignItems: "center", padding: "0 16px", borderBottom: "1px solid var(--border)" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--t1)" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <span style={{ color: "var(--t1)", fontSize: 17, fontWeight: 600, marginLeft: 14 }}>Help</span>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {ITEMS.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", padding: "14px 18px", cursor: "pointer", borderBottom: "1px solid var(--border)" }}
            onMouseOver={e => e.currentTarget.style.background = "var(--bg-2)"}
            onMouseOut={e => e.currentTarget.style.background = "transparent"}>
            <div style={{ width: 34, display: "flex", justifyContent: "center", flexShrink: 0 }}>
              <HIcon type={item.icon} />
            </div>
            <div style={{ flex: 1, marginLeft: 14 }}>
              <div style={{ color: "var(--t1)", fontSize: 16 }}>{item.label}</div>
              <div style={{ color: "var(--t2)", fontSize: 13, marginTop: 2 }}>{item.desc}</div>
            </div>
          </div>
        ))}
        
        <div style={{ padding: "40px 20px", textAlign: "center" }}>
          <div style={{ color: "var(--accent)", fontSize: 24, fontWeight: 800, letterSpacing: -1, marginBottom: 4 }}>ChatKit</div>
          <div style={{ color: "var(--t3)", fontSize: 12 }}>© 2024 ChatKit Privacy Systems</div>
          <div style={{ color: "var(--t3)", fontSize: 11, marginTop: 4 }}>Advanced End-to-End Encryption</div>
        </div>
      </div>
    </div>
  );
}

function HIcon({ type }: { type: string }) {
  const c = "var(--t2)";
  const s = { width: 18, height: 18 };
  switch (type) {
    case "help": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
    case "contact": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    case "file": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
    case "info": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;
    default: return null;
  }
}
