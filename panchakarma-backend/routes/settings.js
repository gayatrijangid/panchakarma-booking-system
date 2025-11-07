const express = require('express');
const jwt = require('jsonwebtoken');
const { getConnection } = require('../config/database');

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

// Get user settings
router.get('/', authenticateToken, async (req, res) => {
  try {
    const connection = await getConnection();
    
    const [settings] = await connection.execute(
      'SELECT * FROM user_settings WHERE user_id = ?',
      [req.user.userId]
    );

    // Create default settings if they don't exist
    if (settings.length === 0) {
      await connection.execute(
        `INSERT INTO user_settings (user_id) VALUES (?)`,
        [req.user.userId]
      );
      
      const [newSettings] = await connection.execute(
        'SELECT * FROM user_settings WHERE user_id = ?',
        [req.user.userId]
      );
      
      return res.json(newSettings[0]);
    }

    res.json(settings[0]);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user settings
router.put('/', authenticateToken, async (req, res) => {
  try {
    const {
      email_notifications,
      whatsapp_notifications,
      sms_notifications,
      reminder_before_hours,
      theme,
      language,
      timezone,
      notification_preferences
    } = req.body;

    const connection = await getConnection();

    // Check if settings exist
    const [existing] = await connection.execute(
      'SELECT id FROM user_settings WHERE user_id = ?',
      [req.user.userId]
    );

    if (existing.length === 0) {
      // Create new settings
      await connection.execute(
        `INSERT INTO user_settings (
          user_id, email_notifications, whatsapp_notifications, 
          sms_notifications, reminder_before_hours, theme, 
          language, timezone, notification_preferences
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          req.user.userId,
          email_notifications ?? true,
          whatsapp_notifications ?? true,
          sms_notifications ?? false,
          reminder_before_hours ?? 24,
          theme ?? 'light',
          language ?? 'en',
          timezone ?? 'Asia/Kolkata',
          notification_preferences ? JSON.stringify(notification_preferences) : null
        ]
      );
    } else {
      // Update existing settings
      const updates = [];
      const values = [];

      if (email_notifications !== undefined) {
        updates.push('email_notifications = ?');
        values.push(email_notifications);
      }
      if (whatsapp_notifications !== undefined) {
        updates.push('whatsapp_notifications = ?');
        values.push(whatsapp_notifications);
      }
      if (sms_notifications !== undefined) {
        updates.push('sms_notifications = ?');
        values.push(sms_notifications);
      }
      if (reminder_before_hours !== undefined) {
        updates.push('reminder_before_hours = ?');
        values.push(reminder_before_hours);
      }
      if (theme !== undefined) {
        updates.push('theme = ?');
        values.push(theme);
      }
      if (language !== undefined) {
        updates.push('language = ?');
        values.push(language);
      }
      if (timezone !== undefined) {
        updates.push('timezone = ?');
        values.push(timezone);
      }
      if (notification_preferences !== undefined) {
        updates.push('notification_preferences = ?');
        values.push(JSON.stringify(notification_preferences));
      }

      if (updates.length > 0) {
        values.push(req.user.userId);
        await connection.execute(
          `UPDATE user_settings SET ${updates.join(', ')} WHERE user_id = ?`,
          values
        );
      }
    }

    // Fetch updated settings
    const [updatedSettings] = await connection.execute(
      'SELECT * FROM user_settings WHERE user_id = ?',
      [req.user.userId]
    );

    res.json({
      message: 'Settings updated successfully',
      settings: updatedSettings[0]
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset settings to default
router.post('/reset', authenticateToken, async (req, res) => {
  try {
    const connection = await getConnection();

    await connection.execute(
      `UPDATE user_settings SET 
        email_notifications = TRUE,
        whatsapp_notifications = TRUE,
        sms_notifications = FALSE,
        reminder_before_hours = 24,
        theme = 'light',
        language = 'en',
        timezone = 'Asia/Kolkata',
        notification_preferences = NULL
      WHERE user_id = ?`,
      [req.user.userId]
    );

    const [settings] = await connection.execute(
      'SELECT * FROM user_settings WHERE user_id = ?',
      [req.user.userId]
    );

    res.json({
      message: 'Settings reset to defaults',
      settings: settings[0]
    });
  } catch (error) {
    console.error('Reset settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
