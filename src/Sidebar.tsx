import vinetLogo from "./assets/logo.jpeg"; // Save logo.jpeg to /src/assets

export default function Sidebar({
  selected,
  darkMode,
  counts = {},
  colors,
  onSearch,
  search,
  setSearch,
  onDarkMode,
}: any) {
  // "counts" = { sales: 0, accounts: 0, support: 0 }
  return (
    <div
      style={{
        width: 205,
        minHeight: "100vh",
        background: colors.sidebar,
        borderRight: `1.5px solid ${colors.border}`,
        display: "flex",
        flexDirection: "column",
        paddingTop: 16,
      }}
    >
      {/* Logo */}
      <div style={{ padding: "0 12px 20px 22px" }}>
        <img
          src={vinetLogo}
          alt="Vinet"
          style={{
            width: 88,
            marginBottom: 4,
            filter: darkMode ? "brightness(0.86)" : "none",
          }}
        />
      </div>

      {/* TOP: Main menu */}
      <SidebarItem
        label="New Chat"
        icon="✚"
        selected={selected === "newchat"}
        onClick={() => onSelect("newchat")}
        style={{ fontWeight: 700, color: colors.red, marginBottom: 3 }}
      />
      <SidebarItem
        label="Unlinked Clients"
        icon="🔗"
        selected={selected === "unlinked"}
        onClick={() => onSelect("unlinked")}
        style={{ marginBottom: 22 }}
      />

      {/* SALES/ACCOUNTS/SUPPORT */}
      <SidebarItem
        label="Sales"
        icon="💼"
        badge={counts.sales}
        selected={selected === "sales"}
        onClick={() => onSelect("sales")}
      />
      <SidebarItem
        label="Accounts"
        icon="💳"
        badge={counts.accounts}
        selected={selected === "accounts"}
        onClick={() => onSelect("accounts")}
      />
      <SidebarItem
        label="Support"
        icon="🛠️"
        badge={counts.support}
        selected={selected === "support"}
        onClick={() => onSelect("support")}
        style={{ marginBottom: 38 }}
      />

      {/* SECONDARY MENU */}
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
        label="Broadcast"
        icon="📢"
        selected={selected === "broadcast"}
        onClick={() => onSelect("broadcast")}
        style={{ marginBottom: 40 }}
      />

      {/* Divider */}
      <div style={{ height: 1, background: colors.border, margin: "18px 0 16px 0" }} />
      <SidebarItem
        label="System"
        icon="🛠️"
        selected={selected === "system"}
        onClick={() => onSelect("system")}
      />
      <SidebarItem
        label="PlaceHolder"
        icon="🔧"
        selected={selected === "ph1"}
        onClick={() => onSelect("ph1")}
      />
      <SidebarItem
        label="PlaceHolder"
        icon="🔧"
        selected={selected === "ph2"}
        onClick={() => onSelect("ph2")}
        style={{ marginBottom: 20 }}
      />

      {/* Spacer */}
      <div style={{ flex: 1 }} />
      {/* Search and darkmode at very bottom */}
      <div style={{ padding: 18 }}>
        <input
          type="search"
          placeholder="Search…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: "100%",
            borderRadius: 7,
            border: `1.3px solid ${colors.border}`,
            padding: "7px 13px",
            background: colors.input,
            color: colors.inputText,
            fontSize: 15,
            marginBottom: 10,
          }}
        />
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
            fontSize: 15,
            letterSpacing: 0.3,
            marginBottom: 5,
            marginTop: 3,
            cursor: "pointer",
          }}
        >
          {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      </div>
    </div>
  );
}

function SidebarItem({
  label,
  icon,
  badge,
  selected,
  onClick,
  style,
}: any) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "9px 16px 9px 24px",
        fontWeight: 500,
        fontSize: 16,
        color: selected ? "#fff" : undefined,
        background: selected ? "#e2001a" : "none",
        borderRadius: 9,
        marginBottom: 1,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        position: "relative",
        ...style,
      }}
    >
      <span style={{ marginRight: 14, fontSize: 16 }}>{icon}</span>
      {label}
      {badge > 0 && (
        <span
          style={{
            background: "#e2001a",
            color: "#fff",
            fontWeight: 700,
            borderRadius: 10,
            minWidth: 22,
            fontSize: 13,
            textAlign: "center",
            marginLeft: "auto",
            padding: "0 7px",
          }}
        >
          {badge}
        </span>
      )}
    </div>
  );
}
