import { useEffect, useState, useRef } from "react";
import { API_BASE } from "./config";
import MessageBubble from "./MessageBubble";

interface Message {
  id: number;
  from_number: string;
  body: string;
  tag: string;
  timestamp: number;
  direction: "incoming" | "outgoing";
  media_url?: string;
  location_json?: string;
}

export default function ChatPanel({
  phone,
  contact,
  colors,
  onCloseChat,
  prefillMsg,
}: {
  phone?: string;
  contact?: any;
  colors: any;
  onCloseChat: () => void;
  prefillMsg?: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!phone) return;
    setLoading(true);
    fetch(`${API_BASE}/api/messages?phone=${encodeURIComponent(phone)}`)
      .then((r) => r.json())
      .then((msgs) => setMessages(msgs))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [phone]);

  useEffect(() => {
    if (typeof prefillMsg === "string" && prefillMsg && phone) {
      setNewMsg(prefillMsg);
    }
  }, [prefillMsg, phone]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    if (!phone || !newMsg.trim()) return;
    const body = newMsg.trim();
    setNewMsg("");
    await fetch(`${API_BASE}/api/send-message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, body }),
    });
    setMessages((m) => [
      ...m,
      {
        id: Date.now(),
        from_number: phone,
        body,
        tag: "outgoing",
        timestamp: Date.now(),
        direction: "outgoing",
      },
    ]);
  }

  if (!phone) {
    return (
      <div style={{ padding: 32, color: colors.sub }}>
        Select a chat on the left to begin.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div
        style={{
          padding: "20px 40px",
          borderBottom: `1px solid ${colors.border}`,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <strong>{contact?.name || phone}</strong>
          {contact?.customer_id && <> — #{contact.customer_id}</>}
        </div>
        <button
          onClick={onCloseChat}
          style={{
            background: colors.red,
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "6px 12px",
            cursor: "pointer",
          }}
        >
          Close Chat
        </button>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 40px",
          background: colors.msgIn,
        }}
      >
        {loading ? (
          <div style={{ color: colors.sub }}>Loading messages…</div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              style={{
                marginBottom: 2,
                display: "flex",
                justifyContent:
                  m.direction === "outgoing" ? "flex-end" : "flex-start",
              }}
            >
              <MessageBubble m={m} colors={colors} />
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div
        style={{
          padding: "12px 40px",
          borderTop: `1px solid ${colors.border}`,
          display: "flex",
          gap: 8,
        }}
      >
        <input
          type="text"
          placeholder="Type a message…"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          style={{
            flex: 1,
            borderRadius: 8,
            border: `1px solid ${colors.border}`,
            padding: "8px 12px",
            fontSize: 15,
            background: colors.input,
            color: colors.inputText,
          }}
        />
        <button
          onClick={send}
          style={{
            background: colors.red,
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "8px 18px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
