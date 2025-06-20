export default function Login({ onLogin }) {
  return (
    <div style={{ padding: 60 }}>
      <h2>Test Login</h2>
      <button onClick={() => onLogin({ username: "admin", role: "admin" })}>
        Login as admin
      </button>
    </div>
  );
}
