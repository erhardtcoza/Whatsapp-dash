import { useEffect, useState } from "react";
import { API_BASE } from "./config";

interface User {
  id: number;
  username: string;
  role: string;
}

export default function AddUserPage({ colors }: any) {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({ username: "", password: "", role: "user" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchUsers(); }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/users`);
      setUsers(await res.json());
    } catch {
      setMessage("Error fetching users.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e: any) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/add-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setForm({ username: "", password: "", role: "user" });
      setMessage("User added successfully.");
      fetchUsers();
    } catch {
      setMessage("Error adding user.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this user?")) return;
    setSaving(true);
    try {
      await fetch(`${API_BASE}/api/delete-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setMessage("User deleted.");
      fetchUsers();
    } catch {
      setMessage("Error deleting user.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ color: colors.text, fontWeight: 600, fontSize: 22, marginBottom: 18 }}>
        User Management
      </h2>

      {/* Add user form */}
      <div style={{ marginBottom: 30 }}>
        <form onSubmit={handleAdd} style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            required
            style={{ padding: "6px 10px", borderRadius: 7, border: `1px solid ${colors.border}`, fontSize: 15 }}
            onChange={e => setForm({ ...form, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            required
            style={{ padding: "6px 10px", borderRadius: 7, border: `1px solid ${colors.border}`, fontSize: 15 }}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
          <select
            value={form.role}
            style={{ padding: "6px 10px", borderRadius: 7, border: `1px solid ${colors.border}`, fontSize: 15 }}
            onChange={e => setForm({ ...form, role: e.target.value })}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            disabled={saving}
            style={{
              background: colors.red, color: "#fff", borderRadius: 8, padding: "7px 16px",
              fontWeight: "bold", fontSize: 15, cursor: "pointer", border: "none"
            }}
          >
            {saving ? "Saving..." : "Add User"}
          </button>
        </form>
        {message && (
          <div style={{ color: colors.red, fontWeight: 600, marginTop: 12 }}>
            {message}
          </div>
        )}
      </div>

      {/* Users Table */}
      {loading ? (
        <div style={{ color: colors.sub }}>Loading users…</div>
      ) : (
        <table style={{ width: "100%", background: colors.card, borderRadius: 10 }}>
          <thead>
            <tr style={{ background: colors.bg, color: colors.sub }}>
              <th style={{ textAlign: "left", padding: "8px 10px" }}>Username</th>
              <th style={{ textAlign: "left", padding: "8px 10px" }}>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td style={{ padding: "8px 10px" }}>{user.username}</td>
                <td style={{ padding: "8px 10px" }}>{user.role}</td>
                <td>
                  <button
                    onClick={() => handleDelete(user.id)}
                    disabled={saving}
                    style={{
                      background: colors.red, color: "#fff", borderRadius: 7,
                      fontWeight: 700, fontSize: 14, padding: "4px 12px",
                      cursor: "pointer", border: "none"
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
