import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Calendar, Clock, User, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  
  h1 {
    color: #007a5f;
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #666;
    font-size: 1.1rem;
  }
`;

const StatsBar = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  
  .stat-value {
    font-size: 2rem;
    font-weight: bold;
    color: #007a5f;
    margin-bottom: 0.5rem;
  }
  
  .stat-label {
    color: #666;
    font-size: 0.875rem;
  }
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  border: 2px solid ${props => props.active ? '#007a5f' : '#e0e0e0'};
  background: ${props => props.active ? '#007a5f' : 'white'};
  color: ${props => props.active ? 'white' : '#666'};
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    border-color: #007a5f;
    background: ${props => props.active ? '#005a45' : 'rgba(0, 122, 95, 0.1)'};
  }
  
  .count {
    background: ${props => props.active ? 'rgba(255,255,255,0.3)' : '#007a5f'};
    color: white;
    padding: 0.125rem 0.5rem;
    border-radius: 12px;
    font-size: 0.875rem;
  }
`;

const AppointmentsGrid = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const AppointmentCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-left: 5px solid ${props => {
    switch(props.status) {
      case 'pending': return '#ffc107';
      case 'confirmed': return '#28a745';
      case 'completed': return '#007bff';
      case 'cancelled': return '#dc3545';
      default: return '#e0e0e0';
    }
  }};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
`;

const TherapyName = styled.h3`
  color: #333;
  font-size: 1.3rem;
  margin: 0 0 0.5rem 0;
`;

const StatusBadge = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => {
    switch(props.status) {
      case 'pending': return '#fff3cd';
      case 'confirmed': return '#d4edda';
      case 'completed': return '#d1ecf1';
      case 'cancelled': return '#f8d7da';
      default: return '#e0e0e0';
    }
  }};
  color: ${props => {
    switch(props.status) {
      case 'pending': return '#856404';
      case 'confirmed': return '#155724';
      case 'completed': return '#0c5460';
      case 'cancelled': return '#721c24';
      default: return '#666';
    }
  }};
`;

const CardBody = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  svg {
    color: #007a5f;
    flex-shrink: 0;
  }
  
  .info-content {
    .label {
      font-size: 0.875rem;
      color: #999;
      margin-bottom: 0.25rem;
    }
    
    .value {
      font-size: 1rem;
      color: #333;
      font-weight: 500;
    }
  }
`;

const NotesSection = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 10px;
  margin-top: 1rem;
  
  .notes-label {
    font-size: 0.875rem;
    color: #999;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .notes-content {
    color: #666;
    line-height: 1.6;
  }
`;

const CardFooter = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
`;

const ActionButton = styled.button`
  padding: 0.625rem 1.25rem;
  border: 2px solid ${props => props.variant === 'danger' ? '#dc3545' : '#007a5f'};
  background: ${props => props.variant === 'danger' ? 'white' : props.variant === 'outline' ? 'white' : '#007a5f'};
  color: ${props => props.variant === 'danger' ? '#dc3545' : props.variant === 'outline' ? '#007a5f' : 'white'};
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${props => props.variant === 'danger' ? '#dc3545' : '#007a5f'};
    color: white;
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  
  svg {
    margin-bottom: 1.5rem;
    opacity: 0.5;
  }
  
  h3 {
    color: #333;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #666;
    margin-bottom: 2rem;
  }
