import vinetLogo from "./assets/logo.jpeg"; // Use your logo asset

export default function Sidebar(props) ({
  selected, onSelect, darkMode, colors, user, search, setSearch, onDarkMode,
}: any) {
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

      {/* Menu */}
      {user?.role === "admin" && (
        <SidebarItem label="Unlinked Clients" icon="🔗" selected={selected === "unlinked"} onClick={() => onSelect("unlinked")} style={{ marginBottom: 12 }} />
      )}
      {(user?.role === "admin" || user?.role === "support") && (
        <SidebarItem label="Support" icon="🛠️" selected={selected === "support"} onClick={() => onSelect("support")} />
      )}
      {(user?.role === "admin" || user?.role === "accounts") && (
        <SidebarItem label="Accounts" icon="💳" selected={selected === "accounts"} onClick={() => onSelect("accounts")} />
      )}
      {(user?.role === "admin" || user?.role === "sales") && (
        <>
          <SidebarItem label="Sales" icon="💼" selected={selected === "sales"} onClick={() => onSelect("sales")} />
          <SidebarItem label="Leads" icon="📈" selected={selected === "leads"} onClick={() => onSelect("leads")} />
        </>
      )}
      {/* Admin-only */}
      {user?.role === "admin" && (
        <>
          <SidebarItem label="Broadcast" icon="📢" selected={selected === "broadcast"} onClick={() => onSelect("broadcast")} />
          <SidebarItem label="Auto Response" icon="⚡️" selected={selected === "autoresp"} onClick={() => onSelect("autoresp")} />
          <SidebarItem label="Office Hours" icon="⏰" selected={selected === "office"} onClick={() => onSelect("office")} />
          <SidebarItem label="System" icon="🛠️" selected={selected === "system"} onClick={() => onSelect("system")} />
          <SidebarItem label="Add User" icon="➕" selected={selected === "adduser"} onClick={() => onSelect("adduser")} />
        </>
      )}

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Search and dark mode */}
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

function SidebarItem({ label, icon, selected, onClick, style }: any) {
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
    </div>
  );
}
