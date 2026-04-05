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
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#f3f4f6] font-sans selection:bg-emerald-100 p-6 antialiased">
      <div className="relative z-10 w-full max-w-[420px] flex flex-col gap-12 py-8 animate-in fade-in duration-700">
        
        {/* Soft Light Card Architecture */}
        <div className="relative w-full">
          <div className="absolute inset-0 bg-white rounded-[40px] border border-zinc-200 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]" />
          
          <div className="relative p-10 flex flex-col items-center gap-10">
            {/* Soft Branding Header */}
            <div className="flex flex-col items-center text-center gap-6">
              <div className="w-16 h-16 bg-[#ecfdf5] rounded-3xl flex items-center justify-center border border-[#d1fae5] shadow-sm">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-500"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">ChatKit</h1>
                <p className="text-[#9ca3af] text-[10px] font-bold tracking-[0.2em] uppercase">Advanced Encrypted Messenger</p>
              </div>
            </div>

            {/* Pill Switcher */}
            <div className="flex bg-[#f9fafb] p-1 rounded-2xl border border-zinc-200 w-full shadow-inner">
              <button 
                onClick={() => setMode("login")} 
                className={`flex-1 py-3 rounded-xl text-[12px] font-bold tracking-tight transition-all duration-300 ${
                  mode === "login" 
                    ? "bg-white text-zinc-900 shadow-sm border border-zinc-200" 
                    : "text-zinc-400 hover:text-zinc-600"
                }`}
              >
                Sign in
              </button>
              <button 
                onClick={() => setMode("register")} 
                className={`flex-1 py-3 rounded-xl text-[12px] font-bold tracking-tight transition-all duration-300 ${
                  mode === "register" 
                    ? "bg-white text-zinc-900 shadow-sm border border-zinc-200" 
                    : "text-zinc-400 hover:text-zinc-600"
                }`}
              >
                Register
              </button>
            </div>

            <div className="w-full flex flex-col gap-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
                  {mode === 'login' ? 'Welcome back' : 'Join the network'}
                </h2>
                <p className="text-zinc-500 text-[14px] font-medium leading-tight">
                  {mode === 'login' ? 'Sign in to your ChatKit account.' : 'Create your secure profile on the network.'}
                </p>
              </div>

              {error && (
                <div className="bg-red-50 text-red-500 text-[13px] font-bold py-4 px-5 rounded-2xl border border-red-100 flex items-center gap-4">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-6">
                {mode === "login" ? (
                  <>
                    <Field label="Username" value={identifier} onChange={setIdentifier} placeholder="Enter your username" />
                    <div className="space-y-2">
                      <Field label="Password" value={password} onChange={setPassword} placeholder="Enter your password" password />
                      <div className="flex justify-end">
                        <button className="text-[12px] font-bold text-emerald-500 hover:text-emerald-600 transition-colors">Forgot password?</button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <Field label="Display Name" value={name} onChange={setName} placeholder="Your name" />
                    <Field label="Network ID" value={username} onChange={v => setUsername(v.toLowerCase().replace(/[^a-z0-9_]/g, ""))} placeholder="username" />
                    <Field label="Password" value={password} onChange={setPassword} placeholder="Secret passphrase" password />
                  </>
                )}
              </div>

              <div className="flex flex-col gap-6">
                <button 
                  disabled={!valid || loading} 
                  onClick={handleAuth}
                  className={`group relative w-full h-[60px] rounded-2xl text-[15px] font-extrabold tracking-tight transition-all duration-300 active:scale-[0.98] ${
                    valid 
                      ? loading ? "bg-emerald-700" : "bg-[#10b981] text-white shadow-lg shadow-emerald-500/20 hover:bg-[#059669]" 
                      : "bg-[#f9fafb] text-zinc-300 cursor-not-allowed border border-zinc-100"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-[3px] border-emerald-300/30 border-t-white rounded-full animate-spin" />
                      <span className="font-extrabold tracking-widest text-[11px] uppercase">Authenticating</span>
                    </div>
                  ) : (
                    mode === 'login' ? 'Sign in' : 'Create account'
                  )}
                </button>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-100" /></div>
                  <div className="relative flex justify-center text-[12px] uppercase"><span className="bg-white px-2 text-zinc-300 font-bold tracking-widest">or</span></div>
                </div>

                <p className="text-center text-zinc-500 text-[13px] font-medium tracking-tight">
                  {mode === "login" ? "Don't have an account? " : "Key already exists? "}
                  <button 
                    onClick={() => { setMode(mode === "login" ? "register" : "login"); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                    className="text-emerald-500 font-bold hover:text-emerald-600 transition-all ml-1"
                  >
                    {mode === "login" ? "Create account" : "Sign in now"}
                  </button>
                </p>
              </div>

              <div className="flex items-start gap-4 p-5 bg-[#ecfdf5] border border-[#d1fae5] rounded-[24px] mt-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-white border border-[#d1fae5] flex items-center justify-center shadow-sm">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-500"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <p className="text-[12px] text-[#047857] text-left font-semibold leading-relaxed tracking-tight flex-1">
                  <span className="text-emerald-600 font-extrabold">End-to-end encrypted</span> — your password generates a private key that never leaves your device.
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
    <div className="flex flex-col gap-2.5">
      <label className={`block text-[13px] font-bold transition-all duration-300 ${focused ? "text-zinc-900" : "text-zinc-600"}`}>
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
          className="w-full h-[56px] bg-[#2d2d2d] text-white placeholder:text-zinc-500 text-[15px] font-medium px-5 rounded-xl border border-transparent focus:border-emerald-500 transition-all outline-none"
        />
        {password && (
          <button 
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-zinc-500 hover:text-white active:scale-95 transition-all"
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
