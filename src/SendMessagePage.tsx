import { useEffect, useState } from "react";
import { API_BASE } from "./config";

export default function SendMessagePage({ colors, darkMode }: any) {
  const [clients, setClients] = useState<any[]>([]);
  const [selectedPhone, setSelectedPhone] = useState("");
  const [message, setMessage] = useState("");
  const [adding, setAdding] = useState(false);
  const [newClient, setNewClient] = useState({
    phone: "", name: "", email: "", customer_id: ""
  });

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    const data = await fetch(`${API_BASE}/api/chats`).then(r => r.json());
    setClients(data);
  }

  async function handleSend() {
    if (!selectedPhone || !message.trim()) return;
    await fetch(`${API_BASE}/api/send-message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: selectedPhone, body: message.trim() })
    });
    setMessage("");
    alert("Message sent!");
  }

  async function handleAddClient(e: React.FormEvent) {
    e.preventDefault();
    const { phone, name, email, customer_id } = newClient;
    if (!phone || !name || !email) return;
    await fetch(`${API_BASE}/api/update-customer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, name, email, customer_id })
    });
    setAdding(false);
    setNewClient({ phone:"", name:"", email:"", customer_id:"" });
    fetchClients();
    alert("Client added!");
  }

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ color: colors.text, fontWeight: 600, fontSize: 22, marginBottom: 18 }}>
        Send Message
      </h2>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", marginBottom: 6 }}>Select client:</label>
        <select
          value={selectedPhone}
          onChange={e => setSelectedPhone(e.target.value)}
          style={{
            padding: "7px 12px", borderRadius: 6,
            border: `1.3px solid ${colors.border}`, fontSize: 15, width: 300
          }}
        >
          <option value="">-- choose --</option>
          {clients.map(c => (
            <option key={c.from_number} value={c.from_number}>
              {c.name || c.from_number} ({c.from_number})
            </option>
          ))}
        </select>
        {!selectedPhone && (
          <button
            onClick={() => setAdding(true)}
            style={{
              marginLeft: 16,
              background: colors.red,
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "7px 14px",
              cursor: "pointer"
            }}
          >
            Add Client
          </button>
        )}
      </div>

      {adding && (
        <form onSubmit={handleAddClient} style={{ marginBottom: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Phone"
            value={newClient.phone}
            required
            onChange={e => setNewClient(n => ({ ...n, phone: e.target.value }))}
            style={{
              padding: "6px 10px", borderRadius: 7,
              border: `1.3px solid ${colors.border}`, fontSize: 15, width: 150
            }}
          />
          <input
            type="text"
            placeholder="Name"
            value={newClient.name}
            required
            onChange={e => setNewClient(n => ({ ...n, name: e.target.value }))}
            style={{
              padding: "6px 10px", borderRadius: 7,
              border: `1.3px solid ${colors.border}`, fontSize: 15, width: 180
            }}
          />
          <input
            type="email"
            placeholder="Email"
            value={newClient.email}
            required
            onChange={e => setNewClient(n => ({ ...n, email: e.target.value }))}
            style={{
              padding: "6px 10px", borderRadius: 7,
              border: `1.3px solid ${colors.border}`, fontSize: 15, width: 200
            }}
          />
          <input
            type="text"
            placeholder="Customer ID (opt.)"
            value={newClient.customer_id}
            onChange={e => setNewClient(n => ({ ...n, customer_id: e.target.value }))}
            style={{
              padding: "6px 10px", borderRadius: 7,
              border: `1.3px solid ${colors.border}`, fontSize: 15, width: 150
            }}
          />
          <button
            type="submit"
            style={{
              background: colors.red, color: "#fff",
              border: "none", borderRadius: 7,
              padding: "6px 14px", cursor: "pointer", fontWeight: 600
            }}
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setAdding(false)}
            style={{
              background: "#aaa", color: "#fff",
              border: "none", borderRadius: 7,
              padding: "6px 12px", cursor: "pointer", fontWeight: 600
            }}
          >
            Cancel
          </button>
        </form>
      )}

      <div style={{ marginBottom: 20 }}>
        <textarea
          rows={4}
          placeholder="Type your message here…"
          value={message}
          onChange={e => setMessage(e.target.value)}
          style={{
            width: "100%", padding: "10px",
            borderRadius: 7, border: `1.3px solid ${colors.border}`,
            fontSize: 15, resize: "vertical"
          }}
        />
      </div>
      <button
        onClick={handleSend}
        disabled={!selectedPhone || !message.trim()}
        style={{
          background: colors.red, color: "#fff",
          border: "none", borderRadius: 8,
          padding: "10px 20px", cursor: "pointer",
          fontWeight: 700, fontSize: 15, opacity: (!selectedPhone || !message.trim()) ? 0.6 : 1
        }}
      >
        Send
      </button>
    </div>
  );
}
