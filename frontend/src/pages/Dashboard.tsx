import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EventCard from '../components/EventCard';
import { eventApi } from '../services/api';
import { Event } from '../types';

const Dashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventApi.getEvents();
      setEvents(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load events. Please try again later.');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventApi.deleteEvent(id);
        setEvents(events.filter(event => event.id !== id));
      } catch (err) {
        setError('Failed to delete event. Please try again.');
        console.error('Error deleting event:', err);
      }
    }
  };

  // Group events by date (today, upcoming, later)
  const todayEvents = events.filter(event => {
    const eventDate = new Date(event.startDate);
    const today = new Date();
    return (
      eventDate.getDate() === today.getDate() &&
      eventDate.getMonth() === today.getMonth() &&
      eventDate.getFullYear() === today.getFullYear()
    );
  });

  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.startDate);
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    return (
      eventDate > today &&
      !(
        eventDate.getDate() === today.getDate() &&
        eventDate.getMonth() === today.getMonth() &&
        eventDate.getFullYear() === today.getFullYear()
      ) &&
      eventDate <= nextWeek
    );
  });

  const laterEvents = events.filter(event => {
    const eventDate = new Date(event.startDate);
    const nextWeek = new Date();
    nextWeek.setDate(new Date().getDate() + 7);
    
    return eventDate > nextWeek;
  });

  if (loading) {
    return <div className="loading">Loading events...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="section-title">Your Events</h1>
        <Link to="/events/new" className="btn">
          Add New Event
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      {events.length === 0 ? (
        <div className="empty-state card">
          <h3>No events found</h3>
          <p>Get started by creating your first event!</p>
          <Link to="/events/new" className="btn">
            Create Event
          </Link>
        </div>
      ) : (
        <>
          {todayEvents.length > 0 && (
            <section>
              <h2 className="section-title">Today</h2>
              <div className="dashboard">
                {todayEvents.map(event => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onDelete={handleDeleteEvent} 
                  />
                ))}
              </div>
            </section>
          )}

          {upcomingEvents.length > 0 && (
            <section>
              <h2 className="section-title">Upcoming (Next 7 Days)</h2>
              <div className="dashboard">
                {upcomingEvents.map(event => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onDelete={handleDeleteEvent} 
                  />
                ))}
              </div>
            </section>
          )}

          {laterEvents.length > 0 && (
            <section>
              <h2 className="section-title">Later</h2>
              <div className="dashboard">
                {laterEvents.map(event => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onDelete={handleDeleteEvent} 
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard; 