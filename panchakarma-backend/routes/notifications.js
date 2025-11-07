const express = require('express');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const notificationService = require('../services/notificationService');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Authentication middleware
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

// Admin/Doctor only middleware
const isAdminOrDoctor = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'doctor') {
    return res.status(403).json({ message: 'Access denied. Admin or Doctor role required.' });
  }
  next();
};

// Get user notifications
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM notifications WHERE user_id = ?';
    const params = [req.user.userId];

    if (unreadOnly === 'true') {
      query += ' AND read_status = false';
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [notifications] = await pool.query(query, params);

    // Get counts
    const [countResult] = await pool.query(
      'SELECT COUNT(*) as total, SUM(CASE WHEN read_status = false THEN 1 ELSE 0 END) as unread FROM notifications WHERE user_id = ?',
      [req.user.userId]
    );

    res.json({
      notifications,
      total: countResult[0].total,
      unreadCount: countResult[0].unread || 0,
      page: parseInt(page),
      totalPages: Math.ceil(countResult[0].total / limit)
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get unread count
router.get('/unread-count', authenticateToken, async (req, res) => {
  try {
    const count = await notificationService.getUnreadCount(req.user.userId);
    res.json({ unreadCount: count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark notification as read
router.put('/:notificationId/read', authenticateToken, async (req, res) => {
  try {
    const { notificationId } = req.params;
    await notificationService.markAsRead(notificationId, req.user.userId);
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark all notifications as read
router.put('/mark-all-read', authenticateToken, async (req, res) => {
  try {
    await notificationService.markAllAsRead(req.user.userId);
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete notification
router.delete('/:notificationId', authenticateToken, async (req, res) => {
  try {
    const { notificationId } = req.params;
    await notificationService.deleteNotification(notificationId, req.user.userId);
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send custom notification (Admin/Doctor to patient)
router.post('/send', authenticateToken, isAdminOrDoctor, async (req, res) => {
  try {
    const { userId, title, message, type = 'system' } = req.body;

    if (!userId || !title || !message) {
      return res.status(400).json({ message: 'userId, title, and message are required' });
    }

    // Verify user exists
    const [users] = await pool.query('SELECT id, name FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const notificationId = await notificationService.sendCustomNotification(userId, title, message, type);

    res.status(201).json({
      message: 'Notification sent successfully',
      notificationId
    });
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send bulk notification (Admin/Doctor to multiple users)
router.post('/send-bulk', authenticateToken, isAdminOrDoctor, async (req, res) => {
  try {
    const { userIds, title, message, type = 'system' } = req.body;

    if (!userIds || !Array.isArray(userIds) || !title || !message) {
      return res.status(400).json({ message: 'userIds (array), title, and message are required' });
    }

    await notificationService.sendBulkNotification(userIds, title, message, type);

    res.status(201).json({
      message: `Notification sent to ${userIds.length} users successfully`,
      count: userIds.length
    });
  } catch (error) {
    console.error('Send bulk notification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send notification to all patients (Admin only)
router.post('/broadcast-to-patients', authenticateToken, isAdminOrDoctor, async (req, res) => {
  try {
    const { title, message, type = 'system' } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: 'title and message are required' });
    }

    // Get all patient IDs
    const [patients] = await pool.query('SELECT id FROM users WHERE role = ?', ['patient']);
    const patientIds = patients.map(p => p.id);

    if (patientIds.length === 0) {
      return res.status(400).json({ message: 'No patients found' });
    }

    await notificationService.sendBulkNotification(patientIds, title, message, type);

    res.status(201).json({
      message: `Notification broadcast to ${patientIds.length} patients successfully`,
      count: patientIds.length
    });
  } catch (error) {
    console.error('Broadcast notification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
