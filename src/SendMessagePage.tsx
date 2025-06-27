// src/SendMessagePage.tsx

import { useEffect, useState } from "react";
import { API_BASE } from "./config";

interface ChatSummary {
  from_number: string;
  name: string | null;
  email: string | null;
  customer_id: string | null;
  last_message: string;
  unread_count: number;
  tag: string;
}

export default function SendMessagePage({ colors }: { colors: any }) {
  const [clients, setClients] = useState<ChatSummary[]>([]);
  const [selectedPhone, setSelectedPhone] = useState<string>("");
  const [message, setMessage] = useState("");
  const [adding, setAdding] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    phone: "",
    name: "",
    email: "",
    customer_id: "",
  });

  // fetch active chats
  useEffect(() => {
    fetch(`${API_BASE}/api/chats`)
      .then((r) => r.json())
      .then((data: ChatSummary[]) => {
        setClients(data);
        if (data.length) setSelectedPhone(data[0].from_number);
      })
      .catch(console.error);
  }, []);

  async function send() {
    if (!selectedPhone || !message.trim()) return;
    await fetch(`${API_BASE}/api/send-message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: selectedPhone, body: message }),
    });
    setMessage("");
    // optionally refresh chats/unread state...
  }

  async function addCustomer(e: React.FormEvent) {
    e.preventDefault();
    const { phone, name, email, customer_id } = newCustomer;
    if (!phone.trim()) return;
    await fetch(`${API_BASE}/api/update-customer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, name, email, customer_id }),
    });
    // after adding, re-fetch chats
    const data = await fetch(`${API_BASE}/api/chats`).then((r) => r.json());
    setClients(data);
    setSelectedPhone(phone);
    setAdding(false);
  }

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ color: colors.text, fontWeight: 600, fontSize: 22, marginBottom: 18 }}>
        Send Message
      </h2>

      <div style={{ marginBottom: 24 }}>
        <label style={{ display: "block", marginBottom: 6, color: colors.sub }}>
          Select Client
        </label>
        <select
          value={selectedPhone}
          onChange={(e) => setSelectedPhone(e.target.value)}
          style={{
            width: 300,
            padding: "7px 12px",
            borderRadius: 6,
            border: `1.3px solid ${colors.border}`,
            fontSize: 15,
            background: colors.input,
            color: colors.inputText,
          }}
        >
          {clients.map((c) => (
            <option key={c.from_number} value={c.from_number}>
              {c.name || c.from_number} — {c.last_message.slice(0, 20)}…
            </option>
          ))}
        </select>
        <button
          onClick={() => setAdding((f) => !f)}
          style={{
            marginLeft: 12,
            background: colors.red,
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "7px 14px",
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          {adding ? "Cancel" : "Add Customer"}
        </button>
      </div>

      {adding && (
        <form onSubmit={addCustomer} style={{ marginBottom: 24, display: "grid", gap: 10, width: 300 }}>
          <input
            type="text"
            placeholder="Phone"
            value={newCustomer.phone}
            onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
            style={{
              padding: "7px 12px",
              borderRadius: 6,
              border: `1.3px solid ${colors.border}`,
              fontSize: 15,
            }}
            required
          />
          <input
            type="text"
            placeholder="Name"
            value={newCustomer.name}
            onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
            style={{
              padding: "7px 12px",
              borderRadius: 6,
              border: `1.3px solid ${colors.border}`,
              fontSize: 15,
            }}
          />
          <input
            type="email"
            placeholder="Email"
            value={newCustomer.email}
            onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
            style={{
              padding: "7px 12px",
              borderRadius: 6,
              border: `1.3px solid ${colors.border}`,
              fontSize: 15,
            }}
          />
          <input
            type="text"
            placeholder="Customer ID"
            value={newCustomer.customer_id}
            onChange={(e) => setNewCustomer({ ...newCustomer, customer_id: e.target.value })}
            style={{
              padding: "7px 12px",
              borderRadius: 6,
              border: `1.3px solid ${colors.border}`,
              fontSize: 15,
            }}
          />
          <button
            type="submit"
            style={{
              background: colors.red,
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "8px 14px",
              fontWeight: 600,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            Save Customer
          </button>
        </form>
      )}

      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block", marginBottom: 6, color: colors.sub }}>
          Message
        </label>
        <textarea
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{
            width: "100%",
            maxWidth: 500,
            padding: "7px 12px",
            borderRadius: 6,
            border: `1.3px solid ${colors.border}`,
            fontSize: 15,
            background: colors.input,
            color: colors.inputText,
          }}
        />
      </div>
      <button
        onClick={send}
        style={{
          background: colors.red,
          color: "#fff",
          border: "none",
          borderRadius: 6,
          padding: "10px 20px",
          fontWeight: 700,
          fontSize: 15,
          cursor: "pointer",
        }}
      >
        Send
      </button>
    </div>
  );
}
