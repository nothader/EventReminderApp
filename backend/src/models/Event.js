const mongoose = require('mongoose');

const recurrencePatternSchema = new mongoose.Schema({
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    required: true
  },
  interval: {
    type: Number,
    default: 1,
    min: 1
  },
  endDate: {
    type: Date
  },
  daysOfWeek: {
    type: [Number],
    validate: {
      validator: function(arr) {
        // Day values should be 0-6 (Sunday-Saturday)
        return arr.every(day => day >= 0 && day <= 6);
      },
      message: 'Days of week must be between 0 (Sunday) and 6 (Saturday)'
    }
  },
  dayOfMonth: {
    type: Number,
    min: 1,
    max: 31
  },
  monthOfYear: {
    type: Number,
    min: 1,
    max: 12
  }
});

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['email', 'push', 'sms'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'failed'],
    default: 'pending'
  },
  scheduledTime: {
    type: Date,
    required: true
  },
  sentTime: {
    type: Date
  },
  content: {
    type: String,
    required: true
  }
});

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        return value >= this.startDate;
      },
      message: 'End date must be after or equal to start date'
    }
  },
  location: {
    type: String,
    trim: true
  },
  reminderTime: {
    type: Number, // minutes before the event
    required: true,
    default: 30
  },
  reminderType: {
    type: String,
    enum: ['email', 'push', 'sms'],
    required: true,
    default: 'email'
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurrencePattern: {
    type: recurrencePatternSchema
  },
  calendarId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Calendar'
  },
  notifications: {
    type: [notificationSchema],
    default: []
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Create indexes for efficient queries
eventSchema.index({ userId: 1, startDate: 1 });
eventSchema.index({ 'notifications.scheduledTime': 1, 'notifications.status': 1 });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event; 