const express = require('express');
const router = express.Router();

// Mock WhatsApp API integration
router.post('/send-message', async (req, res) => {
  try {
    const { phone, message, type = 'text' } = req.body;
    
    if (!phone || !message) {
      return res.status(400).json({ message: 'Phone and message are required' });
    }

    // Mock sending message (replace with actual WhatsApp API)
    console.log(`📱 WhatsApp Message to ${phone}: ${message}`);
    
    res.json({
      success: true,
      message: 'WhatsApp message sent successfully',
      phone,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('WhatsApp send error:', error);
    res.status(500).json({ message: 'Failed to send WhatsApp message' });
  }
});

// Send appointment reminder
router.post('/send-reminder', async (req, res) => {
  try {
    const { phone, patientName, therapyName, appointmentDate, appointmentTime } = req.body;
    
    const message = `🌿 Hi ${patientName}! 

This is a reminder for your ${therapyName} appointment scheduled for:
📅 Date: ${appointmentDate}
🕐 Time: ${appointmentTime}

Please arrive 15 minutes early. If you need to reschedule, contact us immediately.

Thanks for choosing Niramay Panchakarma! 🙏`;

    console.log(`📱 Reminder sent to ${phone}: ${message}`);
    
    res.json({
      success: true,
      message: 'Appointment reminder sent successfully'
    });
  } catch (error) {
    console.error('Reminder send error:', error);
    res.status(500).json({ message: 'Failed to send reminder' });
  }
});

module.exports = router;