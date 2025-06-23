import vinetLogo from "./assets/logo.jpeg";

type Props = {
  selected: string;
  onSelect: (section: string) => void;
  colors: any;
  user: any;
  search: string;
  setSearch: (v: string) => void;
};

export default function Sidebar({
  selected,
  onSelect,
  colors,
  user,
  search,
  setSearch,
}: Props) {
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
      <div style={{ padding: "0 12px 18px 22px" }}>
        <img
          src={vinetLogo}
          alt="Vinet"
          style={{
            width: 80,
            marginBottom: 6,
            filter: "none",
          }}
        />
      </div>
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
