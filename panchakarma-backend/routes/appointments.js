const express = require('express');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Middleware to verify JWT token
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

// Create new appointment
router.post('/', authenticateToken, (req, res) => {
  try {
    const { therapyId, preferredDate, preferredTime, notes, doctorId } = req.body;
    
    if (!therapyId || !preferredDate || !preferredTime) {
      return res.status(400).json({ message: 'Therapy, date, and time are required' });
    }

    const therapy = therapies.find(t => t.id === parseInt(therapyId));
    if (!therapy) {
      return res.status(404).json({ message: 'Therapy not found' });
    }

    const appointment = {
      id: appointments.length + 1,
      patientId: req.user.userId,
      therapyId: parseInt(therapyId),
      doctorId: doctorId || null,
      preferredDate,
      preferredTime,
      status: 'pending',
      notes: notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    appointments.push(appointment);

    // Get appointment with populated data
    const appointmentWithDetails = {
      ...appointment,
      therapy: therapy,
      patient: users.find(u => u.id === req.user.userId),
      doctor: doctorId ? users.find(u => u.id === doctorId) : null
    };

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment: appointmentWithDetails
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user appointments
router.get('/my-appointments', authenticateToken, (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let userAppointments = appointments.filter(apt => 
      apt.patientId === req.user.userId || 
      (req.user.role === 'doctor' && apt.doctorId === req.user.userId)
    );

    // Filter by status
    if (status && status !== 'all') {
      userAppointments = userAppointments.filter(apt => apt.status === status);
    }

    // Sort by date (newest first)
    userAppointments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedAppointments = userAppointments.slice(startIndex, endIndex);

    // Populate appointments with therapy and user details
    const appointmentsWithDetails = paginatedAppointments.map(apt => {
      const therapy = therapies.find(t => t.id === apt.therapyId);
      const patient = users.find(u => u.id === apt.patientId);
      const doctor = apt.doctorId ? users.find(u => u.id === apt.doctorId) : null;
      
      return {
        ...apt,
        therapy: therapy ? { name: therapy.name, duration: therapy.duration, price: therapy.price } : null,
        patient: patient ? { name: patient.name, email: patient.email } : null,
        doctor: doctor ? { name: doctor.name, email: doctor.email } : null
      };
    });

    res.json({
      appointments: appointmentsWithDetails,
      total: userAppointments.length,
      page: parseInt(page),
      totalPages: Math.ceil(userAppointments.length / limit)
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all appointments (admin/doctor only)
router.get('/', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { status, therapyId, date, page = 1, limit = 10 } = req.query;
    let filteredAppointments = [...appointments];

    // Filter by status
    if (status && status !== 'all') {
      filteredAppointments = filteredAppointments.filter(apt => apt.status === status);
    }

    // Filter by therapy
    if (therapyId) {
      filteredAppointments = filteredAppointments.filter(apt => apt.therapyId === parseInt(therapyId));
    }

    // Filter by date
    if (date) {
      filteredAppointments = filteredAppointments.filter(apt => 
        apt.preferredDate === date
      );
    }

    // For doctors, only show their appointments
    if (req.user.role === 'doctor') {
      filteredAppointments = filteredAppointments.filter(apt => 
        apt.doctorId === req.user.userId || apt.doctorId === null
      );
    }

    // Sort by date
    filteredAppointments.sort((a, b) => new Date(a.preferredDate) - new Date(b.preferredDate));

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedAppointments = filteredAppointments.slice(startIndex, endIndex);

    // Populate appointments with details
    const appointmentsWithDetails = paginatedAppointments.map(apt => {
      const therapy = therapies.find(t => t.id === apt.therapyId);
      const patient = users.find(u => u.id === apt.patientId);
      const doctor = apt.doctorId ? users.find(u => u.id === apt.doctorId) : null;
      
      return {
        ...apt,
        therapy: therapy,
        patient: patient ? { id: patient.id, name: patient.name, email: patient.email, phone: patient.phone } : null,
        doctor: doctor ? { id: doctor.id, name: doctor.name, email: doctor.email } : null
      };
    });

    res.json({
      appointments: appointmentsWithDetails,
      total: filteredAppointments.length,
      page: parseInt(page),
      totalPages: Math.ceil(filteredAppointments.length / limit)
    });
  } catch (error) {
    console.error('Get all appointments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update appointment status
router.put('/:appointmentId/status', authenticateToken, (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status, notes } = req.body;

    const appointmentIndex = appointments.findIndex(apt => apt.id === parseInt(appointmentId));
    if (appointmentIndex === -1) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const appointment = appointments[appointmentIndex];

    // Check permissions
    if (req.user.role === 'patient' && appointment.patientId !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (req.user.role === 'doctor' && appointment.doctorId !== req.user.userId && appointment.doctorId !== null) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update appointment
    appointments[appointmentIndex] = {
      ...appointment,
      status,
      notes: notes || appointment.notes,
      updatedAt: new Date()
    };

    res.json({
      message: 'Appointment status updated successfully',
      appointment: appointments[appointmentIndex]
    });
  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Assign doctor to appointment
router.put('/:appointmentId/assign-doctor', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { appointmentId } = req.params;
    const { doctorId } = req.body;

    const appointmentIndex = appointments.findIndex(apt => apt.id === parseInt(appointmentId));
    if (appointmentIndex === -1) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const doctor = users.find(u => u.id === doctorId && u.role === 'doctor');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    appointments[appointmentIndex].doctorId = doctorId;
    appointments[appointmentIndex].status = 'scheduled';
    appointments[appointmentIndex].updatedAt = new Date();

    res.json({
      message: 'Doctor assigned successfully',
      appointment: appointments[appointmentIndex]
    });
  } catch (error) {
    console.error('Assign doctor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel appointment
router.delete('/:appointmentId', authenticateToken, (req, res) => {
  try {
    const { appointmentId } = req.params;
    
    const appointmentIndex = appointments.findIndex(apt => apt.id === parseInt(appointmentId));
    if (appointmentIndex === -1) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const appointment = appointments[appointmentIndex];

    // Check permissions
    if (req.user.role === 'patient' && appointment.patientId !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update status instead of deleting
    appointments[appointmentIndex] = {
      ...appointment,
      status: 'cancelled',
      updatedAt: new Date()
    };

    res.json({
      message: 'Appointment cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get available time slots
router.get('/available-slots', authenticateToken, (req, res) => {
  try {
    const { date, doctorId } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    // Get booked slots for the date
    const bookedSlots = appointments
      .filter(apt => 
        apt.preferredDate === date && 
        apt.status !== 'cancelled' &&
        (!doctorId || apt.doctorId === parseInt(doctorId))
      )
      .map(apt => apt.preferredTime);

    // Generate available slots (9 AM to 6 PM, 1-hour intervals)
    const allSlots = [];
    for (let hour = 9; hour < 18; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      allSlots.push(time);
    }

    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

    res.json({
      date,
      availableSlots,
      bookedSlots
    });
  } catch (error) {
    console.error('Get available slots error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;