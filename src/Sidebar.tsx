import vinetLogo from "./assets/logo.jpeg";

interface SidebarProps {
  selected: string;
  onSelect: (val: string) => void;
  colors: any;
  search: string;
  setSearch: (val: string) => void;
}

export default function Sidebar({
  selected,
  onSelect,
  colors,
  search,
  setSearch,
}: SidebarProps) {
  const menuItems = [
    { label: "All Chats", icon: "💬", key: "allchats" },
    { label: "Unverified", icon: "🔗", key: "unverified" },
    { label: "Support", icon: "🛠️", key: "support" },
    { label: "Accounts", icon: "💳", key: "accounts" },
    { label: "Sales", icon: "💼", key: "sales" },
    { label: "Leads", icon: "📈", key: "leads" },
    { label: "Add User", icon: "➕", key: "adduser" },
    { label: "Office Hours", icon: "⏰", key: "office" },
  ];

  return (
    <div
      style={{
        width: 190,
        height: "100vh",
        background: colors.sidebar,
        borderRight: `1.5px solid ${colors.border}`,
        display: "flex",
        flexDirection: "column",
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

      {menuItems.map(item => (
        <SidebarItem
          key={item.key}
          label={item.label}
          icon={item.icon}
          selected={selected === item.key}
          onClick={() => onSelect(item.key)}
        />
      ))}

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

function SidebarItem({
  label,
  icon,
  selected,
  onClick,
}: {
  label: string;
  icon: string;
  selected: boolean;
  onClick: () => void;
}) {
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
