import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AboutUs.css';

const AboutUs = () => {
  const navigate = useNavigate();
  const [hoveredFounder, setHoveredFounder] = useState(null);

  const founders = [
    {
      id: 'suriya',
      name: 'Suriya Tejhas V',
      role: 'Actor & Script Writer',
      description: 'Suriya brings characters to life with his exceptional acting skills and crafts compelling narratives through his scriptwriting expertise. With a passion for storytelling and performance, he ensures every project resonates with authenticity and emotional depth.',
      image: 'https://customer-assets.emergentagent.com/job_50e2a8c7-edd0-4986-b69b-cc500d9022f9/artifacts/gbyeygrj_Suriya%20Tejhas%C2%A0V.jpg',
      position: 'left-1'
    },
    {
      id: 'abhirama',
      name: 'Abhirama Shoonya',
      role: 'Cinematographer',
      description: 'Abhirama captures the essence of every frame with artistic vision and technical precision. His cinematographic expertise transforms ideas into visually stunning stories, creating immersive experiences that captivate audiences through the power of visual storytelling.',
      image: 'https://customer-assets.emergentagent.com/job_50e2a8c7-edd0-4986-b69b-cc500d9022f9/artifacts/999emwmz_Abhirama%20Shoonya.jpg',
      position: 'left-2'
    },
    {
      id: 'sai',
      name: 'Sai Thanish R',
      role: 'Music Director',
      description: 'Sai weaves magic through melodies and rhythms, creating soundscapes that elevate every story. His musical compositions blend traditional and contemporary elements, bringing emotional depth and cultural richness to every project at Shree Kara Studios.',
      image: 'https://customer-assets.emergentagent.com/job_50e2a8c7-edd0-4986-b69b-cc500d9022f9/artifacts/ggr3jtdc_Sai%20Thanish%C2%A0R.jpg',
      position: 'right-1'
    },
    {
      id: 'mana',
      name: 'Mana Shree',
      role: 'Director',
      description: 'Mana orchestrates the creative vision with exceptional leadership and artistic insight. As the director, she brings together all elements - performance, visuals, music, and story - to create cohesive and impactful cinematic experiences that leave lasting impressions.',
      image: 'https://customer-assets.emergentagent.com/job_50e2a8c7-edd0-4986-b69b-cc500d9022f9/artifacts/v9dviaku_Mana%20Shree.jpg',
      position: 'right-2'
    }
  ];

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
        {/* Central Logo */}
        <div className="logo-center">
          <img src="/Logo.png" alt="Shree Kara Studios" className="main-logo" />
          <div className="logo-glow"></div>
        </div>

        {/* Founders positioned around the logo */}
        <div className="founders-container">
          {founders.map((founder) => (
            <div
              key={founder.id}
              className={`founder-card ${founder.position} ${hoveredFounder === founder.id ? 'active' : ''} ${hoveredFounder && hoveredFounder !== founder.id ? 'dimmed' : ''}`}
              onMouseEnter={() => setHoveredFounder(founder.id)}
              onMouseLeave={() => setHoveredFounder(null)}
            >
              <div className="founder-image-container">
                <img src={founder.image} alt={founder.name} className="founder-image" />
                <div className="founder-overlay"></div>
              </div>
              
              <div className="founder-info">
                <h3 className="founder-name">{founder.name}</h3>
                <h4 className="founder-role">{founder.role}</h4>
                <p className="founder-description">{founder.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Floating particles */}
        <div className="particles-bg">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle-bg" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${Math.random() * 10 + 10}s`
            }}></div>
          ))}
        </div>

        {/* Company description overlay */}
        <div className="company-description">
          <h1 className="company-title">Shree Kara Studios</h1>
          <p className="company-subtitle">Where Stories Come to Life</p>
          <div className="description-text">
            <p>At Shree Kara Studios, we believe in the power of storytelling through cinema. Our team of passionate creators brings together diverse talents in acting, cinematography, music, and direction to craft extraordinary visual experiences that resonate with audiences across cultures and generations.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;