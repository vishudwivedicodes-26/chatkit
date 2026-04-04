"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function SplashPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();
  const [showSplash, setShowSplash] = useState(true);

  // Simulate splash screen delay and auth check
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      // Wait for splash fade out animation
      setTimeout(() => {
        if (!isLoading) {
          if (isAuthenticated) {
            router.push("/chats");
          } else {
            router.push("/welcome");
          }
        }
      }, 300);
    }, 2000); // 2 second splash

    return () => clearTimeout(timer);
  }, [isAuthenticated, isLoading, router]);

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-[#111B21] flex flex-col items-center justify-center z-50"
        >
          {/* Logo Container */}
          <div className="flex-1 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative w-20 h-20 bg-[#00A884] rounded-2xl flex items-center justify-center shadow-lg shadow-[#00A884]/20"
            >
              <MessageCircle className="w-12 h-12 text-white" />
            </motion.div>
          </div>

          {/* Footer Text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="pb-10 flex flex-col items-center"
          >
            <span className="text-[#8696A0] text-xs font-normal">from</span>
            <span className="text-[#8696A0] text-sm font-medium uppercase tracking-widest mt-1">
              DeepMind
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
