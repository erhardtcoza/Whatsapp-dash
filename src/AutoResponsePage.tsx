import { useEffect, useState } from "react";
import { API_BASE } from "./config";

export default function AutoResponsePage({ colors }: any) {
  const [data, setData] = useState<any[]>([]);
  const [form, setForm] = useState({ tag: "", hours: "", reply: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const TAGS = ["support", "sales", "accounts", "leads"];

  useEffect(() => {
    fetch(`${API_BASE}/api/auto-replies`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, []);

  function handleChange(field: string, value: string) {
    setForm({ ...form, [field]: value });
  }

  async function save() {
    const payload = { ...form, id: editingId };
    await fetch(`${API_BASE}/api/auto-reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const res = await fetch(`${API_BASE}/api/auto-replies`);
    const updated = await res.json();
    setData(updated);
    setForm({ tag: "", hours: "", reply: "" });
    setEditingId(null);
  }

  function edit(row: any) {
    setForm({ tag: row.tag, hours: row.hours, reply: row.reply });
    setEditingId(row.id);
  }

  function cancelEdit() {
    setForm({ tag: "", hours: "", reply: "" });
    setEditingId(null);
  }

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ color: colors.text, fontWeight: 600, fontSize: 22, marginBottom: 18 }}>
        Auto Responses
      </h2>

      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <select
          value={form.tag}
          onChange={(e) => handleChange("tag", e.target.value)}
          style={{
            padding: "7px 12px",
            borderRadius: 6,
            border: `1.3px solid ${colors.border}`,
            fontSize: 15,
            width: 120,
          }}
        >
          <option value="">Select tag</option>
          {TAGS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Hours (e.g., 08:00-17:00)"
          value={form.hours}
          onChange={(e) => handleChange("hours", e.target.value)}
          style={{
            padding: "7px 12px",
            borderRadius: 6,
            border: `1.3px solid ${colors.border}`,
            fontSize: 15,
            width: 160,
          }}
        />
        <input
          type="text"
          placeholder="Auto-reply message"
          value={form.reply}
          onChange={(e) => handleChange("reply", e.target.value)}
          style={{
            padding: "7px 12px",
            borderRadius: 6,
            border: `1.3px solid ${colors.border}`,
            fontSize: 15,
            flex: 1,
          }}
        />
        <button
          onClick={save}
          style={{
            background: colors.red,
            color: "#fff",
            padding: "8px 18px",
            borderRadius: 7,
            border: "none",
            fontWeight: 700,
            fontSize: 15,
            cursor: "pointer",
          }}
        >
          {editingId ? "Update" : "Add"}
        </button>
        {editingId && (
          <button
            onClick={cancelEdit}
            style={{
              background: "#aaa",
              color: "#fff",
              padding: "8px 12px",
              borderRadius: 7,
              border: "none",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ color: colors.sub }}>Loading…</div>
      ) : (
        <>
          {TAGS.map((tag) => {
            const tagRows = data.filter((r) => r.tag === tag);
            if (!tagRows.length) return null;

            return (
              <div key={tag} style={{ marginBottom: 32 }}>
                <h3 style={{ color: colors.red, fontWeight: 700, marginBottom: 10 }}>
                  {tag.toUpperCase()}
                </h3>
                <table style={{ width: "100%", background: colors.card, borderRadius: 8 }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left", padding: 8 }}>Hours</th>
                      <th style={{ textAlign: "left", padding: 8 }}>Reply</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {tagRows.map((row) => (
                      <tr key={row.id}>
                        <td style={{ padding: 8 }}>{row.hours}</td>
                        <td style={{ padding: 8 }}>{row.reply}</td>
                        <td style={{ padding: 8 }}>
                          <button
                            onClick={() => edit(row)}
                            style={{
                              background: colors.red,
                              color: "#fff",
                              border: "none",
                              borderRadius: 6,
                              padding: "4px 10px",
                              fontWeight: 600,
                              fontSize: 14,
                              cursor: "pointer",
                            }}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
