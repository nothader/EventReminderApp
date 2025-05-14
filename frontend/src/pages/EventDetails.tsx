import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { eventApi } from '../services/api';
import { Event } from '../types';

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchEvent(id);
    }
  }, [id]);

  const fetchEvent = async (eventId: string) => {
    try {
      setLoading(true);
      const response = await eventApi.getEvent(eventId);
      setEvent(response.data);
    } catch (err) {
      setError('Failed to load event details. Please try again.');
      console.error('Error fetching event:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!event) return;
    
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        setLoading(true);
        await eventApi.deleteEvent(event.id);
        navigate('/');
      } catch (err) {
        setError('Failed to delete event. Please try again.');
        console.error('Error deleting event:', err);
        setLoading(false);
      }
    }
  };

  const formatDate = (date: Date | string) => {
    return format(new Date(date), 'EEEE, MMMM d, yyyy h:mm a');
  };

  if (loading) {
    return <div className="loading">Loading event details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!event) {
    return <div className="not-found">Event not found</div>;
  }

  return (
    <div className="event-details">
      <div className="event-details-header">
        <h1 className="event-title">{event.title}</h1>
        <div className="event-actions">
          <Link to={`/events/${event.id}/edit`} className="btn">
            Edit
          </Link>
          <button onClick={handleDelete} className="btn secondary delete">
            Delete
          </button>
        </div>
      </div>

      <div className="card event-card-details">
        <div className="event-dates">
          <div className="event-date">
            <strong>Start:</strong> {formatDate(event.startDate)}
          </div>
          <div className="event-date">
            <strong>End:</strong> {formatDate(event.endDate)}
          </div>
        </div>

        {event.location && (
          <div className="event-location">
            <strong>Location:</strong> {event.location}
          </div>
        )}

        <div className="event-description">
          <h3>Description</h3>
          <p>{event.description || 'No description provided.'}</p>
        </div>

        <div className="event-reminder-details">
          <h3>Reminder</h3>
          <p>
            You will be reminded {event.reminderTime} minutes before the event
            via {event.reminderType.charAt(0).toUpperCase() + event.reminderType.slice(1)}.
          </p>
        </div>

        {event.isRecurring && event.recurrencePattern && (
          <div className="event-recurrence">
            <h3>Recurrence</h3>
            <p>
              This event repeats every {event.recurrencePattern.interval}{' '}
              {event.recurrencePattern.frequency}
              {event.recurrencePattern.interval > 1 ? 's' : ''}.
              {event.recurrencePattern.endDate && (
                <span> Until {format(new Date(event.recurrencePattern.endDate), 'MMMM d, yyyy')}</span>
              )}
            </p>
          </div>
        )}
      </div>

      <div className="event-details-footer">
        <Link to="/" className="btn secondary">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default EventDetails; 