import React, { useEffect, useState } from "react";
import styled from "styled-components";
import api from '../services/api';
import { theme } from '../services/theme'; // Corrected: Use named import

const Container = styled.div`
  min-height: 100vh;
  background: ${theme.background};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.5rem 0;
`;

const Card = styled.div`
  background: ${theme.card};
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(44,62,80,0.11);
  padding: 2rem 2.5rem;
  margin-bottom: 2rem;
  min-width: 350px;
`;

const Title = styled.h2`
  color: ${theme.primary};
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
`;

const SubTitle = styled.h3`
  color: ${theme.primary};
  font-size: 1.22rem;
  font-weight: 600;
  margin-bottom: 1.1rem;
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
`;

const TD = styled.td`
  padding: 0.6rem 0.5rem;
  border-bottom: 1.5px solid ${theme.background};
`;

const Stat = styled.div`
  color: ${theme.primary};
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 1.2rem;
`;

export default function StoreOwnerDashboardPage() {
  const [users, setUsers] = useState([]);
  const [avg, setAvg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/stores/owner/dashboard")
      .then(({ data }) => {
        setUsers(data.raters || []);
        setAvg(data.rating);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container>
      <Card>
        <Title>Store Owner Dashboard</Title>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <Stat>Average Store Rating: {avg ? avg.toFixed(2) : "N/A"}</Stat>
            <SubTitle>Users who rated your store:</SubTitle>
            <Table>
              <thead>
                <tr>
                  <TH>Name</TH>
                  <TH>Email</TH>
                  <TH>Submitted Rating</TH>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <TD>{u.name}</TD>
                    <TD>{u.email}</TD>
                    <TD>{u.rating}</TD>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </Card>
    </Container>
  );
}
