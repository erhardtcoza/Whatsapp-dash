import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Login from "./Login";
import UnlinkedClientsPage from "./UnlinkedClientsPage";
import AllChatsPage from "./AllChatsPage";
import SupportPage from "./SupportPage";
import AccountsPage from "./AccountsPage";
import SalesPage from "./SalesPage";
import LeadsPage from "./LeadsPage";
import BroadcastPage from "./BroadcastPage";
import AutoResponsePage from "./AutoResponsePage";
import OfficeHoursPage from "./OfficeHoursPage";
import SystemPage from "./SystemPage";
import AddUserPage from "./AddUserPage";
import "./App.css";

const SECTION_TITLES: Record<string, string> = {
  unlinked: "Unlinked Clients",
  allchats: "All Chats",
  support: "Support",
  accounts: "Accounts",
  sales: "Sales",
  leads: "Leads",
  broadcast: "Broadcast",
  autoresp: "Auto Response",
  office: "Office Hours Management",
  system: "System",
  adduser: "Add User",
};

export default function App() {
  useEffect(() => {
    document.title = "Vinet WhatsApp Portal";
  }, []);

  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("wa-dark") === "1");

  useEffect(() => {
    document.body.style.background = darkMode ? "#1a1d22" : "#f7f7fa";
    localStorage.setItem("wa-dark", darkMode ? "1" : "0");
  }, [darkMode]);

  const [user, setUser] = useState<{ username: string; role: string } | null>(() => {
    const u = localStorage.getItem("wa-user");
    return u ? JSON.parse(u) : null;
  });

  const [section, setSection] = useState("unlinked");
  const [search, setSearch] = useState("");

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

  function handleLoginSuccess(userObj: any) {
    setUser(userObj);
    localStorage.setItem("wa-user", JSON.stringify(userObj));
  }

  function handleLogout() {
    setUser(null);
    localStorage.removeItem("wa-user");
  }

  if (!user) return <Login onLogin={handleLoginSuccess} colors={c} />;

  const isAdmin = user.role === "admin";

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
        user={user}
        onLogout={handleLogout}
      />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh", background: c.bg }}>
        <div
          style={{
            flex: 1,
            width: "100%",
            maxWidth: 1100,
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
          <div
            style={{
              fontWeight: 700,
              fontSize: 26,
              color: c.text,
              padding: "28px 40px 14px 40px",
              borderBottom: `1.5px solid ${c.border}`,
              marginBottom: 6,
              letterSpacing: 0.1,
              textAlign: "left",
            }}
          >
            {SECTION_TITLES[section] || "Dashboard"}
          </div>

          <div style={{ padding: "0 40px", flex: 1 }}>
            {{
              unlinked: <UnlinkedClientsPage colors={c} darkMode={darkMode} />,
              allchats: <AllChatsPage colors={c} darkMode={darkMode} />,
              support: <SupportPage colors={c} darkMode={darkMode} />,
              accounts: <AccountsPage colors={c} darkMode={darkMode} />,
              sales: <SalesPage colors={c} darkMode={darkMode} />,
              leads: <LeadsPage colors={c} darkMode={darkMode} />,
              broadcast: <BroadcastPage colors={c} darkMode={darkMode} />,
              autoresp: <AutoResponsePage colors={c} darkMode={darkMode} />,
              office: <OfficeHoursPage colors={c} darkMode={darkMode} />,
              system: <SystemPage colors={c} darkMode={darkMode} />,
              adduser: isAdmin ? (
                <AddUserPage colors={c} />
              ) : (
                <div style={{ color: c.red, fontWeight: 700, padding: 48, textAlign: "center" }}>
                  You do not have access to this section.
                </div>
              ),
            }[section] || (
              <div style={{ color: c.red, fontWeight: 700, padding: 48, textAlign: "center" }}>
                Invalid section
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
