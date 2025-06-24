import { useEffect, useRef, useState } from "react";
import { API_BASE } from "./config";

export default function ChatPanel({ phone, contact, colors }: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!phone) return;
    setLoading(true);
    fetch(`${API_BASE}/api/messages?phone=${phone}`)
      .then(res => res.json())
      .then(setMessages)
      .finally(() => setLoading(false));
  }, [phone]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendReply(e: any) {
    e.preventDefault();
    if (!reply.trim()) return;
    setSending(true);
    await fetch(`${API_BASE}/api/send-message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, body: reply })
    });
    setReply("");
    // Reload messages
    fetch(`${API_BASE}/api/messages?phone=${phone}`)
      .then(res => res.json())
      .then(setMessages)
      .finally(() => setSending(false));
  }

  if (!phone) return (
    <div style={{ color: colors.sub, padding: 40, textAlign: "center" }}>
      Select a chat to view conversation.
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: 380, background: colors.bg, borderRadius: 12, marginTop: 28 }}>
      {/* Header */}
      <div style={{ background: colors.card, padding: 16, fontWeight: 600, color: colors.red, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
        {contact?.name || contact?.email || phone}
      </div>
      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "18px 18px 10px 18px", background: colors.bg }}>
        {loading ? (
          <div style={{ color: colors.sub, textAlign: "center" }}>Loading…</div>
        ) : (
          messages.length === 0 ? (
            <div style={{ color: colors.sub, textAlign: "center", marginTop: 40 }}>No messages</div>
          ) : (
            messages.map((msg: any) => (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  justifyContent: msg.direction === "outgoing" ? "flex-end" : "flex-start",
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    background: msg.direction === "outgoing" ? colors.red : colors.msgIn,
                    color: msg.direction === "outgoing" ? "#fff" : colors.text,
                    borderRadius: 16,
                    padding: "8px 16px",
                    maxWidth: "72%",
                    fontSize: 15,
                    boxShadow: "0 1px 4px #0001",
                  }}
                  title={new Date(msg.timestamp).toLocaleString()}
                >
                  {msg.body}
                </div>
              </div>
            ))
          )
        )}
        <div ref={messagesEndRef}></div>
      </div>
      {/* Reply form */}
      <form onSubmit={sendReply} style={{ display: "flex", gap: 10, background: colors.card, padding: 16, borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
        <input
          style={{
            flex: 1,
            borderRadius: 12,
            border: `1px solid ${colors.border}`,
            padding: "8px 14px",
            fontSize: 15,
            outline: "none",
            background: colors.input,
            color: colors.inputText
          }}
          placeholder="Type your reply…"
          value={reply}
          disabled={sending}
          onChange={e => setReply(e.target.value)}
        />
        <button
          type="submit"
          disabled={sending || !reply.trim()}
          style={{
            background: colors.red,
            color: "#fff",
            border: "none",
            borderRadius: 12,
            fontWeight: 600,
            fontSize: 15,
            padding: "8px 26px",
            cursor: sending ? "default" : "pointer",
            opacity: sending ? 0.7 : 1
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
