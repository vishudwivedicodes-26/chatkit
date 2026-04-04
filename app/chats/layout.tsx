"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, Camera, MoreVertical, MessageSquare, CircleDashed, Phone, Users, Plus, MessageCircle } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import { FriendSearch } from "@/components/FriendSearch";

export default function ChatsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isRootChats = pathname === "/chats";
  const [showSearch, setShowSearch] = useState(false);
  
  // Mobile: only show sidebar if we are at root /chats.
  // Desktop: always show sidebar.
  
  return (
    <div className="flex h-screen w-full bg-[#0B141A] overflow-hidden relative">
      <FriendSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
      
      {/* LEFT PANEL: Chat List (Sidebar) */}
      <div 
        className={clsx(
          "h-full w-full md:w-[400px] border-r border-[#2A3942] bg-[#111B21] flex flex-col shrink-0 relative",
          !isRootChats && "hidden md:flex" // Hide on mobile if not root
        )}
      >
        {/* Top App Bar */}
        <div className="h-[56px] w-full bg-[#1F2C34] flex items-center justify-between px-4 shrink-0">
          <span className="text-[#E9EDEF] text-[20px] font-bold">CipherTalk</span>
          <div className="flex space-x-4 text-white">
            <Camera className="w-5 h-5 cursor-pointer" />
            <Search className="w-5 h-5 cursor-pointer" />
            <MoreVertical className="w-5 h-5 cursor-pointer" />
          </div>
        </div>

        {/* Tab Bar */}
        <div className="h-[48px] w-full bg-[#1F2C34] flex shrink-0">
          <TabItem label="Chats" active={true} />
          <TabItem label="Status" active={false} />
          <TabItem label="Friends" active={false} />
          <TabItem label="Calls" active={false} />
        </div>

        {/* Chat List Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#111B21]">
          <SidebarContent />    
        </div>
        
        {/* Floating Action Button (FAB) */}
        <button 
          onClick={() => setShowSearch(true)}
          className="absolute bottom-6 right-6 w-14 h-14 bg-[#00A884] rounded-full flex items-center justify-center shadow-lg hover:bg-[#008f6f] active:scale-95 transition-all text-white z-10"
        >
          <MessageCircle className="w-6 h-6" />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#111B21] rounded-full flex items-center justify-center border-2 border-[#111B21]">
             <Plus className="w-4 h-4 text-[#00A884]" />
          </div>
        </button>
      </div>

      {/* MIDDLE PANEL: Active Chat (Children) */}
      <div 
        className={clsx(
          "flex-1 h-full relative",
          isRootChats && "hidden md:flex flex-col items-center justify-center bg-[#111B21] border-l border-[#2A3942]" // Hide on mobile if at root
        )}
      >
        {isRootChats ? (
           // Empty State for Desktop
           <div className="text-center px-10">
             <div className="w-64 h-64 bg-[#1F2C34] rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-[#0B141A]">
                <MessageSquare className="w-32 h-32 text-[#00A884] opacity-50" />
             </div>
             <h1 className="text-white text-[32px] font-light mb-4">CipherTalk for Web</h1>
             <p className="text-[#8696A0] text-[14px]">
               End-to-end encrypted anonymous messaging.<br/>
               Messages auto-delete every 15 hours.
             </p>
           </div>
        ) : (
          children
        )}
      </div>

    </div>
  );
}

function TabItem({ label, active }: { label: string, active: boolean }) {
  return (
    <div className="flex-1 flex items-center justify-center relative cursor-pointer group">
      <span className={clsx(
        "text-[13px] font-medium transition-colors",
        active ? "text-white" : "text-[#8696A0] group-hover:text-white"
      )}>
        {label}
      </span>
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#00A884]" />
      )}
    </div>
  );
}

function SidebarContent() {
  // Dummy data for visual layout
  return (
    <div className="flex flex-col w-full">
      <ChatRow name="Anonymous Fox" preview="Hey, the keys are sorted." time="10:45 AM" unread={2} />
      <ChatRow name="Cyber Ninja" preview="✓✓ Got it." time="Yesterday" />
      <ChatRow name="CT-9A2X4R" preview="Voice Message (0:15)" time="Yesterday" />
    </div>
  );
}

function ChatRow({ name, preview, time, unread }: any) {
  return (
    <Link href={`/chats/dummy-id`} className="w-full h-[72px] flex items-center bg-[#111B21] hover:bg-[#2A3942] transition-colors cursor-pointer group">
      <div className="w-[72px] h-full flex items-center justify-center shrink-0">
        <div className="w-12 h-12 rounded-full bg-[#2A3942] flex items-center justify-center text-[#8696A0]">
           <Users size={24} />
        </div>
      </div>
      <div className="flex-1 h-full pr-4 flex flex-col justify-center border-b border-[#1F2C34] group-hover:border-transparent">
        <div className="flex justify-between items-baseline mb-1">
           <span className="text-[#E9EDEF] text-[16px] font-medium truncate">{name}</span>
           <span className={clsx("text-[12px]", unread ? "text-[#00A884]" : "text-[#8696A0]")}>{time}</span>
        </div>
        <div className="flex justify-between items-center">
           <span className="text-[#8696A0] text-[14px] truncate flex-1">{preview}</span>
           {unread && (
             <div className="w-[20px] h-[20px] bg-[#00A884] rounded-full flex items-center justify-center ml-2 shrink-0">
               <span className="text-[#111B21] text-[11px] font-bold">{unread}</span>
             </div>
           )}
        </div>
      </div>
    </Link>
  );
}
