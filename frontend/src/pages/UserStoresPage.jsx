import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import api from '../services/api';
import { theme } from '../services/theme'; // Corrected: Use named import

const Container = styled.div`
  background: ${theme.background};
  min-height: 100vh;
  padding: 2.3rem 0;
`;

const SearchContainer = styled.div`
  background: ${theme.card};
  margin: 0 auto 1.5rem auto;
  padding: 2rem 1.5rem;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(44,62,80,0.11);
  max-width: 800px;
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const Card = styled.div`
  background: ${theme.card};
  margin: 1.5rem auto;
  padding: 2rem 1.5rem;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(44,62,80,0.11);
  max-width: 800px;
`;

const StoreHeader = styled.div`
  font-weight: 600;
  font-size: 1.2rem;
  color: ${theme.primary};
  margin-bottom: 0.4rem;
`;

const Address = styled.div`
  color: #555;
  font-size: 1rem;
  margin-bottom: 0.3rem;
`;

const RatingBar = styled.div`
  display: flex;
  align-items: center;
`;

const Star = styled.span`
  color: ${props => props.active ? theme.accent : "#ccc"};
  font-size: 1.35rem;
  cursor: pointer;
  margin-right: 0.1rem;
  user-select: none;
`;

const Input = styled.input`
  padding: 0.6rem 1rem;
  border-radius: 6px;
  border: 1.5px solid ${theme.border};
  font-size: 1rem;
  flex: 1;
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

export default function UserStoresPage() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState({ name: "", address: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ratingLoading, setRatingLoading] = useState("");

  // Corrected: Memoize fetchStores to safely use it as a dependency in useEffect
  const fetchStores = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      let query = [];
      if (search.name) query.push(`name=${encodeURIComponent(search.name)}`);
      if (search.address) query.push(`address=${encodeURIComponent(search.address)}`);
      const { data } = await api.get("/stores" + (query.length ? `?${query.join("&")}` : ""));
      setStores(data);
    } catch {
      setError("Failed to load stores");
    }
    setLoading(false);
  }, [search]);

  // Corrected: Added fetchStores to the dependency array to fix the warning
  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleRating = async (storeId, value) => {
    setRatingLoading(storeId);
    try {
      await api.post("/ratings", { storeId, value });
      fetchStores(); // Refetch stores to show updated ratings
    } catch {
      setError("Could not submit rating.");
    }
    setRatingLoading("");
  };

  return (
    <Container>
      <SearchContainer>
        <Input placeholder="Search by name" value={search.name} onChange={e => setSearch({...search, name: e.target.value})} />
        <Input placeholder="Search by address" value={search.address} onChange={e => setSearch({...search, address: e.target.value})} />
        <Button onClick={fetchStores}>Search</Button>
      </SearchContainer>
      
      <Card>
        {loading && <div>Loading stores...</div>}
        {error && <Error>{error}</Error>}
        {!loading && stores.length === 0 && <div>No stores found.</div>}
        {stores.map(store => (
          <div key={store.id} style={{borderBottom: `1px solid ${theme.border}`, padding: '1rem 0'}}>
            <StoreHeader>{store.name}</StoreHeader>
            <Address>{store.address}</Address>
            <RatingBar>
              {[1,2,3,4,5].map(num => (
                <Star
                  key={num}
                  active={num <= (store.userRating || 0)}
                  onClick={() => handleRating(store.id, num)}
                  style={{pointerEvents: ratingLoading === store.id ? "none" : "auto"}}
                >★</Star>
              ))}
              <span style={{marginLeft: "1.2rem", fontSize: "1rem"}}>Overall: {store.rating ? store.rating.toFixed(2) : "N/A"}</span>
              {ratingLoading === store.id && <span style={{marginLeft: "1rem"}}>Saving...</span>}
            </RatingBar>
          </div>
        ))}
      </Card>
    </Container>
  );
}
