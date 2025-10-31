import React, { useState } from 'react';
import styled from 'styled-components';
import { Users, Calendar, BarChart3, Settings, TrendingUp, Activity, Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const DashboardContainer = styled.div`
  padding: 0;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #007a5f 0%, #00b88a 100%);
  color: white;
  padding: 2rem;
  border-radius: 15px;
  margin-bottom: 2rem;
  
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
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
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
    
    .change {
      font-size: 0.8rem;
      margin-top: 0.25rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
      
      &.positive {
        color: #28a745;
      }
      
      &.negative {
        color: #dc3545;
      }
    }
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  
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
  
  .filter {
    display: flex;
    gap: 0.5rem;
    
    button {
      padding: 0.5rem 1rem;
      border: 1px solid #e0e0e0;
      background: white;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
      
      &.active {
        background: #007a5f;
        color: white;
        border-color: #007a5f;
      }
      
      &:hover:not(.active) {
        background: #f8f9fa;
      }
    }
  }
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const ChartPlaceholder = styled.div`
  height: 300px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 1.1rem;
  text-align: center;
  
  .placeholder-content {
    max-width: 200px;
  }
`;

const UserList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const UserItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 10px;
  
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
  }
  
  .details {
    flex: 1;
    
    .name {
      font-weight: 600;
      color: #333;
      margin-bottom: 0.25rem;
    }
    
    .role {
      color: #666;
      font-size: 0.9rem;
      text-transform: capitalize;
    }
  }
  
  .status {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
    background: rgba(40, 167, 69, 0.1);
    color: #28a745;
  }
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: start;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
  
  .icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: ${props => props.iconBg || 'rgba(0, 122, 95, 0.1)'};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.iconColor || '#007a5f'};
  }
  
  .content {
    flex: 1;
    
    .title {
      font-weight: 600;
      color: #333;
      margin-bottom: 0.25rem;
      font-size: 0.95rem;
    }
    
    .description {
      color: #666;
      font-size: 0.85rem;
      line-height: 1.4;
    }
    
    .time {
      color: #999;
      font-size: 0.75rem;
      margin-top: 0.25rem;
    }
  }
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 2rem;
`;

const ActionButton = styled.button`
  padding: 1rem;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #007a5f;
    background: rgba(0, 122, 95, 0.05);
  }
  
  .icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: ${props => props.iconBg || 'rgba(0, 122, 95, 0.1)'};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.iconColor || '#007a5f'};
  }
`;

// Mock data
const mockUsers = [
  {
    id: '1',
    name: 'Dr. Anjali Gupta',
    role: 'doctor',
    status: 'active',
    lastActive: '2 minutes ago'
  },
  {
    id: '2',
    name: 'Priya Sharma',
    role: 'patient',
    status: 'active',
    lastActive: '5 minutes ago'
  },
  {
    id: '3',
    name: 'Dr. Rajesh Kumar',
    role: 'doctor',
    status: 'active',
    lastActive: '10 minutes ago'
  },
  {
    id: '4',
    name: 'Meera Patel',
    role: 'patient',
    status: 'active',
    lastActive: '15 minutes ago'
  }
];

const mockActivities = [
  {
    id: '1',
    type: 'user_registered',
    title: 'New User Registration',
    description: 'Priya Sharma registered as a patient',
    time: '10 minutes ago',
    icon: Users,
    iconBg: 'rgba(0, 122, 95, 0.1)',
    iconColor: '#007a5f'
  },
  {
    id: '2',
    type: 'appointment_booked',
    title: 'Appointment Scheduled',
    description: 'New Vamana therapy session booked for tomorrow',
    time: '25 minutes ago',
    icon: Calendar,
    iconBg: 'rgba(255, 193, 7, 0.1)',
    iconColor: '#ffc107'
  },
  {
    id: '3',
    type: 'system_alert',
    title: 'System Maintenance',
    description: 'Scheduled maintenance completed successfully',
    time: '2 hours ago',
    icon: Settings,
    iconBg: 'rgba(108, 117, 125, 0.1)',
    iconColor: '#6c757d'
  }
];

const AdminDashboard = () => {
  const [users] = useState(mockUsers);
  const [activities] = useState(mockActivities);
  const [timeFilter, setTimeFilter] = useState('week');

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      color: 'rgba(0, 122, 95, 0.1)',
      icon: <Users size={24} color="#007a5f" />
    },
    {
      title: 'Active Sessions',
      value: '456',
      change: '+8%',
      changeType: 'positive',
      color: 'rgba(255, 193, 7, 0.1)',
      icon: <Activity size={24} color="#ffc107" />
    },
    {
      title: 'Monthly Revenue',
      value: '₹2.4L',
      change: '+15%',
      changeType: 'positive',
      color: 'rgba(40, 167, 69, 0.1)',
      icon: <TrendingUp size={24} color="#28a745" />
    },
    {
      title: 'System Health',
      value: '99.8%',
      change: 'Optimal',
      changeType: 'positive',
      color: 'rgba(23, 162, 184, 0.1)',
      icon: <Shield size={24} color="#17a2b8" />
    }
  ];

  return (
    <DashboardContainer>
      <Header>
        <h1>System Overview 🚀</h1>
        <p>Manage your Panchakarma platform and monitor key metrics</p>
      </Header>

      <StatsGrid>
        {stats.map((stat, index) => (
          <StatCard key={index} color={stat.color}>
            <div className="icon">
              {stat.icon}
            </div>
            <div className="content">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
              <div className={`change ${stat.changeType}`}>
                <TrendingUp size={12} />
                {stat.change} from last month
              </div>
            </div>
          </StatCard>
        ))}
      </StatsGrid>

      <ContentGrid>
        <Card>
          <CardHeader>
            <h2>
              <BarChart3 size={20} />
              Analytics Overview
            </h2>
            <div className="filter">
              <button 
                className={timeFilter === 'day' ? 'active' : ''}
                onClick={() => setTimeFilter('day')}
              >
                Day
              </button>
              <button 
                className={timeFilter === 'week' ? 'active' : ''}
                onClick={() => setTimeFilter('week')}
              >
                Week
              </button>
              <button 
                className={timeFilter === 'month' ? 'active' : ''}
                onClick={() => setTimeFilter('month')}
              >
                Month
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <ChartPlaceholder>
              <div className="placeholder-content">
                📊 Interactive charts will be displayed here
                <br />
                <small>Revenue, appointments, and user growth</small>
              </div>
            </ChartPlaceholder>
          </CardContent>
        </Card>

        <div>
          <Card>
            <CardHeader>
              <h2>
                <Users size={20} />
                Recent Users
              </h2>
            </CardHeader>
            <CardContent>
              <UserList>
                {users.map((userData) => (
                  <UserItem key={userData.id}>
                    <div className="avatar">
                      {getInitials(userData.name)}
                    </div>
                    <div className="details">
                      <div className="name">{userData.name}</div>
                      <div className="role">{userData.role}</div>
                    </div>
                    <div className="status">{userData.status}</div>
                  </UserItem>
                ))}
              </UserList>
            </CardContent>
          </Card>

          <Card style={{ marginTop: '2rem' }}>
            <CardHeader>
              <h2>
                <Activity size={20} />
                Recent Activity
              </h2>
            </CardHeader>
            <CardContent style={{ padding: 0 }}>
              {activities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <ActivityItem 
                    key={activity.id}
                    iconBg={activity.iconBg}
                    iconColor={activity.iconColor}
                  >
                    <div className="icon">
                      <Icon size={18} />
                    </div>
                    <div className="content">
                      <div className="title">{activity.title}</div>
                      <div className="description">{activity.description}</div>
                      <div className="time">{activity.time}</div>
                    </div>
                  </ActivityItem>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </ContentGrid>

      <QuickActions>
        <ActionButton iconBg="rgba(0, 122, 95, 0.1)" iconColor="#007a5f">
          <div className="icon">
            <Users size={20} />
          </div>
          Manage Users
        </ActionButton>
        <ActionButton iconBg="rgba(255, 193, 7, 0.1)" iconColor="#ffc107">
          <div className="icon">
            <Settings size={20} />
          </div>
          System Settings
        </ActionButton>
        <ActionButton iconBg="rgba(40, 167, 69, 0.1)" iconColor="#28a745">
          <div className="icon">
            <BarChart3 size={20} />
          </div>
          View Analytics
        </ActionButton>
        <ActionButton iconBg="rgba(220, 53, 69, 0.1)" iconColor="#dc3545">
          <div className="icon">
            <AlertCircle size={20} />
          </div>
          System Alerts
        </ActionButton>
      </QuickActions>
    </DashboardContainer>
  );
};

export default AdminDashboard;