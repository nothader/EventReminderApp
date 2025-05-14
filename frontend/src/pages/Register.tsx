import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userApi } from '../services/api';
import { User } from '../types';

interface RegisterProps {
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const Register: React.FC<RegisterProps> = ({ setUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);

    try {
      const response = await userApi.register(name, email, password);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      navigate('/');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'Registration failed. Please try again with a different email.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Create Account</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Register'}
        </button>
        
        <p className="form-footer">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </form>
    </div>
  );
};

export default Register; 