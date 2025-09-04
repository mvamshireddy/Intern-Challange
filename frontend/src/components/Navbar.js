import React from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { theme } from '../services/theme';

const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  height: 70px;
  background-color: ${theme.card};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  color: ${theme.primary};
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${theme.primary};
  text-decoration: none;
`;

const NavItems = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const WelcomeText = styled.span`
  font-size: 1rem;
`;

const LogoutButton = styled.button`
  padding: 8px 15px;
  background-color: ${theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #1c2a3a;
  }
`;

const Navbar = () => {
  const navigate = useNavigate();
  // Get user data from localStorage, or default to an empty object
  const user = JSON.parse(localStorage.getItem('user')) || {};

  const handleLogout = () => {
    // 1. Clear user data and token from storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // 2. Redirect to the login page
    navigate('/login');
  };

  return (
    <NavContainer>
      <Logo to="/">StoreRater</Logo>
      <NavItems>
        {user.name && <WelcomeText>Welcome, {user.name}!</WelcomeText>}
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </NavItems>
    </NavContainer>
  );
};

export default Navbar;