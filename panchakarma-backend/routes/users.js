const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { users } = require('../data/storage');

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

// Get user profile
router.get('/profile', authenticateToken, (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const { password, ...userProfile } = user;
    res.json(userProfile);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email, phone, address, dateOfBirth, emergencyContact } = req.body;
    
    const userIndex = users.findIndex(u => u.id === req.user.userId);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email is already taken by another user
    if (email && email !== users[userIndex].email) {
      const emailExists = users.some(u => u.email === email && u.id !== req.user.userId);
      if (emailExists) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    // Update user data
    const updatedUser = {
      ...users[userIndex],
      name: name || users[userIndex].name,
      email: email || users[userIndex].email,
      phone: phone || users[userIndex].phone,
      address: address || users[userIndex].address,
      dateOfBirth: dateOfBirth || users[userIndex].dateOfBirth,
      emergencyContact: emergencyContact || users[userIndex].emergencyContact,
      updatedAt: new Date()
    };

    users[userIndex] = updatedUser;
    
    const { password, ...userProfile } = updatedUser;
    res.json({ 
      message: 'Profile updated successfully',
      user: userProfile 
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