import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import EventForm from './pages/EventForm';
import EventDetails from './pages/EventDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import Header from './components/Header';
import { userApi } from './services/api';
import { User } from './types';
import './App.css';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      userApi.getCurrentUser()
        .then(response => {
          setUser(response.data);
          setLoading(false);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // Protected route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    return <>{children}</>;
  };

  return (
    <div className="app">
      <Header user={user} />
      <main className="container">
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/events/new" element={
            <ProtectedRoute>
              <EventForm />
            </ProtectedRoute>
          } />
          <Route path="/events/:id" element={
            <ProtectedRoute>
              <EventDetails />
            </ProtectedRoute>
          } />
          <Route path="/events/:id/edit" element={
            <ProtectedRoute>
              <EventForm />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App; 