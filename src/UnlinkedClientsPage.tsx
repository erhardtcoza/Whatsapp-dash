
type Props = {
  colors: any;
  onSelectChat: (chat: any) => void;
  selectedChat?: any;
};

export default function UnlinkedClientsPage({ colors }: Props) {
  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ color: colors.text, fontWeight: 600, fontSize: 22, marginBottom: 18 }}>
        Unlinked Clients
      </h2>
      <div style={{ color: colors.sub }}>
        (No unlinked clients yet. This is a placeholder page.)
      </div>
    </div>
  );
}