`;

const BookButton = styled.button`
  padding: 1rem 2rem;
  background: #007a5f;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #005a45;
    transform: translateY(-2px);
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
`;

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, [activeFilter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const statusParam = activeFilter !== 'all' ? `?status=${activeFilter}` : '';
      
      const response = await fetch(`http://localhost:3002/api/appointments/my-appointments${statusParam}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const data = await response.json();
      setAppointments(data.appointments || []);
      
      // Calculate stats from all appointments
      if (activeFilter === 'all') {
        const allResponse = await fetch('http://localhost:3002/api/appointments/my-appointments', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const allData = await allResponse.json();
        const all = allData.appointments || [];
        
        setStats({
          total: all.length,
          pending: all.filter(a => a.status === 'pending').length,
          confirmed: all.filter(a => a.status === 'confirmed').length,
          completed: all.filter(a => a.status === 'completed').length,
          cancelled: all.filter(a => a.status === 'cancelled').length
        });
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3002/api/appointments/${appointmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to cancel appointment');
      }

      toast.success('Appointment cancelled successfully');
      fetchAppointments();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('Failed to cancel appointment');
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending':
        return <AlertCircle size={18} />;
      case 'confirmed':
        return <CheckCircle size={18} />;
      case 'completed':
        return <CheckCircle size={18} />;
      case 'cancelled':
        return <XCircle size={18} />;
      default:
        return <AlertCircle size={18} />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (loading) {
    return <Container><LoadingState>Loading your appointments...</LoadingState></Container>;
  }

  return (
    <Container>
      <Header>
        <h1>My Appointments 📅</h1>
        <p>View and manage all your therapy sessions</p>
      </Header>

      {activeFilter === 'all' && stats.total > 0 && (
        <StatsBar>
          <StatCard>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Appointments</div>
          </StatCard>
          <StatCard>
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Pending Approval</div>
          </StatCard>
          <StatCard>
            <div className="stat-value">{stats.confirmed}</div>
            <div className="stat-label">Confirmed</div>
          </StatCard>
          <StatCard>
            <div className="stat-value">{stats.completed}</div>
            <div className="stat-label">Completed</div>
          </StatCard>
        </StatsBar>
      )}

      <FilterTabs>
        <Tab active={activeFilter === 'all'} onClick={() => setActiveFilter('all')}>
          All Appointments
          {activeFilter === 'all' && <span className="count">{stats.total}</span>}
        </Tab>
        <Tab active={activeFilter === 'pending'} onClick={() => setActiveFilter('pending')}>
          ⏳ Pending
          {activeFilter === 'all' && <span className="count">{stats.pending}</span>}
        </Tab>
        <Tab active={activeFilter === 'confirmed'} onClick={() => setActiveFilter('confirmed')}>
          ✅ Confirmed
          {activeFilter === 'all' && <span className="count">{stats.confirmed}</span>}
        </Tab>
        <Tab active={activeFilter === 'completed'} onClick={() => setActiveFilter('completed')}>
          ✨ Completed
          {activeFilter === 'all' && <span className="count">{stats.completed}</span>}
        </Tab>
        <Tab active={activeFilter === 'cancelled'} onClick={() => setActiveFilter('cancelled')}>
          ❌ Cancelled
          {activeFilter === 'all' && <span className="count">{stats.cancelled}</span>}
        </Tab>
      </FilterTabs>

      {appointments.length === 0 ? (
        <EmptyState>
          <Calendar size={64} color="#ccc" />
          <h3>No Appointments Found</h3>
          <p>
            {activeFilter === 'all' 
              ? "You haven't booked any appointments yet. Start your wellness journey today!"
              : `You don't have any ${activeFilter} appointments.`
            }
          </p>
          <BookButton onClick={() => navigate('/book-appointment')}>
            Book Your First Appointment
          </BookButton>
        </EmptyState>
      ) : (
        <AppointmentsGrid>
          {appointments.map(appointment => (
            <AppointmentCard key={appointment.id} status={appointment.status}>
              <CardHeader>
                <div>
                  <TherapyName>{appointment.therapy_name}</TherapyName>
                  <StatusBadge status={appointment.status}>
                    {getStatusIcon(appointment.status)}
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </StatusBadge>
                </div>
              </CardHeader>

              <CardBody>
                <InfoItem>
                  <Calendar size={20} />
                  <div className="info-content">
                    <div className="label">Date</div>
                    <div className="value">{formatDate(appointment.appointment_date)}</div>
                  </div>
                </InfoItem>

                <InfoItem>
                  <Clock size={20} />
                  <div className="info-content">
                    <div className="label">Time</div>
                    <div className="value">{formatTime(appointment.appointment_time)}</div>
                  </div>
                </InfoItem>

                <InfoItem>
                  <Clock size={20} />
                  <div className="info-content">
                    <div className="label">Duration</div>
                    <div className="value">{appointment.duration || 'N/A'}</div>
                  </div>
                </InfoItem>

                {appointment.doctor_name && (
                  <InfoItem>
                    <User size={20} />
                    <div className="info-content">
                      <div className="label">Doctor</div>
                      <div className="value">{appointment.doctor_name}</div>
                    </div>
                  </InfoItem>
                )}

                <InfoItem>
                  <FileText size={20} />
                  <div className="info-content">
                    <div className="label">Price</div>
                    <div className="value">₹{appointment.price}</div>
                  </div>
                </InfoItem>
              </CardBody>

              {appointment.notes && (
                <NotesSection>
                  <div className="notes-label">
                    <FileText size={16} />
                    Notes
                  </div>
                  <div className="notes-content">{appointment.notes}</div>
                </NotesSection>
              )}

              <CardFooter>
                {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                  <ActionButton 
                    variant="danger"
                    onClick={() => handleCancelAppointment(appointment.id)}
                  >
                    <XCircle size={18} />
                    Cancel Appointment
                  </ActionButton>
                )}

                {appointment.status === 'completed' && (
                  <ActionButton variant="outline" disabled>
                    <CheckCircle size={18} />
                    Session Completed
                  </ActionButton>
                )}
              </CardFooter>
            </AppointmentCard>
          ))}
        </AppointmentsGrid>
      )}
    </Container>
  );
};

export default MyAppointments;
