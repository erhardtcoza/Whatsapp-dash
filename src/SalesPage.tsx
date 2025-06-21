type Props = { colors: any; darkMode: boolean };
export default function SalesPage({ colors }: Props) {
  return (
    <div style={{
      color: colors.text,
      minHeight: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      SalesPage section coming soon.
    </div>
  );
}
