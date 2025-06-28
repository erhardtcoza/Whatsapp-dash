import { useEffect, useState } from "react";
import { API_BASE } from "./config";

export default function TemplatesPage({ colors }: any) {
  const [templates, setTemplates] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ name: "", body: "", language: "en", status: "draft" });
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    fetch(`${API_BASE}/api/templates`)
      .then(r => r.json())
      .then(setTemplates);
  }, [refresh]);

  function handleEdit(tpl: any) {
    setEditing(tpl);
    setForm({
      name: tpl.name,
      body: tpl.body,
      language: tpl.language || "en",
      status: tpl.status || "draft",
    });
  }

  function handleNew() {
    setEditing(null);
    setForm({ name: "", body: "", language: "en", status: "draft" });
  }

  async function handleSave() {
    const payload = { ...form };
    if (editing) payload.id = editing.id;
    await fetch(`${API_BASE}/api/templates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setEditing(null);
    setRefresh(x => x + 1);
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this template?")) return;
    await fetch(`${API_BASE}/api/templates/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setRefresh(x => x + 1);
  }

  async function handleSync(id: number) {
    await fetch(`${API_BASE}/api/templates/sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setRefresh(x => x + 1);
  }

  async function handleStatus(id: number, status: string) {
    await fetch(`${API_BASE}/api/templates/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setRefresh(x => x + 1);
  }

  return (
    <div style={{ padding: 40 }}>
      <h2 style={{ color: colors.red }}>Templates</h2>
      <button onClick={handleNew} style={{
        background: colors.red,
        color: "#fff",
        border: "none",
        borderRadius: 6,
        padding: "6px 18px",
        marginBottom: 18,
        cursor: "pointer"
      }}>
        New Template
      </button>
      {editing && (
        <div style={{
          background: colors.card,
          border: `1px solid ${colors.border}`,
          borderRadius: 8,
          padding: 20,
          marginBottom: 24
        }}>
          <div>
            <label>Name</label><br />
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              style={{ width: 280, marginBottom: 10 }} />
          </div>
          <div>
            <label>Body</label><br />
            <textarea value={form.body} onChange={e => setForm({ ...form, body: e.target.value })}
              rows={3} style={{ width: 400, marginBottom: 10 }} />
          </div>
          <div>
            <label>Language</label><br />
            <input value={form.language} onChange={e => setForm({ ...form, language: e.target.value })}
              style={{ width: 120, marginBottom: 10 }} />
          </div>
          <div>
            <label>Status</label><br />
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
              style={{ width: 120, marginBottom: 10 }}>
              <option value="draft">Draft</option>
              <option value="approved">Approved</option>
              <option value="submitted">Submitted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <button onClick={handleSave} style={{
            background: colors.red,
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "6px 18px",
            marginTop: 10
          }}>
            Save
          </button>
        </div>
      )}
      <table style={{ width: "100%", background: colors.card, borderRadius: 8 }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Language</th>
            <th>Status</th>
            <th>Synced</th>
            <th colSpan={3}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {templates.map((tpl: any) => (
            <tr key={tpl.id}>
              <td>{tpl.name}</td>
              <td>{tpl.language}</td>
              <td>{tpl.status}</td>
              <td>{tpl.synced ? "✅" : "❌"}</td>
              <td>
                <button onClick={() => handleEdit(tpl)}>Edit</button>
              </td>
              <td>
                <button onClick={() => handleDelete(tpl.id)}>Delete</button>
              </td>
              <td>
                {tpl.status === "approved" && !tpl.synced && (
                  <button onClick={() => handleSync(tpl.id)}>Sync</button>
                )}
                {tpl.status === "draft" && (
                  <button onClick={() => handleStatus(tpl.id, "approved")}>Approve</button>
                )}
                {tpl.status === "approved" && (
                  <button onClick={() => handleStatus(tpl.id, "draft")}>Revert</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
