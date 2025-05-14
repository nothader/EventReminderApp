import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="logo">
          EventReminder
        </Link>
        
        {user ? (
          <nav className="nav-links">
            <Link to="/" className="nav-link">Dashboard</Link>
            <Link to="/events/new" className="nav-link">Add Event</Link>
            
            <div className="user-menu" onClick={() => setMenuOpen(!menuOpen)}>
              <span>{user.name}</span>
              <i className="fas fa-chevron-down"></i>
              
              {menuOpen && (
                <div className="dropdown-menu">
                  <Link to="/settings" className="dropdown-item">Settings</Link>
                  <button onClick={handleLogout} className="dropdown-item">Logout</button>
                </div>
              )}
            </div>
          </nav>
        ) : (
          <nav className="nav-links">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header; 