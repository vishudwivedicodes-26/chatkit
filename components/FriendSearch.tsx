"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search as SearchIcon, UserPlus, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";
import clsx from "clsx";

export function FriendSearch({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user } = useAuthStore();
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSearch = async () => {
    if (!query || query.length < 5) return;
    setIsSearching(true);
    setError("");
    setResult(null);
    setSent(false);

    try {
      const { data, error: err } = await supabase
        .from('profiles')
        .select('id, uid, display_name, avatar_id')
        .eq('uid', query.toUpperCase())
        .single();
      
      if (err || !data) {
        setError("User not found.");
      } else if (data.id === user?.id) {
        setError("You cannot add yourself.");
      } else {
        setResult(data);
        
        // Check if request already exists
        const { data: existing } = await supabase
          .from('friendships')
          .select('*')
          .or(`and(user1_id.eq.${user?.id},user2_id.eq.${data.id}),and(user1_id.eq.${data.id},user2_id.eq.${user?.id})`)
          .single();
          
        if (existing) {
          if (existing.status === 'accepted') setError("You are already friends.");
          else if (existing.status === 'pending') setError("Friend request already pending.");
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to search.");
    }
    setIsSearching(false);
  };

  const handleSendRequest = async () => {
    if (!result || !user) return;
    setIsSearching(true);
    try {
      const { error: err } = await supabase
        .from('friendships')
        .insert([{ user1_id: user.id, user2_id: result.id, status: 'pending' }]);
        
      if (err) throw err;
      setSent(true);
    } catch (err: any) {
      setError("Failed to send request.");
    }
    setIsSearching(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#0B141A]/90 backdrop-blur-sm"
        />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-sm bg-[#1F2C34] rounded-[24px] border border-[#2A3942] shadow-2xl p-6 overflow-hidden flex flex-col"
        >
          <div className="flex justify-between items-center mb-6 shrink-0">
             <h2 className="text-white text-[18px] font-semibold">Add Friend with UID</h2>
             <button onClick={onClose} className="p-2 bg-[#2A3942] rounded-full text-[#8696A0] hover:text-white transition-colors">
               <X className="w-5 h-5" />
             </button>
          </div>

          <div className="bg-[#2A3942] rounded-lg flex items-center px-3 mb-6 border border-transparent focus-within:border-[#00A884] transition-colors">
            <SearchIcon className="w-5 h-5 text-[#8696A0]" />
            <input 
              autoFocus
              type="text" 
              placeholder="Search UID (10-digit number)"
              value={query}
              onChange={(e) => setQuery(e.target.value.replace(/[^0-9]/g, ''))}
              maxLength={10}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 bg-transparent text-[#E9EDEF] p-3 outline-none text-[15px] uppercase placeholder:normal-case"
            />
            {query.length >= 10 && (
              <button onClick={handleSearch} disabled={isSearching} className="text-[#00A884] font-medium p-2">
                {isSearching ? "..." : "Find"}
              </button>
            )}
          </div>

          {error && <div className="text-center text-red-400 text-[14px] mb-4">{error}</div>}

          {result && !error && (
            <motion.div 
               initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
               className="bg-[#111B21] rounded-xl p-4 flex items-center mb-2 border border-[#2A3942]"
            >
              <div className="w-12 h-12 bg-[#2A3942] rounded-full mr-4 shrink-0 flex items-center justify-center text-[#8696A0]">
                 {result.avatar_id} {/* Replace with actual avatar viz */}
              </div>
              <div className="flex flex-col flex-1 truncate pr-2">
                 <span className="text-[#E9EDEF] text-[16px] font-medium truncate">{result.display_name}</span>
                 <span className="text-[#8696A0] text-[13px] font-mono truncate">{result.uid}</span>
              </div>
              
              <button 
                onClick={handleSendRequest}
                disabled={sent || isSearching}
                className={clsx(
                  "p-2 rounded-full flex items-center justify-center transition-colors shrink-0",
                  sent ? "bg-[#005C4B] text-[#53BDEB]" : "bg-[#00A884] hover:bg-[#008f6f] text-white",
                  isSearching && "opacity-50 cursor-not-allowed"
                )}
              >
                 {sent ? <UserPlus className="w-5 h-5" /> : <Send className="w-5 h-5" />}
              </button>
            </motion.div>
          )}

          {sent && <div className="text-center text-[#00A884] text-[13px] mt-2">Friend request sent securely.</div>}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
