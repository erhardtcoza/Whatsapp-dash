import { useState } from "react";
import Sidebar from "./Sidebar";
import Login from "./Login";
import AllChatsPage from "./AllChatsPage";
import ChatPanel from "./ChatPanel";

export default function App() {
  // ...your existing color/theme/user code...

  const [section, setSection] = useState("allchats");
  const [search, setSearch] = useState("");
  const [selectedChat, setSelectedChat] = useState<any>(null);

  // ...your top bar, user auth logic, etc...

  let content = null;
  if (!user) {
    content = <Login onLogin={handleLoginSuccess} colors={c} />;
  } else if (selectedChat) {
    content = (
      <ChatPanel
        chat={selectedChat}
        colors={c}
        onClose={() => setSelectedChat(null)}
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
    // ...other sections if you have
    content = <div style={{ padding: 40, color: c.text }}>Section coming soon.</div>;
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
        {/* TopBar here */}
        {content}
      </div>
    </div>
  );
}
