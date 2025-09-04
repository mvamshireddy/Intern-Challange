import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import api from '../services/api';
import { theme } from '../services/theme';
import AdminSidebar from '../components/AdminSidebar';

const PageContainer = styled.div`
  display: flex;
`;

const Content = styled.div`
  flex-grow: 1;
  padding: 40px;
  background-color: ${theme.background};
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${theme.primary};
  margin-bottom: 30px;
`;

const Card = styled.div`
  background: ${theme.card};
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 15px;
  border-bottom: 2px solid ${theme.background};
`;

const Td = styled.td`
  padding: 15px;
  border-bottom: 1px solid ${theme.background};
`;

const Input = styled.input`
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const Select = styled.select`
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background-color: ${theme.primary};
  color: white;
  cursor: pointer;
`;

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', role: '' });
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', address: '', role: 'user' });

  const fetchUsers = useCallback(async () => {
    const params = new URLSearchParams(filters);
    try {
      const response = await api.get(`/users?${params.toString()}`);
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }, [filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', newUser);
      alert('User added successfully!');
      setNewUser({ name: '', email: '', password: '', address: '', role: 'user' });
      fetchUsers(); // Refresh the list
    } catch (error) {
      alert(`Failed to add user: ${error.response?.data?.error || 'Server error'}`);
    }
  };

  return (
    <PageContainer>
      <AdminSidebar />
      <Content>
        <Title>Manage Users</Title>
        <Card>
          <h2>Filter Users</h2>
          <Input placeholder="Filter by Name..." value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
          <Input placeholder="Filter by Email..." value={filters.email} onChange={(e) => setFilters({ ...filters, email: e.target.value })} />
          <Select value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })}>
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="owner">Owner</option>
          </Select>
          <Button onClick={fetchUsers}>Apply Filters</Button>
        </Card>
        <Card>
          <h2>Add New User</h2>
          <form onSubmit={handleAddUser}>
            <Input placeholder="Name (min 20 chars)" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} required />
            <Input type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} required />
            <Input type="password" placeholder="Password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required />
            <Input placeholder="Address" value={newUser.address} onChange={(e) => setNewUser({ ...newUser, address: e.target.value })} required />
            <Select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="owner">Owner</option>
            </Select>
            <Button type="submit">Add User</Button>
          </form>
        </Card>
        <Card>
          <h2>All Users</h2>
          <Table>
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Address</Th>
                <Th>Role</Th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <Td>{user.name}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.address}</Td>
                  <Td>{user.role}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      </Content>
    </PageContainer>
  );
};

export default AdminUsersPage;