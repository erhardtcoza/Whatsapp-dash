import { useEffect, useState } from "react";
import { API_BASE } from "./config";

export default function AllChatsPage({ colors }: any) {
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/api/chats`)
      .then(res => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then(data => {
        setChats(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch chats.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: 48, color: colors.sub }}>Loading...</div>;
  if (error) return <div style={{ padding: 48, color: colors.red }}>{error}</div>;

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ color: colors.text, fontWeight: 600, fontSize: 22, marginBottom: 18 }}>All Chats</h2>
      <table style={{ width: "100%", background: colors.card, borderRadius: 10, boxShadow: "0 2px 10px #0001" }}>
        <thead>
          <tr style={{ background: colors.bg, color: colors.sub }}>
            <th style={{ textAlign: "left", padding: "10px 18px" }}>Phone</th>
            <th style={{ textAlign: "left", padding: "10px 18px" }}>Name</th>
            <th style={{ textAlign: "left", padding: "10px 18px" }}>Email</th>
            <th style={{ textAlign: "left", padding: "10px 18px" }}>Last Message</th>
            <th style={{ textAlign: "left", padding: "10px 18px" }}>Tag</th>
            <th style={{ textAlign: "left", padding: "10px 18px" }}>Unread</th>
          </tr>
        </thead>
        <tbody>
          {chats.map((c, i) => (
            <tr key={c.from_number || i}>
              <td style={{ padding: "10px 18px", color: colors.text }}>{c.from_number}</td>
              <td style={{ padding: "10px 18px", color: colors.text }}>{c.name || <span style={{ color: colors.sub }}>—</span>}</td>
              <td style={{ padding: "10px 18px", color: colors.text }}>{c.email || <span style={{ color: colors.sub }}>—</span>}</td>
              <td style={{ padding: "10px 18px", color: colors.text }}>{c.last_message || <span style={{ color: colors.sub }}>—</span>}</td>
              <td style={{ padding: "10px 18px", color: colors.text }}>{c.tag || <span style={{ color: colors.sub }}>—</span>}</td>
              <td style={{ padding: "10px 18px", color: colors.red }}>{c.unread_count || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
