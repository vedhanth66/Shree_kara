import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AboutUs.css';

const AboutUs = () => {
  const navigate = useNavigate();
  const [selectedMember, setSelectedMember] = useState(null);
  const [rotation, setRotation] = useState(0);

  const teamMembers = [
    {
      id: 'suriya',
      name: 'Suriya Tejhas V',
      role: 'Actor & Script Writer',
      description: 'Suriya brings characters to life with his exceptional acting skills and crafts compelling narratives through his scriptwriting expertise. With a passion for storytelling and performance, he ensures every project resonates with authenticity and emotional depth.',
      image: 'https://customer-assets.emergentagent.com/job_50e2a8c7-edd0-4986-b69b-cc500d9022f9/artifacts/gbyeygrj_Suriya%20Tejhas%C2%A0V.jpg',
      specialty: 'Performance & Narrative',
      position: 0
    },
    {
      id: 'abhirama',
      name: 'Abhirama Shoonya',
      role: 'Cinematographer',
      description: 'Abhirama captures the essence of every frame with artistic vision and technical precision. His cinematographic expertise transforms ideas into visually stunning stories, creating immersive experiences that captivate audiences through the power of visual storytelling.',
      image: 'https://customer-assets.emergentagent.com/job_50e2a8c7-edd0-4986-b69b-cc500d9022f9/artifacts/999emwmz_Abhirama%20Shoonya.jpg',
      specialty: 'Visual Storytelling',
      position: 1
    },
    {
      id: 'sai',
      name: 'Sai Thanish R',
      role: 'Music Director',
      description: 'Sai weaves magic through melodies and rhythms, creating soundscapes that elevate every story. His musical compositions blend traditional and contemporary elements, bringing emotional depth and cultural richness to every project at Shree Kara Studios.',
      image: 'https://customer-assets.emergentagent.com/job_50e2a8c7-edd0-4986-b69b-cc500d9022f9/artifacts/ggr3jtdc_Sai%20Thanish%C2%A0R.jpg',
      specialty: 'Musical Composition',
      position: 2
    },
    {
      id: 'mana',
      name: 'Mana Shree',
      role: 'Director',
      description: 'Mana orchestrates the creative vision with exceptional leadership and artistic insight. As the director, she brings together all elements - performance, visuals, music, and story - to create cohesive and impactful cinematic experiences that leave lasting impressions.',
      image: 'https://customer-assets.emergentagent.com/job_50e2a8c7-edd0-4986-b69b-cc500d9022f9/artifacts/v9dviaku_Mana%20Shree.jpg',
      specialty: 'Creative Direction',
      position: 3
    }
  ];

  const handleMemberHover = (member) => {
    if (selectedMember?.id !== member.id) {
      setSelectedMember(member);
      // Calculate rotation to bring selected member to front-center
      const targetRotation = -(member.position * 90);
      setRotation(targetRotation);
    }
  };

  const handleMouseLeave = () => {
    // Optional: Reset to default state when not hovering
    // setSelectedMember(null);
    // setRotation(0);
  };

  const goBack = () => {
    navigate('/');
  };

  return (
    <div className="about-us-container">
      <button className="back-btn-about" onClick={goBack}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
        Back to Home
      </button>

      <div className="about-content">
        {/* Header Section */}
        <div className="about-header">
          <div className="logo-container">
            <img src="/Logo.png" alt="Shree Kara Studios" className="company-logo" />
            <div className="logo-glow-effect"></div>
          </div>
          <h1 className="company-title">Shree Kara Studios</h1>
          <p className="company-tagline">Where Stories Come to Life</p>
          <div className="title-divider"></div>
        </div>

        {/* Company Description */}
        <div className="company-overview">
          <p className="overview-text">
            At Shree Kara Studios, we believe in the power of storytelling through cinema. Our team of passionate creators brings together diverse talents in acting, cinematography, music, and direction to craft extraordinary visual experiences that resonate with audiences across cultures and generations.
          </p>
        </div>

        {/* 3D Wheel Section */}
        <div className="wheel-section">
          <h2 className="team-title">Meet Our Creative Team</h2>
          
          <div className="wheel-container">
            {/* Central Shree Logo */}
            <div className="central-logo">
              <img src="/Logo.png" alt="Shree Logo" className="shree-logo" />
              <div className="logo-pulse"></div>
            </div>

            {/* 3D Wheel */}
            <div 
              className="team-wheel" 
              style={{ transform: `rotateY(${rotation}deg)` }}
              onMouseLeave={handleMouseLeave}
            >
              {teamMembers.map((member, index) => (
                <div
                  key={member.id}
                  className={`wheel-member ${selectedMember?.id === member.id ? 'active' : ''}`}
                  style={{
                    transform: `rotateY(${index * 90}deg) translateZ(280px)`
                  }}
                  onMouseEnter={() => handleMemberHover(member)}
                >
                  <div className="member-card">
                    <div className="member-image-container">
                      <img src={member.image} alt={member.name} className="member-image" />
                      <div className="member-overlay"></div>
                    </div>
                    <div className="member-info">
                      <h3 className="member-name">{member.name}</h3>
                      <p className="member-role">{member.role}</p>
                      <span className="member-specialty">{member.specialty}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Member Details */}
            {selectedMember && (
              <div className="selected-member-details">
                <div className="details-card">
                  <div className="details-header">
                    <h3>{selectedMember.name}</h3>
                    <p>{selectedMember.role}</p>
                  </div>
                  <div className="details-content">
                    <p>{selectedMember.description}</p>
                  </div>
                  <div className="details-specialty">
                    <span>{selectedMember.specialty}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Background Effects */}
        <div className="background-particles">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="particle" 
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 20}s`,
                animationDuration: `${Math.random() * 10 + 15}s`
              }}
            ></div>
          ))}
        </div>

        <div className="floating-orbs">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              className="floating-orb" 
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 15}s`,
                animationDuration: `${Math.random() * 20 + 25}s`
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;