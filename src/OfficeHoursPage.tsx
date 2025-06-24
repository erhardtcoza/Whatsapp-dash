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

function nowISO() {
  return new Date().toISOString().slice(0, 10);
}
function dayOfWeek() {
  return new Date().getDay();
}

export default function OfficeHoursPage({ colors }: any) {
  const [data, setData] = useState<any[]>([]);
  const [global, setGlobal] = useState<any>({});
  const [holidays, setHolidays] = useState<any[]>([]);
  const [holidayInput, setHolidayInput] = useState({ date: "", name: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchAll(); }, []);
  async function fetchAll() {
    setLoading(true);
    const [d, g, h] = await Promise.all([
      fetch(`${API_BASE}/api/office-hours`).then(r => r.json()),
      fetch(`${API_BASE}/api/office-global`).then(r => r.json()),
      fetch(`${API_BASE}/api/public-holidays`).then(r => r.json()),
    ]);
    setData(d);
    setGlobal(g);
    setHolidays(h);
    setLoading(false);
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
    fetchAll();
  }

  async function setGlobalClosed(closed: boolean, message = "") {
    setSaving(true);
    await fetch(`${API_BASE}/api/office-global`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ closed, message }),
    });
    setSaving(false);
    fetchAll();
  }

  // --- Public Holidays ---
  async function addHoliday(e: any) {
    e.preventDefault();
    await fetch(`${API_BASE}/api/public-holidays`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(holidayInput)
    });
    setHolidayInput({ date: "", name: "" });
    fetchAll();
  }
  async function deleteHoliday(id: number) {
    await fetch(`${API_BASE}/api/public-holidays/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchAll();
  }

  // --- Status calculation ---
  function isHolidayToday() {
    const today = nowISO();
    return holidays.some(h => h.date === today);
  }
  function officeStatus(tag: string) {
    if (global.closed) return { open: false, msg: global.message || "Closed by admin" };
    if (isHolidayToday()) return { open: false, msg: "Closed (Public Holiday)" };

    const day = dayOfWeek();
    const row = getHours(tag, day);
    if (!row || row.closed) return { open: false, msg: "Closed today" };
    const now = new Date();
    const open = row.open_time || "08:00";
    const close = row.close_time || "17:00";
    const [h1, m1] = open.split(":").map(Number);
    const [h2, m2] = close.split(":").map(Number);
    const start = new Date(now);
    start.setHours(h1, m1, 0, 0);
    const end = new Date(now);
    end.setHours(h2, m2, 0, 0);
    if (now < start || now > end) return { open: false, msg: "Closed (out of hours)" };
    return { open: true, msg: "Open now" };
  }

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ color: colors.text, fontWeight: 600, fontSize: 22, marginBottom: 18 }}>
        Office Hours Management
      </h2>

      {/* Global close/open */}
      <div style={{
        marginBottom: 30, display: "flex", gap: 18, alignItems: "center",
        background: "#fff7f7", border: `2px solid ${colors.red}`, borderRadius: 10, padding: "14px 24px"
      }}>
        <span style={{
          fontWeight: 600,
          color: global.closed ? colors.red : "green",
          fontSize: 19,
          marginRight: 10,
        }}>
          Emergency Closure:&nbsp;
          {global.closed ? "OFFICE CLOSED" : "OFFICE OPEN"}
        </span>
        <button
          style={{
            background: global.closed ? "#2a2" : colors.red,
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "9px 16px",
            fontWeight: 700,
            fontSize: 15,
            cursor: "pointer",
            marginRight: 18
          }}
          onClick={() => setGlobalClosed(!global.closed, global.message)}
        >
          {global.closed ? "Set Office Open" : "Emergency Close All"}
        </button>
        <input
          type="text"
          placeholder="Closure message"
          value={global.message || ""}
          style={{
            borderRadius: 7, border: `1.3px solid ${colors.border}`,
            padding: "6px 10px", fontSize: 15, width: 280,
          }}
          onChange={e => setGlobalClosed(global.closed, e.target.value)}
          disabled={!global.closed}
        />
      </div>

      {/* Status per tag */}
      <div style={{ margin: "0 0 28px 0", display: "flex", gap: 32 }}>
        {TAGS.map(t => {
          const status = officeStatus(t.key);
          return (
            <div key={t.key} style={{
              background: "#fafafa",
              borderRadius: 7,
              padding: "10px 22px",
              minWidth: 170,
              border: status.open ? "2px solid #2c2" : `2px solid ${colors.red}`,
              color: status.open ? "#247524" : colors.red,
              fontWeight: 700,
            }}>
              {t.label}: {status.open ? "Open" : "Closed"}
              <div style={{
                fontWeight: 500, fontSize: 13, color: colors.sub, marginTop: 3,
              }}>
                {status.msg}
              </div>
            </div>
          );
        })}
      </div>

      {/* Per-tag hours */}
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

      {/* Public Holidays */}
      <div style={{ marginTop: 48 }}>
        <h3 style={{ color: colors.red, fontWeight: 700, margin: "6px 0 14px 0" }}>
          Public Holidays
        </h3>
        <form onSubmit={addHoliday} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
          <input
            type="date"
            value={holidayInput.date}
            onChange={e => setHolidayInput(h => ({ ...h, date: e.target.value }))}
            style={{
              borderRadius: 7, border: `1.3px solid ${colors.border}`,
              padding: "6px 10px", fontSize: 15,
            }}
          />
          <input
            type="text"
            placeholder="Holiday Name"
            value={holidayInput.name}
            onChange={e => setHolidayInput(h => ({ ...h, name: e.target.value }))}
            style={{
              borderRadius: 7, border: `1.3px solid ${colors.border}`,
              padding: "6px 10px", fontSize: 15,
            }}
          />
          <button
            type="submit"
            style={{
              background: colors.red,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "7px 16px",
              fontWeight: "bold",
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            Add
          </button>
        </form>
        <table style={{ width: "100%", background: colors.card, borderRadius: 8 }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "8px 10px" }}>Date</th>
              <th style={{ textAlign: "left", padding: "8px 10px" }}>Name</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {holidays.map(h => (
              <tr key={h.id}>
                <td style={{ padding: "8px 10px" }}>{h.date}</td>
                <td style={{ padding: "8px 10px" }}>{h.name}</td>
                <td>
                  <button
                    onClick={() => deleteHoliday(h.id)}
                    style={{
                      background: colors.red,
                      color: "#fff",
                      border: "none",
                      borderRadius: 7,
                      fontWeight: 700,
                      fontSize: 14,
                      padding: "4px 12px",
                      cursor: "pointer"
                    }}
                  >Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
