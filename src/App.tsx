import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Login from "./Login";
import UnlinkedClientsPage from "./UnlinkedClientsPage";
import AllChatsPage from "./AllChatsPage";
import ChatPanel from "./ChatPanel";

export default function App() {
  useEffect(() => { document.title = "Vinet WhatsApp Portal"; }, []);

  // Color palette
  const c = {
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
  const [selectedChat, setSelectedChat] = useState<any>(null);

  // Top bar
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
          {user?.username} ({user?.role})
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

  if (!user) {
    return <Login onLogin={handleLoginSuccess} colors={c} />;
  }

  // Main section content
  let content: JSX.Element | null = null;
  if (section === "unlinked") {
    content = (
      <UnlinkedClientsPage
        colors={c}
      />
    );
  } else if (section === "allchats") {
    content = (
      <AllChatsPage
        colors={c}
        onSelectChat={setSelectedChat}
        selectedChat={selectedChat}
      />
    );
  } else {
    content = (
      <div style={{ padding: 40, color: c.text }}>
        {section[0].toUpperCase() + section.slice(1)} section coming soon.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: c.bg }}>
      <Sidebar
        selected={section}
        onSelect={s => {
          setSection(s);
          setSelectedChat(null);
        }}
        colors={c}
        user={user}
        search={search}
        setSearch={setSearch}
      />
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: c.bg,
        marginLeft: 190,
      }}>
        {topBar}
        <div
          style={{
            flex: 1,
            width: "96%",
            maxWidth: 980,
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
              onClose={() => setSelectedChat(null)}
            />
          ) : (
            content
          )}
        </div>
      </div>
    </div>
  );
}
