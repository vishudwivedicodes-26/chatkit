"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { generateKeyPair, encryptPrivateKey, decryptPrivateKey, generateUID } from "@/lib/crypto";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuthStore();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [identifier, setIdentifier] = useState(""); 
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) router.push("/chats");
  }, [isAuthenticated, router]);

  const valid = mode === "login" 
    ? identifier.trim().length > 0 && password.length > 0 
    : name.trim().length > 0 && username.trim().length > 0 && password.length > 0;

  const handleAuth = async () => {
    if (!valid) return;
    setLoading(true);
    setError("");

    try {
      if (mode === "register") {
        const uid = generateUID();
        const cleanUser = username.trim().toLowerCase();
        const email = `${cleanUser}@chatkit.io`; 
        
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError) {
          if (authError.message.toLowerCase().includes("password")) {
            throw new Error("Password must be at least 6 characters.");
          }
          if (authError.message.toLowerCase().includes("already registered")) {
            throw new Error("This username is already taken. Try a different one.");
          }
          throw new Error(authError.message);
        }
        if (!authData.user) throw new Error("Registration failed");

        const keys = generateKeyPair();
        const encPrivKey = await encryptPrivateKey(keys.privateKey, password);

        const { error: profError } = await supabase.from("profiles").insert({
          id: authData.user.id,
          display_name: name,
          username: username.toLowerCase(),
          uid: uid,
          public_key: keys.publicKey,
          encrypted_private_key: encPrivKey,
          avatar_id: (Math.floor(Math.random() * 8) + 1).toString(),
        });

        if (profError) {
          if (profError.code === "23505" || profError.message?.toLowerCase().includes("unique")) {
            throw new Error("Username already taken. Please choose a different username.");
          }
          throw new Error(profError.message);
        }

        login({ id: authData.user.id, uid, username: username.toLowerCase(), display_name: name, avatar_id: (Math.floor(Math.random() * 8) + 1).toString(), public_key: keys.publicKey }, keys.privateKey);
      } else {
        let email = "";
        const isUID = /^\d+$/.test(identifier);

        const { data: profile, error: fetchError } = await supabase
          .from("profiles")
          .select("*")
          .filter(isUID ? "uid" : "username", "eq", identifier.toLowerCase())
          .single();

        if (fetchError || !profile) throw new Error("User not found");
        email = `${profile.username}@chatkit.io`;

        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) throw authError;

        const privKey = await decryptPrivateKey(profile.encrypted_private_key, password);
        if (!privKey) throw new Error("Incorrect password or corrupted decryption key.");

        login(profile, privKey);
      }
      
      router.push("/chats");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] font-sans selection:bg-emerald-500/30 overflow-x-hidden p-6 antialiased">
      {/* High-End Background Ambience & Radiance */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-25%] left-[-10%] w-[80%] h-[60%] bg-emerald-950/10 rounded-full blur-[200px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-zinc-900/30 rounded-full blur-[180px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
      </div>

      <div className="relative z-10 w-full max-w-sm flex flex-col gap-12">
        {/* Professional Minimalist Branding */}
        <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-top-6 duration-1000">
          <div className="relative w-20 h-20 bg-zinc-900/80 rounded-[32px] flex items-center justify-center border border-white/5 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.8)] mb-8 transform transition-transform duration-500 hover:scale-105">
            <div className="absolute inset-0 bg-emerald-500/10 blur-2xl rounded-full" />
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-emerald-500 relative z-10"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <h1 className="text-5xl font-black text-white tracking-[-0.06em] mb-3 drop-shadow-2xl">
            Chat<span className="text-emerald-500">Kit</span>
          </h1>
          <p className="text-zinc-400 text-[15px] font-semibold tracking-tight max-w-[220px] leading-snug">
            Precision Secure Messenger <span className="text-zinc-600 font-medium">for private networks.</span>
          </p>
        </div>

        {/* Global Professional Card - Perfection Fit */}
        <div className="relative">
          <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-[40px] rounded-[40px] border border-white/[0.08] shadow-[0_48px_96px_-24px_rgba(0,0,0,0.9)]" />
          
          <div className="relative p-10 flex flex-col animate-in slide-in-from-bottom-12 duration-1000">
            {/* High-End Mode Switcher */}
            <div className="flex bg-black/50 p-1 rounded-2xl border border-white/5 mb-12 self-center w-full shadow-inner">
              <button 
                onClick={() => setMode("login")} 
                className={`flex-1 py-3 rounded-xl text-[12px] font-black tracking-[0.16em] transition-all duration-500 ${
                  mode === "login" 
                    ? "bg-zinc-800 text-white shadow-xl border border-white/10" 
                    : "text-zinc-600 hover:text-zinc-400"
                }`}
              >
                SIGN IN
              </button>
              <button 
                onClick={() => setMode("register")} 
                className={`flex-1 py-3 rounded-xl text-[12px] font-black tracking-[0.16em] transition-all duration-500 ${
                  mode === "register" 
                    ? "bg-emerald-600 text-white shadow-xl shadow-emerald-500/20 border border-emerald-400/20" 
                    : "text-zinc-600 hover:text-zinc-400"
                }`}
              >
                JOIN
              </button>
            </div>

            <div className="space-y-12">
              {error && (
                <div className="bg-red-500/10 text-red-400 text-[13px] font-bold py-4 px-5 rounded-2xl border border-red-500/20 flex items-center gap-3 animate-in shake duration-500">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {error}
                </div>
              )}

              <div className="space-y-8">
                {mode === "login" ? (
                  <>
                    <Field label="UID / USERNAME" value={identifier} onChange={setIdentifier} placeholder="protocol_id" />
                    <Field label="PASSWORD" value={password} onChange={setPassword} placeholder="••••••••" password />
                  </>
                ) : (
                  <>
                    <Field label="DISPLAY NAME" value={name} onChange={setName} placeholder="Your name" />
                    <Field label="SECURE ID" value={username} onChange={v => setUsername(v.toLowerCase().replace(/[^a-z0-9_]/g, ""))} placeholder="username" />
                    <Field label="PASSWORD" value={password} onChange={setPassword} placeholder="Strong passphrase" password />
                  </>
                )}
              </div>

              <button 
                disabled={!valid || loading} 
                onClick={handleAuth}
                className={`group relative w-full h-16 rounded-[24px] text-[17px] font-black tracking-tight transition-all duration-500 overflow-hidden active:scale-[0.98] mt-4 shadow-2xl ${
                  valid 
                    ? loading ? "bg-emerald-700" : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20 border border-emerald-400/20" 
                    : "bg-zinc-800/40 text-zinc-600 cursor-not-allowed border border-white/5"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-[3px] border-white/20 border-t-white rounded-full animate-spin" />
                    <span className="opacity-70 font-black tracking-widest text-[11px] uppercase">Encrypting...</span>
                  </div>
                ) : (
                  <>
                    <span className="relative z-10">{mode === 'login' ? 'Proceed Securely' : 'Generate Network ID'}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  </>
                )}
              </button>

              <div className="pt-6 space-y-12">
                <p className="text-center text-zinc-500 text-[14px] font-semibold tracking-tight leading-none">
                  {mode === "login" ? "New protocol? " : "Protected already? "}
                  <button 
                    onClick={() => { setMode(mode === "login" ? "register" : "login"); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                    className="text-emerald-500 font-black hover:text-white transition-all underline decoration-emerald-500/20 underline-offset-[6px] ml-1"
                  >
                    {mode === "login" ? "Join the network" : "Sign in now"}
                  </button>
                </p>
                
                <div className="flex items-center gap-4 px-6 py-5 bg-black/40 border border-white/[0.03] rounded-[28px] shadow-inner mb-2">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-500"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                  <p className="text-[11px] text-zinc-500 text-left font-bold italic leading-relaxed tracking-tight flex-1">
                    <span className="text-emerald-500 not-italic">E2E Privacy:</span> Your passphrase is never sent to our servers. All encryption is local.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, password }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; password?: boolean }) {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);
  
  return (
    <div className="space-y-3">
      <label className={`block text-[11px] font-black tracking-[0.24em] pl-2 transition-all duration-500 ${focused ? "text-emerald-500" : "text-zinc-500"}`}>
        {label}
      </label>
      <div className="relative group">
        <input 
          type={password && !show ? "password" : "text"} 
          value={value} 
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={e => onChange(e.target.value)} 
          placeholder={placeholder}
          className="w-full h-15 bg-black/40 text-white placeholder:text-zinc-800 text-[16px] font-medium px-6 rounded-[22px] border border-white/5 focus:border-emerald-500/30 focus:bg-zinc-950 transition-all outline-none shadow-inner"
        />
        {password && (
          <button 
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-5 top-1/2 -translate-y-1/2 p-2 text-zinc-700 hover:text-emerald-500 active:scale-90 transition-all"
          >
            {show ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
