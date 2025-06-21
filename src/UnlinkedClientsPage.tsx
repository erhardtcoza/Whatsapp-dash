import { useEffect, useState } from "react";

// Dummy API fetch for unlinked clients — replace with your real fetch!
async function fetchUnlinkedClients() {
  // Example fetch: adjust to your backend
  // const res = await fetch("/api/unlinked-clients");
  // return await res.json();
  return [
    { id: 1, name: "John Doe", number: "27821234567", email: "john@doe.com", status: "Unlinked" },
    { id: 2, name: "No Name", number: "27829998888", email: "", status: "Unlinked" },
  ];
}

export default function UnlinkedClientsPage({ colors, darkMode }: { colors: any; darkMode: boolean }) {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUnlinkedClients().then(data => {
      setClients(data);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ padding: "38px 36px" }}>
      <h2 style={{ color: colors.red, fontWeight: 700, marginBottom: 20 }}>Unlinked Clients</h2>
      {loading ? (
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
            <tr style={{ background: darkMode ? "#262931" : "#f2f2f2" }}>
              <th style={th}>Name</th>
              <th style={th}>Number</th>
              <th style={th}>Email</th>
              <th style={th}>Status</th>
              <th style={th}></th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id}>
                <td style={td}>{c.name || <span style={{ color: colors.sub }}>N/A</span>}</td>
                <td style={td}>{c.number}</td>
                <td style={td}>{c.email || <span style={{ color: colors.sub }}>N/A</span>}</td>
                <td style={td}><span style={{ background: colors.badge, color: "#fff", borderRadius: 7, padding: "3px 10px", fontSize: 13 }}>{c.status}</span></td>
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
                    onClick={() => alert("Assign/link not implemented yet")}
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

