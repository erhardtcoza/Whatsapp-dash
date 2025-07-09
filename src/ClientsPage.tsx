import React, { useState, useEffect } from "react";

// ...parseCSV function as before

export default function ClientsPage() {
  // CSV upload states
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("");

  // Data states
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  // Local search state
  const [search, setSearch] = useState("");

  // Fetch clients (once, or you can trigger on search for server-side search)
  useEffect(() => {
    setLoading(true);
    fetch("/api/clients")
      .then(res => res.json())
      .then(data => setClients(data))
      .finally(() => setLoading(false));
  }, []);

  // Local filtering
  const filteredClients = clients.filter(c => {
    const q = search.toLowerCase();
    return (
      (c["Full name"] || "").toLowerCase().includes(q) ||
      (c["Phone number"] || "").toLowerCase().includes(q) ||
      (c.ID || "").toLowerCase().includes(q) ||
      (c.Labels || "").toLowerCase().includes(q) ||
      (c.City || "").toLowerCase().includes(q)
    );
  });

  // CSV upload logic (unchanged)
  async function handleCSVUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setStatus("Uploading...");
    const text = await file.text();
    const rows = parseCSV(text);

    const res = await fetch("/api/upload-clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows }),
    });
    if (res.ok) {
      const data = await res.json();
      setStatus(`Upload successful: ${data.replaced} clients replaced.`);
      // Optionally refresh clients here
    } else {
      setStatus("Upload failed. Try again.");
    }
    setUploading(false);
  }

  return (
    <div style={{ padding: 24 }}>
      {/* CSV Upload Section */}
      <h2>Clients</h2>
      <label style={{ fontWeight: "bold" }}>Update clients by uploading CSV:</label>
      <input
        type="file"
        accept=".csv,.txt"
        onChange={handleCSVUpload}
        disabled={uploading}
        style={{ margin: "8px 0" }}
      />
      {status && <div style={{ marginTop: 12, color: status.includes("success") ? "green" : "red" }}>{status}</div>}
      <div style={{ marginTop: 24, fontSize: 14, color: "#555" }}>
        <b>Required fields in CSV (tab-delimited, headers):</b><br />
        Status, ID, Full name, Phone number, Street, ZIP code, City, Payment Method, Account balance, Labels
      </div>

      {/* --- Search Input --- */}
      <div style={{ margin: "30px 0 18px 0" }}>
        <input
          type="text"
          placeholder="Search clients (name, phone, ID, city, label...)"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: 320, padding: 7, fontSize: 15, borderRadius: 6,
            border: "1.2px solid #ddd"
          }}
        />
        {loading && <span style={{ marginLeft: 15 }}>Loading clients...</span>}
      </div>

      {/* --- Filtered Table --- */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr style={{ background: "#eee" }}>
              <th>Status</th>
              <th>ID</th>
              <th>Full Name</th>
              <th>Phone</th>
              <th>Street</th>
              <th>ZIP</th>
              <th>City</th>
              <th>Payment</th>
              <th>Balance</th>
              <th>Labels</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((c, i) => (
              <tr key={c.ID || i}>
                <td>{c.Status}</td>
                <td>{c.ID}</td>
                <td>{c["Full name"]}</td>
                <td>{c["Phone number"]}</td>
                <td>{c.Street}</td>
                <td>{c["ZIP code"]}</td>
                <td>{c.City}</td>
                <td>{c["Payment Method"]}</td>
                <td>{c["Account balance"]}</td>
                <td>{c.Labels}</td>
                <td>
                  <a href={`/clients/${c.ID}`}>View</a>
                </td>
              </tr>
            ))}
            {filteredClients.length === 0 && !loading && (
              <tr>
                <td colSpan={11} style={{ textAlign: "center", color: "#888" }}>
                  No clients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
