import { useEffect, useState } from "react";
import { API_BASE } from "./config";

export default function UnlinkedPage({ colors }: any) {
  const [clients, setClients] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [messagePhone, setMessagePhone] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/unlinked-clients`)
      .then(r => r.json())
      .then(setClients);
  }, []);

  async function saveEdit() {
    setLoading(true);
    await fetch(`${API_BASE}/api/verify-client`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    setClients(
      clients.map(c => c.phone === editing.phone ? { ...editing, verified: 1 } : c)
    );
    setEditing(null);
    setLoading(false);
  }

  async function deleteClient(phone: string) {
    setLoading(true);
    await fetch(`${API_BASE}/api/delete-client`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    setClients(clients.filter(c => c.phone !== phone));
    setLoading(false);
  }

  async function sendMessage(phone: string) {
    setLoading(true);
    await fetch(`${API_BASE}/api/send-message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, body: messageText }),
    });
    setMessagePhone(null);
    setMessageText("");
    setLoading(false);
  }

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ color: colors.text, marginBottom: 24 }}>Unlinked Clients</h2>
      <table style={{ width: "100%", background: colors.card, borderRadius: 8 }}>
        <thead>
          <tr>
            <th>Phone</th>
            <th>Name</th>
            <th>Email</th>
            <th>Last Msg</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(client => (
            <tr key={client.phone}>
              <td>{client.phone}</td>
              <td>{client.name}</td>
              <td>{client.email}</td>
              <td>{client.last_msg || "-"}</td>
              <td>
                <button
                  style={{ background: colors.red, color: "#fff", borderRadius: 6, marginRight: 8 }}
                  onClick={() => setEditing(client)}
                >Verify / Edit</button>
                <button
                  style={{ background: "#eee", color: colors.text, borderRadius: 6, marginRight: 8 }}
                  onClick={() => setMessagePhone(client.phone)}
                >Send Security Check</button>
                <button
                  style={{ background: "#aaa", color: "#fff", borderRadius: 6 }}
                  onClick={() => deleteClient(client.phone)}
                >Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {editing && (
        <div style={{
          position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh",
          background: "rgba(0,0,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{
            background: "#fff", padding: 32, borderRadius: 10, minWidth: 360, boxShadow: "0 3px 16px #0002"
          }}>
            <h3>Edit & Verify Client</h3>
            <div style={{ marginBottom: 10 }}>
              <label>Name:</label>
              <input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} style={{ width: "100%" }} />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>Email:</label>
              <input value={editing.email} onChange={e => setEditing({ ...editing, email: e.target.value })} style={{ width: "100%" }} />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>Client Code:</label>
              <input value={editing.customer_id} onChange={e => setEditing({ ...editing, customer_id: e.target.value })} style={{ width: "100%" }} />
            </div>
            <div style={{ marginTop: 16 }}>
              <button onClick={saveEdit} style={{ background: colors.red, color: "#fff", borderRadius: 6, marginRight: 8 }} disabled={loading}>Save & Verify</button>
              <button onClick={() => setEditing(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Send Message Modal */}
      {messagePhone && (
        <div style={{
          position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh",
          background: "rgba(0,0,0,0.20)", display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{
            background: "#fff", padding: 28, borderRadius: 10, minWidth: 340
          }}>
            <h3>Send Security Check</h3>
            <textarea value={messageText} onChange={e => setMessageText(e.target.value)} style={{ width: "100%", minHeight: 60, marginBottom: 12 }} />
            <button onClick={() => sendMessage(messagePhone)} style={{ background: colors.red, color: "#fff", borderRadius: 6, marginRight: 8 }} disabled={loading}>Send</button>
            <button onClick={() => setMessagePhone(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
