import { useEffect, useState } from "react";
import { API_BASE } from "./config";
import ChatPanel from "./ChatPanel";

export default function AllChatsPage({ colors }: any) {
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<any | null>(null);

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
    <div style={{ padding: 32, display: "flex", gap: 40 }}>
      {/* Chat list */}
      <div>
        <h2 style={{ color: colors.text, fontWeight: 600, fontSize: 22, marginBottom: 18 }}>All Chats</h2>
        <table style={{
          width: 380,
          background: colors.card,
          borderRadius: 10,
          boxShadow: "0 2px 10px #0001",
          minWidth: 350
        }}>
          <thead>
            <tr style={{ background: colors.bg, color: colors.sub }}>
              <th style={{ textAlign: "left", padding: "10px 16px" }}>Phone</th>
              <th style={{ textAlign: "left", padding: "10px 16px" }}>Name</th>
              <th style={{ textAlign: "left", padding: "10px 16px" }}>Unread</th>
            </tr>
          </thead>
          <tbody>
            {chats.map((c, i) => (
              <tr
                key={c.from_number || i}
                style={{
                  background: selected?.from_number === c.from_number ? colors.bg : "none",
                  cursor: "pointer"
                }}
                onClick={() => setSelected(c)}
              >
                <td style={{ padding: "10px 16px", color: colors.text }}>{c.from_number}</td>
                <td style={{ padding: "10px 16px", color: colors.text }}>{c.name || <span style={{ color: colors.sub }}>—</span>}</td>
                <td style={{ padding: "10px 16px", color: colors.red, fontWeight: 700 }}>{c.unread_count || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Chat panel */}
      <div style={{ flex: 1 }}>
        <ChatPanel phone={selected?.from_number} contact={selected} colors={colors} />
      </div>
    </div>
  );
}
