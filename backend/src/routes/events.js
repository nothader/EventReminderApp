const express = require('express');
const eventController = require('../controllers/eventController');
const auth = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(auth);

// Get all events for the current user
router.get('/', eventController.getEvents);

// Get upcoming events (next 7 days)
router.get('/upcoming', eventController.getUpcomingEvents);

// Get a specific event
router.get('/:id', eventController.getEvent);

// Create a new event
router.post('/', eventController.createEvent);

// Update an event
router.put('/:id', eventController.updateEvent);

// Delete an event
router.delete('/:id', eventController.deleteEvent);

module.exports = router; 