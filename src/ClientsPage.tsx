import React, { useState, useEffect } from "react";

// Define the Client type to match your API structure
type Client = {
  Status: string | null;
  ID: string | null;
  "Full name": string | null;
  "Phone number": string | null;
  Street: string | null;
  "ZIP code": string | null;
  City: string | null;
  "Payment Method": string | null;
  "Account balance": string | number | null;
  Labels: string | null;
};

// Robust CSV parser: handles leading tab, quoting, and auto-detects tab/comma
function parseCSV(text: string): Client[] {
  const lines = text.split("\n").filter(Boolean);
  for (let i = 0; i < lines.length; i++) {
    if (lines[i][0] === "\t") lines[i] = lines[i].slice(1);
  }
  const delimiter = lines[0].includes("\t") ? "\t" : ",";
  const headers = lines[0].replace(/\r/g, '').split(delimiter).map(h => h.replace(/(^"|"$)/g, ''));
  return lines.slice(1).map(line => {
    const values = line.replace(/\r/g, '').split(delimiter).map(val => val.replace(/(^"|"$)/g, ''));
    const obj: any = {};
    headers.forEach((h, i) => obj[h] = values[i] || null);
    return obj as Client;
  });
}

export default function ClientsPage() {
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [failedRows, setFailedRows] = useState<{ idx: number; reason: string; row: any }[]>([]);

  // Fetch clients with retry logic
  const fetchClients = async (retries = 3, delay = 1000) => {
    setLoading(true);
    setError(null);
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const url = showVerifiedOnly ? "/api/clients?verified=1" : "/api/clients";
        const res = await fetch(url, {
          headers: { "Accept": "application/json", "Cache-Control": "no-cache" },
        });
        console.log(`Fetch attempt ${attempt}: Status ${res.status}, Content-Type: ${res.headers.get("Content-Type")}`);
        if (!res.ok) {
          const text = await res.text();
          console.error(`API response (non-JSON, attempt ${attempt}):`, text);
          throw new Error(`HTTP ${res.status}: ${text || "Unknown error"}`);
        }
        const data = await res.json();
        console.log(`Fetched clients (attempt ${attempt}):`, data);
        if (data.error) {
          throw new Error(data.error);
        }
        setClients(Array.isArray(data) ? data : []);
        return; // Success, exit retry loop
      } catch (err: any) {
        console.error(`Error fetching clients (attempt ${attempt}):`, err);
        if (attempt === retries) {
          setError(`Failed to load clients after ${retries} attempts: ${err.message}`);
        } else {
          await new Promise(resolve => setTimeout(resolve, delay)); // Wait before retry
        }
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClients();
  }, [showVerifiedOnly]);

  const filteredClients = clients.filter((c) => {
    const q = search.toLowerCase();
    return (
      (c["Full name"]?.toLowerCase()?.includes(q) || false) ||
      (c["Phone number"]?.toLowerCase()?.includes(q) || false) ||
      (c.ID?.toLowerCase()?.includes(q) || false) ||
      (c.Labels?.toLowerCase()?.includes(q) || false) ||
      (c.City?.toLowerCase()?.includes(q) || false)
    );
  });
