import React, { useState } from 'react';
import styled from 'styled-components';
import { Users, Calendar, Activity, Clock, Star, AlertTriangle } from 'lucide-react';
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

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
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
  
  @media (max-width: 768px) {
    padding: 1rem;
    
    h2 {
      font-size: 1.1rem;
    }
  }
`;

const CardContent = styled.div`
  padding: 1.5rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const PatientList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PatientItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 10px;
  flex-wrap: wrap;
  
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
    min-width: 150px;
    
    .name {
      font-weight: 600;
      color: #333;
      margin-bottom: 0.25rem;
    }
    
    .therapy {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 0.25rem;
    }
    
    .status {
      font-size: 0.8rem;
      color: #007a5f;
      font-weight: 500;
    }
  }
  
  .rating {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: #ffc107;
    font-size: 0.9rem;
    font-weight: 600;
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
      min-width: 120px;
      
      .name {
        font-size: 0.9rem;
      }
      
      .therapy {
        font-size: 0.85rem;
      }
      
      .status {
        font-size: 0.75rem;
      }
    }
    
    .rating {
      font-size: 0.85rem;
    }
  }
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
      case APPOINTMENT_STATUS.IN_PROGRESS: return '#ffc107';
      case APPOINTMENT_STATUS.COMPLETED: return '#28a745';
      default: return '#6c757d';
    }
  }};
  flex-wrap: wrap;
  
  .time {
    min-width: 80px;
    text-align: center;
    flex-shrink: 0;
    
    .hour {
      font-size: 1.2rem;
      font-weight: bold;
      color: #333;
      line-height: 1;
    }
    
    .period {
      font-size: 0.8rem;
      color: #666;
    }
  }
  
  .details {
    flex: 1;
    min-width: 150px;
    
    .patient {
      font-weight: 600;
      color: #333;
      margin-bottom: 0.25rem;
    }
    
    .therapy {
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
        case APPOINTMENT_STATUS.IN_PROGRESS: return 'rgba(255, 193, 7, 0.1)';
        case APPOINTMENT_STATUS.COMPLETED: return 'rgba(40, 167, 69, 0.1)';
        default: return 'rgba(108, 117, 125, 0.1)';
      }
    }};
    color: ${props => {
      switch (props.status) {
        case APPOINTMENT_STATUS.SCHEDULED: return '#007a5f';
        case APPOINTMENT_STATUS.IN_PROGRESS: return '#ffc107';
        case APPOINTMENT_STATUS.COMPLETED: return '#28a745';
        default: return '#6c757d';
      }
    }};
  }
  
  @media (max-width: 768px) {
    padding: 0.8rem;
    gap: 0.8rem;
    
    .time {
      min-width: 60px;
      
      .hour {
        font-size: 1rem;
      }
      
      .period {
        font-size: 0.7rem;
      }
    }
    
    .details {
      min-width: 120px;
      
      .patient {
        font-size: 0.9rem;
      }
      
      .therapy {
        font-size: 0.85rem;
      }
    }
    
    .status {
      font-size: 0.75rem;
      padding: 0.2rem 0.6rem;
    }
  }
`;

const AlertsSection = styled.div`
  grid-column: 1 / -1;
  margin-top: 1rem;
`;

const AlertItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 10px;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  
  .icon {
    color: #ffc107;
    flex-shrink: 0;
  }
  
  .content {
    flex: 1;
    min-width: 200px;
    
    .title {
      font-weight: 600;
      color: #333;
      margin-bottom: 0.25rem;
    }
    
    .message {
      color: #666;
      font-size: 0.9rem;
    }
  }
  
  .time {
    color: #999;
    font-size: 0.8rem;
  }
  
  @media (max-width: 768px) {
    padding: 0.8rem;
    gap: 0.8rem;
    
    .content {
      min-width: 150px;
      
      .title {
        font-size: 0.9rem;
      }
      
      .message {
        font-size: 0.85rem;
      }
    }
    
    .time {
      font-size: 0.75rem;
    }
  }
`;

// Mock data
const mockPatients = [
  {
    id: '1',
    name: 'Priya Sharma',
    therapy: 'Vamana Course',
    progress: 'Session 3 of 5',
    rating: 4.8,
    status: 'active'
  },
  {
    id: '2',
    name: 'Raj Kumar',
    therapy: 'Basti Series',
    progress: 'Session 8 of 15',
    rating: 4.9,
    status: 'active'
  },
  {
    id: '3',
    name: 'Meera Patel',
    therapy: 'Virechana',
    progress: 'Completed',
    rating: 5.0,
    status: 'completed'
  }
];

