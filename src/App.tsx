import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Login from "./Login";
import UnlinkedClientsPage from "./UnlinkedClientsPage";
import AllChatsPage from "./AllChatsPage";
import SupportPage from "./SupportPage";
import AccountsPage from "./AccountsPage";
import SalesPage from "./SalesPage";
import LeadsPage from "./LeadsPage";
import ChatPanel from "./ChatPanel";
import "./App.css";

export default function App() {
  useEffect(() => { document.title = "Vinet WhatsApp Portal"; }, []);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("wa-dark") === "1");
  useEffect(() => {
    document.body.style.background = darkMode ? "#1a1d22" : "#f7f7fa";
    localStorage.setItem("wa-dark", darkMode ? "1" : "0");
  }, [darkMode]);

  const [user, setUser] = useState<{ username: string, role: string } | null>(() => {
    const u = localStorage.getItem("wa-user");
    return u ? JSON.parse(u) : null;
  });
  function handleLoginSuccess(userObj: any) {
    setUser(userObj);
    localStorage.setItem("wa-user", JSON.stringify(userObj));
  }
  function handleLogout() {
    setUser(null);
    localStorage.removeItem("wa-user");
  }

  const [section, setSection] = useState("unlinked");
  const [search, setSearch] = useState("");
  const [selectedChat, setSelectedChat] = useState<any | null>(null);

  const c = darkMode
    ? {
        bg: "#1a1d22", card: "#23262b", border: "#23262b",
        text: "#f6f7fa", sub: "#bfc1c7", red: "#e2001a",
        sidebar: "#23262b", sidebarSel: "#e2001a", sidebarTxt: "#fff",
        input: "#262931", inputText: "#fff", th: "#ccd0da", td: "#eee",
        badge: "#e2001a", tag: "#555", tagTxt: "#fff",
        msgIn: "#262931", msgOut: "#e2001a",
      }
    : {
        bg: "#f7f7fa", card: "#fff", border: "#eaeaea",
        text: "#23262b", sub: "#555", red: "#e2001a",
        sidebar: "#f7f7fa", sidebarSel: "#e2001a", sidebarTxt: "#23262b",
        input: "#fff", inputText: "#23262b", th: "#555", td: "#223",
        badge: "#e2001a", tag: "#888", tagTxt: "#fff",
        msgIn: "#fff", msgOut: "#e2001a",
      };

  if (!user) {
    return <Login onLogin={handleLoginSuccess} colors={c} />;
  }

  const topBar = (
    <div
      style={{
        width: "100%",
        padding: "14px 30px 12px 205px",
        background: c.card,
        borderBottom: `2px solid ${c.red}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 15,
      }}
    >
      <span style={{ fontWeight: 700, fontSize: 24, color: c.red }}>
        {selectedChat
          ? (selectedChat.name || selectedChat.from_number)
          : section[0].toUpperCase() + section.slice(1).replace(/^\w/, m => m.toUpperCase())}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <span style={{ color: c.sub, fontSize: 16, marginRight: 10 }}>
          {user.username} ({user.role})
        </span>
        <button
          onClick={handleLogout}
          style={{
            background: c.red,
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "7px 16px",
            fontWeight: "bold",
            fontSize: 15,
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: c.bg }}>
      <Sidebar
        selected={section}
        onSelect={setSection}
        darkMode={darkMode}
        colors={c}
        search={search}
        setSearch={setSearch}
        onDarkMode={() => setDarkMode((d) => !d)}
      />
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: c.bg,
        marginLeft: 190, // Sidebar width
      }}>
        {topBar}
        <div
          style={{
            flex: 1,
            width: "96%",
            maxWidth: 880,
            minHeight: 420,
            background: c.card,
            borderRadius: 16,
            boxShadow: "0 2px 14px #0001",
            padding: "0 0 26px 0",
            color: c.text,
            display: "flex",
            flexDirection: "column",
            margin: "24px auto 40px auto",
          }}
        >
          {selectedChat ? (
            <ChatPanel
              chat={selectedChat}
              colors={c}
              darkMode={darkMode}
              onClose={() => setSelectedChat(null)}
            />
          ) : (
            <>
              {section === "unlinked" && <UnlinkedClientsPage colors={c} darkMode={darkMode} onSelectChat={setSelectedChat} />}
              {section === "allchats" && <AllChatsPage colors={c} darkMode={darkMode} onSelectChat={setSelectedChat} />}
              {section === "support" && <SupportPage colors={c} darkMode={darkMode} onSelectChat={setSelectedChat} />}
              {section === "accounts" && <AccountsPage colors={c} darkMode={darkMode} onSelectChat={setSelectedChat} />}
              {section === "sales" && <SalesPage colors={c} darkMode={darkMode} onSelectChat={setSelectedChat} />}
              {section === "leads" && <LeadsPage colors={c} darkMode={darkMode} onSelectChat={setSelectedChat} />}
              {/* Add other pages as needed */}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
