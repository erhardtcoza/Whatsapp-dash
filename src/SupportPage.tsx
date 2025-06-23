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
      .then(res => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then(data => { setChats(data); setLoading(false); })
      .catch(() => { setError("Could not load chats"); setLoading(false); });
  }, []);

  return (
    <div style={{ padding: "36px 22px", width: "100%" }}>
      <h2 style={{ color: colors.red, fontWeight: 700, marginBottom: 18 }}>Support Chats</h2>
      {error ? (
        <div style={{ color: colors.red }}>{error}</div>
      ) : loading ? (
        <div style={{ color: colors.text }}>Loading...</div>
      ) : chats.length === 0 ? (
        <div style={{ color: colors.sub }}>No open support chats.</div>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: colors.card,
            color: colors.text,
            borderRadius: 10,
            boxShadow: "0 1px 7px #0001",
            overflow: "hidden",
          }}
        >
          <thead>
            <tr style={{ background: colors.input }}>
              <th style={th}>Number</th>
              <th style={th}>Name</th>
              <th style={th}>Email</th>
              <th style={th}>Last Message</th>
            </tr>
          </thead>
          <tbody>
            {chats.map((c) => (
              <tr
                key={c.from_number}
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
                <td style={td}>{c.from_number}</td>
                <td style={td}>{c.name || <span style={{ color: colors.sub }}>—</span>}</td>
                <td style={td}>{c.email || <span style={{ color: colors.sub }}>—</span>}</td>
                <td style={td}>{c.last_message || <span style={{ color: colors.sub }}>—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const th = {
  padding: "10px 8px",
  textAlign: "left" as const,
  fontWeight: 700,
  fontSize: 15,
  borderBottom: "2px solid #eaeaea",
};
const td = {
  padding: "10px 8px",
  fontSize: 15,
  borderBottom: "1px solid #eaeaea",
};
