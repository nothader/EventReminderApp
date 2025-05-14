const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(auth);

// Get current user
router.get('/me', async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user preferences
router.put('/preferences', async (req, res) => {
  try {
    const { preferences } = req.body;
    
    if (!preferences) {
      return res.status(400).json({ message: 'Preferences data is required' });
    }
    
    const user = req.user;
    user.preferences = {
      ...user.preferences.toObject(),
      ...preferences
    };
    
    await user.save();
    
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'phone'];
    
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    
    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates' });
    }
    
    const user = req.user;
    
    updates.forEach(update => user[update] = req.body[update]);
    
    await user.save();
    
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Change password
router.put('/password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }
    
    // Validate current password
    const user = await User.findByCredentials(req.user.email, currentPassword);
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 