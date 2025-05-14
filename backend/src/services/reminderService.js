const Event = require('../models/Event');
const emailService = require('./emailService');
const pushService = require('./pushService');
const smsService = require('./smsService');

// Create a reminder notification for an event
exports.createReminderNotification = async (event) => {
  try {
    // Calculate reminder time
    const reminderMinutes = event.reminderTime;
    const eventDate = new Date(event.startDate);
    
    const reminderTime = new Date(eventDate);
    reminderTime.setMinutes(reminderTime.getMinutes() - reminderMinutes);
    
    // Skip if reminder time is in the past
    if (reminderTime <= new Date()) {
      return;
    }
    
    // Create notification content
    const content = `Reminder: ${event.title} starts on ${eventDate.toLocaleString()}`;
    
    // Create notification
    const notification = {
      type: event.reminderType,
      scheduledTime: reminderTime,
      status: 'pending',
      content
    };
    
    // Add notification to event
    event.notifications.push(notification);
  } catch (error) {
    console.error('Error creating reminder notification:', error);
    throw error;
  }
};

// Check for upcoming events and send notifications
exports.checkUpcomingEvents = async () => {
  try {
    const now = new Date();
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);
    
    // Find events with pending notifications scheduled within the next 5 minutes
    const events = await Event.find({
      'notifications.status': 'pending',
      'notifications.scheduledTime': { $lte: fiveMinutesFromNow, $gte: now }
    });
    
    if (events.length === 0) {
      return;
    }
    
    // Send notifications for each event
    for (const event of events) {
      const pendingNotifications = event.notifications.filter(
        n => n.status === 'pending' && new Date(n.scheduledTime) <= fiveMinutesFromNow
      );
      
      for (const notification of pendingNotifications) {
        try {
          // Send notification based on type
          switch (notification.type) {
            case 'email':
              await sendEmailNotification(event, notification);
              break;
            case 'push':
              await sendPushNotification(event, notification);
              break;
            case 'sms':
              await sendSmsNotification(event, notification);
              break;
          }
          
          // Update notification status
          notification.status = 'sent';
          notification.sentTime = new Date();
        } catch (error) {
          console.error(`Error sending ${notification.type} notification:`, error);
          notification.status = 'failed';
        }
      }
      
      // Save the updated event
      await event.save();
    }
  } catch (error) {
    console.error('Error checking upcoming events:', error);
    throw error;
  }
};

// Send email notification
const sendEmailNotification = async (event, notification) => {
  try {
    // Get user email from database
    const user = await event.populate('userId').execPopulate();
    const email = user.userId.email;
    
    // Send email
    await emailService.sendEmail(
      email,
      'Event Reminder',
      notification.content
    );
  } catch (error) {
    console.error('Error sending email notification:', error);
    throw error;
  }
};

// Send push notification
const sendPushNotification = async (event, notification) => {
  // In a real app, this would send a push notification to the user's devices
  console.log('Push notification service is not fully implemented');
  
  // Simulate sending push notification
  await pushService.sendPushNotification(
    event.userId,
    notification.content
  );
};

// Send SMS notification
const sendSmsNotification = async (event, notification) => {
  // In a real app, this would send an SMS to the user's phone
  console.log('SMS notification service is not fully implemented');
  
  // Simulate sending SMS
  await smsService.sendSms(
    event.userId,
    notification.content
  );
}; 