import { useEffect, useState } from "react";
import ChatPanel from "./ChatPanel";
import { API_BASE } from "./config";

export default function AllChatsPage({ colors, darkMode }: any) {
  const [chats, setChats] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/api/chats`)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setChats(data);
        if (data.length) setSelected(data[0]);
      })
      .catch(() => setError("Failed to fetch chats."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ padding: 32, color: colors.sub }}>Loading…</div>;
  }
  if (error) {
    return <div style={{ padding: 32, color: colors.red }}>{error}</div>;
  }

  return (
    <div style={{ display: "flex", gap: 40, padding: "0 40px 20px 40px" }}>
      {/* Left: chat list */}
      <div style={{ flex: "0 0 380px" }}>
        <table
          style={{
            width: "100%",
            background: colors.card,
            borderRadius: 10,
            boxShadow: "0 2px 10px #0001",
          }}
        >
          <thead>
            <tr style={{ background: colors.bg, color: colors.sub }}>
              <th style={{ textAlign: "left", padding: "10px 16px" }}>Phone</th>
              <th style={{ textAlign: "left", padding: "10px 16px" }}>Name</th>
              <th style={{ textAlign: "left", padding: "10px 16px" }}>Unread</th>
            </tr>
          </thead>
          <tbody>
            {chats.map((c, i) => {
              const isSel = selected?.from_number === c.from_number;
              return (
                <tr
                  key={c.from_number || i}
                  onClick={() => setSelected(c)}
                  style={{
                    background: isSel ? colors.sidebarSel : "none",
                    color: isSel ? "#fff" : colors.text,
                    cursor: "pointer",
                  }}
                >
                  <td style={{ padding: "10px 16px" }}>{c.from_number}</td>
                  <td style={{ padding: "10px 16px" }}>
                    {c.name || <span style={{ color: colors.sub }}>—</span>}
                  </td>
                  <td
                    style={{
                      padding: "10px 16px",
                      color: colors.red,
                      fontWeight: 700,
                    }}
                  >
                    {c.unread_count || 0}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Right: chat panel */}
      <div style={{ flex: 1 }}>
        {selected ? (
          <ChatPanel
            phone={selected.from_number}
            contact={selected}
            colors={colors}
            darkMode={darkMode}
            key={selected.from_number}
          />
        ) : (
          <div style={{ padding: 32, color: colors.sub }}>
            Select a chat to view.
          </div>
        )}
      </div>
    </div>
  );
}
