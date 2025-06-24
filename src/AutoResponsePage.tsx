import { useEffect, useState } from "react";
import { API_BASE } from "./config";

const TAGS = [
  { key: "support", label: "Support" },
  { key: "accounts", label: "Accounts" },
  { key: "sales", label: "Sales" },
  { key: "leads", label: "Leads" },
];

export default function AutoResponsePage({ colors }: any) {
  const [data, setData] = useState<any[]>([]);
  const [form, setForm] = useState({ id: 0, tag: "support", hours: "", reply: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/auto-replies`).then(r => r.json()).then(setData);
  }, []);

  function groupByTag(data: any[]) {
    return data.reduce((acc: any, item: any) => {
      if (!acc[item.tag]) acc[item.tag] = [];
      acc[item.tag].push(item);
      return acc;
    }, {});
  }

  async function handleSave() {
    setSaving(true);
    await fetch(`${API_BASE}/api/auto-reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ id: 0, tag: "support", hours: "", reply: "" });
    setSaving(false);
    const updated = await fetch(`${API_BASE}/api/auto-replies`).then(r => r.json());
    setData(updated);
  }

  async function handleDelete(id: number) {
    await fetch(`${API_BASE}/api/auto-reply-delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const updated = await fetch(`${API_BASE}/api/auto-replies`).then(r => r.json());
    setData(updated);
  }

  const grouped = groupByTag(data);

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ color: colors.text, fontSize: 22, marginBottom: 20 }}>Auto Responses</h2>

      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 30 }}>
        <select value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })}>
          {TAGS.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
        </select>
        <input type="text" placeholder="Hours" value={form.hours} onChange={e => setForm({ ...form, hours: e.target.value })} />
        <input type="text" placeholder="Reply" value={form.reply} onChange={e => setForm({ ...form, reply: e.target.value })} />
        <button type="submit" disabled={saving}>Save</button>
      </form>

      {Object.entries(grouped).map(([tag, replies]: any) => (
        <div key={tag} style={{ marginBottom: 30 }}>
          <h3 style={{ color: colors.red }}>{TAGS.find(t => t.key === tag)?.label}</h3>
          <table>
            <thead>
              <tr><th>Hours</th><th>Reply</th><th></th></tr>
            </thead>
            <tbody>
              {replies.map((r: any) => (
                <tr key={r.id}>
                  <td>{r.hours}</td>
                  <td>{r.reply}</td>
                  <td>
                    <button onClick={() => setForm(r)}>Edit</button>
                    <button onClick={() => handleDelete(r.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
