import React, { useEffect, useState } from "react";
import styled from "styled-components";
import api from "../services/api";
import { theme } from "../services/theme";
import AdminSidebar from '../components/AdminSidebar'; // 👈 Import the sidebar

// --- Styled Components ---
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
`;

const StatCard = styled.div`
  background-color: ${theme.card};
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  text-align: center;
`;

const StatNumber = styled.h2`
  font-size: 3rem;
  font-weight: bold;
  color: ${theme.primary};
  margin: 0 0 10px 0;
`;

const StatLabel = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin: 0;
`;

const MessageText = styled.p`
  font-size: 1.5rem;
  text-align: center;
  color: ${theme.primary};
  margin-top: 50px;
`;

// --- Component ---
const AdminDashboardPage = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await api.get("/admin/dashboard");
        setStats(response.data);
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  if (loading) {
    return <MessageText>Loading Dashboard...</MessageText>;
  }
  if (error) {
    return <MessageText>{error}</MessageText>;
  }

  return (
    <PageContainer>
      <AdminSidebar /> {/* 👈 Add the sidebar component */}
      <Content>
        <Title>Admin Dashboard</Title>
        <StatsGrid>
          <StatCard>
            <StatNumber>{stats.totalUsers}</StatNumber>
            <StatLabel>Total Users</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.totalStores}</StatNumber>
            <StatLabel>Total Stores</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.totalRatings}</StatNumber>
            <StatLabel>Submitted Ratings</StatLabel>
          </StatCard>
        </StatsGrid>
      </Content>
    </PageContainer>
  );
};

export default AdminDashboardPage;