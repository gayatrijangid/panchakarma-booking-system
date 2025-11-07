const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Helper function to get database connection
const getConnection = async () => {
  return await pool.getConnection();
};

// Get all active doctors (public endpoint)
router.get('/doctors', async (req, res) => {
  try {
    const connection = await getConnection();
    const [doctors] = await connection.execute(
      `SELECT 
        id, 
        name, 
        email, 
        phone, 
        specialization, 
        experience, 
        qualifications, 
        about
      FROM users 
      WHERE role = 'doctor' AND status = 'active'
      ORDER BY name ASC`
    );
    
    connection.release();
    res.json(doctors);
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

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

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const connection = await getConnection();
    const [users] = await connection.execute(
      'SELECT id, name, email, phone, role, address, date_of_birth as dateOfBirth, emergency_contact as emergencyContact, avatar, created_at as createdAt, updated_at as updatedAt FROM users WHERE id = ?',
      [req.user.userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(users[0]);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email, phone, address, dateOfBirth, emergencyContact } = req.body;
    const connection = await getConnection();
    
    // Check if email is already taken by another user
    if (email) {
      const [existingUsers] = await connection.execute(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, req.user.userId]
      );
      
      if (existingUsers.length > 0) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (email !== undefined) {
      updates.push('email = ?');
      values.push(email);
    }
    if (phone !== undefined) {
      updates.push('phone = ?');
      values.push(phone);
    }
    if (address !== undefined) {
      updates.push('address = ?');
      values.push(address);
    }
    if (dateOfBirth !== undefined) {
      updates.push('date_of_birth = ?');
      values.push(dateOfBirth);
    }
    if (emergencyContact !== undefined) {
      updates.push('emergency_contact = ?');
      values.push(emergencyContact);
    }

    if (updates.length > 0) {
      updates.push('updated_at = NOW()');
      values.push(req.user.userId);
      
      await connection.execute(
        `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }

    // Fetch updated user
    const [updatedUsers] = await connection.execute(
      'SELECT id, name, email, phone, role, address, date_of_birth as dateOfBirth, emergency_contact as emergencyContact, avatar, created_at as createdAt, updated_at as updatedAt FROM users WHERE id = ?',
      [req.user.userId]
    );
    
    res.json({ 
      message: 'Profile updated successfully',
      user: updatedUsers[0]
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords are required' });
    }

    const userIndex = users.findIndex(u => u.id === req.user.userId);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, users[userIndex].password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    // Update password
    users[userIndex].password = hashedPassword;
    users[userIndex].updatedAt = new Date();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users (admin only)
router.get('/', authenticateToken, (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { page = 1, limit = 10, role, search } = req.query;
    let filteredUsers = [...users];

    // Filter by role
    if (role && role !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.role === role);
    }

    // Search by name or email
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(searchLower) || 
        user.email.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    // Remove passwords
    const usersWithoutPasswords = paginatedUsers.map(({ password, ...user }) => user);

    res.json({
      users: usersWithoutPasswords,
      total: filteredUsers.length,
      page: parseInt(page),
      totalPages: Math.ceil(filteredUsers.length / limit)
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user status (admin only)
router.put('/:userId/status', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { userId } = req.params;
    const { status } = req.body;

    const userIndex = users.findIndex(u => u.id === parseInt(userId));
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    users[userIndex].status = status;
    users[userIndex].updatedAt = new Date();

    const { password, ...userProfile } = users[userIndex];
    res.json({ 
      message: 'User status updated successfully',
      user: userProfile 
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload profile picture
router.post('/upload-avatar', authenticateToken, (req, res) => {
  try {
    const { avatar } = req.body;
    
    const userIndex = users.findIndex(u => u.id === req.user.userId);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    users[userIndex].avatar = avatar;
    users[userIndex].updatedAt = new Date();

    const { password, ...userProfile } = users[userIndex];
    res.json({ 
      message: 'Avatar updated successfully',
      user: userProfile 
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;