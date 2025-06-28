import { useEffect, useState } from "react";
import { API_BASE } from "./config";

export default function LeadsPage({ colors }: any) {
  const [leads, setLeads] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    const res = await fetch(`${API_BASE}/api/leads`);
    const leads = await res.json();
    setLeads(leads);
    // If you want to auto-select first lead:
    // if (leads.length > 0) setSelected(leads[0]);
  }

  async function markContacted(id: number) {
    await fetch(`${API_BASE}/api/lead-contacted`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await fetchLeads();
    if (selected && selected.id === id) {
      setSelected({ ...selected, status: "contacted" });
    }
  }

  return (
    <div style={{ display: "flex", padding: 32, gap: 32 }}>
      {/* LEADS LIST */}
      <div style={{ width: 380 }}>
        <h3 style={{ color: colors.red, fontWeight: 700, marginBottom: 12 }}>
          New Leads
        </h3>
        <div style={{
          background: colors.card,
          borderRadius: 8,
          maxHeight: "75vh",
          overflowY: "auto",
          border: `1px solid ${colors.border}`,
        }}>
          {leads.length === 0 && (
            <div style={{ padding: 20, color: colors.sub }}>No leads found.</div>
          )}
          {leads.map(lead => (
            <div
              key={lead.id}
              onClick={() => setSelected(lead)}
              style={{
                padding: "12px 14px",
                cursor: "pointer",
                background: selected?.id === lead.id ? colors.sidebarSel : "none",
                color: selected?.id === lead.id ? "#fff" : colors.text,
                borderBottom: `1px solid ${colors.border}`,
              }}
            >
              <div style={{ fontWeight: 600 }}>
                {lead.name || "(No name)"} {lead.status === "contacted" ? "✅" : ""}
              </div>
              <div style={{ fontSize: 13, color: colors.sub }}>
                {lead.phone} · {lead.email}
              </div>
              <div style={{ fontSize: 12, color: colors.sub }}>
                {lead.address ? `📍 ${lead.address}` : ""}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LEAD DETAILS */}
      <div style={{
        flex: 1,
        background: colors.card,
        borderRadius: 8,
        border: `1px solid ${colors.border}`,
        padding: 24,
        minHeight: 220,
      }}>
        {selected ? (
          <div>
            <h4 style={{ margin: "0 0 16px 0" }}>
              {selected.name}
              {selected.status === "contacted" ? (
                <span style={{ color: "green", marginLeft: 10 }}>Contacted</span>
              ) : null}
            </h4>
            <div style={{ marginBottom: 12 }}>
              <b>Phone:</b> {selected.phone}
            </div>
            <div style={{ marginBottom: 12 }}>
              <b>Email:</b> {selected.email || "-"}
            </div>
            <div style={{ marginBottom: 12 }}>
              <b>Address:</b> {selected.address || "-"}
            </div>
            <div style={{ marginBottom: 12 }}>
              <b>Status:</b> {selected.status || "new"}
            </div>
            <div style={{ marginBottom: 18 }}>
              <b>Created:</b>{" "}
              {selected.created_at
                ? new Date(selected.created_at).toLocaleString()
                : "-"}
            </div>
            {selected.status !== "contacted" && (
              <button
                style={{
                  background: colors.red,
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "8px 16px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
                onClick={() => markContacted(selected.id)}
              >
                Mark as Contacted
              </button>
            )}
          </div>
        ) : (
          <div style={{ color: colors.sub, padding: 40 }}>
            Select a lead to view details.
          </div>
        )}
      </div>
    </div>
  );
}
