import { useState, useEffect } from "react";
import { API_BASE } from "./config";

export default function AddUserPage({ colors }: any) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  function loadUsers() {
    setLoading(true);
    fetch(`${API_BASE}/api/admins`)
      .then(res => res.json())
      .then(data => { setUsers(data); setLoading(false); });
  }

  useEffect(() => { loadUsers(); }, []);

  function handleSubmit(e: any) {
    e.preventDefault();
    setErr("");
    fetch(`${API_BASE}/api/add-admin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, role })
    })
      .then(res => res.json())
      .then(r => {
        if (r.ok) {
          setUsername(""); setPassword(""); setRole("user");
          loadUsers();
        } else setErr(r.error || "Failed to add user.");
      })
      .catch(() => setErr("Failed to add user."));
  }

  function handleDelete(username: string) {
    if (!window.confirm("Delete user?")) return;
    fetch(`${API_BASE}/api/delete-admin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username })
    })
      .then(() => loadUsers());
  }

  return (
    <div>
      <div style={{
        fontWeight: 600,
        fontSize: 22,
        margin: "32px 0 24px 0",
        color: colors.text,
        letterSpacing: 0.02
      }}>
        Add User
      </div>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", maxWidth: 360, gap: 14 }}
      >
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{
            borderRadius: 7,
            border: `1.2px solid ${colors.border}`,
            padding: "9px 11px",
            fontSize: 16,
            marginBottom: 2
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{
            borderRadius: 7,
            border: `1.2px solid ${colors.border}`,
            padding: "9px 11px",
            fontSize: 16,
            marginBottom: 2
          }}
        />
        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          style={{
            borderRadius: 7,
            border: `1.2px solid ${colors.border}`,
            padding: "9px 11px",
            fontSize: 16,
            marginBottom: 2
          }}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          style={{
            background: colors.red,
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "11px 0",
            fontWeight: "bold",
            fontSize: 17,
            cursor: "pointer",
            marginTop: 6
          }}
        >
          Add User
        </button>
        {err && <div style={{ color: colors.red, fontWeight: 500, marginTop: 2 }}>{err}</div>}
      </form>
      <div style={{
        fontWeight: 500,
        fontSize: 18,
        margin: "34px 0 10px 0",
        color: colors.text
      }}>
        Current Users
      </div>
      {loading ? (
        <div style={{ color: colors.sub, padding: 18 }}>Loading...</div>
      ) : (
        <table style={{ width: "100%", maxWidth: 480 }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "7px 10px", color: colors.sub }}>Username</th>
              <th style={{ textAlign: "left", padding: "7px 10px", color: colors.sub }}>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u: any) => (
              <tr key={u.username}>
                <td style={{ padding: "7px 10px" }}>{u.username}</td>
                <td style={{ padding: "7px 10px" }}>{u.role}</td>
                <td style={{ padding: "7px 10px" }}>
                  <button
                    onClick={() => handleDelete(u.username)}
                    style={{
                      background: colors.red,
                      color: "#fff",
                      border: "none",
                      borderRadius: 7,
                      padding: "4px 14px",
                      fontWeight: 700,
                      fontSize: 14,
                      cursor: "pointer"
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
