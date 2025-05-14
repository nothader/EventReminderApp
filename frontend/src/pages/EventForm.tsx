import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { eventApi } from '../services/api';
import { Event, RecurrencePattern } from '../types';

const defaultEvent: Omit<Event, 'id' | 'createdAt' | 'updatedAt'> = {
  title: '',
  description: '',
  startDate: new Date().toISOString().substring(0, 16),
  endDate: new Date(Date.now() + 3600000).toISOString().substring(0, 16),
  reminderTime: 30,
  reminderType: 'email',
  isRecurring: false,
  notifications: [],
  userId: ''
};

const EventForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(defaultEvent);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState<RecurrencePattern>({
    frequency: 'weekly',
    interval: 1
  });

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      fetchEvent(id);
    }
  }, [id]);

  const fetchEvent = async (eventId: string) => {
    try {
      setLoading(true);
      const response = await eventApi.getEvent(eventId);
      const fetchedEvent = response.data;
      
      // Format dates for input type="datetime-local"
      fetchedEvent.startDate = new Date(fetchedEvent.startDate)
        .toISOString().substring(0, 16);
      fetchedEvent.endDate = new Date(fetchedEvent.endDate)
        .toISOString().substring(0, 16);
      
      setEvent(fetchedEvent);
      if (fetchedEvent.recurrencePattern) {
        setRecurrencePattern(fetchedEvent.recurrencePattern);
      }
    } catch (err) {
      setError('Failed to load event. Please try again.');
      console.error('Error fetching event:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setEvent({
        ...event,
        [name]: checked
      });
    } else {
      setEvent({
        ...event,
        [name]: value
      });
    }
  };

  const handleRecurrenceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setRecurrencePattern({
        ...recurrencePattern,
        [name]: checked
      });
    } else if (type === 'number') {
      setRecurrencePattern({
        ...recurrencePattern,
        [name]: Number(value)
      });
    } else {
      setRecurrencePattern({
        ...recurrencePattern,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Prepare event data
      const eventData = {
        ...event,
        recurrencePattern: event.isRecurring ? recurrencePattern : undefined,
      };

      if (isEditing) {
        // Update existing event
        await eventApi.updateEvent(id!, eventData);
      } else {
        // Create new event
        await eventApi.createEvent(eventData);
      }

      navigate('/');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        `Failed to ${isEditing ? 'update' : 'create'} event. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return <div className="loading">Loading event...</div>;
  }

  return (
    <div className="form-container">
      <h1 className="form-title">
        {isEditing ? 'Edit Event' : 'Create New Event'}
      </h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label htmlFor="title">Event Title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={event.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={event.description}
            onChange={handleChange}
            rows={4}
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startDate">Start Date & Time</label>
            <input
              id="startDate"
              name="startDate"
              type="datetime-local"
              value={event.startDate}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="endDate">End Date & Time</label>
            <input
              id="endDate"
              name="endDate"
              type="datetime-local"
              value={event.endDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="location">Location (Optional)</label>
          <input
            id="location"
            name="location"
            type="text"
            value={event.location || ''}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-divider"></div>
        
        <h3>Reminder Settings</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="reminderTime">Remind Me</label>
            <select
              id="reminderTime"
              name="reminderTime"
              value={event.reminderTime}
              onChange={handleChange}
            >
              <option value="5">5 minutes before</option>
              <option value="10">10 minutes before</option>
              <option value="15">15 minutes before</option>
              <option value="30">30 minutes before</option>
              <option value="60">1 hour before</option>
              <option value="120">2 hours before</option>
              <option value="1440">1 day before</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="reminderType">Notification Type</label>
            <select
              id="reminderType"
              name="reminderType"
              value={event.reminderType}
              onChange={handleChange}
            >
              <option value="email">Email</option>
              <option value="push">Push Notification</option>
              <option value="sms">SMS</option>
            </select>
          </div>
        </div>
        
        <div className="form-group checkbox-group">
          <input
            id="isRecurring"
            name="isRecurring"
            type="checkbox"
            checked={event.isRecurring}
            onChange={handleChange}
          />
          <label htmlFor="isRecurring">This is a recurring event</label>
        </div>
        
        {event.isRecurring && (
          <div className="recurrence-options">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="frequency">Repeat</label>
                <select
                  id="frequency"
                  name="frequency"
                  value={recurrencePattern.frequency}
                  onChange={handleRecurrenceChange}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="interval">Every</label>
                <input
                  id="interval"
                  name="interval"
                  type="number"
                  min="1"
                  max="99"
                  value={recurrencePattern.interval}
                  onChange={handleRecurrenceChange}
                />
                <span>{recurrencePattern.frequency.slice(0, -2)}(s)</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="endDate">End Date (Optional)</label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                value={recurrencePattern.endDate || ''}
                onChange={handleRecurrenceChange}
              />
            </div>
          </div>
        )}
        
        <div className="form-actions">
          <button type="button" onClick={() => navigate('/')} className="btn secondary">
            Cancel
          </button>
          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : isEditing ? 'Update Event' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm; 