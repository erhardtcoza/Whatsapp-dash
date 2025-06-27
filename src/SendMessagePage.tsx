import { useEffect, useState } from "react";
import { API_BASE } from "./config";

interface Customer {
  phone: string;
  name: string;
  email: string;
  customer_id: string;
}

export default function SendMessagePage({ colors }: any) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedPhone, setSelectedPhone] = useState("");
  const [message, setMessage] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [newClient, setNewClient] = useState({
    phone: "",
    name: "",
    email: "",
    customer_id: "",
  });
  const [savingClient, setSavingClient] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/customers`);
      const data = await res.json();
      setCustomers(data);
    } finally {
      setLoading(false);
    }
  }

  async function handleSend() {
    if (!selectedPhone || !message.trim()) return;
    setSending(true);
    await fetch(`${API_BASE}/api/send-message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: selectedPhone, body: message.trim() })
    });
    setMessage("");
    setSending(false);
  }

  async function handleAddClient(e: React.FormEvent) {
    e.preventDefault();
    setSavingClient(true);
    await fetch(`${API_BASE}/api/update-customer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: newClient.phone,
        name: newClient.name,
        email: newClient.email,
        customer_id: newClient.customer_id
      })
    });
    setNewClient({ phone: "", name: "", email: "", customer_id: "" });
    setShowAddForm(false);
    await fetchCustomers();
    setSavingClient(false);
  }

  return (
    <div style={{
      padding: 32,
      maxWidth: 600,
      margin: "0 auto",
    }}>
      <h2 style={{ color: colors.text, fontWeight: 600, fontSize: 22, marginBottom: 24 }}>
        Send Message
      </h2>

      {/* client selector */}
      {loading ? (
        <div style={{ color: colors.sub }}>Loading clients…</div>
      ) : (
        <div style={{ marginBottom: 16 }}>
          <select
            value={selectedPhone}
            onChange={e => setSelectedPhone(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: 6,
              border: `1px solid ${colors.border}`,
              fontSize: 15,
              marginBottom: 8,
            }}
          >
            <option value="">-- select client --</option>
            {customers.map(c => (
              <option key={c.phone} value={c.phone}>
                {c.name || c.phone} ({c.customer_id || "–"})
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowAddForm(show => !show)}
            style={{
              background: "none",
              color: colors.red,
              border: `1px solid ${colors.red}`,
              borderRadius: 6,
              padding: "6px 12px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            {showAddForm ? "Cancel" : "+ Add Client"}
          </button>
        </div>
      )}

      {/* add-client form */}
      {showAddForm && (
        <form onSubmit={handleAddClient} style={{
          marginBottom: 24,
          padding: 16,
          background: colors.card,
          borderRadius: 8,
          border: `1px solid ${colors.border}`
        }}>
          <div style={{ marginBottom: 8 }}>
            <input
              type="text"
              placeholder="Phone"
              value={newClient.phone}
              onChange={e => setNewClient(n => ({ ...n, phone: e.target.value }))}
              style={{
                width: "100%",
                padding: "7px 12px",
                borderRadius: 6,
                border: `1px solid ${colors.border}`,
                fontSize: 15,
                marginBottom: 8,
              }}
              required
            />
            <input
              type="text"
              placeholder="Name"
              value={newClient.name}
              onChange={e => setNewClient(n => ({ ...n, name: e.target.value }))}
              style={{
                width: "100%",
                padding: "7px 12px",
                borderRadius: 6,
                border: `1px solid ${colors.border}`,
                fontSize: 15,
                marginBottom: 8,
              }}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={newClient.email}
              onChange={e => setNewClient(n => ({ ...n, email: e.target.value }))}
              style={{
                width: "100%",
                padding: "7px 12px",
                borderRadius: 6,
                border: `1px solid ${colors.border}`,
                fontSize: 15,
                marginBottom: 8,
              }}
              required
            />
            <input
              type="text"
              placeholder="Customer ID"
              value={newClient.customer_id}
              onChange={e => setNewClient(n => ({ ...n, customer_id: e.target.value }))}
              style={{
                width: "100%",
                padding: "7px 12px",
                borderRadius: 6,
                border: `1px solid ${colors.border}`,
                fontSize: 15,
                marginBottom: 8,
              }}
            />
          </div>
          <button
            type="submit"
            disabled={savingClient}
            style={{
              background: colors.red,
              color: "#fff",
              border: "none",
              borderRadius: 7,
              padding: "8px 18px",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            {savingClient ? "Saving…" : "Save Client"}
          </button>
        </form>
      )}

      {/* message box */}
      <textarea
        placeholder="Your message…"
        value={message}
        onChange={e => setMessage(e.target.value)}
        rows={5}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: 8,
          border: `1px solid ${colors.border}`,
          fontSize: 15,
          marginBottom: 16,
        }}
      />

      <button
        onClick={handleSend}
        disabled={!selectedPhone || !message.trim() || sending}
        style={{
          background: colors.red,
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "10px 24px",
          fontWeight: 700,
          fontSize: 16,
          cursor: selectedPhone && message.trim() && !sending ? "pointer" : "not-allowed",
          opacity: sending ? 0.6 : 1,
        }}
      >
        {sending ? "Sending…" : "Send"}
      </button>
    </div>
  );
}
