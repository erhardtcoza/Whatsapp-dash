import React from "react";

type Props = {
  colors: any;
  onSelectChat: (chat: any) => void;
  selectedChat?: any;
};

export default function AllChatsPage({ colors, onSelectChat, selectedChat }: Props) {
  // Dummy table, replace with your API fetching logic later
  const chats = [
    { from_number: "27820000001", name: "John Doe", email: "john@example.com", last_message: "Hi", tag: "support" },
    { from_number: "27820000002", name: "Jane Smith", email: "jane@example.com", last_message: "Account query", tag: "accounts" },
  ];
  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ color: colors.text, fontWeight: 600, fontSize: 22, marginBottom: 18 }}>All Chats</h2>
      <table style={{ width: "100%", background: colors.card, borderRadius: 10, boxShadow: "0 2px 10px #0001" }}>
        <thead>
          <tr style={{ background: colors.bg, color: colors.sub }}>
            <th style={{ textAlign: "left", padding: "10px 18px" }}>Number</th>
            <th style={{ textAlign: "left", padding: "10px 18px" }}>Name</th>
            <th style={{ textAlign: "left", padding: "10px 18px" }}>Email</th>
            <th style={{ textAlign: "left", padding: "10px 18px" }}>Last Message</th>
            <th style={{ textAlign: "left", padding: "10px 18px" }}>Tag</th>
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
                    ? "#fff4f6"
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
              <td style={{ padding: "10px 18px", color: colors.text }}>{c.tag || <span style={{ color: colors.sub }}>—</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
