type LoginProps = {
  onLogin: (user: any) => void;
  colors?: any;
};

export default function Login({ onLogin, colors }: LoginProps) {
  return (
    <div style={{ padding: 60, background: colors?.bg || "#fff" }}>
      <h2 style={{ color: colors?.red || "#e2001a" }}>Test Login</h2>
      <button
        style={{
          background: colors?.red || "#e2001a",
          color: "#fff",
          border: "none",
          borderRadius: 7,
          padding: "10px 18px",
          fontSize: 16,
        }}
        onClick={() => onLogin({ username: "admin", role: "admin" })}
      >
        Login as admin
      </button>
    </div>
  );
}
