import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../services/theme';

const SidebarContainer = styled.div`
  width: 250px;
  background-color: ${theme.primary};
  color: white;
  height: calc(100vh - 70px); /* Full height minus navbar */
  padding-top: 20px;
`;

const NavItem = styled(NavLink)`
  display: block;
  color: white;
  padding: 15px 20px;
  text-decoration: none;
  font-size: 1.1rem;
  transition: background-color 0.2s;

  &.active {
    background-color: #1c2a3a;
  }

  &:hover {
    background-color: #2c3e50;
  }
`;

const AdminSidebar = () => {
  return (
    <SidebarContainer>
      <NavItem to="/admin/dashboard">Dashboard</NavItem>
      <NavItem to="/admin/users">Manage Users</NavItem>
      <NavItem to="/admin/stores">Manage Stores</NavItem>
    </SidebarContainer>
  );
};

export default AdminSidebar;