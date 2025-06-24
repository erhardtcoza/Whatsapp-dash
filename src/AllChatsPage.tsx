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
    <div style={{ 
      display: "flex", 
      flexDirection: "column",
      height: "100vh", 
      overflow: "hidden",
      padding: 20,
      boxSizing: "border-box"
    }}>
      {/* Chats List (top) */}
      <div style={{ 
        flex: "0 0 auto", 
        overflowY: "auto",
        marginBottom: 20,
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        background: colors.card
      }}>
        <div style={{ padding: 16 }}>
          <button
            onClick={() => setShowClosed(s => !s)}
            style={{
              padding: "8px 16px",
              marginBottom: "10px",
              background: showClosed ? colors.red : colors.card,
              color: showClosed ? "#fff" : colors.red,
              border: `1px solid ${colors.red}`,
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            {showClosed ? "Show Open Chats" : "Show Closed Chats"}
          </button>

          {toast && (
            <div style={{
              background: colors.red,
              color: "#fff",
              borderRadius: 6,
              padding: "8px",
              textAlign: "center",
              fontWeight: "bold",
              marginBottom: 10
            }}>
              {toast}
            </div>
          )}

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: colors.bg, color: colors.sub }}>
                <th style={{ padding: "8px", textAlign: "left" }}>Phone</th>
                <th style={{ padding: "8px", textAlign: "left" }}>Name</th>
                <th style={{ padding: "8px", textAlign: "left" }}>Email</th>
                <th style={{ padding: "8px", textAlign: "left" }}>Last Message</th>
                <th style={{ padding: "8px", textAlign: "left" }}>Tag</th>
                <th style={{ padding: "8px", textAlign: "left" }}>Unread</th>
              </tr>
            </thead>
            <tbody>
              {chats.map((c, i) => (
                <tr
                  key={c.from_number || i}
                  onClick={() => setSelected(c)}
                  style={{
                    cursor: "pointer",
                    background: selected?.from_number === c.from_number ? "#ffe6ea" : undefined,
                  }}
                >
                  <td style={{ padding: "8px" }}>{c.from_number}</td>
                  <td style={{ padding: "8px" }}>
                    {c.customer_id && c.name
                      ? `[${c.customer_id}] ${c.name}`
                      : c.name || <span style={{ color: colors.sub }}>—</span>}
                  </td>
                  <td style={{ padding: "8px" }}>
                    {c.email || <span style={{ color: colors.sub }}>—</span>}
                  </td>
                  <td style={{ padding: "8px" }}>
                    {c.last_message || <span style={{ color: colors.sub }}>—</span>}
                  </td>
                  <td style={{ padding: "8px" }}>
                    {c.tag || <span style={{ color: colors.sub }}>—</span>}
                  </td>
                  <td style={{ padding: "8px", color: colors.red, fontWeight: "bold" }}>
                    {c.unread_count || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chat Panel (bottom) */}
      <div style={{ 
        flex: "1", 
        overflow: "hidden", 
        display: "flex", 
        flexDirection: "column", 
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        background: colors.card
      }}>
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
