import React, { useState } from "react";

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
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("");

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
    </div>
  );
}
