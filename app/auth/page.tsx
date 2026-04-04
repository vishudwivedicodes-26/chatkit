"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login"|"register">("login");
  const [uid, setUid] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const valid = mode === "login" ? uid.length >= 5 && password.length >= 6 : name.length >= 2 && username.length >= 3 && password.length >= 6;

  const submit = () => { if (!valid) return; setLoading(true); setTimeout(() => { router.push("/chats"); }, 600); };

  return (
    <div style={{ position: "fixed", inset: 0, background: "var(--bg-0)", display: "flex", flexDirection: "column" }}>
      {/* header */}
      <div style={{ height: 56, background: "var(--bg-1)", display: "flex", alignItems: "center", padding: "0 16px", borderBottom: "1px solid var(--border)" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--t1)" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <span style={{ flex: 1, textAlign: "center", color: "var(--t1)", fontSize: 17, fontWeight: 600 }}>{mode === "login" ? "Login" : "Register"}</span>
        <div style={{ width: 32 }} />
      </div>

      {/* tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)" }}>
        {(["login","register"] as const).map(m => (
          <button key={m} onClick={() => setMode(m)} style={{ flex: 1, height: 44, background: "none", border: "none", borderBottom: mode === m ? "2px solid var(--accent)" : "2px solid transparent", color: mode === m ? "var(--t1)" : "var(--t2)", fontSize: 14, fontWeight: 500, cursor: "pointer", textTransform: "capitalize" }}>{m}</button>
        ))}
      </div>

      {/* form */}
      <div style={{ flex: 1, overflow: "auto", padding: "28px 24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: "100%", maxWidth: 340 }}>
          {mode === "login" ? (
            <>
              <div style={{ textAlign: "center", color: "var(--t2)", fontSize: 13, marginBottom: 24, padding: "8px 16px", background: "var(--accent-dim)", borderRadius: 8, border: "1px solid rgba(37,211,102,0.12)" }}>
                🔒 End-to-end encrypted session
              </div>
              <Field label="UID" value={uid} onChange={v => setUid(v.replace(/\D/g,""))} placeholder="10-digit number" maxLength={10} mono />
            </>
          ) : (
            <>
              <Field label="Display Name" value={name} onChange={setName} placeholder="Your name" />
              <Field label="Username" value={username} onChange={v => setUsername(v.toLowerCase().replace(/[^a-z0-9_]/g,""))} placeholder="unique_username" />
            </>
          )}
          <Field label="Password" value={password} onChange={setPassword} placeholder="Min 6 characters" password />
          <p style={{ color: "var(--t3)", fontSize: 12, textAlign: "center", marginTop: 20, lineHeight: 1.5 }}>
            {mode === "login" ? "Keys are derived locally from your password." : "A unique 10-digit UID will be assigned to you."}
          </p>
        </div>
      </div>

      {/* submit */}
      <div style={{ padding: "12px 24px 32px", display: "flex", justifyContent: "center" }}>
        <button disabled={!valid || loading} onClick={submit} style={{ width: 160, height: 44, borderRadius: 22, background: valid ? "var(--accent)" : "var(--bg-2)", color: valid ? "#fff" : "var(--t3)", fontSize: 14, fontWeight: 600, border: "none", cursor: valid ? "pointer" : "default", transition: "background 0.15s" }}>
          {loading ? "Please wait..." : "Continue"}
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, password, mono, maxLength }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; password?: boolean; mono?: boolean; maxLength?: number }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", color: "var(--t2)", fontSize: 12, fontWeight: 500, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</label>
      <input type={password ? "password" : "text"} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength}
        style={{ width: "100%", height: 44, padding: "0 14px", background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--t1)", fontSize: 15, fontFamily: mono ? "monospace" : "inherit", letterSpacing: mono ? 2 : 0 }}
        onFocus={e => e.currentTarget.style.borderColor = "var(--accent)"}
        onBlur={e => e.currentTarget.style.borderColor = "var(--border)"} />
    </div>
  );
}
