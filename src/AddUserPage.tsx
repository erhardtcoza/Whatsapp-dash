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
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }

  useEffect(() => { 
    loadUsers(); 
  }, []);

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
          setUsername(""); 
          setPassword(""); 
          setRole("user");
          loadUsers();
        } else {
          setErr(r.error || "Failed to add user.");
        }
      })
      .catch(() => setErr("Failed to add user."));
  }

  function handleDelete(username: string) {
    if (!window.confirm("Delete user?")) return;
    fetch(`${API_BASE}/api/delete-admin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username })
    }).then(() => loadUsers());
  }

  return (
    <div style={{ marginTop: 20, maxWidth: 400 }}>
      <form 
        onSubmit={handleSubmit} 
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
      >
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
          style={{
            borderRadius: 7,
            border: `1.2px solid ${colors.border}`,
            padding: "10px 12px",
            fontSize: 15
          }}
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          style={{
            borderRadius: 7,
            border: `1.2px solid ${colors.border}`,
            padding: "10px 12px",
            fontSize: 15
          }}
        />
        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          style={{
            borderRadius: 7,
            border: `1.2px solid ${colors.border}`,
            padding: "10px 12px",
            fontSize: 15,
            background: colors.input,
            color: colors.inputText
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
            borderRadius: 7,
            padding: "10px 0",
            fontWeight: 700,
            cursor: "pointer"
          }}
        >
          Add User
        </button>
        {err && (
          <div style={{ color: colors.red, fontWeight: 500 }}>
            {err}
          </div>
        )}
      </form>

      <div style={{ fontWeight: 500, fontSize: 18, marginTop: 30, marginBottom: 10, color: colors.text }}>
        Current Users
      </div>

      {loading ? (
        <div style={{ color: colors.sub, padding: "12px 0" }}>Loading...</div>
      ) : (
        <table style={{ width: "100%", background: colors.card, borderRadius: 10, boxShadow: "0 2px 10px #0001" }}>
          <thead>
            <tr style={{ background: colors.bg, color: colors.sub }}>
              <th style={{ textAlign: "left", padding: "10px 14px" }}>Username</th>
              <th style={{ textAlign: "left", padding: "10px 14px" }}>Role</th>
              <th style={{ padding: "10px 14px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u: any) => (
              <tr key={u.username}>
                <td style={{ padding: "10px 14px", color: colors.text }}>{u.username}</td>
                <td style={{ padding: "10px 14px", color: colors.text }}>{u.role}</td>
                <td style={{ padding: "10px 14px" }}>
                  <button
                    onClick={() => handleDelete(u.username)}
                    style={{
                      background: colors.red,
                      color: "#fff",
                      border: "none",
                      borderRadius: 7,
                      padding: "6px 12px",
                      fontWeight: 700,
                      fontSize: 13,
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
