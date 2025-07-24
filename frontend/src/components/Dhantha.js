import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PageLayout.css';

const Dhantha = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate('/')}>
          <i className="fas fa-arrow-left"></i> Back to Home
        </button>
        <h1 className="page-title">Our Services</h1>
      </div>
      
      <div className="page-content">
        <div className="content-section">
          <h2>Comprehensive Production Services</h2>
          <p>
            From concept to completion, we offer a full range of production services 
            to bring your creative vision to life.
          </p>
          
          <div className="services-grid">
            <div className="service-card">
              <i className="fas fa-movie"></i>
              <h3>Film Production</h3>
              <p>Complete movie production from pre-production to post-production</p>
              <ul>
                <li>Scriptwriting & Development</li>
                <li>Casting & Direction</li>
                <li>Filming & Production</li>
                <li>Editing & Sound Design</li>
              </ul>
            </div>
            
            <div className="service-card">
              <i className="fas fa-tv"></i>
              <h3>Commercial Production</h3>
              <p>High-quality commercial and promotional video production</p>
              <ul>
                <li>Advertisement Films</li>
                <li>Corporate Videos</li>
                <li>Product Showcases</li>
                <li>Brand Campaigns</li>
              </ul>
            </div>
            
            <div className="service-card">
              <i className="fas fa-music"></i>
              <h3>Music Videos</h3>
              <p>Creative and visually stunning music video production</p>
              <ul>
                <li>Concept Development</li>
                <li>Visual Effects</li>
                <li>Color Grading</li>
                <li>Multi-format Delivery</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dhantha;