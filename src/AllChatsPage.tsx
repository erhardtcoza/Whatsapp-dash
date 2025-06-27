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
  closed?: number;
}

// Utility to group messages into sessions
function groupIntoSessions(msgs: Message[]): { sessionId: number; messages: Message[] }[] {
  if (!msgs.length) return [];
  const sessions: { sessionId: number; messages: Message[] }[] = [];
  let currentSession: Message[] = [];
  let sessionCounter = 1;

  for (let m of msgs) {
    currentSession.push(m);
    // whenever you hit a closed marker (closed===1 on outgoing admin message), end session
    if (m.direction === "outgoing" && m.body.includes("🔒 Your chat has been closed")) {
      sessions.push({ sessionId: sessionCounter++, messages: currentSession });
      currentSession = [];
    }
  }
  // leftover
  if (currentSession.length) {
    sessions.push({ sessionId: sessionCounter++, messages: currentSession });
  }
  return sessions;
}

export default function AllChatsPage({ colors, darkMode }: any) {
  const [chats, setChats]               = useState<ChatSummary[]>([]);
  const [loading, setLoading]           = useState(true);
  const [modalOpen, setModalOpen]       = useState(false);
  const [modalCustomer, setModalCustomer] = useState<ChatSummary | null>(null);
  const [sessions, setSessions]         = useState<{ sessionId: number; messages: Message[] }[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  useEffect(() => { fetchChats(); }, []);

  async function fetchChats() {
    setLoading(true);
    const res = await fetch(`${API_BASE}/api/chats`);
    const data: ChatSummary[] = await res.json();
    setChats(data);
    setLoading(false);
  }

  async function openModal(chat: ChatSummary) {
    setModalCustomer(chat);
    setModalOpen(true);
    setLoadingSessions(true);

    // fetch **all** messages for this client
    const res = await fetch(`${API_BASE}/api/messages?phone=${chat.from_number}`);
    const msgs: Message[] = await res.json();

    // group into sessions
    const grouped = groupIntoSessions(msgs);
    setSessions(grouped);
    setLoadingSessions(false);
  }

  function closeModal() {
    setModalOpen(false);
    setModalCustomer(null);
    setSessions([]);
  }

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ color: colors.text, fontWeight: 600, fontSize: 22 }}>
        All Clients &amp; Sessions
      </h2>

      <table style={{
        width: "100%",
        background: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: 8,
        overflow: "hidden",
      }}>
        <thead style={{ background: darkMode ? "#2a2c31" : "#fafafa" }}>
          <tr>
            <th style={{ padding: 12, textAlign: "left", color: colors.sub }}>Client ID</th>
            <th style={{ padding: 12, textAlign: "left", color: colors.sub }}>Name</th>
            <th style={{ padding: 12, textAlign: "left", color: colors.sub }}>Phone</th>
            <th style={{ padding: 12, textAlign: "center", color: colors.sub }}># Sessions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={4} style={{ padding: 16, color: colors.sub }}>Loading…</td></tr>
          ) : chats.length === 0 ? (
            <tr><td colSpan={4} style={{ padding: 16, color: colors.sub }}>No open chats.</td></tr>
          ) : chats.map(chat => (
            <tr key={chat.from_number}
                onClick={() => openModal(chat)}
                style={{ cursor: "pointer", borderBottom: `1px solid ${colors.border}` }}>
              <td style={{ padding: 12 }}>{chat.customer_id}</td>
              <td style={{ padding: 12 }}>{chat.name || "—"}</td>
              <td style={{ padding: 12 }}>{chat.from_number}</td>
              <td style={{ padding: 12, textAlign: "center" }}>
                {/* For now, if they have any messages => “1”, else “0” */}
                {chat.unread_count > 0 ? 1 : 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── Modal for sessions ──────────────────────────────────────────── */}
      {modalOpen && modalCustomer && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 999
        }}>
          <div style={{
            width: "80%", maxHeight: "80%", overflowY: "auto",
            background: colors.card, borderRadius: 8, boxShadow: "0 2px 14px #0003",
            padding: 24
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ margin: 0 }}>
                Sessions for [{modalCustomer.customer_id}] {modalCustomer.name}
              </h3>
              <button
                onClick={closeModal}
                style={{
                  background: "none", border: "none", fontSize: 18, cursor: "pointer"
                }}>✕</button>
            </div>

            {loadingSessions ? (
              <div style={{ color: colors.sub }}>Loading sessions…</div>
            ) : sessions.length === 0 ? (
              <div style={{ color: colors.sub }}>No sessions yet — showing all messages:</div>
            ) : sessions.map(sess => (
              <details key={sess.sessionId} style={{ marginBottom: 16 }}>
                <summary style={{
                  padding: "8px 12px",
                  background: colors.card,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 6,
                  cursor: "pointer",
                  fontWeight: 600
                }}>
                  Session #{sess.sessionId} &nbsp;
                  ({sess.messages.length} msgs) &nbsp;
                  {sess.messages.some(m => m.closed) ? "🔒 Closed" : "🟢 Open"}
                </summary>
                <div style={{ padding: "8px 16px" }}>
                  {sess.messages.map(m => (
                    <div key={m.id} style={{
                      marginBottom: 8,
                      padding: "6px 10px",
                      background: m.direction === "outgoing"
                        ? colors.msgOut : colors.msgIn,
                      color: m.direction === "outgoing" ? "#fff" : colors.text,
                      borderRadius: 4,
                      maxWidth: "85%"
                    }}>
                      <div style={{ fontSize: 13 }}>{m.body}</div>
                      <div style={{ fontSize: 10, color: colors.sub, textAlign: "right" }}>
                        {new Date(m.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            ))}

            {/* If truly no sessions, show all messages flat */}
            {sessions.length === 0 && (
              <div style={{ marginTop: 8 }}>
                {/* reuse groupIntoSessions on full set */}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
