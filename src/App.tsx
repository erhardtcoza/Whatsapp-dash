import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Login from "./Login";
import AllChatsPage from "./AllChatsPage";
import ChatPanel from "./ChatPanel";
import AddUserPage from "./AddUserPage";
import OfficeHoursPage from "./OfficeHoursPage";

const colors = {
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
};

export default function App() {
  const [selected, setSelected] = useState("allchats");
  const [search, setSearch] = useState("");
  const [loggedIn, setLoggedIn] = useState(true); // Adjust login logic as needed

  if (!loggedIn) return <Login setLoggedIn={setLoggedIn} colors={colors} />;

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        selected={selected}
        onSelect={setSelected}
        colors={colors}
        search={search}
        setSearch={setSearch}
      />

      <div style={{ marginLeft: 190, flex: 1, overflowY: "auto", background: colors.bg }}>
        {selected === "allchats" && <AllChatsPage colors={colors} />}
        {selected === "unverified" && <AllChatsPage tag="unverified" colors={colors} />}
        {selected === "support" && <AllChatsPage tag="support" colors={colors} />}
        {selected === "accounts" && <AllChatsPage tag="accounts" colors={colors} />}
        {selected === "sales" && <AllChatsPage tag="sales" colors={colors} />}
        {selected === "leads" && <AllChatsPage tag="lead" colors={colors} />}
        {selected === "adduser" && <AddUserPage colors={colors} />}
        {selected === "office" && <OfficeHoursPage colors={colors} />}
      </div>
    </div>
  );
}
