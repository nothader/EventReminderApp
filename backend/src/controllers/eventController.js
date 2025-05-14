const Event = require('../models/Event');
const { createReminderNotification } = require('../services/reminderService');

// Get all events for current user
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({ userId: req.user._id })
      .sort({ startDate: 1 });
    
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get upcoming events
exports.getUpcomingEvents = async (req, res) => {
  try {
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);
    
    const events = await Event.find({
      userId: req.user._id,
      startDate: { $gte: now, $lte: nextWeek }
    }).sort({ startDate: 1 });
    
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single event
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      userId: req.user._id
    };
    
    const event = new Event(eventData);
    
    // Create reminder notification
    await createReminderNotification(event);
    
    await event.save();
    
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an existing event
exports.updateEvent = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      'title', 'description', 'startDate', 'endDate', 
      'location', 'reminderTime', 'reminderType', 
      'isRecurring', 'recurrencePattern', 'calendarId'
    ];
    
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    
    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates' });
    }
    
    const event = await Event.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    updates.forEach(update => event[update] = req.body[update]);
    
    // Update reminder notification if reminder time changed
    if (
      updates.includes('reminderTime') || 
      updates.includes('reminderType') || 
      updates.includes('startDate')
    ) {
      // Clear existing pending notifications
      event.notifications = event.notifications.filter(n => n.status !== 'pending');
      
      // Create new notification
      await createReminderNotification(event);
    }
    
    await event.save();
    
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 