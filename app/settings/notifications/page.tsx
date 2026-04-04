"use client";
import { useRouter } from "next/navigation";

const SECTIONS = [
  {
    title: "Messages",
    items: [
      { label: "Notification tones", desc: "Default", icon: "music" },
      { label: "Vibrate", desc: "Default", icon: "vibrate" },
      { label: "High priority notifications", desc: "Show previews of notifications at the top of the screen", toggle: true, icon: "alert" },
      { label: "Reaction notifications", desc: "Show notifications for reactions to messages you send", toggle: true, icon: "smile" },
    ]
  },
  {
    title: "Groups",
    items: [
      { label: "Notification tones", desc: "Default", icon: "music" },
      { label: "Vibrate", desc: "Default", icon: "vibrate" },
      { label: "High priority notifications", desc: "Show previews of notifications at the top of the screen", toggle: true, icon: "alert" },
      { label: "Reaction notifications", desc: "Show notifications for reactions to messages you send", toggle: true, icon: "smile" },
    ]
  },
  {
    title: "Calls",
    items: [
      { label: "Ringtone", desc: "Default", icon: "phone" },
      { label: "Vibrate", desc: "Default", icon: "vibrate" },
    ]
  }
];

export default function NotificationsSettingsPage() {
  const router = useRouter();
  return (
    <div style={{ position: "fixed", inset: 0, background: "var(--bg-0)", display: "flex", flexDirection: "column" }}>
      <div style={{ height: 52, background: "var(--bg-1)", display: "flex", alignItems: "center", padding: "0 16px", borderBottom: "1px solid var(--border)" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--t1)" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <span style={{ color: "var(--t1)", fontSize: 17, fontWeight: 600, marginLeft: 14 }}>Notifications</span>
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
                  <NIcon type={item.icon} />
                </div>
                <div style={{ flex: 1, marginLeft: 14 }}>
                  <div style={{ color: "var(--t1)", fontSize: 15 }}>{item.label}</div>
                  {item.desc && <div style={{ color: "var(--t2)", fontSize: 12, marginTop: 2 }}>{item.desc}</div>}
                </div>
                {item.toggle !== undefined && (
                  <div style={{ width: 32, height: 18, borderRadius: 9, background: item.toggle ? "var(--accent)" : "var(--bg-3)", position: "relative" }}>
                    <div style={{ position: "absolute", top: 2, right: item.toggle ? 2 : "auto", left: item.toggle ? "auto" : 2, width: 14, height: 14, borderRadius: "50%", background: "#fff" }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function NIcon({ type }: { type: string }) {
  const c = "var(--t2)";
  const s = { width: 18, height: 18 };
  switch (type) {
    case "music": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>;
    case "vibrate": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M22 8L16.22 8.78 12 14.5 7.78 8.78 2 8l4.41-1.47a3 3 0 0 1 1.77 0L12 8l3.82-1.47a3 3 0 0 1 1.77 0L22 8zM2 16l5.78-.78 4.22-5.72 4.22 5.72 5.78.78-4.41 1.47a3 3 0 0 1-1.77 0L12 16l-3.82 1.47a3 3 0 0 1-1.77 0L2 16z"/></svg>;
    case "alert": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
    case "smile": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>;
    case "phone": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 11 18.86a19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.18 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.72c.13.81.36 1.6.68 2.34a2 2 0 0 1-.45 2.11L8 9.4a16 16 0 0 0 6.6 6.6l1.23-1.23a2 2 0 0 1 2.11-.45c.74.32 1.53.55 2.34.68A2 2 0 0 1 22 16.92z"/></svg>;
    default: return null;
  }
}
