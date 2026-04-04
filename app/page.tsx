"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SplashPage() {
  const router = useRouter();
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => { setShow(false); setTimeout(() => router.push("/welcome"), 300); }, 1800);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div style={{ position: "fixed", inset: 0, background: "var(--bg-0)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: show ? 1 : 0, transition: "opacity 0.3s ease" }}>
      <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
        <div style={{ width: 72, height: 72, borderRadius: 18, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </div>
      </div>
      <div style={{ paddingBottom: 48, textAlign: "center" }}>
        <div style={{ color: "var(--t3)", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>end-to-end encrypted</div>
        <div style={{ color: "var(--t1)", fontSize: 16, fontWeight: 700, letterSpacing: 3, marginTop: 4 }}>CHATKIT</div>
      </div>
    </div>
  );
}
