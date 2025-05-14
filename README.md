# Event Reminder Application

A user-friendly tool designed to help individuals manage and track their events efficiently. Users can schedule events, set reminders, and receive notifications through various channels such as email, SMS, or push notifications.

## Features

- **Event Management**: Create, view, edit, and delete events
- **Recurring Events**: Set up events that repeat on a daily, weekly, monthly, or yearly basis
- **Smart Notifications**: Receive reminders via email, SMS, or push notifications
- **Calendar Integration**: Sync with external calendars (Google Calendar, Outlook, etc.)
- **Customization**: Set your preferred reminder times and notification methods
- **Cross-Platform Support**: Access from web and mobile devices

## Technology Stack

### Frontend
- **Framework**: React with TypeScript
- **Routing**: React Router
- **Styling**: CSS with custom variables
- **API Communication**: Axios
- **Date Handling**: date-fns

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JSON Web Tokens (JWT)
- **Notifications**: 
  - Email: Nodemailer
  - SMS: Placeholder implementation (can be integrated with Twilio)
  - Push: Placeholder implementation (can be integrated with Firebase)
- **Scheduling**: node-cron for reminder jobs

## Project Structure

```
EventReminderApp/
├── frontend/                  # React frontend
│   ├── public/                # Static files
│   └── src/                   # Source code
│       ├── components/        # Reusable UI components
│       ├── contexts/          # React context providers
│       ├── hooks/             # Custom React hooks
│       ├── pages/             # Page components
│       ├── services/          # API services
│       └── types/             # TypeScript interfaces
│
└── backend/                   # Node.js backend
    ├── src/                   # Source code
    │   ├── controllers/       # Route controllers
    │   ├── middleware/        # Express middleware
    │   ├── models/            # Mongoose models
    │   ├── routes/            # API routes
    │   ├── services/          # Business logic services
    │   └── utils/             # Utility functions
    └── .env                   # Environment variables
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/event-reminder-app.git
   cd event-reminder-app
   ```

2. Set up the backend:
   ```
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Set up the frontend:
   ```
   cd ../frontend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   npm run dev
   ```

2. Start the frontend development server:
   ```
   cd frontend
   npm start
   ```

3. Access the application at http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in a user
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/logout` - Log out a user

### Events
- `GET /api/events` - Get all events for the current user
- `GET /api/events/upcoming` - Get upcoming events (next 7 days)
- `GET /api/events/:id` - Get a specific event
- `POST /api/events` - Create a new event
- `PUT /api/events/:id` - Update an event
- `DELETE /api/events/:id` - Delete an event

### Users
- `GET /api/users/me` - Get current user
- `PUT /api/users/preferences` - Update user preferences
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Change password

## Future Enhancements

- **Mobile App**: Native mobile applications using Flutter or React Native
- **Advanced Recurrence**: More sophisticated recurring event patterns
- **Location-Based Reminders**: Notifications based on proximity to event location
- **Social Features**: Share events and invite other users
- **Weather Integration**: Show weather forecast for outdoor events
- **Machine Learning**: Smart suggestions for optimal reminder times based on user behavior

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Icons from [React Icons](https://react-icons.github.io/react-icons/)
- Date formatting from [date-fns](https://date-fns.org/)
- Color palette inspiration from [Tailwind CSS](https://tailwindcss.com/)