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
    }).then(() => loadUsers());
  }

  return (
    <div style={{ marginTop: 20 }}>
      <form onSubmit={handleSubmit} style={{ maxWidth: 360, gap: 14, display: "flex", flexDirection: "column" }}>
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" />
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" style={{ background: colors.red, color: "#fff" }}>Add User</button>
      </form>
      {err && <div style={{ color: colors.red }}>{err}</div>}
    </div>
  );
}
