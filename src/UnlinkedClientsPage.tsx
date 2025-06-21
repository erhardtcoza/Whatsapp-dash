import { useEffect, useState } from "react";

export default function UnlinkedClientsPage({ colors }: any) {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://w-api.vinetdns.co.za/api/unlinked-clients")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setClients(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Could not load clients");
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: "38px 36px", width: "100%" }}>
      <h2 style={{ color: colors.red, fontWeight: 700, marginBottom: 20 }}>Unlinked Clients</h2>
      {error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : loading ? (
        <div style={{ color: colors.text }}>Loading...</div>
      ) : clients.length === 0 ? (
        <div style={{ color: colors.sub }}>No unlinked clients found.</div>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: colors.card,
            color: colors.text,
            borderRadius: 10,
            boxShadow: "0 1px 7px #0001",
            overflow: "hidden",
          }}
        >
          <thead>
            <tr style={{ background: colors.input }}>
              <th style={th}>Name</th>
              <th style={th}>Number</th>
              <th style={th}>Email</th>
              <th style={th}>Last Message</th>
              <th style={th}></th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.from_number}>
                <td style={td}>{c.name || <span style={{ color: colors.sub }}>N/A</span>}</td>
                <td style={td}>{c.from_number}</td>
                <td style={td}>{c.email || <span style={{ color: colors.sub }}>N/A</span>}</td>
                <td style={td}>{c.last_msg ? new Date(c.last_msg).toLocaleString() : ""}</td>
                <td style={td}>
                  <button
                    style={{
                      background: colors.red,
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      padding: "5px 14px",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontSize: 14,
                    }}
                    onClick={() => alert("Assign/link function here")}
                  >
                    Assign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const th = {
  padding: "10px 8px",
  textAlign: "left" as const,
  fontWeight: 700,
  fontSize: 15,
  borderBottom: "2px solid #eaeaea",
};
const td = {
  padding: "10px 8px",
  fontSize: 15,
  borderBottom: "1px solid #eaeaea",
};
