import { useEffect, useState } from "react";
import { API_BASE } from "./config";

export default function AddUserPage({ colors }: any) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ username: "", password: "", role: "user" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  function fetchUsers() {
    setLoading(true);
    fetch(`${API_BASE}/api/users`)
      .then(res => res.json())
      .then(setUsers)
      .finally(() => setLoading(false));
  }

  async function handleAdd(e: any) {
    e.preventDefault();
    setMessage("");
    if (!form.username.trim() || !form.password.trim()) {
      setMessage("Username and password are required.");
      return;
    }
    await fetch(`${API_BASE}/api/add-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setForm({ username: "", password: "", role: "user" });
    setMessage("User added.");
    fetchUsers();
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this user?")) return;
    await fetch(`${API_BASE}/api/delete-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    setMessage("User deleted.");
    fetchUsers();
  }

  return (
    <div style={{ padding: "20px 0" }}>
      <form
        onSubmit={handleAdd}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          width: "100%",
          maxWidth: 400,
          marginBottom: 20
        }}
      >
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
          style={{
            borderRadius: 8,
            border: `1.3px solid ${colors.border}`,
            padding: "7px 12px",
            background: colors.input,
            color: colors.inputText,
            fontSize: 15,
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          style={{
            borderRadius: 8,
            border: `1.3px solid ${colors.border}`,
            padding: "7px 12px",
            background: colors.input,
            color: colors.inputText,
            fontSize: 15,
          }}
        />
        <select
          value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value })}
          style={{
            borderRadius: 8,
            border: `1.3px solid ${colors.border}`,
            padding: "7px 12px",
            background: colors.input,
            color: colors.inputText,
            fontSize: 15,
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
            padding: "10px 0",
            fontWeight: 700,
            fontSize: 15,
            cursor: "pointer",
          }}
        >
          Add User
        </button>
        {message && <div style={{ color: colors.red, fontWeight: 600 }}>{message}</div>}
      </form>

      <div style={{ fontWeight: 500, fontSize: 18, color: colors.text, marginBottom: 12 }}>
        Current Users
      </div>
      {loading ? (
        <div style={{ color: colors.sub }}>Loading…</div>
      ) : (
        <table style={{ width: "100%", background: colors.card, borderRadius: 10 }}>
          <thead>
            <tr style={{ color: colors.sub }}>
              <th style={{ textAlign: "left", padding: "8px 10px" }}>Username</th>
              <th style={{ textAlign: "left", padding: "8px 10px" }}>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td style={{ padding: "8px 10px", color: colors.text }}>{u.username}</td>
                <td style={{ padding: "8px 10px", color: colors.text }}>{u.role}</td>
                <td>
                  <button
                    onClick={() => handleDelete(u.id)}
                    style={{
                      background: colors.red,
                      color: "#fff",
                      border: "none",
                      borderRadius: 7,
                      fontWeight: 700,
                      fontSize: 14,
                      padding: "4px 12px",
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
