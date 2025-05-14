import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Event } from '../types';

interface EventCardProps {
  event: Event;
  onDelete?: (id: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onDelete }) => {
  const formatDate = (date: Date | string) => {
    return format(new Date(date), 'MMM dd, yyyy h:mm a');
  };

  return (
    <div className="card event-card">
      <div className="event-card-header">
        <div>
          <h3 className="event-title">{event.title}</h3>
          <p className="event-date">
            {formatDate(event.startDate)}
            {event.endDate && ` - ${formatDate(event.endDate)}`}
          </p>
          {event.location && (
            <p className="event-location">
              <i className="fas fa-map-marker-alt"></i>
              <span>{event.location}</span>
            </p>
          )}
        </div>
        {event.isRecurring && (
          <span className="badge recurring">Recurring</span>
        )}
      </div>
      
      <p className="event-description">{event.description}</p>
      
      <div className="event-reminder">
        <strong>Reminder:</strong> {event.reminderTime} minutes before
        via {event.reminderType.charAt(0).toUpperCase() + event.reminderType.slice(1)}
      </div>
      
      <div className="event-actions">
        <Link to={`/events/${event.id}`} className="btn secondary">
          View Details
        </Link>
        <Link to={`/events/${event.id}/edit`} className="btn secondary">
          Edit
        </Link>
        {onDelete && (
          <button 
            onClick={() => onDelete(event.id)} 
            className="btn secondary delete"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default EventCard; 