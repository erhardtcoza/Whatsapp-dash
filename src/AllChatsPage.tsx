
type Props = {
  colors: any;
  onSelectChat: (chat: any) => void;
  selectedChat?: any;
};

export default function AllChatsPage({ colors, onSelectChat, selectedChat }: Props) {
  // Dummy content for now. Replace with real API/data as needed.
  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ color: colors.text, fontWeight: 600, fontSize: 22, marginBottom: 18 }}>
        All Chats
      </h2>
      <div style={{ color: colors.sub }}>
        (No chats yet. This is a placeholder page.)
      </div>
    </div>
  );
}
