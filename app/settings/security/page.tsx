"use client";
import { useRouter } from "next/navigation";

const SECTIONS = [
  {
    title: "Security and Privacy",
    items: [
      { label: "Show security notifications", desc: "Get notified when your security code changes for a contact's phone. If you have multiple devices, this setting must be enabled on each device where you want to get notifications.", toggle: true, icon: "bell" },
      { label: "End-to-end encryption", desc: "Your messages and calls are secured with end-to-end encryption. This means only you and the person you're communicating with can read or listen to them. Not even ChatKit can.", icon: "lock" },
    ]
  },
  {
    title: "Encryption details",
    items: [
      { label: "Algorithm", val: "XSalsa20-Poly1305 (256-bit)", icon: "shield" },
      { label: "Key Exchange", val: "X25519 (Diffie-Hellman)", icon: "key" },
      { label: "Hashing", val: "SHA-512 + 600K PBKDF2", icon: "hash" },
    ]
  },
  {
    title: "Safety",
    items: [
      { label: "Security codes", desc: "Verify that your messages are end-to-end encrypted", icon: "qr" },
      { label: "Learn more", desc: "Read our security whitepaper", icon: "help" },
    ]
  }
];

export default function SecuritySettingsPage() {
  const router = useRouter();
  return (
    <div style={{ position: "fixed", inset: 0, background: "var(--bg-0)", display: "flex", flexDirection: "column" }}>
      <div style={{ height: 52, background: "var(--bg-1)", display: "flex", alignItems: "center", padding: "0 16px", borderBottom: "1px solid var(--border)" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--t1)" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <span style={{ color: "var(--t1)", fontSize: 17, fontWeight: 600, marginLeft: 14 }}>Security</span>
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
                  {item.desc && <div style={{ color: "var(--t2)", fontSize: 12, marginTop: 2, lineHeight: 1.4 }}>{item.desc}</div>}
                  {item.val && <div style={{ color: "var(--accent)", fontSize: 13, marginTop: 2, fontFamily: "monospace" }}>{item.val}</div>}
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

function SIcon({ type }: { type: string }) {
  const c = "var(--t2)";
  const s = { width: 18, height: 18 };
  switch (type) {
    case "bell": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
    case "lock": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
    case "shield": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
    case "key": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>;
    case "hash": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>;
    case "qr": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><rect width="8" height="8" x="3" y="3" rx="1"/><rect width="8" height="8" x="13" y="3" rx="1"/><rect width="8" height="8" x="3" y="13" rx="1"/><rect width="4" height="4" x="13" y="13" rx="1"/><rect width="4" height="4" x="17" y="17" rx="1"/></svg>;
    case "help": return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
    default: return null;
  }
}
