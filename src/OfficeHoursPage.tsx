import { useEffect, useState } from "react";
import { API_BASE } from "./config";

interface HoursEntry {
  id: number;
  day: string;
  start_time: string;
  end_time: string;
  active: boolean;
}

export default function OfficeHoursPage({ colors }: { colors: any }) {
  const [hours, setHours] = useState<HoursEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHours();
  }, []);

  async function fetchHours() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/office-hours`);
      if (!res.ok) throw new Error("Failed to fetch office hours.");
      const data = await res.json();
      setHours(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div style={{ padding: 48, color: colors.sub }}>Loading office hours…</div>;
  if (error)   return <div style={{ padding: 48, color: colors.red }}>{error}</div>;

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ color: colors.text, fontWeight: 600, fontSize: 22, marginBottom: 18 }}>
        Office Hours
      </h2>
      {hours.length === 0 ? (
        <div style={{ color: colors.sub }}>No office hours configured.</div>
      ) : (
        <table style={{ width: "100%", background: colors.card, borderRadius: 10, boxShadow: "0 2px 10px #0001" }}>
          <thead>
            <tr style={{ background: colors.bg, color: colors.sub }}>
              <th style={{ textAlign: "left", padding: "10px 18px" }}>Day</th>
              <th style={{ textAlign: "left", padding: "10px 18px" }}>Start</th>
              <th style={{ textAlign: "left", padding: "10px 18px" }}>End</th>
              <th style={{ textAlign: "left", padding: "10px 18px" }}>Active</th>
            </tr>
          </thead>
          <tbody>
            {hours.map(h => (
              <tr key={h.id}>
                <td style={{ padding: "10px 18px", color: colors.text }}>{h.day}</td>
                <td style={{ padding: "10px 18px", color: colors.text }}>{h.start_time}</td>
                <td style={{ padding: "10px 18px", color: colors.text }}>{h.end_time}</td>
                <td style={{ padding: "10px 18px", color: h.active ? colors.text : colors.sub }}>
                  {h.active ? "Yes" : "No"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
