import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Login from "./Login";
import "./App.css";

// Import your content pages
import SupportPage from "./SupportPage";
import AccountsPage from "./AccountsPage";
import SalesPage from "./SalesPage";
import LeadsPage from "./LeadsPage";
import BroadcastPage from "./BroadcastPage";
import AutoResponsePage from "./AutoResponsePage";
import OfficeHoursPage from "./OfficeHoursPage";
import SystemPage from "./SystemPage";
import AddUserPage from "./AddUserPage";
import UnlinkedClientsPage from "./UnlinkedClientsPage";

export default function App() {
  useEffect(() => { document.title = "Vinet WhatsApp Portal"; }, []);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("wa-dark") === "1");
  useEffect(() => {
    document.body.style.background = darkMode ? "#23262b" : "#f7f7fa";
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

  const [section, setSection] = useState("support");
  const [search, setSearch] = useState("");

  // Colors (dark/light)
  const c = darkMode
    ? {
        bg: "#23262b", card: "#292c32", border: "#333",
        text: "#f6f7fa", sub: "#bfc1c7", red: "#e2001a",
        sidebar: "#23262b", sidebarSel: "#e2001a", sidebarTxt: "#fff",
        input: "#292c32", inputText: "#fff", th: "#ccd0da", td: "#eee",
        badge: "#e2001a", tag: "#555", tagTxt: "#fff",
        msgIn: "#292c32", msgOut: "#e2001a",
      }
    : {
        bg: "#f7f7fa", card: "#fff", border: "#eaeaea",
        text: "#23262b", sub: "#555", red: "#e2001a",
        sidebar: "#f7f7fa", sidebarSel: "#e2001a", sidebarTxt: "#23262b",
        input: "#fff", inputText: "#23262b", th: "#555", td: "#223",
        badge: "#e2001a", tag: "#888", tagTxt: "#fff",
        msgIn: "#fff", msgOut: "#e2001a",
      };

  // Renders the selected section's content
  function renderSection(section: string) {
    switch (section) {
      case "support": return <SupportPage colors={c} darkMode={darkMode} />;
      case "accounts": return <AccountsPage colors={c} darkMode={darkMode} />;
      case "sales": return <SalesPage colors={c} darkMode={darkMode} />;
      case "leads": return <LeadsPage colors={c} darkMode={darkMode} />;
      case "broadcast": return <BroadcastPage colors={c} darkMode={darkMode} />;
      case "autoresp": return <AutoResponsePage colors={c} darkMode={darkMode} />;
      case "office": return <OfficeHoursPage colors={c} darkMode={darkMode} />;
      case "system": return <SystemPage colors={c} darkMode={darkMode} />;
      case "adduser": return <AddUserPage colors={c} darkMode={darkMode} />;
      case "unlinked": return <UnlinkedClientsPage colors={c} darkMode={darkMode} />;
      default: return <div style={{ padding: 40 }}>Section not found.</div>;
    }
  }

  if (!user) {
    return <Login onLogin={handleLoginSuccess} colors={c} />;
  }

  const topBar = (
    <div
      style={{
        width: "100%",
        padding: "18px 0 10px 0",
        background: c.bg,
        borderBottom: `2px solid ${c.red}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 15,
      }}
    >
      <span style={{
        fontWeight: 700,
        fontSize: 22,
        color: c.red,
        marginLeft: 28,
        letterSpacing: 0.3,
      }}>
        {section[0].toUpperCase() + section.slice(1)}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginRight: 30 }}>
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
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: c.bg,
        color: c.text,
        overflow: "hidden"
      }}
    >
      <Sidebar
        selected={section}
        onSelect={setSection}
        darkMode={darkMode}
        colors={c}
        user={user}
        search={search}
        setSearch={setSearch}
        onDarkMode={() => setDarkMode((d) => !d)}
      />
      {/* Content area - boxed, responsive */}
      <main
        style={{
          flex: 1,
          minHeight: "100vh",
          background: c.bg,
          padding: "0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{
          width: "100%",
          maxWidth: 1280,
          minHeight: "100vh",
          background: c.bg,
          display: "flex",
          flexDirection: "column",
        }}>
          {topBar}
          <div
            style={{
              flex: 1,
              margin: "30px 24px 0 24px",
              background: c.card,
              borderRadius: 16,
              boxShadow: "0 2px 14px #0001",
              color: c.text,
              minHeight: 420,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {renderSection(section)}
          </div>
        </div>
      </main>
    </div>
  );
}
