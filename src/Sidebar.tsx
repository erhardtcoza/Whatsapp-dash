import vinetLogo from "./assets/logo.jpeg";

export default function Sidebar({
  selected,
  onSelect,
  colors,
  search,
  setSearch,
}: any) {
  return (
    <div
      style={{
        width: 190,
        height: "100vh",
        background: colors.sidebar,
        borderRight: `1.5px solid ${colors.border}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 20,
      }}
    >
      <div style={{ padding: "0 12px 18px 22px" }}>
        <img
          src={vinetLogo}
          alt="Vinet"
          style={{ width: 80, marginBottom: 6 }}
        />
      </div>

      <SidebarItem
        label="All Chats"
        icon="💬"
        selected={selected === "allchats"}
        onClick={() => onSelect("allchats")}
      />
      <SidebarItem
        label="Unverified"
        icon="🔗"
        selected={selected === "unverified"}
        onClick={() => onSelect("unverified")}
      />
      <SidebarItem
        label="Support"
        icon="🛠️"
        selected={selected === "support"}
        onClick={() => onSelect("support")}
      />
      <SidebarItem
        label="Accounts"
        icon="💳"
        selected={selected === "accounts"}
        onClick={() => onSelect("accounts")}
      />
      <SidebarItem
        label="Sales"
        icon="💼"
        selected={selected === "sales"}
        onClick={() => onSelect("sales")}
      />
      <SidebarItem
        label="Leads"
        icon="📈"
        selected={selected === "leads"}
        onClick={() => onSelect("leads")}
      />
      <SidebarItem
        label="Add User"
        icon="➕"
        selected={selected === "adduser"}
        onClick={() => onSelect("adduser")}
      />
      <SidebarItem
        label="Office Hours"
        icon="⏰"
        selected={selected === "office"}
        onClick={() => onSelect("office")}
      />

      <div style={{ flex: 1 }} />

      <div style={{ padding: 12 }}>
        <input
          type="search"
          placeholder="Search…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: "100%",
            borderRadius: 7,
            border: `1.3px solid ${colors.border}`,
            padding: "6px 10px",
            background: colors.input,
            color: colors.inputText,
            fontSize: 14,
          }}
        />
      </div>
    </div>
  );
}

function SidebarItem({ label, icon, selected, onClick }: any) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "8px 14px 8px 22px",
        fontWeight: 500,
        fontSize: 15,
        color: selected ? "#fff" : "#23262b",
        background: selected ? "#e2001a" : "none",
        borderRadius: 8,
        marginBottom: 1,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
      }}
    >
      <span style={{ marginRight: 10, fontSize: 17 }}>{icon}</span>
      {label}
    </div>
  );
}
