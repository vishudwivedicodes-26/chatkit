"use client";
import { useRouter } from "next/navigation";

const SECTIONS = [
  {
    title: "Usage",
    items: [
      { label: "Manage storage", desc: "No data used", icon: "db" },
      { label: "Network usage", desc: "Sent 4.2 MB · Received 18.5 MB", icon: "cloud" },
    ]
  },
  {
    title: "Media auto-download",
    items: [
      { label: "When using mobile data", val: "No media", icon: "wifi-off" },
      { label: "When connected on Wi-Fi", val: "All media", icon: "wifi" },
      { label: "When roaming", val: "No media", icon: "globe" },
    ]
  },
  {
    title: "Media upload quality",
    items: [
      { label: "Photo upload quality", desc: "Auto (recommended)", icon: "image" },
    ]
  },
  {
    title: "Proxy",
    items: [
      { label: "Proxy settings", desc: "Off", icon: "server" },
    ]
  }
];

export default function StorageSettingsPage() {
  const router = useRouter();
  return (
    <div style={{ position: "fixed", inset: 0, background: "var(--bg-0)", display: "flex", flexDirection: "column" }}>
      <div style={{ height: 52, background: "var(--bg-1)", display: "flex", alignItems: "center", padding: "0 16px", borderBottom: "1px solid var(--border)" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--t1)" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <span style={{ color: "var(--t1)", fontSize: 17, fontWeight: 600, marginLeft: 14 }}>Storage and data</span>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {SECTIONS.map((sec, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ padding: "16px 18px 8px", color: "var(--accent)", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{sec.title}</div>
            {sec.items.map((item: any, j) => (
              <div key={j} style={{ display: "flex", alignItems: "center", padding: "12px 18px", cursor: "pointer", borderBottom: "1px solid var(--border)" }}
                onMouseOver={e => e.currentTarget.style.background = "var(--bg-2)"}
                onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                <div style={{ width: 34, display: "flex", justifyContent: "center", flexShrink: 0 }}>
                  <SIcon type={item.icon} />
                </div>
                <div style={{ flex: 1, marginLeft: 14 }}>
                  <div style={{ color: "var(--t1)", fontSize: 15 }}>{item.label}</div>
                  {item.desc && <div style={{ color: "var(--t2)", fontSize: 12, marginTop: 2 }}>{item.desc}</div>}
                  {item.val && <div style={{ color: "var(--accent)", fontSize: 13, marginTop: 2 }}>{item.val}</div>}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function SIcon({ type }: { type: string }) {
  const c = "var(--t2)";
  const s = { width: 18, height: 18 };
  switch (type) {
    case "db": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/></svg>;
    case "cloud": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M17.5 19c2.5 0 4.5-2 4.5-4.5 0-2.3-1.7-4.2-4-4.5A7 7 0 1 0 5 13h.5a4.5 4.5 0 1 0 0 9h12z"/></svg>;
    case "wifi-off": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.58 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><path d="M12 20h.01"/></svg>;
    case "wifi": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><path d="M12 20h.01"/></svg>;
    case "globe": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
    case "image": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
    case "server": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>;
    default: return null;
  }
}
