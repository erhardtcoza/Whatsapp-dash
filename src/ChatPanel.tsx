import { useEffect, useState } from 'react';
import { API_BASE }           from './config';

export default function ChatPanel({
  phone,
  contact,
  colors,
  onCloseChat,
}: any) {
  const [msgs, setMsgs]       = useState<any[]>([]);
  const [input, setInput]     = useState('');
  const [editing, setEditing] = useState(!contact?.customer_id);
  const [form, setForm]       = useState({
    customer_id: contact?.customer_id || '',
    first_name: '',
    last_name: '',
  });

  useEffect(() => {
    if (phone) fetchMsgs();
  }, [phone]);

  async function fetchMsgs() {
    const res = await fetch(`${API_BASE}/api/messages?phone=${phone}`);
    const data = await res.json();
    setMsgs(data);
  }

  async function handleSend(e: any) {
    e.preventDefault();
    if (!input) return;
    await fetch(`${API_BASE}/api/send-message`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ phone, body: input }),
    });
    setInput('');
    fetchMsgs();
  }

  async function handleSaveClient() {
    await fetch(`${API_BASE}/api/update-customer`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ phone, ...form }),
    });
    setEditing(false);
    // trigger sidebar/chatlist refresh if needed
  }

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      height: '100%', background: colors.card
    }}>
      {/* Header: manual client form or display */}
      <div style={{
        padding: 16, borderBottom: `1px solid ${colors.border}`
      }}>
        <strong>Chat: {phone}</strong>
        {editing ? (
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <input
              placeholder="Customer ID"
              value={form.customer_id}
              onChange={e => setForm({...form,customer_id:e.target.value})}
              style={{ flex:1, padding:8, borderRadius:4, border:`1px solid ${colors.border}` }}
            />
            <input
              placeholder="First name"
              value={form.first_name}
              onChange={e => setForm({...form,first_name:e.target.value})}
              style={{ flex:1, padding:8, borderRadius:4, border:`1px solid ${colors.border}` }}
            />
            <input
              placeholder="Last name"
              value={form.last_name}
              onChange={e => setForm({...form,last_name:e.target.value})}
              style={{ flex:1, padding:8, borderRadius:4, border:`1px solid ${colors.border}` }}
            />
            <button
              onClick={handleSaveClient}
              style={{
                background: colors.red,
                color: '#fff',
                border:'none',
                borderRadius:4,
                padding:'8px 12px',
                cursor:'pointer'
              }}
            >
              Save
            </button>
          </div>
        ) : (
          <div style={{ marginTop:12 }}>
            <span style={{ marginRight: 16 }}>
              ID: {contact.customer_id}
            </span>
            <span>
              Name: {contact.name}
            </span>
          </div>
        )}

        <button
          onClick={onCloseChat}
          style={{
            float: 'right',
            background: 'transparent',
            border:'none',
            color: colors.red,
            cursor: 'pointer'
          }}
        >
          Close Chat
        </button>
      </div>

      {/* Message list */}
      <div style={{
        flex:1,
        overflowY:'auto',
        padding:16,
        background: colors.bg
      }}>
        {msgs.map(m => (
          <div key={m.id}
               style={{
                 marginBottom:12,
                 textAlign: m.direction==='outgoing' ? 'right':'left'
               }}>
            <div style={{
              display:'inline-block',
              padding:'8px 12px',
              borderRadius:12,
              background: m.direction==='outgoing'
                ? colors.msgOut
                : colors.msgIn,
              color: m.direction==='outgoing' ? '#fff':colors.text
            }}>
              {m.body}
            </div>
          </div>
        ))}
      </div>

      {/* Input form */}
      <form onSubmit={handleSend} style={{
        padding:16,
        borderTop:`1px solid ${colors.border}`,
        display:'flex', gap:8
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message…"
          style={{
            flex:1,
            padding:10,
            borderRadius:8,
            border:`1px solid ${colors.border}`
          }}
        />
        <button
          type="submit"
          style={{
            background: colors.red,
            color: '#fff',
            border:'none',
            borderRadius:8,
            padding:'0 16px',
            cursor:'pointer'
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
