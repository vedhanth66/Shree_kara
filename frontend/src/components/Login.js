import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const Login = ({ onLogin, onClose }) => {
  const [formData, setFormData] = useState({
    username: '',
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
      // Login author
      const loginData = new FormData();
      loginData.append('username', formData.username);
      loginData.append('password', formData.password);

      const response = await axios.post('/api/auth/token', loginData);
      const { access_token } = response.data;
      
      localStorage.setItem('token', access_token);
      
      // Get author profile
      const profileResponse = await axios.get('/api/user/profile', {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      
      onLogin(profileResponse.data);
    } catch (error) {
      setError('Invalid author credentials');
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
        
        <h2>Author Login</h2>
        <p className="login-subtitle">Enter your author credentials to upload content</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Author Username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>
          
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
            {loading ? 'Please wait...' : 'Login as Author'}
          </button>
        </form>
        
        <div className="demo-credentials">
          <p><strong>Demo Credentials:</strong></p>
          <p>Username: <code>admin</code> | Password: <code>shree123</code></p>
          <p>Username: <code>author1</code> | Password: <code>kara456</code></p>
        </div>
      </div>
    </div>
  );
};

export default Login;