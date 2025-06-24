type Props = { colors: any; darkMode: boolean };
export default function LeadsPage({ colors }: Props) {
  return (
    <div style={{
      color: colors.text,
      minHeight: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      LeadsPage section coming soon.
    </div>
  );
}
