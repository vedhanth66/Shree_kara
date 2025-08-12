import React, { useEffect, useRef, useState } from 'react';
import './Home.css';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isVideoEnded, setIsVideoEnded] = useState(() => {
    return sessionStorage.getItem("introVidShown") === "true";
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState('Home');

  useEffect(() => {
    // Clean up leftover transition elements on load
    const leftovers = document.querySelectorAll(".transition-image, .transition-overlay");
    leftovers.forEach(el => el.remove());

    // Set up video end listener
    const currentVideoRef = videoRef.current;
    if (currentVideoRef) {
      currentVideoRef.addEventListener('ended', handleVideoEnd);
    }

    // Create floating particles
    createFloatingParticles();

    // Cleanup listener on component unmount
    return () => {
      if (currentVideoRef) {
        currentVideoRef.removeEventListener('ended', handleVideoEnd);
      }
    };
  }, []);

  // Corrected useEffect for the capsule
  useEffect(() => {
    const capsule = document.querySelector('.sidebar .hover-capsule');
    const listItems = document.querySelectorAll('.sidebar ul li');
    const activeListItem = document.querySelector('.sidebar ul li.active');
    const sidebarUl = document.querySelector('.sidebar ul');

    if (!capsule || !sidebarUl) return;

    const moveCapsule = (target) => {
      if (target) {
        capsule.style.top = `${target.offsetTop}px`;
        capsule.style.height = `${target.offsetHeight}px`;
        capsule.style.left = `${target.offsetLeft}px`;
        capsule.style.width = `${target.offsetWidth}px`;
        capsule.style.opacity = '1';
      }
    };

    const timer = setTimeout(() => moveCapsule(activeListItem), 50);

    const handleMouseEnter = (e) => moveCapsule(e.currentTarget);
    const handleMouseLeave = () => moveCapsule(activeListItem);

    listItems.forEach(item => {
      item.addEventListener('mouseenter', handleMouseEnter);
    });
    sidebarUl.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(timer);
      listItems.forEach(item => {
        item.removeEventListener('mouseenter', handleMouseEnter);
      });
      sidebarUl.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [activeMenuItem, isVideoEnded, isMenuOpen]);

  const createFloatingParticles = () => {
    const container = document.querySelector('.logo_container');
    if (container && !container.querySelector('.particles-container')) {
      const particles = document.createElement('div');
      particles.className = 'particles-container';
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 10}s`;
        particle.style.animationDuration = `${Math.random() * 20 + 10}s`;
        particles.appendChild(particle);
      }
      container.appendChild(particles);
    }
  };

  const handleVideoEnd = () => {
    sessionStorage.setItem("introVidShown", "true");
    setIsVideoEnded(true);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigateWithTransition = (targetPath, originElement, scaleValue) => {
    const img = originElement.querySelector("img");
    if (!img) return;

    if (isMenuOpen) setIsMenuOpen(false);

    const rect = img.getBoundingClientRect();
    const overlay = document.createElement("div");
    overlay.className = "transition-overlay";
    const clone = img.cloneNode(true);
    clone.className = "transition-image";

    Object.assign(clone.style, {
      position: "fixed",
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      objectFit: "contain",
      zIndex: "9999",
      pointerEvents: "none",
      transition: "all 2s cubic-bezier(0.4, 0, 0.2, 1)",
      transformOrigin: "center center",
      filter: "drop-shadow(0 0 50px #FFD800)"
    });
    document.body.appendChild(overlay);
    document.body.appendChild(clone);

    requestAnimationFrame(() => {
      overlay.style.opacity = "1";
      clone.style.top = "50%";
      clone.style.left = "50%";
      clone.style.transform = `translate(-50%, -50%) scale(${scaleValue}) rotateY(360deg)`;
      clone.style.filter = "drop-shadow(0 0 100px #FFD800) brightness(2)";
    });

    setTimeout(() => {
      navigate(targetPath);
      setTimeout(() => {
        overlay.remove();
        clone.remove();
      }, 200);
    }, 1200);
  };

  const handleLogoClick = (elementId, path, scale) => {
    const element = document.getElementById(elementId);
    if (element) {
      navigateWithTransition(path, element, scale);
    }
  };

  return (
    <div className="home-container">

      <div className={`hamburger-menu ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
        <span />
        <span />
        <span />
      </div>

      <div className={`mobile-menu-overlay ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}></div>

      <div className={`intro_video_container ${isVideoEnded ? 'hidden' : ''}`}>
        <video ref={videoRef} id="introVideo" autoPlay muted playsInline>
          <source src="/Logo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* --- THIS IS THE ONLY SIDEBAR --- */}
      <div className={`sidebar ${isMenuOpen ? 'open' : ''} ${isVideoEnded ? 'visible' : ''}`}>
        <ul>
          <div className="hover-capsule"></div>
          <li className={activeMenuItem === 'Home' ? 'active' : ''} onClick={() => setActiveMenuItem('Home')}>
            <Link to="/">Home</Link>
          </li>
          <li className={activeMenuItem === 'About us' ? 'active' : ''} onClick={() => setActiveMenuItem('About us')}>
            <Link to="/Eye">About us</Link>
          </li>
          <li className={activeMenuItem === 'Services' ? 'active' : ''} onClick={() => setActiveMenuItem('Services')}>
            <Link to="/Dhantha">Services</Link>
          </li>
          {/* Changed 'Contact' to 'Our Work' to match your other pages */}
          <li className={activeMenuItem === 'Our Work' ? 'active' : ''} onClick={() => setActiveMenuItem('Our Work')}>
            <Link to="/Shree">Our Work</Link>
          </li>
        </ul>
      </div>

      <div className="logo_container">
        <div className="logo_wrapper">
          <div className="logo">
            <div id="Shree" onClick={() => handleLogoClick('Shree', '/Shree', 400)}>
              <img src="/Shree.png" alt="Shree Logo" />
            </div>
            <div id="Eye" onClick={() => handleLogoClick('Eye', '/Eye', 200)}>
              <img src="/Eye.png" alt="Eye Logo" />
            </div>
            <div id="Dhantha" onClick={() => handleLogoClick('Dhantha', '/Dhantha', 400)}>
              <img src="/Dhantha.png" alt="Dhantha Logo" />
            </div>
            <div id="Kalaagruha" onClick={() => handleLogoClick('Kalaagruha', '/Kalaagruha', 2500)}>
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