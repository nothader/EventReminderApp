const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authorization = req.header('Authorization');
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const token = authorization.replace('Bearer ', '');
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Find user with the token
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      throw new Error();
    }
    
    // Add user to request
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = auth; 