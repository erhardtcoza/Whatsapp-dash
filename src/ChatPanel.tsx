import { useEffect, useState } from "react";
import { API_BASE } from "./config";

export default function ChatPanel({ chat, colors, onClose }: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const [tag, setTag] = useState(chat.tag || "support");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/messages?phone=${chat.from_number}`)
      .then(res => res.json())
      .then(setMessages);
  }, [chat.from_number]);

  // Tag update
  function updateTag(newTag: string) {
    setSaving(true);
    fetch(`${API_BASE}/api/set-tag`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from_number: chat.from_number, tag: newTag }),
    }).then(() => {
      setTag(newTag);
      setSaving(false);
    });
  }

  return (
    <div style={{ padding: 24, maxWidth: 700, margin: "0 auto" }}>
      <button onClick={onClose} style={{ marginBottom: 12, background: colors.red, color: "#fff", border: "none", borderRadius: 6, padding: "6px 16px", cursor: "pointer" }}>
        ← Back
      </button>
      <h3>
        Chat with {chat.name || chat.from_number}
        <span style={{ marginLeft: 16, fontWeight: 400, color: colors.sub }}>({chat.tag || "No tag"})</span>
      </h3>
      <div style={{ margin: "14px 0", display: "flex", alignItems: "center", gap: 10 }}>
        <label>
          <b>Tag:</b>
          <select
            value={tag}
            onChange={e => updateTag(e.target.value)}
            disabled={saving}
            style={{ marginLeft: 6, fontSize: 15, padding: "3px 10px", borderRadius: 6, border: `1px solid ${colors.border}` }}
          >
            <option value="support">Support</option>
            <option value="accounts">Accounts</option>
            <option value="sales">Sales</option>
            <option value="lead">Lead</option>
            <option value="unverified">Unverified</option>
          </select>
        </label>
      </div>
      <div style={{ height: 320, overflowY: "auto", background: colors.bg, padding: 10, borderRadius: 7, marginBottom: 16 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ color: colors.text, marginBottom: 7 }}>
            <span style={{ fontWeight: 500, color: m.direction === "incoming" ? "#333" : colors.red }}>
              {m.direction === "incoming" ? "Client:" : "You:"}
            </span>{" "}
            {m.body}
          </div>
        ))}
      </div>
      {/* You can add reply/send-message form here */}
    </div>
  );
}
