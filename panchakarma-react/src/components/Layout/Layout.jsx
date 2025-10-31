import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAuth } from '../../contexts/AuthContext';

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f8f9fa;
`;

const SidebarContainer = styled.div`
  width: ${props => props.isCollapsed ? '70px' : '280px'};
  transition: width 0.3s ease;
  background-color: #ffffff;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  position: fixed;
  height: 100vh;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: ${props => props.isCollapsed ? '70px' : '280px'};
  transition: margin-left 0.3s ease;
  position: relative;
`;

const ContentArea = styled.main`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f8f9fa;
`;

const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuth();

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  if (!user) {
    return null; // This will be handled by protected routes
  }

  return (
    <LayoutContainer>
      <SidebarContainer isCollapsed={sidebarCollapsed}>
        <Sidebar isCollapsed={sidebarCollapsed} />
      </SidebarContainer>
      
      <MainContent isCollapsed={sidebarCollapsed}>
        <Navbar 
          onToggleSidebar={toggleSidebar} 
          sidebarCollapsed={sidebarCollapsed}
        />
        <ContentArea>
          {children || <Outlet />}
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout;