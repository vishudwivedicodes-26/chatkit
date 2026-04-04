"use client";
import ChatList from "@/components/ChatList";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

export default function ChatsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isChatList = pathname === "/chats";

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
          !isChatList && "mobile-only" // Hide sidebar on mobile if in a chat
        )}
        style={{
          width: "100%",
          maxWidth: "400px",
          height: "100%",
          borderRight: "1px solid var(--border)",
          flexShrink: 0,
        }}
      >
        <ChatList />
      </div>

      {/* Main Content - Chat Window / Placeholder */}
      <div 
        className={clsx(
          isChatList && "mobile-only" // Hide main area on mobile if in chat list
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
