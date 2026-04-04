"use client";

export default function ChatsPage() {
  return (
    <div style={{ 
      height: "100%", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      background: "var(--bg-0)",
      padding: "0 40px",
      textAlign: "center"
    }}>
      <div style={{ 
        width: 100, 
        height: 100, 
        borderRadius: "50%", 
        border: "1px solid var(--border)", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        marginBottom: 20,
        opacity: 0.6
      }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--t2)" strokeWidth="1.5">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </div>
      <h2 style={{ color: "var(--t1)", fontSize: 20, fontWeight: 600, marginBottom: 8 }}>ChatKit Desktop</h2>
      <p style={{ color: "var(--t2)", fontSize: 14, maxWidth: 300 }}>
        Select a chat from the sidebar to start messaging. 🔒 Your messages are end-to-end encrypted.
      </p>
    </div>
  );
}
