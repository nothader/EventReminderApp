import axios from 'axios';
import { Event, User, Calendar, Notification } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authentication interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Event API
export const eventApi = {
  getEvents: () => api.get<Event[]>('/events'),
  getEvent: (id: string) => api.get<Event>(`/events/${id}`),
  createEvent: (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => 
    api.post<Event>('/events', event),
  updateEvent: (id: string, event: Partial<Event>) => 
    api.put<Event>(`/events/${id}`, event),
  deleteEvent: (id: string) => 
    api.delete(`/events/${id}`),
  getUpcomingEvents: () => 
    api.get<Event[]>('/events/upcoming'),
};

// User API
export const userApi = {
  login: (email: string, password: string) => 
    api.post<{ token: string; user: User }>('/auth/login', { email, password }),
  register: (name: string, email: string, password: string) => 
    api.post<{ token: string; user: User }>('/auth/register', { name, email, password }),
  getCurrentUser: () => 
    api.get<User>('/users/me'),
  updateUserPreferences: (preferences: Partial<User['preferences']>) => 
    api.put<User>('/users/preferences', { preferences }),
};

// Calendar API
export const calendarApi = {
  getCalendars: () => 
    api.get<Calendar[]>('/calendars'),
  createCalendar: (calendar: Omit<Calendar, 'id'>) => 
    api.post<Calendar>('/calendars', calendar),
  updateCalendar: (id: string, calendar: Partial<Calendar>) => 
    api.put<Calendar>(`/calendars/${id}`, calendar),
  deleteCalendar: (id: string) => 
    api.delete(`/calendars/${id}`),
  syncCalendar: (id: string) => 
    api.post(`/calendars/${id}/sync`),
};

// Notification API
export const notificationApi = {
  getNotifications: () => 
    api.get<Notification[]>('/notifications'),
  markAsRead: (id: string) => 
    api.put(`/notifications/${id}/read`),
};

export default api; 