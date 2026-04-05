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
    <div className="fixed inset-0 flex flex-col bg-[#011612] overflow-hidden font-sans selection:bg-[#00a884]/30">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00a884]/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-900/30 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-teal-800/20 rounded-full blur-[100px]" />

      {/* top nav */}
      <div className="relative h-18 flex items-center justify-between px-6 pt-2 z-20">
        <button onClick={() => router.back()} className="p-2.5 -ml-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all active:scale-95">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
          <button 
            onClick={() => setMode("login")} 
            className={`px-6 py-2.5 rounded-xl text-[13.5px] font-black tracking-[1.2px] transition-all duration-500 ${
              mode === "login" 
                ? "bg-[#00a884] text-white shadow-lg shadow-[#00a884]/20" 
                : "text-white/40 hover:text-white/60"
            }`}
          >
            LOGIN
          </button>
          <button 
            onClick={() => setMode("register")} 
            className={`px-6 py-2.5 rounded-xl text-[13.5px] font-black tracking-[1.2px] transition-all duration-500 ${
              mode === "register" 
                ? "bg-[#00a884] text-white shadow-lg shadow-[#00a884]/20" 
                : "text-white/40 hover:text-white/60"
            }`}
          >
            JOIN
          </button>
        </div>
        <div className="w-10" />
      </div>

      {/* branding section */}
      <div className="relative flex-1 flex flex-col items-center justify-center -mt-10 px-8 text-center z-10">
        <div className="relative mb-8 animate-in fade-in zoom-in-50 duration-700">
          <div className="absolute inset-0 bg-[#00a884] blur-[40px] opacity-20" />
          <div className="relative w-24 h-24 bg-gradient-to-br from-white/20 to-white/5 rounded-[32px] flex items-center justify-center backdrop-blur-xl shadow-2xl border border-white/20 ring-1 ring-white/10 transform rotate-3">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" className="transform -rotate-3"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
        </div>
        <h1 className="text-[52px] font-black text-white leading-none tracking-[-0.04em] mb-4 drop-shadow-2xl">
          ChatKit<span className="text-[#00a884]">.</span>
        </h1>
        <p className="text-white/60 text-[17px] font-medium leading-tight max-w-[260px] tracking-tight">
          Military-grade encryption for <span className="text-white">your private reality.</span>
        </p>
      </div>

      {/* form card - Glassmorphic Bottom Sheet */}
      <div className="relative z-20 overflow-hidden">
        <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-3xl border-t border-white/10 shadow-[0_-20px_80px_-20px_rgba(0,0,0,0.8)] rounded-t-[48px]" />
        
        <div className="relative px-8 pt-10 pb-12 flex flex-col animate-in slide-in-from-bottom-full duration-700 delay-100">
          {/* Handle bar for mobile feel */}
          <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8" />
          
          <div className="w-full max-w-sm mx-auto space-y-7">
            {error && (
              <div className="bg-red-500/10 text-red-400 text-[13.5px] font-bold py-4 px-5 rounded-[22px] border border-red-500/20 flex items-center gap-3 animate-in shake duration-500 backdrop-blur-md">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            <div className="space-y-6">
              {mode === "login" ? (
                <>
                  <Field label="UID / USERNAME" value={identifier} onChange={setIdentifier} placeholder="Your unique id or handle" />
                  <Field label="SECRET PASS" value={password} onChange={setPassword} placeholder="••••••••" password />
                </>
              ) : (
                <>
                  <Field label="YOUR NAME" value={name} onChange={setName} placeholder="How should we call you?" />
                  <Field label="SECURE HANDLE" value={username} onChange={v => setUsername(v.toLowerCase().replace(/[^a-z0-9_]/g, ""))} placeholder="username (no spaces)" />
                  <Field label="SECRET PASS" value={password} onChange={setPassword} placeholder="Choose a strong password" password />
                </>
              )}
            </div>

            <button 
              disabled={!valid || loading} 
              onClick={handleAuth}
              className={`group relative w-full h-16 rounded-[24px] text-[17px] font-black tracking-tight transition-all duration-500 overflow-hidden ${
                valid 
                  ? "bg-[#00a884] text-white shadow-[0_12px_24px_-8px_rgba(0,168,132,0.5)] hover:scale-[1.02] active:scale-[0.98]" 
                  : "bg-white/5 text-white/20 cursor-not-allowed border border-white/5"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-[3px] border-white/20 border-t-white rounded-full animate-spin" />
                  <span className="opacity-70 font-bold uppercase tracking-wider text-[13px]">Encrypting Auth...</span>
                </div>
              ) : (
                <>
                  <span className="relative z-10">{mode === 'login' ? 'Proceed Securely' : 'Generate Keys & Join'}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <p className="text-white/30 text-[15px] font-semibold">
                {mode === "login" ? "New around here? " : "Already protected? "}
                <button 
                  onClick={() => setMode(mode === "login" ? "register" : "login")} 
                  className="text-[#00a884] font-black hover:text-white transition-all underline decoration-2 underline-offset-4"
                >
                  {mode === "login" ? "Join the network" : "Sign in now"}
                </button>
              </p>
              
              <div className="mt-8 flex items-center gap-4 px-4 py-3.5 bg-white/[0.02] border border-white/5 rounded-2xl">
                <div className="w-8 h-8 rounded-lg bg-[#00a884]/10 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00a884" strokeWidth="2.5"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <p className="text-[11.5px] text-white/50 text-left font-medium leading-[1.4] tracking-tight">
                  <span className="text-[#00a884] font-bold">End-to-End Privacy:</span> Your password generates a local key that encrypts your private life.
                </p>
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
    <div className="space-y-2.5">
      <label className={`block text-[11px] font-black tracking-[2px] pl-5 transition-all duration-300 ${focused ? "text-[#00a884] translate-x-1" : "text-white/30"}`}>
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
          className="w-full h-15 bg-white/[0.04] text-white placeholder:text-white/10 text-[15.5px] font-semibold px-6 rounded-[22px] border-2 border-white/[0.06] focus:border-[#00a884] focus:bg-white/[0.08] transition-all outline-none shadow-inner"
        />
        {password && (
          <button 
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-5 top-1/2 -translate-y-1/2 p-2 text-white/20 hover:text-[#00a884] transition-colors"
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
