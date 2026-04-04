"use client";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const router = useRouter();
  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "var(--bg-primary)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "60px 0 40px" }}>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "var(--accent)" }} />
        <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "var(--text-secondary)", opacity: 0.4 }} />
        <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "var(--text-secondary)", opacity: 0.4 }} />
      </div>

      <div className="animate-slideUp" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0 40px" }}>
        <div style={{ position: "relative", width: 240, height: 240, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 48 }}>
          <div className="animate-glow" style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", border: "1.5px solid rgba(0,200,150,0.15)" }} />
          <div style={{ position: "absolute", width: 140, height: 140, borderRadius: "50%", border: "1px solid rgba(0,200,150,0.25)" }} />
          <div className="animate-float" style={{ position: "relative", zIndex: 1 }}>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
        </div>

        <h1 style={{ color: "var(--text-primary)", fontSize: 26, fontWeight: 300, marginBottom: 16, letterSpacing: -0.5 }}>
          Welcome to <span style={{ fontWeight: 700 }}>ChatKit</span>
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, textAlign: "center", lineHeight: 1.7, maxWidth: 320 }}>
          Military-grade encrypted messaging. Your conversations are protected with <span style={{ color: "var(--accent)" }}>X25519 + XSalsa20-Poly1305</span> encryption. Not even we can read your messages.
        </p>
      </div>

      <div style={{ width: "100%", padding: "0 24px", maxWidth: 400 }}>
        <button onClick={() => router.push("/auth")} className="btn-primary" style={{ width: "100%", height: 52, fontSize: 16 }}>
          Get Started
        </button>
        <p style={{ color: "var(--text-secondary)", fontSize: 11, textAlign: "center", marginTop: 12, opacity: 0.6 }}>
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}
