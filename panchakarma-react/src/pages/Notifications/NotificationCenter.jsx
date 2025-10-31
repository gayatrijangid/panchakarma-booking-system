import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Bell, MessageCircle, Calendar, User, CheckCircle, Info, AlertTriangle, Filter, MarkAsRead } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const Container = styled.div`
  padding: 0;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #007a5f 0%, #00b88a 100%);
  color: white;
  padding: 2rem;
  border-radius: 15px;
  margin-bottom: 2rem;
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    @media (max-width: 768px) {
      flex-direction: column;
      gap: 1rem;
    }
  }
  
  h1 {
    margin: 0 0 0.5rem 0;
    font-size: 2rem;
    font-weight: 600;
  }
  
  p {
    margin: 0;
    opacity: 0.9;
    font-size: 1.1rem;
  }
  
  .notification-stats {
    display: flex;
    gap: 2rem;
    
    .stat {
      text-align: center;
      
      .number {
        font-size: 1.5rem;
        font-weight: bold;
        display: block;
      }
      
      .label {
        font-size: 0.8rem;
        opacity: 0.8;
      }
    }
  }
`;

const FilterSection = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  
  .filter-row {
    display: flex;
    gap: 1rem;
    align-items: center;
    justify-content: space-between;
    
    @media (max-width: 768px) {
      flex-direction: column;
      align-items: stretch;
    }
  }
  
  .filter-left {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border: 2px solid ${props => props.active ? '#007a5f' : '#e0e0e0'};
  background: ${props => props.active ? '#007a5f' : 'white'};
  color: ${props => props.active ? 'white' : '#666'};
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #007a5f;
    background: ${props => props.active ? '#005a45' : 'rgba(0, 122, 95, 0.1)'};
  }
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  background: #007a5f;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: #005a45;
  }
`;

const NotificationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const NotificationCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${props => {
    switch (props.type) {
      case 'info': return '#007a5f';
      case 'success': return '#28a745';
      case 'warning': return '#ffc107';
      case 'error': return '#dc3545';
      default: return '#6c757d';
    }
  }};
  opacity: ${props => props.read ? '0.7' : '1'};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    opacity: 1;
  }
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
`;

const NotificationIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => {
    switch (props.type) {
      case 'info': return 'rgba(0, 122, 95, 0.1)';
      case 'success': return 'rgba(40, 167, 69, 0.1)';
      case 'warning': return 'rgba(255, 193, 7, 0.1)';
      case 'error': return 'rgba(220, 53, 69, 0.1)';
      default: return 'rgba(108, 117, 125, 0.1)';
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'info': return '#007a5f';
      case 'success': return '#28a745';
      case 'warning': return '#ffc107';
      case 'error': return '#dc3545';
      default: return '#6c757d';
    }
  }};
`;

const NotificationContent = styled.div`
  flex: 1;
  margin-left: 1rem;
  
  h4 {
    margin: 0 0 0.5rem 0;
    color: #333;
    font-size: 1.1rem;
    font-weight: 600;
  }
  
  p {
    margin: 0;
    color: #666;
    line-height: 1.5;
  }
