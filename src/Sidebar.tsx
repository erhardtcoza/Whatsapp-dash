import vinetLogo from "./assets/logo.jpeg";

export default function Sidebar({
  selected,
  onSelect,
  darkMode,
  colors,
  search,
  setSearch,
  onDarkMode,
  user,
  onLogout
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
      {/* Logo */}
      <div style={{ padding: "0 12px 10px 22px" }}>
        <img
          src={vinetLogo}
          alt="Vinet"
          style={{
            width: 80,
            marginBottom: 6,
            filter: darkMode ? "brightness(0.86)" : "none",
          }}
        />
      </div>
      {/* Username/role */}
      {user && (
        <div style={{
          color: colors.sub,
          fontSize: 14,
          padding: "6px 14px 2px 24px",
          fontWeight: 500,
          marginBottom: 6,
        }}>
          {user.username} ({user.role})
        </div>
      )}
      {/* Menu */}
      <SidebarItem
        label="Unlinked Clients"
        icon="🔗"
        selected={selected === "unlinked"}
        onClick={() => onSelect("unlinked")}
      />
      <SidebarItem
        label="All Chats"
        icon="💬"
        selected={selected === "allchats"}
        onClick={() => onSelect("allchats")}
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
        label="Broadcast"
        icon="📢"
        selected={selected === "broadcast"}
        onClick={() => onSelect("broadcast")}
      />
      <SidebarItem
        label="Auto Response"
        icon="⚡️"
        selected={selected === "autoresp"}
        onClick={() => onSelect("autoresp")}
      />
      <SidebarItem
        label="Office Hours"
        icon="⏰"
        selected={selected === "office"}
        onClick={() => onSelect("office")}
      />
      <SidebarItem
        label="System"
        icon="🛠️"
        selected={selected === "system"}
        onClick={() => onSelect("system")}
      />
      <SidebarItem
        label="Add User"
        icon="➕"
        selected={selected === "adduser"}
        onClick={() => onSelect("adduser")}
      />
      {/* Spacer */}
      <div style={{ flex: 1 }} />
      {/* Search */}
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
            marginBottom: 9,
          }}
        />
        {/* Logout */}
        {user && (
          <button
            onClick={onLogout}
            style={{
              width: "100%",
              background: colors.red,
              color: "#fff",
              border: "none",
              borderRadius: 7,
              padding: "9px 0",
              fontWeight: 700,
              fontSize: 15,
              margin: "10px 0 0 0",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        )}
        {/* Dark mode toggle */}
        <button
          onClick={onDarkMode}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          style={{
            width: "100%",
            background: colors.red,
            color: "#fff",
            border: "none",
            borderRadius: 7,
            padding: "7px 0",
            fontWeight: 700,
            fontSize: 14,
            marginTop: 10,
            cursor: "pointer",
          }}
        >
          {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
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
        color: selected ? "#fff" : undefined,
        background: selected ? "#e2001a" : "none",
        borderRadius: 8,
        marginBottom: 1,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        position: "relative",
      }}
    >
      <span style={{ marginRight: 10, fontSize: 17 }}>{icon}</span>
      {label}
    </div>
  );
}
