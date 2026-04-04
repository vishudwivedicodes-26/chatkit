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

  const canSubmit = isLogin ? uid.length >= 5 && password.length >= 6 : displayName.length >= 2 && username.length >= 3 && password.length >= 6;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setIsLoading(true);
    setTimeout(() => { router.push("/chats"); setIsLoading(false); }, 800);
  };

  const inputStyle = (focused?: boolean): React.CSSProperties => ({
    width: "100%", fontSize: 16, color: "var(--text-primary)", padding: "14px 0",
    borderBottom: `1.5px solid ${focused ? "var(--accent)" : "var(--border)"}`,
    transition: "border-color 0.2s",
  });

  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "var(--bg-primary)", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div className="glass" style={{ height: 56, display: "flex", alignItems: "center", padding: "0 16px", flexShrink: 0 }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", padding: 8, marginLeft: -8 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        </button>
        <span style={{ color: "var(--text-primary)", fontSize: 18, fontWeight: 600, flex: 1, textAlign: "center", paddingRight: 30 }}>
          {isLogin ? "Secure Login" : "Create Identity"}
        </span>
      </div>

      {/* Toggle */}
      <div style={{ display: "flex", justifyContent: "center", gap: 32, padding: "24px 0 20px" }}>
        {[{ label: "Login", val: true }, { label: "Register", val: false }].map(t => (
          <button key={t.label} onClick={() => { setIsLogin(t.val); setError(""); }}
            style={{ background: "none", border: "none", color: isLogin === t.val ? "var(--accent)" : "var(--text-secondary)", fontSize: 15, fontWeight: 500, cursor: "pointer", paddingBottom: 8, borderBottom: isLogin === t.val ? "2px solid var(--accent)" : "2px solid transparent", transition: "all 0.2s" }}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="animate-fade" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", overflowY: "auto", padding: "0 24px" }}>
        <div style={{ width: "100%", maxWidth: 360 }}>
          {isLogin ? (
            <>
              <div className="e2e-badge" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 28, padding: "10px 16px" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                <span style={{ color: "var(--accent)", fontSize: 13, fontWeight: 500 }}>End-to-End Encrypted Session</span>
              </div>
              <input type="text" placeholder="Your UID (10 digits)" value={uid}
                onChange={(e) => setUid(e.target.value.replace(/[^0-9]/g, ""))} maxLength={10}
                style={{ ...inputStyle(), fontSize: 22, textAlign: "center", fontFamily: "monospace", letterSpacing: 4 }} />
            </>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--bg-elevated)", border: "2px solid var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                </div>
              </div>
              <input type="text" placeholder="Display Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} style={inputStyle()} />
              <div style={{ height: 16 }} />
              <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))} style={inputStyle()} />
            </>
          )}
          <div style={{ height: 20 }} />
          <input type="password" placeholder="Password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} style={{ ...inputStyle(), textAlign: "center" }} />
          {error && <p style={{ color: "var(--red)", fontSize: 13, marginTop: 16, textAlign: "center" }}>{error}</p>}
          <p style={{ color: "var(--text-secondary)", fontSize: 12, textAlign: "center", marginTop: 20, lineHeight: 1.6, opacity: 0.7 }}>
            {isLogin ? "Your encryption keys will be derived from your password. Keys never leave your device." : "A 10-digit UID will be generated for you. Share it with friends to connect."}
          </p>
        </div>
      </div>

      <div style={{ padding: "16px 24px 36px", display: "flex", justifyContent: "center" }}>
        <button disabled={!canSubmit || isLoading} onClick={handleSubmit} className="btn-primary" style={{ width: 180, height: 48, fontSize: 15 }}>
          {isLoading ? "Encrypting..." : "Continue →"}
        </button>
      </div>
    </div>
  );
}
