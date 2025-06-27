// src/SendMessagePage.tsx

import { useEffect, useState } from "react";
import { API_BASE } from "./config";

interface Client {
  from_number: string;
  name: string;
  email: string;
}

export default function SendMessagePage({ colors }: { colors: any }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/chats`)
      .then((r) => r.json())
      .then((data) => {
        setClients(data);
        setLoading(false);
      });
  }, []);

  async function send() {
    if (!selected || !message.trim()) return;
    setSending(true);
    await fetch(`${API_BASE}/api/send-message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: selected, body: message }),
    });
    setMessage("");
    setSending(false);
    alert("Message sent!");
  }

  return (
    <div style={{ padding: 32 }}>
      <h2
        style={{
          color: colors.text,
          fontWeight: 600,
          fontSize: 22,
          marginBottom: 18,
        }}
      >
        Send Message
      </h2>

      {loading ? (
        <div style={{ color: colors.sub }}>Loading clients…</div>
      ) : (
        <>
          <div style={{ marginBottom: 16 }}>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              style={{
                padding: "7px 12px",
                borderRadius: 6,
                border: `1.3px solid ${colors.border}`,
                fontSize: 15,
                width: 240,
              }}
            >
              <option value="">-- select client --</option>
              {clients.map((c) => (
                <option key={c.from_number} value={c.from_number}>
                  {c.name || c.from_number}{" "}
                  {c.email ? `(${c.email})` : ""}
                </option>
              ))}
            </select>
          </div>
          <textarea
            rows={4}
            placeholder="Your message…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{
              width: "100%",
              borderRadius: 6,
              border: `1.3px solid ${colors.border}`,
              padding: "10px",
              fontSize: 15,
              marginBottom: 12,
              resize: "vertical",
            }}
          />
          <button
            onClick={send}
            disabled={sending || !selected || !message.trim()}
            style={{
              background: colors.red,
              color: "#fff",
              border: "none",
              borderRadius: 7,
              padding: "10px 20px",
              fontWeight: 700,
              fontSize: 15,
              cursor: sending ? "default" : "pointer",
              opacity: sending ? 0.6 : 1,
            }}
          >
            {sending ? "Sending…" : "Send"}
          </button>
        </>
      )}
    </div>
  );
}