`;

const NotificationMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.75rem;
  
  .time {
    color: #999;
    font-size: 0.8rem;
  }
  
  .read-btn {
    background: none;
    border: none;
    color: #007a5f;
    cursor: pointer;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
  
  .empty-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 1rem;
    opacity: 0.3;
  }
  
  h3 {
    margin: 0 0 0.5rem 0;
    color: #333;
  }
  
  p {
    margin: 0;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #f0f0f0;
    border-top: 3px solid #007a5f;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('read', filter === 'read' ? 'true' : 'false');
      
      const response = await fetch(`http://localhost:3002/api/notifications?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      } else {
        toast.error('Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3002/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        fetchNotifications();
        toast.success('Notification marked as read');
      } else {
        toast.error('Failed to update notification');
      }
    } catch (error) {
      console.error('Error updating notification:', error);
      toast.error('Failed to update notification');
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.read);
      const promises = unreadNotifications.map(n => markAsRead(n.id));
      await Promise.all(promises);
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'info': return <Info size={20} />;
      case 'success': return <CheckCircle size={20} />;
      case 'warning': return <AlertTriangle size={20} />;
      case 'appointment': return <Calendar size={20} />;
      case 'message': return <MessageCircle size={20} />;
      default: return <Bell size={20} />;
    }
  };

  const formatTime = (time) => {
    return new Date(time).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  // Mock notifications if none exist
  const mockNotifications = [
    {
      id: 1,
      title: 'Appointment Confirmed',
      message: 'Your Panchakarma Detox appointment has been confirmed for tomorrow at 10:00 AM.',
      type: 'success',
      read: false,
      createdAt: new Date(Date.now() - 3600000)
    },
    {
      id: 2,
      title: 'WhatsApp Integration Active',
      message: 'Your phone number has been verified and WhatsApp notifications are now enabled.',
      type: 'info',
      read: false,
      createdAt: new Date(Date.now() - 7200000)
    },
    {
      id: 3,
      title: 'Upcoming Appointment Reminder',
      message: 'Don\'t forget your Shirodhara session scheduled for this Friday at 2:00 PM.',
      type: 'warning',
      read: true,
      createdAt: new Date(Date.now() - 86400000)
    }
  ];

  const displayNotifications = notifications.length > 0 ? notifications : mockNotifications;
  const displayUnreadCount = notifications.length > 0 ? unreadCount : mockNotifications.filter(n => !n.read).length;

  return (
    <Container>
      <Header>
        <div className="header-content">
          <div>
            <h1>Notifications 🔔</h1>
            <p>Stay updated with your appointments and wellness journey</p>
          </div>
          <div className="notification-stats">
            <div className="stat">
              <span className="number">{displayNotifications.length}</span>
              <span className="label">Total</span>
            </div>
            <div className="stat">
              <span className="number">{displayUnreadCount}</span>
              <span className="label">Unread</span>
            </div>
          </div>
        </div>
      </Header>

      <FilterSection>
        <div className="filter-row">
          <div className="filter-left">
            <FilterButton 
              active={filter === 'all'}
              onClick={() => setFilter('all')}
            >
              All Notifications
            </FilterButton>
            <FilterButton 
              active={filter === 'unread'}
              onClick={() => setFilter('unread')}
            >
              Unread ({displayUnreadCount})
            </FilterButton>
            <FilterButton 
              active={filter === 'read'}
              onClick={() => setFilter('read')}
            >
              Read
            </FilterButton>
          </div>
          
          {displayUnreadCount > 0 && (
            <ActionButton onClick={markAllAsRead}>
              <CheckCircle size={16} />
              Mark All as Read
            </ActionButton>
          )}
        </div>
      </FilterSection>

      {loading ? (
        <LoadingSpinner>
          <div className="spinner"></div>
        </LoadingSpinner>
      ) : displayNotifications.length === 0 ? (
        <EmptyState>
          <Bell className="empty-icon" />
          <h3>No notifications</h3>
          <p>You're all caught up! New notifications will appear here.</p>
        </EmptyState>
      ) : (
        <NotificationsList>
          {displayNotifications.map(notification => (
            <NotificationCard 
              key={notification.id} 
              type={notification.type}
              read={notification.read}
            >
              <NotificationHeader>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <NotificationIcon type={notification.type}>
                    {getNotificationIcon(notification.type)}
                  </NotificationIcon>
                  <NotificationContent>
                    <h4>{notification.title}</h4>
                    <p>{notification.message}</p>
                    <NotificationMeta>
                      <span className="time">
                        {formatTime(notification.createdAt)}
                      </span>
                      {!notification.read && (
                        <button 
                          className="read-btn"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <CheckCircle size={12} />
                          Mark as read
                        </button>
                      )}
                    </NotificationMeta>
                  </NotificationContent>
                </div>
              </NotificationHeader>
            </NotificationCard>
          ))}
        </NotificationsList>
      )}
    </Container>
  );
};

export default NotificationCenter;