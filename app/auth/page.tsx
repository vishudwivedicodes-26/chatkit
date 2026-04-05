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
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-black font-sans selection:bg-white/20 overflow-x-hidden p-8 antialiased">
      {/* Absolute Professional Minimalist Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-black" />

      <div className="relative z-10 w-full max-w-sm flex flex-col gap-16">
        {/* Obsidian Branding */}
        <div className="flex flex-col items-center text-center animate-in fade-in duration-1000">
          <div className="relative w-20 h-20 bg-zinc-950 rounded-2xl flex items-center justify-center border border-zinc-800 shadow-sm mb-10">
            <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <h1 className="text-5xl font-bold text-white tracking-tight mb-4">
            Chat<span className="text-white/40">Kit</span>
          </h1>
          <p className="text-zinc-500 text-[16px] font-medium tracking-tight">
            Advanced Encrypted Messenger
          </p>
        </div>

        {/* Global Obsidian Card - Ultra-Polish Fit */}
        <div className="relative">
          <div className="absolute inset-0 bg-zinc-950 rounded-3xl border border-zinc-800 shadow-2xl" />
          
          <div className="relative p-10 flex flex-col animate-in fade-in duration-1000">
            {/* Minimalist Grid Toggle */}
            <div className="flex border border-zinc-800 p-1 rounded-xl mb-12 self-stretch bg-black">
              <button 
                onClick={() => setMode("login")} 
                className={`flex-1 py-3.5 rounded-lg text-[11px] font-bold tracking-[0.2em] transition-colors duration-300 ${
                  mode === "login" 
                    ? "bg-zinc-800 text-white" 
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                SIGN IN
              </button>
              <button 
                onClick={() => setMode("register")} 
                className={`flex-1 py-3.5 rounded-lg text-[11px] font-bold tracking-[0.2em] transition-colors duration-300 ${
                  mode === "register" 
                    ? "bg-zinc-800 text-white" 
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                JOIN
              </button>
            </div>

            <div className="space-y-12">
              {error && (
                <div className="bg-red-500/5 text-red-500 text-[13px] font-bold py-4 px-5 rounded-xl border border-red-500/20 flex items-center gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {error}
                </div>
              )}

              <div className="space-y-8">
                {mode === "login" ? (
                  <>
                    <Field label="PROTOCOL ID" value={identifier} onChange={setIdentifier} placeholder="Username" />
                    <Field label="PASSPHRASE" value={password} onChange={setPassword} placeholder="••••••••" password />
                  </>
                ) : (
                  <>
                    <Field label="DISPLAY NAME" value={name} onChange={setName} placeholder="Your name" />
                    <Field label="NETWORK ID" value={username} onChange={v => setUsername(v.toLowerCase().replace(/[^a-z0-9_]/g, ""))} placeholder="username" />
                    <Field label="PASSWORD" value={password} onChange={setPassword} placeholder="Secret key" password />
                  </>
                )}
              </div>

              <button 
                disabled={!valid || loading} 
                onClick={handleAuth}
              className={`group relative w-full h-16 rounded-xl text-[16px] font-bold tracking-tight transition-all duration-300 active:scale-[0.99] mt-4 ${
                  valid 
                    ? loading ? "bg-zinc-200" : "bg-white text-black hover:bg-zinc-100 shadow-xl" 
                    : "bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-800"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3 text-black">
                    <div className="w-5 h-5 border-[3px] border-black/10 border-t-black rounded-full animate-spin" />
                    <span className="font-bold tracking-widest text-[11px] uppercase">Processing</span>
                  </div>
                ) : (
                  mode === 'login' ? 'Proceed' : 'Create Network ID'
                )}
              </button>

              <div className="pt-8 space-y-12">
                <p className="text-center text-zinc-600 text-[14px] font-medium tracking-tight">
                  {mode === "login" ? "Not encrypted yet? " : "Key already exists? "}
                  <button 
                    onClick={() => { setMode(mode === "login" ? "register" : "login"); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                    className="text-white font-bold hover:underline transition-all ml-1"
                  >
                    {mode === "login" ? "Join the network" : "Sign in now"}
                  </button>
                </p>
                
                <div className="flex items-start gap-4 px-2 py-4 border-t border-zinc-900 mt-2">
                  <div className="flex-shrink-0 w-6 h-6 rounded bg-zinc-950 border border-zinc-900 flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-500"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                  <p className="text-[12px] text-zinc-600 text-left font-medium leading-relaxed tracking-tight flex-1">
                    <span className="text-zinc-400 font-bold">Encrypted Locally: </span>Your passphrase generates a private key that never leaves your device.
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
      <label className={`block text-[10px] font-bold tracking-[0.24em] pl-1 transition-all duration-300 ${focused ? "text-white" : "text-zinc-600"}`}>
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
          className="w-full h-14 bg-transparent text-white placeholder:text-zinc-800 text-[16px] font-medium px-5 rounded-xl border border-zinc-800 focus:border-white transition-all outline-none"
        />
        {password && (
          <button 
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-5 top-1/2 -translate-y-1/2 p-2 text-zinc-700 hover:text-white active:scale-95 transition-all"
          >
            {show ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
