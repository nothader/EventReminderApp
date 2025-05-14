const User = require('../models/User');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    // Create new user
    const user = new User({
      name,
      email,
      password,
      preferences: {
        defaultReminderTime: 30,
        defaultReminderType: 'email',
        enableSmartReminders: true,
        timeZone: 'UTC'
      }
    });
    
    await user.save();
    
    // Generate authentication token
    const token = user.generateAuthToken();
    
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by credentials
    const user = await User.findByCredentials(email, password);
    
    // Generate authentication token
    const token = user.generateAuthToken();
    
    res.json({ user, token });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// Get current user profile
exports.getCurrentUser = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logout (for future token management)
exports.logout = async (req, res) => {
  try {
    // In a more complex system, you'd revoke or blacklist the token here
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 