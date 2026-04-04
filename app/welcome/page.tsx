"use client";

import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-between" style={{ backgroundColor: "#111B21", paddingTop: 60, paddingBottom: 40 }}>
      {/* Progress dots */}
      <div className="flex items-center" style={{ gap: 6 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "white" }} />
        <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#8696A0" }} />
        <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#8696A0" }} />
      </div>

      {/* Center content */}
      <div className="flex flex-col items-center animate-slide-up" style={{ padding: "0 40px" }}>
        {/* Lock animation */}
        <div style={{ position: "relative", width: 260, height: 260, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 40 }}>
          {/* Outer ring */}
          <div style={{
            position: "absolute",
            width: 220,
            height: 220,
            borderRadius: "50%",
            border: "2px solid rgba(0,168,132,0.2)",
            animation: "pulse-glow 3s ease-in-out infinite",
          }} />
          {/* Inner ring */}
          <div style={{
            position: "absolute",
            width: 160,
            height: 160,
            borderRadius: "50%",
            border: "1px solid rgba(0,168,132,0.3)",
          }} />
          {/* Shield icon */}
          <svg width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="#00A884" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </div>

        <h1 style={{ color: "white", fontSize: 24, fontWeight: 300, marginBottom: 16, textAlign: "center" }}>
          Welcome to ChatKit
        </h1>

        <p style={{ color: "#8696A0", fontSize: 14, textAlign: "center", lineHeight: 1.6 }}>
          Read our{" "}
          <span style={{ color: "#53BDEB", textDecoration: "underline", cursor: "pointer" }}>Privacy Policy</span>
          . Tap &quot;Agree and continue&quot; to accept the{" "}
          <span style={{ color: "#53BDEB", textDecoration: "underline", cursor: "pointer" }}>Terms of Service</span>.
        </p>
      </div>

      {/* Bottom button */}
      <div style={{ width: "100%", padding: "0 24px" }}>
        <button
          onClick={() => router.push("/auth")}
          style={{
            width: "100%",
            height: 52,
            borderRadius: 26,
            backgroundColor: "#00A884",
            color: "white",
            fontSize: 16,
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#008f6f")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#00A884")}
        >
          Agree and continue
        </button>
      </div>
    </div>
  );
}
