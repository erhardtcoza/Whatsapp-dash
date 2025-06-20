import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "";

export default function Login({ onLogin, colors }: any) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(e: any) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const res = await fetch(`${API_BASE}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      const user = await res.json();
      onLogin(user);
    } else {
      setErr("Invalid login.");
    }
    setLoading(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: colors.bg,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form
        onSubmit={login}
        style={{
          background: colors.card,
          padding: 48,
          borderRadius: 16,
          minWidth: 340,
          boxShadow: "0 2px 20px #0002",
          color: colors.text,
        }}
      >
        <h2
          style={{
            color: colors.red,
            fontWeight: 900,
            marginBottom: 30,
            fontSize: 28,
            textAlign: "center",
            letterSpacing: 1,
          }}
        >
          Vinet WhatsApp Portal
        </h2>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
          required
          style={{
            width: "100%",
            padding: 12,
            fontSize: 16,
            borderRadius: 6,
            border: `1.3px solid ${colors.border}`,
            marginBottom: 15,
            background: colors.input,
            color: colors.inputText,
          }}
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          required
          style={{
            width: "100%",
            padding: 12,
            fontSize: 16,
            borderRadius: 6,
            border: `1.3px solid ${colors.border}`,
            marginBottom: 15,
            background: colors.input,
            color: colors.inputText,
          }}
        />
        {err && (
          <div style={{ color: colors.red, marginBottom: 12 }}>{err}</div>
        )}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            background: colors.red,
            color: "#fff",
            border: "none",
            borderRadius: 7,
            padding: "12px 0",
            fontWeight: 700,
            fontSize: 17,
            letterSpacing: 0.3,
            marginTop: 3,
            cursor: "pointer",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
