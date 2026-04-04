"use client";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  return (
    <div style={{ position: "fixed", inset: 0, background: "var(--bg-0)", display: "flex", flexDirection: "column" }}>
      <div style={{ height: 52, background: "var(--bg-1)", display: "flex", alignItems: "center", padding: "0 16px", borderBottom: "1px solid var(--border)" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--t1)" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <span style={{ color: "var(--t1)", fontSize: 17, fontWeight: 600, marginLeft: 14 }}>Profile</span>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "32px 0 24px" }}>
          <div style={{ width: 120, height: 120, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, fontWeight: 700, color: "#fff", position: "relative" }}>
            A
            <div style={{ position: "absolute", bottom: 2, right: 2, width: 34, height: 34, borderRadius: "50%", background: "var(--bg-2)", border: "2px solid var(--bg-0)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--t2)" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </div>
          </div>
        </div>

        <PField label="Name" value="Anonymous User" />
        <PField label="About" value="Hey there! I am using ChatKit" />
        <PField label="UID" value="4829103756" mono />
        <PField label="Username" value="@anonymous_user" />
      </div>
    </div>
  );
}

function PField({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center" }}>
      <div style={{ flex: 1 }}>
        <div style={{ color: "var(--t2)", fontSize: 12, fontWeight: 500, marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
        <div style={{ color: "var(--t1)", fontSize: 15, fontFamily: mono ? "monospace" : "inherit", letterSpacing: mono ? 1 : 0 }}>{value}</div>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
    </div>
  );
}
