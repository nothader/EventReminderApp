const express = require('express');
const Calendar = require('../models/Calendar');
const auth = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(auth);

// Get all calendars for the current user
router.get('/', async (req, res) => {
  try {
    const calendars = await Calendar.find({ userId: req.user._id });
    res.json(calendars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific calendar
router.get('/:id', async (req, res) => {
  try {
    const calendar = await Calendar.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!calendar) {
      return res.status(404).json({ message: 'Calendar not found' });
    }
    
    res.json(calendar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new calendar
router.post('/', async (req, res) => {
  try {
    const calendarData = {
      ...req.body,
      userId: req.user._id
    };
    
    // If setting as default, ensure only one default exists
    if (calendarData.isDefault) {
      await Calendar.updateMany(
        { userId: req.user._id },
        { $set: { isDefault: false } }
      );
    }
    
    const calendar = new Calendar(calendarData);
    await calendar.save();
    
    res.status(201).json(calendar);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a calendar
router.put('/:id', async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'color', 'isDefault'];
    
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    
    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates' });
    }
    
    const calendar = await Calendar.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!calendar) {
      return res.status(404).json({ message: 'Calendar not found' });
    }
    
    // If setting as default, ensure only one default exists
    if (req.body.isDefault && !calendar.isDefault) {
      await Calendar.updateMany(
        { userId: req.user._id, _id: { $ne: calendar._id } },
        { $set: { isDefault: false } }
      );
    }
    
    updates.forEach(update => calendar[update] = req.body[update]);
    
    await calendar.save();
    
    res.json(calendar);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a calendar
router.delete('/:id', async (req, res) => {
  try {
    const calendar = await Calendar.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!calendar) {
      return res.status(404).json({ message: 'Calendar not found' });
    }
    
    // Don't allow deleting the default calendar
    if (calendar.isDefault) {
      return res.status(400).json({ message: 'Cannot delete the default calendar' });
    }
    
    await calendar.remove();
    
    res.json({ message: 'Calendar deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Sync calendar with external service
router.post('/:id/sync', async (req, res) => {
  try {
    const calendar = await Calendar.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!calendar) {
      return res.status(404).json({ message: 'Calendar not found' });
    }
    
    // This would be implemented with actual calendar provider API
    // For now, just update the syncedAt timestamp
    calendar.syncedAt = new Date();
    await calendar.save();
    
    res.json({
      message: 'Calendar synced successfully',
      syncedAt: calendar.syncedAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 