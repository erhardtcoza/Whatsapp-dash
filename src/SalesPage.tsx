// src/SalesPage.tsx
import { useEffect, useState } from "react";
import { API_BASE } from "./config";

interface Message {
  id: number;
  from_number: string;
  body: string;
  direction: "incoming" | "outgoing";
  timestamp: number;
  media_url?: string;
  location_json?: string;
}

interface ChatSummary {
  from_number: string;
  name: string;
  email: string;
  customer_id: string;
  last_ts: number;
  last_message: string;
}

export default function SalesPage({ colors }: any) {
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [selected, setSelected] = useState<ChatSummary | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => { fetchSalesChats(); }, []);

  async function fetchSalesChats() {
    setLoadingChats(true);
    const res = await fetch(`${API_BASE}/api/sales-chats`);
    const data = await res.json();
    setChats(data);
    setLoadingChats(false);
  }

  useEffect(() => {
    if (selected) loadMessages(selected.from_number);
  }, [selected]);

  async function loadMessages(phone: string) {
    setLoadingMsgs(true);
    const res = await fetch(`${API_BASE}/api/messages?phone=${encodeURIComponent(phone)}`);
    const msgs = await res.json();
    setMessages(msgs);
    setLoadingMsgs(false);
  }

  async function sendMessage() {
    if (!selected || !input.trim()) return;
    setSending(true);
    await fetch(`${API_BASE}/api/send-message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: selected.from_number, body: input.trim() }),
    });
    setInput("");
    await loadMessages(selected.from_number);
    setSending(false);
  }

  async function closeChat() {
    if (!selected) return;
    await fetch(`${API_BASE}/api/close-chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: selected.from_number }),
    });
    setSelected(null);
    fetchSupportChats();
  }

  return (
    <div style={{ display: "flex", height: "100%" }}>
      {/* Sidebar */}
      <div style={{
        width: 280,
        borderRight: `1px solid ${colors.border}`,
        padding: 16,
        overflowY: "auto",
        background: colors.sidebar
      }}>
        <h3 style={{ margin: "0 0 12px", color: colors.text }}>Sales Chats</h3>
        {loadingChats
          ? <div style={{ color: colors.sub }}>Loading…</div>
          : chats.length === 0
            ? <div style={{ color: colors.sub }}>No open Sales chats</div>
            : chats.map(c => (
                <div
                  key={c.from_number}
                  onClick={() => setSelected(c)}
                  style={{
                    padding: "8px 12px",
                    marginBottom: 8,
                    background: selected?.from_number === c.from_number ? colors.red : colors.card,
                    color: selected?.from_number === c.from_number ? "#fff" : colors.text,
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{c.name || c.from_number}</div>
                  <div style={{ fontSize: 12, color: colors.sub, marginTop: 2 }}>
                    {c.last_message}
                  </div>
                </div>
              ))
        }
      </div>

      {/* Chat window */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {selected ? (
          <>
            <div style={{
              padding: "12px 16px",
              borderBottom: `1px solid ${colors.border}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <strong>{selected.name || selected.from_number}</strong><br/>
                <small style={{ color: colors.sub }}>{selected.email}</small>
              </div>
              <div>
                <button
                  onClick={() => setSelected(null)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: 18,
                    cursor: "pointer",
                    marginRight: 12,
                    color: colors.sub
                  }}
                >✕</button>
                <button
                  onClick={closeChat}
                  style={{
                    background: colors.red,
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "6px 12px",
                    cursor: "pointer"
                  }}
                >Close Session</button>
              </div>
            </div>

            <div style={{
              flex: 1,
              padding: 16,
              overflowY: "auto",
              background: colors.bg
            }}>
              {loadingMsgs
                ? <div style={{ color: colors.sub }}>Loading messages…</div>
                : messages.length === 0
                  ? <div style={{ color: colors.sub }}>No messages yet</div>
                  : messages.map(msg => (
                      <div
                        key={msg.id}
                        style={{
                          marginBottom: 12,
                          textAlign: msg.direction === "outgoing" ? "right" : "left"
                        }}
                      >
                        <div style={{
                          display: "inline-block",
                          background: msg.direction === "outgoing" ? colors.msgOut : colors.card,
                          color: msg.direction === "outgoing" ? "#fff" : colors.text,
                          padding: "8px 12px",
                          borderRadius: 8,
                          maxWidth: "70%",
                          wordBreak: "break-word"
                        }}>
                          {msg.body}
                          {msg.media_url && (
                            <div style={{ marginTop: 6 }}>
                              <a href={msg.media_url} target="_blank" rel="noopener noreferrer">
                                [View Media]
                              </a>
                            </div>
                          )}
                        </div>
                        <div style={{ fontSize: 10, color: colors.sub, marginTop: 2 }}>
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    ))
              }
            </div>

            <div style={{
              padding: 16,
              borderTop: `1px solid ${colors.border}`,
              display: "flex",
              gap: 8,
            }}>
              <input
                type="text"
                value={input}
                placeholder="Type your message…"
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                style={{
                  flex: 1,
                  borderRadius: 6,
                  border: `1px solid ${colors.border}`,
                  padding: "8px 12px",
                  fontSize: 14,
                  background: colors.input,
                  color: colors.inputText
                }}
                disabled={sending}
              />
              <button
                onClick={sendMessage}
                style={{
                  background: colors.red,
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "8px 16px",
                  cursor: "pointer"
                }}
                disabled={sending}
              >Send</button>
            </div>
          </>
        ) : (
          <div style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: colors.sub
          }}>
            Select a chat from the left to open it.
          </div>
        )}
      </div>
    </div>
  );
}
