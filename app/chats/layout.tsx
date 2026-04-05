"use client";
import ChatList from "@/components/ChatList";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

export default function ChatsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // We want to detect if we're exactly at the chats list page (/chats)
  const isChatList = pathname === "/chats" || pathname === "/chats/";
  const isChatRoom = pathname.startsWith("/chats/room");

  return (
    <div style={{ 
      display: "flex", 
      height: "100vh", 
      width: "100vw", 
      overflow: "hidden", 
      background: "var(--bg-0)" 
    }}>
      {/* Sidebar - Chat List */}
      <div 
        className={clsx(
          "desktop-sidebar",
          !isChatList && "hide-on-mobile" // Hide sidebar on mobile if a specific chat (/chats/[id]) is open
        )}
        style={{
          width: "100%",
          maxWidth: "400px",
          height: "100%",
          flexShrink: 0,
        }}
      >
        <ChatList />
      </div>

      {/* Main Content - Chat Window / Placeholder */}
      <div 
        className={clsx(
          isChatList && "hide-on-mobile" // Hide main area/placeholder on mobile if we're in the chat list (/chats)
        )}
        style={{ 
          flex: 1, 
          height: "100%",
        }}
      >
        {children}
      </div>
    </div>
  );
}
