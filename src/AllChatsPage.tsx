import { useEffect, useState } from "react";
import { API_BASE } from "./config";
import ChatPanel   from "./ChatPanel";

export default function AllChatsPage({ colors }: any) {
  const [chats, setChats]     = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [showClosed, setShowClosed] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/${showClosed ? "api/closed-chats" : "api/chats"}`)
      .then(r => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(data => setChats(data))
      .catch(() => setError("Failed to load chats."))
      .finally(() => setLoading(false));
  }, [showClosed]);

  if (loading) return <div style={{ padding: 48, color: colors.sub }}>Loading…</div>;
  if (error)   return <div style={{ padding: 48, color: colors.red }}>{error}</div>;

  return (
    <div style={{
      display: "flex",
      width: "100%",
      height: "calc(100vh - 0px)",  // adjust if you have a top bar
      overflow: "hidden"
    }}>
      {/* Left column */}
      <div style={{
        width: 380,
        borderRight: `1px solid ${colors.border}`,
        overflowY: "auto",
        padding: "32px 16px",
        boxSizing: "border-box",
        background: colors.bg
      }}>
        <button
          onClick={() => setShowClosed(s => !s)}
          style={{
            width: "100%",
            padding: "10px 0",
            marginBottom: 16,
            border: `1.5px solid ${colors.red}`,
            borderRadius: 8,
            background: showClosed ? colors.red : colors.card,
            color: showClosed ? "#fff" : colors.red,
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          {showClosed ? "Show Open Chats" : "Show Closed Chats"}
        </button>

        <table style={{
          width: "100%",
          background: colors.card,
          borderRadius: 8,
          boxShadow: "0 2px 8px #0001"
        }}>
          <thead>
            <tr style={{ background: colors.bg, color: colors.sub }}>
              {["Phone","Name","Email","Last Message","Tag","Unread"].map(h => (
                <th
                  key={h}
                  style={{ textAlign: "left", padding: "8px 12px", fontSize:14 }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chats.map((c,i) => (
              <tr
                key={i}
                onClick={() => setSelected(c)}
                style={{
                  cursor: "pointer",
                  background: selected?.from_number === c.from_number
                    ? "#ffe6ea"
                    : undefined
                }}
              >
                <td style={{ padding: "8px 12px", fontSize:14, color: colors.text }}>
                  {c.from_number}
                </td>
                <td style={{ padding: "8px 12px", fontSize:14, color: colors.text }}>
                  {c.customer_id && c.name
                    ? `[${c.customer_id}] ${c.name}`
                    : c.name || <span style={{ color: colors.sub }}>—</span>}
                </td>
                <td style={{ padding: "8px 12px", fontSize:14, color: colors.text }}>
                  {c.email || <span style={{ color: colors.sub }}>—</span>}
                </td>
                <td style={{ padding: "8px 12px", fontSize:14, color: colors.text }}>
                  {c.last_message || <span style={{ color: colors.sub }}>—</span>}
                </td>
                <td style={{ padding: "8px 12px", fontSize:14, color: colors.text }}>
                  {c.tag || <span style={{ color: colors.sub }}>—</span>}
                </td>
                <td style={{ padding: "8px 12px", fontSize:14, color: colors.red, fontWeight:700 }}>
                  {c.unread_count || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Right column */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}>
        <ChatPanel
          phone={selected?.from_number}
          contact={selected}
          colors={colors}
          onCloseChat={() => {
            if (!selected) return;
            fetch(`${API_BASE}/api/close-chat`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ phone: selected.from_number }),
            }).then(() => setSelected(null));
          }}
        />
      </div>
    </div>
  );
}
