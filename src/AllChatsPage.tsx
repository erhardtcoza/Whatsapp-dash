import { useEffect, useState, useRef } from "react";
import { API_BASE } from "./config";

export default function AllChatsPage({ colors }: any) {
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
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
          m =>
            m.timestamp >= selectedSession.start_ts &&
            (selectedSession.end_ts === null || m.timestamp <= selectedSession.end_ts)
        );
        setMessages(filtered);
        setTimeout(() => scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight), 50);
      });
  }, [selectedSession, selectedCustomer]);

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
          {customers.map(cust => (
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

      {/* SESSION LIST */}
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
              <table style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left" }}>Ticket</th>
                    <th style={{ textAlign: "left" }}>Department</th>
                    <th style={{ textAlign: "left" }}>Started</th>
                    <th style={{ textAlign: "left" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map(sess => (
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
                marginTop: 32,
                padding: 18,
                border: `1px solid ${colors.border}`,
                borderRadius: 8,
                background: "#fafbfc",
              }}>
                <div style={{ fontWeight: 600, marginBottom: 10 }}>
                  Session: {selectedSession.ticket}
                  <span style={{
                    color: selectedSession.end_ts ? colors.sub : "green",
                    marginLeft: 16,
                    fontSize: 13
                  }}>
                    {selectedSession.end_ts ? "Closed" : "Open"}
                  </span>
                </div>
                <div
                  ref={scrollRef}
                  style={{ maxHeight: 250, overflowY: "auto", marginBottom: 10 }}
                >
                  {messages.map(m => (
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
