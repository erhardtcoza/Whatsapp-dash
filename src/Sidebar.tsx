import vinetLogo from "./assets/logo.jpeg";

interface SidebarProps {
  selected: string;
  onSelect: (val: string) => void;
  colors: any;
  search: string;
  setSearch: (val: string) => void;
  darkMode: boolean;
  user: { username: string; role: string };
  onLogout: () => void;
  onDarkMode: () => void;
}

export default function Sidebar({
  selected,
  onSelect,
  colors,
  search,
  setSearch,
  darkMode,
  user,
  onLogout,
  onDarkMode,
}: SidebarProps) {
  // Menu structure with spacers as null
  const menuItems = [
    { label: "Unlinked Chats", icon: "🔗", key: "unlinked" },
    { label: "All Chats", icon: "💬", key: "allchats" },
    null,
    { label: "New Message", icon: "✉️", key: "send" },
    null,
    { label: "Leads", icon: "📈", key: "leads" },
    { label: "Sales", icon: "💼", key: "sales" },
    null,
    { label: "Accounts", icon: "💳", key: "accounts" },
    null,
    { label: "Support", icon: "🛠️", key: "support" },
    null, null, null,
    { label: "Auto Response", icon: "🤖", key: "autoresp" },
    { label: "Office Hours", icon: "⏰", key: "office" },
    { label: "System", icon: "⚙️", key: "system" },
    ...(user.role === "admin" ? [{ label: "Add User", icon: "➕", key: "adduser" }] : []),
  ];

  return (
    <div style={{
      width: 190, height: "100vh", background: colors.sidebar,
      borderRight: `1.5px solid ${colors.border}`, display: "flex",
      flexDirection: "column", position: "fixed", left: 0, top: 0, zIndex: 20
    }}>
      <div style={{ padding: "0 12px 18px 22px" }}>
        <img src={vinetLogo} alt="Vinet" style={{ width: 160, marginBottom: 6 }} />
      </div>
      {menuItems.map((item, idx) =>
        item ? (
          <SidebarItem
            key={item.key}
            label={item.label}
            icon={item.icon}
            selected={selected === item.key}
            onClick={() => onSelect(item.key)}
          />
        ) : (
          // Spacer
          <div key={"spacer-" + idx} style={{ height: 12 }} />
        )
      )}
      <div style={{ flex: 1 }} />
      <div style={{ padding: 12 }}>
        <input
          type="search"
          placeholder="Search…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: "100%", borderRadius: 7,
            border: `1.3px solid ${colors.border}`, padding: "6px 10px",
            background: colors.input, color: colors.inputText, fontSize: 14,
          }}
        />
      </div>
      <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 6 }}>
        <button onClick={onDarkMode} style={{
          background: "none", color: colors.sidebarTxt,
          border: `1px solid ${colors.border}`, borderRadius: 6,
          padding: "5px 10px", fontSize: 13, cursor: "pointer"
        }}>
          {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>
        <button onClick={onLogout} style={{
          background: colors.red, color: "#fff", border: "none",
          borderRadius: 6, padding: "6px 10px", fontWeight: 600,
          fontSize: 13, cursor: "pointer"
        }}>
          Logout
        </button>
      </div>
    </div>
  );
}

function SidebarItem({
  label, icon, selected, onClick,
}: { label: string; icon: string; selected: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "8px 14px 8px 22px", fontWeight: 500, fontSize: 15,
        color: selected ? "#fff" : "#23262b",
        background: selected ? "#e2001a" : "none",
        borderRadius: 8, marginBottom: 1, cursor: "pointer",
        display: "flex", alignItems: "center",
      }}
    >
      <span style={{ marginRight: 10, fontSize: 17 }}>{icon}</span>
      {label}
    </div>
  );
}
