"use client";
import { useRouter } from "next/navigation";

const LANGUAGES = [
  { name: "English", sub: "(device's language)", selected: true },
  { name: "हिन्दी", sub: "Hindi", selected: false },
  { name: "বাংলা", sub: "Bengali", selected: false },
  { name: "ਪੰਜਾਬੀ", sub: "Punjabi", selected: false },
  { name: "ગુજરાતી", sub: "Gujarati", selected: false },
  { name: "मराठी", sub: "Marathi", selected: false },
  { name: "தமிழ்", sub: "Tamil", selected: false },
  { name: "తెలుగు", sub: "Telugu", selected: false },
  { name: "ಕನ್ನಡ", sub: "Kannada", selected: false },
  { name: "മലയാളം", sub: "Malayalam", selected: false },
];

export default function LanguageSettingsPage() {
  const router = useRouter();
  return (
    <div style={{ position: "fixed", inset: 0, background: "var(--bg-0)", display: "flex", flexDirection: "column" }}>
      <div style={{ height: 52, background: "var(--bg-1)", display: "flex", alignItems: "center", padding: "0 16px", borderBottom: "1px solid var(--border)" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--t1)" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <span style={{ color: "var(--t1)", fontSize: 17, fontWeight: 600, marginLeft: 14 }}>App language</span>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {LANGUAGES.map((lang, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", padding: "14px 18px", cursor: "pointer", borderBottom: "1px solid var(--border)" }}
            onMouseOver={e => e.currentTarget.style.background = "var(--bg-2)"}
            onMouseOut={e => e.currentTarget.style.background = "transparent"}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", border: lang.selected ? "2px solid var(--accent)" : "2px solid var(--t3)", display: "flex", alignItems: "center", justifyContent: "center", marginRight: 18 }}>
              {lang.selected && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--accent)" }} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "var(--t1)", fontSize: 16 }}>{lang.name}</div>
              <div style={{ color: "var(--t2)", fontSize: 13, marginTop: 1 }}>{lang.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
