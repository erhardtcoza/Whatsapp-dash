import { useEffect, useState } from "react";
import { API_BASE }           from "./config";

export default function ChatPanel({
  phone,
  contact,
  colors,
  onCloseChat
}: any) {
  const [msgs, setMsgs]   = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [form, setForm]   = useState({
    customer_id: contact?.customer_id || "",
    first_name: "",
    last_name: ""
  });

  // Reload messages when phone changes
  useEffect(() => {
    if (phone) {
      fetch(`${API_BASE}/api/messages?phone=${phone}`)
        .then(r => r.json())
        .then(setMsgs);
      // seed form
      setForm({
        customer_id: contact?.customer_id || "",
        first_name: contact?.name?.split(" ")[0] || "",
        last_name: contact?.name?.split(" ").slice(1).join(" ") || ""
      });
    } else {
      setMsgs([]);
    }
  }, [phone, contact]);

  // Send a message
  async function send() {
    if (!input) return;
    await fetch(`${API_BASE}/api/send-message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, body: input })
    });
    setInput("");
    // reload
    const d = await fetch(`${API_BASE}/api/messages?phone=${phone}`).then(r=>r.json());
    setMsgs(d);
  }

  // Save manual customer info
  async function saveClient() {
    await fetch(`${API_BASE}/api/update-customer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone,
        customer_id: form.customer_id,
        name: `${form.first_name} ${form.last_name}`.trim(),
        email: contact?.email || ""
      })
    });
    // no live update of header needed; reload happens on chat change
  }

  if (!phone) {
    return (
      <div style={{
        flex:1,
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        color: colors.sub
      }}>
        Select a chat to begin
      </div>
    );
  }

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
      {/* Header form */}
      <div style={{
        padding: 16,
        borderBottom: `1px solid ${colors.border}`,
        display: "flex",
        alignItems: "center",
        gap: 12
      }}>
        <input
          placeholder="Customer ID"
          value={form.customer_id}
          onChange={e => setForm({...form, customer_id: e.target.value})}
          style={{
            flex: 1,
            padding: 8,
            borderRadius: 6,
            border: `1px solid ${colors.border}`
          }}
        />
        <input
          placeholder="First name"
          value={form.first_name}
          onChange={e => setForm({...form, first_name: e.target.value})}
          style={{
            flex: 1,
            padding: 8,
            borderRadius: 6,
            border: `1px solid ${colors.border}`
          }}
        />
        <input
          placeholder="Last name"
          value={form.last_name}
          onChange={e => setForm({...form, last_name: e.target.value})}
          style={{
            flex: 1,
            padding: 8,
            borderRadius: 6,
            border: `1px solid ${colors.border}`
          }}
        />
        <button
          onClick={saveClient}
          style={{
            background: colors.red,
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "8px 16px",
            cursor: "pointer"
          }}
        >
          Save
        </button>
        <button
          onClick={onCloseChat}
          style={{
            marginLeft: "auto",
            background: "transparent",
            border: "none",
            color: colors.red,
            cursor: "pointer"
          }}
        >
          Close Chat
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex:1,
        padding: 16,
        overflowY: "auto",
        background: colors.bg
      }}>
        {msgs.map(m => (
          <div
            key={m.id}
            style={{
              marginBottom: 12,
              textAlign: m.direction === "outgoing" ? "right" : "left"
            }}
          >
            <div style={{
              display: "inline-block",
              padding: "8px 12px",
              borderRadius: 12,
              background: m.direction === "outgoing"
                ? colors.msgOut
                : colors.msgIn,
              color: m.direction === "outgoing" ? "#fff" : colors.text
            }}>
              {m.body}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{
        padding: 16,
        borderTop: `1px solid ${colors.border}`,
        display: "flex",
        gap: 8
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex:1,
            padding:10,
            borderRadius:8,
            border: `1px solid ${colors.border}`
          }}
        />
        <button
          onClick={send}
          style={{
            background: colors.red,
            color: "#fff",
            border: "none",
            borderRadius:8,
            padding: "0 16px",
            cursor: "pointer"
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
