// src/AllChatsPage.tsx
import { useEffect, useState } from "react";
import { API_BASE } from "./config";

interface ChatSummary {
  from_number: string;
  name: string;
  customer_id: number;
  last_ts: number;
  last_message: string;
  unread_count: number;
  tag: string;
}

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

export default function AllChatsPage({ colors, darkMode }: any) {
  const [chats, setChats]               = useState<ChatSummary[]>([]);
  const [loadingChats, setLoadingChats] = useState(true);

  const [selected, setSelected]         = useState<ChatSummary | null>(null);
  const [messages, setMessages]         = useState<Message[]>([]);
  const [loadingMsgs, setLoadingMsgs]   = useState(false);

  const [reply, setReply]               = useState("");
  const [sending, setSending]           = useState(false);

  // 1) Fetch open chats
  useEffect(() => {
    fetchChats();
  }, []);

  async function fetchChats() {
    setLoadingChats(true);
    const res = await fetch(`${API_BASE}/api/chats`);
    const data: ChatSummary[] = await res.json();
    setChats(data);
    setLoadingChats(false);

    // if nothing selected, auto-select first
    if (!selected && data.length) {
      selectChat(data[0]);
    }
  }

  // 2) When a chat is selected, load its messages
  async function selectChat(chat: ChatSummary) {
    setSelected(chat);
    setLoadingMsgs(true);
    const res = await fetch(`${API_BASE}/api/messages?phone=${chat.from_number}`);
    const msgs: Message[] = await res.json();
    setMessages(msgs);
    setLoadingMsgs(false);
  }

  // 3) Send a reply
  async function sendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !reply.trim()) return;
    setSending(true);

    // send via API
    await fetch(`${API_BASE}/api/send-message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: selected.from_number, body: reply.trim() }),
    });

    setReply("");
    // reload messages
    await selectChat(selected);
    setSending(false);
  }

  // 4) Close chat (and auto-notify)
  async function closeChat() {
    if (!selected) return;
    // mark closed
    await fetch(`${API_BASE}/api/close-chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: selected.from_number }),
    });
    // auto-notify customer
    await fetch(`${API_BASE}/api/send-message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: selected.from_number,
        body: "🔒 Your chat has been closed. To start a new one, just say “Hi.”"
      }),
    });
    // clear selection & reload chat list
    setSelected(null);
    fetchChats();
  }

  return (
    <div style={{
      display: "flex",
      height: "100%",
      color: colors.text,
      background: colors.card,
      borderRadius: 12,
      overflow: "hidden"
    }}>
      {/* ── Left panel: chat list ────────────────────────────────────────── */}
      <div style={{
        width: 260,
        borderRight: `1px solid ${colors.border}`,
        overflowY: "auto",
        background: darkMode ? "#2a2c31" : "#fafafa",
      }}>
        <h3 style={{
          padding: "16px",
          margin: 0,
          borderBottom: `1px solid ${colors.border}`,
          fontSize: 18,
          fontWeight: 600
        }}>
          All Chats
        </h3>
        {loadingChats ? (
          <div style={{ padding: 16, color: colors.sub }}>Loading chats…</div>
        ) : chats.length === 0 ? (
          <div style={{ padding: 16, color: colors.sub }}>No open chats.</div>
        ) : chats.map(chat => {
          const isSel = selected?.from_number === chat.from_number;
          return (
            <div
              key={chat.from_number}
              onClick={() => selectChat(chat)}
              style={{
                padding: "12px 16px",
                cursor: "pointer",
                background: isSel ? colors.sidebarSel : "none",
                color: isSel ? "#fff" : colors.text,
                borderBottom: `1px solid ${colors.border}`,
                display: "flex",
                flexDirection: "column",
                gap: 4
              }}
            >
              <div style={{ fontWeight: 600 }}>
                [{chat.customer_id}] {chat.name || "—"}
                {chat.unread_count > 0 && (
                  <span style={{
                    marginLeft: 8,
                    background: colors.red,
                    color: "#fff",
                    borderRadius: 8,
                    padding: "2px 6px",
                    fontSize: 12,
                    fontWeight: 700
                  }}>
                    {chat.unread_count}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 13, color: isSel ? "#eee" : colors.sub }}>
                {chat.last_message}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Right panel: message thread ─────────────────────────────────── */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}>
        {/* header with close button */}
        <div style={{
          padding: "16px 24px",
          borderBottom: `1px solid ${colors.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div style={{ fontSize: 18, fontWeight: 600 }}>
            {selected
              ? `Chat with [${selected.customer_id}] ${selected.name || selected.from_number}`
              : "Select a chat"}
          </div>
          {selected && (
            <button
              onClick={closeChat}
              style={{
                background: colors.red,
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "6px 12px",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer"
              }}
            >
              Close Chat
            </button>
          )}
        </div>

        {/* message list */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 24px",
          background: darkMode ? "#1e2024" : "#fff"
        }}>
          {loadingMsgs ? (
            <div style={{ color: colors.sub }}>Loading…</div>
          ) : !selected ? (
            <div style={{ color: colors.sub }}>No chat selected.</div>
          ) : messages.map(msg => (
            <div key={msg.id} style={{
              marginBottom: 12,
              alignSelf: msg.direction === "outgoing" ? "flex-end" : "flex-start",
              maxWidth: "75%",
              padding: "8px 12px",
              borderRadius: 8,
              background: msg.direction === "outgoing"
                ? colors.msgOut
                : colors.msgIn,
              color: msg.direction === "outgoing"
                ? "#fff"
                : colors.text,
            }}>
              <div style={{ fontSize: 14, marginBottom: 4 }}>{msg.body}</div>
              <div style={{ fontSize: 10, color: colors.sub, textAlign: "right" }}>
                {new Date(msg.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* composer */}
        {selected && (
          <form onSubmit={sendReply} style={{ padding: "12px 24px", borderTop: `1px solid ${colors.border}` }}>
            <textarea
              rows={2}
              value={reply}
              onChange={e => setReply(e.target.value)}
              placeholder="Type your message…"
              style={{
                width: "100%",
                borderRadius: 6,
                border: `1px solid ${colors.border}`,
                padding: "8px",
                fontSize: 14,
                background: colors.input,
                color: colors.inputText
              }}
            />
            <button
              type="submit"
              disabled={sending}
              style={{
                marginTop: 8,
                background: colors.red,
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "8px 16px",
                fontWeight: 600,
                cursor: sending ? "default" : "pointer",
                opacity: sending ? 0.6 : 1
              }}
            >
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
