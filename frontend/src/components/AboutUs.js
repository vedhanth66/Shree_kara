import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AboutUs.css';

const AboutUs = () => {
  const navigate = useNavigate();
  const [hoveredMember, setHoveredMember] = useState(null);
  const [expandedMember, setExpandedMember] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);

  const teamMembers = [
    {
      id: 'Suriya',
      name: 'Suriya Tejhas V',
      role: 'Actor & Script Writer',
      description: 'Suriya brings characters to life with his exceptional acting skills and crafts compelling narratives through his scriptwriting expertise. With a passion for storytelling and performance, he ensures every project resonates with authenticity and emotional depth.',
      image: 'https://customer-assets.emergentagent.com/job_50e2a8c7-edd0-4986-b69b-cc500d9022f9/artifacts/gbyeygrj_Suriya%20Tejhas%C2%A0V.jpg',
      specialty: 'Performance & Narrative',
      position: { top: '15%', left: '15%' }, // Top-left
      color: 'rgba(255, 99, 132, 0.8)', // Pink-red
      achievements: [
        'Lead actor in 15+ theatrical productions',
        'Award-winning script writer for indie films',
        'Workshop conductor for method acting'
      ],
      experience: '8+ years in performing arts',
      quote: "Every character has a story to tell, and every story deserves authenticity."
    },
    {
      id: 'Abhirama',
      name: 'Abhirama Shoonya',
      role: 'Cinematographer',
      description: 'Abhirama captures the essence of every frame with artistic vision and technical precision. His cinematographic expertise transforms ideas into visually stunning stories, creating immersive experiences that captivate audiences through the power of visual storytelling.',
      image: 'https://customer-assets.emergentagent.com/job_50e2a8c7-edd0-4986-b69b-cc500d9022f9/artifacts/999emwmz_Abhirama%20Shoonya.jpg',
      specialty: 'Visual Storytelling',
      position: { top: '15%', right: '15%' }, // Top-right
      color: 'rgba(54, 162, 235, 0.8)', // Blue
      achievements: [
        'Cinematographer for 25+ short films',
        'Expert in drone cinematography',
        'Color grading specialist'
      ],
      experience: '10+ years in cinematography',
      quote: "The camera doesn't just capture reality; it creates emotion."
    },
    {
      id: 'Thanish',
      name: 'Sai Thanish R',
      role: 'Music Director',
      description: 'Sai weaves magic through melodies and rhythms, creating soundscapes that elevate every story. His musical compositions blend traditional and contemporary elements, bringing emotional depth and cultural richness to every project at Shree Kara Studios.',
      image: 'https://customer-assets.emergentagent.com/job_50e2a8c7-edd0-4986-b69b-cc500d9022f9/artifacts/ggr3jtdc_Sai%20Thanish%C2%A0R.jpg',
      specialty: 'Musical Composition',
      position: { bottom: '15%', right: '15%' }, // Bottom-right
      color: 'rgba(255, 206, 86, 0.8)', // Yellow
      achievements: [
        'Composed music for 50+ projects',
        'Multi-instrumentalist proficiency',
        'Traditional & contemporary fusion expert'
      ],
      experience: '12+ years in music production',
      quote: "Music is the universal language that speaks directly to the soul."
    },
    {
      id: 'Shree',
      name: 'Mana Shree',
      role: 'Director',
      description: 'Mana orchestrates the creative vision with exceptional leadership and artistic insight. As the director, she brings together all elements - performance, visuals, music, and story - to create cohesive and impactful cinematic experiences that leave lasting impressions.',
      image: 'https://customer-assets.emergentagent.com/job_50e2a8c7-edd0-4986-b69b-cc500d9022f9/artifacts/v9dviaku_Mana%20Shree.jpg',
      specialty: 'Creative Direction',
      position: { bottom: '15%', left: '15%' }, // Bottom-left
      color: 'rgba(153, 102, 255, 0.8)', // Purple
      achievements: [
        'Directed 20+ successful productions',
        'Award-winning filmmaker',
        'Creative workshop facilitator'
      ],
      experience: '15+ years in film direction',
      quote: "Direction is not about control; it's about bringing out the best in everyone."
    }
  ];

  const handleMemberHover = (member) => {
    // Clear any existing timeout
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }

    if (!isAnimating && !expandedMember) {
      setIsAnimating(true);
      setHoveredMember(member);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const handleMouseLeave = () => {
    // Clear any existing timeout
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }

    // Set a delay before clearing the hover state
    const timeout = setTimeout(() => {
      if (!isAnimating && !expandedMember) {
        setIsAnimating(true);
        setHoveredMember(null);
        setTimeout(() => setIsAnimating(false), 300);
      }
    }, 200); // 200ms delay

    setHoverTimeout(timeout);
  };

  const handleMemberClick = (member) => {
    if (!expandedMember) {
      setExpandedMember(member);
      setHoveredMember(null);
      // Clear any hover timeout
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    }
  };

  const closeExpandedCard = () => {
    setExpandedMember(null);
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

    // Cleanup function
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

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
          <div className={`central-element ${hoveredMember || expandedMember ? 'shrunk' : ''}`}>
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
              className={`member-circle ${hoveredMember?.id === member.id ? 'active' : ''} ${expandedMember ? 'hidden' : ''}`}
              style={{
                ...member.position,
                borderColor: member.color
              }}
              onMouseEnter={() => handleMemberHover(member)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleMemberClick(member)}
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

        {/* Information Panel - Only for hover */}
        {hoveredMember && !expandedMember && (
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

        {/* Expanded Member Card */}
        {expandedMember && (
          <div className="expanded-card-overlay">
            <div className="expanded-card">
              <button className="close-btn" onClick={closeExpandedCard}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
              
              <div className="expanded-content">
                <div className="expanded-header">
                  <div className="expanded-image">
                    <img src={expandedMember.image} alt={expandedMember.name} />
                    <div className="image-border" style={{ borderColor: expandedMember.color }}></div>
                  </div>
                  <div className="expanded-info">
                    <h2 className="expanded-name">{expandedMember.name}</h2>
                    <p className="expanded-role">{expandedMember.role}</p>
                    <div className="expanded-specialty">
                      <span className="specialty-badge" style={{ backgroundColor: expandedMember.color }}>
                        {expandedMember.specialty}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="expanded-body">
                  <div className="quote-section">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="quote-icon">
                      <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
                    </svg>
                    <p className="member-quote">"{expandedMember.quote}"</p>
                  </div>

                  <div className="details-grid">
                    <div className="detail-section">
                      <h4>About</h4>
                      <p>{expandedMember.description}</p>
                    </div>

                    <div className="detail-section">
                      <h4>Experience</h4>
                      <p>{expandedMember.experience}</p>
                    </div>

                    <div className="detail-section">
                      <h4>Key Achievements</h4>
                      <ul>
                        {expandedMember.achievements.map((achievement, index) => (
                          <li key={index}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutUs;