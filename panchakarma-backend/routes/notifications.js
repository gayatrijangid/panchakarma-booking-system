const express = require('express');
const jwt = require('jsonwebtoken');
const { notifications } = require('../data/storage');

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

// Get user notifications
router.get('/', authenticateToken, (req, res) => {
  try {
    const { page = 1, limit = 10, read } = req.query;
    
    let userNotifications = notifications.filter(n => 
      n.userId === req.user.userId || n.userId === null // null for broadcast notifications
    );

    // Filter by read status
    if (read !== undefined) {
      userNotifications = userNotifications.filter(n => 
        n.read === (read === 'true')
      );
    }

    // Sort by date (newest first)
    userNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedNotifications = userNotifications.slice(startIndex, endIndex);

    res.json({
      notifications: paginatedNotifications,
      total: userNotifications.length,
      unreadCount: userNotifications.filter(n => !n.read).length
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark notification as read
router.put('/:notificationId/read', authenticateToken, (req, res) => {
  try {
    const { notificationId } = req.params;
    const notificationIndex = notifications.findIndex(n => 
      n.id === parseInt(notificationId) && 
      (n.userId === req.user.userId || n.userId === null)
    );

    if (notificationIndex === -1) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notifications[notificationIndex].read = true;
    notifications[notificationIndex].readAt = new Date();

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create notification (system use)
router.post('/', (req, res) => {
  try {
    const { userId, title, message, type = 'info' } = req.body;

    const notification = {
      id: notifications.length + 1,
      userId: userId || null,
      title,
      message,
      type,
      read: false,
      createdAt: new Date()
    };

    notifications.push(notification);

    res.status(201).json({
      message: 'Notification created successfully',
      notification
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;