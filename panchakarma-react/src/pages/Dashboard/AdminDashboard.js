import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Users, Calendar, Bell, TrendingUp, Activity, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { usePolling } from '../../hooks/usePolling';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002/api';

const DashboardContainer = styled.div`
  padding: 0;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #007a5f 0%, #00b88a 100%);
  color: white;
  padding: 2rem;
  border-radius: 15px;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  
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
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    
    h1 {
      font-size: 1.5rem;
    }
    
    p {
      font-size: 1rem;
    }
  }
`;

const LiveIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #4ade80;
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
`;

const AlertBanner = styled.div`
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  animation: slideIn 0.3s ease;
  
  @keyframes slideIn {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  @media (max-width: 768px) {
    padding: 0.8rem 1rem;
    font-size: 0.9rem;
    flex-wrap: wrap;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  .icon {
    width: 50px;
    height: 50px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.color || '#f0f0f0'};
  }
  
  .content {
    flex: 1;
    
    h3 {
      margin: 0;
      font-size: 1.8rem;
      font-weight: 700;
      color: #333;
    }
    
    p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
    
    .icon {
      width: 40px;
      height: 40px;
      
      svg {
        width: 20px;
        height: 20px;
      }
    }
    
    .content {
      h3 {
        font-size: 1.5rem;
      }
      
      p {
        font-size: 0.85rem;
      }
    }
  }
`;

const NewBadge = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ff6b6b;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: bold;
  animation: blink 1s infinite;
  
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  h2 {
    margin: 0;
    font-size: 1.3rem;
    font-weight: 600;
    color: #333;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
    
    h2 {
      font-size: 1.1rem;
    }
  }
`;

const CardContent = styled.div`
  padding: 1.5rem;
  max-height: 400px;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    padding: 1rem;
    max-height: 350px;
  }
`;

const AppointmentItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${props => props.isNew ? 'rgba(255, 107, 107, 0.05)' : '#f8f9fa'};
  border-radius: 10px;
  border-left: 4px solid ${props => {
    if (props.isNew) return '#ff6b6b';
    switch (props.status) {
      case 'pending': return '#ffc107';
      case 'confirmed': return '#007a5f';
      case 'completed': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  }};
  margin-bottom: 1rem;
  flex-wrap: wrap;
  
  .details {
    flex: 1;
    min-width: 200px;
    
    .name {
      font-weight: 600;
      color: #333;
      margin-bottom: 0.25rem;
    }
    
    .therapy {
      color: #666;
      font-size: 0.9rem;
    }
    
    .datetime {
      color: #999;
      font-size: 0.8rem;
      margin-top: 0.25rem;
    }
  }
  
  .status {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
    text-transform: capitalize;
    background: ${props => {
      switch (props.status) {
        case 'pending': return 'rgba(255, 193, 7, 0.1)';
        case 'confirmed': return 'rgba(0, 122, 95, 0.1)';
        case 'completed': return 'rgba(40, 167, 69, 0.1)';
        case 'cancelled': return 'rgba(220, 53, 69, 0.1)';
        default: return 'rgba(108, 117, 125, 0.1)';
      }
    }};
    color: ${props => {
      switch (props.status) {
        case 'pending': return '#ffc107';
        case 'confirmed': return '#007a5f';
        case 'completed': return '#28a745';
        case 'cancelled': return '#dc3545';
        default: return '#6c757d';
      }
    }};
  }
  
  @media (max-width: 768px) {
    padding: 0.8rem;
    gap: 0.8rem;
    
    .details {
      min-width: 150px;
      
      .name {
        font-size: 0.9rem;
      }
      
      .therapy {
        font-size: 0.85rem;
      }
      
      .datetime {
        font-size: 0.75rem;
      }
    }
    
    .status {
      font-size: 0.75rem;
      padding: 0.2rem 0.6rem;
    }
  }
`;

const UserItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${props => props.isNew ? 'rgba(0, 122, 95, 0.05)' : '#f8f9fa'};
  border-radius: 10px;
  margin-bottom: 1rem;
  
  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #007a5f, #00b88a);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 18px;
    flex-shrink: 0;
  }
  
  .details {
    flex: 1;
    min-width: 0;
    
    .name {
      font-weight: 600;
      color: #333;
      margin-bottom: 0.25rem;
    }
    
    .info {
      color: #666;
      font-size: 0.9rem;
      word-break: break-word;
    }
  }
  
  @media (max-width: 768px) {
    padding: 0.8rem;
    gap: 0.8rem;
    
    .avatar {
      width: 40px;
      height: 40px;
      font-size: 16px;
    }
    
    .details {
      .name {
        font-size: 0.9rem;
      }
      
      .info {
        font-size: 0.8rem;
      }
    }
  }
`;

const AdminDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastFetch, setLastFetch] = useState(Date.now());
  const [previousCounts, setPreviousCounts] = useState({ appointments: 0, users: 0 });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Fetch appointments
      const aptRes = await axios.get(`${API_URL}/appointments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const newAppointments = aptRes.data.appointments || [];
      
      // Check for new appointments
      if (previousCounts.appointments > 0 && newAppointments.length > previousCounts.appointments) {
        const diff = newAppointments.length - previousCounts.appointments;
        toast.success(`🔔 ${diff} new appointment(s) received!`, {
          duration: 4000,
          position: 'top-right',
        });
      }
      
      setAppointments(newAppointments);

      // Fetch users
      const usersRes = await axios.get(`${API_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const newUsers = usersRes.data || [];
      
      // Check for new users
      if (previousCounts.users > 0 && newUsers.length > previousCounts.users) {
        const diff = newUsers.length - previousCounts.users;
        toast.success(`👤 ${diff} new user(s) registered!`, {
          duration: 4000,
          position: 'top-right',
        });
      }
      
      setUsers(newUsers);
      
      // Update counts
      setPreviousCounts({
        appointments: newAppointments.length,
        users: newUsers.length
      });
      
      setLastFetch(Date.now());

    } catch (error) {
      if (error.response?.status === 403) {
        toast.error('Access denied');
      } else {
        console.error('Error fetching data:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchData();
  }, []);

  // Auto-refresh every 5 seconds
  usePolling(fetchData, 5000);

  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  const recentUsers = users.slice(0, 5);
  
  // Check for items in last 5 minutes
  const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
  const newAppointments = appointments.filter(a => 
    new Date(a.created_at).getTime() > fiveMinutesAgo
  );
  const newUsersCount = users.filter(u => 
    new Date(u.created_at).getTime() > fiveMinutesAgo
  ).length;

  const stats = [
    {
      title: 'Total Appointments',
      value: appointments.length,
      color: 'rgba(0, 122, 95, 0.1)',
      icon: <Calendar size={24} color="#007a5f" />,
      isNew: newAppointments.length > 0
    },
    {
      title: 'Pending Appointments',
      value: pendingAppointments.length,
      color: 'rgba(255, 193, 7, 0.1)',
      icon: <AlertCircle size={24} color="#ffc107" />,
      isNew: pendingAppointments.length > 0
    },
    {
      title: 'Total Users',
      value: users.length,
      color: 'rgba(108, 117, 125, 0.1)',
      icon: <Users size={24} color="#6c757d" />,
      isNew: newUsersCount > 0
    },
    {
      title: 'Active Now',
      value: users.filter(u => u.status === 'active').length,
      color: 'rgba(40, 167, 69, 0.1)',
      icon: <Activity size={24} color="#28a745" />
    }
  ];

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '??';
  };

  return (
    <DashboardContainer>
      <Header>
        <div>
          <h1>Welcome, {user?.name}! 👋</h1>
          <p>System Administrator Dashboard</p>
        </div>
        <LiveIndicator>
          <span className="dot"></span>
          <span>Live Updates Active</span>
        </LiveIndicator>
      </Header>

      {pendingAppointments.length > 0 && (
        <AlertBanner>
          <Bell size={24} />
          <div>
            <strong>{pendingAppointments.length} pending appointment(s)</strong> require your attention!
          </div>
        </AlertBanner>
      )}

      <StatsGrid>
        {stats.map((stat, index) => (
          <StatCard key={index} color={stat.color}>
            {stat.isNew && <NewBadge>NEW</NewBadge>}
            <div className="icon">
              {stat.icon}
            </div>
            <div className="content">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
            </div>
          </StatCard>
        ))}
      </StatsGrid>

      <ContentGrid>
        <Card>
          <CardHeader>
            <h2>
              <Calendar size={20} />
              Recent Appointments
            </h2>
          </CardHeader>
          <CardContent>
            {appointments.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#999' }}>No appointments yet</p>
            ) : (
              appointments.slice(0, 10).map((apt) => {
                const isNew = new Date(apt.created_at).getTime() > fiveMinutesAgo;
                return (
                  <AppointmentItem 
                    key={apt.id} 
                    status={apt.status}
                    isNew={isNew}
                  >
                    <div className="details">
                      <div className="name">{apt.patient_name}</div>
                      <div className="therapy">{apt.therapy_name}</div>
                      <div className="datetime">
                        {new Date(apt.appointment_date).toLocaleDateString()} at{' '}
                        {apt.appointment_time}
                      </div>
                    </div>
                    <div className="status">{apt.status}</div>
                  </AppointmentItem>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2>
              <Users size={20} />
              Recent Users
            </h2>
          </CardHeader>
          <CardContent>
            {recentUsers.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#999' }}>No users yet</p>
            ) : (
              recentUsers.map((user) => {
                const isNew = new Date(user.created_at).getTime() > fiveMinutesAgo;
                return (
                  <UserItem key={user.id} isNew={isNew}>
                    <div className="avatar">{getInitials(user.name)}</div>
                    <div className="details">
                      <div className="name">{user.name}</div>
                      <div className="info">
                        {user.role} • {user.email}
                      </div>
                    </div>
                  </UserItem>
                );
              })
            )}
          </CardContent>
        </Card>
      </ContentGrid>

      <div style={{ 
        marginTop: '2rem', 
        textAlign: 'center', 
        color: '#999', 
        fontSize: '0.85rem' 
      }}>
        Last updated: {new Date(lastFetch).toLocaleTimeString()} • 
        Auto-refreshing every 5 seconds
      </div>
    </DashboardContainer>
  );
};

export default AdminDashboard;
