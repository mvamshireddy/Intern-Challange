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

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background-color: ${theme.primary};
  color: white;
  cursor: pointer;
`;

const AdminStoresPage = () => {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [newStore, setNewStore] = useState({ name: '', email: '', address: '' });

  const fetchStores = useCallback(async () => {
    const params = new URLSearchParams(filters);
    try {
      const response = await api.get(`/stores?${params.toString()}`);
      setStores(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch stores:", error);
    }
  }, [filters]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleAddStore = async (e) => {
    e.preventDefault();
    try {
      await api.post('/stores', newStore);
      alert('Store added successfully!');
      setNewStore({ name: '', email: '', address: '' });
      fetchStores(); // Refresh the list
    } catch (error) {
      alert(`Failed to add store: ${error.response?.data?.error || 'Server error'}`);
    }
  };

  return (
    <PageContainer>
      <AdminSidebar />
      <Content>
        <Title>Manage Stores</Title>
        <Card>
          <h2>Filter Stores</h2>
          <Input placeholder="Filter by Name..." value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
          <Input placeholder="Filter by Address..." value={filters.address} onChange={(e) => setFilters({ ...filters, address: e.target.value })} />
          <Button onClick={fetchStores}>Apply Filters</Button>
        </Card>
        <Card>
          <h2>Add New Store</h2>
          <form onSubmit={handleAddStore}>
            <Input placeholder="Name (min 20 chars)" value={newStore.name} onChange={(e) => setNewStore({ ...newStore, name: e.target.value })} required />
            <Input type="email" placeholder="Email" value={newStore.email} onChange={(e) => setNewStore({ ...newStore, email: e.target.value })} required />
            <Input placeholder="Address" value={newStore.address} onChange={(e) => setNewStore({ ...newStore, address: e.target.value })} required />
            <Button type="submit">Add Store</Button>
          </form>
        </Card>
        <Card>
          <h2>All Stores</h2>
          <Table>
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Address</Th>
                <Th>Avg. Rating</Th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store) => (
                <tr key={store.id}>
                  <Td>{store.name}</Td>
                  <Td>{store.email}</Td>
                  <Td>{store.address}</Td>
                  <Td>⭐ {store.averageRating ? parseFloat(store.averageRating).toFixed(1) : "N/A"}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      </Content>
    </PageContainer>
  );
};

export default AdminStoresPage;