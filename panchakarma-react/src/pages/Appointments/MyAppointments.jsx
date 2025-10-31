import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Calendar, Clock, User, Phone, MapPin, CheckCircle, AlertCircle, XCircle, Plus, Filter, Search, Download } from 'lucide-react';
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
`;

const ActionButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
`;

const FilterSection = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  
  .filter-row {
    display: grid;
    grid-template-columns: 1fr 200px 200px auto;
    gap: 1rem;
    align-items: end;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
`;

const SearchInput = styled.div`
  position: relative;
  
  input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: #007a5f;
    }
  }
  
  .search-icon {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
  }
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #007a5f;
  }
`;

const AppointmentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
`;

const AppointmentCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${props => {
    switch (props.status) {
      case 'pending': return '#ffc107';
      case 'scheduled': return '#007a5f';
      case 'completed': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  }};
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  
  background: ${props => {
    switch (props.status) {
      case 'pending': return 'rgba(255, 193, 7, 0.1)';
      case 'scheduled': return 'rgba(0, 122, 95, 0.1)';
      case 'completed': return 'rgba(40, 167, 69, 0.1)';
      case 'cancelled': return 'rgba(220, 53, 69, 0.1)';
      default: return 'rgba(108, 117, 125, 0.1)';
    }
  }};
  
  color: ${props => {
    switch (props.status) {
      case 'pending': return '#ffc107';
      case 'scheduled': return '#007a5f';
      case 'completed': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  }};
`;

const AppointmentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const TherapyName = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
`;

const AppointmentDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  color: #666;
  font-size: 0.9rem;
  
  svg {
    color: #007a5f;
  }
`;

const AppointmentActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
`;

const ActionBtn = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${props => props.variant === 'primary' && `
    background: #007a5f;
    color: white;
    
    &:hover {
      background: #005a45;
    }
  `}
  
  ${props => props.variant === 'secondary' && `
    background: #f8f9fa;
    color: #666;
    border: 1px solid #e0e0e0;
    
    &:hover {
      background: #e9ecef;
    }
  `}
  
  ${props => props.variant === 'danger' && `
    background: #dc3545;
    color: white;
    
    &:hover {
      background: #c82333;
    }
  `}
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
    margin: 0 0 2rem 0;
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

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchAppointments();
  }, [filter]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3002/api/appointments/my-appointments?status=${filter}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAppointments(data.appointments || []);
      } else {
        toast.error('Failed to fetch appointments');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to fetch appointments');
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
      
      if (response.ok) {
        toast.success('Appointment cancelled successfully');
        fetchAppointments();
      } else {
        toast.error('Failed to cancel appointment');
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('Failed to cancel appointment');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const filteredAppointments = appointments.filter(appointment =>
    appointment.therapy?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.doctor?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock size={16} />;
      case 'scheduled': return <CheckCircle size={16} />;
      case 'completed': return <CheckCircle size={16} />;
      case 'cancelled': return <XCircle size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  return (
    <Container>
      <Header>
        <div className="header-content">
          <div>
            <h1>My Appointments 📅</h1>
            <p>Manage and track your therapy sessions</p>
          </div>
          <ActionButton onClick={() => window.location.href = '/book-appointment'}>
            <Plus size={20} />
            Book New Appointment
          </ActionButton>
        </div>
      </Header>

      <FilterSection>
        <div className="filter-row">
          <SearchInput>
            <Search className="search-icon" size={16} />
            <input
              type="text"
              placeholder="Search appointments by therapy or doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchInput>
          
          <FilterSelect 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Appointments</option>
            <option value="pending">Pending</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </FilterSelect>
          
          <ActionBtn variant="secondary">
            <Download size={16} style={{ marginRight: '0.5rem' }} />
            Export
          </ActionBtn>
        </div>
      </FilterSection>

      {loading ? (
        <LoadingSpinner>
          <div className="spinner"></div>
        </LoadingSpinner>
      ) : filteredAppointments.length === 0 ? (
        <EmptyState>
          <Calendar className="empty-icon" />
          <h3>No appointments found</h3>
          <p>You haven't booked any appointments yet. Start your wellness journey today!</p>
          <ActionBtn 
            variant="primary" 
            onClick={() => window.location.href = '/book-appointment'}
          >
            Book Your First Appointment
          </ActionBtn>
        </EmptyState>
      ) : (
        <AppointmentGrid>
          {filteredAppointments.map(appointment => (
            <AppointmentCard key={appointment.id} status={appointment.status}>
              <AppointmentHeader>
                <div>
                  <TherapyName>{appointment.therapy?.name}</TherapyName>
                  <StatusBadge status={appointment.status}>
                    {getStatusIcon(appointment.status)}
                    {appointment.status}
                  </StatusBadge>
                </div>
              </AppointmentHeader>

              <AppointmentDetail>
                <Calendar size={16} />
                <span>{formatDate(appointment.preferredDate)}</span>
              </AppointmentDetail>

              <AppointmentDetail>
                <Clock size={16} />
                <span>{formatTime(appointment.preferredTime)}</span>
              </AppointmentDetail>

              {appointment.doctor && (
                <AppointmentDetail>
                  <User size={16} />
                  <span>{appointment.doctor.name}</span>
                </AppointmentDetail>
              )}

              <AppointmentDetail>
                <Phone size={16} />
                <span>Duration: {appointment.therapy?.duration}</span>
              </AppointmentDetail>

              {appointment.notes && (
                <AppointmentDetail style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>
                  <span>"{appointment.notes}"</span>
                </AppointmentDetail>
              )}

              <AppointmentActions>
                {appointment.status === 'pending' || appointment.status === 'scheduled' ? (
                  <>
                    <ActionBtn variant="secondary">
                      Reschedule
                    </ActionBtn>
                    <ActionBtn 
                      variant="danger"
                      onClick={() => handleCancelAppointment(appointment.id)}
                    >
                      Cancel
                    </ActionBtn>
                  </>
                ) : appointment.status === 'completed' ? (
                  <>
                    <ActionBtn variant="primary">
                      Book Again
                    </ActionBtn>
                    <ActionBtn variant="secondary">
                      Download Receipt
                    </ActionBtn>
                  </>
                ) : (
                  <ActionBtn 
                    variant="primary"
                    onClick={() => window.location.href = '/book-appointment'}
                  >
                    Book New Appointment
                  </ActionBtn>
                )}
              </AppointmentActions>
            </AppointmentCard>
          ))}
        </AppointmentGrid>
      )}
    </Container>
  );
};

export default MyAppointments;