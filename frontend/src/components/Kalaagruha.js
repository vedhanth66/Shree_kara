import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from './Login';
import Upload from './Upload';
import Gallery from './Gallery';
import './PageLayout.css';
import './Kalaagruha.css';

const Kalaagruha = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile(token);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get('/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      localStorage.removeItem('token');
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setShowUpload(false);
  };

  return (
    <div className="page-container kalaagruha-container">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate('/')}>
          <i className="fas fa-arrow-left"></i> Back to Home
        </button>
        <h1 className="page-title">Kalaagruha - Art Gallery</h1>
        
        <div className="auth-section">
          {user ? (
            <div className="user-menu">
              <span className="welcome-text">Welcome, Author {user.username}</span>
              <button 
                className="upload-btn"
                onClick={() => setShowUpload(!showUpload)}
              >
                <i className="fas fa-plus"></i> Upload Content
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>
          ) : (
            <button 
              className="login-btn"
              onClick={() => setShowLogin(true)}
            >
              <i className="fas fa-user-edit"></i> Author Login
            </button>
          )}
        </div>
      </div>
      
      <div className="page-content">
        {showLogin && (
          <Login 
            onLogin={handleLogin} 
            onClose={() => setShowLogin(false)} 
          />
        )}
        
        {showUpload && user && (
          <Upload 
            onClose={() => setShowUpload(false)} 
          />
        )}
        
        <div className="content-section">
          <h2>Creative Gallery</h2>
          <p>
            Welcome to our creative gallery where we showcase beautiful images and 
            meaningful poems. Authors can login to upload and share their creative works 
            with the world.
          </p>
          
          <Gallery />
        </div>
      </div>
    </div>
  );
};

export default Kalaagruha;