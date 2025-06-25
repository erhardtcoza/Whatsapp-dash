import { useEffect, useState, useRef } from "react";
import { API_BASE } from "./config";

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
}: {
  phone?: string;
  contact?: any;
  colors: any;
  onCloseChat: () => void;
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

  // scroll to bottom on new messages
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
      { id: Date.now(), from_number: phone, body, tag: "outgoing", timestamp: Date.now(), direction: "outgoing" },
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
      <div style={{ padding: "20px 40px", borderBottom: `1px solid ${colors.border}`, display: "flex", justifyContent: "space-between" }}>
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

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 40px", background: colors.msgIn }}>
        {loading ? (
          <div style={{ color: colors.sub }}>Loading messages…</div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              style={{
                marginBottom: 12,
                display: "flex",
                justifyContent: m.direction === "outgoing" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "70%",
                  padding: "8px 12px",
                  background: m.direction === "outgoing" ? colors.msgOut : colors.card,
                  color: m.direction === "outgoing" ? "#fff" : colors.text,
                  borderRadius: 8,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {/* text */}
                {m.body && <div>{m.body}</div>}

                {/* image */}
                {m.media_url && /\.(jpg|jpeg|png|gif)$/i.test(m.media_url) && (
                  <img
                    src={m.media_url}
                    alt="attachment"
                    style={{ maxWidth: "100%", borderRadius: 6, marginTop: 8 }}
                  />
                )}

                {/* audio */}
                {m.media_url && /\.(mp3|ogg|wav)$/i.test(m.media_url) && (
                  <audio controls style={{ width: "100%", marginTop: 8 }}>
                    <source src={m.media_url} />
                    Your browser does not support audio.
                  </audio>
                )}

                {/* document */}
                {m.media_url &&
                  !/\.(jpg|jpeg|png|gif|mp3|ogg|wav)$/i.test(m.media_url) &&
                  !m.location_json && (
                    <a
                      href={m.media_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-block",
                        marginTop: 8,
                        color: colors.red,
                        textDecoration: "underline",
                      }}
                    >
                      Download attachment
                    </a>
                  )}

                {/* location */}
                {m.location_json && (() => {
                  try {
                    const loc = JSON.parse(m.location_json);
                    const mapUrl = `https://www.google.com/maps?q=${loc.latitude},${loc.longitude}`;
                    return (
                      <a
                        href={mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-block",
                          marginTop: 8,
                          color: colors.red,
                          textDecoration: "underline",
                        }}
                      >
                        View location
                      </a>
                    );
                  } catch {
                    return null;
                  }
                })()}
              </div>
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>

      <div style={{ padding: "12px 40px", borderTop: `1px solid ${colors.border}`, display: "flex", gap: 8 }}>
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
