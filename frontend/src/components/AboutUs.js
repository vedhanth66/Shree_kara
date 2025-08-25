import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AboutUs.css';

const AboutUs = () => {
  const navigate = useNavigate();
  const [hoveredMember, setHoveredMember] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const teamMembers = [
    {
      id: 'P1',
      name: 'Suriya Tejhas V',
      role: 'Actor & Script Writer',
      description: 'Suriya brings characters to life with his exceptional acting skills and crafts compelling narratives through his scriptwriting expertise. With a passion for storytelling and performance, he ensures every project resonates with authenticity and emotional depth.',
      image: 'https://customer-assets.emergentagent.com/job_50e2a8c7-edd0-4986-b69b-cc500d9022f9/artifacts/gbyeygrj_Suriya%20Tejhas%C2%A0V.jpg',
      specialty: 'Performance & Narrative',
      position: { top: '15%', left: '15%' }, // Top-left
      color: 'rgba(255, 99, 132, 0.8)' // Pink-red
    },
    {
      id: 'P2',
      name: 'Abhirama Shoonya',
      role: 'Cinematographer',
      description: 'Abhirama captures the essence of every frame with artistic vision and technical precision. His cinematographic expertise transforms ideas into visually stunning stories, creating immersive experiences that captivate audiences through the power of visual storytelling.',
      image: 'https://customer-assets.emergentagent.com/job_50e2a8c7-edd0-4986-b69b-cc500d9022f9/artifacts/999emwmz_Abhirama%20Shoonya.jpg',
      specialty: 'Visual Storytelling',
      position: { top: '15%', right: '15%' }, // Top-right
      color: 'rgba(54, 162, 235, 0.8)' // Blue
    },
    {
      id: 'P3',
      name: 'Sai Thanish R',
      role: 'Music Director',
      description: 'Sai weaves magic through melodies and rhythms, creating soundscapes that elevate every story. His musical compositions blend traditional and contemporary elements, bringing emotional depth and cultural richness to every project at Shree Kara Studios.',
      image: 'https://customer-assets.emergentagent.com/job_50e2a8c7-edd0-4986-b69b-cc500d9022f9/artifacts/ggr3jtdc_Sai%20Thanish%C2%A0R.jpg',
      specialty: 'Musical Composition',
      position: { bottom: '15%', right: '15%' }, // Bottom-right
      color: 'rgba(255, 206, 86, 0.8)' // Yellow
    },
    {
      id: 'P4',
      name: 'Mana Shree',
      role: 'Director',
      description: 'Mana orchestrates the creative vision with exceptional leadership and artistic insight. As the director, she brings together all elements - performance, visuals, music, and story - to create cohesive and impactful cinematic experiences that leave lasting impressions.',
      image: 'https://customer-assets.emergentagent.com/job_50e2a8c7-edd0-4986-b69b-cc500d9022f9/artifacts/v9dviaku_Mana%20Shree.jpg',
      specialty: 'Creative Direction',
      position: { bottom: '15%', left: '15%' }, // Bottom-left
      color: 'rgba(153, 102, 255, 0.8)' // Purple
    }
  ];

  const handleMemberHover = (member) => {
    if (!isAnimating) {
      setIsAnimating(true);
      setHoveredMember(member);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const handleMouseLeave = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setHoveredMember(null);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const goBack = () => {
    // Set flag to indicate back navigation
    sessionStorage.setItem('backNavigation', 'true');
    navigate('/');
  };

  useEffect(() => {
    // Create floating particles animation
    const createParticles = () => {
      const container = document.querySelector('.about-container');
      if (!container || container.querySelector('.particles')) return;
      
      const particlesDiv = document.createElement('div');
      particlesDiv.className = 'particles';
      
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesDiv.appendChild(particle);
      }
      
      container.appendChild(particlesDiv);
    };

    createParticles();
  }, []);

  return (
    <div className="about-container">
      {/* Background Effects */}
      <div className="cosmic-bg">
        <div className="stars"></div>
        <div className="grid-overlay"></div>
      </div>

      {/* Back Button */}
      <button className="back-btn" onClick={goBack}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
        Back to Home
      </button>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="header-section">
          <h1 className="main-title">Meet Our Creative Universe</h1>
          <div className="title-line"></div>
        </div>

        {/* Interactive Circle Layout */}
        <div className="circle-container">
          {/* Central Element */}
          <div className={`central-element ${hoveredMember ? 'shrunk' : ''}`}>
            <div className="central-logo">
              <img src="/Logo.png" alt="Shree Kara" />
              <div className="logo-rings">
                <div className="ring ring-1"></div>
                <div className="ring ring-2"></div>
                <div className="ring ring-3"></div>
              </div>
            </div>
            <div className="central-text">
              <h2>SHREE</h2>
              <h2>KARA</h2>
              <p>Studios</p>
            </div>
          </div>

          {/* Team Member Circles */}
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className={`member-circle ${hoveredMember?.id === member.id ? 'active' : ''}`}
              style={{
                ...member.position,
                borderColor: member.color
              }}
              onMouseEnter={() => handleMemberHover(member)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="circle-content">
                <div className="member-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <div className="circle-label">
                  <span>{member.id}</span>
                </div>
                <div className="pulse-ring" style={{ borderColor: member.color }}></div>
              </div>
            </div>
          ))}

          {/* Connecting Lines */}
          <svg className="connection-lines" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255, 215, 0, 0.3)" />
                <stop offset="100%" stopColor="rgba(255, 215, 0, 0.1)" />
              </linearGradient>
            </defs>
            {/* Lines from center to each member */}
            <line x1="50" y1="50" x2="25" y2="25" stroke="url(#lineGradient)" strokeWidth="0.2" />
            <line x1="50" y1="50" x2="75" y2="25" stroke="url(#lineGradient)" strokeWidth="0.2" />
            <line x1="50" y1="50" x2="75" y2="75" stroke="url(#lineGradient)" strokeWidth="0.2" />
            <line x1="50" y1="50" x2="25" y2="75" stroke="url(#lineGradient)" strokeWidth="0.2" />
          </svg>
        </div>

        {/* Information Panel */}
        {hoveredMember && (
          <div className="info-panel">
            <div className="info-content">
              <div className="info-header">
                <h3>[{hoveredMember.name.toUpperCase()}]</h3>
                <p className="role">{hoveredMember.role}</p>
              </div>
              <div className="info-description">
                <p>{hoveredMember.description}</p>
              </div>
              <div className="info-specialty">
                <span className="specialty-tag">{hoveredMember.specialty}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutUs;