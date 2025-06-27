import { useEffect, useState } from "react";
import { API_BASE } from "./config";

export default function AllChatsPage({ colors }: any) {
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 1. Load all customers with session count
  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/api/all-customers-with-sessions`)
      .then(r => r.json())
      .then(data => {
        setCustomers(data);
        setLoading(false);
      });
  }, []);

  // 2. When a customer is selected, load their sessions
  useEffect(() => {
    if (!selectedCustomer) return;
    fetch(`${API_BASE}/api/chat-sessions?phone=${selectedCustomer.phone}`)
      .then(r => r.json())
      .then(setSessions);
  }, [selectedCustomer]);

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
          {loading && (
            <div style={{ padding: 20, color: colors.sub }}>Loading...</div>
          )}
          {!loading && customers.length === 0 && (
            <div style={{ padding: 20, color: colors.sub }}>No customers found</div>
          )}
          {!loading && customers.map(cust => (
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

      {/* SESSION LIST FOR SELECTED CUSTOMER */}
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
                    <tr key={sess.ticket}>
                      <td>{sess.ticket}</td>
                      <td>{sess.department}</td>
                      <td>{new Date(sess.start_ts).toLocaleString()}</td>
                      <td>{sess.end_ts ? "Closed" : "Open"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
