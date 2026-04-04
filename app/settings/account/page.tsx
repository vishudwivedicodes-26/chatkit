"use client";
import { useRouter } from "next/navigation";

const ITEMS = [
  { icon: "shield", label: "Security notifications", desc: "Show notifications for security changes" },
  { icon: "key", label: "Two-step verification", desc: "Add extra security to your account" },
  { icon: "mail", label: "Change email", desc: "Manage your registered email address" },
  { icon: "smartphone", label: "Change UID", desc: "Request a new system-generated CT-ID" },
  { icon: "file", label: "Request account info", desc: "Get a report of your account settings and data" },
  { icon: "trash", label: "Delete account", desc: "Permanently remove your ChatKit account", danger: true },
];

export default function AccountPage() {
  const router = useRouter();
  return (
    <div style={{ position: "fixed", inset: 0, background: "var(--bg-0)", display: "flex", flexDirection: "column" }}>
      <div style={{ height: 52, background: "var(--bg-1)", display: "flex", alignItems: "center", padding: "0 16px", borderBottom: "1px solid var(--border)" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--t1)" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <span style={{ color: "var(--t1)", fontSize: 17, fontWeight: 600, marginLeft: 14 }}>Account</span>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {ITEMS.map((item: any, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", padding: "13px 18px", cursor: "pointer", borderBottom: "1px solid var(--border)" }}
            onMouseOver={e => e.currentTarget.style.background = "var(--bg-2)"}
            onMouseOut={e => e.currentTarget.style.background = "transparent"}>
            <div style={{ width: 34, display: "flex", justifyContent: "center", flexShrink: 0 }}><AIcon type={item.icon} danger={item.danger} /></div>
            <div style={{ marginLeft: 16 }}>
              <div style={{ color: item.danger ? "var(--red)" : "var(--t1)", fontSize: 15 }}>{item.label}</div>
              <div style={{ color: "var(--t2)", fontSize: 12, marginTop: 1 }}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AIcon({ type, danger }: { type: string; danger?: boolean }) {
  const c = danger ? "var(--red)" : "var(--t2)";
  const s = { width: 18, height: 18 };
  switch (type) {
    case "shield": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
    case "key": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>;
    case "mail": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
    case "smartphone": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>;
    case "file": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
    case "trash": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
    default: return null;
  }
}
