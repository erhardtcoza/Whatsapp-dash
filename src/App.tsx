import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import "./App.css";

const API_BASE = import.meta.env.VITE_API_BASE || "";

async function getChats() {
  const res = await fetch(`${API_BASE}/api/chats`);
  return res.json();
}
async function getMessages(phone: string) {
  const res = await fetch(
    `${API_BASE}/api/messages?phone=${encodeURIComponent(phone)}`
  );
  return res.json();
}
async function sendMessage(phone: string, body: string) {
  await fetch(`${API_BASE}/api/send-message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, body }),
  });
}
async function setTag(from_number: string, tag: string) {
  await fetch(`${API_BASE}/api/set-tag`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ from_number, tag }),
  });
}

function App() {
  const [section, setSection] = useState("chats");
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [reply, setReply] = useState("");
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);

  useEffect(() => {
    if (section === "chats") {
      setLoadingChats(true);
      getChats().then((data) => {
        setChats(data);
        setLoadingChats(false);
      });
    }
    setSelectedChat(null);
  }, [section]);

  useEffect(() => {
    if (!selectedChat) return;
    setLoadingMsgs(true);
    getMessages(selectedChat.from_number).then((data) => {
      setMessages(data);
      setLoadingMsgs(false);
    });
  }, [selectedChat]);

  const handleSend = async (e: any) => {
    e.preventDefault();
    if (!reply.trim() || !selectedChat) return;
    await sendMessage(selectedChat.from_number, reply);
    setReply("");
    getMessages(selectedChat.from_number).then((data) => setMessages(data));
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f7f7fa" }}>
      <Sidebar selected={section} onSelect={setSection} />
      <div style={{ flex: 1, marginLeft: 200 }}>
        {/* Topbar */}
        <div style={{
          padding: "20px 32px 12px 32px",
          borderBottom: "2px solid #e2001a",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <span style={{ fontWeight: 700, fontSize: 24, color: "#e2001a", letterSpacing: 1 }}>
            {section === "chats" ? "Recent Chats" : section[0].toUpperCase() + section.slice(1)}
          </span>
        </div>
        {/* Main panel */}
        <div style={{
          padding: "0 22px 20px 22px",
          maxWidth: 1180,
          margin: "0 auto"
        }}>
          {section === "chats" && !selectedChat && (
            <>
              {/* Table header */}
              <table style={{
                width: "100%", background: "#fff", borderCollapse: "collapse",
                marginTop: 28, boxShadow: "0 1px 6px #0001", borderRadius: 10, overflow: "hidden"
              }}>
                <thead style={{ background: "#f8f8f8" }}>
                  <tr style={{ height: 36 }}>
                    <th style={th}>Name</th>
                    <th style={th}>Number</th>
                    <th style={th}>ID</th>
                    <th style={th}>Tag</th>
                    <th style={th}>Last Message</th>
                    <th style={th}>Unread</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingChats && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", color: "#888", padding: 20 }}>
                        Loading...
                      </td>
                    </tr>
                  )}
                  {!loadingChats && chats.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", color: "#888", padding: 20 }}>
                        No chats found.
                      </td>
                    </tr>
                  )}
                  {chats.map(chat => (
                    <tr
                      key={chat.from_number}
                      onClick={() => setSelectedChat(chat)}
                      style={{
                        background: "#fff",
                        cursor: "pointer",
                        height: 38,
                        borderBottom: "1px solid #f2f2f2"
                      }}
                      onMouseOver={e => (e.currentTarget.style.background = "#f7f7fa")}
                      onMouseOut={e => (e.currentTarget.style.background = "#fff")}
                    >
                      <td style={td}>{chat.name || <span style={{ color: "#e2001a" }}>Lead</span>}</td>
                      <td style={td}>{chat.from_number}</td>
                      <td style={td}>{chat.customer_id || <span style={{ color: "#888" }}>—</span>}</td>
                      <td style={td}><Tag tag={chat.tag} /></td>
                      <td style={{ ...td, maxWidth: 260, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                        {chat.last_message}
                      </td>
                      <td style={td}>{chat.unread_count > 0 ? (
                        <span style={{
                          display: "inline-block",
                          background: "#e2001a",
                          color: "#fff",
                          fontWeight: "bold",
                          borderRadius: 11,
                          minWidth: 25,
                          fontSize: 13,
                          textAlign: "center"
                        }}>{chat.unread_count}</span>
                      ) : null}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
          {/* Chat View */}
          {section === "chats" && selectedChat && (
            <div style={{ marginTop: 24 }}>
              <button
                onClick={() => setSelectedChat(null)}
                style={{
                  background: "#e2001a", color: "#fff", border: "none",
                  borderRadius: 6, padding: "6px 19px", fontWeight: 700, marginBottom: 16, fontSize: 15
                }}>← Back</button>
              <span style={{ fontWeight: 700, fontSize: 18, marginLeft: 16 }}>
                {selectedChat.name || "Lead"}
              </span>
              <span style={{ color: "#888", marginLeft: 16 }}>{selectedChat.from_number}</span>
              {selectedChat.customer_id && (
                <span style={{ color: "#007bff", marginLeft: 14, fontWeight: 600 }}>[ID: {selectedChat.customer_id}]</span>
              )}
              <span style={{ marginLeft: 22 }}><Tag tag={selectedChat.tag} /></span>
              {/* Messages */}
              <div style={{ marginTop: 25, marginBottom: 60, padding: 18, background: "#f8f8f8", borderRadius: 7, minHeight: 200 }}>
                {loadingMsgs && (
                  <div style={{ color: "#888", margin: "18px 0" }}>Loading messages...</div>
                )}
                {!loadingMsgs && messages.length === 0 && (
                  <div style={{ color: "#888", margin: "18px 0" }}>No messages yet.</div>
                )}
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    style={{
                      background: msg.direction === "outgoing" ? "#e2001a" : "#fff",
                      color: msg.direction === "outgoing" ? "#fff" : "#222",
                      borderRadius: 9,
                      padding: "10px 14px",
                      margin: "10px 0",
                      maxWidth: 650,
                      boxShadow: "0 1px 3px #0001",
                      fontSize: 15
                    }}>
                    {msg.body}
                    <div style={{
                      fontSize: 12, color: "#888",
                      marginTop: 6, textAlign: "right"
                    }}>
                      {new Date(Number(msg.timestamp)).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              <form
                onSubmit={handleSend}
                style={{
                  position: "fixed",
                  left: 210,
                  right: 0,
                  bottom: 0,
                  background: "#fff",
                  borderTop: "1.5px solid #eee",
                  display: "flex",
                  gap: 10,
                  padding: 12,
                  maxWidth: 900,
                  margin: "0 auto"
                }}
              >
                <input
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  placeholder="Type a reply…"
                  style={{
                    flex: 1,
                    borderRadius: 6,
                    border: "1.5px solid #bbb",
                    padding: "10px 16px",
                    fontSize: 16,
                  }}
                />
                <button
                  type="submit"
                  disabled={!reply.trim()}
                  style={{
                    background: "#e2001a",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "10px 26px",
                    fontWeight: "bold",
                    fontSize: 16,
                  }}
                >Send</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Table cell and header styles for dense view
const td = { padding: "6px 12px", fontSize: 15, color: "#223", verticalAlign: "middle", border: "none" } as const;
const th = { padding: "7px 13px", fontSize: 14, color: "#555", textAlign: "left", fontWeight: 700, border: "none" } as const;

// Tag display
function Tag({ tag }: { tag: string }) {
  const colorMap: any = {
    support: "#1890ff",
    accounts: "#ffc107",
    sales: "#28a745",
    lead: "#e2001a",
    closed: "#888",
    unverified: "#aaa"
  };
  return (
    <span style={{
      display: "inline-block",
      background: colorMap[tag] || "#aaa",
      color: "#fff",
      fontWeight: 600,
      fontSize: 13,
      padding: "2px 12px",
      borderRadius: 16,
      minWidth: 0,
      textAlign: "center",
    }}>
      {tag[0].toUpperCase() + tag.slice(1)}
    </span>
  );
}

export default App;
