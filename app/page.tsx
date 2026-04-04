"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SplashPage() {
  const router = useRouter();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => router.push("/welcome"), 400);
    }, 2200);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center transition-opacity duration-400 ${visible ? "opacity-100" : "opacity-0"}`}
      style={{ backgroundColor: "#111B21" }}
    >
      {/* Logo */}
      <div className="flex-1 flex items-center justify-center">
        <div
          className="animate-slide-up"
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            backgroundColor: "#00A884",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 40px rgba(0,168,132,0.3)",
          }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
      </div>

      {/* Footer */}
      <div className="pb-10 flex flex-col items-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <span style={{ color: "#8696A0", fontSize: 12 }}>from</span>
        <span style={{ color: "#8696A0", fontSize: 13, fontWeight: 500, letterSpacing: 3, marginTop: 4, textTransform: "uppercase" }}>
          ChatKit
        </span>
      </div>
    </div>
  );
}
