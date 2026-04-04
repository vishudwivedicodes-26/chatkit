"use client";
import { useRouter } from "next/navigation";

const SECTIONS = [
  {
    title: "Who can see my personal info",
    items: [
      { label: "Last seen & online", desc: "Nobody" },
      { label: "Profile photo", desc: "Everyone" },
      { label: "About", desc: "My contacts" },
      { label: "Status", desc: "My contacts" },
    ]
  },
  {
    title: "Messaging",
    items: [
      { label: "Read receipts", desc: "If turned off, you won't send or receive read receipts. Read receipts are always sent for group chats.", toggle: true },
      { label: "Default message timer", desc: "Start new chats with disappearing messages set to your timer", val: "Off" },
    ]
  },
  {
    title: "Security",
    items: [
      { label: "Blocked contacts", desc: "None" },
      { label: "App lock", desc: "Unlock with Biometrics/Password", val: "Disabled" },
    ]
  }
];

export default function PrivacyPage() {
  const router = useRouter();
  return (
    <div style={{ position: "fixed", inset: 0, background: "var(--bg-0)", display: "flex", flexDirection: "column" }}>
      <div style={{ height: 52, background: "var(--bg-1)", display: "flex", alignItems: "center", padding: "0 16px", borderBottom: "1px solid var(--border)" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--t1)" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <span style={{ color: "var(--t1)", fontSize: 17, fontWeight: 600, marginLeft: 14 }}>Privacy</span>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {SECTIONS.map((sec, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ padding: "16px 18px 8px", color: "var(--accent)", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{sec.title}</div>
            {sec.items.map((item: any, j) => (
              <div key={j} style={{ display: "flex", alignItems: "center", padding: "12px 18px", cursor: "pointer", borderBottom: "1px solid var(--border)" }}
                onMouseOver={e => e.currentTarget.style.background = "var(--bg-2)"}
                onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "var(--t1)", fontSize: 15 }}>{item.label}</div>
                  <div style={{ color: "var(--t2)", fontSize: 12, marginTop: 2, maxWidth: "90%" }}>{item.desc}</div>
                </div>
                {item.val && <div style={{ color: "var(--accent)", fontSize: 13 }}>{item.val}</div>}
                {item.toggle && (
                  <div style={{ width: 32, height: 18, borderRadius: 9, background: "var(--accent)", position: "relative" }}>
                    <div style={{ position: "absolute", top: 2, right: 2, width: 14, height: 14, borderRadius: "50%", background: "#fff" }} />
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
