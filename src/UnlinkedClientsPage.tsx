// src/UnlinkedClientsPage.tsx

import { useEffect, useState } from "react";
import { API_BASE } from "./config";

interface UnlinkedClient {
  from_number: string;
  last_msg: number;
  name: string;
  email: string;
}

export default function UnlinkedClientsPage({ colors, darkMode }: any) {
  const [clients, setClients] = useState<UnlinkedClient[]>([]);
  const [forms, setForms] = useState<Record<string, { name: string; email: string; customer_id: string }>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({});

  async function fetchClients() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/unlinked-clients`);
      const data = await res.json();
      setClients(data);
      // initialize form state for each
      const f: any = {};
      data.forEach((c: any) => {
        f[c.from_number] = { name: c.name, email: c.email, customer_id: "" };
      });
      setForms(f);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchClients(); }, []);

  const handleChange = (phone: string, field: "name"|"email"|"customer_id", val: string) => {
    setForms(fs => ({
      ...fs,
      [phone]: { ...fs[phone], [field]: val }
    }));
  };

  const verify = async (phone: string) => {
    setSubmitting(s => ({ ...s, [phone]: true }));
    const { name, email, customer_id } = forms[phone];
    await fetch(`${API_BASE}/api/update-customer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, name, email, customer_id })
    });
    await fetchClients();
    setSubmitting(s => ({ ...s, [phone]: false }));
  };

  const remove = async (phone: string) => {
    if (!confirm("Delete this unverified client?")) return;
    setSubmitting(s => ({ ...s, [phone]: true }));
    await fetch(`${API_BASE}/api/delete-customer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone })
    });
    await fetchClients();
    setSubmitting(s => ({ ...s, [phone]: false }));
  };

  if (loading) {
    return <div style={{ padding: 32, color: colors.sub }}>Loading…</div>;
  }

  if (clients.length === 0) {
    return <div style={{ padding: 32, color: colors.sub }}>No unverified clients.</div>;
  }

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ color: colors.text, fontWeight: 600, fontSize: 22, marginBottom: 18 }}>
        Unverified Clients
      </h2>
      <table style={{
        width: "100%",
        background: colors.card,
        borderRadius: 8,
        borderCollapse: "collapse",
      }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: 8 }}>Phone</th>
            <th style={{ textAlign: "left", padding: 8 }}>Name</th>
            <th style={{ textAlign: "left", padding: 8 }}>Email</th>
            <th style={{ textAlign: "left", padding: 8 }}>Customer ID</th>
            <th style={{ padding: 8 }}></th>
            <th style={{ padding: 8 }}></th>
          </tr>
        </thead>
        <tbody>
          {clients.map(c => {
            const f = forms[c.from_number] || { name:"",email:"",customer_id:"" };
            return (
              <tr key={c.from_number} style={{ borderTop: `1px solid ${colors.border}` }}>
                <td style={{ padding: 8 }}>{c.from_number}</td>
                <td style={{ padding: 8 }}>
                  <input
                    type="text"
                    value={f.name}
                    onChange={e => handleChange(c.from_number, "name", e.target.value)}
                    style={{
                      width: 140,
                      padding: "4px 8px",
                      borderRadius: 6,
                      border: `1px solid ${colors.border}`,
                      background: colors.input,
                      color: colors.inputText,
                    }}
                  />
                </td>
                <td style={{ padding: 8 }}>
                  <input
                    type="email"
                    value={f.email}
                    onChange={e => handleChange(c.from_number, "email", e.target.value)}
                    style={{
                      width: 180,
                      padding: "4px 8px",
                      borderRadius: 6,
                      border: `1px solid ${colors.border}`,
                      background: colors.input,
                      color: colors.inputText,
                    }}
                  />
                </td>
                <td style={{ padding: 8 }}>
                  <input
                    type="text"
                    value={f.customer_id}
                    onChange={e => handleChange(c.from_number, "customer_id", e.target.value)}
                    placeholder="—"
                    style={{
                      width: 100,
                      padding: "4px 8px",
                      borderRadius: 6,
                      border: `1px solid ${colors.border}`,
                      background: colors.input,
                      color: colors.inputText,
                    }}
                  />
                </td>
                <td style={{ padding: 8 }}>
                  <button
                    onClick={() => verify(c.from_number)}
                    disabled={submitting[c.from_number]}
                    style={{
                      background: colors.red,
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      padding: "6px 12px",
                      fontWeight: 600,
                      fontSize: 14,
                      cursor: "pointer",
                      opacity: submitting[c.from_number] ? 0.6 : 1,
                    }}
                  >
                    Verify
                  </button>
                </td>
                <td style={{ padding: 8 }}>
                  <button
                    onClick={() => remove(c.from_number)}
                    disabled={submitting[c.from_number]}
                    style={{
                      background: "#aaa",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      padding: "6px 12px",
                      fontWeight: 600,
                      fontSize: 14,
                      cursor: "pointer",
                      opacity: submitting[c.from_number] ? 0.6 : 1,
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
