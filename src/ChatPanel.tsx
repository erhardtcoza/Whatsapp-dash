type Props = {
  chat: any;
  colors: any;
  onClose: () => void;
};

export default function ChatPanel({ chat, colors, onClose }: Props) {
  if (!chat) return null;
  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ color: colors.red, fontWeight: 600, fontSize: 22 }}>
        Chat with {chat.name || chat.from_number}
      </h2>
      <button
        onClick={onClose}
        style={{
          marginTop: 16,
          background: colors.red,
          color: "#fff",
          border: "none",
          borderRadius: 6,
          padding: "7px 18px",
          fontWeight: 700,
          fontSize: 15,
          cursor: "pointer",
        }}
      >
        Close
      </button>
      <div style={{ marginTop: 24, color: colors.sub }}>
        (Chat messages and reply box coming soon.)
      </div>
    </div>
  );
}
