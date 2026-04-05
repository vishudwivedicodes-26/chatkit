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
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] font-sans selection:bg-emerald-500/30 overflow-x-hidden p-6">
      {/* Sophisticated Glow Particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-15%] left-[10%] w-[60%] h-[40%] bg-emerald-900/10 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-zinc-800/20 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm flex flex-col gap-10">
        {/* Simplified Branding */}
        <div className="flex flex-col items-center text-center animate-in fade-in duration-1000">
          <div className="relative w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center border border-white/5 shadow-2xl mb-6">
            <div className="absolute inset-0 bg-emerald-500/10 blur-xl rounded-full" />
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tighter mb-2">
            Chat<span className="text-emerald-500">Kit</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium tracking-tight">
            Encrypted & Secure Messenger
          </p>
        </div>

        {/* Auth Card - Centered Professional Look */}
        <div className="relative">
          <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-3xl rounded-[32px] border border-white/10 shadow-2xl" />
          
          <div className="relative p-8 flex flex-col animate-in slide-in-from-bottom-8 duration-700">
            {/* Mode Toggle - Professional Pill */}
            <div className="flex bg-zinc-950 p-1 rounded-2xl border border-white/5 mb-10 self-center max-w-fit">
              <button 
                onClick={() => setMode("login")} 
                className={`px-6 py-2.5 rounded-[14px] text-[12px] font-bold tracking-[1.5px] transition-all duration-300 ${
                  mode === "login" 
                    ? "bg-zinc-800 text-white border border-white/10 shadow-sm" 
                    : "text-zinc-600 hover:text-zinc-400"
                }`}
              >
                LOGIN
              </button>
              <button 
                onClick={() => setMode("register")} 
                className={`px-6 py-2.5 rounded-[14px] text-[12px] font-bold tracking-[1.5px] transition-all duration-300 ${
                  mode === "register" 
                    ? "bg-emerald-600 text-white border border-white/10 shadow-sm" 
                    : "text-zinc-600 hover:text-zinc-400"
                }`}
              >
                JOIN
              </button>
            </div>

            <div className="space-y-8">
              {error && (
                <div className="bg-red-500/10 text-red-400 text-[12px] font-bold py-3.5 px-4 rounded-2xl border border-red-500/20 flex items-center gap-3 animate-in shake duration-500">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {error}
                </div>
              )}

              <div className="space-y-5">
                {mode === "login" ? (
                  <>
                    <Field label="UID / USERNAME" value={identifier} onChange={setIdentifier} placeholder="username" />
                    <Field label="PASSWORD" value={password} onChange={setPassword} placeholder="••••••••" password />
                  </>
                ) : (
                  <>
                    <Field label="DISPLAY NAME" value={name} onChange={setName} placeholder="Your name" />
                    <Field label="SECURE ID" value={username} onChange={v => setUsername(v.toLowerCase().replace(/[^a-z0-9_]/g, ""))} placeholder="username" />
                    <Field label="PASSWORD" value={password} onChange={setPassword} placeholder="Create password" password />
                  </>
                )}
              </div>

              <button 
                disabled={!valid || loading} 
                onClick={handleAuth}
                className={`group relative w-full h-14 rounded-2xl text-[15px] font-bold tracking-tight transition-all duration-300 overflow-hidden active:scale-[0.98] mt-2 ${
                  valid 
                    ? loading ? "bg-emerald-700" : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-500/10 border border-emerald-400/20" 
                    : "bg-zinc-900 text-zinc-600 cursor-not-allowed border border-white/5"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span className="opacity-70 font-semibold tracking-wide text-[12px]">Processing...</span>
                  </div>
                ) : (
                  mode === 'login' ? 'Login Securely' : 'Create Network ID'
                )}
              </button>

              <div className="pt-2">
                <p className="text-center text-zinc-600 text-[13px] font-medium">
                  {mode === "login" ? "New around here? " : "Already have an ID? "}
                  <button 
                    onClick={() => { setMode(mode === "login" ? "register" : "login"); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                    className="text-emerald-500 font-bold hover:text-emerald-400 underline-offset-4 decoration-emerald-800 decoration-2 transition-all"
                  >
                    {mode === "login" ? "Join now" : "Sign in"}
                  </button>
                </p>
                
                <div className="mt-8 flex items-center gap-4 px-5 py-4 bg-zinc-950 border border-white/5 rounded-2xl">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                  <p className="text-[11px] text-zinc-600 text-left font-medium leading-relaxed tracking-tight">
                    <span className="text-emerald-500 font-bold">End-to-End Privacy:</span> Your password generates a key locally that encrypts your messages.
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
    <div className="space-y-2">
      <label className={`block text-[10px] font-bold tracking-[2.5px] pl-1 transition-all duration-300 ${focused ? "text-emerald-500" : "text-zinc-600"}`}>
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
          className="w-full h-13 bg-zinc-950 text-white placeholder:text-zinc-800 text-[15px] font-medium px-4 rounded-xl border border-white/10 focus:border-emerald-500/50 focus:bg-zinc-900/50 transition-all outline-none"
        />
        {password && (
          <button 
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-zinc-700 hover:text-emerald-500 transition-colors"
          >
            {show ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
