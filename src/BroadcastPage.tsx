type Props = { colors: any; darkMode: boolean };
export default function BroadcastPage({ colors, darkMode }: Props) {
  return (
    <div style={{
      color: colors.text,
      minHeight: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      BroadcastPage section coming soon.
    </div>
  );
}
