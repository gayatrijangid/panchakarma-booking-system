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

// Get all therapy info (public/authenticated)
router.get('/', async (req, res) => {
  try {
    const { category, featured, search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const connection = await getConnection();

    let query = 'SELECT * FROM therapy_info WHERE status = "published"';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (featured) {
      query += ' AND is_featured = TRUE';
    }

    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY order_index ASC, created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [therapyInfos] = await connection.execute(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM therapy_info WHERE status = "published"';
    const countParams = [];
    
    if (category) {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }
    if (featured) {
      countQuery += ' AND is_featured = TRUE';
    }
    if (search) {
      countQuery += ' AND (title LIKE ? OR description LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }

    const [countResult] = await connection.execute(countQuery, countParams);

    res.json({
      therapyInfos,
      total: countResult[0].total,
      page: parseInt(page),
      totalPages: Math.ceil(countResult[0].total / limit)
    });
  } catch (error) {
    console.error('Get therapy info error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single therapy info by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();

    const [therapyInfos] = await connection.execute(
      'SELECT * FROM therapy_info WHERE id = ? AND status = "published"',
      [id]
    );

    if (therapyInfos.length === 0) {
      return res.status(404).json({ message: 'Therapy info not found' });
    }

    res.json(therapyInfos[0]);
  } catch (error) {
    console.error('Get therapy info by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get therapy info by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const connection = await getConnection();

    const [therapyInfos] = await connection.execute(
      'SELECT * FROM therapy_info WHERE category = ? AND status = "published" ORDER BY order_index ASC, created_at DESC',
      [category]
    );

    res.json({ therapyInfos, count: therapyInfos.length });
  } catch (error) {
    console.error('Get therapy by category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get featured therapy info
router.get('/featured/list', async (req, res) => {
  try {
    const connection = await getConnection();

    const [therapyInfos] = await connection.execute(
      'SELECT * FROM therapy_info WHERE is_featured = TRUE AND status = "published" ORDER BY order_index ASC LIMIT 6'
    );

    res.json({ therapyInfos, count: therapyInfos.length });
  } catch (error) {
    console.error('Get featured therapy error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all categories
router.get('/categories/list', async (req, res) => {
  try {
    const connection = await getConnection();

    const [categories] = await connection.execute(
      `SELECT category, COUNT(*) as count 
       FROM therapy_info 
       WHERE status = "published" 
       GROUP BY category 
       ORDER BY category`
    );

    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
