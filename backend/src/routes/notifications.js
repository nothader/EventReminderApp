const express = require('express');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(auth);

// Get all notifications for the current user
router.get('/', async (req, res) => {
  try {
    // Find all events with notifications
    const events = await Event.find({
      userId: req.user._id,
      'notifications.0': { $exists: true }
    });
    
    // Extract notifications from events
    const notifications = [];
    
    events.forEach(event => {
      event.notifications.forEach(notification => {
        notifications.push({
          id: notification._id,
          eventId: event._id,
          eventTitle: event.title,
          type: notification.type,
          status: notification.status,
          scheduledTime: notification.scheduledTime,
          sentTime: notification.sentTime,
          content: notification.content
        });
      });
    });
    
    // Sort by scheduled time (newest first)
    notifications.sort((a, b) => new Date(b.scheduledTime) - new Date(a.scheduledTime));
    
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark notification as read
router.put('/:id/read', async (req, res) => {
  try {
    // Find event with this notification
    const event = await Event.findOne({
      userId: req.user._id,
      'notifications._id': req.params.id
    });
    
    if (!event) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    // Update the notification status to "read"
    const notificationIndex = event.notifications.findIndex(
      n => n._id.toString() === req.params.id
    );
    
    if (notificationIndex === -1) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    // Mark as read (we don't have a "read" status in our model,
    // so this is a placeholder for future implementation)
    event.notifications[notificationIndex].status = 'sent';
    
    await event.save();
    
    res.json({
      message: 'Notification marked as read',
      notification: event.notifications[notificationIndex]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user notification preferences
router.get('/preferences', async (req, res) => {
  try {
    res.json({
      defaultReminderTime: req.user.preferences.defaultReminderTime,
      defaultReminderType: req.user.preferences.defaultReminderType,
      enableSmartReminders: req.user.preferences.enableSmartReminders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 