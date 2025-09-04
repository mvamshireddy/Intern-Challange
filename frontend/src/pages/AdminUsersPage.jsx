import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import api from '../services/api';
import { theme } from '../services/theme'; // Corrected: Use named import

const Container = styled.div`
  background: ${theme.background};
  min-height: 100vh;
  padding: 2.5rem 0;
`;

const Card = styled.div`
  background: ${theme.card};
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(44,62,80,0.11);
  padding: 2rem 2.5rem;
  max-width: 900px;
  margin: 0 auto 2rem auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 1.05rem;
`;

const TH = styled.th`
  color: ${theme.primary};
  padding: 0.7rem 0.5rem;
  border-bottom: 2px solid ${theme.background};
  text-align: left;
  cursor: pointer;
`;

const TD = styled.td`
  padding: 0.6rem 0.5rem;
  border-bottom: 1.5px solid ${theme.background};
`;

const Input = styled.input`
  padding: 0.6rem 1rem;
  border-radius: 6px;
  border: 1.5px solid ${theme.border};
  font-size: 1rem;
  margin-right: 0.7rem;
`;

const Button = styled.button`
  background: ${theme.primary};
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.7rem 1.1rem;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 600;
  &:hover {
    background: ${theme.accent};
    color: ${theme.primary};
  }
`;

const Error = styled.div`
  color: ${theme.error};
  margin-bottom: 1rem;
`;

const Success = styled.div`
  color: ${theme.green};
  margin-bottom: 1rem;
`;

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState({ name: "", email: "", address: "", role: "" });
  const [sort, setSort] = useState({ field: "name", order: "ASC" });
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({ name: "", email: "", address: "", password: "", role: "user" });

  // Corrected: Memoize fetchUsers to safely use it as a dependency in useEffect
  const fetchUsers = useCallback(async () => {
    setErr("");
    let query = [];
    Object.entries(search).forEach(([k, v]) => v && query.push(`${k}=${encodeURIComponent(v)}`));
    query.push(`sort=${sort.field}`);
    query.push(`order=${sort.order}`);
    try {
      const { data } = await api.get("/users?" + query.join("&"));
      setUsers(data);
    } catch {
      setErr("Could not fetch users");
    }
  }, [search, sort]);

  // Corrected: Added fetchUsers to the dependency array to fix the warning
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSort = (field) => {
    setSort(s => ({
      field,
      order: s.field === field ? (s.order === "ASC" ? "DESC" : "ASC") : "ASC"
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setErr(""); setSuccess("");
    if (!form.name || form.name.length < 20 || form.name.length > 60) return setErr("Name: 20-60 chars");
    if (!form.email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(form.email)) return setErr("Invalid email");
    if (!form.address || form.address.length > 400) return setErr("Address: max 400 chars");
    if (!form.password || form.password.length < 8 || form.password.length > 16) return setErr("Password: 8-16 chars");
    if (!/[A-Z]/.test(form.password)) return setErr("Password: must have uppercase");
    if (!/[!@#$%^&*]/.test(form.password)) return setErr("Password: must have special char");
    try {
      await api.post("/users", form);
      setForm({ name: "", email: "", address: "", password: "", role: "user" });
      setSuccess("User added!");
      fetchUsers();
    } catch (e) {
      setErr(e.response?.data?.error || "Could not create user");
    }
  };

  return (
    <Container>
      <Card>
        <h2 style={{ color: theme.primary, marginBottom: "1.2rem" }}>Users</h2>
        <div style={{ marginBottom: "1.5rem" }}>
          <Input placeholder="Name" value={search.name} onChange={e => setSearch({ ...search, name: e.target.value })} />
          <Input placeholder="Email" value={search.email} onChange={e => setSearch({ ...search, email: e.target.value })} />
          <Input placeholder="Address" value={search.address} onChange={e => setSearch({ ...search, address: e.target.value })} />
          <Input placeholder="Role" value={search.role} onChange={e => setSearch({ ...search, role: e.target.value })} />
          <Button onClick={fetchUsers}>Filter</Button>
        </div>
        {err && <Error>{err}</Error>}
        <Table>
          <thead>
            <tr>
              <TH onClick={() => handleSort("name")}>Name</TH>
              <TH onClick={() => handleSort("email")}>Email</TH>
              <TH onClick={() => handleSort("address")}>Address</TH>
              <TH onClick={() => handleSort("role")}>Role</TH>
              <TH>Rating</TH>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <TD>{u.name}</TD>
                <TD>{u.email}</TD>
                <TD>{u.address}</TD>
                <TD>{u.role}</TD>
                <TD>{u.role === "owner" ? (u.rating ? u.rating.toFixed(2) : "N/A") : "-"}</TD>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
      <Card>
        <h3 style={{ color: theme.primary, marginBottom: "1.1rem" }}>Add New User</h3>
        {err && <Error>{err}</Error>}
        {success && <Success>{success}</Success>}
        <form onSubmit={handleCreate} style={{ display: "flex", gap: "1.1rem", flexWrap: "wrap" }}>
          <Input placeholder="Name" value={form.name} name="name" onChange={e => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="Email" value={form.email} name="email" onChange={e => setForm({ ...form, email: e.target.value })} />
          <Input placeholder="Address" value={form.address} name="address" onChange={e => setForm({ ...form, address: e.target.value })} />
          <Input placeholder="Password" value={form.password} name="password" type="password" onChange={e => setForm({ ...form, password: e.target.value })} />
          <select style={{ padding: "0.6rem 1rem", borderRadius: 6, border: `1.5px solid ${theme.border}` }} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
            <option value="user">Normal User</option>
            <option value="admin">Admin</option>
            <option value="owner">Store Owner</option>
          </select>
          <Button type="submit">Add User</Button>
        </form>
      </Card>
    </Container>
  );
}
