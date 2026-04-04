"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SplashPage() {
  const router = useRouter();
  const [phase, setPhase] = useState(0); // 0=logo, 1=text, 2=fadeout

  useEffect(() => {
    setTimeout(() => setPhase(1), 400);
    setTimeout(() => setPhase(2), 2000);
    setTimeout(() => router.push("/welcome"), 2400);
  }, [router]);

  return (
    <div style={{
      position: "fixed", inset: 0,
      backgroundColor: "var(--bg-primary)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      transition: "opacity 0.4s", opacity: phase === 2 ? 0 : 1,
    }}>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="animate-glow" style={{
          width: 88, height: 88, borderRadius: 22,
          background: "linear-gradient(135deg, #00c896, #00a87e)",
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: phase >= 0 ? 1 : 0, transform: phase >= 0 ? "scale(1)" : "scale(0.8)",
          transition: "all 0.5s ease-out",
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        </div>
      </div>
      <div style={{
        paddingBottom: 48, textAlign: "center",
        opacity: phase >= 1 ? 1 : 0, transform: phase >= 1 ? "translateY(0)" : "translateY(8px)",
        transition: "all 0.4s ease-out",
      }}>
        <div style={{ color: "var(--text-secondary)", fontSize: 11, letterSpacing: 1 }}>ENCRYPTED BY</div>
        <div style={{ color: "var(--text-primary)", fontSize: 18, fontWeight: 700, letterSpacing: 4, marginTop: 4 }}>CHATKIT</div>
      </div>
    </div>
  );
}
