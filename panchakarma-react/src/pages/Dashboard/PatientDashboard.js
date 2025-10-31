import React, { useState } from 'react';
import styled from 'styled-components';
import { Calendar, Activity, Bell, Heart, Plus, TrendingUp, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { APPOINTMENT_STATUS } from '../../types';

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
  
  button {
    background: #007a5f;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    
    &:hover {
      background: #005a45;
    }
  }
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const AppointmentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const AppointmentItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 10px;
  border-left: 4px solid ${props => {
    switch (props.status) {
      case APPOINTMENT_STATUS.SCHEDULED: return '#007a5f';
      case APPOINTMENT_STATUS.COMPLETED: return '#28a745';
      case APPOINTMENT_STATUS.CANCELLED: return '#dc3545';
      default: return '#6c757d';
    }
  }};
  
  .date {
    min-width: 60px;
    text-align: center;
    
    .day {
      font-size: 1.5rem;
      font-weight: bold;
      color: #333;
      line-height: 1;
    }
    
    .month {
      font-size: 0.8rem;
      color: #666;
      text-transform: uppercase;
    }
  }
  
  .details {
    flex: 1;
    
    .therapy {
      font-weight: 600;
      color: #333;
      margin-bottom: 0.25rem;
    }
    
    .time {
      color: #666;
      font-size: 0.9rem;
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
        case APPOINTMENT_STATUS.SCHEDULED: return 'rgba(0, 122, 95, 0.1)';
        case APPOINTMENT_STATUS.COMPLETED: return 'rgba(40, 167, 69, 0.1)';
        case APPOINTMENT_STATUS.CANCELLED: return 'rgba(220, 53, 69, 0.1)';
        default: return 'rgba(108, 117, 125, 0.1)';
      }
    }};
    color: ${props => {
      switch (props.status) {
        case APPOINTMENT_STATUS.SCHEDULED: return '#007a5f';
        case APPOINTMENT_STATUS.COMPLETED: return '#28a745';
        case APPOINTMENT_STATUS.CANCELLED: return '#dc3545';
        default: return '#6c757d';
      }
    }};
  }
`;

const ProgressCard = styled.div`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  
  .therapy-name {
    font-weight: 600;
    color: #333;
    margin-bottom: 0.5rem;
  }
  
  .progress-bar {
    background: #e0e0e0;
    border-radius: 10px;
    height: 8px;
    margin-bottom: 0.5rem;
    overflow: hidden;
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #007a5f, #00b88a);
      border-radius: 10px;
      transition: width 0.3s ease;
    }
  }
  
  .progress-text {
    font-size: 0.9rem;
    color: #666;
    display: flex;
    justify-content: space-between;
  }
