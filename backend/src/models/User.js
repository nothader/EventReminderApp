const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userPreferencesSchema = new mongoose.Schema({
  defaultReminderTime: {
    type: Number,
    default: 30
  },
  defaultReminderType: {
    type: String,
    enum: ['email', 'push', 'sms'],
    default: 'email'
  },
  enableSmartReminders: {
    type: Boolean,
    default: true
  },
  timeZone: {
    type: String,
    default: 'UTC'
  }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  phone: {
    type: String,
    trim: true
  },
  preferences: {
    type: userPreferencesSchema,
    default: () => ({})
  }
}, {
  timestamps: true
});

// Middleware to hash password before saving
userSchema.pre('save', async function(next) {
  const user = this;
  
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  
  next();
});

// Method to generate authentication token
userSchema.methods.generateAuthToken = function() {
  const user = this;
  const token = jwt.sign(
    { userId: user._id.toString() },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
  
  return token;
};

// Static method to authenticate user
userSchema.statics.findByCredentials = async function(email, password) {
  const User = this;
  
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }
  
  return user;
};

// Method to convert user to JSON (hide sensitive data)
userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();
  
  delete userObject.password;
  
  return userObject;
};

const User = mongoose.model('User', userSchema);

module.exports = User; 