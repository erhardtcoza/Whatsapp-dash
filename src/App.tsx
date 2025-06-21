import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Login from "./Login";
import "./App.css";

export default function App() {
  useEffect(() => { document.title = "Vinet WhatsApp Portal"; }, []);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("wa-dark") === "1");
  useEffect(() => {
    document.body.style.background = darkMode ? "#181a1f" : "#f7f7fa";
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
        bg: "#181a1f", card: "#23262b", border: "#23262b",
        text: "#f6f7fa", sub: "#bfc1c7", red: "#e2001a",
        sidebar: "#23262b", sidebarSel: "#e2001a", sidebarTxt: "#fff",
        input: "#262931", inputText: "#fff", th: "#ccd0da", td: "#eee",
        badge: "#e2001a", tag: "#555", tagTxt: "#fff",
        msgIn: "#23262b", msgOut: "#e2001a",
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
    return <Login onLogin={handleLoginSuccess} />;
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        minWidth: 0,
        background: c.bg,
        color: c.text,
      }}
    >
      {/* Sidebar always at left, full height */}
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
      {/* Main Content */}
      <main
        style={{
          flex: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          background: c.bg,
          padding: "0",
          minWidth: 0,
        }}
      >
        {/* Top Bar/Header */}
        <div
          style={{
            width: "100%",
            background: c.card,
            borderBottom: `2px solid ${c.red}`,
            padding: "28px 36px 12px 36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 100,
            minHeight: 60,
          }}
        >
          <span style={{ fontWeight: 700, fontSize: 26, color: c.red, letterSpacing: 0.5 }}>
            {section[0].toUpperCase() + section.slice(1)}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <span style={{ color: c.sub, fontSize: 16, marginRight: 10, minWidth: 100, textAlign: "right" }}>
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
        {/* Responsive Content Box */}
        <section
          style={{
            flex: 1,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            background: c.bg,
            minHeight: 0,
            minWidth: 0,
          }}
        >
          <div
            style={{
              flex: 1,
              maxWidth: 1024,
              margin: "36px 36px 0 36px",
              background: c.card,
              borderRadius: 18,
              boxShadow: "0 2px 14px #0001",
              minHeight: "64vh",
              padding: "0 0 36px 0",
              color: c.text,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "40px 0", fontSize: 17, color: c.text }}>
              {section[0].toUpperCase() + section.slice(1)} section coming soon.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
