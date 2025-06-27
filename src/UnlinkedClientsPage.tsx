import { useEffect, useState } from "react";
import { API_BASE } from "./config";

interface Client {
  from_number: string;
  name: string;
  email: string;
  last_msg: number;
  welcome_msg?: string; // Initial message, from backend
}

export default function UnlinkedClientsPage({ colors, onOpenChat }: any) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState<Record<string, { name: string; email: string; customer_id: string }>>({});
  const [error, setError] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    setLoading(true);
    const res = await fetch(`${API_BASE}/api/unlinked-clients`);
    const data = await res.json();
    setClients(data);
    setLoading(false);
  }

  function openVerify(phone: string, existing: Client) {
    setError(e => ({ ...e, [phone]: "" }));
    setVerifying(v => ({ ...v, [phone]: true }));
    setForm(f => ({
      ...f,
      [phone]: { name: existing.name, email: existing.email, customer_id: "" }
    }));
  }

  function closeVerify(phone: string) {
    setVerifying(v => ({ ...v, [phone]: false }));
    setError(e => ({ ...e, [phone]: "" }));
  }

  function handleChange(phone: string, field: keyof Client | "customer_id", value: string) {
    setForm(f => ({
      ...f,
      [phone]: { ...f[phone], [field]: value }
    }));
  }

  async function submitVerify(phone: string) {
    const { name, email, customer_id } = form[phone];
    if (!name || !email || !customer_id) {
      setError(e => ({ ...e, [phone]: "Please complete all fields." }));
      return;
    }
    const response = await fetch(`${API_BASE}/api/update-customer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, name, email, customer_id })
    });
    const result = await response.json();
    if (result && result.success) {
      closeVerify(phone);
      fetchClients();
    } else {
      setError(e => ({ ...e, [phone]: "Verification failed. Please check details or message the client for security checks." }));
    }
  }

  async function deleteClient(phone: string) {
    if (!confirm(`Delete unverified client ${phone}?`)) return;
    await fetch(`${API_BASE}/api/delete-customer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone })
    });
    fetchClients();
  }

  function handleMessageClient(phone: string) {
    // Pre-fill the chat with your security message and open the chat
    const prefillMsg =
      "Hi, we need to do a quick security check with you, please provide your ID number and what internet package do you currently have with us?";
    onOpenChat(phone, prefillMsg);
  }

  return (
    <div style={{
      padding: 32,
      maxWidth: 1000,
      margin: "0 auto",
      alignItems: "flex-start",
      textAlign: "left"
    }}>
      {loading ? (
        <div style={{ color: colors.sub }}>Loading…</div>
      ) : (
        <table style={{
          width: "100%",
          background: colors.card,
          borderRadius: 9,
          borderCollapse: "separate",
          borderSpacing: "0 8px"
        }}>
          <thead>
            <tr>
              <th style={{ padding: "8px", textAlign: "left", color: colors.sub }}>Phone</th>
              <th style={{ padding: "8px", textAlign: "left", color: colors.sub }}>Last Msg</th>
              <th style={{ padding: "8px", textAlign: "left", color: colors.sub }}>Name</th>
              <th style={{ padding: "8px", textAlign: "left", color: colors.sub }}>Email</th>
              <th style={{ padding: "8px", textAlign: "left", color: colors.sub }}>Initial Welcome Msg</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {clients.map(c => (
              <tr key={c.from_number} style={{ background: "#fff", borderRadius: 6 }}>
                <td style={{ padding: "8px" }}>{c.from_number}</td>
                <td style={{ padding: "8px" }}>
                  {new Date(c.last_msg).toLocaleString()}
                </td>
                <td style={{ padding: "8px" }}>{c.name}</td>
                <td style={{ padding: "8px" }}>{c.email}</td>
                <td style={{ padding: "8px", maxWidth: 260, fontSize: 13 }}>
                  {c.welcome_msg || "-"}
                </td>
                <td style={{ padding: "8px", display: "flex", gap: 6 }}>
                  {!verifying[c.from_number] ? (
                    <>
                      <button
                        onClick={() => openVerify(c.from_number, c)}
                        style={{
                          background: colors.red,
                          color: "#fff",
                          border: "none",
                          borderRadius: 6,
                          padding: "6px 12px",
                          cursor: "pointer",
                          fontWeight: 600
                        }}
                      >
                        Verify / Edit
                      </button>
                      <button
                        onClick={() => deleteClient(c.from_number)}
                        style={{
                          background: "#aaa",
                          color: "#fff",
                          border: "none",
                          borderRadius: 6,
                          padding: "6px 12px",
                          cursor: "pointer",
                          fontWeight: 600
                        }}
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <div style={{ display: "flex", gap: 6, flexDirection: "column" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <input
                          type="text"
                          placeholder="Name"
                          value={form[c.from_number]?.name || ""}
                          onChange={e => handleChange(c.from_number, "name", e.target.value)}
                          style={{
                            padding: "6px",
                            border: `1px solid ${colors.border}`,
                            borderRadius: 6,
                            fontSize: 14,
                            width: 120
                          }}
                        />
                        <input
                          type="email"
                          placeholder="Email"
                          value={form[c.from_number]?.email || ""}
                          onChange={e => handleChange(c.from_number, "email", e.target.value)}
                          style={{
                            padding: "6px",
                            border: `1px solid ${colors.border}`,
                            borderRadius: 6,
                            fontSize: 14,
                            width: 160
                          }}
                        />
                        <input
                          type="text"
                          placeholder="Customer ID"
                          value={form[c.from_number]?.customer_id || ""}
                          onChange={e => handleChange(c.from_number, "customer_id", e.target.value)}
                          style={{
                            padding: "6px",
                            border: `1px solid ${colors.border}`,
                            borderRadius: 6,
                            fontSize: 14,
                            width: 100
                          }}
                        />
                      </div>
                      {error[c.from_number] && (
                        <div style={{ color: colors.red, fontSize: 13 }}>{error[c.from_number]}</div>
                      )}
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          onClick={() => submitVerify(c.from_number)}
                          style={{
                            background: "#28a745",
                            color: "#fff",
                            border: "none",
                            borderRadius: 6,
                            padding: "6px 12px",
                            cursor: "pointer",
                            fontWeight: 600
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => closeVerify(c.from_number)}
                          style={{
                            background: "#aaa",
                            color: "#fff",
                            border: "none",
                            borderRadius: 6,
                            padding: "6px 12px",
                            cursor: "pointer",
                            fontWeight: 600
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleMessageClient(c.from_number)}
                          style={{
                            background: "#ffc107",
                            color: "#000",
                            border: "none",
                            borderRadius: 6,
                            padding: "6px 12px",
                            cursor: "pointer",
                            fontWeight: 600
                          }}
                        >
                          Message Client for Security Checks
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
