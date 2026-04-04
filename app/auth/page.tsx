"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { supabase } from "@/lib/supabase";
import { encryptPrivateKey, generateKeyPair } from "@/lib/crypto";

import { AvatarSelector } from "@/components/AvatarSelector";

export default function AuthPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  
  const [isLogin, setIsLogin] = useState(true);
  const [uid, setUid] = useState("");
  const [password, setPassword] = useState("");
  
  // Registration fields
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [avatarId, setAvatarId] = useState("anim1");
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleNext = async () => {
    setError("");
    if (!uid && isLogin) return;
    if (!username && !isLogin) return;
    
    setIsLoading(true);

    if (isLogin) {
      try {
        const virtualEmail = `${uid.toLowerCase()}@ciphertalk.local`;
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email: virtualEmail,
          password: password,
        });

        if (error) throw error;
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (profile) {
          login(profile, "fake_decrypted_key_for_now");
          router.push("/chats");
        }
      } catch (err: any) {
        setError(err.message || "Failed to login");
      }
    } else {
      try {
        const generatedUid = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        const virtualEmail = `${generatedUid}@ciphertalk.local`;
        
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: virtualEmail,
          password: password,
        });
        
        if (signUpError) throw signUpError;
        if (!data.user) throw new Error("Registration failed");

        const { publicKey, privateKey } = generateKeyPair();
        const encryptedPrivKey = await encryptPrivateKey(privateKey, password);
        
        const { error: profileError } = await supabase.from('profiles').insert([
          {
            id: data.user.id,
            display_name: displayName,
            username: username,
            uid: generatedUid,
            avatar_id: avatarId,
            public_key: publicKey,
          }
        ]);

        login({
          id: data.user.id,
          uid: generatedUid,
          username,
          display_name: displayName,
          avatar_id: avatarId
        }, privateKey);
        
        router.push("/chats");
      } catch (err: any) {
        setError(err.message || "Failed to register");
      }
    }
    
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#111B21]">
      <AvatarSelector 
        isOpen={showAvatarSelector} 
        onClose={() => setShowAvatarSelector(false)} 
        onSelect={setAvatarId} 
      />
      {/* Top Bar */}
      <div className="h-[56px] w-full bg-[#1F2C34] flex items-center px-4 relative">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <span className="text-white text-[20px] font-semibold flex-1 text-center pr-8">
          {isLogin ? "Enter your UID" : "Create Account"}
        </span>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center px-6 pt-6">
        
        {/* Toggle Login/Reg */}
        <div className="flex w-full justify-center mb-8 gap-4">
           <button 
             onClick={() => setIsLogin(true)}
             className={`text-sm pb-1 border-b-2 transition-colors ${isLogin ? "border-[#00A884] text-[#00A884]" : "border-transparent text-[#8696A0]"}`}
           >
             Login
           </button>
           <button 
             onClick={() => setIsLogin(false)}
             className={`text-sm pb-1 border-b-2 transition-colors ${!isLogin ? "border-[#00A884] text-[#00A884]" : "border-transparent text-[#8696A0]"}`}
           >
             Register
           </button>
        </div>

        {isLogin ? (
          <>
            {/* The "Global Node" Row (Mimicking the Country row styling) */}
            <div className="w-full max-w-sm flex items-center justify-center border-b border-[#2A3942] py-3 cursor-pointer">
              <span className="text-[17px] text-[#E9EDEF]">🌍 Global Anonymous Node</span>
            </div>

            {/* Input Row */}
            <div className="w-full max-w-sm mt-4 flex">
              <input 
                type="text" 
                placeholder="UID (10-digit number)"
                value={uid}
                onChange={(e) => setUid(e.target.value.replace(/[^0-9]/g, ''))}
                maxLength={10}
                className="w-full border-b border-[#00A884] bg-transparent text-[20px] text-[#E9EDEF] placeholder:text-[#8696A0] py-1 text-center transition-all focus:border-b-2"
              />
            </div>
          </>
        ) : (
          <div className="w-full max-w-sm flex flex-col items-center gap-6 mt-4">
             {/* Avatar Picker Trigger */}
             <div 
               onClick={() => setShowAvatarSelector(true)}
               className="w-20 h-20 rounded-full bg-[#2A3942] border-2 border-[#00A884] flex items-center justify-center cursor-pointer shadow-lg hover:bg-[#32454e] transition-colors overflow-hidden"
             >
                {/* Dummy placeholder for chosen avatar, could query actual color later */}
                <span className="text-[#8696A0] text-[12px] text-center px-2">Tap to change</span>
             </div>

             <input 
                type="text" 
                placeholder="Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full border-b border-[#2A3942] focus:border-[#00A884] bg-transparent text-[16px] text-[#E9EDEF] placeholder:text-[#8696A0] py-2 transition-all focus:border-b-2"
              />
              <input 
                type="text" 
                placeholder="Unique Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border-b border-[#2A3942] focus:border-[#00A884] bg-transparent text-[16px] text-[#E9EDEF] placeholder:text-[#8696A0] py-2 transition-all focus:border-b-2"
              />
          </div>
        )}

        {/* Password */}
        <div className="w-full max-w-sm mt-6 flex">
          <input 
            type="password" 
            placeholder="Secure Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-b border-[#2A3942] focus:border-[#00A884] bg-transparent text-[16px] text-[#E9EDEF] placeholder:text-[#8696A0] py-2 transition-all focus:border-b-2 text-center"
          />
        </div>

        {error && (
          <p className="text-red-400 mt-4 text-xs">{error}</p>
        )}

        <p className="text-[#8696A0] text-[13px] text-center mt-6 px-4 max-w-sm">
          {isLogin 
            ? "CipherTalk will verify your UID and derive your encryption keys from your password." 
            : "Your password encrypts your keys locally. Keep it safe—if lost, it cannot be recovered."}
        </p>

        {/* Bottom Button */}
        <div className="mt-auto mb-10 w-full max-w-xs flex justify-center">
          <button 
            disabled={isLoading || (!isLogin ? (!username || !password || !displayName) : (!uid || !password))}
            onClick={handleNext}
            className={`w-[120px] h-[40px] rounded-full text-white text-[14px] font-semibold flex items-center justify-center transition-all ${
              (!isLogin ? (!username || !password || !displayName) : (!uid || !password))
                ? "bg-[#2A3942] text-[#8696A0]" 
                : "bg-[#00A884] hover:bg-[#008f6f]"
            }`}
          >
            {isLoading ? "Wait..." : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
