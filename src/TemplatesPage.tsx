import { useEffect, useState } from "react";
import { API_BASE } from "./config";

export default function TemplatesPage({ colors }: any) {
  const [templates, setTemplates] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ name: "", body: "", language: "en", status: "draft" });
  const [refresh, setRefresh] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/templates`)
      .then(r => r.json())
      .then(setTemplates)
      .catch(() => setTemplates([]));
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
    setSaving(true);
    const payload = { ...form };
    if (editing) payload.id = editing.id;
    await fetch(`${API_BASE}/api/templates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
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
    setEditing(null);
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
      <h2 style={{ color: colors.red, marginBottom: 22 }}>Templates</h2>
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
          marginBottom: 24,
          maxWidth: 650,
        }}>
          <div style={{ marginBottom: 12 }}>
            <label>Name</label><br />
            <input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              style={{ width: 280, marginBottom: 6 }}
              maxLength={64}
              disabled={!!editing?.synced}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Body</label><br />
            <textarea
              value={form.body}
              onChange={e => setForm({ ...form, body: e.target.value })}
              rows={3}
              style={{ width: 400, marginBottom: 6 }}
              maxLength={1024}
              disabled={!!editing?.synced}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Language</label><br />
            <input
              value={form.language}
              onChange={e => setForm({ ...form, language: e.target.value })}
              style={{ width: 120, marginBottom: 6 }}
              maxLength={6}
              disabled={!!editing?.synced}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Status</label><br />
            <select
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
              style={{ width: 120, marginBottom: 6 }}
              disabled={!!editing?.synced}
            >
              <option value="draft">Draft</option>
              <option value="approved">Approved</option>
              <option value="submitted">Submitted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <button
            onClick={handleSave}
            style={{
              background: colors.red,
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "6px 18px",
              marginTop: 10,
              cursor: "pointer",
              opacity: saving ? 0.7 : 1,
            }}
            disabled={saving || !!editing?.synced}
          >
            {saving ? "Saving…" : "Save"}
          </button>
          <button
            onClick={() => setEditing(null)}
            style={{
              background: "none",
              color: colors.red,
              border: `1px solid ${colors.red}`,
              borderRadius: 6,
              padding: "6px 14px",
              marginLeft: 16,
              cursor: "pointer"
            }}
          >
            Cancel
          </button>
        </div>
      )}

      <table style={{
        width: "100%",
        background: colors.card,
        borderRadius: 8,
        borderCollapse: "collapse",
        marginTop: 10,
      }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: 8 }}>Name</th>
            <th style={{ textAlign: "left", padding: 8 }}>Language</th>
            <th style={{ textAlign: "left", padding: 8 }}>Status</th>
            <th style={{ textAlign: "left", padding: 8 }}>Synced</th>
            <th colSpan={4} style={{ padding: 8 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {templates.length === 0 ? (
            <tr>
              <td colSpan={8} style={{ color: colors.sub, padding: 18, textAlign: "center" }}>
                No templates found.
              </td>
            </tr>
          ) : templates.map((tpl: any) => (
            <tr key={tpl.id} style={{ background: editing && editing.id === tpl.id ? "#f0f6ff" : undefined }}>
              <td style={{ padding: 8 }}>{tpl.name}</td>
              <td style={{ padding: 8 }}>{tpl.language}</td>
              <td style={{ padding: 8 }}>{tpl.status}</td>
              <td style={{ padding: 8, textAlign: "center" }}>{tpl.synced ? "✅" : "❌"}</td>
              <td style={{ padding: 8 }}>
                <button
                  onClick={() => handleEdit(tpl)}
                  style={{
                    background: "#eee", color: "#222", border: "none",
                    borderRadius: 4, padding: "4px 10px", cursor: "pointer"
                  }}
                  disabled={!!editing}
                >
                  Edit
                </button>
              </td>
              <td style={{ padding: 8 }}>
                <button
                  onClick={() => handleDelete(tpl.id)}
                  style={{
                    background: "#fff", color: colors.red, border: `1px solid ${colors.red}`,
                    borderRadius: 4, padding: "4px 10px", cursor: "pointer"
                  }}
                  disabled={!!editing}
                >
                  Delete
                </button>
              </td>
              <td style={{ padding: 8 }}>
                <button
                  onClick={() => handleStatus(tpl.id, tpl.status === "draft" ? "approved" : "draft")}
                  style={{
                    background: tpl.status === "draft" ? "#8cd17d" : "#eee",
                    color: tpl.status === "draft" ? "#fff" : "#222",
                    border: "none",
                    borderRadius: 4, padding: "4px 10px", cursor: "pointer"
                  }}
                  disabled={tpl.synced || !!editing}
                >
                  {tpl.status === "draft" ? "Approve" : "Revert"}
                </button>
              </td>
              <td style={{ padding: 8 }}>
                <button
                  onClick={() => handleSync(tpl.id)}
                  style={{
                    background: colors.red,
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    padding: "4px 10px",
                    cursor: tpl.status !== "approved" || tpl.synced ? "not-allowed" : "pointer",
                    opacity: tpl.status !== "approved" || tpl.synced ? 0.5 : 1,
                  }}
                  disabled={tpl.status !== "approved" || tpl.synced || !!editing}
                  title={
                    tpl.synced
                      ? "Already synced"
                      : tpl.status !== "approved"
                        ? "Template must be approved first"
                        : "Sync to WhatsApp"
                  }
                >
                  Sync
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
