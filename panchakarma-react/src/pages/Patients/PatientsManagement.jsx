import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Users, Search, Filter, Eye, Edit, Phone, Mail, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const Container = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
  
  h1 {
    color: #007a5f;
    font-size: 2rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const SearchBar = styled.div`
  position: relative;
  flex: 1;
  min-width: 300px;
  
  input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 3rem;
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
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
  }
`;

const FilterButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  color: #333;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #007a5f;
    color: #007a5f;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  border-left: 4px solid ${props => props.color || '#007a5f'};
  
  .stat-value {
    font-size: 2rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 0.25rem;
  }
  
  .stat-label {
    color: #666;
    font-size: 0.9rem;
  }
`;

const PatientsTable = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.5fr 1fr 1fr 1.5fr;
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  border-bottom: 2px solid #e0e0e0;
  font-weight: 600;
  color: #333;
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

const PatientRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.5fr 1fr 1fr 1.5fr;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #f8f9fa;
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    padding: 1.5rem;
    
    &:not(:last-child) {
      border-bottom: 2px solid #e0e0e0;
    }
  }
`;

const PatientInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  .patient-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #007a5f, #00b88a);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1rem;
  }
  
  .patient-details {
    .patient-name {
      font-weight: 600;
      color: #333;
      margin-bottom: 0.125rem;
    }
    
    .patient-id {
      font-size: 0.85rem;
      color: #999;
    }
  }
`;

const ContactInfo = styled.div`
  font-size: 0.9rem;
  color: #666;
  
  @media (max-width: 1024px) {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    &::before {
      content: 'Contact: ';
      font-weight: 600;
      color: #333;
    }
  }
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  background: ${props => {
    switch(props.status) {
      case 'Active': return '#d4edda';
      case 'Inactive': return '#f8d7da';
      default: return '#e0e0e0';
    }
  }};
  color: ${props => {
    switch(props.status) {
      case 'Active': return '#155724';
      case 'Inactive': return '#721c24';
      default: return '#666';
    }
  }};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem;
  background: none;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #007a5f;
    color: #007a5f;
    background: rgba(0, 122, 95, 0.05);
  }
`;

const PatientsManagement = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    totalPatients: 0,
    activePatients: 0,
    newThisMonth: 0,
    totalAppointments: 0
  });

  useEffect(() => {
    fetchPatients();
    fetchStats();
  }, []);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3002/api/patients', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPatients(data.patients || []);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3002/api/patients/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleViewPatient = (patientId) => {
    // Navigate to patient details page
    console.log('View patient:', patientId);
  };

  const handleEditPatient = (patientId) => {
    // Navigate to edit patient page
    console.log('Edit patient:', patientId);
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.phone.includes(searchQuery)
  );

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          Loading patients...
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <h1>
          <Users size={32} />
          Patients Management
        </h1>
      </Header>

      <StatsGrid>
        <StatCard color="#007a5f">
          <div className="stat-value">{stats.totalPatients}</div>
          <div className="stat-label">Total Patients</div>
        </StatCard>
        <StatCard color="#28a745">
          <div className="stat-value">{stats.activePatients}</div>
          <div className="stat-label">Active Patients</div>
        </StatCard>
        <StatCard color="#007bff">
          <div className="stat-value">{stats.newThisMonth}</div>
          <div className="stat-label">New This Month</div>
        </StatCard>
        <StatCard color="#ffa500">
          <div className="stat-value">{stats.totalAppointments}</div>
          <div className="stat-label">Total Appointments</div>
        </StatCard>
      </StatsGrid>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <SearchBar>
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchBar>
        <FilterButton>
          <Filter size={18} />
          Filter
        </FilterButton>
      </div>

      <PatientsTable>
        <TableHeader>
          <div>Patient</div>
          <div>Contact</div>
          <div>Email</div>
          <div>Therapies</div>
          <div>Status</div>
          <div>Actions</div>
        </TableHeader>
        
        {filteredPatients.length > 0 ? (
          filteredPatients.map(patient => (
            <PatientRow key={patient.id}>
              <PatientInfo>
                <div className="patient-avatar">{getInitials(patient.name)}</div>
                <div className="patient-details">
                  <div className="patient-name">{patient.name}</div>
                  <div className="patient-id">ID: {patient.id}</div>
                </div>
              </PatientInfo>
              <ContactInfo>{patient.phone}</ContactInfo>
              <ContactInfo>{patient.email}</ContactInfo>
              <div>{patient.therapyCount || 0}</div>
              <StatusBadge status={patient.status}>{patient.status}</StatusBadge>
              <ActionButtons>
                <ActionButton onClick={() => handleViewPatient(patient.id)}>
                  <Eye size={18} />
                </ActionButton>
                <ActionButton onClick={() => handleEditPatient(patient.id)}>
                  <Edit size={18} />
                </ActionButton>
              </ActionButtons>
            </PatientRow>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
            No patients found
          </div>
        )}
      </PatientsTable>
    </Container>
  );
};

export default PatientsManagement;
