const express = require('express');
const jwt = require('jsonwebtoken');
const { therapies } = require('../data/storage');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Middleware to verify JWT token (optional for some routes)
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

// Get all therapies (public)
router.get('/', (req, res) => {
  try {
    const { category, search, available } = req.query;
    let filteredTherapies = [...therapies];

    // Filter by category
    if (category && category !== 'all') {
      filteredTherapies = filteredTherapies.filter(therapy => 
        therapy.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Search by name or description
    if (search) {
      const searchLower = search.toLowerCase();
      filteredTherapies = filteredTherapies.filter(therapy =>
        therapy.name.toLowerCase().includes(searchLower) ||
        therapy.description.toLowerCase().includes(searchLower) ||
        therapy.benefits.some(benefit => benefit.toLowerCase().includes(searchLower))
      );
    }

    // Filter by availability
    if (available !== undefined) {
      filteredTherapies = filteredTherapies.filter(therapy => 
        therapy.availability === (available === 'true')
      );
    }

    res.json({
      therapies: filteredTherapies,
      total: filteredTherapies.length
    });
  } catch (error) {
    console.error('Get therapies error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get therapy by ID
router.get('/:therapyId', (req, res) => {
  try {
    const { therapyId } = req.params;
    const therapy = therapies.find(t => t.id === parseInt(therapyId));

    if (!therapy) {
      return res.status(404).json({ message: 'Therapy not found' });
    }

    res.json(therapy);
  } catch (error) {
    console.error('Get therapy error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new therapy (admin only)
router.post('/', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { name, description, duration, price, benefits, procedures, category, image } = req.body;

    if (!name || !description || !duration || !price) {
      return res.status(400).json({ message: 'Name, description, duration, and price are required' });
    }

    const newTherapy = {
      id: Math.max(...therapies.map(t => t.id), 0) + 1,
      name,
      description,
      duration,
      price: parseFloat(price),
      benefits: benefits || [],
      procedures: procedures || [],
      category: category || 'General',
      image: image || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3',
      availability: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    therapies.push(newTherapy);

    res.status(201).json({
      message: 'Therapy created successfully',
      therapy: newTherapy
    });
  } catch (error) {
    console.error('Create therapy error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update therapy (admin only)
router.put('/:therapyId', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { therapyId } = req.params;
    const therapyIndex = therapies.findIndex(t => t.id === parseInt(therapyId));

    if (therapyIndex === -1) {
      return res.status(404).json({ message: 'Therapy not found' });
    }

    const { name, description, duration, price, benefits, procedures, category, image, availability } = req.body;

    const updatedTherapy = {
      ...therapies[therapyIndex],
      name: name || therapies[therapyIndex].name,
      description: description || therapies[therapyIndex].description,
      duration: duration || therapies[therapyIndex].duration,
      price: price !== undefined ? parseFloat(price) : therapies[therapyIndex].price,
      benefits: benefits || therapies[therapyIndex].benefits,
      procedures: procedures || therapies[therapyIndex].procedures,
      category: category || therapies[therapyIndex].category,
      image: image || therapies[therapyIndex].image,
      availability: availability !== undefined ? availability : therapies[therapyIndex].availability,
      updatedAt: new Date()
    };

    therapies[therapyIndex] = updatedTherapy;

    res.json({
      message: 'Therapy updated successfully',
      therapy: updatedTherapy
    });
  } catch (error) {
    console.error('Update therapy error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete therapy (admin only)
router.delete('/:therapyId', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { therapyId } = req.params;
    const therapyIndex = therapies.findIndex(t => t.id === parseInt(therapyId));

    if (therapyIndex === -1) {
      return res.status(404).json({ message: 'Therapy not found' });
    }

    // Instead of deleting, set availability to false
    therapies[therapyIndex].availability = false;
    therapies[therapyIndex].updatedAt = new Date();

    res.json({
      message: 'Therapy disabled successfully'
    });
  } catch (error) {
    console.error('Delete therapy error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get therapy categories
router.get('/categories/list', (req, res) => {
  try {
    const categories = [...new Set(therapies.map(therapy => therapy.category))];
    res.json({
      categories: categories.map(category => ({
        name: category,
        count: therapies.filter(t => t.category === category && t.availability).length
      }))
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;