"use client";
import { useRouter } from "next/navigation";

const SECTIONS = [
  {
    title: "Display",
    items: [
      { label: "Theme", desc: "Dark", icon: "moon" },
      { label: "Wallpaper", desc: "Default", icon: "image" },
    ]
  },
  {
    title: "Chat settings",
    items: [
      { label: "Enter is send", desc: "Enter key will send your message", toggle: true, icon: "send" },
      { label: "Media visibility", desc: "Show newly downloaded media in your device's gallery", toggle: true, icon: "eye" },
      { label: "Font size", desc: "Medium", icon: "type" },
    ]
  },
  {
    title: "Archived chats",
    items: [
      { label: "Keep chats archived", desc: "Archived chats will remain archived when you receive a new message", toggle: false, icon: "archive" },
    ]
  },
  {
    title: "Chat history",
    items: [
      { label: "Export chat", icon: "download" },
      { label: "Archive all chats", icon: "archive" },
      { label: "Clear all chats", icon: "trash" },
      { label: "Delete all chats", icon: "trash-2", danger: true },
    ]
  }
];

export default function ChatsSettingsPage() {
  const router = useRouter();
  return (
    <div style={{ position: "fixed", inset: 0, background: "var(--bg-0)", display: "flex", flexDirection: "column" }}>
      <div style={{ height: 52, background: "var(--bg-1)", display: "flex", alignItems: "center", padding: "0 16px", borderBottom: "1px solid var(--border)" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--t1)" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <span style={{ color: "var(--t1)", fontSize: 17, fontWeight: 600, marginLeft: 14 }}>Chats</span>
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
                  <CIcon type={item.icon} danger={item.danger} />
                </div>
                <div style={{ flex: 1, marginLeft: 14 }}>
                  <div style={{ color: item.danger ? "var(--red)" : "var(--t1)", fontSize: 15 }}>{item.label}</div>
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

function CIcon({ type, danger }: { type: string; danger?: boolean }) {
  const c = danger ? "var(--red)" : "var(--t2)";
  const s = { width: 18, height: 18 };
  switch (type) {
    case "moon": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
    case "image": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
    case "send": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
    case "eye": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
    case "type": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>;
    case "archive": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>;
    case "download": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
    case "trash":
    case "trash-2": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
    default: return null;
  }
}
