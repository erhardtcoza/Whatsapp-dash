import { useEffect, useState } from "react";
import { API_BASE } from "./config";

interface Reply {
  id: number;
  tag: string;
  hours: string;
  reply: string;
}

export default function AutoResponsePage({ colors }: { colors: any }) {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [form, setForm] = useState({ id: 0, tag: "support", hours: "", reply: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadReplies();
  }, []);

  async function loadReplies() {
    const res = await fetch(`${API_BASE}/api/auto-replies`);
    const data = await res.json();
    setReplies(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.reply.trim()) return;
    await fetch(`${API_BASE}/api/auto-reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ id: 0, tag: "support", hours: "", reply: "" });
    setMessage("Saved.");
    loadReplies();
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this auto-reply?")) return;
    await fetch(`${API_BASE}/api/auto-reply-delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadReplies();
  }

  function groupByTag(data: Reply[]) {
    return data.reduce((acc: Record<string, Reply[]>, item) => {
      if (!acc[item.tag]) acc[item.tag] = [];
      acc[item.tag].push(item);
      return acc;
    }, {});
  }

  const grouped = groupByTag(replies);

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ color: colors.text, fontSize: 22, marginBottom: 20 }}>Auto Responses</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 500, marginBottom: 30 }}>
        <select value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} style={{ padding: 8 }}>
          <option value="support">Support</option>
          <option value="sales">Sales</option>
          <option value="accounts">Accounts</option>
        </select>
        <input
          placeholder="Hours (e.g. 08:00-17:00)"
          value={form.hours}
          onChange={e => setForm({ ...form, hours: e.target.value })}
          style={{ padding: 8 }}
        />
        <textarea
          placeholder="Auto-reply message"
          value={form.reply}
          onChange={e => setForm({ ...form, reply: e.target.value })}
          rows={3}
          style={{ padding: 8 }}
        />
        <button type="submit" style={{ background: colors.red, color: "#fff", padding: 10, fontWeight: 600, border: "none", borderRadius: 6 }}>
          {form.id ? "Update" : "Add"} Auto Reply
        </button>
        {message && <div style={{ color: colors.sub }}>{message}</div>}
      </form>

      {Object.entries(grouped).map(([tag, items]) => (
        <div key={tag} style={{ marginBottom: 30 }}>
          <h3 style={{ color: colors.text, marginBottom: 10 }}>{tag.toUpperCase()}</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: 6 }}>Hours</th>
                <th style={{ textAlign: "left", padding: 6 }}>Reply</th>
                <th style={{ padding: 6 }}></th>
              </tr>
            </thead>
            <tbody>
              {items.map(r => (
                <tr key={r.id}>
                  <td style={{ padding: 6, verticalAlign: "top", color: colors.td }}>{r.hours}</td>
                  <td style={{ padding: 6, verticalAlign: "top", color: colors.td }}>{r.reply}</td>
                  <td style={{ padding: 6 }}>
                    <button onClick={() => setForm(r)} style={{ marginRight: 8 }}>Edit</button>
                    <button onClick={() => handleDelete(r.id)} style={{ color: colors.red }}>Delete</button>
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
