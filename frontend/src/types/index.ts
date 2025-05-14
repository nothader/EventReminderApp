export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: Date | string;
  endDate: Date | string;
  location?: string;
  reminderTime: number; // minutes before event
  reminderType: 'email' | 'push' | 'sms';
  isRecurring: boolean;
  recurrencePattern?: RecurrencePattern;
  calendarId?: string; // For calendar integration
  notifications: Notification[];
  createdAt: Date | string;
  updatedAt: Date | string;
  userId: string;
}

export interface RecurrencePattern {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number; // every X days/weeks/months/years
  endDate?: Date | string;
  daysOfWeek?: number[]; // 0 = Sunday, 1 = Monday, etc.
  dayOfMonth?: number;
  monthOfYear?: number;
}

export interface Notification {
  id: string;
  eventId: string;
  type: 'email' | 'push' | 'sms';
  status: 'pending' | 'sent' | 'failed';
  scheduledTime: Date | string;
  sentTime?: Date | string;
  content: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  defaultReminderTime: number; // minutes before event
  defaultReminderType: 'email' | 'push' | 'sms';
  enableSmartReminders: boolean;
  timeZone: string;
}

export interface Calendar {
  id: string;
  name: string;
  type: 'google' | 'outlook' | 'apple' | 'custom';
  color: string;
  isDefault: boolean;
  userId: string;
} 