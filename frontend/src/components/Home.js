import React, { useEffect, useRef, useState } from 'react';
import './Home.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  // Default to true (video ended) to prevent flashes, useEffect will correct it.
  const [isVideoEnded, setIsVideoEnded] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState('Home');
  const [hoveredLogo, setHoveredLogo] = useState(null);
  const [startLogoAnimation, setStartLogoAnimation] = useState(false);

  // Author login states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // New state to track the selected logo on touch devices
  const [activeLogo, setActiveLogo] = useState(null);

  // Check for touch device support
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  useEffect(() => {
    // --- Logic to determine if video should play ---
    const navEntries = performance.getEntriesByType('navigation');
    const navType = navEntries.length > 0 ? navEntries[0].type : '';
    const hasVisitedInSession = sessionStorage.getItem('hasVisitedHomePage');

    // Play video on first visit in a session OR on reload.
    if (navType === 'reload' || !hasVisitedInSession) {
      sessionStorage.setItem('hasVisitedHomePage', 'true');
      setIsVideoEnded(false); // Play the video
    } else {
      setIsVideoEnded(true); // Skip the video
    }

    // Clean up leftover transition elements
    document.querySelectorAll(".transition-image, .transition-overlay").forEach(el => el.remove());

    // Video end listener
    const currentVideoRef = videoRef.current;
    if (currentVideoRef) {
      currentVideoRef.addEventListener('ended', handleVideoEnd);
    }

    // Floating particles
    createFloatingParticles();

    // Start logo animation after 7s
    const animationTimeout = setTimeout(() => {
      setStartLogoAnimation(true);
    }, 7000);

    // Check auth status
    checkAuthStatus();

    return () => {
      if (currentVideoRef) {
        currentVideoRef.removeEventListener('ended', handleVideoEnd);
      }
      clearTimeout(animationTimeout);
    };
  }, []);

  // Capsule hover logic
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
      for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 10}s`;
        particle.style.animationDuration = `${Math.random() * 25 + 15}s`;
        particles.appendChild(particle);
      }
      container.appendChild(particles);
    }
  };

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  };

  const handleVideoEnd = () => {
    setIsVideoEnded(true);
  };

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  // Optimized transition with GPU acceleration and better performance
  const navigateWithTransition = (targetPath, originElement, scaleValue) => {
    const img = originElement.querySelector("img");
    if (!img) return;

    if (isMenuOpen) setIsMenuOpen(false);

    const rect = img.getBoundingClientRect();
    
    // Create optimized overlay
    const overlay = document.createElement("div");
    overlay.className = "transition-overlay";
    Object.assign(overlay.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100vw",
      height: "100vh",
      background: "radial-gradient(circle, rgba(255,216,0,0.1) 0%, rgba(0,0,0,0.8) 100%)",
      zIndex: "9998",
      opacity: "0",
      backdropFilter: "blur(0px)",
      transition: "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
    });

    // Create optimized clone with GPU acceleration
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
      transition: "transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 1s ease",
      transformOrigin: "center center",
      transform: "translateZ(0)", // Force GPU acceleration
      willChange: "transform, filter", // Optimize for animation
      filter: "drop-shadow(0 0 20px rgba(255,216,0,0.6)) brightness(1.2)"
    });

    document.body.appendChild(overlay);
    document.body.appendChild(clone);

    // Trigger animation with RAF for smooth performance
    requestAnimationFrame(() => {
      overlay.style.opacity = "1";
      overlay.style.backdropFilter = "blur(10px)";
      
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      clone.style.transform = `
        translate(${centerX - rect.left - rect.width/2}px, ${centerY - rect.top - rect.height/2}px) 
        scale(${scaleValue/100}) 
        rotateY(180deg) 
        rotateZ(360deg)
        translateZ(50px)
      `;
      clone.style.filter = "drop-shadow(0 0 50px rgba(255,216,0,0.9)) brightness(2) saturate(1.5)";
    });

    // Navigate and cleanup with proper timing
    setTimeout(() => {
      navigate(targetPath);
      
      // Cleanup after navigation
      setTimeout(() => {
        overlay?.remove();
        clone?.remove();
      }, 100);
    }, 800);
  };

  // Unified handler for both click and touch
  const handleLogoInteraction = (elementId, path, scale) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    if (isTouchDevice) {
      if (activeLogo === elementId) {
        setActiveLogo(null);
        navigateWithTransition(path, element, scale);
      } else {
        setActiveLogo(elementId);
      }
    } else {
      navigateWithTransition(path, element, scale);
    }
  };

  // Handlers for desktop hover
  const handleMouseEnter = (logoName) => {
    if (!isTouchDevice) {
      setHoveredLogo(logoName);
    }
  };

  const handleMouseLeave = () => {
    if (!isTouchDevice) {
      setHoveredLogo(null);
    }
  };

  // Author login functions
  // ... existing Home.js code ...

  const handleLogin = async () => {
    if (!loginData.username || !loginData.password) {
      setLoginError('Please enter both username and password');
      return;
    }

    setLoginLoading(true);
    setLoginError('');

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const formData = new FormData();
      formData.append('username', loginData.username);
      formData.append('password', loginData.password);

      const response = await axios.post(`${backendUrl}/api/auth/token`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      localStorage.setItem('token', response.data.access_token);
      setIsLoggedIn(true);
      setShowLogin(false);
      setLoginData({ username: '', password: '' });

      // Success notification and redirect to author dashboard
      showNotification('Login successful! Redirecting to dashboard...', 'success');
      
      // Redirect to author dashboard
      setTimeout(() => {
        navigate('/author');
      }, 1000);
    } catch (error) {
      setLoginError(error.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

// ... existing Home.js code ...

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setLoginData({ username: '', password: '' });
    showNotification('Logged out successfully', 'info');
  };

  const showNotification = (message, type) => {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 20px',
      borderRadius: '8px',
      color: 'white',
      fontWeight: '500',
      zIndex: '15000',
      transform: 'translateX(400px)',
      transition: 'transform 0.3s ease',
      background: type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'
    });

    document.body.appendChild(notification);
    
    requestAnimationFrame(() => {
      notification.style.transform = 'translateX(0)';
    });

    setTimeout(() => {
      notification.style.transform = 'translateX(400px)';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  // The text to display is either from hover (desktop) or active tap (mobile)
  const displayName = hoveredLogo || activeLogo;

  return (
    <div className="home-container" onClick={() => { if (activeLogo) setActiveLogo(null); }}>
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

      {displayName && (
        <div className="logo-name-display">
          <div className="clipboard">
            <h1 className="typewriter">{displayName}</h1>
          </div>
        </div>
      )}

      {/* Author Login/Logout - Only shown after video ends */}
      {isVideoEnded && (
        <div className="author-login-container">
          {isLoggedIn ? (
            <div className="author-profile">
              <div className="profile-avatar">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <button className="author-login-btn" onClick={() => setShowLogin(true)}>
              <div className="login-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <span>Author</span>
            </button>
          )}
        </div>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isMenuOpen ? 'open' : ''} ${isVideoEnded ? 'visible' : ''}`}>
        <ul>
          <div className="hover-capsule"></div>
          <li className={activeMenuItem === 'Home' ? 'active' : ''} onClick={() => setActiveMenuItem('Home')}>
            <Link to="/">Home</Link>
          </li>
          <li className={activeMenuItem === 'About Us' ? 'active' : ''} onClick={() => setActiveMenuItem('About Us')}>
            <Link to="/about">About Us</Link>
          </li>
          <li className={activeMenuItem === 'Services' ? 'active' : ''} onClick={() => setActiveMenuItem('Services')}>
            <Link to="/services">Services</Link>
          </li>
          <li className={activeMenuItem === 'Contact Us' ? 'active' : ''} onClick={() => setActiveMenuItem('Contact Us')}>
            <Link to="/contact">Contact Us</Link>
          </li>
        </ul>
      </div>

      <div className="logo_container">
        <div className={`logo_wrapper ${isVideoEnded ? 'animate-resize-mobile animate-resize-tablet' : ''}`}>
          <div className={`logo ${startLogoAnimation ? 'animate-logos' : ''}`}>
            <div id="Shree" className={activeLogo === 'Shree' ? 'active-glow' : ''} onClick={(e) => { e.stopPropagation(); handleLogoInteraction('Shree', '/Shree', 400); }}
                 onMouseEnter={() => handleMouseEnter('Shree')} onMouseLeave={handleMouseLeave}>
              <img src="/Shree.png" alt="Shree" />
            </div>
            <div id="Music" className={activeLogo === 'Music' ? 'active-glow' : ''} onClick={(e) => { e.stopPropagation(); handleLogoInteraction('Music', '/Music', 300); }}
                 onMouseEnter={() => handleMouseEnter('Music')} onMouseLeave={handleMouseLeave}>
              <img src="/Music.png" alt="Music" />
            </div>
            <div id="Eye" className={activeLogo === 'Eye' ? 'active-glow' : ''} onClick={(e) => { e.stopPropagation(); handleLogoInteraction('Eye', '/Eye', 200); }}
                 onMouseEnter={() => handleMouseEnter('Eye')} onMouseLeave={handleMouseLeave}>
              <img src="/Eye.png" alt="Eye" />
            </div>
            <div id="Dhantha" className={activeLogo === 'Dhantha' ? 'active-glow' : ''} onClick={(e) => { e.stopPropagation(); handleLogoInteraction('Dhantha', '/Dhantha', 400); }}
                 onMouseEnter={() => handleMouseEnter('Dhantha')} onMouseLeave={handleMouseLeave}>
              <img src="/Dhantha.png" alt="Dhantha" />
            </div>
            <div id="Kalaagruha" className={activeLogo === 'Kalaagruha' ? 'active-glow' : ''} onClick={(e) => { e.stopPropagation(); handleLogoInteraction('Kalaagruha', '/Kalaagruha', 2500); }}
                 onMouseEnter={() => handleMouseEnter('Kalaagruha')} onMouseLeave={handleMouseLeave}>
              <img src="/Kalaagruha.png" alt="Kalaagruha" />
            </div>
            <div id="Kaara" className={activeLogo === 'Kaara' ? 'active-glow' : ''} onClick={(e) => e.stopPropagation()}
                 onMouseEnter={() => handleMouseEnter('Kaara')} onMouseLeave={handleMouseLeave}>
              <img src="/Kaara.png" alt="Kaara" />
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="login-overlay" onClick={() => setShowLogin(false)}>
          <div className="login-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowLogin(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
            
            <h2>Author Login</h2>
            <p className="login-subtitle">Enter your credentials to manage content</p>
            
            {loginError && <div className="error-message">{loginError}</div>}
            
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Author Username"
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  required
                  disabled={loginLoading}
                />
              </div>
              
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                  disabled={loginLoading}
                />
              </div>
              
              <button type="submit" className="submit-btn" disabled={loginLoading}>
                {loginLoading ? 'Logging in...' : 'Login as Author'}
              </button>
            </form>
          
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;