import { useEffect, useState, useMemo } from "react";
import Sidebar from "./Sidebar";
import Login from "./Login";
import AutoResponse from "./AutoResponse";
import "./App.css";

// --- Helpers ---
function canView(section: string, role: string) {
  if (role === "admin") return true;
  if (section === "support") return role === "support";
  if (section === "accounts") return role === "accounts";
  if (["sales", "leads", "unlinked"].includes(section)) return role === "sales";
  return false;
}
function AccessDenied() {
  return (
    <div style={{ padding: 70, textAlign: "center", fontSize: 22, color: "#e2001a" }}>
      Access Denied
    </div>
  );
}

export default function App() {
  useEffect(() => { document.title = "Vinet WhatsApp Portal"; }, []);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("wa-dark") === "1");
  useEffect(() => {
    document.body.style.background = darkMode ? "#1a1d22" : "#f7f7fa";
    localStorage.setItem("wa-dark", darkMode ? "1" : "0");
  }, [darkMode]);

  // --- AUTH STATE ---
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

  // --- NAVIGATION STATE ---
  const [section, setSection] = useState("support");
  const [search, setSearch] = useState("");

  // --- COLORS (light/dark theme) ---
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

  // --- LOGIN GATE ---
  if (!user) {
    return <Login onLogin={handleLoginSuccess} colors={c} />;
  }

  // --- LOGOUT BUTTON & TOP BAR ---
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
        {section[0].toUpperCase() + section.slice(1)}
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
        user={user}
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
      }}>
        {topBar}

        {/* --- Card container: Makes the chat view & panels always fit inside the card, not overflowing --- */}
        <div
          style={{
            flex: 1,
            width: "100%",
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "24px 0 0 0",
            background: c.bg,
          }}
        >
          <div
            style={{
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
              marginBottom: 40,
            }}
          >
            {/* --- Main Section Routing --- */}
            {/* Support */}
            {section === "support" && !["admin", "support"].includes(user.role) && <AccessDenied />}
            {section === "support" && ["admin", "support"].includes(user.role) && (
              <div style={{ padding: 40, color: c.text }}>Support chat view (todo)</div>
            )}

            {/* Accounts */}
            {section === "accounts" && !["admin", "accounts"].includes(user.role) && <AccessDenied />}
            {section === "accounts" && ["admin", "accounts"].includes(user.role) && (
              <div style={{ padding: 40, color: c.text }}>Accounts chat view (todo)</div>
            )}

            {/* Sales/Leads/Unlinked */}
            {["sales", "leads", "unlinked"].includes(section) &&
              !["admin", "sales"].includes(user.role) && <AccessDenied />}
            {["sales", "leads", "unlinked"].includes(section) &&
              ["admin", "sales"].includes(user.role) && (
                <div style={{ padding: 40, color: c.text }}>
                  {section[0].toUpperCase() + section.slice(1)} chat view (todo)
                </div>
              )}

            {/* Broadcast, AutoResponse, OfficeHours, System */}
            {["broadcast", "autoresp", "office", "system", "adduser"].includes(section) &&
              user.role !== "admin" && <AccessDenied />}
            {section === "broadcast" && user.role === "admin" && (
              <div style={{ padding: 40, color: c.text }}>Broadcast panel (todo)</div>
            )}
            {section === "autoresp" && user.role === "admin" && (
              <AutoResponse colors={c} darkMode={darkMode} />
            )}
            {section === "office" && user.role === "admin" && (
              <div style={{ padding: 40, color: c.text }}>Office Hours panel (todo)</div>
            )}
            {section === "system" && user.role === "admin" && (
              <div style={{ padding: 40, color: c.text }}>System page (todo)</div>
            )}
            {section === "adduser" && user.role === "admin" && (
              <div style={{ padding: 40, color: c.text }}>Add User page (todo)</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
