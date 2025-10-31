import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { 
  Calendar, 
  Users, 
  Activity, 
  Settings, 
  Home,
  Bell,
  BarChart3,
  User,
  Stethoscope,
  FileText,
  Clock,
  Heart
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { USER_ROLES } from '../../types';

const SidebarContainer = styled.div`
  height: 100vh;
  background: linear-gradient(135deg, #007a5f 0%, #00b88a 100%);
  color: white;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 40px;
  
  img {
    width: ${props => props.isCollapsed ? '35px' : '45px'};
    height: ${props => props.isCollapsed ? '35px' : '45px'};
    border-radius: 50%;
    margin-right: ${props => props.isCollapsed ? '0' : '15px'};
    transition: all 0.3s ease;
  }
  
  span {
    font-size: ${props => props.isCollapsed ? '0' : '24px'};
    font-weight: bold;
    opacity: ${props => props.isCollapsed ? '0' : '1'};
    transition: all 0.3s ease;
    overflow: hidden;
    white-space: nowrap;
  }
`;

const NavSection = styled.div`
  flex: 1;
  padding: 0 10px;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  margin: 5px 0;
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    transform: translateX(5px);
  }
  
  &.active {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    font-weight: 600;
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: white;
      border-radius: 0 2px 2px 0;
    }
  }
  
  svg {
    margin-right: ${props => props.isCollapsed ? '0' : '15px'};
    min-width: 20px;
    transition: all 0.3s ease;
  }
  
  span {
    opacity: ${props => props.isCollapsed ? '0' : '1'};
    width: ${props => props.isCollapsed ? '0' : 'auto'};
    overflow: hidden;
    white-space: nowrap;
    transition: all 0.3s ease;
  }
`;

const UserInfo = styled.div`
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  margin-top: auto;
`;

const UserAvatar = styled.div`
  display: flex;
  align-items: center;
  
  .avatar {
    width: ${props => props.isCollapsed ? '35px' : '45px'};
    height: ${props => props.isCollapsed ? '35px' : '45px'};
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: ${props => props.isCollapsed ? '0' : '15px'};
    transition: all 0.3s ease;
  }
  
  .info {
    opacity: ${props => props.isCollapsed ? '0' : '1'};
    width: ${props => props.isCollapsed ? '0' : 'auto'};
    overflow: hidden;
    transition: all 0.3s ease;
    
    h4 {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
    }
    
    p {
      margin: 2px 0 0 0;
      font-size: 12px;
      opacity: 0.8;
      text-transform: capitalize;
    }
  }
`;

const getNavigationItems = (role) => {
  const baseItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' }
  ];
  
  switch (role) {
    case USER_ROLES.PATIENT:
      return [
        ...baseItems,
        { path: '/appointments', icon: Calendar, label: 'My Appointments' },
        { path: '/therapy-progress', icon: Activity, label: 'My Progress' },
        { path: '/notifications', icon: Bell, label: 'Notifications' },
        { path: '/therapies', icon: Heart, label: 'Available Therapies' },
        { path: '/profile', icon: User, label: 'Profile' }
      ];
    
    case USER_ROLES.DOCTOR:
      return [
        ...baseItems,
        { path: '/patients', icon: Users, label: 'My Patients' },
        { path: '/appointments', icon: Calendar, label: 'Appointments' },
        { path: '/therapy-sessions', icon: Stethoscope, label: 'Therapy Sessions' },
        { path: '/schedule', icon: Clock, label: 'My Schedule' },
        { path: '/reports', icon: FileText, label: 'Reports' },
        { path: '/profile', icon: User, label: 'Profile' }
      ];
    
    case USER_ROLES.ADMIN:
      return [
        ...baseItems,
        { path: '/users', icon: Users, label: 'User Management' },
        { path: '/appointments', icon: Calendar, label: 'All Appointments' },
        { path: '/analytics', icon: BarChart3, label: 'Analytics' },
        { path: '/therapies', icon: Heart, label: 'Therapy Management' },
        { path: '/notifications', icon: Bell, label: 'Notifications' },
        { path: '/settings', icon: Settings, label: 'System Settings' }
      ];
    
    default:
      return baseItems;
  }
};

const Sidebar = ({ isCollapsed }) => {
  const { user } = useAuth();
  const location = useLocation();
  
  const navigationItems = getNavigationItems(user?.role);
  
  return (
    <SidebarContainer>
      <Logo isCollapsed={isCollapsed}>
        <img 
          src="https://www.slideteam.net/media/catalog/product/cache/1280x720/a/y/ayurvedic_diet_panchakarma_colored_icon_in_powerpoint_pptx_png_and_editable_eps_format_slide01.jpg" 
          alt="Niramay Logo" 
        />
        <span>Niramay</span>
      </Logo>
      
      <NavSection>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavItem
              key={item.path}
              to={item.path}
              isCollapsed={isCollapsed}
              className={location.pathname === item.path ? 'active' : ''}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavItem>
          );
        })}
      </NavSection>
      
      <UserInfo>
        <UserAvatar isCollapsed={isCollapsed}>
          <div className="avatar">
            <User size={isCollapsed ? 18 : 22} />
          </div>
          <div className="info">
            <h4>{user?.name}</h4>
            <p>{user?.role}</p>
          </div>
        </UserAvatar>
      </UserInfo>
    </SidebarContainer>
  );
};

export default Sidebar;