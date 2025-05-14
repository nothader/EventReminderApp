const mongoose = require('mongoose');

const calendarSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['google', 'outlook', 'apple', 'custom'],
    required: true
  },
  color: {
    type: String,
    default: '#4f46e5'
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  accessToken: {
    type: String
  },
  refreshToken: {
    type: String
  },
  tokenExpiry: {
    type: Date
  },
  syncedAt: {
    type: Date
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Ensure that there's only one default calendar per user
calendarSchema.pre('save', async function(next) {
  const calendar = this;
  
  if (calendar.isDefault) {
    await calendar.constructor.updateMany(
      { userId: calendar.userId, _id: { $ne: calendar._id } },
      { $set: { isDefault: false } }
    );
  }
  
  next();
});

// Index for efficient queries by user
calendarSchema.index({ userId: 1 });

const Calendar = mongoose.model('Calendar', calendarSchema);

module.exports = Calendar; 