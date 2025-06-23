
type Props = {
  chat: any;
  colors: any;
  onClose: () => void;
};

export default function ChatPanel({ chat, colors, onClose }: Props) {
  if (!chat) return null;

  return (
    <div style={{ padding: 32, minHeight: 300 }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 18 }}>
        <h2 style={{ color: colors.red, fontWeight: 700, fontSize: 22, flex: 1 }}>
          Chat: {chat.name || chat.from_number}
        </h2>
        <button
          style={{
            background: colors.red,
            color: "#fff",
            border: "none",
            borderRadius: 7,
            padding: "8px 18px",
            fontWeight: 600,
            fontSize: 15,
            marginLeft: 10,
            cursor: "pointer"
          }}
          onClick={onClose}
        >
          Close
        </button>
      </div>

      <div style={{
        background: colors.bg,
        borderRadius: 8,
        minHeight: 200,
        padding: 24,
        color: colors.text,
        marginBottom: 12,
        boxShadow: "0 1px 6px #0001"
      }}>
        {/* You will load and render the actual messages here in future */}
        <div>
          <strong>Client:</strong> {chat.from_number}
        </div>
        <div>
          <strong>Name:</strong> {chat.name || <span style={{ color: colors.sub }}>N/A</span>}
        </div>
        <div>
          <strong>Email:</strong> {chat.email || <span style={{ color: colors.sub }}>N/A</span>}
        </div>
        <div>
          <strong>Tag:</strong> {chat.tag || <span style={{ color: colors.sub }}>N/A</span>}
        </div>
        <div style={{ marginTop: 24, color: colors.sub }}>
          (Chat messages will display here. Coming soon.)
        </div>
      </div>
    </div>
  );
}
