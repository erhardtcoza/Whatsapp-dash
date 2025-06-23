import { useEffect, useState } from "react";

type UnlinkedClient = {
  from_number: string;
  last_msg: number;
  name: string;
  email: string;
};

export default function UnlinkedClientsPage({ colors }: any) {
  const [clients, setClients] = useState<UnlinkedClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("/api/unlinked-clients")
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then(setClients)
      .catch(() => setError("Could not load unlinked clients."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      style={{
        padding: "28px 24px",
        minHeight: 350,
        color: colors.text,
      }}
    >
      <h2 style={{ fontWeight: 600, fontSize: 24, color: colors.red, marginBottom: 14 }}>
        Unlinked Clients
      </h2>
      {loading ? (
        <div style={{ color: colors.sub }}>Loading…</div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : clients.length === 0 ? (
        <div style={{ color: colors.sub }}>No unlinked clients found.</div>
      ) : (
        <table
          style={{
            width: "100%",
            background: colors.card,
            borderRadius: 16,
            boxShadow: "0 2px 14px #0001",
            borderCollapse: "separate",
            borderSpacing: 0,
            fontSize: 15,
            marginTop: 6,
          }}
        >
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: 12, color: colors.sub }}>Number</th>
              <th style={{ textAlign: "left", padding: 12, color: colors.sub }}>Last Msg</th>
              <th style={{ textAlign: "left", padding: 12, color: colors.sub }}>Name</th>
              <th style={{ textAlign: "left", padding: 12, color: colors.sub }}>Email</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.from_number}>
                <td style={{ padding: 12 }}>{c.from_number}</td>
                <td style={{ padding: 12 }}>
                  {c.last_msg ? new Date(c.last_msg).toLocaleString() : ""}
                </td>
                <td style={{ padding: 12 }}>{c.name || <span style={{ color: "#aaa" }}>—</span>}</td>
                <td style={{ padding: 12 }}>{c.email || <span style={{ color: "#aaa" }}>—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
