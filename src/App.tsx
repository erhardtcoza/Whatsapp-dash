import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Login from "./Login";
import "./App.css";

export default function App() {
  useEffect(() => { document.title = "Vinet WhatsApp Portal"; }, []);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("wa-dark") === "1");
  useEffect(() => {
    document.body.style.background = darkMode ? "#191c21" : "#f7f7fa";
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

  const c = darkMode
    ? {
        bg: "#191c21", card: "#23262b", border: "#262931",
        text: "#f6f7fa", sub: "#bfc1c7", red: "#e2001a",
        sidebar: "#23262b", sidebarSel: "#e2001a", sidebarTxt: "#fff",
        input: "#262931", inputText: "#fff", th: "#ccd0da", td: "#eee",
        badge: "#e2001a", tag: "#555", tagTxt: "#fff",
        msgIn: "#262931", msgOut: "#e2001a",
      }
    : {
        bg: "#f7f7fa", card: "#fff", border: "#eaeaea",
        text: "#23262b", sub: "#555", red: "#e2001a",
        sidebar: "#fff", sidebarSel: "#e2001a", sidebarTxt: "#23262b",
        input: "#fff", inputText: "#23262b", th: "#555", td: "#223",
        badge: "#e2001a", tag: "#888", tagTxt: "#fff",
        msgIn: "#fff", msgOut: "#e2001a",
      };

  if (!user) {
    return <Login onLogin={handleLoginSuccess} colors={c} />;
  }

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: c.bg,
    }}>
      {/* Fixed sidebar */}
      <div style={{
        width: 190,
        minHeight: "100vh",
        background: c.sidebar,
        borderRight: `1.5px solid ${c.border}`,
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 101,
        boxShadow: "2px 0 10px #0001"
      }}>
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
      </div>

      {/* Main area, offset by sidebar width */}
      <div style={{
        flex: 1,
        marginLeft: 190,
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: c.bg,
        alignItems: "center"
      }}>
        {/* Header */}
        <div
          style={{
            width: "100%",
            maxWidth: 880,
            margin: "0 auto",
            padding: "20px 0 0 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "transparent"
          }}
        >
          <span style={{
            fontWeight: 700,
            fontSize: 28,
            color: c.red,
            letterSpacing: "-1px"
          }}>
            {section.charAt(0).toUpperCase() + section.slice(1)}
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
                padding: "7px 18px",
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Red divider */}
        <div style={{
          width: "100%",
          maxWidth: 880,
          height: 3,
          background: c.red,
          margin: "8px 0 20px 0",
          borderRadius: 6,
        }} />

        {/* Content card */}
        <div
          style={{
            width: "100%",
            maxWidth: 670,
            minHeight: 320,
            background: c.card,
            borderRadius: 18,
            boxShadow: "0 2px 12px #0001",
            padding: "40px 30px",
            color: c.text,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "0 auto 40px auto"
          }}
        >
          <div style={{ color: c.text }}>
            {section.charAt(0).toUpperCase() + section.slice(1)} section coming soon.
          </div>
        </div>
      </div>
    </div>
  );
}
