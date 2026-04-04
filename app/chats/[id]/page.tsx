"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Video, Phone, MoreVertical, Smile, Paperclip, Camera, Mic, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

export default function ActiveChatPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Dummy messages
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey! Did you get the encryption working?", sender: "them", time: "10:42 AM", date: "TODAY" },
    { id: 2, text: "Yeah, fully E2E with X25519 now. Local keys intact.", sender: "me", time: "10:45 AM" },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages([...messages, { 
      id: Date.now(), 
      text: message, 
      sender: "me", 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }]);
    setMessage("");
  };

  return (
    <div className="flex flex-col h-full bg-[#0B141A] w-full relative">
      {/* Top Bar */}
      <div className="h-[56px] w-full bg-[#1F2C34] flex items-center px-4 shrink-0 z-10">
        <button className="md:hidden p-2 -ml-2 text-white mr-1" onClick={() => router.push("/chats")}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="w-9 h-9 rounded-full bg-[#2A3942] shrink-0 overflow-hidden cursor-pointer">
           {/* Avatar */}
        </div>
        <div className="flex flex-col ml-3 flex-1 cursor-pointer">
          <span className="text-[#E9EDEF] text-[16px] font-medium leading-tight">Anonymous Fox</span>
          <span className="text-[#8696A0] text-[13px] leading-tight">online</span>
        </div>
        <div className="flex space-x-4 text-white shrink-0 ml-4">
          <Video className="w-6 h-6 cursor-pointer" />
          <Phone className="w-5 h-5 cursor-pointer ml-1" />
          <MoreVertical className="w-5 h-5 cursor-pointer" />
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-[5%] py-4 pb-20 custom-scrollbar chat-bg-pattern flex flex-col relative no-select">
        
        {/* Anti-Screenshot Overlay (Conceptual/CSS-based) */}
        <div className="absolute inset-0 pointer-events-none z-50 mix-blend-overlay opacity-0 group-hover:opacity-100" />
        
        {/* 15 Hour Purge Timer Notice */}
        <div className="flex justify-center mb-6">
          <div className="bg-[#1F2C34] rounded-lg px-4 py-2 text-center max-w-sm shadow-sm border border-[#2A3942]/50">
            <p className="text-[#8696A0] text-[12px] flex flex-col items-center">
              <span className="text-yellow-500/80 mb-1">🔒 End-to-end encrypted</span>
              Messages in this chat will auto-delete 15 hours after sending unless permanently saved.
            </p>
          </div>
        </div>

        {/* Date Separator */}
        <div className="flex justify-center mb-4">
          <span className="bg-[#1F2C34] text-[#8696A0] text-[12px] font-medium px-3 py-1 rounded-full shadow-sm">
            TODAY
          </span>
        </div>

        {/* Render Messages */}
        <div className="flex flex-col space-y-1 mt-2">
          {messages.map((msg, i) => {
            const isMe = msg.sender === "me";
            return (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={clsx(
                  "max-w-[75%] relative flex group", 
                  isMe ? "self-end" : "self-start"
                )}
              >
                <div className={clsx(
                  "px-[10px] py-[6px] shadow-sm flex flex-col",
                  isMe 
                    ? "bg-[#005C4B] rounded-[8px] rounded-tr-none" 
                    : "bg-[#1F2C34] rounded-[8px] rounded-tl-none"
                )}>
                  <p className="text-[#E9EDEF] text-[15px] leading-[19px] pb-[10px] whitespace-pre-wrap break-words pr-12">
                     {msg.text}
                  </p>
                  
                  {/* Metadata inside bubble */}
                  <div className="absolute bottom-[4px] right-[8px] flex items-center space-x-1">
                    <span className="text-[11px] text-[#8696A0]/80 leading-none mt-1">
                      {msg.time}
                    </span>
                    {isMe && (
                      <span className="text-[#53BDEB] text-[14px] leading-none ml-[2px]">✓✓</span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Input Bar */}
      <div className="absolute bottom-0 w-full bg-[#1F2C34] flex items-end px-3 py-2 min-h-[60px] z-20">
        <button className="text-[#8696A0] p-2 hover:text-white transition-colors shrink-0">
          <Smile className="w-6 h-6" />
        </button>
        <button className="text-[#8696A0] p-2 hover:text-white transition-colors shrink-0">
          <Paperclip className="w-6 h-6" />
        </button>
        
        <div className="flex-1 bg-[#2A3942] rounded-[22px] flex items-end mx-2 overflow-hidden relative min-h-[44px]">
          <textarea 
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Message"
            className="w-full max-h-[120px] bg-transparent text-[#E9EDEF] text-[15px] placeholder:text-[#8696A0] outline-none py-[11px] pl-[16px] pr-[40px] resize-none overflow-y-auto custom-scrollbar leading-[22px]"
            rows={1}
            style={{ height: '44px' }}
          />
          <button className="absolute right-[8px] bottom-[10px] text-[#8696A0] hover:text-white transition-colors">
             <Camera className="w-6 h-6" />
          </button>
        </div>

        <button 
          onClick={handleSend}
          className="w-[48px] h-[48px] rounded-full bg-[#00A884] flex items-center justify-center shrink-0 mb-[6px] hover:bg-[#008f6f] transition-all ml-1 shadow-sm"
        >
          <AnimatePresence mode="popLayout">
            {message.length > 0 ? (
              <motion.div
                key="send"
                initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Send className="w-[20px] h-[20px] text-white ml-[3px]" />
              </motion.div>
            ) : (
              <motion.div
                key="mic"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Mic className="w-[22px] h-[22px] text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

    </div>
  );
}
