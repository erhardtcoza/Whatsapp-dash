// src/ChatPanel.tsx
type Props = {
  chat: any;
  colors: any;
  onClose: () => void;
};

export default function ChatPanel({ chat, colors, onClose }: Props) {
  if (!chat) return null;

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ color: colors.red, marginBottom: 20 }}>
        Chat with {chat.name || chat.from_number}
      </h2>
      <button
        style={{
          background: colors.red,
          color: "#fff",
          border: "none",
          borderRadius: 7,
          padding: "7px 14px",
          fontWeight: 700,
          marginBottom: 16,
        }}
        onClick={onClose}
      >
        Close
      </button>
      <div>
        {/* Add your message list, input, send button etc. here */}
        <div style={{ color: colors.text }}>Chat coming soon…</div>
      </div>
    </div>
  );
}
