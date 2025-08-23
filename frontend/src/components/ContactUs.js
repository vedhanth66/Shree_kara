import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ContactUs.css';

const ContactUs = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitMessage('Thank you for reaching out! We\'ll get back to you within 24 hours.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
      
      // Clear message after 5 seconds
      setTimeout(() => setSubmitMessage(''), 5000);
    }, 2000);
  };

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

        {/* Main Content */}
        <div className="contact-main">
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

          {/* Contact Form */}
          <div className="contact-form-section">
            <h2 className="section-title">Send Us a Message</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a service</option>
                    <option value="Cinematography">Cinematography</option>
                    <option value="Music Production">Music Production</option>
                    <option value="Content Writing">Content Writing</option>
                    <option value="Direction">Direction</option>
                    <option value="Video Production">Video Production</option>
                    <option value="Creative Consulting">Creative Consulting</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="6"
                  placeholder="Tell us about your project or inquiry..."
                ></textarea>
              </div>

              <button
                type="submit"
                className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner"></div>
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>

            {submitMessage && (
              <div className="submit-message">
                <div className="message-icon">✅</div>
                <p>{submitMessage}</p>
              </div>
            )}
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