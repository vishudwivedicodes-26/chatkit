"use client";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const router = useRouter();
  return (
    <div style={{ position: "fixed", inset: 0, background: "var(--bg-0)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "80px 32px 40px" }}>
      <div />
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 120, height: 120, borderRadius: "50%", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 40px" }}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
        </div>
        <h1 style={{ color: "var(--t1)", fontSize: 24, fontWeight: 600, marginBottom: 12 }}>Welcome to ChatKit</h1>
        <p style={{ color: "var(--t2)", fontSize: 14, lineHeight: 1.6, maxWidth: 300, margin: "0 auto" }}>
          End-to-end encrypted messaging. Not even ChatKit can read your messages.
        </p>
      </div>
      <div style={{ width: "100%", maxWidth: 340 }}>
        <button onClick={() => router.push("/auth")} style={{ width: "100%", height: 48, borderRadius: 24, background: "var(--accent)", color: "#fff", fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer" }}>
          Get Started
        </button>
      </div>
    </div>
  );
}
