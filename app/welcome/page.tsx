"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-[#111B21] items-center justify-between py-10">
      {/* Top Indicators */}
      <div className="flex items-center space-x-[6px] mt-4">
        <div className="w-2 h-2 bg-white rounded-full"></div>
        <div className="w-1.5 h-1.5 bg-[#8696A0] rounded-full"></div>
        <div className="w-1.5 h-1.5 bg-[#8696A0] rounded-full"></div>
      </div>

      {/* Center Illustration & Copy */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center flex-1 justify-center w-full max-w-md px-10"
      >
        <div className="relative w-64 h-64 mb-10 flex items-center justify-center">
          {/* Animated circles behind lock */}
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="absolute rounded-full w-48 h-48 border-2 border-[#00A884]/30"
          />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }}
            className="absolute rounded-full w-64 h-64 border border-[#00A884]/20"
          />
          <ShieldCheck className="w-24 h-24 text-[#00A884] relative z-10" />
        </div>

        <h1 className="text-white text-2xl font-bold mb-4">Welcome to CipherTalk</h1>
        
        <p className="text-[#8696A0] text-[14px] text-center leading-relaxed">
          Read our <span className="text-[#53BDEB] underline cursor-pointer">Privacy Policy</span>. Tap &quot;Agree and continue&quot; to accept the <span className="text-[#53BDEB] underline cursor-pointer">Terms of Service</span>.
        </p>
      </motion.div>

      {/* Bottom Button */}
      <div className="w-full max-w-md px-6">
        <button 
          onClick={() => router.push("/auth")}
          className="w-full h-[52px] rounded-full bg-[#00A884] text-white text-[16px] font-semibold flex items-center justify-center hover:bg-[#008f6f] active:scale-[0.98] transition-all no-select"
        >
          Agree and continue
        </button>
      </div>
    </div>
  );
}
