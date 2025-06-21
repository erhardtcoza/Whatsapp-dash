type Props = { colors: any; darkMode: boolean };
export default function SystemPage({ colors, darkMode }: Props) {
  return (
    <div style={{
      color: colors.text,
      minHeight: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      SystemPage section coming soon.
    </div>
  );
}
