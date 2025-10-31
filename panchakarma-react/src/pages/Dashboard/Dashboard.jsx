import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { USER_ROLES } from '../../types';
import PatientDashboard from './PatientDashboard';
import DoctorDashboard from './DoctorDashboard';
import AdminDashboard from './AdminDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  switch (user.role) {
    case USER_ROLES.PATIENT:
      return <PatientDashboard />;
    case USER_ROLES.DOCTOR:
      return <DoctorDashboard />;
    case USER_ROLES.ADMIN:
      return <AdminDashboard />;
    default:
      return <div>Unknown user role</div>;
  }
};

export default Dashboard;