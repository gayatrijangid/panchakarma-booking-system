const { pool } = require('../config/database');

class NotificationService {
  // Helper method to create notification
  async createNotification(userId, type, title, message) {
    try {
      const [result] = await pool.query(
        'INSERT INTO notifications (user_id, type, title, message, read_status) VALUES (?, ?, ?, ?, false)',
        [userId, type, title, message]
      );
      console.log(`✅ Notification created for user ${userId}: ${title}`);
      return result.insertId;
    } catch (error) {
      console.error('Error creating notification:', error.message);
      throw error;
    }
  }

  // Welcome notification for new users
  async sendWelcomeNotification(userId, userName) {
    const title = '🌿 Welcome to Niramay!';
    const message = `Hello ${userName}! Welcome to Niramay Panchakarma. We're delighted to have you with us. Discover our authentic Ayurvedic therapies and start your wellness journey today!`;
    return await this.createNotification(userId, 'system', title, message);
  }

  // Appointment booking confirmation
  async sendAppointmentBookedNotification(userId, appointmentDetails) {
    const { therapyName, date, time } = appointmentDetails;
    const title = '✅ Appointment Booked Successfully!';
    const message = `Your appointment for ${therapyName} has been booked for ${date} at ${time}. Our team will contact you 24 hours before your session. Status: Pending approval.`;
    return await this.createNotification(userId, 'appointment', title, message);
  }

  // Appointment confirmed by doctor/admin
  async sendAppointmentConfirmedNotification(userId, appointmentDetails) {
    const { therapyName, date, time, doctorName } = appointmentDetails;
    const title = '🎉 Appointment Confirmed!';
    const message = `Great news! Your appointment for ${therapyName} on ${date} at ${time} has been confirmed${doctorName ? ` with ${doctorName}` : ''}. We look forward to seeing you!`;
    return await this.createNotification(userId, 'appointment', title, message);
  }

  // Appointment reminder (24 hours before)
  async sendAppointmentReminder(userId, appointmentDetails) {
    const { therapyName, date, time, location } = appointmentDetails;
    const title = '⏰ Appointment Reminder';
    const message = `Reminder: You have an appointment tomorrow for ${therapyName} at ${time}${location ? ` at ${location}` : ''}. Please arrive 10 minutes early. Contact us if you need to reschedule.`;
    return await this.createNotification(userId, 'reminder', title, message);
  }

  // Appointment rescheduled
  async sendAppointmentRescheduledNotification(userId, oldDetails, newDetails) {
    const title = '📅 Appointment Rescheduled';
    const message = `Your appointment for ${oldDetails.therapyName} has been rescheduled from ${oldDetails.date} ${oldDetails.time} to ${newDetails.date} ${newDetails.time}.`;
    return await this.createNotification(userId, 'update', title, message);
  }

  // Appointment cancelled
  async sendAppointmentCancelledNotification(userId, appointmentDetails) {
    const { therapyName, date, time, reason } = appointmentDetails;
    const title = '❌ Appointment Cancelled';
    const message = `Your appointment for ${therapyName} on ${date} at ${time} has been cancelled${reason ? `. Reason: ${reason}` : ''}. You can book a new appointment anytime.`;
    return await this.createNotification(userId, 'appointment', title, message);
  }

  // Appointment completed
  async sendAppointmentCompletedNotification(userId, appointmentDetails) {
    const { therapyName } = appointmentDetails;
    const title = '✨ Session Completed';
    const message = `Thank you for completing your ${therapyName} session with us! We hope you had a wonderful experience. Please share your feedback.`;
    return await this.createNotification(userId, 'appointment', title, message);
  }

  // Therapy information and procedures
  async sendTherapyInfoNotification(userId, therapyDetails) {
    const { name, duration, procedures, benefits } = therapyDetails;
    const title = `📋 ${name} - Session Information`;
    let message = `Here's what to expect during your ${name} session:\n\n`;
    message += `Duration: ${duration}\n\n`;
    
    if (procedures && procedures.length > 0) {
      message += `Procedures:\n${procedures.map(p => `• ${p}`).join('\n')}\n\n`;
    }
    
    if (benefits && benefits.length > 0) {
      message += `Benefits:\n${benefits.map(b => `• ${b}`).join('\n')}`;
    }
    
    return await this.createNotification(userId, 'system', title, message);
  }

  // Doctor assigned notification
  async sendDoctorAssignedNotification(userId, appointmentDetails) {
    const { doctorName, specialization, date, time } = appointmentDetails;
    const title = '👨‍⚕️ Doctor Assigned';
    const message = `${doctorName}${specialization ? ` (${specialization})` : ''} has been assigned to your appointment on ${date} at ${time}.`;
    return await this.createNotification(userId, 'appointment', title, message);
  }

  // Custom notification (for admin/doctor to send)
  async sendCustomNotification(userId, title, message, type = 'system') {
    return await this.createNotification(userId, type, title, message);
  }

  // Bulk notification to multiple users
  async sendBulkNotification(userIds, title, message, type = 'system') {
    const notifications = userIds.map(userId => 
      this.createNotification(userId, type, title, message)
    );
    return await Promise.all(notifications);
  }

  // Get user notifications
  async getUserNotifications(userId, limit = 20, offset = 0) {
    try {
      const [notifications] = await pool.query(
        'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [userId, limit, offset]
      );
      return notifications;
    } catch (error) {
      console.error('Error fetching notifications:', error.message);
      throw error;
    }
  }

  // Get unread count
  async getUnreadCount(userId) {
    try {
      const [result] = await pool.query(
        'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND read_status = false',
        [userId]
      );
      return result[0].count;
    } catch (error) {
      console.error('Error getting unread count:', error.message);
      throw error;
    }
  }

  // Mark notification as read
  async markAsRead(notificationId, userId) {
    try {
      await pool.query(
        'UPDATE notifications SET read_status = true WHERE id = ? AND user_id = ?',
        [notificationId, userId]
      );
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error.message);
      throw error;
    }
  }

  // Mark all as read
  async markAllAsRead(userId) {
    try {
      await pool.query(
        'UPDATE notifications SET read_status = true WHERE user_id = ?',
        [userId]
      );
      return true;
    } catch (error) {
      console.error('Error marking all as read:', error.message);
      throw error;
    }
  }

  // Delete notification
  async deleteNotification(notificationId, userId) {
    try {
      await pool.query(
        'DELETE FROM notifications WHERE id = ? AND user_id = ?',
        [notificationId, userId]
      );
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error.message);
      throw error;
    }
  }
}

module.exports = new NotificationService();
