import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState('Home');

  useEffect(() => {
    // Clean up leftover transition elements
    const leftovers = document.querySelectorAll(".transition-image, .transition-overlay");
    leftovers.forEach(el => el.remove());

    // Handle video end
    if (videoRef.current) {
      videoRef.current.addEventListener('ended', handleVideoEnd);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('ended', handleVideoEnd);
      }
    };
  }, []);

  const handleVideoEnd = () => {
    setIsVideoEnded(true);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigateWithTransition = (targetPath, originElement, scaleValue) => {
    const img = originElement.querySelector("img");
    if (!img) return;

    // Close mobile menu if open
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }

    const rect = img.getBoundingClientRect();

    // Create overlay
    const overlay = document.createElement("div");
    overlay.classList.add("transition-overlay");
    Object.assign(overlay.style, {
      position: "fixed", 
      top: "0", 
      left: "0", 
      width: "100vw", 
      height: "100vh",
      backgroundColor: "rgba(0, 0, 0, 0.6)", 
      backdropFilter: "blur(20px)",
      opacity: "0", 
      zIndex: "9998", 
      transition: "opacity 0.5s ease-in-out",
      pointerEvents: "none"
    });
    document.body.appendChild(overlay);

    // Create clone
    const clone = img.cloneNode(true);
    clone.classList.add("transition-image");
    Object.assign(clone.style, {
      position: "fixed", 
      top: `${rect.top}px`, 
      left: `${rect.left}px`,
      width: `${rect.width}px`, 
      height: `${rect.height}px`,
      objectFit: "contain", 
      zIndex: "9999", 
      pointerEvents: "none",
      transition: "all 1.6s ease-in-out", 
      transformOrigin: "center center",
    });
    document.body.appendChild(clone);

    // Trigger animations
    requestAnimationFrame(() => {
      overlay.style.opacity = "1";
      clone.style.top = "50%";
      clone.style.left = "50%";
      clone.style.transform = `translate(-50%, -50%) scale(${scaleValue})`;
    });

    // Navigate after animation
    setTimeout(() => {
      clone.style.opacity = "0";
      overlay.style.opacity = "0";
      navigate(targetPath);
    }, 900);
  };

  const handleLogoClick = (elementId, path, scale) => {
    const element = document.getElementById(elementId);
    if (element) {
      navigateWithTransition(path, element, scale);
    }
  };

  return (
    <div className="home-container">
      {/* Hamburger Menu */}
      <div className={`hamburger-menu ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}></div>

      {/* Intro Video */}
      <div className={`intro_video_container ${isVideoEnded ? 'hidden' : ''}`}>
        <video 
          ref={videoRef}
          id="introVideo" 
          autoPlay 
          muted 
          playsInline
        >
          <source src="/Logo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isMenuOpen ? 'open' : ''} ${isVideoEnded ? 'visible' : ''}`}>
        <div className="hover-capsule"></div>
        <ul>
          <li className={activeMenuItem === 'Home' ? 'active' : ''} onClick={() => setActiveMenuItem('Home')}>Home</li>
          <li className={activeMenuItem === 'About us' ? 'active' : ''} onClick={() => setActiveMenuItem('About us')}>About us</li>
          <li className={activeMenuItem === 'Services' ? 'active' : ''} onClick={() => setActiveMenuItem('Services')}>Services</li>
          <li className={activeMenuItem === 'Contact' ? 'active' : ''} onClick={() => setActiveMenuItem('Contact')}>Contact</li>
        </ul>
      </div>

      {/* Logo Container */}
      <div className="logo_container">
        <div className="logo_wrapper">
          <div className="logo">
            <div 
              id="Shree" 
              onClick={() => handleLogoClick('Shree', '/Shree', 400)}
            >
              <img src="/Shree.png" alt="Shree Logo" />
            </div>
            <div 
              id="Eye" 
              onClick={() => handleLogoClick('Eye', '/Eye', 200)}
            >
              <img src="/Eye.png" alt="Eye Logo" />
            </div>
            <div 
              id="Dhantha" 
              onClick={() => handleLogoClick('Dhantha', '/Dhantha', 400)}
            >
              <img src="/Dhantha.png" alt="Dhantha Logo" />
            </div>
            <div 
              id="Kalaagruha" 
              onClick={() => handleLogoClick('Kalaagruha', '/Kalaagruha', 2500)}
            >
              <img src="/Kalaagruha.png" alt="Kalaagruha Logo" />
            </div>
            <div id="Kaara">
              <img src="/Kaara.png" alt="Kaara Logo" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;