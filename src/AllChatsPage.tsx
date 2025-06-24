import { useEffect, useState } from "react";
import { API_BASE } from "./config";
import ChatPanel   from "./ChatPanel";

export default function AllChatsPage({ colors }: any) {
  const [chats, setChats]       = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [showClosed, setShowClosed] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  // Fetch either open or closed chats
  useEffect(() => {
    setLoading(true);
    const path = showClosed ? "api/closed-chats" : "api/chats";
    fetch(`${API_BASE}/${path}`)
      .then(res => {
        if (!res.ok) throw new Error();
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
  }, [showClosed]);

  if (loading) return <div style={{ padding: 48, color: colors.sub }}>Loading…</div>;
  if (error)   return <div style={{ padding: 48, color: colors.red }}>{error}</div>;

  return (
    <div style={{ display: "flex", flex: 1, height: "100%", overflow: "hidden" }}>
      {/* Left: chat list */}
      <div style={{
        width: 380,
        padding: 32,
        boxSizing: "border-box",
        overflowY: "auto",
        borderRight: `1px solid ${colors.border}`
      }}>
        <button
          onClick={() => setShowClosed(s => !s)}
          style={{
            width: "100%",
            marginBottom: 16,
            padding: "8px 0",
            border: `1.5px solid ${colors.red}`,
            borderRadius: 8,
            background: showClosed ? colors.red : colors.card,
            color: showClosed ? "#fff" : colors.red,
            fontWeight: 700,
            cursor: "pointer"
          }}
        >
          {showClosed ? "Show Open Chats" : "Show Closed Chats"}
        </button>

        <table style={{
          width: "100%",
          background: colors.card,
          borderRadius: 10,
          boxShadow: "0 2px 10px #0001"
        }}>
          <thead>
            <tr style={{ background: colors.bg, color: colors.sub }}>
              <th style={{ textAlign: "left", padding: "10px 12px" }}>Phone</th>
              <th style={{ textAlign: "left", padding: "10px 12px" }}>Name</th>
              <th style={{ textAlign: "left", padding: "10px 12px" }}>Email</th>
              <th style={{ textAlign: "left", padding: "10px 12px" }}>Last Message</th>
              <th style={{ textAlign: "left", padding: "10px 12px" }}>Tag</th>
              <th style={{ textAlign: "left", padding: "10px 12px" }}>Unread</th>
            </tr>
          </thead>
          <tbody>
            {chats.map((c, i) => (
              <tr
                key={c.from_number || i}
                onClick={() => setSelected(c)}
                style={{
                  cursor: "pointer",
                  background: selected?.from_number === c.from_number
                    ? "#ffe6ea"
                    : undefined
                }}
              >
                <td style={{ padding: "10px 12px", color: colors.text }}>
                  {c.from_number}
                </td>
                <td style={{ padding: "10px 12px", color: colors.text }}>
                  {c.customer_id && c.name
                    ? `[${c.customer_id}] ${c.name}`
                    : c.name || <span style={{ color: colors.sub }}>—</span>}
                </td>
                <td style={{ padding: "10px 12px", color: colors.text }}>
                  {c.email || <span style={{ color: colors.sub }}>—</span>}
                </td>
                <td style={{ padding: "10px 12px", color: colors.text }}>
                  {c.last_message || <span style={{ color: colors.sub }}>—</span>}
                </td>
                <td style={{ padding: "10px 12px", color: colors.text }}>
                  {c.tag || <span style={{ color: colors.sub }}>—</span>}
                </td>
                <td style={{ padding: "10px 12px", color: colors.red, fontWeight:700 }}>
                  {c.unread_count || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Right: chat panel */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <ChatPanel
          phone={selected?.from_number}
          contact={selected}
          colors={colors}
          onCloseChat={() => {
            // clear selection on close
            fetch(`${API_BASE}/api/close-chat`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ phone: selected.from_number })
            }).then(() => setSelected(null));
          }}
        />
      </div>
    </div>
  );
}
