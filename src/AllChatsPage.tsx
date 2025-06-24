import { useEffect, useState } from "react";
import { API_BASE } from "./config";
import ChatPanel from "./ChatPanel"; // Make sure this import exists

export default function AllChatsPage({ colors, darkMode }: any) {
  const [chats, setChats] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
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
        if (data.length && !selected) setSelected(data[0]);
      })
      .catch(() => {
        setError("Failed to fetch chats.");
        setLoading(false);
      });
    // eslint-disable-next-line
  }, []);

  if (loading) return <div style={{ padding: 48, color: colors.sub }}>Loading...</div>;
  if (error) return <div style={{ padding: 48, color: colors.red }}>{error}</div>;

  return (
    <div style={{ display: "flex", gap: 30 }}>
      <div style={{ flex: "0 0 370px" }}>
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
              <tr
                key={c.from_number || i}
                style={{
                  background: selected?.from_number === c.from_number ? colors.sidebarSel : "none",
                  color: selected?.from_number === c.from_number ? "#fff" : colors.text,
                  cursor: "pointer"
                }}
                onClick={() => setSelected(c)}
              >
                <td style={{ padding: "10px 18px" }}>{c.from_number}</td>
                <td style={{ padding: "10px 18px" }}>{c.name || <span style={{ color: colors.sub }}>—</span>}</td>
                <td style={{ padding: "10px 18px" }}>{c.email || <span style={{ color: colors.sub }}>—</span>}</td>
                <td style={{ padding: "10px 18px" }}>{c.last_message || <span style={{ color: colors.sub }}>—</span>}</td>
                <td style={{ padding: "10px 18px" }}>{c.tag || <span style={{ color: colors.sub }}>—</span>}</td>
                <td style={{ padding: "10px 18px", color: colors.red }}>{c.unread_count || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ flex: 1 }}>
        {selected ? (
          <ChatPanel
            chat={selected}
            colors={colors}
            darkMode={darkMode}
            key={selected.from_number}
          />
        ) : (
          <div style={{ padding: 40, color: colors.sub }}>Select a chat to view</div>
        )}
      </div>
    </div>
  );
}
