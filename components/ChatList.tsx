"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";

const COLORS = ["#25d366", "#1da1f2", "#9b59b6", "#e74c3c", "#f39c12", "#e91e63", "#00bcd4", "#2ecc71"];
const initials = (n: string) => n.split(" ").map(w => w[0]).join("").slice(0, 2);

export default function ChatList() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading: authLoading } = useAuthStore();
  const [tab, setTab] = useState("Chats");
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setLoading(false); return; }
    
    const fetchChats = async () => {
      // Fetch all profiles except current user
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", user.id);
      
      if (profiles) {
        // Fetch last message for each profile to get real timestamps
        const chatDataPromises = profiles.map(async (p, idx) => {
          const { data: lastMsg } = await supabase
            .from("messages")
            .select("created_at, content")
            .or(`and(sender_id.eq.${user.id},receiver_id.eq.${p.id}),and(sender_id.eq.${p.id},receiver_id.eq.${user.id})`)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          const timeStr = lastMsg
            ? new Date(lastMsg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : "";

          return {
            id: p.id,
            name: p.display_name,
            username: p.username,
            msg: lastMsg ? "🔒 Encrypted message" : "Start a secure conversation",
            time: timeStr,
            unread: 0,
            online: true,
            hasMessages: !!lastMsg,
          };
        });

        const chatData = await Promise.all(chatDataPromises);
        // Sort: contacts with messages first (by recency), then others
        chatData.sort((a, b) => {
          if (a.hasMessages && !b.hasMessages) return -1;
          if (!a.hasMessages && b.hasMessages) return 1;
          return a.name.localeCompare(b.name);
        });
        setChats(chatData);
      }
      setLoading(false);
    };

    fetchChats();
  }, [user]);

  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const isActive = (id: string) => pathname === `/chats/room` && searchParams?.get("id") === id;
  const filtered = chats.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--bg-0)", position: "relative" }}>
      {/* header */}
      <div style={{ height: 52, background: "var(--bg-1)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", borderBottom: "1px solid var(--border)" }}>
        <span style={{ fontSize: 20, fontWeight: 700, color: "var(--accent)" }}>ChatKit</span>
        <div style={{ display: "flex", gap: 16 }}>
          <button onClick={() => setShowSearch(!showSearch)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--t2)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
          <button onClick={() => router.push("/settings")} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--t2)" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
          </button>
        </div>
      </div>

      {/* tabs */}
      <div style={{ display: "flex", height: 40, borderBottom: "1px solid var(--border)", background: "var(--bg-1)" }}>
        {["Chats", "Status", "Calls"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, background: "none", border: "none", borderBottom: tab === t ? "2px solid var(--accent)" : "2px solid transparent", color: tab === t ? "var(--t1)" : "var(--t3)", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>{t}</button>
        ))}
      </div>

      {/* search bar */}
      {showSearch && (
        <div style={{ padding: "8px 12px", background: "var(--bg-1)" }}>
          <div style={{ background: "var(--bg-2)", borderRadius: 8, height: 36, display: "flex", alignItems: "center", padding: "0 12px", border: "1px solid var(--border)" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--t3)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder="Search people" style={{ flex: 1, marginLeft: 8, color: "var(--t1)", fontSize: 14, background: "none", border: "none", outline: "none" }} />
          </div>
        </div>
      )}

      {/* list */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {loading ? (
          <div style={{ padding: 20, textAlign: "center", color: "var(--t3)" }}>Initializing secure list...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--t3)" }}>
            {search ? `No results for "${search}"` : "No contacts found yet. Register another account to start chatting!"}
          </div>
        ) : (
          filtered.map((c, i) => (
            <div key={c.id} onClick={() => router.push(`/chats/room?id=${c.id}`)} 
              style={{ 
                height: 72, display: "flex", alignItems: "center", cursor: "pointer", padding: "0 14px", borderBottom: "1px solid var(--border)",
                background: isActive(c.id) ? "var(--bg-2)" : "transparent"
              }}
              onMouseOver={e => !isActive(c.id) && (e.currentTarget.style.background = "var(--bg-2)")}
              onMouseOut={e => !isActive(c.id) && (e.currentTarget.style.background = "transparent")}>
              <div style={{ width: 46, height: 46, borderRadius: "50%", background: COLORS[i % COLORS.length], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#fff", position: "relative", flexShrink: 0 }}>
                {initials(c.name)}
                {c.online && <div style={{ position: "absolute", bottom: 0, right: 0, width: 11, height: 11, borderRadius: "50%", background: "var(--accent)", border: "2px solid var(--bg-0)" }} />}
              </div>
              <div style={{ flex: 1, marginLeft: 12, overflow: "hidden" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ color: "var(--t1)", fontSize: 15, fontWeight: 500 }}>{c.name}</span>
                  <span style={{ color: c.unread ? "var(--accent)" : "var(--t3)", fontSize: 12 }}>{c.time}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--t2)", fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{c.msg}</span>
                  {c.unread > 0 && <div style={{ minWidth: 18, height: 18, borderRadius: 9, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: 8 }}><span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>{c.unread}</span></div>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* FAB - Add Friend by UID */}
      <button onClick={() => { /* Open a modal or logic to scan UID */ }} style={{ position: "absolute", bottom: 24, right: 20, width: 52, height: 52, borderRadius: "50%", background: "var(--accent)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,200,150,0.3)" }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>
    </div>
  );
}
