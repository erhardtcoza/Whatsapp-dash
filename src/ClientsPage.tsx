import React, { useState, useEffect } from "react";

// Simple CSV parser (works for simple CSVs, for advanced use PapaParse)
function parseCSV(text) {
  const lines = text.split("\n").filter(Boolean);
  const headers = lines[0].replace(/\r/g, '').split("\t").map(h => h.replace(/(^"|"$)/g, ''));
  return lines.slice(1).map(line => {
    const values = line.replace(/\r/g, '').split("\t").map(val => val.replace(/(^"|"$)/g, ''));
    const obj = {};
    headers.forEach((h, i) => obj[h] = values[i] || "");
    return obj;
  });
}

export default function ClientsPage() {
  // CSV Upload states
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("");

  // Client list/search states
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch clients (with optional search)
  useEffect(() => {
    setLoading(true);
    fetch(`/api/clients?search=${encodeURIComponent(search)}`)
      .then(res => res.json())
      .then(data => setClients(data))
      .finally(() => setLoading(false));
  }, [search]);

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

      {/* Client Search & Table */}
      <hr style={{ margin: "32px 0 16px 0" }} />
      <div>
        <input
          type="text"
          placeholder="Search clients (name, phone, ID, label...)"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 320, marginBottom: 16, padding: 6 }}
        />
        {loading ? <div>Loading clients...</div> : null}
      </div>

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
            {clients.map((c, i) => (
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
                  {/* Extend with more actions if needed */}
                </td>
              </tr>
            ))}
            {(!clients || clients.length === 0) && !loading && (
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
