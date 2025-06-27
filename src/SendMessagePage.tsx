import { useEffect, useState } from "react";
import { API_BASE } from "./config";

export default function SendMessagePage({ colors }: any) {
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedPhone, setSelectedPhone] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  // fetch all customers for dropdown
  useEffect(() => {
    fetch(`${API_BASE}/api/customers`)
      .then(r => r.json())
      .then(setCustomers)
      .catch(console.error);
  }, []);

  async function handleSend() {
    if (!selectedPhone || !body.trim()) return;
    setSending(true);
    await fetch(`${API_BASE}/api/send-message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: selectedPhone, body }),
    });
    setBody("");
    setSending(false);
    // optionally show a toast here
  }

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ color: colors.text, fontWeight: 600, fontSize: 22, marginBottom: 18 }}>
        Send Message
      </h2>

      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <select
          value={selectedPhone}
          onChange={e => setSelectedPhone(e.target.value)}
          style={{
            padding: "7px 12px",
            borderRadius: 6,
            border: `1.3px solid ${colors.border}`,
            fontSize: 15,
            minWidth: 240,
            background: colors.input,
            color: colors.inputText,
          }}
        >
          <option value="">Select client…</option>
          {customers.map(c => (
            <option key={c.phone} value={c.phone}>
              {c.customer_id} — {c.name || "(no name)"} — {c.phone}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Your message…"
          value={body}
          onChange={e => setBody(e.target.value)}
          style={{
            flex: 1,
            padding: "7px 12px",
            borderRadius: 6,
            border: `1.3px solid ${colors.border}`,
            fontSize: 15,
            background: colors.input,
            color: colors.inputText,
          }}
        />

        <button
          onClick={handleSend}
          disabled={sending || !selectedPhone || !body.trim()}
          style={{
            background: colors.red,
            color: "#fff",
            padding: "8px 18px",
            borderRadius: 7,
            border: "none",
            fontWeight: 700,
            fontSize: 15,
            cursor: sending ? "wait" : "pointer",
            opacity: sending ? 0.6 : 1,
          }}
        >
          {sending ? "Sending…" : "Send"}
        </button>
      </div>

      {/* Optionally, show a note or last sent message etc. */}
    </div>
  );
}
