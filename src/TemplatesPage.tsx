import { useEffect, useState } from "react";
import { API_BASE } from "./config";

export default function TemplatesPage({ colors }: any) {
  const [templates, setTemplates] = useState<any[]>([]);
  const [form, setForm] = useState({ id: null, name: "", body: "", language: "en", status: "draft" });
  const [editing, setEditing] = useState(false);

  // Load all templates
  useEffect(() => {
    fetch(`${API_BASE}/api/templates`)
      .then(r => r.json())
      .then(setTemplates);
  }, []);

  // Save (Add/Edit)
  async function saveTemplate() {
    if (!form.name.trim() || !form.body.trim()) return;
    await fetch(`${API_BASE}/api/templates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setTemplates(await fetch(`${API_BASE}/api/templates`).then(r => r.json()));
    setEditing(false);
    setForm({ id: null, name: "", body: "", language: "en", status: "draft" });
  }

  // Delete
  async function deleteTemplate(id: number) {
    await fetch(`${API_BASE}/api/templates/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    setTemplates(await fetch(`${API_BASE}/api/templates`).then(r => r.json()));
  }

  // Update status (e.g. submit for approval)
  async function updateStatus(id: number, status: string) {
    await fetch(`${API_BASE}/api/templates/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status })
    });
    setTemplates(await fetch(`${API_BASE}/api/templates`).then(r => r.json()));
  }

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ color: colors.red }}>WhatsApp Templates</h2>
      {/* Add/Edit form */}
      <div style={{ marginBottom: 32, background: colors.card, padding: 24, borderRadius: 8, border: `1px solid ${colors.border}` }}>
        <h4>{editing ? "Edit Template" : "Add New Template"}</h4>
        <input
          placeholder="Template Name"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          style={{ margin: 4, padding: 8, width: 220 }}
        />
        <select
          value={form.language}
          onChange={e => setForm(f => ({ ...f, language: e.target.value }))}
          style={{ margin: 4, padding: 8 }}
        >
          <option value="en">English</option>
          <option value="af">Afrikaans</option>
        </select>
        <textarea
          placeholder="Template Body"
          value={form.body}
          onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
          style={{ margin: 4, padding: 8, width: "100%", minHeight: 60 }}
        />
        <button
          style={{ background: colors.red, color: "#fff", padding: "8px 16px", borderRadius: 6, margin: 4 }}
          onClick={saveTemplate}
        >
          {editing ? "Update" : "Add"} Template
        </button>
        {editing && (
          <button
            style={{ marginLeft: 8, color: colors.red, background: "none", border: "1px solid " + colors.red, padding: "8px 16px", borderRadius: 6 }}
            onClick={() => {
              setEditing(false);
              setForm({ id: null, name: "", body: "", language: "en", status: "draft" });
            }}
          >
            Cancel
          </button>
        )}
      </div>
      {/* List */}
      <table style={{ width: "100%", background: colors.card, borderRadius: 8, border: `1px solid ${colors.border}` }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Body</th>
            <th>Language</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {templates.map(tpl => (
            <tr key={tpl.id}>
              <td>{tpl.name}</td>
              <td style={{ whiteSpace: "pre-wrap" }}>{tpl.body}</td>
              <td>{tpl.language}</td>
              <td>{tpl.status}</td>
              <td>
                <button onClick={() => {
                  setEditing(true);
                  setForm(tpl);
                }}>Edit</button>
                <button onClick={() => deleteTemplate(tpl.id)} style={{ color: "red", marginLeft: 8 }}>Delete</button>
                {/* Change status */}
                {tpl.status === "draft" && (
                  <button onClick={() => updateStatus(tpl.id, "submitted")} style={{ marginLeft: 8 }}>Submit</button>
                )}
                {tpl.status === "submitted" && (
                  <button onClick={() => updateStatus(tpl.id, "approved")} style={{ marginLeft: 8, color: "green" }}>Approve</button>
                )}
                {tpl.status === "submitted" && (
                  <button onClick={() => updateStatus(tpl.id, "rejected")} style={{ marginLeft: 8, color: "orange" }}>Reject</button>
                )}
              </td>
            </tr>
          ))}
          {templates.length === 0 && (
            <tr><td colSpan={5} style={{ color: colors.sub, textAlign: "center" }}>No templates found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
