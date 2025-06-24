import { API_BASE } from "./config";
import { useEffect, useState } from "react";

export default function UnlinkedClientsPage({ colors }: any) {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
fetch(`${API_BASE}/api/unlinked-clients`)
  .then((res) => res.json())
      .then((data) => {
        setClients(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch unlinked clients.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: 48, color: colors.sub }}>Loading...</div>;
  if (error) return <div style={{ padding: 48, color: colors.red }}>{error}</div>;

  if (!clients.length) {
    return <div style={{ padding: 48, color: colors.sub }}>No unlinked clients found.</div>;
  }

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ color: colors.text, fontWeight: 600, fontSize: 22, marginBottom: 18 }}>Unlinked Clients</h2>
      <table style={{ width: "100%", background: colors.card, borderRadius: 10, boxShadow: "0 2px 10px #0001" }}>
        <thead>
          <tr style={{ background: colors.bg, color: colors.sub }}>
            <th style={{ textAlign: "left", padding: "10px 18px" }}>Phone</th>
            <th style={{ textAlign: "left", padding: "10px 18px" }}>Name</th>
            <th style={{ textAlign: "left", padding: "10px 18px" }}>Email</th>
            <th style={{ textAlign: "left", padding: "10px 18px" }}>Last Message</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((c, i) => (
            <tr key={c.from_number || i}>
              <td style={{ padding: "10px 18px", color: colors.text }}>{c.from_number}</td>
              <td style={{ padding: "10px 18px", color: colors.text }}>{c.name || <span style={{ color: colors.sub }}>—</span>}</td>
              <td style={{ padding: "10px 18px", color: colors.text }}>{c.email || <span style={{ color: colors.sub }}>—</span>}</td>
              <td style={{ padding: "10px 18px", color: colors.text }}>{c.last_msg ? new Date(Number(c.last_msg)).toLocaleString() : <span style={{ color: colors.sub }}>—</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
