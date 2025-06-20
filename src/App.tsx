import { useEffect, useState } from 'react'
import './App.css'

const API_BASE = import.meta.env.VITE_API_BASE || "";

// Fetch chats from API
async function getChats() {
  const res = await fetch(`${API_BASE}/api/chats`);
  return res.json();
}
// Fetch messages for a phone
async function getMessages(phone: string) {
  const res = await fetch(`${API_BASE}/api/messages?phone=${encodeURIComponent(phone)}`);
  return res.json();
}
// Send a reply
async function sendMessage(phone: string, body: string) {
  await fetch(`${API_BASE}/api/send-message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, body })
  });
}

function App() {
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [reply, setReply] = useState('');
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);

  // Load chats on start or after sending
  useEffect(() => {
    setLoadingChats(true);
    getChats().then(data => {
      setChats(data);
      setLoadingChats(false);
    });
  }, [selectedChat]);

  // Load messages when a chat is selected
  useEffect(() => {
    if (!selectedChat) return;
    setLoadingMsgs(true);
    getMessages(selectedChat.from_number).then(data => {
      setMessages(data);
      setLoadingMsgs(false);
    });
  }, [selectedChat]);

  // Send a reply
  const handleSend = async (e: any) => {
    e.preventDefault();
    if (!reply.trim() || !selectedChat) return;
    setSending(true);
    await sendMessage(selectedChat.from_number, reply);
    setReply('');
    // Reload messages
    getMessages(selectedChat.from_number).then(data => setMessages(data));
    setSending(false);
  };

  return (
    <div className="App" style={{ fontFamily: "sans-serif", maxWidth: 520, margin: "0 auto" }}>
      <header style={{ display: "flex", alignItems: "center", padding: "16px 0", borderBottom: "2px solid #e2001a" }}>
        <img src="https://static.vinet.co.za/logo.jpeg" alt="Vinet Logo" style={{ height: 38, marginRight: 18 }} />
        <span style={{ fontWeight: "bold", fontSize: "1.4rem", color: "#e2001a" }}>
          Vinet WhatsApp Admin Portal
        </span>
      </header>

      {!selectedChat ? (
        <>
          <h2 style={{ margin: "20px 0 8px" }}>Recent Chats</h2>
          {loadingChats && <div>Loading chats...</div>}
          {!loadingChats && chats.length === 0 && <div>No chats yet.</div>}
          {!loadingChats && chats.map(chat => (
            <div
              key={chat.from_number}
              onClick={() => setSelectedChat(chat)}
              style={{
                padding: 12, borderBottom: "1px solid #eee",
                cursor: "pointer", background: "#fff", display: "flex", alignItems: "center", gap: 10
              }}
            >
              <div style={{
                width: 36, height: 36, background: "#f4f4f4", borderRadius: 18,
                display: "flex", alignItems: "center", justifyContent: "center", color: "#e2001a", fontWeight: "bold"
              }}>
                {chat.name ? chat.name[0].toUpperCase() : "?"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "bold" }}>{chat.name || chat.from_number}</div>
                <div style={{ color: "#888", fontSize: 14 }}>{chat.last_message}</div>
              </div>
              {chat.unread_count > 0 && (
                <div style={{
                  background: "#e2001a", color: "#fff", borderRadius: 12,
                  padding: "2px 8px", fontSize: 12, fontWeight: "bold"
                }}>{chat.unread_count}</div>
              )}
            </div>
          ))}
        </>
      ) : (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "18px 0" }}>
            <button onClick={() => setSelectedChat(null)}
              style={{
                background: "#e2001a", color: "#fff", border: "none", borderRadius: 6, padding: "6px 14px",
                fontWeight: "bold", cursor: "pointer"
              }}>Back</button>
            <span style={{ fontWeight: "bold", fontSize: 18 }}>
              {selectedChat.name || selectedChat.from_number}
            </span>
          </div>
          <div style={{ paddingBottom: 90 }}>
            {loadingMsgs && <div>Loading messages...</div>}
            {!loadingMsgs && messages.length === 0 && <div>No messages yet.</div>}
            {messages.map(msg => (
              <div key={msg.id}
                style={{
                  maxWidth: "70%",
                  margin: msg.direction === "outgoing" ? "12px 0 12px auto" : "12px auto 12px 0",
                  background: msg.direction === "outgoing" ? "#e2001a" : "#f1f1f1",
                  color: msg.direction === "outgoing" ? "#fff" : "#222",
                  borderRadius: 12, padding: "10px 14px", boxShadow: "0 2px 6px rgba(0,0,0,0.04)"
                }}>
                <div style={{ fontSize: 15 }}>{msg.body}</div>
                <div style={{ fontSize: 12, color: msg.direction === "outgoing" ? "#ffe0e0" : "#888", marginTop: 4 }}>
                  {new Date(Number(msg.timestamp)).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
          <form
            onSubmit={handleSend}
            style={{
              position: "fixed", left: 0, right: 0, bottom: 0, background: "#fff",
              borderTop: "1px solid #eee", display: "flex", gap: 8, padding: 12, maxWidth: 520, margin: "0 auto"
            }}
          >
            <input
              value={reply}
              onChange={e => setReply(e.target.value)}
              placeholder="Type a reply…"
              disabled={sending}
              style={{
                flex: 1, borderRadius: 6, border: "1px solid #ccc", padding: "10px 12px"
              }}
            />
            <button
              type="submit"
              disabled={sending || !reply.trim()}
              style={{
                background: "#e2001a", color: "#fff", border: "none",
                borderRadius: 6, padding: "10px 18px", fontWeight: "bold",
                cursor: sending ? "wait" : "pointer"
              }}
            >Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
