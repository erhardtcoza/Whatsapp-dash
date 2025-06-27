import { useEffect, useState, useRef } from "react";
import { API_BASE } from "./config";

export default function AccountsPage({ colors, darkMode }: any) {
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [reply, setReply] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // fetch open account sessions
  useEffect(() => {
    fetch(`${API_BASE}/api/accounts-chats`)
      .then((r) => r.json())
      .then(setSessions);
  }, []);

  // when you select a session, load its messages
  useEffect(() => {
    if (!selectedPhone) return;
    fetch(`${API_BASE}/api/messages?phone=${selectedPhone}`)
      .then((r) => r.json())
      .then((msgs) => {
        setMessages(msgs);
        // scroll to bottom after a tick
        setTimeout(() => scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight), 50);
      });
  }, [selectedPhone]);

  // send a reply
  async function sendReply() {
    if (!selectedPhone || !reply.trim()) return;
    await fetch(`${API_BASE}/api/send-message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: selectedPhone, body: reply.trim() }),
    });
    setReply("");
    // reload
    const r = await fetch(`${API_BASE}/api/messages?phone=${selectedPhone}`);
    const msgs = await r.json();
    setMessages(msgs);
    setTimeout(() => scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight), 50);
  }

  return (
    <div style={{ display: "flex", padding: 32, gap: 32 }}>
      {/* Sidebar list of open sessions */}
      <div style={{ width: 280 }}>
        <h3 style={{ color: colors.red, fontWeight: 700, marginBottom: 12 }}>
          Open Accounts Sessions
        </h3>
        <div style={{
          background: colors.card,
          borderRadius: 8,
          maxHeight: "75vh",
          overflowY: "auto",
          border: `1px solid ${colors.border}`,
        }}>
          {sessions.map((s) => (
            <div
              key={s.from_number}
              onClick={() => setSelectedPhone(s.from_number)}
              style={{
                padding: "10px 14px",
                cursor: "pointer",
                background: selectedPhone === s.from_number ? colors.sidebarSel : "none",
                color: selectedPhone === s.from_number ? "#fff" : colors.text,
                borderBottom: `1px solid ${colors.border}`,
              }}
            >
              <div style={{ fontWeight: 600 }}>{s.customer_id} – {s.name || "No Name"}</div>
              <div style={{ fontSize: 13, color: colors.sub }}>
                {s.from_number} · Last: {new Date(s.last_ts).toLocaleString()}
              </div>
            </div>
          ))}
          {sessions.length === 0 && (
            <div style={{ padding: 20, color: colors.sub }}>No open sessions</div>
          )}
        </div>
      </div>

      {/* Chat window */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: colors.card,
        borderRadius: 8,
        border: `1px solid ${colors.border}`,
        overflow: "hidden",
      }}>
        {selectedPhone ? (
          <>
            {/* Messages */}
            <div
              ref={scrollRef}
              style={{ flex: 1, padding: 16, overflowY: "auto" }}
            >
              {messages.map((m: any) => (
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

            {/* Reply box */}
            <div style={{
              borderTop: `1px solid ${colors.border}`,
              padding: 12,
              display: "flex",
              gap: 8,
            }}>
              <input
                value={reply}
                onChange={(e) => setReply(e.target.value)}
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
            Select a session to view and interact.
          </div>
        )}
      </div>
    </div>
  );
}
