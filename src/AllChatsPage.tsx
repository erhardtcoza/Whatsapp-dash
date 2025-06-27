import { useEffect, useState, useRef } from "react";
import { API_BASE } from "./config";

export default function AllChatsPage({ colors }: any) {
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [reply, setReply] = useState("");
  const [closing, setClosing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load customers
  useEffect(() => {
    fetch(`${API_BASE}/api/all-customers-with-sessions`)
      .then(r => r.json())
      .then(setCustomers);
  }, []);

  // Load sessions when customer is selected
  useEffect(() => {
    setSelectedSession(null);
    setMessages([]);
    if (!selectedCustomer) return;
    fetch(`${API_BASE}/api/chat-sessions?phone=${selectedCustomer.phone}`)
      .then(r => r.json())
      .then(setSessions);
  }, [selectedCustomer]);

  // Load messages for a session
  useEffect(() => {
    setMessages([]);
    if (!selectedSession || !selectedCustomer) return;
    fetch(`${API_BASE}/api/messages?phone=${selectedCustomer.phone}`)
      .then(r => r.json())
      .then(msgs => {
        // filter to only messages in this session
        const filtered = msgs.filter(
          (m: any) =>
            m.timestamp >= selectedSession.start_ts &&
            (selectedSession.end_ts === null || m.timestamp <= selectedSession.end_ts)
        );
        setMessages(filtered);
        setTimeout(() => scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight), 50);
      });
  }, [selectedSession, selectedCustomer]);

  // Send reply to this session
  async function sendReply() {
    if (!selectedSession || !selectedCustomer || !reply.trim()) return;
    await fetch(`${API_BASE}/api/send-message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: selectedCustomer.phone, body: reply.trim() }),
    });
    setReply("");
    // Reload messages
    fetch(`${API_BASE}/api/messages?phone=${selectedCustomer.phone}`)
      .then(r => r.json())
      .then(msgs => {
        const filtered = msgs.filter(
          (m: any) =>
            m.timestamp >= selectedSession.start_ts &&
            (selectedSession.end_ts === null || m.timestamp <= selectedSession.end_ts)
        );
        setMessages(filtered);
        setTimeout(() => scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight), 50);
      });
  }

  // Close session
  async function closeSession() {
    if (!selectedSession) return;
    setClosing(true);
    await fetch(`${API_BASE}/api/close-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticket: selectedSession.ticket }),
    });
    // Optionally send "session closed" message here if not already handled by backend
    setSelectedSession({
      ...selectedSession,
      end_ts: Date.now(),
    });
    // Refresh sessions
    fetch(`${API_BASE}/api/chat-sessions?phone=${selectedCustomer.phone}`)
      .then(r => r.json())
      .then(setSessions);
    setClosing(false);
  }

  return (
    <div style={{ display: "flex", padding: 32, gap: 32 }}>
      {/* CUSTOMER LIST */}
      <div style={{ width: 400 }}>
        <h3 style={{ color: colors.red, fontWeight: 700, marginBottom: 12 }}>
          Customers
        </h3>
        <div style={{
          background: colors.card,
          borderRadius: 8,
          maxHeight: "75vh",
          overflowY: "auto",
          border: `1px solid ${colors.border}`,
        }}>
          {customers.map((cust: any) => (
            <div
              key={cust.phone}
              onClick={() => setSelectedCustomer(cust)}
              style={{
                padding: "12px 14px",
                cursor: "pointer",
                background: selectedCustomer?.phone === cust.phone ? colors.sidebarSel : "none",
                color: selectedCustomer?.phone === cust.phone ? "#fff" : colors.text,
                borderBottom: `1px solid ${colors.border}`,
                display: "flex",
                flexDirection: "column"
              }}
            >
              <div style={{ fontWeight: 600 }}>
                [{cust.customer_id || "-"}] {cust.name || "(No name)"}
              </div>
              <div style={{ fontSize: 13, color: colors.sub }}>
                {cust.phone} · {cust.session_count || 0} sessions
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SESSION LIST & CHAT */}
      <div style={{
        flex: 1,
        background: colors.card,
        borderRadius: 8,
        border: `1px solid ${colors.border}`,
        padding: 24,
        minHeight: 360,
      }}>
        {selectedCustomer ? (
          <>
            <div style={{ marginBottom: 10 }}>
              <b>{selectedCustomer.name || "(No name)"}</b> — <span style={{ color: colors.sub }}>{selectedCustomer.phone}</span>
            </div>
            <h4 style={{ margin: "10px 0" }}>Sessions:</h4>
            {sessions.length === 0 ? (
              <div style={{ color: colors.sub }}>No sessions for this customer.</div>
            ) : (
              <table style={{ width: "100%", marginBottom: 18 }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left" }}>Ticket</th>
                    <th style={{ textAlign: "left" }}>Department</th>
                    <th style={{ textAlign: "left" }}>Started</th>
                    <th style={{ textAlign: "left" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((sess: any) => (
                    <tr
                      key={sess.ticket}
                      style={{
                        background: selectedSession?.ticket === sess.ticket ? colors.sidebarSel : undefined,
                        color: selectedSession?.ticket === sess.ticket ? "#fff" : undefined,
                        cursor: "pointer"
                      }}
                      onClick={() => setSelectedSession(sess)}
                    >
                      <td>{sess.ticket}</td>
                      <td>{sess.department}</td>
                      <td>{new Date(sess.start_ts).toLocaleString()}</td>
                      <td>{sess.end_ts ? "Closed" : "Open"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {/* SESSION CHAT VIEW */}
            {selectedSession && (
              <div style={{
                marginTop: 12,
                padding: 18,
                border: `1px solid ${colors.border}`,
                borderRadius: 8,
                background: "#fafbfc",
                display: "flex",
                flexDirection: "column",
                minHeight: 220,
              }}>
                <div style={{ fontWeight: 600, marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    Session: {selectedSession.ticket}
                    <span style={{
                      color: selectedSession.end_ts ? colors.sub : "green",
                      marginLeft: 16,
                      fontSize: 13
                    }}>
                      {selectedSession.end_ts ? "Closed" : "Open"}
                    </span>
                  </div>
                  {selectedSession.end_ts === null && (
                    <button
                      style={{
                        background: colors.red,
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        padding: "6px 14px",
                        fontWeight: 600,
                        cursor: closing ? "wait" : "pointer",
                        opacity: closing ? 0.7 : 1,
                      }}
                      onClick={closeSession}
                      disabled={closing}
                    >
                      Close Session
                    </button>
                  )}
                </div>
                <div
                  ref={scrollRef}
                  style={{ maxHeight: 250, overflowY: "auto", marginBottom: 10 }}
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
                  {messages.length === 0 && (
                    <div style={{ color: colors.sub }}>No messages in this session.</div>
                  )}
                </div>
                {/* Reply input (only for open sessions) */}
                {selectedSession.end_ts === null && (
                  <div style={{
                    borderTop: `1px solid ${colors.border}`,
                    padding: 8,
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
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
                      onKeyDown={e => { if (e.key === "Enter") sendReply(); }}
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
                )}
              </div>
            )}
          </>
        ) : (
          <div style={{ color: colors.sub, padding: 60, textAlign: "center" }}>
            Select a customer to see all their sessions.
          </div>
        )}
      </div>
    </div>
  );
}
