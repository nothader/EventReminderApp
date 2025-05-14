const express = require('express');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

// Register a new user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

// Get current user profile (protected route)
router.get('/me', auth, authController.getCurrentUser);

// Logout user (protected route)
router.post('/logout', auth, authController.logout);

module.exports = router; 