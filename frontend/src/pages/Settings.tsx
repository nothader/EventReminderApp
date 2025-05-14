import React, { useState, useEffect } from 'react';
import { userApi } from '../services/api';
import { User, UserPreferences } from '../types';

const Settings: React.FC = () => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    defaultReminderTime: 30,
    defaultReminderType: 'email',
    enableSmartReminders: true,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await userApi.getCurrentUser();
      setUser(response.data);
      setPreferences(response.data.preferences);
    } catch (err) {
      setError('Failed to load user profile. Please try again.');
      console.error('Error fetching user profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setPreferences({
        ...preferences,
        [name]: checked
      });
    } else {
      setPreferences({
        ...preferences,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      await userApi.updateUserPreferences(preferences);
      setSuccess('Settings updated successfully!');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'Failed to update settings. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading preferences...</div>;
  }

  return (
    <div className="form-container">
      <h1 className="form-title">Settings</h1>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit} className="card">
        <h2>Notification Preferences</h2>
        
        <div className="form-group">
          <label htmlFor="defaultReminderType">Default Notification Type</label>
          <select
            id="defaultReminderType"
            name="defaultReminderType"
            value={preferences.defaultReminderType}
            onChange={handleChange}
          >
            <option value="email">Email</option>
            <option value="push">Push Notification</option>
            <option value="sms">SMS</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="defaultReminderTime">Default Reminder Time</label>
          <select
            id="defaultReminderTime"
            name="defaultReminderTime"
            value={preferences.defaultReminderTime}
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
        
        <div className="form-group checkbox-group">
          <input
            id="enableSmartReminders"
            name="enableSmartReminders"
            type="checkbox"
            checked={preferences.enableSmartReminders}
            onChange={handleChange}
          />
          <label htmlFor="enableSmartReminders">
            Enable Smart Reminders (AI-based timing optimization)
          </label>
        </div>
        
        <div className="form-group">
          <label htmlFor="timeZone">Time Zone</label>
          <select
            id="timeZone"
            name="timeZone"
            value={preferences.timeZone}
            onChange={handleChange}
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
            <option value="Europe/London">London</option>
            <option value="Europe/Paris">Paris</option>
            <option value="Asia/Tokyo">Tokyo</option>
            <option value="Australia/Sydney">Sydney</option>
          </select>
        </div>
        
        <h2>Account Information</h2>
        
        {user && (
          <div className="user-info">
            <div className="form-group">
              <label>Email</label>
              <div className="readonly-field">{user.email}</div>
            </div>
            
            <div className="form-group">
              <label>Name</label>
              <div className="readonly-field">{user.name}</div>
            </div>
          </div>
        )}
        
        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
};

export default Settings; 