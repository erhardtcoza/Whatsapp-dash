// src/SystemPage.tsx

import { useEffect, useState } from "react";
import { API_BASE } from "./config";

interface Flow {
  id: number;
  name: string;
}

interface Step {
  id?: number;
  flow_id: number;
  condition: string;
  response: string;
}

export default function SystemPage({ colors }: any) {
  const [flows, setFlows] = useState<Flow[]>([]);
  const [selectedFlow, setSelectedFlow] = useState<Flow | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [loadingFlows, setLoadingFlows] = useState(true);
  const [loadingSteps, setLoadingSteps] = useState(false);
  const [newFlowName, setNewFlowName] = useState("");
  const [savingSteps, setSavingSteps] = useState(false);

  useEffect(() => {
    fetchFlows();
  }, []);

  async function fetchFlows() {
    setLoadingFlows(true);
    const res = await fetch(`${API_BASE}/api/flows`);
    const data = await res.json();
    setFlows(data);
    setLoadingFlows(false);
    // auto‐select first if none
    if (!selectedFlow && data.length) setSelectedFlow(data[0]);
  }

  useEffect(() => {
    if (selectedFlow) loadSteps(selectedFlow.id);
    else setSteps([]);
  }, [selectedFlow]);

  async function loadSteps(flowId: number) {
    setLoadingSteps(true);
    const res = await fetch(`${API_BASE}/api/flows/${flowId}/steps`);
    const data = await res.json();
    setSteps(data);
    setLoadingSteps(false);
  }

  async function addFlow() {
    if (!newFlowName.trim()) return;
    await fetch(`${API_BASE}/api/flow`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newFlowName.trim() })
    });
    setNewFlowName("");
    fetchFlows();
  }

  async function deleteFlow(id: number) {
    if (!confirm("Delete this flow?")) return;
    await fetch(`${API_BASE}/api/flow/${id}`, { method: "DELETE" });
    if (selectedFlow?.id === id) setSelectedFlow(null);
    fetchFlows();
  }

  function addStep() {
    if (!selectedFlow) return;
    setSteps([...steps, { flow_id: selectedFlow.id, condition: "", response: "" }]);
  }

  function removeStep(idx: number) {
    setSteps(steps.filter((_, i) => i !== idx));
  }

  function updateStep(idx: number, field: keyof Step, val: string) {
    const s = [...steps];
    (s[idx] as any)[field] = val;
    setSteps(s);
  }

  async function saveAllSteps() {
    if (!selectedFlow) return;
    setSavingSteps(true);
    await fetch(`${API_BASE}/api/flows/${selectedFlow.id}/steps`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(steps)
    });
    await loadSteps(selectedFlow.id);
    setSavingSteps(false);
  }

  return (
    <div style={{ display: "flex", padding: 32 }}>
      {/* Flows sidebar */}
      <div style={{
        width: 240, marginRight: 32, background: colors.card,
        borderRadius: 8, padding: 16, boxShadow: "0 1px 6px #0001"
      }}>
        <h3 style={{ color: colors.red }}>Flows</h3>
        {loadingFlows ? (
          <div style={{ color: colors.sub }}>Loading…</div>
        ) : (
          flows.map(f => (
            <div key={f.id}
              onClick={() => setSelectedFlow(f)}
              style={{
                padding: "6px 10px",
                background: selectedFlow?.id === f.id ? colors.sidebarSel : "none",
                color: selectedFlow?.id === f.id ? "#fff" : colors.text,
                borderRadius: 6,
                marginBottom: 4,
                cursor: "pointer"
              }}
            >
              {f.name}
              <button
                onClick={e => { e.stopPropagation(); deleteFlow(f.id); }}
                style={{
                  float: "right", background: "none", border: "none",
                  color: colors.red, cursor: "pointer", fontWeight: 700
                }}
              >×</button>
            </div>
          ))
        )}
        <div style={{ marginTop: 12 }}>
          <input
            value={newFlowName}
            onChange={e => setNewFlowName(e.target.value)}
            placeholder="New flow name"
            style={{
              width: "100%", padding: "6px 8px", borderRadius: 6,
              border: `1px solid ${colors.border}`, marginBottom: 6
            }}
          />
          <button
            onClick={addFlow}
            style={{
              width: "100%", background: colors.red, color: "#fff",
              border: "none", borderRadius: 6, padding: "8px 0",
              fontWeight: 600, cursor: "pointer"
            }}
          >Add Flow</button>
        </div>
      </div>

      {/* Steps editor */}
      <div style={{ flex: 1 }}>
        <h2 style={{ color: colors.text, fontWeight: 600, fontSize: 22 }}>
          {selectedFlow ? `Steps for "${selectedFlow.name}"` : "Select or create a flow"}
        </h2>

        {selectedFlow && (
          <>
            {loadingSteps ? (
              <div style={{ color: colors.sub }}>Loading steps…</div>
            ) : (
              <table style={{ width: "100%", background: colors.card, borderRadius: 8, overflow: "hidden" }}>
                <thead>
                  <tr>
                    <th style={{ padding: 8, color: colors.sub }}>Condition</th>
                    <th style={{ padding: 8, color: colors.sub }}>Response</th>
                    <th style={{ padding: 8 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {steps.map((s, i) => (
                    <tr key={i}>
                      <td style={{ padding: 6 }}>
                        <input
                          type="text"
                          value={s.condition}
                          onChange={e => updateStep(i, "condition", e.target.value)}
                          style={{ width: "100%", padding: "4px 6px", borderRadius: 4, border: `1px solid ${colors.border}` }}
                        />
                      </td>
                      <td style={{ padding: 6 }}>
                        <input
                          type="text"
                          value={s.response}
                          onChange={e => updateStep(i, "response", e.target.value)}
                          style={{ width: "100%", padding: "4px 6px", borderRadius: 4, border: `1px solid ${colors.border}` }}
                        />
                      </td>
                      <td style={{ padding: 6, textAlign: "center" }}>
                        <button
                          onClick={() => removeStep(i)}
                          style={{
                            background: colors.red, color: "#fff",
                            border: "none", borderRadius: 4,
                            padding: "4px 8px", cursor: "pointer"
                          }}
                        >Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div style={{ marginTop: 12, display: "flex", gap: 12 }}>
              <button
                onClick={addStep}
                style={{
                  background: colors.red, color: "#fff",
                  border: "none", borderRadius: 6,
                  padding: "8px 14px", cursor: "pointer"
                }}
              >Add Step</button>
              <button
                onClick={saveAllSteps}
                disabled={savingSteps}
                style={{
                  background: savingSteps ? "#aaa" : colors.red,
                  color: "#fff", border: "none",
                  borderRadius: 6, padding: "8px 14px", cursor: "pointer"
                }}
              >
                {savingSteps ? "Saving…" : "Save All"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
