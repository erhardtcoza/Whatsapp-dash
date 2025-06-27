// src/AllChatsPage.tsx
import { useEffect, useState } from "react";
import { API_BASE } from "./config";

interface ChatSummary {
  from_number: string;
  name: string;
  customer_id: string;
  last_ts: number;
  last_message: string;
  unread_count: number;
  tag: string;
}

interface Session {
  id: number;
  ticket: string;
  department: string;
  start_ts: number;
  end_ts: number | null;
}

interface Message {
  id: number;
  from_number: string;
  body: string;
  direction: "incoming" | "outgoing";
  timestamp: number;
  media_url: string | null;
  location_json: string | null;
  tag: string;
}

export default function AllChatsPage({ colors }: any) {
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatSummary | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState("");

  // 1) Load all open chats
  useEffect(() => {
    fetch(`${API_BASE}/api/chats`)
      .then(r => r.json())
      .then(setChats)
      .catch(console.error);
  }, []);

  // 2) When a chat is selected, load its sessions
  useEffect(() => {
    if (!selectedChat) return;
    fetch(`${API_BASE}/api/chat-sessions?phone=${encodeURIComponent(selectedChat.from_number)}`)
      .then(r => r.json())
      .then((ss: Session[]) => {
        setSessions(ss);
        setSelectedSession(ss[0] ?? null);
      })
      .catch(console.error);
  }, [selectedChat]);

  // 3) When either the chat or session changes, load & filter messages
  useEffect(() => {
    if (!selectedChat) return;
    fetch(`${API_BASE}/api/messages?phone=${encodeURIComponent(selectedChat.from_number)}`)
      .then(r => r.json())
      .then((all: Message[]) => {
        if (selectedSession) {
          const inSession = all.filter(m =>
            m.timestamp >= selectedSession.start_ts &&
            (selectedSession.end_ts === null || m.timestamp <= selectedSession.end_ts)
          );
          setMessages(inSession);
        } else {
          setMessages(all);
        }
      })
      .catch(console.error);
  }, [selectedChat, selectedSession]);

  // 4) Send a reply into the current open session
  async function sendReply() {
    if (!reply.trim() || !selectedChat) return;
    await fetch(`${API_BASE}/api/send-message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: selectedChat.from_number, body: reply }),
    });
    setReply("");
    // append immediately
    setMessages(ms => [
      ...ms,
      {
        id: 0,
        from_number: selectedChat.from_number,
        body: reply,
        direction: "outgoing",
        timestamp: Date.now(),
        media_url: null,
        location_json: null,
        tag: selectedSession?.department || selectedChat.tag,
      }
    ]);
  }

  return (
    <div style={{ display: "flex", height: "100%", padding: 32, gap: 32 }}>
      {/* ─── Left panel: all chats ─── */}
      <div style={{ width: 300, overflowY: "auto" }}>
        <h3 style={{ color: colors.red, fontWeight: 700, marginBottom: 12 }}>All Chats</h3>
        <table style={{ width: "100%", background: colors.card, borderRadius: 8 }}>
          <thead>
            <tr>
              <th style={{ padding: "8px", textAlign: "left" }}>ID</th>
              <th style={{ padding: "8px", textAlign: "left" }}>Name</th>
              <th style={{ padding: "8px", textAlign: "left" }}>Phone</th>
              <th style={{ padding: "8px", textAlign: "right" }}>Unread</th>
            </tr>
          </thead>
          <tbody>
            {chats.map(c => (
              <tr
                key={c.from_number}
                onClick={() => setSelectedChat(c)}
                style={{
                  cursor: "pointer",
                  background:
                    selectedChat?.from_number === c.from_number
                      ? colors.input
                      : "transparent"
                }}
              >
                <td style={{ padding: "6px 8px" }}>{c.customer_id}</td>
                <td style={{ padding: "6px 8px" }}>{c.name || "-"}</td>
                <td style={{ padding: "6px 8px" }}>{c.from_number}</td>
                <td style={{ padding: "6px 8px", textAlign: "right" }}>
                  {c.unread_count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ─── Right panel: sessions & messages ─── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {selectedChat ? (
          <>
            {/* Sessions selector */}
            <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
              <h3 style={{ color: colors.red, fontWeight: 700, margin: 0 }}>
                Sessions for {selectedChat.customer_id} — {selectedChat.name || "-"}
              </h3>
              <select
                value={selectedSession?.ticket || ""}
                onChange={e => {
                  const s = sessions.find(x => x.ticket === e.target.value) || null;
                  setSelectedSession(s);
                }}
                style={{
                  padding: "6px 12px",
                  borderRadius: 6,
                  border: `1px solid ${colors.border}`,
                  background: colors.input,
                  color: colors.inputText
                }}
              >
                {sessions.length
                  ? sessions.map(s => (
                      <option key={s.id} value={s.ticket}>
                        {s.ticket} ({s.department}) {s.end_ts ? "[Closed]" : "[Open]"}
                      </option>
                    ))
                  : <option>(no sessions)</option>
                }
              </select>
            </div>

            {/* Message history */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                background: colors.card,
                borderRadius: 8,
                padding: 16
              }}
            >
              {messages.map(m => (
                <div
                  key={m.id}
                  style={{
                    marginBottom: 12,
                    textAlign: m.direction === "incoming" ? "left" : "right"
                  }}
                >
                  <div
                    style={{
                      display: "inline-block",
                      padding: "6px 12px",
                      borderRadius: 8,
                      background: m.direction === "incoming" ? colors.input : colors.red,
                      color: m.direction === "incoming" ? colors.inputText : "#fff"
                    }}
                  >
                    {m.body}
                  </div>
                  <div style={{ fontSize: 12, color: colors.sub, marginTop: 4 }}>
                    {new Date(m.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Reply box only if session still open */}
            {selectedSession && !selectedSession.end_ts && (
              <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
                <input
                  type="text"
                  placeholder="Type your reply…"
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRadius: 6,
                    border: `1px solid ${colors.border}`,
                    background: colors.input,
                    color: colors.inputText
                  }}
                />
                <button
                  onClick={sendReply}
                  style={{
                    background: colors.red,
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "8px 16px",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  Send
                </button>
              </div>
            )}
          </>
        ) : (
          <div style={{ color: colors.sub }}>Select a chat on the left to view its sessions.</div>
        )}
      </div>
    </div>
  );
}
