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
  // Remove leading tab if present in each line
  for (let i = 0; i < lines.length; i++) {
    if (lines[i][0] === "\t") lines[i] = lines[i].slice(1);
  }
  // Detect delimiter
  const delimiter = lines[0].includes("\t") ? "\t" : ",";
  // Remove quotes from all headers
  const headers = lines[0].replace(/\r/g, '').split(delimiter).map(h => h.replace(/(^"|"$)/g, ''));
  return lines.slice(1).map(line => {
    const values = line.replace(/\r/g, '').split(delimiter).map(val => val.replace(/(^"|"$)/g, ''));
    const obj: any = {};
    headers.forEach((h, i) => obj[h] = values[i] || null); // Use null for empty values
    return obj as Client;
  });
}

export default function ClientsPage() {
  // CSV upload states
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("");
  // Client data
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Search/filter state
  const [search, setSearch] = useState("");
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false); // New: toggle for verified filter
  // Debug: store failed rows for UI
  const [failedRows, setFailedRows] = useState<{ idx: number; reason: string; row: any }[]>([]);

  // Fetch clients on mount and when verified filter changes
  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = showVerifiedOnly ? "/api/clients?verified=1" : "/api/clients";
        const res = await fetch(url, {
          headers: { "Accept": "application/json" },
        });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${await res.text()}`);
        }
        const data: Client[] = await res.json();
        console.log("Fetched clients:", data); // Debug: inspect raw response
        setClients(data);
      } catch (err: any) {
        console.error("Error fetching clients:", err);
        setError(`Failed to load clients: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, [showVerifiedOnly]); // Re-fetch when verified filter changes

  // Filter clients based on search input
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

  // CSV upload handler
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
        throw new Error(`HTTP ${res.status}: ${await res.text()}`);
      }
      const data = await res.json();
      setStatus(data.message || `Upload successful: ${data.replaced} clients replaced.`);
      if (data.failed_rows?.length) {
        setFailedRows(data.failed_rows);
      }
      // Refresh clients list
      setLoading(true);
      const refreshRes = await fetch("/api/clients", {
        headers: { "Accept": "application/json" },
      });
      if (refreshRes.ok) {
        const refreshedData: Client[] = await refreshRes.json();
        console.log("Refreshed clients:", refreshedData); // Debug
        setClients(refreshedData);
      }
    } catch (err: any) {
      setStatus(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
      setLoading(false);
    }
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
                {/* Uncomment to debug row data: <pre>{JSON.stringify(r.row, null, 2)}</pre> */}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div style={{ marginTop: 24, fontSize: 14, color: "#555" }}>
        <b>Required fields in CSV (comma or tab-delimited, headers):</b><br />
        Status, ID, Full name, Phone number, Street, ZIP code, City, Payment Method, Account balance, Labels
      </div>

      {/* Verified Filter Toggle */}
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

      {/* Search Bar */}
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

      {/* Client Table */}
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
                  {error ? 'Error loading clients.' : 'No clients found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
