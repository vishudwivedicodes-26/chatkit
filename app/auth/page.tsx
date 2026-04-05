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
    <div className="fixed inset-0 flex flex-col bg-[#008069] font-sans">
      {/* status bar / top nav */}
      <div className="h-16 flex items-center justify-between px-6 pt-2">
        <button onClick={() => router.back()} className="p-2 -ml-2 rounded-xl hover:bg-white/10 transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div className="flex gap-8">
          <button onClick={() => setMode("login")} className={`text-[15px] font-bold tracking-wider relative py-2 transition-colors ${mode === "login" ? "text-white" : "text-white/50"}`}>
            LOGIN
            {mode === "login" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />}
          </button>
          <button onClick={() => setMode("register")} className={`text-[15px] font-bold tracking-wider relative py-2 transition-colors ${mode === "register" ? "text-white" : "text-white/50"}`}>
            REGISTER
            {mode === "register" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />}
          </button>
        </div>
        <div className="w-8" />
      </div>

      {/* branding section */}
      <div className="flex-1 flex flex-col items-center justify-center -mt-8 px-8 text-center pb-8 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-white/15 rounded-[24px] flex items-center justify-center mb-6 backdrop-blur-md shadow-2xl border border-white/10 ring-1 ring-white/5">
          <svg width="42" height="42" viewBox="0 0 24 24" fill="white" className="filter drop-shadow-sm"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
        </div>
        <h1 className="text-[42px] font-[900] text-white leading-none tracking-tight mb-3">ChatKit</h1>
        <p className="text-white/80 text-[16px] font-medium leading-tight max-w-[220px]">
          Private & encrypted messaging for everyone
        </p>
      </div>

      {/* form card */}
      <div className="bg-[#ffffff] rounded-t-[44px] shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.3)] px-8 pt-10 pb-12 flex flex-col animate-in slide-in-from-bottom-full duration-500">
        <div className="w-full max-w-sm mx-auto space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 text-[13px] font-medium py-3.5 px-4 rounded-2xl border border-red-100 flex items-center gap-3 animate-in shake duration-500">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          {mode === "login" ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <Field label="UID OR USERNAME" value={identifier} onChange={setIdentifier} placeholder="Your unique id / username" />
              <Field label="PASSWORD" value={password} onChange={setPassword} placeholder="Enter your password" password />
            </div>
          ) : (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <Field label="FULL NAME" value={name} onChange={setName} placeholder="Your name (visible to others)" />
              <Field label="USERNAME" value={username} onChange={v => setUsername(v.toLowerCase().replace(/[^a-z0-9_]/g, ""))} placeholder="unique_username" />
              <Field label="PASSWORD" value={password} onChange={setPassword} placeholder="Enter your password" password />
            </div>
          )}

          <div className="flex items-center gap-3.5 p-4.5 bg-[#f0faf8] rounded-2xl border border-[#e2f3f0]">
            <div className="shrink-0 w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm border border-[#00a884]/10">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00a884" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <p className="text-[12.5px] text-[#006e56] leading-snug font-semibold">
              End-to-end encrypted — ChatKit servers never see your plaintext messages.
            </p>
          </div>

          <button 
            disabled={!valid || loading} 
            onClick={handleAuth}
            className={`w-full h-15 rounded-[22px] text-[16.5px] font-black tracking-tight transition-all duration-300 shadow-xl shadow-emerald-500/15 ${
              valid 
                ? "bg-[#00a884] text-white hover:bg-[#00c096] active:scale-[0.97] active:shadow-md" 
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
                <span className="opacity-90">Security Processing...</span>
              </div>
            ) : "Continue"}
          </button>

          <div className="text-center pt-2">
            <button className="text-[#00a884] text-[14px] font-bold hover:underline transition-all">
              Forgot password?
            </button>
            <div className="mt-5 flex items-center justify-center gap-3">
              <div className="h-px flex-1 bg-gray-100" />
              <span className="text-gray-300 text-[10px] font-[900] tracking-[2px] uppercase">OR</span>
              <div className="h-px flex-1 bg-gray-100" />
            </div>
            <p className="mt-5 text-gray-500 text-[14.5px] font-semibold">
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => setMode(mode === "login" ? "register" : "login")} className="text-[#00a884] font-[800] hover:underline cursor-pointer">
                {mode === "login" ? "Register" : "Login"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, password }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; password?: boolean }) {
  const [show, setShow] = useState(false);
  
  return (
    <div className="space-y-2">
      <label className="block text-[#00a884] text-[11px] font-[800] tracking-[1.5px] pl-1.5 opacity-90 leading-none">
        {label}
      </label>
      <div className="relative group">
        <input 
          type={password && !show ? "password" : "text"} 
          value={value} 
          onChange={e => onChange(e.target.value)} 
          placeholder={placeholder}
          className="w-full h-14 bg-[#1f1f1f]/[0.03] text-[#1a1a1a] placeholder:text-gray-400 text-[16px] font-medium px-5 rounded-[20px] border-2 border-[#f0f0f0] focus:border-[#00a884] focus:bg-white transition-all outline-none shadow-sm"
        />
        {password && (
          <button 
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-4.5 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-[#00a884] transition-colors"
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
