// src/Sidebar.tsx

const sections = [
  { label: "Chats", key: "chats" },
  { label: "Leads", key: "leads" },
  { label: "Customers", key: "customers" },
  { label: "Support", key: "support" },
  // Add more as needed
];

export default function Sidebar({ selected, onSelect }: { selected: string; onSelect: (key: string) => void }) {
  return (
    <div style={{
      width: 200,
      background: "#f7f7fa",
      borderRight: "1.5px solid #eee",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      position: "fixed",
      top: 0, left: 0, bottom: 0,
      zIndex: 20,
    }}>
      <img
        src="https://static.vinet.co.za/logo.jpeg"
        alt="Vinet"
        style={{
          height: 50, margin: "20px auto 14px auto", display: "block"
        }}
      />
      {sections.map((sec) => (
        <button
          key={sec.key}
          onClick={() => onSelect(sec.key)}
          style={{
            background: selected === sec.key ? "#e2001a" : "transparent",
            color: selected === sec.key ? "#fff" : "#223",
            border: "none",
            borderRadius: 7,
            margin: "2px 14px",
            padding: "11px 15px",
            textAlign: "left",
            fontWeight: selected === sec.key ? 700 : 400,
            fontSize: 16,
            cursor: "pointer",
            transition: "background 0.15s",
          }}
        >
          {sec.label}
        </button>
      ))}
    </div>
  );
}
