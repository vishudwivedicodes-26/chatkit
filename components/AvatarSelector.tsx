"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

// Dummy avatars data representing CSS animated components or SVGs
const AVATAR_CATEGORIES = ["Animals", "Characters", "Abstract", "Sci-Fi", "Fantasy"];

const AVATARS = [
  { id: "anim1", cat: "Animals", color: "#FF7B72" },
  { id: "anim2", cat: "Animals", color: "#FFD55F" },
  { id: "char1", cat: "Characters", color: "#79C0FF" },
  { id: "char2", cat: "Characters", color: "#D2A8FF" },
  { id: "abs1", cat: "Abstract", color: "#53BDEB" },
  { id: "abs2", cat: "Abstract", color: "#00A884" },
  { id: "sci1", cat: "Sci-Fi", color: "#7B61FF" },
  { id: "fan1", cat: "Fantasy", color: "#FF7B72" },
];

export function AvatarSelector({ 
  isOpen, 
  onClose, 
  onSelect 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onSelect: (id: string) => void;
}) {
  const [activeCategory, setActiveCategory] = useState("Animals");

  if (!isOpen) return null;

  const filteredAvatars = AVATARS.filter(a => a.cat === activeCategory);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#0B141A]/90 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", bounce: 0.25 }}
          className="relative w-full max-w-md bg-[#1F2C34] rounded-[24px] border border-[#2A3942] shadow-2xl p-6 overflow-hidden flex flex-col max-h-[80vh]"
        >
          <div className="flex justify-between items-center mb-6 shrink-0">
             <h2 className="text-white text-xl font-semibold">Choose Avatar</h2>
             <button onClick={onClose} className="p-2 bg-[#2A3942] rounded-full text-[#8696A0] hover:text-white transition-colors">
               <X className="w-5 h-5" />
             </button>
          </div>

          {/* Categories */}
          <div className="flex space-x-2 overflow-x-auto custom-scrollbar pb-2 mb-4 shrink-0 no-select">
            {AVATAR_CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={clsx(
                  "px-4 py-2 rounded-full whitespace-nowrap text-[14px] font-medium transition-colors",
                  activeCategory === cat ? "bg-[#00A884] text-white" : "bg-[#2A3942] text-[#8696A0] hover:bg-[#32454e]"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Avatar Grid (Drag to scroll feel) */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-3 gap-4 pb-4">
              {filteredAvatars.map((av) => (
                <motion.div 
                  key={av.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onSelect(av.id);
                    onClose();
                  }}
                  className="aspect-square rounded-[20px] bg-[#111B21] flex items-center justify-center cursor-pointer border-2 border-transparent hover:border-[#00A884]/50 transition-colors"
                >
                  {/* Conceptual animated avatar placeholder */}
                  <motion.div 
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="w-16 h-16 rounded-full"
                    style={{ backgroundColor: av.color }}
                  />
                </motion.div>
              ))}
            </div>
            {filteredAvatars.length === 0 && (
              <div className="text-center text-[#8696A0] py-10">No avatars found in this category.</div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
