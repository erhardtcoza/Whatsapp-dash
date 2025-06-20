import { useEffect, useState } from "react";
import "./App.css";

const API_BASE = import.meta.env.VITE_API_BASE || "";

async function getChats() {
  const res = await fetch(`${API_BASE}/api/chats`);
  return res.json();
}
async function getMessages(phone: string) {
  const res = await fetch(`${API_BASE}/api/messages?phone=${encodeURIComponent(phone)}`);
  return res.json();
}
async function sendMessage(phone: string, body: string) {
  await fetch(`${API_BASE}/api/send-message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, body }),
  });
}

function App() {
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [reply, setReply] = useState("");
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);

  // Load chats on mount or after returning from a chat
  useEffect(() => {
    setLoadingChats(true);
    getChats().then((data) => {
      setChats(data);
      setLoadingChats(false);
    });
  }, [selectedChat]);

  // Load messages when a chat is selected
  useEffect(() => {
    if (!selectedChat) return;
    setLoadingMsgs(true);
    getMessages(selectedChat.from_number).then((data) => {
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
    setReply("");
    // Reload messages
    getMessages(selectedChat.from_number).then((data) => setMessages(data));
    setSending(false);
  };

  return (
    <div
      className="App"
      style={{
        fontFamily: "sans-serif",
        maxWidth: 650,
        margin: "0 auto",
        padding: 0,
        background: "#fff",
        minHeight: "100vh",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "30px 10px 0 10px",
          borderBottom: "3px solid #e2001a",
        }}
      >
        <img
          src="https://static.vinet.co.za/logo.jpeg"
          alt="Vinet Logo"
          style={{ height: 50, marginRight: 18 }}
        />
        <span
          style={{
            fontWeight: "bold",
            fontSize: "2rem",
            color: "#e2001a",
            letterSpacing: 1,
          }}
        >
          Vinet WhatsApp Admin Portal
        </span>
      </header>

      <main style={{ marginTop: 32, padding: 0 }}>
        {!selectedChat ? (
          <div>
            <h2
              style={{
                margin: "30px 0 24px",
                textAlign: "center",
                color: "#223",
                fontSize: "2.3rem",
                fontWeight: 700,
              }}
            >
              Recent Chats
            </h2>
            {loadingChats && (
              <div style={{ textAlign: "center", color: "#888", margin: 40 }}>
                Loading chats...
              </div>
            )}
            {!loadingChats && chats.length === 0 && (
              <div style={{ textAlign: "center", color: "#888", margin: 40 }}>
                No chats yet.
              </div>
            )}
            <div style={{ width: "100%", maxWidth: 540, margin: "0 auto" }}>
              {chats.map((chat) => (
                <div
                  key={chat.from_number}
                  onClick={() => setSelectedChat(chat)}
                  style={{
                    padding: "28px 36px",
                    borderBottom: "1.5px solid #f2f2f2",
                    cursor: "pointer",
                    background: "#fff",
                    display: "flex",
                    alignItems: "center",
                    gap: 30,
                    transition: "background 0.2s",
                    borderRadius: 12,
                    marginBottom: 8,
                    boxShadow:
                      "0 1px 2px 0 rgba(210,0,26,0.01), 0 0.5px 1px 0 rgba(210,0,26,0.04)",
                  }}
                  onMouseOver={e =>
                    (e.currentTarget.style.background = "#f8f8f8")
                  }
                  onMouseOut={e =>
                    (e.currentTarget.style.background = "#fff")
                  }
                >
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      background: "#f7f7f7",
                      borderRadius: 30,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#e2001a",
                      fontWeight: "bold",
                      fontSize: 28,
                      border: "2.5px solid #e2001a",
                    }}
                  >
                    {chat.name
                      ? chat.name[0].toUpperCase()
                      : <span style={{ color: "#e2001a", fontSize: 30 }}>?</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 22,
                        marginBottom: 4,
                        color: "#223",
                        letterSpacing: 0.5,
                      }}
                    >
                      {chat.name || "Lead"}
                    </div>
                    <div
                      style={{
                        fontSize: 16,
                        color: "#2a3745",
                        marginBottom: 3,
                        letterSpacing: 0.2,
                        fontWeight: 400,
                        opacity: 0.65,
                      }}
                    >
                      {chat.from_number}
                    </div>
                    <div
                      style={{
                        color: "#b22a2a",
                        fontSize: 15,
                        opacity: 0.84,
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        maxWidth: 250,
                      }}
                    >
                      {chat.last_message}
                    </div>
                  </div>
                  {chat.unread_count > 0 && (
                    <div
                      style={{
                        background: "#e2001a",
                        color: "#fff",
                        borderRadius: 22,
                        padding: "6px 18px",
                        fontSize: 20,
                        fontWeight: "bold",
                        marginLeft: 5,
                      }}
                    >
                      {chat.unread_count}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                margin: "25px 0 18px 0",
              }}
            >
              <button
                onClick={() => setSelectedChat(null)}
                style={{
                  background: "#e2001a",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 26px",
                  fontWeight: "bold",
                  fontSize: 18,
                  cursor: "pointer",
                  marginLeft: 15,
                }}
              >
                ← Back
              </button>
              <span style={{ fontWeight: "bold", fontSize: 28, color: "#222" }}>
                {selectedChat.name || "Lead"}
              </span>
              <span
                style={{
                  fontSize: 18,
                  color: "#444",
                  opacity: 0.6,
                  marginLeft: 8,
                  marginTop: 3,
                }}
              >
                {selectedChat.from_number}
              </span>
            </div>
            <div
              style={{
                paddingBottom: 120,
                paddingLeft: 15,
                paddingRight: 15,
                maxWidth: 640,
                margin: "0 auto",
              }}
            >
              {loadingMsgs && (
                <div style={{ color: "#888", margin: "20px 0" }}>
                  Loading messages...
                </div>
              )}
              {!loadingMsgs && messages.length === 0 && (
                <div style={{ color: "#888", margin: "20px 0" }}>
                  No messages yet.
                </div>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    maxWidth: "80%",
                    margin:
                      msg.direction === "outgoing"
                        ? "18px 0 18px auto"
                        : "18px auto 18px 0",
                    background:
                      msg.direction === "outgoing" ? "#e2001a" : "#f2f2f2",
                    color: msg.direction === "outgoing" ? "#fff" : "#222",
                    borderRadius: 18,
                    padding: "16px 20px",
                    boxShadow: "0 2px 12px rgba(220,0,32,0.04)",
                    fontSize: 17,
                    lineHeight: 1.5,
                  }}
                >
                  <div>{msg.body}</div>
                  <div
                    style={{
                      fontSize: 12,
                      color:
                        msg.direction === "outgoing"
                          ? "#ffe0e0"
                          : "#888",
                      marginTop: 10,
                    }}
                  >
                    {new Date(Number(msg.timestamp)).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            <form
              onSubmit={handleSend}
              style={{
                position: "fixed",
                left: 0,
                right: 0,
                bottom: 0,
                background: "#fff",
                borderTop: "1.5px solid #eee",
                display: "flex",
                gap: 10,
                padding: 16,
                maxWidth: 650,
                margin: "0 auto",
              }}
            >
              <input
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type a reply…"
                disabled={sending}
                style={{
                  flex: 1,
                  borderRadius: 8,
                  border: "1.5px solid #bbb",
                  padding: "13px 18px",
                  fontSize: 18,
                }}
              />
              <button
                type="submit"
                disabled={sending || !reply.trim()}
                style={{
                  background: "#e2001a",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "13px 30px",
                  fontWeight: "bold",
                  fontSize: 19,
                  cursor: sending ? "wait" : "pointer",
                }}
              >
                Send
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
