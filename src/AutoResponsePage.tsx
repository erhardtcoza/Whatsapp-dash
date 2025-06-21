type Props = { colors: any; darkMode: boolean };
export default function AutoResponsePage({ colors, darkMode }: Props) {
  return (
    <div style={{
      color: colors.text,
      minHeight: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      AutoResponsePage section coming soon.
    </div>
  );
}
