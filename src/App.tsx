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
async function updateCustomer(
  phone: string,
  name: string,
  customer_id: string,
  email: string,
  tag?: string
) {
  await fetch(`${API_BASE}/api/update-customer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, name, customer_id, email, tag }),
  });
}

function App() {
  // Navigation state
  const [section, setSection] = useState("chats");

  // Chat and table data
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [reply, setReply] = useState("");

  // "Add New Lead" modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [leadPhone, setLeadPhone] = useState("");
  const [leadName, setLeadName] = useState("");
  const [leadCode, setLeadCode] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadBody, setLeadBody] = useState("");
  const [leadType, setLeadType] = useState("lead");
  const [leadSaving, setLeadSaving] = useState(false);
  const [leadErr, setLeadErr] = useState("");

  // Search bar
  const [search, setSearch] = useState("");

  // Refresh chat list on section change
  useEffect(() => {
    if (section === "chats" || section === "sales" || section === "accounts" || section === "support") {
      setLoadingChats(true);
      getChats().then((data) => {
        setChats(data);
        setLoadingChats(false);
      });
      setSelectedChat(null);
    }
  }, [section]);

  // Load messages when chat selected
  useEffect(() => {
    if (!selectedChat) return;
    setLoadingMsgs(true);
    getMessages(selectedChat.from_number).then((data) => {
      setMessages(data);
      setLoadingMsgs(false);
    });
  }, [selectedChat]);

  // Search filter
  let filteredChats = chats.filter((c) => {
    const searchStr = search.toLowerCase();
    return (
      (!searchStr ||
        c.from_number?.toLowerCase().includes(searchStr) ||
        c.customer_id?.toLowerCase().includes(searchStr) ||
        c.email?.toLowerCase().includes(searchStr)) &&
      (section === "chats" ||
        (section === "sales" && c.tag === "sales") ||
        (section === "accounts" && c.tag === "accounts") ||
        (section === "support" && c.tag === "support"))
    );
  });

  // Add New Lead (modal)
  const handleAddLead = async (e: any) => {
    e.preventDefault();
    setLeadSaving(true);
    setLeadErr("");
    if (!/^[0-9]{8,16}$/.test(leadPhone)) {
      setLeadErr("Enter valid phone number");
      setLeadSaving(false);
      return;
    }
    try {
      await updateCustomer(
        leadPhone,
        leadName,
        leadCode,
        leadEmail,
        leadType
      );
      await sendMessage(leadPhone, leadBody);
      setModalOpen(false);
      setTimeout(
        () =>
          getChats().then((data) => {
            setChats(data);
          }),
        600
      );
      setLeadPhone("");
      setLeadName("");
      setLeadCode("");
      setLeadEmail("");
      setLeadBody("");
      setLeadType("lead");
    } catch {
      setLeadErr("Failed to create lead");
    }
    setLeadSaving(false);
  };

  // Send reply in chat
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

      <div style={{ flex: 1, marginLeft: 205 }}>
        {/* Topbar: section title, search, add-lead */}
        <div
          style={{
            padding: "18px 32px 10px 32px",
            borderBottom: "2px solid #e2001a",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <span
            style={{
              fontWeight: 700,
              fontSize: 24,
              color: "#e2001a",
              letterSpacing: 1,
            }}
          >
            {section[0].toUpperCase() + section.slice(1)}
          </span>
          {(section === "chats" ||
            section === "sales" ||
            section === "accounts" ||
            section === "support") && (
            <input
              type="search"
              placeholder="Search number, ID or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                minWidth: 240,
                fontSize: 15,
                border: "1.5px solid #eee",
                borderRadius: 6,
                padding: "8px 13px",
                marginRight: 16,
              }}
            />
          )}
          {(section === "chats" || section === "leads") && (
            <button
              onClick={() => setModalOpen(true)}
              style={{
                background: "#e2001a",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "10px 24px",
                fontWeight: "bold",
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              Add New Lead
            </button>
          )}
        </div>

        {/* Modal for Add New Lead */}
        {modalOpen && (
          <div
            style={{
              position: "fixed",
              zIndex: 30,
              left: 0,
              top: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(30,0,0,0.28)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 18,
                padding: 36,
                minWidth: 380,
                boxShadow: "0 2px 18px rgba(0,0,0,0.16)",
              }}
            >
              <h2
                style={{
                  color: "#e2001a",
                  marginBottom: 25,
                  fontWeight: 800,
                  textAlign: "center",
                  fontSize: 32,
                  letterSpacing: 1,
                }}
              >
                Add New Lead
              </h2>
              <form onSubmit={handleAddLead}>
                <label>
                  <div style={{ fontWeight: 500, color: "#223", marginBottom: 2 }}>
                    Phone number (with country code)
                  </div>
                  <input
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value.replace(/\D/g, ""))}
                    required
                    minLength={8}
                    maxLength={16}
                    placeholder="27821234567"
                    style={{
                      width: "100%",
                      fontSize: 16,
                      marginBottom: 12,
                      padding: 8,
                      borderRadius: 5,
                      border: "1px solid #ccc",
                    }}
                  />
                </label>
                <label>
                  <div style={{ fontWeight: 500, color: "#223", marginBottom: 2 }}>Name</div>
                  <input
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    required
                    minLength={2}
                    maxLength={40}
                    placeholder="Full Name"
                    style={{
                      width: "100%",
                      fontSize: 16,
                      marginBottom: 12,
                      padding: 8,
                      borderRadius: 5,
                      border: "1px solid #ccc",
                    }}
                  />
                </label>
                <label>
                  <div style={{ fontWeight: 500, color: "#223", marginBottom: 2 }}>
                    Client Code
                  </div>
                  <input
                    value={leadCode}
                    onChange={(e) => setLeadCode(e.target.value)}
                    required
                    minLength={2}
                    maxLength={30}
                    placeholder="Client ID"
                    style={{
                      width: "100%",
                      fontSize: 16,
                      marginBottom: 12,
                      padding: 8,
                      borderRadius: 5,
                      border: "1px solid #ccc",
                    }}
                  />
                </label>
                <label>
                  <div style={{ fontWeight: 500, color: "#223", marginBottom: 2 }}>Email</div>
                  <input
                    type="email"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    required
                    maxLength={60}
                    placeholder="email@domain.com"
                    style={{
                      width: "100%",
                      fontSize: 16,
                      marginBottom: 12,
                      padding: 8,
                      borderRadius: 5,
                      border: "1px solid #ccc",
                    }}
                  />
                </label>
                <label>
                  <div style={{ fontWeight: 500, color: "#223", marginBottom: 2 }}>Type</div>
                  <select
                    value={leadType}
                    onChange={(e) => setLeadType(e.target.value)}
                    style={{
                      width: "100%",
                      fontSize: 16,
                      marginBottom: 12,
                      padding: 8,
                      borderRadius: 5,
                      border: "1px solid #ccc",
                    }}
                  >
                    <option value="lead">Lead</option>
                    <option value="sales">Sales</option>
                    <option value="accounts">Accounts</option>
                    <option value="support">Support</option>
                  </select>
                </label>
                <label>
                  <div style={{ fontWeight: 500, color: "#223", marginBottom: 2 }}>
                    Message
                  </div>
                  <textarea
                    value={leadBody}
                    onChange={(e) => setLeadBody(e.target.value)}
                    required
                    minLength={1}
                    maxLength={500}
                    placeholder="Type your message here..."
                    style={{
                      width: "100%",
                      fontSize: 16,
                      marginBottom: 18,
                      padding: 8,
                      borderRadius: 5,
                      border: "1px solid #ccc",
                      minHeight: 54,
                    }}
                  />
                </label>
                {leadErr && (
                  <div style={{ color: "#e2001a", marginBottom: 14 }}>{leadErr}</div>
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 12,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    style={{
                      padding: "8px 22px",
                      borderRadius: 7,
                      border: "none",
                      background: "#eee",
                      fontWeight: "bold",
                      fontSize: 15,
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={leadSaving}
                    style={{
                      padding: "8px 22px",
                      borderRadius: 7,
                      border: "none",
                      background: "#e2001a",
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: 15,
                    }}
                  >
                    {leadSaving ? "Adding..." : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Broadcast page */}
        {section === "broadcast" && (
          <div
            style={{
              marginTop: 34,
              maxWidth: 580,
              background: "#fff",
              padding: 38,
              borderRadius: 12,
              marginLeft: "auto",
              marginRight: "auto",
              boxShadow: "0 1px 12px #0001",
            }}
          >
            <h2
              style={{
                color: "#e2001a",
                fontWeight: 900,
                fontSize: 26,
                marginBottom: 28,
              }}
            >
              Send Broadcast
            </h2>
            <div style={{ color: "#888", fontSize: 16 }}>
              <i>Coming soon: send bulk messages by tag/group, with WhatsApp rate limit protection.</i>
            </div>
          </div>
        )}

        {/* Table (chats/sales/accounts/support) */}
        {(section === "chats" ||
          section === "sales" ||
          section === "accounts" ||
          section === "support") &&
          !selectedChat && (
            <table
              style={{
                width: "100%",
                background: "#fff",
                borderCollapse: "collapse",
                marginTop: 28,
                boxShadow: "0 1px 6px #0001",
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
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
                {!loadingChats && filteredChats.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", color: "#888", padding: 20 }}>
                      No chats found.
                    </td>
                  </tr>
                )}
                {filteredChats.map((chat) => (
                  <tr
                    key={chat.from_number}
                    onClick={() => setSelectedChat(chat)}
                    style={{
                      background: "#fff",
                      cursor: "pointer",
                      height: 38,
                      borderBottom: "1px solid #f2f2f2",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = "#f7f7fa")}
                    onMouseOut={(e) => (e.currentTarget.style.background = "#fff")}
                  >
                    <td style={td}>{chat.name || <span style={{ color: "#e2001a" }}>Lead</span>}</td>
                    <td style={td}>{chat.from_number}</td>
                    <td style={td}>{chat.customer_id || <span style={{ color: "#888" }}>—</span>}</td>
                    <td style={td}><Tag tag={chat.tag} /></td>
                    <td
                      style={{
                        ...td,
                        maxWidth: 260,
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                    >
                      {chat.last_message}
                    </td>
                    <td style={td}>
                      {chat.unread_count > 0 ? (
                        <span
                          style={{
                            display: "inline-block",
                            background: "#e2001a",
                            color: "#fff",
                            fontWeight: "bold",
                            borderRadius: 11,
                            minWidth: 25,
                            fontSize: 13,
                            textAlign: "center",
                          }}
                        >
                          {chat.unread_count}
                        </span>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

        {/* Chat View */}
        {(section === "chats" ||
          section === "sales" ||
          section === "accounts" ||
          section === "support") &&
          selectedChat && (
            <div style={{ marginTop: 24 }}>
              <button
                onClick={() => setSelectedChat(null)}
                style={{
                  background: "#e2001a",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "6px 19px",
                  fontWeight: 700,
                  marginBottom: 16,
                  fontSize: 15,
                }}
              >
                ← Back
              </button>
              <span style={{ fontWeight: 700, fontSize: 18, marginLeft: 16 }}>
                {selectedChat.name || "Lead"}
              </span>
              <span style={{ color: "#888", marginLeft: 16 }}>{selectedChat.from_number}</span>
              {selectedChat.customer_id && (
                <span style={{ color: "#007bff", marginLeft: 14, fontWeight: 600 }}>
                  [ID: {selectedChat.customer_id}]
                </span>
              )}
              <span style={{ marginLeft: 22 }}>
                <Tag tag={selectedChat.tag} />
              </span>
              {/* Messages */}
              <div
                style={{
                  marginTop: 25,
                  marginBottom: 60,
                  padding: 18,
                  background: "#f8f8f8",
                  borderRadius: 7,
                  minHeight: 200,
                }}
              >
                {loadingMsgs && (
                  <div style={{ color: "#888", margin: "18px 0" }}>
                    Loading messages...
                  </div>
                )}
                {!loadingMsgs && messages.length === 0 && (
                  <div style={{ color: "#888", margin: "18px 0" }}>
                    No messages yet.
                  </div>
                )}
                {messages.map((msg) => (
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
                      fontSize: 15,
                    }}
                  >
                    {msg.body}
                    <div
                      style={{
                        fontSize: 12,
                        color: "#888",
                        marginTop: 6,
                        textAlign: "right",
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
                  left: 210,
                  right: 0,
                  bottom: 0,
                  background: "#fff",
                  borderTop: "1.5px solid #eee",
                  display: "flex",
                  gap: 10,
                  padding: 12,
                  maxWidth: 900,
                  margin: "0 auto",
                }}
              >
                <input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
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
                >
                  Send
                </button>
              </form>
            </div>
          )}
      </div>
    </div>
  );
}

// Dense cell/header
const td = {
  padding: "6px 12px",
  fontSize: 15,
  color: "#223",
  verticalAlign: "middle",
  border: "none",
} as const;
const th = {
  padding: "7px 13px",
  fontSize: 14,
  color: "#555",
  textAlign: "left",
  fontWeight: 700,
  border: "none",
} as const;

// Tag display
function Tag({ tag }: { tag: string }) {
  const colorMap: any = {
    support: "#1890ff",
    accounts: "#ffc107",
    sales: "#28a745",
    lead: "#e2001a",
    closed: "#888",
    unverified: "#aaa",
  };
  return (
    <span
      style={{
        display: "inline-block",
        background: colorMap[tag] || "#aaa",
        color: "#fff",
        fontWeight: 600,
        fontSize: 13,
        padding: "2px 12px",
        borderRadius: 16,
        minWidth: 0,
        textAlign: "center",
      }}
    >
      {tag[0].toUpperCase() + tag.slice(1)}
    </span>
  );
}

export default App;
