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
  const [loadingFlows, setLoadingFlows] = useState(true);
  const [newFlowName, setNewFlowName] = useState("");
  
  const [selectedFlow, setSelectedFlow] = useState<Flow | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [loadingSteps, setLoadingSteps] = useState(false);
  const [savingSteps, setSavingSteps] = useState(false);

  useEffect(() => { fetchFlows() }, []);

  // --- Flows CRUD ---
  async function fetchFlows() {
    setLoadingFlows(true);
    const res = await fetch(`${API_BASE}/api/flows`);
    const data = await res.json();
    setFlows(data);
    setLoadingFlows(false);
  }

  async function createFlow() {
    if (!newFlowName.trim()) return;
    await fetch(`${API_BASE}/api/flow`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newFlowName.trim() })
    });
    setNewFlowName("");
    await fetchFlows();
  }

  async function deleteFlow(id: number) {
    await fetch(`${API_BASE}/api/flow/${id}`, { method: "DELETE" });
    if (selectedFlow?.id === id) setSelectedFlow(null);
    await fetchFlows();
  }

  // --- Steps CRUD ---
  async function fetchSteps(flow: Flow) {
    setLoadingSteps(true);
    const res = await fetch(`${API_BASE}/api/flows/${flow.id}/steps`);
    const data: Step[] = await res.json();
    setSteps(data);
    setLoadingSteps(false);
  }

  function onSelectFlow(flow: Flow) {
    setSelectedFlow(flow);
    fetchSteps(flow);
  }

  function handleStepChange(idx: number, field: keyof Step, val: string) {
    setSteps(steps => steps.map((s,i) => i===idx ? { ...s, [field]: val } : s));
  }

  function addStep() {
    if (!selectedFlow) return;
    setSteps(steps => [
      ...steps,
      { flow_id: selectedFlow.id, condition: "", response: "" }
    ]);
  }

  async function deleteStep(idx: number) {
    const st = steps[idx];
    if (st.id) {
      await fetch(`${API_BASE}/api/step/${st.id}`, { method: "DELETE" });
    }
    setSteps(steps.filter((_,i) => i!==idx));
  }

  async function saveAllSteps() {
    if (!selectedFlow) return;
    setSavingSteps(true);
    await fetch(`${API_BASE}/api/flows/${selectedFlow.id}/steps`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(steps)
    });
    setSavingSteps(false);
    fetchSteps(selectedFlow);
  }

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{
        color: colors.text, fontWeight: 600, fontSize: 22, marginBottom: 18
      }}>
        Flow Builder
      </h2>

      {/* --- Flows list --- */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          <input
            type="text"
            placeholder="New flow name"
            value={newFlowName}
            onChange={e => setNewFlowName(e.target.value)}
            style={{
              flex: 1,
              padding: "7px 12px",
              borderRadius: 6,
              border: `1px solid ${colors.border}`,
              fontSize: 15,
            }}
          />
          <button
            onClick={createFlow}
            style={{
              background: colors.red, color: "#fff", border: "none",
              borderRadius: 7, padding: "8px 18px", fontWeight: 700,
              fontSize: 15, cursor: "pointer"
            }}
          >
            Add Flow
          </button>
        </div>

        {loadingFlows ? (
          <div style={{ color: colors.sub }}>Loading flows…</div>
        ) : (
          <table style={{ width: "100%", background: colors.card, borderRadius: 8 }}>
            <thead>
              <tr>
                <th style={{ padding: 8, textAlign: "left", color: colors.sub }}>Flow Name</th>
                <th style={{ padding: 8 }}></th>
              </tr>
            </thead>
            <tbody>
              {flows.map(flow => (
                <tr key={flow.id} style={{ cursor: "pointer" }}>
                  <td
                    onClick={() => onSelectFlow(flow)}
                    style={{
                      padding: 8,
                      fontWeight: selectedFlow?.id === flow.id ? 700 : 500,
                      color: selectedFlow?.id === flow.id ? colors.red : colors.text
                    }}
                  >
                    {flow.name}
                  </td>
                  <td style={{ padding: 8, textAlign: "right" }}>
                    <button
                      onClick={() => deleteFlow(flow.id)}
                      style={{
                        background: "#aaa", color: "#fff", border: "none",
                        borderRadius: 6, padding: "4px 10px", fontWeight: 600,
                        fontSize: 14, cursor: "pointer"
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
      </div>

      {/* --- Steps for selected flow --- */}
      {selectedFlow && (
        <div>
          <h3 style={{
            color: colors.red, fontWeight: 700, margin: "12px 0 6px 0"
          }}>
            Steps for “{selectedFlow.name}”
          </h3>

          {loadingSteps ? (
            <div style={{ color: colors.sub }}>Loading steps…</div>
          ) : (
            <table style={{ width: "100%", background: colors.card, borderRadius: 8 }}>
              <thead>
                <tr>
                  <th style={{ padding: 8, color: colors.sub }}>Condition</th>
                  <th style={{ padding: 8, color: colors.sub }}>Response</th>
                  <th style={{ padding: 8 }}></th>
                </tr>
              </thead>
              <tbody>
                {steps.map((st, i) => (
                  <tr key={i}>
                    <td style={{ padding: 6 }}>
                      <input
                        type="text"
                        value={st.condition}
                        onChange={e => handleStepChange(i, "condition", e.target.value)}
                        style={{
                          width: "100%",
                          padding: "6px",
                          borderRadius: 6,
                          border: `1px solid ${colors.border}`
                        }}
                      />
                    </td>
                    <td style={{ padding: 6 }}>
                      <input
                        type="text"
                        value={st.response}
                        onChange={e => handleStepChange(i, "response", e.target.value)}
                        style={{
                          width: "100%",
                          padding: "6px",
                          borderRadius: 6,
                          border: `1px solid ${colors.border}`
                        }}
                      />
                    </td>
                    <td style={{ padding: 6, textAlign: "center" }}>
                      <button
                        onClick={() => deleteStep(i)}
                        style={{
                          background: "#aaa", color: "#fff", border: "none",
                          borderRadius: 6, padding: "4px 10px", fontWeight: 600,
                          fontSize: 14, cursor: "pointer"
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

          <div style={{ marginTop: 12, display: "flex", gap: 12 }}>
            <button
              onClick={addStep}
              style={{
                background: colors.red, color: "#fff", border: "none",
                borderRadius: 7, padding: "6px 14px", fontWeight: 700,
                fontSize: 15, cursor: "pointer"
              }}
            >
              + Add Step
            </button>
            <button
              onClick={saveAllSteps}
              disabled={savingSteps}
              style={{
                background: "#2c2", color: "#fff", border: "none",
                borderRadius: 7, padding: "6px 14px", fontWeight: 700,
                fontSize: 15, cursor: savingSteps ? "not-allowed" : "pointer",
                opacity: savingSteps ? 0.6 : 1
              }}
            >
              {savingSteps ? "Saving…" : "Save All"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
