"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { encryptMessage, decryptMessage } from "@/lib/crypto";
import { useAuthStore } from "@/store/useAuthStore";

import { Suspense } from "react";

function ChatRoom() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const recipientId = searchParams.get("id");
  const { user, privateKeyBase64, isLoading: authLoading } = useAuthStore();
  
  const [msg, setMsg] = useState("");
  const [msgs, setMsgs] = useState<any[]>([]);
  const [recipient, setRecipient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState(false);
  const [attach, setAttach] = useState(false);
  
  const endRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) router.push("/auth");
  }, [authLoading, user, router]);

  // 1. Fetch Recipient & History
  useEffect(() => {
    if (authLoading || !user || !recipientId) return;

    const init = async () => {
      // Get Recipient Public Key
      const { data: recProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", recipientId)
        .single();
      
      if (recProfile) setRecipient(recProfile);

      // Get Chat History
      const { data: history } = await supabase
        .from("messages")
        .select("*")
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${recipientId}),and(sender_id.eq.${recipientId},receiver_id.eq.${user.id})`)
        .order("created_at", { ascending: true });

      if (history && privateKeyBase64 && recProfile) {
        const decrypted = history.map(m => {
          const isMe = m.sender_id === user.id;
          // nacl.box: always decrypt using the other party's public key + our private key
          const decryptedText = decryptMessage(
            m.content, 
            m.nonce, 
            recProfile.public_key, // other party's pub key (works for both sender & receiver)
            privateKeyBase64
          );
          
          return {
            ...m,
            text: decryptedText || "[Decryption Error]",
            from: isMe ? "me" : "them",
            time: new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          };
        });
        setMsgs(decrypted);
      }
      setLoading(false);
    };

    init();
  }, [user, recipientId, privateKeyBase64]);

  // 2. Real-time Subscription
  useEffect(() => {
    if (!user || !recipientId) return;

    const channel = supabase
      .channel(`chat:${user.id}:${recipientId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `receiver_id=eq.${user.id}` 
      }, async (payload) => {
        const m = payload.new;
        if (m.sender_id !== recipientId) return; // Only from current chat
        
        // Decrypt
        if (recipient && privateKeyBase64) {
          const text = decryptMessage(m.content, m.nonce, recipient.public_key, privateKeyBase64);
          setMsgs(p => [...p, {
            ...m,
            text: text || "[Secret Message]",
            from: "them",
            time: new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          }]);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, recipientId, recipient, privateKeyBase64]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = async () => {
    if (!msg.trim() || !user || !recipient || !privateKeyBase64) return;
    
    const plainText = msg;
    setMsg("");
    if (taRef.current) taRef.current.style.height = "42px";

    // E2E Encrypt
    const encrypted = encryptMessage(plainText, recipient.public_key, privateKeyBase64);

    // Optimistic UI
    const tempId = Date.now();
    setMsgs(p => [...p, { id: tempId, text: plainText, from: "me", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), read: false }]);

    // Push to Supabase
    const { error } = await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: recipientId,
      content: encrypted.ciphertext,
      nonce: encrypted.nonce,
      type: 'text'
    });

    if (error) {
      console.error("Send error:", error);
      // fallback: show error on msg
    }
  };

  if (loading) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--t2)" }}>Securing channel...</div>;

  return (
    <div style={{ position: "relative", height: "100%", background: "var(--bg-0)", display: "flex", flexDirection: "column" }}>
      {/* TOP BAR */}
      <div style={{ height: 54, background: "var(--bg-1)", display: "flex", alignItems: "center", padding: "0 8px", borderBottom: "1px solid var(--border)", zIndex: 20 }}>
        <button onClick={() => router.push("/chats")} style={{ background: "none", border: "none", cursor: "pointer", padding: 6, display: "flex", alignItems: "center" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--t1)" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", marginLeft: 4 }}>
          {recipient?.display_name?.slice(0, 2).toUpperCase()}
        </div>
        <div style={{ flex: 1, marginLeft: 10 }}>
          <div style={{ color: "var(--t1)", fontSize: 15, fontWeight: 600 }}>{recipient?.display_name}</div>
          <div style={{ color: "var(--accent)", fontSize: 12 }}>online</div>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="chat-wall" style={{ flex: 1, overflowY: "auto", padding: "8px 5%" }}>
        <div style={{ display: "flex", justifyContent: "center", margin: "12px 0" }}>
          <div style={{ background: "var(--accent-dim)", borderRadius: 6, padding: "6px 14px", display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span style={{ color: "var(--t2)", fontSize: 11 }}>End-to-End Encrypted: Only you and {recipient?.display_name} can read this.</span>
          </div>
        </div>

        {msgs.map(m => {
          const me = m.from === "me";
          return (
            <div key={m.id} style={{ display: "flex", justifyContent: me ? "flex-end" : "flex-start", marginBottom: 2 }}>
              <div style={{ maxWidth: "78%", position: "relative", background: me ? "var(--bubble-out)" : "var(--bubble-in)", borderRadius: me ? "10px 2px 10px 10px" : "2px 10px 10px 10px", padding: "6px 10px", border: `1px solid ${me ? "rgba(37,211,102,0.06)" : "var(--border)"}` }}>
                <p style={{ color: "var(--t1)", fontSize: 14, margin: 0, paddingRight: me ? 50 : 36 }}>{m.text}</p>
                <div style={{ position: "absolute", bottom: 4, right: 8, display: "flex", alignItems: "center", gap: 3 }}>
                  <span style={{ color: "var(--t3)", fontSize: 10 }}>{m.time}</span>
                  {me && <span style={{ color: m.read_at ? "var(--blue)" : "var(--t3)", fontSize: 12 }}>✓✓</span>}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* INPUT */}
      <div style={{ background: "var(--bg-1)", display: "flex", alignItems: "flex-end", padding: "6px 6px", borderTop: "1px solid var(--border)", gap: 4 }}>
        <button style={{ background: "none", border: "none", cursor: "pointer", padding: 8 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--t2)" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
        </button>
        <div style={{ flex: 1, background: "var(--bg-2)", borderRadius: 20, display: "flex", alignItems: "flex-end", minHeight: 42, border: "1px solid var(--border)" }}>
          <textarea ref={taRef} value={msg} onChange={e => { setMsg(e.target.value); const el = e.target; el.style.height = "42px"; el.style.height = Math.min(el.scrollHeight, 120) + "px"; }}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Secure Message" rows={1}
            style={{ width: "100%", color: "var(--t1)", fontSize: 14, padding: "10px 46px 10px 14px", resize: "none", overflowY: "auto", maxHeight: 120, minHeight: 42, background: "none", border: "none", outline: "none" }} />
        </div>
        <button onClick={send} style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--accent)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--t2)" }}>Shielding conversation...</div>}>
      <ChatRoom />
    </Suspense>
  );
}
