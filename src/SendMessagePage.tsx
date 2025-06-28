// src/SendMessagePage.tsx
import { useEffect, useState } from "react";
import { API_BASE } from "./config";
import MessageBubble from "./MessageBubble"; // Import the bubble

interface Customer {
  phone: string;
  name: string;
  email: string;
  customer_id: string;
}

export default function SendMessagePage({ colors }: any) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<string>(""); // phone or "ADD_NEW"
  const [msg, setMsg] = useState("");

  // For “Add new client…”
  const [newClient, setNewClient] = useState({
    phone: "",
    name: "",
    email: "",
    customer_id: ""
  });
  const [adding, setAdding] = useState(false);

  // Load customers
  useEffect(() => {
    fetch(`${API_BASE}/api/customers?verified=1`)
      .then(r => r.json())
      .then(setCustomers)
      .catch(console.error);
  }, []);

  const visible = customers
    .filter(c =>
      c.customer_id.includes(filter) ||
      c.name.toLowerCase().includes(filter.toLowerCase()) ||
      c.phone.includes(filter)
    );

  async function saveNew() {
    await fetch(`${API_BASE}/api/update-customer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newClient })
    });
    // refresh list
    const updated = await fetch(`${API_BASE}/api/customers?verified=1`).then(r => r.json());
    setCustomers(updated);
    setSelected(newClient.phone);
    setAdding(false);
    setNewClient({ phone: "", name: "", email: "", customer_id: "" });
  }

  async function send() {
    if (!selected || !msg.trim()) return;
    await fetch(`${API_BASE}/api/send-message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: selected, body: msg })
    });
    setMsg("");
    alert("Message sent!");
  }

  return (
    <div style={{ padding: 32, maxWidth: 700 }}>
      <h2 style={{ color: colors.text, fontWeight: 600, fontSize: 22, marginBottom: 18 }}>
        Send WhatsApp Message
      </h2>

      {/* Search & select */}
      <input
        type="text"
        placeholder="Search by ID, name or phone…"
        value={filter}
        onChange={e => setFilter(e.target.value)}
        style={{
          width: "100%",
          padding: "8px 12px",
          borderRadius: 6,
          border: `1px solid ${colors.border}`,
          marginBottom: 12
        }}
      />
      <select
        value={selected}
        onChange={e => {
          const val = e.target.value;
          setSelected(val);
          setAdding(val === "ADD_NEW");
        }}
        style={{
          width: "100%",
          padding: "8px 12px",
          borderRadius: 6,
          border: `1px solid ${colors.border}`,
          marginBottom: 20,
          background: colors.input,
          color: colors.inputText
        }}
      >
        <option value="">-- Select a client or add new --</option>
        {visible.map(c => (
          <option key={c.phone} value={c.phone}>
            {c.customer_id} – {c.name || "(no name)"} – {c.phone}
          </option>
        ))}
        <option value="ADD_NEW">➕ Add new client…</option>
      </select>

      {/* Add new client form */}
      {adding && (
        <div style={{ marginBottom: 24, padding: 16, background: colors.card, borderRadius: 8 }}>
          <h4 style={{ margin: "0 0 12px", color: colors.red }}>New Client Details</h4>
          {["customer_id","name","email","phone"].map(field => (
            <div key={field} style={{ marginBottom: 8 }}>
              <input
                type={field==="email"?"email":"text"}
                placeholder={field.replace("_"," ").toUpperCase()}
                value={(newClient as any)[field]}
                onChange={e => setNewClient(n => ({ ...n, [field]: e.target.value }))}
                style={{
                  width: "100%",
                  padding: "7px 10px",
                  borderRadius: 6,
                  border: `1px solid ${colors.border}`
                }}
              />
            </div>
          ))}
          <button
            onClick={saveNew}
            style={{
              background: colors.red,
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "8px 16px",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            Save Client
          </button>
        </div>
      )}

      {/* Message textarea */}
      <textarea
        placeholder="Your message…"
        value={msg}
        onChange={e => setMsg(e.target.value)}
        style={{
          width: "100%",
          minHeight: 120,
          padding: "8px 12px",
          borderRadius: 6,
          border: `1px solid ${colors.border}`,
          marginBottom: 16,
          resize: "vertical"
        }}
      />

      {/* Message bubble preview */}
      {msg.trim() && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: colors.sub, marginBottom: 6 }}>Preview:</div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <MessageBubble
              m={{
                body: msg,
                direction: "outgoing",
                tag: "system",
                timestamp: Date.now()
              }}
              colors={colors}
            />
          </div>
        </div>
      )}

      <button
        onClick={send}
        disabled={!selected || !msg.trim()}
        style={{
          background: colors.red,
          color: "#fff",
          border: "none",
          borderRadius: 6,
          padding: "10px 20px",
          fontWeight: 700,
          cursor: selected && msg.trim() ? "pointer" : "not-allowed"
        }}
      >
        Send Message
      </button>
    </div>
  );
}
