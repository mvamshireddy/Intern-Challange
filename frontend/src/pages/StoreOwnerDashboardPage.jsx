import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../services/api';
import { theme } from '../services/theme';

const Container = styled.div`
  padding: 40px;
  background-color: ${theme.background};
  min-height: calc(100vh - 70px);
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

const StatNumber = styled.h2`
  font-size: 3rem;
  color: ${theme.accent};
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

const MessageText = styled.p`
  font-size: 1.2rem;
  color: #666;
`;

const StoreOwnerDashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/stores/owner/dashboard');
        setDashboardData(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <Container><MessageText>Loading dashboard...</MessageText></Container>;
  if (error) return <Container><MessageText>{error}</MessageText></Container>;
  if (!dashboardData) return <Container><MessageText>No data available.</MessageText></Container>;

  const { storeDetails, ratings } = dashboardData;
  
  return (
    <Container>
      <Title>Welcome, {storeDetails.name}</Title>
      <Card>
        <h2>Overall Store Rating</h2>
        <StatNumber>⭐ {storeDetails.averageRating ? parseFloat(storeDetails.averageRating).toFixed(1) : "N/A"}</StatNumber>
      </Card>
      <Card>
        <h2>Recent Ratings from Users</h2>
        {ratings.length > 0 ? (
          <Table>
            <thead>
              <tr>
                <Th>User Name</Th>
                <Th>User Email</Th>
                <Th>Rating Given</Th>
              </tr>
            </thead>
            <tbody>
              {ratings.map((rating) => (
                <tr key={rating.id}>
                  <Td>{rating.User.name}</Td>
                  <Td>{rating.User.email}</Td>
                  <Td>⭐ {rating.value}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <MessageText>Your store has not received any ratings yet.</MessageText>
        )}
      </Card>
    </Container>
  );
};

export default StoreOwnerDashboardPage;