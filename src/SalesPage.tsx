import { useEffect, useState } from "react";
import { API_BASE } from "./config";

export default function SalesPage({ colors, darkMode }: any) {
  const [chats, setChats] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [currentSession, setCurrentSession] = useState<any>(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => { fetchChats(); }, []);

  async function fetchChats() {
    setLoading(true);
    const res = await fetch(`${API_BASE}/api/sales-chats`);
    setChats(await res.json());
    setLoading(false);
  }

  async function openChat(chat: any) {
    setSelected(chat);
    setSessions([]);
    setMessages([]);
    setCurrentSession(null);
    // Fetch chat sessions for this client
    const sessionsRes = await fetch(`${API_BASE}/api/chat-sessions?phone=${encodeURIComponent(chat.from_number)}`);
    const sessionsData = await sessionsRes.json();
    setSessions(sessionsData);
    if (sessionsData.length > 0) {
      // Open the latest session by default
      openSession(sessionsData[0]);
    }
  }

  async function openSession(session: any) {
    setCurrentSession(session);
    setMessages([]);
    // Fetch all messages for this session (by ticket)
    const res = await fetch(`${API_BASE}/api/messages?phone=${encodeURIComponent(selected.from_number)}`);
    const allMsgs = await res.json();
    // Filter messages to only those for this session's ticket
    const sessionMsgs = allMsgs.filter(
      (m: any) =>
        m.body?.includes(session.ticket) || // optional: depends on how ticket is referenced
        !session.end_ts // fallback: show all if not ended
    );
    setMessages(sessionMsgs);
  }

  async function sendMessage() {
    if (!reply.trim()) return;
    setSending(true);
    await fetch(`${API_BASE}/api/send-message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: selected.from_number, body: reply }),
    });
    setReply("");
    // Refresh messages
    if (currentSession) openSession(currentSession);
    setSending(false);
  }

  async function closeSession() {
    if (!selected) return;
    await fetch(`${API_BASE}/api/close-chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: selected.from_number }),
    });
    setSelected(null);
    setCurrentSession(null);
    setMessages([]);
    fetchChats();
  }

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ color: colors.text, fontWeight: 600, fontSize: 22, marginBottom: 18 }}>
        Sales Chats
      </h2>
      <div style={{ display: "flex", gap: 32 }}>
        {/* Chat List */}
        <div style={{ minWidth: 340, maxWidth: 400 }}>
          {loading ? (
            <div>Loading…</div>
          ) : (
            <table style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Client ID</th>
                  <th>Name</th>
                  <th>Number</th>
                  <th>Sessions</th>
                </tr>
              </thead>
              <tbody>
                {chats.map((chat) => (
                  <tr
                    key={chat.from_number}
                    style={{ cursor: "pointer", background: selected?.from_number === chat.from_number ? colors.red : undefined }}
                    onClick={() => openChat(chat)}
                  >
                    <td>{chat.customer_id || ""}</td>
                    <td>{chat.name || ""}</td>
                    <td>{chat.from_number}</td>
                    <td>{/* You can count sessions here if you wish */}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Sessions & Messages */}
        {selected && (
          <div style={{ flex: 1, background: colors.card, borderRadius: 8, padding: 18, minWidth: 350 }}>
            <button onClick={() => setSelected(null)} style={{ float: "right", marginBottom: 8 }}>X</button>
            <h3 style={{ color: colors.red, fontWeight: 700 }}>{selected.name || selected.from_number}</h3>
            <div>
              <strong>Sessions:</strong>
              <ul>
                {sessions.map((session: any) => (
                  <li
                    key={session.id}
                    style={{
                      cursor: "pointer",
                      color: currentSession?.id === session.id ? colors.red : undefined,
                      fontWeight: currentSession?.id === session.id ? 700 : 400,
                    }}
                    onClick={() => openSession(session)}
                  >
                    {session.ticket} {session.end_ts ? "(Closed)" : "(Open)"}
                  </li>
                ))}
              </ul>
            </div>
            {/* Messages in session */}
            <div style={{ margin: "18px 0", minHeight: 120 }}>
              {messages.map((m: any) => (
                <div key={m.id} style={{
                  marginBottom: 8,
                  textAlign: m.direction === "outgoing" ? "right" : "left",
                  color: m.direction === "outgoing" ? colors.red : colors.text,
                  background: "#f9f9f9",
                  borderRadius: 5,
                  padding: "4px 10px"
                }}>
                  <div>{m.body}</div>
                  <div style={{ fontSize: 10, color: "#888" }}>
                    {new Date(m.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            {/* Reply box only if open session */}
            {currentSession && !currentSession.end_ts && (
              <div style={{ marginTop: 14 }}>
                <textarea
                  style={{ width: "100%", minHeight: 36, marginBottom: 10, borderRadius: 6, padding: 8, fontSize: 15 }}
                  placeholder="Type reply..."
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  disabled={sending}
                />
                <button
                  onClick={sendMessage}
                  style={{ background: colors.red, color: "#fff", border: "none", borderRadius: 7, padding: "6px 18px", fontWeight: 700, fontSize: 15, marginRight: 10, opacity: sending ? 0.5 : 1, cursor: "pointer" }}
                  disabled={sending}
                >Send</button>
                <button
                  onClick={closeSession}
                  style={{ background: "#888", color: "#fff", border: "none", borderRadius: 7, padding: "6px 18px", fontWeight: 700, fontSize: 15, cursor: "pointer" }}
                >Close Session</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
