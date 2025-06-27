// src/SendMessagePage.tsx

import { useEffect, useState } from "react";
import { API_BASE } from "./config";

interface Customer {
  from_number: string;
  name: string;
  customer_id: number;
}

export default function SendMessagePage({ colors }: { colors: any }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filtered, setFiltered]   = useState<Customer[]>([]);
  const [search, setSearch]       = useState("");
  const [selectedPhone, setSelectedPhone] = useState("");
  const [message, setMessage]     = useState("");
  const [sending, setSending]     = useState(false);

  // 1) Fetch all customers once
  useEffect(() => {
    fetch(`${API_BASE}/api/customers`)
      .then(r => r.json())
      .then((data: Customer[]) => {
        setCustomers(data);
        setFiltered(data);
        if (data.length) setSelectedPhone(data[0].from_number);
      });
  }, []);

  // 2) Filter by ID or phone
  useEffect(() => {
    const term = search.trim().toLowerCase();
    if (!term) return setFiltered(customers);
    setFiltered(customers.filter(c =>
      String(c.customer_id).includes(term) ||
      c.from_number.includes(term)
    ));
  }, [search, customers]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPhone || !message.trim()) return;
    setSending(true);
    await fetch(`${API_BASE}/api/send-message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: selectedPhone, body: message.trim() }),
    });
    setMessage("");
    setSending(false);
  }

  return (
    <div style={{ padding: 32, maxWidth: 700, margin: "0 auto" }}>
      <h2 style={{
        color: colors.text,
        fontWeight: 600,
        fontSize: 22,
        marginBottom: 24
      }}>
        Send Message
      </h2>

      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search by phone or ID…"
          value={search}
          onChange={e => setSearch(e.target.value)}
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

        <select
          value={selectedPhone}
          onChange={e => setSelectedPhone(e.target.value)}
          style={{
            flex: 2,
            padding: "7px 12px",
            borderRadius: 6,
            border: `1.3px solid ${colors.border}`,
            fontSize: 15,
            background: colors.input,
            color: colors.inputText,
          }}
        >
          {filtered.map(c => (
            <option key={c.from_number} value={c.from_number}>
              [{c.customer_id}] {c.name || "—"} — {c.from_number}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSend}>
        <textarea
          placeholder="Type your message…"
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={4}
          style={{
            width: "100%",
            borderRadius: 8,
            border: `1.3px solid ${colors.border}`,
            padding: "12px",
            fontSize: 15,
            background: colors.input,
            color: colors.inputText,
            marginBottom: 16,
          }}
        />

        <button
          type="submit"
          disabled={sending}
          style={{
            background: colors.red,
            color: "#fff",
            padding: "10px 24px",
            borderRadius: 8,
            border: "none",
            fontWeight: 700,
            fontSize: 15,
            cursor: sending ? "default" : "pointer",
            opacity: sending ? 0.6 : 1,
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
