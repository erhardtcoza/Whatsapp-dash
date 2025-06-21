type Props = { colors: any; darkMode: boolean };
export default function SupportPage({ colors }: Props) {
  return (
    <div style={{
      color: colors.text,
      minHeight: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      Support section coming soon.
    </div>
  );
}
