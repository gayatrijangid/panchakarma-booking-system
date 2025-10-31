import React, { useState } from 'react';
import styled from 'styled-components';
import { Menu, Bell, Search, LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const NavbarContainer = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 30px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const SearchInput = styled.input`
  padding: 8px 16px 8px 40px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  width: 300px;
  outline: none;
  font-size: 14px;
  
  &:focus {
    border-color: #007a5f;
    box-shadow: 0 0 0 3px rgba(0, 122, 95, 0.1);
  }
  
  @media (max-width: 1024px) {
    width: 200px;
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const NotificationButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 2px;
  right: 2px;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

const UserMenu = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  background: none;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #007a5f, #00b88a);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
`;

const UserName = styled.span`
  font-weight: 500;
  color: #333;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  z-index: 1000;
  opacity: ${props => props.isOpen ? '1' : '0'};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.2s ease;
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #333;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #f8f9fa;
  }
  
  &:first-child {
    border-radius: 8px 8px 0 0;
  }
  
  &:last-child {
    border-radius: 0 0 8px 8px;
    color: #e74c3c;
  }
  
  &.danger:hover {
    background-color: rgba(231, 76, 60, 0.1);
  }
`;

const Navbar = ({ onToggleSidebar, sidebarCollapsed }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleProfileClick = () => {
    setUserMenuOpen(false);
    navigate('/profile');
  };

  const handleSettingsClick = () => {
    setUserMenuOpen(false);
    navigate('/settings');
  };

  const getUserInitials = (name) => {
    return name
      ? name.split(' ').map(n => n[0]).join('').toUpperCase()
      : 'U';
  };

  return (
    <NavbarContainer>
      <LeftSection>
        <MenuButton onClick={onToggleSidebar}>
          <Menu size={20} color="#333" />
        </MenuButton>
        
        <SearchContainer>
          <SearchIcon size={16} />
          <SearchInput
            type="text"
            placeholder="Search patients, appointments, therapies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchContainer>
      </LeftSection>

      <RightSection>
        <NotificationButton>
          <Bell size={20} color="#333" />
          <NotificationBadge>3</NotificationBadge>
        </NotificationButton>

        <UserMenu>
          <UserButton onClick={() => setUserMenuOpen(!userMenuOpen)}>
            <UserAvatar>
              {getUserInitials(user?.name)}
            </UserAvatar>
            <UserName>{user?.name}</UserName>
          </UserButton>

          <DropdownMenu isOpen={userMenuOpen}>
            <DropdownItem onClick={handleProfileClick}>
              <User size={16} />
              My Profile
            </DropdownItem>
            <DropdownItem onClick={handleSettingsClick}>
              <Settings size={16} />
              Settings
            </DropdownItem>
            <DropdownItem onClick={handleLogout} className="danger">
              <LogOut size={16} />
              Logout
            </DropdownItem>
          </DropdownMenu>
        </UserMenu>
      </RightSection>

      {/* Overlay to close dropdown when clicking outside */}
      {userMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </NavbarContainer>
  );
};

export default Navbar;