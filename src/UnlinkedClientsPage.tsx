type Props = { colors: any; darkMode: boolean };
export default function UnlinkedClientsPage({ colors, darkMode }: Props) {
  return (
    <div style={{
      color: colors.text,
      minHeight: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      UnlinkedClientsPage section coming soon.
    </div>
  );
}