`;

const NotificationItem = styled.div`
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
    background: rgba(0, 122, 95, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #007a5f;
  }
  
  .content {
    flex: 1;
    
    .title {
      font-weight: 600;
      color: #333;
      margin-bottom: 0.25rem;
      font-size: 0.95rem;
    }
    
    .message {
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

// Mock data - in a real app, this would come from API
const mockAppointments = [
  {
    id: '1',
    therapyName: 'Vamana Therapy',
    date: '2025-01-25',
    time: '10:00 AM',
    status: APPOINTMENT_STATUS.SCHEDULED
  },
  {
    id: '2',
    therapyName: 'Virechana Therapy',
    date: '2025-01-22',
    time: '2:00 PM',
    status: APPOINTMENT_STATUS.COMPLETED
  },
  {
    id: '3',
    therapyName: 'Basti Therapy',
    date: '2025-01-28',
    time: '11:00 AM',
    status: APPOINTMENT_STATUS.SCHEDULED
  }
];

const mockProgress = [
  {
    id: '1',
    therapyName: 'Vamana Course',
    completed: 3,
    total: 5,
    percentage: 60
  },
  {
    id: '2',
    therapyName: 'Basti Series',
    completed: 8,
    total: 15,
    percentage: 53
  }
];

const mockNotifications = [
  {
    id: '1',
    title: 'Upcoming Appointment',
    message: 'You have a Vamana therapy session tomorrow at 10:00 AM',
    time: '2 hours ago',
    type: 'appointment'
  },
  {
    id: '2',
    title: 'Pre-procedure Reminder',
    message: 'Please fast for 12 hours before your Vamana therapy session',
    time: '1 day ago',
    type: 'precaution'
  },
  {
    id: '3',
    title: 'Progress Milestone',
    message: 'Congratulations! You\'ve completed 60% of your Vamana course',
    time: '3 days ago',
    type: 'progress'
  }
];

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments] = useState(mockAppointments);
  const [progress] = useState(mockProgress);
  const [notifications] = useState(mockNotifications);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' })
    };
  };

  const stats = [
    {
      title: 'Upcoming Sessions',
      value: appointments.filter(apt => apt.status === APPOINTMENT_STATUS.SCHEDULED).length,
      color: 'rgba(0, 122, 95, 0.1)',
      icon: <Calendar size={24} color="#007a5f" />
    },
    {
      title: 'Active Therapies',
      value: progress.length,
      color: 'rgba(255, 193, 7, 0.1)',
      icon: <Heart size={24} color="#ffc107" />
    },
    {
      title: 'Completed Sessions',
      value: appointments.filter(apt => apt.status === APPOINTMENT_STATUS.COMPLETED).length,
      color: 'rgba(40, 167, 69, 0.1)',
      icon: <TrendingUp size={24} color="#28a745" />
    },
    {
      title: 'Notifications',
      value: notifications.length,
      color: 'rgba(220, 53, 69, 0.1)',
      icon: <Bell size={24} color="#dc3545" />
    }
  ];

  return (
    <DashboardContainer>
      <Header>
        <h1>Welcome back, {user?.name}! 🌿</h1>
        <p>Track your Panchakarma journey and stay on top of your wellness goals</p>
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
            </div>
          </StatCard>
        ))}
      </StatsGrid>

      <ContentGrid>
        <div>
          <Card>
            <CardHeader>
              <h2>
                <Calendar size={20} />
                Upcoming Appointments
              </h2>
              <button>
                <Plus size={16} />
                Book Session
              </button>
            </CardHeader>
            <CardContent>
              <AppointmentList>
                {appointments.map((appointment) => {
                  const dateObj = formatDate(appointment.date);
                  return (
                    <AppointmentItem key={appointment.id} status={appointment.status}>
                      <div className="date">
                        <div className="day">{dateObj.day}</div>
                        <div className="month">{dateObj.month}</div>
                      </div>
                      <div className="details">
                        <div className="therapy">{appointment.therapyName}</div>
                        <div className="time">{appointment.time}</div>
                      </div>
                      <div className="status">{appointment.status}</div>
                    </AppointmentItem>
                  );
                })}
              </AppointmentList>
            </CardContent>
          </Card>

          <Card style={{ marginTop: '2rem' }}>
            <CardHeader>
              <h2>
                <Activity size={20} />
                Therapy Progress
              </h2>
            </CardHeader>
            <CardContent>
              {progress.map((therapy) => (
                <ProgressCard key={therapy.id}>
                  <div className="therapy-name">{therapy.therapyName}</div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${therapy.percentage}%` }}
                    ></div>
                  </div>
                  <div className="progress-text">
                    <span>Session {therapy.completed} of {therapy.total}</span>
                    <span>{therapy.percentage}%</span>
                  </div>
                </ProgressCard>
              ))}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <h2>
                <Bell size={20} />
                Recent Notifications
              </h2>
            </CardHeader>
            <CardContent style={{ padding: 0 }}>
              {notifications.map((notification) => (
                <NotificationItem key={notification.id}>
                  <div className="icon">
                    {notification.type === 'appointment' && <Calendar size={18} />}
                    {notification.type === 'precaution' && <AlertCircle size={18} />}
                    {notification.type === 'progress' && <TrendingUp size={18} />}
                  </div>
                  <div className="content">
                    <div className="title">{notification.title}</div>
                    <div className="message">{notification.message}</div>
                    <div className="time">{notification.time}</div>
                  </div>
                </NotificationItem>
              ))}
            </CardContent>
          </Card>
        </div>
      </ContentGrid>
    </DashboardContainer>
  );
};

export default PatientDashboard;