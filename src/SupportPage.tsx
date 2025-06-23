import { useEffect, useState } from "react";
import { API_BASE } from "./config";

type Props = {
  colors: any;
  darkMode: boolean;
  onSelectChat: (chat: any) => void;
  selectedChat?: any;
};

export default function SupportPage({ colors, darkMode, onSelectChat, selectedChat }: Props) {
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/api/support-chats`)
      .then(res => res.json())
      .then(data => { setChats(data); setLoading(false); })
      .catch(() => { setError("Could not load chats"); setLoading(false); });
  }, []);

  if (loading) return <div style={{ padding: 48, color: colors.sub }}>Loading...</div>;
  if (error) return <div style={{ padding: 48, color: colors.red }}>{error}</div>;
  if (!chats.length) return <div style={{ padding: 48, color: colors.sub }}>No support chats found.</div>;

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ color: colors.text, fontWeight: 600, fontSize: 22, marginBottom: 18 }}>Support Chats</h2>
      <table style={{ width: "100%", background: colors.card, borderRadius: 10, boxShadow: "0 2px 10px #0001" }}>
        <thead>
          <tr style={{ background: colors.bg, color: colors.sub }}>
            <th style={{ textAlign: "left", padding: "10px 18px" }}>Number</th>
            <th style={{ textAlign: "left", padding: "10px 18px" }}>Name</th>
            <th style={{ textAlign: "left", padding: "10px 18px" }}>Email</th>
            <th style={{ textAlign: "left", padding: "10px 18px" }}>Last Message</th>
          </tr>
        </thead>
        <tbody>
          {chats.map((c, i) => (
            <tr
              key={c.from_number || i}
              onClick={() => onSelectChat(c)}
              style={{
                cursor: "pointer",
                background:
                  selectedChat?.from_number === c.from_number
                    ? darkMode
                      ? "#332"
                      : "#fff4f6"
                    : undefined,
                borderLeft:
                  selectedChat?.from_number === c.from_number
                    ? `5px solid ${colors.red}`
                    : undefined,
              }}
            >
              <td style={{ padding: "10px 18px", color: colors.text }}>{c.from_number}</td>
              <td style={{ padding: "10px 18px", color: colors.text }}>{c.name || <span style={{ color: colors.sub }}>—</span>}</td>
              <td style={{ padding: "10px 18px", color: colors.text }}>{c.email || <span style={{ color: colors.sub }}>—</span>}</td>
              <td style={{ padding: "10px 18px", color: colors.text }}>{c.last_message || <span style={{ color: colors.sub }}>—</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
