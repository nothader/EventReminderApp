const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cron = require('node-cron');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const userRoutes = require('./routes/users');
const calendarRoutes = require('./routes/calendars');
const notificationRoutes = require('./routes/notifications');

// Import services
const { checkUpcomingEvents } = require('./services/reminderService');

// Create Express app
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/event-reminder', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);
app.use('/api/calendars', calendarRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Schedule cron job to check for upcoming events every minute
cron.schedule('* * * * *', async () => {
  try {
    await checkUpcomingEvents();
    console.log('Checked for upcoming events');
  } catch (error) {
    console.error('Error checking for upcoming events:', error);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 