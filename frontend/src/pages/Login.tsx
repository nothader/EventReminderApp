import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userApi } from '../services/api';
import { User } from '../types';

interface LoginProps {
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const Login: React.FC<LoginProps> = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await userApi.login(email, password);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      navigate('/');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'Login failed. Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Log In</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="card">
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
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>
        
        <p className="form-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login; 