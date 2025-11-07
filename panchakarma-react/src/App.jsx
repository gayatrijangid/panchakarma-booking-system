import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import ProtectedRoute from './components/Common/ProtectedRoute';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import LandingPage from './pages/LandingPage';
import BookAppointment from './pages/Appointments/BookAppointment';
import MyAppointments from './pages/Appointments/MyAppointments';
import UserProfile from './pages/Profile/UserProfile';
import TherapiesList from './pages/Therapies/TherapiesList.jsx';
import NotificationCenter from './pages/Notifications/NotificationCenter.jsx';
import TherapyProgress from './pages/Progress/TherapyProgress.jsx';
import { USER_ROLES } from './types';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          {/* 🔔 Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: { background: '#363636', color: '#fff' },
              success: { duration: 3000, theme: { primary: '#4aed88' } },
            }}
          />

          <Routes>
            {/* 🌍 Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* 🏠 Unified Dashboard Route (Patient / Doctor / Admin) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredRoles={[USER_ROLES.PATIENT, USER_ROLES.DOCTOR, USER_ROLES.ADMIN]}>
                  <Layout>
                    <Dashboard /> {/* It will auto-select based on user.role */}
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* 👩‍🦰 Patient Routes */}
            <Route
              path="/book-appointment"
              element={
                <ProtectedRoute requiredRoles={[USER_ROLES.PATIENT]}>
                  <Layout>
                    <BookAppointment />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/appointments"
              element={
                <ProtectedRoute requiredRoles={[USER_ROLES.PATIENT, USER_ROLES.DOCTOR, USER_ROLES.ADMIN]}>
                  <Layout>
                    <MyAppointments />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/therapy-progress"
              element={
                <ProtectedRoute requiredRoles={[USER_ROLES.PATIENT]}>
                  <Layout>
                    <TherapyProgress />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/therapies"
              element={
                <ProtectedRoute>
                  <Layout>
                    <TherapiesList />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* 👨‍⚕️ Doctor Routes */}
            <Route
              path="/patients"
              element={
                <ProtectedRoute requiredRoles={[USER_ROLES.DOCTOR, USER_ROLES.ADMIN]}>
                  <Layout>
                    <div>Patients Page</div>
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/therapy-sessions"
              element={
                <ProtectedRoute requiredRoles={[USER_ROLES.DOCTOR]}>
                  <Layout>
                    <div>Therapy Sessions Page</div>
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/schedule"
              element={
                <ProtectedRoute requiredRoles={[USER_ROLES.DOCTOR]}>
                  <Layout>
                    <div>Schedule Page</div>
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/reports"
              element={
                <ProtectedRoute requiredRoles={[USER_ROLES.DOCTOR, USER_ROLES.ADMIN]}>
                  <Layout>
                    <div>Reports Page</div>
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* 🧑‍💼 Admin Routes */}
            <Route
              path="/users"
              element={
                <ProtectedRoute requiredRoles={[USER_ROLES.ADMIN]}>
                  <Layout>
                    <div>User Management Page</div>
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/analytics"
              element={
                <ProtectedRoute requiredRoles={[USER_ROLES.ADMIN]}>
                  <Layout>
                    <div>Analytics Page</div>
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* 🔔 Common Routes */}
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Layout>
                    <NotificationCenter />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Layout>
                    <UserProfile />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Layout>
                    <div>Settings Page</div>
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* 🚧 Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
