// src/SystemPage.tsx

import { useEffect, useState } from "react";
import { API_BASE } from "./config";

interface Flow {
  id: number;
  name: string;
  description: string;
}

export default function SystemPage({ colors, darkMode }: { colors: any; darkMode: boolean }) {
  const [flows, setFlows] = useState<Flow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFlow, setSelectedFlow] = useState<Flow | null>(null);

  useEffect(() => {
    // TODO: fetch from your new /api/flows endpoint once implemented
    // for now, stub:
    const stub: Flow[] = [
      { id: 1, name: "Welcome Flow", description: "Greets new contacts" },
      { id: 2, name: "Re-engagement", description: "Follows up after 24h" },
    ];
    setFlows(stub);
    setLoading(false);
  }, []);

  function createNew() {
    // stub: open a modal or navigate to a “create flow” page
    const name = prompt("Name your new flow:");
    if (!name) return;
    const flow: Flow = { id: Date.now(), name, description: "" };
    setFlows((f) => [...f, flow]);
    setSelectedFlow(flow);
  }

  return (
    <div style={{ padding: 32, display: "flex", height: "100%" }}>
      {/* Sidebar of Flows */}
      <aside
        style={{
          width: 240,
          marginRight: 24,
          background: colors.card,
          borderRadius: 8,
          padding: 16,
          boxShadow: darkMode ? "0 2px 8px #0004" : "0 2px 8px #0001",
        }}
      >
        <h3 style={{ margin: 0, marginBottom: 12, color: colors.text }}>Flows</h3>
        {loading ? (
          <div style={{ color: colors.sub }}>Loading…</div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {flows.map((f) => (
              <li key={f.id} style={{ marginBottom: 8 }}>
                <button
                  onClick={() => setSelectedFlow(f)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "6px 10px",
                    borderRadius: 6,
                    border: "none",
                    background: selectedFlow?.id === f.id ? colors.red : "transparent",
                    color: selectedFlow?.id === f.id ? "#fff" : colors.text,
                    cursor: "pointer",
                    fontWeight: selectedFlow?.id === f.id ? 600 : 500,
                  }}
                >
                  {f.name}
                </button>
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={createNew}
          style={{
            marginTop: 16,
            width: "100%",
            padding: "8px 10px",
            borderRadius: 6,
            background: colors.red,
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          + New Flow
        </button>
      </aside>

      {/* Main Canvas */}
      <section
        style={{
          flex: 1,
          background: colors.card,
          borderRadius: 8,
          padding: 24,
          boxShadow: darkMode ? "0 2px 8px #0004" : "0 2px 8px #0001",
          overflow: "auto",
        }}
      >
        {!selectedFlow ? (
          <div style={{ color: colors.sub }}>
            Select a flow from the left or create a new one.
          </div>
        ) : (
          <>
            <h2 style={{ marginTop: 0, color: colors.text }}>{selectedFlow.name}</h2>
            <p style={{ color: colors.sub }}>{selectedFlow.description}</p>
            <div
              style={{
                marginTop: 24,
                border: `2px dashed ${colors.border}`,
                borderRadius: 6,
                height: 400,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: colors.sub,
              }}
            >
              {/* Placeholder for drag-and-drop flow builder canvas */}
              Canvas goes here
            </div>
          </>
        )}
      </section>
    </div>
  );
}
