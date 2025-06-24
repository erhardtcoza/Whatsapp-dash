import { useEffect, useState } from "react";
import { API_BASE } from "./config";

const TAGS = [
  { key: "support", label: "Support" },
  { key: "accounts", label: "Accounts" },
  { key: "sales", label: "Sales" },
  { key: "leads", label: "Leads" },
];

const DAYS = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

export default function OfficeHoursPage({ colors }: any) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchHours(); }, []);
  function fetchHours() {
    setLoading(true);
    fetch(`${API_BASE}/api/office-hours`)
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }

  function getHours(tag: string, day: number) {
    return data.find((row: any) => row.tag === tag && row.day === day) || {};
  }

  function handleChange(tag: string, day: number, field: string, value: any) {
    setData(data =>
      data.map((row: any) =>
        row.tag === tag && row.day === day
          ? { ...row, [field]: value }
          : row
      )
    );
  }

  async function save(tag: string, day: number, row: any) {
    setSaving(true);
    await fetch(`${API_BASE}/api/office-hours`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tag,
        day,
        open_time: row.open_time || "08:00",
        close_time: row.close_time || "17:00",
        closed: row.closed ? 1 : 0,
      })
    });
    setSaving(false);
    fetchHours();
  }

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ color: colors.text, fontWeight: 600, fontSize: 22, marginBottom: 18 }}>
        Office Hours Per Department
      </h2>
      {loading ? (
        <div style={{ color: colors.sub }}>Loading…</div>
      ) : (
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
          {TAGS.map(t => (
            <div key={t.key} style={{ minWidth: 300 }}>
              <h3 style={{ color: colors.red, fontWeight: 700, margin: "12px 0 6px 0" }}>{t.label}</h3>
              <table style={{ width: "100%", background: colors.card, borderRadius: 9 }}>
                <thead>
                  <tr>
                    <th style={{ padding: "7px 6px", fontWeight: 600, color: colors.sub }}>Day</th>
                    <th style={{ padding: "7px 6px", fontWeight: 600, color: colors.sub }}>Open</th>
                    <th style={{ padding: "7px 6px", fontWeight: 600, color: colors.sub }}>Close</th>
                    <th style={{ padding: "7px 6px", fontWeight: 600, color: colors.sub }}>Closed</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {DAYS.map((day, i) => {
                    const row = getHours(t.key, i) || {};
                    return (
                      <tr key={day}>
                        <td style={{ padding: "6px" }}>{day}</td>
                        <td style={{ padding: "6px" }}>
                          <input
                            type="time"
                            value={row.open_time || "08:00"}
                            disabled={!!row.closed}
                            onChange={e => handleChange(t.key, i, "open_time", e.target.value)}
                          />
                        </td>
                        <td style={{ padding: "6px" }}>
                          <input
                            type="time"
                            value={row.close_time || "17:00"}
                            disabled={!!row.closed}
                            onChange={e => handleChange(t.key, i, "close_time", e.target.value)}
                          />
                        </td>
                        <td style={{ padding: "6px", textAlign: "center" }}>
                          <input
                            type="checkbox"
                            checked={!!row.closed}
                            onChange={e => handleChange(t.key, i, "closed", e.target.checked ? 1 : 0)}
                          />
                        </td>
                        <td style={{ padding: "6px" }}>
                          <button
                            style={{
                              background: colors.red,
                              color: "#fff",
                              border: "none",
                              borderRadius: 7,
                              padding: "4px 10px",
                              fontWeight: 700,
                              fontSize: 14,
                              cursor: "pointer",
                              opacity: saving ? 0.6 : 1,
                            }}
                            onClick={() => save(t.key, i, { ...row })}
                            disabled={saving}
                          >Save</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