// ... (previous code unchanged)

    // --- API: Upload clients via CSV/JSON ---
    if (url.pathname === "/api/upload-clients" && request.method === "POST") {
      try {
        const data = await request.json();
        const rows = data.rows || [];
        let replaced = 0;
        const failed_rows = [];

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          try {
            // Validate required fields
            if (!row["Phone number"] || !row.ID || !row["Full name"]) {
              failed_rows.push({ idx: i + 1, reason: "Missing required fields: Phone number, ID, or Full name", row });
              continue;
            }
            await env.DB.prepare(`
              INSERT INTO customers (
                phone, status, customer_id, name, street, zip_code, city, payment_method, balance, labels, verified
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
              ON CONFLICT(phone) DO UPDATE SET
                status = excluded.status,
                customer_id = excluded.customer_id,
                name = excluded.name,
                street = excluded.street,
                zip_code = excluded.zip_code,
                city = excluded.city,
                payment_method = excluded.payment_method,
                balance = excluded.balance,
                labels = excluded.labels
            `).bind(
              row["Phone number"],
              row.Status || null,
              row.ID,
              row["Full name"],
              row.Street || null,
              row["ZIP code"] || null,
              row.City || null,
              row["Payment Method"] || null,
              row["Account balance"] ? parseFloat(row["Account balance"]) : null,
              row.Labels || null
            ).run();
            replaced++;
          } catch (error) {
            console.error(`Error processing row ${i + 1}: ${error.message}`);
            failed_rows.push({ idx: i + 1, reason: error.message, row });
          }
        }

        const message = `Upload complete: ${replaced} clients replaced. ${failed_rows.length} row(s) failed.`;
        return withCORS(Response.json({ replaced, failed_rows, message }));
      } catch (error) {
        console.error(`Error in upload-clients: ${error.message}`);
        return withCORS(Response.json({ error: `Failed to upload clients: ${error.message}` }, { status: 500 }));
      }
    }

    // ... (rest of the code unchanged)
  async function handleCSVUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || !files[0]) return;
    const file = files[0];
    setUploading(true);
    setStatus("Uploading...");
    setFailedRows([]);
    try {
      const text = await file.text();
      const rows = parseCSV(text);
      const res = await fetch("/api/upload-clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text || "Upload failed"}`);
      }
      const data = await res.json();
      setStatus(data.message || `Upload successful: ${data.replaced} clients replaced.`);
      if (data.failed_rows?.length) {
        setFailedRows(data.failed_rows);
      }
      await fetchClients(); // Refresh clients list
    } catch (err: any) {
      setStatus(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
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
        style={{ margin: "8px 0", display: "block" }}
      />
      {status && (
        <div style={{ marginTop: 12, color: status.includes("success") ? "green" : (status.includes("failed") ? "red" : "orange") }}>
          {status}
        </div>
      )}
      {failedRows.length > 0 && (
        <div style={{ marginTop: 14, color: "#e2001a", fontSize: 13 }}>
          <b>Some rows failed to import:</b>
          <ul>
            {failedRows.map(r => (
              <li key={r.idx}>
                Row {r.idx}: {r.reason}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div style={{ marginTop: 24, fontSize: 14, color: "#555" }}>
        <b>Required fields in CSV (comma or tab-delimited, headers):</b><br />
        Status, ID, Full name, Phone number, Street, ZIP code, City, Payment Method, Account balance, Labels
      </div>

      <div style={{ marginTop: 16 }}>
        <label>
          <input
            type="checkbox"
            checked={showVerifiedOnly}
            onChange={(e) => setShowVerifiedOnly(e.target.checked)}
          />
          Show only verified clients
        </label>
      </div>

      <div style={{ margin: "30px 0 18px 0" }}>
        <input
          type="text"
          placeholder="Search clients (name, phone, ID, city, label...)"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          style={{
            width: 320,
            padding: 7,
            fontSize: 15,
            borderRadius: 6,
            border: "1.2px solid #ddd",
          }}
        />
        {loading && <span style={{ marginLeft: 15 }}>Loading clients...</span>}
        {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
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
            {filteredClients.map((c, i) => (
              <tr key={c.ID || `client-${i}`}>
                <td>{c.Status || '-'}</td>
                <td>{c.ID || '-'}</td>
                <td>{c["Full name"] || '-'}</td>
                <td>{c["Phone number"] || '-'}</td>
                <td>{c.Street || '-'}</td>
                <td>{c["ZIP code"] || '-'}</td>
                <td>{c.City || '-'}</td>
                <td>{c["Payment Method"] || '-'}</td>
                <td>{c["Account balance"] || '-'}</td>
                <td>{c.Labels || '-'}</td>
                <td>
                  <a href={`/clients/${c.ID || ''}`}>View</a>
                </td>
              </tr>
            ))}
            {filteredClients.length === 0 && !loading && (
              <tr>
                <td colSpan={11} style={{ textAlign: "center", color: "#888" }}>
                  {error ? 'Error loading clients. Please try refreshing.' : 'No clients found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
