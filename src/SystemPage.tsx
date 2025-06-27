// src/SystemPage.tsx

import { useEffect, useState } from "react";
import { API_BASE } from "./config";

interface Flow {
  id: number;
  name: string;
  description: string;
}

export default function SystemPage({ colors }: any) {
  const [flows, setFlows] = useState<Flow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFlow, setSelectedFlow] = useState<Flow | null>(null);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchFlows();
  }, []);

  async function fetchFlows() {
    setLoading(true);
    try {
      // replace with real endpoint when ready
      const data = await fetch(`${API_BASE}/api/flows`).then(r => r.json());
      setFlows(data);
    } catch {
      // stub data until backend exists
      setFlows([
        { id: 1, name: "Welcome Flow", description: "Greet new contacts" },
        { id: 2, name: "Re-engagement", description: "Follow up after 24h" },
      ]);
    }
    setLoading(false);
  }

  async function createFlow() {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      await fetch(`${API_BASE}/api/flows`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, description: newDesc }),
      });
      setNewName("");
      setNewDesc("");
      await fetchFlows();
    } finally {
      setSaving(false);
    }
  }

  async function deleteFlow(id: number) {
    if (!confirm("Delete this flow?")) return;
    await fetch(`${API_BASE}/api/flows/${id}`, { method: "DELETE" });
    if (selectedFlow?.id === id) setSelectedFlow(null);
    fetchFlows();
  }

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ color: colors.text, fontWeight: 600, fontSize: 22, marginBottom: 18 }}>
        Flow Builder
      </h2>

      {/* Flow list */}
      {loading ? (
        <div style={{ color: colors.sub }}>Loading…</div>
      ) : (
        <table style={{ width: "100%", background: colors.card, borderRadius: 8 }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "8px 10px", color: colors.sub }}>Name</th>
              <th style={{ textAlign: "left", padding: "8px 10px", color: colors.sub }}>Description</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {flows.map(flow => (
              <tr key={flow.id}>
                <td style={{ padding: "8px 10px" }}>{flow.name}</td>
                <td style={{ padding: "8px 10px" }}>{flow.description}</td>
                <td style={{ padding: "8px 10px", textAlign: "right" }}>
                  <button
                    onClick={() => setSelectedFlow(flow)}
                    style={{
                      background: colors.red,
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      padding: "4px 10px",
                      fontWeight: 600,
                      fontSize: 14,
                      cursor: "pointer",
                      marginRight: 6,
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteFlow(flow.id)}
                    style={{
                      background: "#aaa",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      padding: "4px 10px",
                      fontWeight: 600,
                      fontSize: 14,
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* New flow form */}
      <div style={{ marginTop: 24, display: "flex", gap: 10, alignItems: "center" }}>
        <input
          type="text"
          placeholder="Flow name"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          style={{
            borderRadius: 7,
            border: `1.3px solid ${colors.border}`,
            padding: "6px 10px",
            fontSize: 15,
            flex: 1,
          }}
        />
        <input
          type="text"
          placeholder="Description"
          value={newDesc}
          onChange={e => setNewDesc(e.target.value)}
          style={{
            borderRadius: 7,
            border: `1.3px solid ${colors.border}`,
            padding: "6px 10px",
            fontSize: 15,
            flex: 2,
          }}
        />
        <button
          onClick={createFlow}
          disabled={saving}
          style={{
            background: colors.red,
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "7px 16px",
            fontWeight: "bold",
            fontSize: 15,
            cursor: "pointer",
            opacity: saving ? 0.6 : 1,
          }}
        >
          Add Flow
        </button>
      </div>

      {/* Canvas placeholder */}
      {selectedFlow && (
        <div style={{ marginTop: 48 }}>
          <h3 style={{ color: colors.red, fontWeight: 700, margin: "6px 0 14px 0" }}>
            {selectedFlow.name}
          </h3>
          <div
            style={{
              height: 300,
              background: colors.card,
              border: `2px dashed ${colors.border}`,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: colors.sub,
            }}
          >
            {/* Future flow‐builder canvas goes here */}
            Canvas for “{selectedFlow.name}”
          </div>
        </div>
      )}
    </div>
  );
}
