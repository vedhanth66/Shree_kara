import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PageLayout.css';

const Eye = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate('/')}>
          <i className="fas fa-arrow-left"></i> Back to Home
        </button>
        <h1 className="page-title">Cinematography</h1>
      </div>
      
      <div className="page-content">
        <div className="content-section">
          <h2>The Art of Visual Storytelling</h2>
          <p>
            Through the lens of creativity, we capture the essence of every story. 
            Our cinematography brings your vision to life with stunning visuals 
            and compelling narratives.
          </p>
          
          <div className="feature-grid">
            <div className="feature-card">
              <i className="fas fa-video"></i>
              <h3>4K Production</h3>
              <p>Ultra-high definition video production for crystal clear visuals</p>
            </div>
            
            <div className="feature-card">
              <i className="fas fa-camera"></i>
              <h3>Professional Equipment</h3>
              <p>State-of-the-art cameras and lighting equipment</p>
            </div>
            
            <div className="feature-card">
              <i className="fas fa-film"></i>
              <h3>Post Production</h3>
              <p>Complete editing and post-production services</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Eye;