const mockAppointments = [
  {
    id: '1',
    patient: 'Priya Sharma',
    therapy: 'Vamana Therapy',
    time: '09:00 AM',
    status: APPOINTMENT_STATUS.SCHEDULED
  },
  {
    id: '2',
    patient: 'Raj Kumar',
    therapy: 'Basti Treatment',
    time: '11:00 AM',
    status: APPOINTMENT_STATUS.IN_PROGRESS
  },
  {
    id: '3',
    patient: 'Anita Singh',
    therapy: 'Nasya Therapy',
    time: '02:00 PM',
    status: APPOINTMENT_STATUS.SCHEDULED
  }
];

const mockAlerts = [
  {
    id: '1',
    title: 'Patient Preparation Required',
    message: 'Priya Sharma needs to fast for 12 hours before tomorrow\'s Vamana session',
    time: '2 hours ago'
  },
  {
    id: '2',
    title: 'Session Feedback Pending',
    message: 'Please review and update notes for Raj Kumar\'s completed Basti session',
    time: '4 hours ago'
  }
];

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [patients] = useState(mockPatients);
  const [appointments] = useState(mockAppointments);
  const [alerts] = useState(mockAlerts);

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatTime = (timeString) => {
    const [time, period] = timeString.split(' ');
    return { hour: time, period };
  };

  const stats = [
    {
      title: 'Total Patients',
      value: patients.length,
      color: 'rgba(0, 122, 95, 0.1)',
      icon: <Users size={24} color="#007a5f" />
    },
    {
      title: 'Today\'s Sessions',
      value: appointments.length,
      color: 'rgba(255, 193, 7, 0.1)',
      icon: <Calendar size={24} color="#ffc107" />
    },
    {
      title: 'Active Treatments',
      value: patients.filter(p => p.status === 'active').length,
      color: 'rgba(40, 167, 69, 0.1)',
      icon: <Activity size={24} color="#28a745" />
    },
    {
      title: 'Avg. Rating',
      value: (patients.reduce((acc, p) => acc + p.rating, 0) / patients.length).toFixed(1),
      color: 'rgba(255, 193, 7, 0.1)',
      icon: <Star size={24} color="#ffc107" />
    }
  ];

  return (
    <DashboardContainer>
      <Header>
        <h1>Good morning, Dr. {user?.name}! 👨‍⚕️</h1>
        <p>Manage your patients and therapy sessions with ease</p>
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
        <Card>
          <CardHeader>
            <h2>
              <Users size={20} />
              Recent Patients
            </h2>
          </CardHeader>
          <CardContent>
            <PatientList>
              {patients.map((patient) => (
                <PatientItem key={patient.id}>
                  <div className="avatar">
                    {getInitials(patient.name)}
                  </div>
                  <div className="details">
                    <div className="name">{patient.name}</div>
                    <div className="therapy">{patient.therapy}</div>
                    <div className="status">{patient.progress}</div>
                  </div>
                  <div className="rating">
                    <Star size={16} fill="currentColor" />
                    {patient.rating}
                  </div>
                </PatientItem>
              ))}
            </PatientList>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2>
              <Clock size={20} />
              Today's Schedule
            </h2>
          </CardHeader>
          <CardContent>
            <PatientList>
              {appointments.map((appointment) => {
                const timeObj = formatTime(appointment.time);
                return (
                  <AppointmentItem key={appointment.id} status={appointment.status}>
                    <div className="time">
                      <div className="hour">{timeObj.hour}</div>
                      <div className="period">{timeObj.period}</div>
                    </div>
                    <div className="details">
                      <div className="patient">{appointment.patient}</div>
                      <div className="therapy">{appointment.therapy}</div>
                    </div>
                    <div className="status">{appointment.status}</div>
                  </AppointmentItem>
                );
              })}
            </PatientList>
          </CardContent>
        </Card>
      </ContentGrid>

      <AlertsSection>
        <Card>
          <CardHeader>
            <h2>
              <AlertTriangle size={20} />
              Important Alerts
            </h2>
          </CardHeader>
          <CardContent style={{ padding: 0 }}>
            {alerts.map((alert) => (
              <AlertItem key={alert.id}>
                <div className="icon">
                  <AlertTriangle size={20} />
                </div>
                <div className="content">
                  <div className="title">{alert.title}</div>
                  <div className="message">{alert.message}</div>
                </div>
                <div className="time">{alert.time}</div>
              </AlertItem>
            ))}
          </CardContent>
        </Card>
      </AlertsSection>
    </DashboardContainer>
  );
};

export default DoctorDashboard;