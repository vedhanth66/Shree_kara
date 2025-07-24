import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PageLayout.css';

const Shree = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate('/')}>
          <i className="fas fa-arrow-left"></i> Back to Home
        </button>
        <h1 className="page-title">About Shree</h1>
      </div>
      
      <div className="page-content">
        <div className="content-section">
          <h2>Welcome to Shree Kara Studios</h2>
          <p>
            Shree Kara Studios is a premier movie production house dedicated to creating 
            exceptional cinematic experiences. Our name "Shree" represents prosperity and 
            creativity, embodying our commitment to producing high-quality films that 
            resonate with audiences.
          </p>
          
          <div className="about-grid">
            <div className="about-card">
              <i className="fas fa-star"></i>
              <h3>Our Vision</h3>
              <p>To be the leading production studio creating meaningful cinema that inspires and entertains</p>
            </div>
            
            <div className="about-card">
              <i className="fas fa-heart"></i>
              <h3>Our Mission</h3>
              <p>Bringing stories to life through innovative filmmaking and artistic excellence</p>
            </div>
            
            <div className="about-card">
              <i className="fas fa-trophy"></i>
              <h3>Our Values</h3>
              <p>Integrity, creativity, and passion for storytelling drive everything we do</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shree;