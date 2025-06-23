import { useEffect, useState } from "react";
import { API_BASE } from "./config";

export default function ChatPanel({ chat, colors, darkMode, onClose }: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!chat) return;
    setLoading(true);
    fetch(`${API_BASE}/api/messages?phone=${chat.from_number}`)
      .then(res => res.json())
      .then(setMessages)
      .finally(() => setLoading(false));
  }, [chat]);

  function handleSend(e: any) {
    e.preventDefault();
    if (!body.trim()) return;
    setSending(true);
    fetch(`${API_BASE}/api/send-message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: chat.from_number, body }),
    })
      .then(() => {
        setBody("");
        // Reload messages
        return fetch(`${API_BASE}/api/messages?phone=${chat.from_number}`).then(res => res.json());
      })
      .then(setMessages)
      .finally(() => setSending(false));
  }

  if (!chat) return null;

  return (
    <div style={{
      padding: 20,
      minHeight: 350,
      background: colors.bg,
      color: colors.text,
      borderRadius: 10,
      border: `1.5px solid ${colors.border}`,
      width: "100%",
      maxWidth: 680,
      margin: "0 auto",
      boxShadow: "0 1px 7px #0002",
      display: "flex",
      flexDirection: "column"
    }}>
      <div style={{ marginBottom: 8, fontWeight: 600, fontSize: 19 }}>
        Chat with {chat.name || chat.from_number}
        <button
          onClick={onClose}
          style={{
            float: "right",
            background: colors.red,
            color: "#fff",
            border: "none",
            borderRadius: 5,
            padding: "2px 10px",
            fontWeight: 600,
            fontSize: 15,
            cursor: "pointer",
            marginLeft: 15,
          }}
        >Close</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", marginBottom: 12, maxHeight: 320 }}>
        {loading
          ? <div style={{ color: colors.sub, padding: 20 }}>Loading messages...</div>
          : (
            messages.map((m, idx) => (
              <div key={m.id || idx} style={{
                margin: "8px 0",
                color: m.direction === "outgoing" ? colors.red : colors.text,
                textAlign: m.direction === "outgoing" ? "right" : "left"
              }}>
                <span style={{
                  background: m.direction === "outgoing" ? "#fff" : "#eee",
                  borderRadius: 7,
                  padding: "4px 12px",
                  display: "inline-block",
                  maxWidth: 400,
                  wordBreak: "break-all"
                }}>
                  {m.body}
                </span>
              </div>
            ))
          )}
      </div>
      <form onSubmit={handleSend} style={{ display: "flex", gap: 7 }}>
        <input
          value={body}
          onChange={e => setBody(e.target.value)}
          disabled={sending}
          style={{
            flex: 1,
            padding: "10px 12px",
            fontSize: 15,
            borderRadius: 7,
            border: `1.5px solid ${colors.border}`,
            background: colors.input,
            color: colors.inputText
          }}
          placeholder="Type your reply…"
        />
        <button
          type="submit"
          disabled={sending || !body.trim()}
          style={{
            background: colors.red,
            color: "#fff",
            border: "none",
            borderRadius: 7,
            padding: "8px 22px",
            fontWeight: 600,
            fontSize: 15,
            cursor: "pointer"
          }}
        >Send</button>
      </form>
    </div>
  );
}
