// src/LeadsPage.tsx
import { useEffect, useState } from "react";
import { API_BASE } from "./config";

interface ChatSummary {
  from_number: string;
  name: string;
  email: string;
  customer_id: string;
  last_ts: number;
  last_message: string;
  unread_count?: number;
  tag?: string;
}

interface Message {
  id: number;
  from_number: string;
  body: string;
  tag: string;
  timestamp: number;
  direction: "incoming" | "outgoing";
  media_url?: string | null;
  location_json?: string | null;
  seen?: number;
}

export default function LeadsPage({ colors }: any) {
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [selected, setSelected] = useState<ChatSummary | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/leads-chats`)
      .then((r) => r.json())
      .then((d: ChatSummary[]) => {
        setChats(d);
        setLoadingChats(false);
      });
  }, []);

  async function openChat(chat: ChatSummary) {
    setSelected(chat);
    setLoadingMsgs(true);
    const res = await fetch(
      `${API_BASE}/api/messages?phone=${encodeURIComponent(chat.from_number)}`
    );
    const msgs: Message[] = await res.json();
    setMessages(msgs);
    setLoadingMsgs(false);
  }

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ color: colors.text, marginBottom: 18 }}>Leads</h2>
      <div style={{ display: "flex", gap: 24 }}>
        {/* Chat list */}
        <div
          style={{
            width: 280,
            background: colors.card,
            borderRadius: 8,
            overflow: "auto",
            maxHeight: 600,
          }}
        >
          {loadingChats ? (
            <div style={{ padding: 16, color: colors.sub }}>Loading…</div>
          ) : chats.length === 0 ? (
            <div style={{ padding: 16, color: colors.sub }}>
              No open lead chats
            </div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.from_number}
                onClick={() => openChat(chat)}
                style={{
                  padding: 12,
                  borderBottom: `1px solid ${colors.border}`,
                  cursor: "pointer",
                  background:
                    selected?.from_number === chat.from_number
                      ? colors.sidebarSel
                      : "none",
                  color:
                    selected?.from_number === chat.from_number
                      ? "#fff"
                      : colors.text,
                }}
              >
                <div>
                  <strong>{chat.name || chat.from_number}</strong>
                </div>
                <div style={{ fontSize: 12, color: colors.sub }}>
                  {chat.last_message}
                </div>
                {chat.unread_count ? (
                  <span
                    style={{
                      background: colors.red,
                      color: "#fff",
                      borderRadius: 8,
                      padding: "2px 6px",
                      fontSize: 12,
                      float: "right",
                    }}
                  >
                    {chat.unread_count}
                  </span>
                ) : null}
              </div>
            ))
          )}
        </div>

        {/* Chat window */}
        <div
          style={{
            flex: 1,
            background: colors.card,
            borderRadius: 8,
            padding: 16,
            position: "relative",
          }}
        >
          {selected ? (
            loadingMsgs ? (
              <div style={{ color: colors.sub }}>Loading messages…</div>
            ) : (
              <>
                <div style={{ marginBottom: 12, fontWeight: 600 }}>
                  Chat with {selected.name || selected.from_number}
                  <button
                    onClick={() => setSelected(null)}
                    style={{
                      float: "right",
                      background: "none",
                      border: "none",
                      fontSize: 18,
                      cursor: "pointer",
                    }}
                  >
                    ×
                  </button>
                </div>

                <div
                  style={{
                    maxHeight: 400,
                    overflow: "auto",
                    marginBottom: 12,
                  }}
                >
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      style={{
                        display: "flex",
                        justifyContent:
                          msg.direction === "outgoing"
                            ? "flex-end"
                            : "flex-start",
                        marginBottom: 8,
                      }}
                    >
                      <div
                        style={{
                          background:
                            msg.direction === "outgoing"
                              ? colors.msgOut
                              : colors.msgIn,
                          color:
                            msg.direction === "outgoing"
                              ? "#fff"
                              : colors.text,
                          padding: "8px 12px",
                          borderRadius: 8,
                          maxWidth: "70%",
                        }}
                      >
                        {msg.body}
                        {msg.media_url && (
                          <div style={{ marginTop: 6 }}>
                            <a href={msg.media_url} target="_blank">
                              📎 Media
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply form */}
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const input = (e.target as any).elements.reply.value.trim();
                    if (!input) return;
                    await fetch(`${API_BASE}/api/send-message`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        phone: selected.from_number,
                        body: input,
                      }),
                    });
                    openChat(selected);
                    (e.target as any).reset();
                  }}
                >
                  <input
                    name="reply"
                    placeholder="Type a message…"
                    style={{
                      width: "calc(100% - 100px)",
                      padding: "8px 12px",
                      borderRadius: 6,
                      border: `1px solid ${colors.border}`,
                      marginRight: 8,
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: colors.red,
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      padding: "8px 16px",
                      cursor: "pointer",
                    }}
                  >
                    Send
                  </button>
                </form>
              </>
            )
          ) : (
            <div style={{ color: colors.sub }}>Select a chat to open</div>
          )}
        </div>
      </div>
    </div>
  );
}
