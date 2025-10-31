const express = require('express');
const jwt = require('jsonwebtoken');
const { users, appointments, therapies } = require('../data/storage');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = decoded;
    next();
  });
};

// Get dashboard analytics
router.get('/dashboard', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const totalUsers = users.length;
    const totalAppointments = appointments.length;
    const totalTherapies = therapies.filter(t => t.availability).length;
    const pendingAppointments = appointments.filter(a => a.status === 'pending').length;

    // Monthly revenue calculation
    const currentMonth = new Date().getMonth();
    const monthlyRevenue = appointments
      .filter(a => a.status === 'completed' && new Date(a.createdAt).getMonth() === currentMonth)
      .reduce((total, appointment) => {
        const therapy = therapies.find(t => t.id === appointment.therapyId);
        return total + (therapy ? therapy.price : 0);
      }, 0);

    res.json({
      totalUsers,
      totalAppointments,
      totalTherapies,
      pendingAppointments,
      monthlyRevenue,
      usersByRole: {
        patients: users.filter(u => u.role === 'patient').length,
        doctors: users.filter(u => u.role === 'doctor').length,
        admins: users.filter(u => u.role === 'admin').length
      },
      appointmentsByStatus: {
        pending: appointments.filter(a => a.status === 'pending').length,
        scheduled: appointments.filter(a => a.status === 'scheduled').length,
        completed: appointments.filter(a => a.status === 'completed').length,
        cancelled: appointments.filter(a => a.status === 'cancelled').length
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;