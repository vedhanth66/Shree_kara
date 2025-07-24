import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const Login = ({ onLogin, onClose }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegistering) {
        // Register new user
        await axios.post('/api/auth/register', formData);
        setIsRegistering(false);
        setError('Registration successful! Please login.');
      } else {
        // Login user
        const loginData = new FormData();
        loginData.append('username', formData.username);
        loginData.append('password', formData.password);

        const response = await axios.post('/api/auth/token', loginData);
        const { access_token } = response.data;
        
        localStorage.setItem('token', access_token);
        
        // Get user profile
        const profileResponse = await axios.get('/api/user/profile', {
          headers: { Authorization: `Bearer ${access_token}` }
        });
        
        onLogin(profileResponse.data);
      }
    } catch (error) {
      setError(error.response?.data?.detail || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-modal">
        <button className="close-btn" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        
        <h2>{isRegistering ? 'Create Account' : 'Login'}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>
          
          {isRegistering && (
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          )}
          
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Please wait...' : (isRegistering ? 'Register' : 'Login')}
          </button>
        </form>
        
        <div className="toggle-mode">
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}
          <button 
            type="button" 
            onClick={() => setIsRegistering(!isRegistering)}
            className="toggle-btn"
          >
            {isRegistering ? 'Login' : 'Register'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;