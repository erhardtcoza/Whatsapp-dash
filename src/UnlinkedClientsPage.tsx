import { useEffect, useState } from "react";

export default function UnlinkedClientsPage({ colors }: any) {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Assign modal state
  const [modal, setModal] = useState<{open: boolean, client: any} | null>(null);
  const [assign, setAssign] = useState({ name: "", customer_id: "", email: "" });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Fetch unlinked clients
  useEffect(() => {
    fetch("https://w-api.vinetdns.co.za/api/unlinked-clients")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setClients(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load clients");
        setLoading(false);
      });
  }, []);

  // Handle assign click
  function handleAssign(client: any) {
    setAssign({
      name: client.name || "",
      customer_id: "",
      email: client.email || "",
    });
    setSaveError(null);
    setModal({ open: true, client });
  }

  // Save assigned client
  async function saveAssign() {
    setSaving(true);
    setSaveError(null);
    const phone = modal?.client.from_number;
    const { name, customer_id, email } = assign;
    if (!phone || !customer_id || !email) {
      setSaveError("Customer ID and Email are required.");
      setSaving(false);
      return;
    }
    try {
      const res = await fetch("https://w-api.vinetdns.co.za/api/update-customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, name, customer_id, email }),
      });
      if (!res.ok) throw new Error("Failed to update");
      // Remove from list
      setClients(clients.filter(c => c.from_number !== phone));
      setModal(null);
    } catch {
      setSaveError("Update failed.");
    }
    setSaving(false);
  }

  return (
    <div style={{ padding: "38px 36px", width: "100%" }}>
      <h2 style={{ color: colors.red, fontWeight: 700, marginBottom: 20 }}>Unlinked Clients</h2>
      {error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : loading ? (
        <div style={{ color: colors.text }}>Loading...</div>
      ) : clients.length === 0 ? (
        <div style={{ color: colors.sub }}>No unlinked clients found.</div>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: colors.card,
            color: colors.text,
            borderRadius: 10,
            boxShadow: "0 1px 7px #0001",
            overflow: "hidden",
          }}
        >
          <thead>
            <tr style={{ background: colors.input }}>
              <th style={th}>Name</th>
              <th style={th}>Number</th>
              <th style={th}>Email</th>
              <th style={th}>Last Message</th>
              <th style={th}></th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.from_number}>
                <td style={td}>{c.name || <span style={{ color: colors.sub }}>N/A</span>}</td>
                <td style={td}>{c.from_number}</td>
                <td style={td}>{c.email || <span style={{ color: colors.sub }}>N/A</span>}</td>
                <td style={td}>{c.last_msg ? new Date(c.last_msg).toLocaleString() : ""}</td>
                <td style={td}>
                  <button
                    style={{
                      background: colors.red,
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      padding: "5px 14px",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontSize: 14,
                    }}
                    onClick={() => handleAssign(c)}
                  >
                    Assign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Assign Modal */}
      {modal?.open && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          background: "rgba(0,0,0,0.32)", display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9999,
        }}>
          <div style={{
            background: colors.card, color: colors.text, borderRadius: 14, boxShadow: "0 4px 18px #0003",
            minWidth: 350, maxWidth: 420, padding: 32, display: "flex", flexDirection: "column"
          }}>
            <h3 style={{ color: colors.red, marginBottom: 16 }}>Assign Client</h3>
            <div style={{ marginBottom: 15 }}>
              <label>Name:</label>
              <input
                type="text"
                value={assign.name}
                onChange={e => setAssign(a => ({ ...a, name: e.target.value }))}
                style={input}
                autoFocus
              />
            </div>
            <div style={{ marginBottom: 15 }}>
              <label>Customer ID:</label>
              <input
                type="text"
                value={assign.customer_id}
                onChange={e => setAssign(a => ({ ...a, customer_id: e.target.value }))}
                style={input}
                required
              />
            </div>
            <div style={{ marginBottom: 15 }}>
              <label>Email:</label>
              <input
                type="email"
                value={assign.email}
                onChange={e => setAssign(a => ({ ...a, email: e.target.value }))}
                style={input}
                required
              />
            </div>
            {saveError && <div style={{ color: "red", marginBottom: 8 }}>{saveError}</div>}
            <div style={{ display: "flex", gap: 18, marginTop: 4 }}>
              <button
                onClick={saveAssign}
                disabled={saving}
                style={{
                  background: colors.red, color: "#fff", border: "none", borderRadius: 6,
                  padding: "7px 18px", fontWeight: 700, fontSize: 15, cursor: "pointer"
                }}
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setModal(null)}
                style={{
                  background: "#8884", color: colors.text, border: "none", borderRadius: 6,
                  padding: "7px 18px", fontWeight: 500, fontSize: 15, cursor: "pointer"
                }}
              >Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const th = {
  padding: "10px 8px",
  textAlign: "left" as const,
  fontWeight: 700,
  fontSize: 15,
  borderBottom: "2px solid #eaeaea",
};
const td = {
  padding: "10px 8px",
  fontSize: 15,
  borderBottom: "1px solid #eaeaea",
};
const input = {
  width: "100%",
  border: "1px solid #ccc",
  borderRadius: 7,
  fontSize: 15,
  padding: "6px 11px",
  marginTop: 2,
  marginBottom: 2,
  background: "#fff",
  color: "#222",
};

