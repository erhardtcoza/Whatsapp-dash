type Props = { colors: any; darkMode: boolean };
export default function AccountsPage({ colors, darkMode }: Props) {
  return (
    <div style={{
      color: colors.text,
      minHeight: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      AccountsPage section coming soon.
    </div>
  );
}
