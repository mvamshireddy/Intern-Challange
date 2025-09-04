import React, { useEffect, useState } from "react";

// The theme object is now defined directly in the component
// to remove the external file dependency.
const theme = {
  primary: "#2E4057",
  accent: "#FFD166",
  background: "#F6F7FB",
  card: "#FFFFFF",
  text: "#22223B",
  error: "#E63946",
  green: "#38B000",
  border: "#E0E1E6",
};

// CSS styles are converted to inline style objects to remove
// the dependency on the 'styled-components' library.
const styles = {
  container: {
    minHeight: "100vh",
    background: theme.background,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "2.5rem 0",
    fontFamily: "sans-serif",
  },
  dashboardCard: {
    background: theme.card,
    borderRadius: "14px",
    boxShadow: "0 2px 12px rgba(44,62,80,0.11)",
    padding: "2rem 2.5rem",
    marginBottom: "2rem",
    display: "flex",
    gap: "2.5rem",
  },
  stat: {
    textAlign: "center",
  },
  statNumber: {
    color: theme.primary,
    fontSize: "2.2rem",
    fontWeight: "700",
  },
  statLabel: {
    color: "#666",
    fontSize: "1.08rem",
    marginTop: "0.2rem",
  },
  title: {
    color: theme.primary,
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "2rem",
  },
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    users: 0,
    stores: 0,
    ratings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // The API service was unresolvable. This has been replaced with
    // a mock data fetch to ensure the component is self-contained and runnable.
    const mockApiCall = new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            users: 142,
            stores: 35,
            ratings: 512,
          },
        });
      }, 1200); // Simulate network delay
    });

    mockApiCall
      .then(({ data }) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Admin Dashboard</h2>
      {loading ? (
        <div>Loading stats...</div>
      ) : (
        <div style={styles.dashboardCard}>
          <div style={styles.stat}>
            <div style={styles.statNumber}>{stats.users}</div>
            <div style={styles.statLabel}>Total Users</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statNumber}>{stats.stores}</div>
            <div style={styles.statLabel}>Total Stores</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statNumber}>{stats.ratings}</div>
            <div style={styles.statLabel}>Submitted Ratings</div>
          </div>
        </div>
      )}
    </div>
  );
}

