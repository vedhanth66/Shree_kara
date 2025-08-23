import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ContactUs.css';

const ContactUs = () => {
  const navigate = useNavigate();

  const contactInfo = [
    {
      icon: '📱',
      title: 'Phone',
      details: ['+91 98765 43210', '+91 87654 32109'],
      description: 'Call us for immediate assistance'
    },
    {
      icon: '✉️',
      title: 'Email',
      details: ['contact@shreekarastudios.com', 'projects@shreekarastudios.com'],
      description: 'Send us your project details'
    },
    {
      icon: '📍',
      title: 'Office',
      details: ['Chennai, Tamil Nadu', 'India'],
      description: 'Visit our creative studio'
    },
    {
      icon: '🕒',
      title: 'Hours',
      details: ['Mon - Fri: 9:00 AM - 8:00 PM', 'Sat: 10:00 AM - 6:00 PM'],
      description: 'We\'re here to help'
    }
  ];

  const goBack = () => {
    navigate('/');
  };

  return (
    <div className="contact-container">
      <button className="back-btn-contact" onClick={goBack}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
        Back to Home
      </button>

      <div className="contact-content">
        {/* Header Section */}
        <div className="contact-header">
          <h1 className="contact-title">Get In Touch</h1>
          <p className="contact-subtitle">Let's collaborate to bring your creative vision to life</p>
          <div className="title-underline"></div>
        </div>

        {/* Contact Information */}
        <div className="contact-info-section">
          <h2 className="section-title">Contact Information</h2>
          <div className="contact-info-grid">
            {contactInfo.map((info, index) => (
              <div key={index} className="contact-info-card">
                <div className="info-icon">
                  <span>{info.icon}</span>
                </div>
                <div className="info-content">
                  <h3 className="info-title">{info.title}</h3>
                  <div className="info-details">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="info-detail">{detail}</p>
                    ))}
                  </div>
                  <p className="info-description">{info.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Contact Message */}
        <div className="contact-message">
          <div className="message-card">
            <h3 className="message-title">Ready to Start Your Project?</h3>
            <p className="message-text">
              We'd love to hear about your creative vision and discuss how we can bring it to life. 
              Reach out to us through any of the contact methods above, and let's create something extraordinary together.
            </p>
            <div className="message-features">
              <div className="feature-item">
                <span className="feature-icon">🎬</span>
                <span>Professional Cinematography</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎵</span>
                <span>Original Music Composition</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✍️</span>
                <span>Creative Writing & Scripts</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎭</span>
                <span>Direction & Performance</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="social-section">
          <h3 className="social-title">Follow Us</h3>
          <div className="social-links">
            <a href="#" className="social-link" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="social-link" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="social-link" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="social-link" aria-label="YouTube">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="#" className="social-link" aria-label="LinkedIn">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>

        {/* Floating elements */}
        <div className="floating-bg-elements">
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className="floating-bg-element" 
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 25}s`,
                animationDuration: `${Math.random() * 20 + 20}s`
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactUs;