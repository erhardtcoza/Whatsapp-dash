import vinetLogo from "./assets/logo.jpeg"; // Use your logo asset

export default function Sidebar({
  selected, onSelect, darkMode, colors, user, search, setSearch, onDarkMode,
}: any) {
  return (
    <div
      style={{
        width: 220,
        minHeight: "100vh",
        background: colors.sidebar,
        borderRight: `1.5px solid ${colors.border}`,
        display: "flex",
        flexDirection: "column",
        paddingTop: 20,
        alignItems: "flex-start",
      }}
    >
      {/* Logo */}
      <div style={{ padding: "0 0 22px 28px" }}>
        <img
          src={vinetLogo}
          alt="Vinet"
          style={{
            width: 90,
            marginBottom: 4,
            filter: darkMode ? "brightness(0.86)" : "none",
          }}
        />
      </div>

      {/* Menu */}
      <SidebarItem
        label="Unlinked Clients"
        icon={<span style={{fontSize:18}}>🔗</span>}
        selected={selected === "unlinked"}
        onClick={() => onSelect("unlinked")}
      />

      <SidebarSectionSpacer />

      {(user?.role === "admin" || user?.role === "support") && (
        <SidebarItem
          label="Support"
          icon={<span style={{fontSize:18}}>🛠️</span>}
          selected={selected === "support"}
          onClick={() => onSelect("support")}
        />
      )}
      {(user?.role === "admin" || user?.role === "accounts") && (
        <SidebarItem
          label="Accounts"
          icon={<span style={{fontSize:18}}>💳</span>}
          selected={selected === "accounts"}
          onClick={() => onSelect("accounts")}
        />
      )}
      {(user?.role === "admin" || user?.role === "sales") && (
        <>
          <SidebarItem
            label="Sales"
            icon={<span style={{fontSize:18}}>💼</span>}
            selected={selected === "sales"}
            onClick={() => onSelect("sales")}
          />
          <SidebarItem
            label="Leads"
            icon={<span style={{fontSize:18}}>📈</span>}
            selected={selected === "leads"}
            onClick={() => onSelect("leads")}
          />
        </>
      )}

      {/* Admin-only */}
      {user?.role === "admin" && (
        <>
          <SidebarItem
            label="Broadcast"
            icon={<span style={{fontSize:18}}>📢</span>}
            selected={selected === "broadcast"}
            onClick={() => onSelect("broadcast")}
          />
          <SidebarItem
            label="Auto Response"
            icon={<span style={{fontSize:18}}>⚡️</span>}
            selected={selected === "autoresp"}
            onClick={() => onSelect("autoresp")}
          />
          <SidebarItem
            label="Office Hours"
            icon={<span style={{fontSize:18}}>⏰</span>}
            selected={selected === "office"}
            onClick={() => onSelect("office")}
          />
          <SidebarItem
            label="System"
            icon={<span style={{fontSize:18}}>🛠️</span>}
            selected={selected === "system"}
            onClick={() => onSelect("system")}
          />
          <SidebarItem
            label="Add User"
            icon={<span style={{fontSize:18}}>➕</span>}
            selected={selected === "adduser"}
            onClick={() => onSelect("adduser")}
          />
        </>
      )}

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Search and dark mode */}
      <div style={{ padding: 18, width: "100%" }}>
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
            marginBottom: 12,
            outline: "none",
            boxSizing: "border-box",
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

function SidebarSectionSpacer() {
  return <div style={{ height: 16 }} />;
}

function SidebarItem({ label, icon, selected, onClick }: any) {
  return (
    <div
      onClick={onClick}
      style={{
        width: "100%",
        padding: "11px 16px 11px 26px",
        fontWeight: 500,
        fontSize: 16,
        color: selected ? "#fff" : "#23262b",
        background: selected ? "#e2001a" : "none",
        borderRadius: 9,
        marginBottom: 1,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 10,
        transition: "background 0.2s, color 0.2s",
      }}
    >
      <span style={{ marginRight: 10 }}>{icon}</span>
      {label}
    </div>
  );
}
