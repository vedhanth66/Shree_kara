import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Services.css';

const Services = () => {
  const navigate = useNavigate();
  const [hoveredService, setHoveredService] = useState(null);

  const services = [
    {
      id: 'cinematography',
      title: 'Cinematography',
      description: 'Professional cinematography services that capture your vision with artistic excellence and technical precision.',
      details: 'Our cinematography team uses state-of-the-art equipment and creative techniques to bring your stories to life through stunning visuals.',
      icon: '🎬',
      features: ['4K/8K Video Production', 'Drone Cinematography', 'Multi-Camera Setup', 'Color Grading']
    },
    {
      id: 'music-production',
      title: 'Music Production',
      description: 'Complete music production services from composition to final mastering for films, albums, and commercial projects.',
      details: 'Create memorable soundscapes with our expert music directors who blend traditional and contemporary musical elements.',
      icon: '🎵',
      features: ['Original Composition', 'Sound Design', 'Recording & Mixing', 'Background Scores']
    },
    {
      id: 'content-writing',
      title: 'Content Writing',
      description: 'Compelling script writing and content creation services that tell your story with impact and authenticity.',
      details: 'Our experienced writers craft engaging narratives, dialogue, and content that resonates with your target audience.',
      icon: '✍️',
      features: ['Script Writing', 'Dialogue Development', 'Story Boarding', 'Content Strategy']
    },
    {
      id: 'direction',
      title: 'Direction',
      description: 'Expert direction services that bring together all creative elements to create cohesive and impactful productions.',
      details: 'Our directors orchestrate every aspect of production to ensure your vision is realized with artistic integrity.',
      icon: '🎭',
      features: ['Creative Direction', 'Talent Management', 'Production Planning', 'Post-Production Oversight']
    },
    {
      id: 'video-production',
      title: 'Video Production',
      description: 'End-to-end video production services for commercials, documentaries, music videos, and corporate content.',
      details: 'From concept to completion, we handle every aspect of video production with professional excellence.',
      icon: '📹',
      features: ['Pre-Production Planning', 'Shooting & Direction', 'Post-Production', 'Delivery & Distribution']
    },
    {
      id: 'consulting',
      title: 'Creative Consulting',
      description: 'Strategic creative consulting to help develop your projects from initial concept to final execution.',
      details: 'Get expert guidance on creative decisions, project planning, and industry best practices.',
      icon: '💡',
      features: ['Project Development', 'Creative Strategy', 'Industry Insights', 'Budget Planning']
    }
  ];

  const goBack = () => {
    navigate('/');
  };

  return (
    <div className="services-container">
      <button className="back-btn-services" onClick={goBack}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
        Back to Home
      </button>

      <div className="services-content">
        {/* Header Section */}
        <div className="services-header">
          <h1 className="services-title">Our Services</h1>
          <p className="services-subtitle">Comprehensive creative solutions for your projects</p>
          <div className="title-underline"></div>
        </div>

        {/* Services Grid */}
        <div className="services-grid">
          {services.map((service) => (
            <div
              key={service.id}
              className={`service-card ${hoveredService === service.id ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredService(service.id)}
              onMouseLeave={() => setHoveredService(null)}
            >
              <div className="service-icon">
                <span>{service.icon}</span>
              </div>
              
              <div className="service-content">
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
                
                <div className="service-details">
                  <p className="service-details-text">{service.details}</p>
                  
                  <div className="service-features">
                    <h4>Key Features:</h4>
                    <ul>
                      {service.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="service-overlay"></div>
              <div className="service-glow"></div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="services-cta">
          <h2>Ready to Start Your Project?</h2>
          <p>Let's collaborate to bring your creative vision to life</p>
          <button 
            className="cta-button"
            onClick={() => navigate('/contact')}
          >
            Get In Touch
          </button>
        </div>

        {/* Floating elements */}
        <div className="floating-elements">
          {[...Array(15)].map((_, i) => (
            <div 
              key={i} 
              className="floating-element" 
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 20}s`,
                animationDuration: `${Math.random() * 15 + 15}s`
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;