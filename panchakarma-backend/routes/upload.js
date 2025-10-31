const express = require('express');
const router = express.Router();

// Simple file upload endpoint (mock implementation)
router.post('/avatar', (req, res) => {
  try {
    const { file, fileName } = req.body;
    
    if (!file) {
      return res.status(400).json({ message: 'File is required' });
    }

    // Mock file processing
    const mockUrl = `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face`;
    
    res.json({
      message: 'File uploaded successfully',
      url: mockUrl,
      fileName: fileName || 'avatar.jpg'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed' });
  }
});

module.exports = router;