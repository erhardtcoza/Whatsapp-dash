import { useEffect, useState, useMemo } from "react";
import Sidebar from "./Sidebar";
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
async function updateCustomer(phone: string, name: string, customer_id: string, email: string, tag?: string) {
  await fetch(`${API_BASE}/api/update-customer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, name, customer_id, email, tag }),
  });
}

export default function App() {
  // Set document title once
  useEffect(() => {
    document.title = "Vinet WhatsApp Portal";
  }, []);

  // Dark mode
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("wa-dark") === "1");
  useEffect(() => {
    if (darkMode) {
      document.body.style.background = "#1a1d22";
      localStorage.setItem("wa-dark", "1");
    } else {
      document.body.style.background = "#f7f7fa";
      localStorage.setItem("wa-dark", "0");
    }
  }, [darkMode]);

  // Navigation/menu state
  const [section, setSection] = useState("chats");
  const [search, setSearch] = useState("");

  // Chat data
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [reply, setReply] = useState("");

  // "Add New Lead" modal
  const [modalOpen, setModalOpen] = useState(false);
  const [leadPhone, setLeadPhone] = useState("");
  const [leadName, setLeadName] = useState("");
  const [leadCode, setLeadCode] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadBody, setLeadBody] = useState("");
  const [leadType, setLeadType] = useState("lead");
  const [leadSaving, setLeadSaving] = useState(false);
  const [leadErr, setLeadErr] = useState("");

  // Load chats on section change
  useEffect(() => {
    setLoadingChats(true);
    getChats().then((data) => {
      setChats(data);
      setLoadingChats(false);
    });
    setSelectedChat(null);
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

  // Counters for open tickets per department
  const counts = useMemo(() => {
    const isOpen = (c: any) => (c.tag !== "closed" && c.tag !== "unverified" && c.tag !== "lead");
    return {
      sales: chats.filter(c => c.tag === "sales" && isOpen(c)).length,
      accounts: chats.filter(c => c.tag === "accounts" && isOpen(c)).length,
      support: chats.filter(c => c.tag === "support" && isOpen(c)).length,
    };
  }, [chats]);

  // Filter chats by menu section and search
  let filteredChats = chats.filter((c) => {
    const searchStr = search.toLowerCase();
    const base =
      (!searchStr ||
        c.from_number?.toLowerCase().includes(searchStr) ||
        (c.customer_id && String(c.customer_id).toLowerCase().includes(searchStr)) ||
        (c.email && c.email.toLowerCase().includes(searchStr)));
    switch (section) {
      case "sales":
        return base && c.tag === "sales";
      case "accounts":
        return base && c.tag === "accounts";
      case "support":
        return base && c.tag === "support";
      case "unlinked":
        return base && (!c.customer_id || c.customer_id === "—" || c.tag === "unverified");
      case "leads":
        return base && (c.tag === "lead" || c.tag === "unverified");
      default:
        return base;
    }
  });

  // Colors for light/dark mode
  const c = darkMode
    ? {
        bg: "#1a1d22",
        card: "#23262b",
        border: "#23262b",
        text: "#f6f7fa",
        sub: "#bfc1c7",
        red: "#e2001a",
        sidebar: "#23262b",
        sidebarSel: "#e2001a",
        sidebarTxt: "#fff",
        input: "#262931",
        inputText: "#fff",
        th: "#ccd0da",
        td: "#eee",
        badge: "#e2001a",
        tag: "#555",
        tagTxt: "#fff",
        msgIn: "#262931",
        msgOut: "#e2001a",
      }
    : {
        bg: "#f7f7fa",
        card: "#fff",
        border: "#eaeaea",
        text: "#23262b",
        sub: "#555",
        red: "#e2001a",
        sidebar: "#f7f7fa",
        sidebarSel: "#e2001a",
        sidebarTxt: "#23262b",
        input: "#fff",
        inputText: "#23262b",
        th: "#555",
        td: "#223",
        badge: "#e2001a",
        tag: "#888",
        tagTxt: "#fff",
        msgIn: "#fff",
        msgOut: "#e2001a",
      };

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
      await updateCustomer(leadPhone, leadName, leadCode, leadEmail, leadType);
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
    <div style={{ display: "flex", minHeight: "100vh", background: c.bg }}>
      <Sidebar
        selected={section}
        onSelect={setSection}
        darkMode={darkMode}
        colors={c}
        counts={counts}
        search={search}
        setSearch={setSearch}
        onDarkMode={() => setDarkMode((d) => !d)}
      />

      <div style={{ flex: 1, marginLeft: 205 }}>
        {/* Top bar for non-sidebar pages */}
        {(section === "chats" ||
          section === "sales" ||
          section === "accounts" ||
          section === "support" ||
          section === "leads" ||
          section === "unlinked") && (
          <div
            style={{
              padding: "18px 32px 10px 32px",
              borderBottom: `2px solid ${c.red}`,
              background: c.card,
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
                color: c.red,
                letterSpacing: 1,
              }}
            >
              {section[0].toUpperCase() + section.slice(1).replace(/^\w/, (m) => m.toUpperCase())}
            </span>
            {(section === "chats" || section === "leads") && (
              <button
                onClick={() => setModalOpen(true)}
                style={{
                  background: c.red,
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
        )}

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
              background: darkMode
                ? "rgba(18,18,18,0.40)"
                : "rgba(30,0,0,0.28)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                background: c.card,
                borderRadius: 18,
                padding: 36,
                minWidth: 380,
                boxShadow: "0 2px 18px rgba(0,0,0,0.20)",
                color: c.text,
              }}
            >
              <h2
                style={{
                  color: c.red,
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
                  <div style={{ fontWeight: 500, color: c.text, marginBottom: 2 }}>
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
                      border: `1px solid ${c.border}`,
                      background: c.input,
                      color: c.inputText,
                    }}
                  />
                </label>
                <label>
                  <div style={{ fontWeight: 500, color: c.text, marginBottom: 2 }}>Name</div>
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
                      border: `1px solid ${c.border}`,
                      background: c.input,
                      color: c.inputText,
                    }}
                  />
                </label>
                <label>
                  <div style={{ fontWeight: 500, color: c.text, marginBottom: 2 }}>
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
                      border: `1px solid ${c.border}`,
                      background: c.input,
                      color: c.inputText,
                    }}
                  />
                </label>
                <label>
                  <div style={{ fontWeight: 500, color: c.text, marginBottom: 2 }}>Email</div>
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
                      border: `1px solid ${c.border}`,
                      background: c.input,
                      color: c.inputText,
                    }}
                  />
                </label>
                <label>
                  <div style={{ fontWeight: 500, color: c.text, marginBottom: 2 }}>Type</div>
                  <select
                    value={leadType}
                    onChange={(e) => setLeadType(e.target.value)}
                    style={{
                      width: "100%",
                      fontSize: 16,
                      marginBottom: 12,
                      padding: 8,
                      borderRadius: 5,
                      border: `1px solid ${c.border}`,
                      background: c.input,
                      color: c.inputText,
                    }}
                  >
                    <option value="lead">Lead</option>
                    <option value="sales">Sales</option>
                    <option value="accounts">Accounts</option>
                    <option value="support">Support</option>
                  </select>
                </label>
                <label>
                  <div style={{ fontWeight: 500, color: c.text, marginBottom: 2 }}>
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
                      border: `1px solid ${c.border}`,
                      background: c.input,
                      color: c.inputText,
                      minHeight: 54,
                    }}
                  />
                </label>
                {leadErr && (
                  <div style={{ color: c.red, marginBottom: 14 }}>{leadErr}</div>
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
                      background: c.input,
                      color: c.inputText,
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
                      background: c.red,
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

        {/* Table of chats */}
        {(section === "chats" ||
          section === "sales" ||
          section === "accounts" ||
          section === "support" ||
          section === "leads" ||
          section === "unlinked") &&
          !selectedChat && (
            <div
              style={{
                maxWidth: 830,
                margin: "38px auto 0 auto",
                background: c.card,
                borderRadius: 16,
                boxShadow: "0 2px 14px #0001",
                padding: "0 0 10px 0",
                color: c.text,
              }}
            >
              <table
                style={{
                  width: "100%",
                  background: "transparent",
                  borderCollapse: "collapse",
                  borderRadius: 14,
                  overflow: "hidden",
                  color: c.text,
                }}
              >
                <thead style={{ background: darkMode ? "#25282e" : "#f8f8f8" }}>
                  <tr style={{ height: 36 }}>
                    <th style={{ ...th, color: c.th }}>Name</th>
                    <th style={{ ...th, color: c.th }}>Number</th>
                    <th style={{ ...th, color: c.th }}>ID</th>
                    <th style={{ ...th, color: c.th }}>Tag</th>
                    <th style={{ ...th, color: c.th }}>Last Message</th>
                    <th style={{ ...th, color: c.th }}>Unread</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingChats && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", color: c.sub, padding: 20 }}>
                        Loading...
                      </td>
                    </tr>
                  )}
                  {!loadingChats && filteredChats.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", color: c.sub, padding: 20 }}>
                        No chats found.
                      </td>
                    </tr>
                  )}
                  {filteredChats.map((chat) => (
                    <tr
                      key={chat.from_number}
                      onClick={() => setSelectedChat(chat)}
                      style={{
                        background: "transparent",
                        cursor: "pointer",
                        height: 38,
                        borderBottom: `1px solid ${c.border}`,
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.background = darkMode
                          ? "#23262b"
                          : "#f7f7fa")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <td style={td}>{chat.name || <span style={{ color: c.red }}>Lead</span>}</td>
                      <td style={td}>{chat.from_number}</td>
                      <td style={td}>
                        {chat.customer_id || <span style={{ color: c.sub }}>—</span>}
                      </td>
                      <td style={td}>
                        <Tag tag={chat.tag} c={c} />
                      </td>
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
                              background: c.badge,
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
            </div>
          )}

        {/* Chat View */}
        {(section === "chats" ||
          section === "sales" ||
          section === "accounts" ||
          section === "support" ||
          section === "leads" ||
          section === "unlinked") &&
          selectedChat && (
            <div
              style={{
                maxWidth: 830,
                margin: "38px auto 0 auto",
                background: c.card,
                borderRadius: 16,
                boxShadow: "0 2px 14px #0001",
                padding: "0 0 28px 0",
                color: c.text,
              }}
            >
              <button
                onClick={() => setSelectedChat(null)}
                style={{
                  background: c.red,
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "6px 19px",
                  fontWeight: 700,
                  margin: "20px 0 16px 24px",
                  fontSize: 15,
                  display: "inline-block",
                }}
              >
                ← Back
              </button>
              <span style={{ fontWeight: 700, fontSize: 18, marginLeft: 16 }}>
                {selectedChat.name || "Lead"}
              </span>
              <span style={{ color: c.sub, marginLeft: 16 }}>
                {selectedChat.from_number}
              </span>
              {selectedChat.customer_id && (
                <span
                  style={{
                    color: "#37a0ff",
                    marginLeft: 14,
                    fontWeight: 600,
                  }}
                >
                  [ID: {selectedChat.customer_id}]
                </span>
              )}
              <span style={{ marginLeft: 22 }}>
                <Tag tag={selectedChat.tag} c={c} />
              </span>
              {/* Messages */}
              <div
                style={{
                  marginTop: 25,
                  marginBottom: 60,
                  padding: 18,
                  background: darkMode ? "#22242a" : "#f8f8f8",
                  borderRadius: 7,
                  minHeight: 200,
                }}
              >
                {loadingMsgs && (
                  <div style={{ color: c.sub, margin: "18px 0" }}>
                    Loading messages...
                  </div>
                )}
                {!loadingMsgs && messages.length === 0 && (
                  <div style={{ color: c.sub, margin: "18px 0" }}>
                    No messages yet.
                  </div>
                )}
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      background:
                        msg.direction === "outgoing"
                          ? c.msgOut
                          : c.msgIn,
                      color:
                        msg.direction === "outgoing"
                          ? "#fff"
                          : darkMode
                          ? "#f7f7fa"
                          : "#222",
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
                        color: c.sub,
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
                  maxWidth: 700,
                  margin: "0 auto",
                  display: "flex",
                  gap: 10,
                  padding: 0,
                }}
              >
                <input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type a reply…"
                  style={{
                    flex: 1,
                    borderRadius: 6,
                    border: `1.5px solid ${c.border}`,
                    padding: "10px 16px",
                    fontSize: 16,
                    background: c.input,
                    color: c.inputText,
                  }}
                />
                <button
                  type="submit"
                  disabled={!reply.trim()}
                  style={{
                    background: c.red,
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

const td = {
  padding: "6px 12px",
  fontSize: 15,
  verticalAlign: "middle",
  border: "none",
} as const;
const th = {
  padding: "7px 13px",
  fontSize: 14,
  textAlign: "left",
  fontWeight: 700,
  border: "none",
} as const;

function Tag({ tag, c }: { tag: string; c: any }) {
  const colorMap: any = {
    support: "#1890ff",
    accounts: "#ffc107",
    sales: "#28a745",
    lead: "#e2001a",
    closed: "#888",
    unverified: "#aaa",
    customer: c.tag,
  };
  return (
    <span
      style={{
        display: "inline-block",
        background: colorMap[tag] || c.tag,
        color: c.tagTxt,
        fontWeight: 600,
        fontSize: 13,
        padding: "2px 12px",
        borderRadius: 16,
        minWidth: 0,
        textAlign: "center",
        textTransform: "capitalize",
      }}
    >
      {tag[0].toUpperCase() + tag.slice(1)}
    </span>
  );
}
