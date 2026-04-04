"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [uid, setUid] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = isLogin
    ? uid.length >= 5 && password.length >= 6
    : displayName.length >= 2 && username.length >= 3 && password.length >= 6;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsLoading(true);
    setError("");

    // For demo: just navigate to chats
    // In production this connects to Supabase
    setTimeout(() => {
      router.push("/chats");
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 flex flex-col" style={{ backgroundColor: "#111B21" }}>
      {/* Header */}
      <div style={{
        height: 56,
        backgroundColor: "#1F2C34",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
      }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", padding: 8, marginLeft: -8 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <span style={{ color: "white", fontSize: 20, fontWeight: 600, flex: 1, textAlign: "center", paddingRight: 32 }}>
          {isLogin ? "Login" : "Create Account"}
        </span>
      </div>

      {/* Toggle */}
      <div style={{ display: "flex", justifyContent: "center", gap: 24, padding: "24px 0 16px" }}>
        <button
          onClick={() => { setIsLogin(true); setError(""); }}
          style={{
            background: "none",
            border: "none",
            color: isLogin ? "#00A884" : "#8696A0",
            fontSize: 15,
            fontWeight: 500,
            cursor: "pointer",
            paddingBottom: 8,
            borderBottom: isLogin ? "2px solid #00A884" : "2px solid transparent",
            transition: "all 0.2s",
          }}
        >
          Login
        </button>
        <button
          onClick={() => { setIsLogin(false); setError(""); }}
          style={{
            background: "none",
            border: "none",
            color: !isLogin ? "#00A884" : "#8696A0",
            fontSize: 15,
            fontWeight: 500,
            cursor: "pointer",
            paddingBottom: 8,
            borderBottom: !isLogin ? "2px solid #00A884" : "2px solid transparent",
            transition: "all 0.2s",
          }}
        >
          Register
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center overflow-y-auto" style={{ padding: "0 24px" }}>
        {isLogin ? (
          <div className="w-full animate-fade-in" style={{ maxWidth: 360 }}>
            {/* Global Node Indicator */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px 0",
              borderBottom: "1px solid #2A3942",
              marginBottom: 24,
            }}>
              <span style={{ fontSize: 17, color: "#E9EDEF" }}>🌍 Global Anonymous Node</span>
            </div>

            <input
              type="text"
              placeholder="Your UID (10-digit number)"
              value={uid}
              onChange={(e) => setUid(e.target.value.replace(/[^0-9]/g, ""))}
              maxLength={10}
              style={{
                width: "100%",
                fontSize: 22,
                color: "#E9EDEF",
                textAlign: "center",
                padding: "12px 0",
                borderBottom: "2px solid #00A884",
                marginBottom: 24,
                fontFamily: "monospace",
                letterSpacing: 3,
              }}
            />
          </div>
        ) : (
          <div className="w-full animate-fade-in" style={{ maxWidth: 360 }}>
            {/* Avatar placeholder */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
              <div style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                backgroundColor: "#2A3942",
                border: "2px solid #00A884",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8696A0" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            </div>

            <input
              type="text"
              placeholder="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              style={{
                width: "100%",
                fontSize: 16,
                color: "#E9EDEF",
                padding: "12px 0",
                borderBottom: "1px solid #2A3942",
                marginBottom: 16,
              }}
            />
            <input
              type="text"
              placeholder="Username (unique)"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
              style={{
                width: "100%",
                fontSize: 16,
                color: "#E9EDEF",
                padding: "12px 0",
                borderBottom: "1px solid #2A3942",
                marginBottom: 16,
              }}
            />
          </div>
        )}

        {/* Password (shared) */}
        <div className="w-full" style={{ maxWidth: 360 }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              fontSize: 16,
              color: "#E9EDEF",
              padding: "12px 0",
              borderBottom: "1px solid #2A3942",
              textAlign: "center",
            }}
          />
        </div>

        {error && (
          <p style={{ color: "#FF5252", fontSize: 13, marginTop: 16 }}>{error}</p>
        )}

        <p style={{ color: "#8696A0", fontSize: 13, textAlign: "center", marginTop: 24, padding: "0 16px", lineHeight: 1.5 }}>
          {isLogin
            ? "Enter the UID assigned to your account and your password."
            : "Your password is used to encrypt your keys locally. It cannot be recovered if lost."}
        </p>
      </div>

      {/* Bottom button */}
      <div style={{ padding: "16px 24px 32px", display: "flex", justifyContent: "center" }}>
        <button
          disabled={!canSubmit || isLoading}
          onClick={handleSubmit}
          style={{
            width: 160,
            height: 44,
            borderRadius: 22,
            backgroundColor: canSubmit ? "#00A884" : "#2A3942",
            color: canSubmit ? "white" : "#8696A0",
            fontSize: 15,
            fontWeight: 600,
            border: "none",
            cursor: canSubmit ? "pointer" : "default",
            transition: "all 0.2s",
          }}
        >
          {isLoading ? "Please wait..." : "NEXT"}
        </button>
      </div>
    </div>
  );
}
