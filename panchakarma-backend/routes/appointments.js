const express = require('express');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const notificationService = require('../services/notificationService');
const { getAvailableSlots, generateAllTimeSlots, groupTimeSlotsByPeriod, isValidTimeSlot } = require('../utils/timeSlots');
const { normalizeDate, isDateInPast, getTodayDate } = require('../utils/dateHelper');

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
router.post('/', authenticateToken, async (req, res) => {
  try {
    let { therapyId, appointmentDate, appointmentTime, notes, doctorId } = req.body;
    
    if (!therapyId || !appointmentDate || !appointmentTime) {
      return res.status(400).json({ message: 'Therapy, date, and time are required' });
    }

    // Normalize date format (handle DD-MM-YYYY, DD/MM/YYYY, etc.)
    appointmentDate = normalizeDate(appointmentDate);

    // Validate time slot
    if (!isValidTimeSlot(appointmentTime)) {
      return res.status(400).json({ 
        message: 'Invalid time slot. Please select a valid time from available slots.',
        hint: 'Use GET /api/appointments/slots/available?date=YYYY-MM-DD to see available times'
      });
    }

    // Check if date is in the past
    if (isDateInPast(appointmentDate)) {
      return res.status(400).json({ message: 'Cannot book appointments in the past' });
    }

    // Check if therapy exists
    const [therapies] = await pool.query('SELECT * FROM therapies WHERE id = ?', [therapyId]);
    if (therapies.length === 0) {
      return res.status(404).json({ message: 'Therapy not found' });
    }

    // Check if slot is available
    const [existingAppointments] = await pool.query(
      'SELECT * FROM appointments WHERE appointment_date = ? AND appointment_time = ? AND doctor_id = ? AND status != ?',
      [appointmentDate, appointmentTime, doctorId || null, 'cancelled']
    );

    if (existingAppointments.length > 0) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    // Insert appointment
    const [result] = await pool.query(
      'INSERT INTO appointments (patient_id, doctor_id, therapy_id, appointment_date, appointment_time, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req.user.userId, doctorId || null, therapyId, appointmentDate, appointmentTime, 'pending', notes || '']
    );

    // Get the created appointment with details
    const [appointment] = await pool.query(`
      SELECT 
        a.*,
        t.name as therapy_name, t.duration, t.price,
        p.name as patient_name, p.email as patient_email, p.phone as patient_phone,
        d.name as doctor_name, d.email as doctor_email
      FROM appointments a
      JOIN therapies t ON a.therapy_id = t.id
      JOIN users p ON a.patient_id = p.id
      LEFT JOIN users d ON a.doctor_id = d.id
      WHERE a.id = ?
    `, [result.insertId]);

    // Send booking notification
    try {
      await notificationService.sendAppointmentBookedNotification(req.user.userId, {
        therapyName: therapies[0].name,
        date: appointmentDate,
        time: appointmentTime
      });

      // Send therapy info notification
      const therapyDetails = therapies[0];
      await notificationService.sendTherapyInfoNotification(req.user.userId, {
        name: therapyDetails.name,
        duration: therapyDetails.duration,
        procedures: JSON.parse(therapyDetails.procedures || '[]'),
        benefits: JSON.parse(therapyDetails.benefits || '[]')
      });
    } catch (notificationError) {
      console.error('Appointment notification error:', notificationError);
    }

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment: appointment[0]
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get patient's own appointments
router.get('/my-appointments', authenticateToken, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT 
        a.*,
        t.name as therapy_name, t.duration, t.price, t.image as therapy_image,
        d.name as doctor_name, d.email as doctor_email, d.phone as doctor_phone
      FROM appointments a
      JOIN therapies t ON a.therapy_id = t.id
      LEFT JOIN users d ON a.doctor_id = d.id
      WHERE a.patient_id = ?
    `;
    
    const params = [req.user.userId];
    
    if (status && status !== 'all') {
      query += ' AND a.status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY a.appointment_date DESC, a.appointment_time DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);
    
    const [appointments] = await pool.query(query, params);
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM appointments WHERE patient_id = ?';
    const countParams = [req.user.userId];
    
    if (status && status !== 'all') {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }
    
    const [countResult] = await pool.query(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      appointments,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get my appointments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all appointments (doctor/admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { status, therapyId, date, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT 
        a.*,
        t.name as therapy_name, t.duration, t.price,
        p.name as patient_name, p.email as patient_email, p.phone as patient_phone,
        d.name as doctor_name, d.email as doctor_email
      FROM appointments a
      JOIN therapies t ON a.therapy_id = t.id
      JOIN users p ON a.patient_id = p.id
      LEFT JOIN users d ON a.doctor_id = d.id
      WHERE 1=1
    `;
    
    const params = [];
    
    // For doctors, only show their appointments
    if (req.user.role === 'doctor') {
      query += ' AND (a.doctor_id = ? OR a.doctor_id IS NULL)';
      params.push(req.user.userId);
    }
    
    if (status && status !== 'all') {
      query += ' AND a.status = ?';
      params.push(status);
    }
    
    if (therapyId) {
      query += ' AND a.therapy_id = ?';
      params.push(therapyId);
    }
    
    if (date) {
      query += ' AND a.appointment_date = ?';
      params.push(date);
    }
    
    query += ' ORDER BY a.appointment_date ASC, a.appointment_time ASC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);
    
    const [appointments] = await pool.query(query, params);
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM appointments a WHERE 1=1';
    const countParams = [];
    
    if (req.user.role === 'doctor') {
      countQuery += ' AND (a.doctor_id = ? OR a.doctor_id IS NULL)';
      countParams.push(req.user.userId);
    }
    
    if (status && status !== 'all') {
      countQuery += ' AND a.status = ?';
      countParams.push(status);
    }
    
    if (therapyId) {
      countQuery += ' AND a.therapy_id = ?';
      countParams.push(therapyId);
    }
    
    if (date) {
      countQuery += ' AND a.appointment_date = ?';
      countParams.push(date);
    }
    
    const [countResult] = await pool.query(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      appointments,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get all appointments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single appointment details
router.get('/:appointmentId', authenticateToken, async (req, res) => {
  try {
    const { appointmentId } = req.params;
    
    const [appointments] = await pool.query(`
      SELECT 
        a.*,
        t.name as therapy_name, t.description as therapy_description, t.duration, t.price, t.image as therapy_image,
        p.name as patient_name, p.email as patient_email, p.phone as patient_phone,
        d.name as doctor_name, d.email as doctor_email, d.phone as doctor_phone, d.specialization
      FROM appointments a
      JOIN therapies t ON a.therapy_id = t.id
      JOIN users p ON a.patient_id = p.id
      LEFT JOIN users d ON a.doctor_id = d.id
      WHERE a.id = ?
    `, [appointmentId]);
    
    if (appointments.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    const appointment = appointments[0];
    
    // Check permissions
    if (req.user.role === 'patient' && appointment.patient_id !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    if (req.user.role === 'doctor' && appointment.doctor_id !== req.user.userId && appointment.doctor_id !== null) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ appointment });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update appointment date/time (patient and doctor can update)
router.put('/:appointmentId', authenticateToken, async (req, res) => {
  try {
    const { appointmentId } = req.params;
    let { appointmentDate, appointmentTime, notes } = req.body;

    // Normalize date if provided
    if (appointmentDate) {
      appointmentDate = normalizeDate(appointmentDate);
    }
    
    // Get existing appointment
    const [appointments] = await pool.query('SELECT * FROM appointments WHERE id = ?', [appointmentId]);
    
    if (appointments.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    const appointment = appointments[0];
    
    // Check permissions
    if (req.user.role === 'patient' && appointment.patient_id !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    if (req.user.role === 'doctor' && appointment.doctor_id !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // If changing date/time, check availability
    if ((appointmentDate || appointmentTime) && (appointmentDate !== appointment.appointment_date || appointmentTime !== appointment.appointment_time)) {
      const newDate = appointmentDate || appointment.appointment_date;
      const newTime = appointmentTime || appointment.appointment_time;
      
      const [conflicts] = await pool.query(
        'SELECT * FROM appointments WHERE id != ? AND appointment_date = ? AND appointment_time = ? AND doctor_id = ? AND status != ?',
        [appointmentId, newDate, newTime, appointment.doctor_id, 'cancelled']
      );
      
      if (conflicts.length > 0) {
        return res.status(400).json({ message: 'This time slot is already booked' });
      }
    }

    // Update appointment
    const updates = {};
    if (appointmentDate) updates.appointment_date = appointmentDate;
    if (appointmentTime) updates.appointment_time = appointmentTime;
    if (notes !== undefined) updates.notes = notes;
    
    const updateFields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const updateValues = [...Object.values(updates), appointmentId];
    
    await pool.query(
      `UPDATE appointments SET ${updateFields}, updated_at = NOW() WHERE id = ?`,
      updateValues
    );

    // Get updated appointment
    const [updatedAppointment] = await pool.query(`
      SELECT 
        a.*,
        t.name as therapy_name, t.duration, t.price,
        p.name as patient_name, p.email as patient_email,
        d.name as doctor_name, d.email as doctor_email
      FROM appointments a
      JOIN therapies t ON a.therapy_id = t.id
      JOIN users p ON a.patient_id = p.id
      LEFT JOIN users d ON a.doctor_id = d.id
      WHERE a.id = ?
    `, [appointmentId]);

    res.json({
      message: 'Appointment updated successfully',
      appointment: updatedAppointment[0]
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update appointment status (approve/reject/complete)
router.put('/:appointmentId/status', authenticateToken, async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Get appointment
    const [appointments] = await pool.query('SELECT * FROM appointments WHERE id = ?', [appointmentId]);
    
    if (appointments.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    const appointment = appointments[0];

    // Check permissions
    if (req.user.role === 'patient') {
      // Patients can only cancel their own appointments
      if (appointment.patient_id !== req.user.userId || status !== 'cancelled') {
        return res.status(403).json({ message: 'Access denied' });
      }
    } else if (req.user.role === 'doctor') {
      // Doctors can update appointments assigned to them
      if (appointment.doctor_id !== req.user.userId && appointment.doctor_id !== null) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }
    // Admin can update any appointment

    // Update status
    await pool.query(
      'UPDATE appointments SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, appointmentId]
    );

    // Get updated appointment
    const [updatedAppointment] = await pool.query(`
      SELECT 
        a.*,
        t.name as therapy_name,
        p.name as patient_name, p.email as patient_email,
        d.name as doctor_name
      FROM appointments a
      JOIN therapies t ON a.therapy_id = t.id
      JOIN users p ON a.patient_id = p.id
      LEFT JOIN users d ON a.doctor_id = d.id
      WHERE a.id = ?
    `, [appointmentId]);

    // Send notification based on status change
    try {
      const apt = updatedAppointment[0];
      const notifDetails = {
        therapyName: apt.therapy_name,
        date: apt.appointment_date,
        time: apt.appointment_time,
        doctorName: apt.doctor_name
      };

      if (status === 'confirmed') {
        await notificationService.sendAppointmentConfirmedNotification(appointment.patient_id, notifDetails);
      } else if (status === 'cancelled') {
        await notificationService.sendAppointmentCancelledNotification(appointment.patient_id, notifDetails);
      } else if (status === 'completed') {
        await notificationService.sendAppointmentCompletedNotification(appointment.patient_id, notifDetails);
      }
    } catch (notifError) {
      console.error('Status notification error:', notifError);
    }

    res.json({
      message: `Appointment ${status} successfully`,
      appointment: updatedAppointment[0]
    });
  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Assign doctor to appointment (admin only)
router.put('/:appointmentId/assign-doctor', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { appointmentId } = req.params;
    const { doctorId } = req.body;

    // Check if doctor exists
    const [doctors] = await pool.query('SELECT * FROM users WHERE id = ? AND role = ?', [doctorId, 'doctor']);
    if (doctors.length === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Update appointment
    await pool.query(
      'UPDATE appointments SET doctor_id = ?, status = ?, updated_at = NOW() WHERE id = ?',
      [doctorId, 'confirmed', appointmentId]
    );

    // Get updated appointment
    const [appointment] = await pool.query(`
      SELECT 
        a.*,
        t.name as therapy_name,
        p.name as patient_name,
        d.name as doctor_name, d.email as doctor_email
      FROM appointments a
      JOIN therapies t ON a.therapy_id = t.id
      JOIN users p ON a.patient_id = p.id
      LEFT JOIN users d ON a.doctor_id = d.id
      WHERE a.id = ?
    `, [appointmentId]);

    res.json({
      message: 'Doctor assigned successfully',
      appointment: appointment[0]
    });
  } catch (error) {
    console.error('Assign doctor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete appointment (soft delete by setting status to cancelled)
router.delete('/:appointmentId', authenticateToken, async (req, res) => {
  try {
    const { appointmentId } = req.params;
    
    // Get appointment
    const [appointments] = await pool.query('SELECT * FROM appointments WHERE id = ?', [appointmentId]);
    
    if (appointments.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    const appointment = appointments[0];

    // Check permissions - only patient, assigned doctor, or admin can delete
    if (req.user.role === 'patient' && appointment.patient_id !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    if (req.user.role === 'doctor' && appointment.doctor_id !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Soft delete by setting status to cancelled
    await pool.query(
      'UPDATE appointments SET status = ?, updated_at = NOW() WHERE id = ?',
      ['cancelled', appointmentId]
    );

    res.json({
      message: 'Appointment cancelled successfully'
    });
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get available time slots
router.get('/slots/available', authenticateToken, async (req, res) => {
  try {
    let { date, doctorId, grouped } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    // Normalize date format (handle DD-MM-YYYY, DD/MM/YYYY, etc.)
    date = normalizeDate(date);

    // Check if date is in the past
    if (isDateInPast(date)) {
      return res.status(400).json({ message: 'Cannot book appointments in the past' });
    }

    // Get booked slots for the date
    let query = 'SELECT appointment_time FROM appointments WHERE appointment_date = ? AND status != ?';
    const params = [date, 'cancelled'];
    
    if (doctorId) {
      query += ' AND doctor_id = ?';
      params.push(doctorId);
    }
    
    const [bookedAppointments] = await pool.query(query, params);
    const bookedSlots = bookedAppointments.map(apt => apt.appointment_time.substring(0, 5)); // HH:MM format

    // Get available slots using utility
    const slotsData = getAvailableSlots(bookedSlots);

    // Group by time period if requested
    if (grouped === 'true') {
      const groupedAvailable = groupTimeSlotsByPeriod(slotsData.availableSlots);
      const groupedBooked = groupTimeSlotsByPeriod(slotsData.bookedSlots);
      
      return res.json({
        date,
        grouped: {
          morning: {
            available: groupedAvailable.morning,
            booked: groupedBooked.morning,
            label: 'Morning (9:00 AM - 12:00 PM)'
          },
          afternoon: {
            available: groupedAvailable.afternoon,
            booked: groupedBooked.afternoon,
            label: 'Afternoon (2:00 PM - 5:00 PM)'
          },
          evening: {
            available: groupedAvailable.evening,
            booked: groupedBooked.evening,
            label: 'Evening (5:00 PM - 6:00 PM)'
          }
        },
        ...slotsData
      });
    }

    res.json({
      date,
      ...slotsData
    });
  } catch (error) {
    console.error('Get available slots error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
