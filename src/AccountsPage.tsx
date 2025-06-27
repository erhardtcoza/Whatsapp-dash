// src/AccountsPage.tsx
import { useEffect, useState, useRef } from "react";
import { API_BASE } from "./config";

interface Session {
  ticket: string;
  phone: string;
  name: string;
  customer_id: string;
  department: string;
  start_ts: number;
  end_ts: number | null;
}

export default function AccountsPage({ colors }: any) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selected, setSelected] = useState<Session | null>(null);
  const [allMessages, setAllMessages] = useState<any[]>([]);
  const [reply, setReply] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1) load open account sessions
  useEffect(() => {
    fetch(`${API_BASE}/api/accounts-chatsessions`)
      .then(r => r.json())
      .then(setSessions);
  }, []);

  // 2) when a session is selected, load ALL messages for that phone
  useEffect(() => {
    if (!selected) return;
    fetch(`${API_BASE}/api/messages?phone=${selected.phone}`)
      .then(r => r.json())
      .then(msgs => {
        setAllMessages(msgs);
        // scroll after render
        setTimeout(() => scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight), 50);
      });
  }, [selected]);

  // 3) compute only the messages in this session
  const sessionMessages = selected
    ? allMessages.filter(m =>
        m.timestamp >= selected.start_ts &&
        (selected.end_ts === null || m.timestamp <= selected.end_ts)
      )
    : [];

  // 4) send a reply
  async function sendReply() {
    if (!selected || !reply.trim()) return;
    await fetch(`${API_BASE}/api/send-message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: selected.phone, body: reply.trim() }),
    });
    setReply("");
    // reload that session's messages
    const msgs = await fetch(`${API_BASE}/api/messages?phone=${selected.phone}`).then(r => r.json());
    setAllMessages(msgs);
    setTimeout(() => scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight), 50);
  }

  // 5) close session
  async function closeSession() {
    if (!selected) return;
    // 5a) close on server
    await fetch(`${API_BASE}/api/close-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticket: selected.ticket }),
    });
    // 5b) notify user
    await fetch(`${API_BASE}/api/send-message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: selected.phone,
        body: "This chat session has been closed. To start a new one, just say hi!"
      }),
    });
    // 5c) reset selection & reload sessions
    setSelected(null);
    setSessions(await fetch(`${API_BASE}/api/accounts-chatsessions`).then(r => r.json()));
  }

  return (
    <div style={{ display: "flex", padding: 32, gap: 32 }}>
      {/* SESSION LIST */}
      <div style={{ width: 300 }}>
        <h3 style={{ color: colors.red, fontWeight: 700, marginBottom: 12 }}>
          Accounts Sessions
        </h3>
        <div style={{
          background: colors.card,
          borderRadius: 8,
          maxHeight: "75vh",
          overflowY: "auto",
          border: `1px solid ${colors.border}`,
        }}>
          {sessions.map(sess => (
            <div
              key={sess.ticket}
              onClick={() => setSelected(sess)}
              style={{
                padding: "10px 14px",
                cursor: "pointer",
                background: selected?.ticket === sess.ticket ? colors.sidebarSel : "none",
                color: selected?.ticket === sess.ticket ? "#fff" : colors.text,
                borderBottom: `1px solid ${colors.border}`,
              }}
            >
              <div style={{ fontWeight: 600 }}>
                [{sess.customer_id}] {sess.name}
              </div>
              <div style={{ fontSize: 13, color: colors.sub }}>
                {sess.ticket} · {new Date(sess.start_ts).toLocaleString()}
                {sess.end_ts ? " (closed)" : ""}
              </div>
            </div>
          ))}
          {sessions.length === 0 && (
            <div style={{ padding: 20, color: colors.sub }}>No open sessions</div>
          )}
        </div>
      </div>

      {/* CHAT WINDOW */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: colors.card,
        borderRadius: 8,
        border: `1px solid ${colors.border}`,
        overflow: "hidden",
      }}>
        {selected ? (
          <>
            {/* header with Close Window & Close Session */}
            <div style={{
              padding: "10px 16px",
              borderBottom: `1px solid ${colors.border}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <div style={{ fontWeight: 600 }}>
                Session: {selected.ticket}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => setSelected(null)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: 20,
                    cursor: "pointer",
                    color: colors.sub,
                  }}
                >✕</button>
                <button
                  onClick={closeSession}
                  style={{
                    background: colors.red,
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "6px 12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Close Session
                </button>
              </div>
            </div>

            {/* messages */}
            <div
              ref={scrollRef}
              style={{ flex: 1, padding: 16, overflowY: "auto" }}
            >
              {sessionMessages.map(m => (
                <div
                  key={m.id}
                  style={{
                    display: "flex",
                    justifyContent: m.direction === "outgoing" ? "flex-end" : "flex-start",
                    marginBottom: 8,
                  }}
                >
                  <div style={{
                    background: m.direction === "outgoing" ? colors.msgOut : colors.msgIn,
                    color: m.direction === "outgoing" ? "#fff" : colors.text,
                    padding: "8px 12px",
                    borderRadius: 8,
                    maxWidth: "70%",
                    wordBreak: "break-word",
                  }}>
                    {m.body}
                  </div>
                </div>
              ))}
            </div>

            {/* reply box */}
            <div style={{
              borderTop: `1px solid ${colors.border}`,
              padding: 12,
              display: "flex",
              gap: 8,
            }}>
              <input
                value={reply}
                onChange={e => setReply(e.target.value)}
                placeholder="Type your reply…"
                style={{
                  flex: 1,
                  borderRadius: 6,
                  border: `1px solid ${colors.border}`,
                  padding: "8px 12px",
                  background: colors.input,
                  color: colors.inputText,
                  fontSize: 14,
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
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div style={{ padding: 40, color: colors.sub }}>
            Select a session to open its chat.
          </div>
        )}
      </div>
    </div>
  );
}
