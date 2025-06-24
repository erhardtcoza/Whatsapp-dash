import { useEffect, useState } from "react";
import { API_BASE } from "./config";
import ChatPanel from "./ChatPanel";

export default function AllChatsPage({ colors }: any) {
  const [chats, setChats] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showClosed, setShowClosed] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    setLoading(true);
    const url = showClosed
      ? `${API_BASE}/api/closed-chats`
      : `${API_BASE}/api/chats`;
    fetch(url)
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

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  async function handleCloseChat() {
    if (!selected?.from_number) return;
    await fetch(`${API_BASE}/api/close-chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: selected.from_number }),
    });
    setChats(prev => prev.filter(c => c.from_number !== selected.from_number));
    setSelected(null);
    showToast("Chat closed!");
  }

  if (loading) return <div style={{ padding: 32, color: colors.sub }}>Loading…</div>;
  if (error)   return <div style={{ padding: 32, color: colors.red }}>{error}</div>;

  return (
    <div style={{ display: "flex", gap: 40, padding: "0 40px 20px 40px" }}>
      {/* Left: chats table + toggle */}
      <div style={{ minWidth: 330 }}>
        <div style={{ marginBottom: 18, display: "flex", alignItems: "center", gap: 18 }}>
          <button
            onClick={() => setShowClosed(s => !s)}
            style={{
              background: showClosed ? colors.red : colors.card,
              color: showClosed ? "#fff" : colors.red,
              border: `1.5px solid ${colors.red}`,
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 15,
              padding: "6px 22px",
              cursor: "pointer",
            }}
          >
            {showClosed ? "Show Open Chats" : "Show Closed Chats"}
          </button>
          {toast && (
            <div style={{
              background: colors.red,
              color: "#fff",
              borderRadius: 8,
              padding: "7px 20px",
              fontWeight: 700,
              fontSize: 16,
              boxShadow: "0 2px 8px #0002",
            }}>
              {toast}
            </div>
          )}
        </div>

        <table style={{
          width: "100%",
          background: colors.card,
          borderRadius: 10,
          boxShadow: "0 2px 10px #0001",
        }}>
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
                onClick={() => setSelected(c)}
                style={{
                  background: selected?.from_number === c.from_number ? "#ffe6ea" : undefined,
                  cursor: "pointer",
                }}
              >
                <td style={{ padding: "10px 18px", color: colors.text }}>
                  {c.from_number}
                </td>
                <td style={{ padding: "10px 18px", color: colors.text }}>
                  {c.customer_id && c.name
                    ? `[${c.customer_id}] ${c.name}`
                    : c.name || <span style={{ color: colors.sub }}>—</span>}
                </td>
                <td style={{ padding: "10px 18px", color: colors.text }}>
                  {c.email || <span style={{ color: colors.sub }}>—</span>}
                </td>
                <td style={{ padding: "10px 18px", color: colors.text }}>
                  {c.last_message || <span style={{ color: colors.sub }}>—</span>}
                </td>
                <td style={{ padding: "10px 18px", color: colors.text }}>
                  {c.tag || <span style={{ color: colors.sub }}>—</span>}
                </td>
                <td style={{ padding: "10px 18px", color: colors.red }}>
                  {c.unread_count || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Right: chat panel */}
      <div style={{ flex: 1 }}>
        <ChatPanel
          phone={selected?.from_number}
          contact={selected}
          colors={colors}
          onCloseChat={handleCloseChat}
        />
      </div>
    </div>
  );
}
