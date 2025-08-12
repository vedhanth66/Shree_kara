import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import './PageLayout.css';

const PageLayout = ({ children, title }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  useEffect(() => {
    const capsule = document.querySelector('.hover-capsule');
    const items = document.querySelectorAll('.sidebar ul li');

    if (!capsule || items.length === 0) return;

    const moveCapsule = (el) => {
      if (!el) return;
      capsule.style.top = `${el.offsetTop}px`;
      capsule.style.height = `${el.offsetHeight}px`;
      capsule.style.opacity = '1';
    };

    // Find active item based on current location
    const activeItem = Array.from(items).find(li =>
      li.querySelector(`a[href="${location.pathname}"]`)
    );

    // Set initial position to active
    moveCapsule(activeItem);

    // Hover listeners
    items.forEach(item => {
      item.addEventListener('mouseenter', () => moveCapsule(item));
      item.addEventListener('mouseleave', () => moveCapsule(activeItem));
    });

    return () => {
      items.forEach(item => {
        item.replaceWith(item.cloneNode(true)); // quick remove listeners
      });
    };
  }, [location.pathname]);

  const navigateWithTransition = (targetPath, originElement, scaleValue) => {
    const img = originElement.querySelector('img');
    if (!img) return;

    if (isSidebarOpen) setIsSidebarOpen(false);

    const rect = img.getBoundingClientRect();
    const overlay = document.createElement('div');
    overlay.className = 'transition-overlay';
    document.body.appendChild(overlay);

    const clone = img.cloneNode(true);
    clone.className = 'transition-image';
    Object.assign(clone.style, {
      position: 'fixed',
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
    });
    document.body.appendChild(clone);

    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      clone.style.top = '50%';
      clone.style.left = '50%';
      clone.style.transform = `translate(-50%, -50%) scale(${scaleValue}) rotateY(360deg)`;
      clone.style.filter = 'drop-shadow(0 0 100px #FFD800) brightness(2)';
    });

    setTimeout(() => {
      navigate(targetPath);
      setTimeout(() => {
        overlay.remove();
        clone.remove();
      }, 200);
    }, 1200);
  };

  return (
    <div className="layout-container">
      <div
        className={`hamburger-menu ${isSidebarOpen ? 'active' : ''}`}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div
        className={`mobile-menu-overlay ${isSidebarOpen ? 'open' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="hover-capsule"></div>
        <ul>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/eye">About Us</NavLink>
          </li>
          <li>
            <NavLink to="/dhantha">Services</NavLink>
          </li>
          <li>
            <NavLink to="/shree">Our Work</NavLink>
          </li>
        </ul>
      </div>

      <main>
        {title && (
          <div className="page-header">
            <button className="back-button" onClick={() => navigate('/')}>
              <i className="fas fa-arrow-left"></i> Back to Home
            </button>
            <h1 className="page-title">{title}</h1>
          </div>
        )}
        {React.cloneElement(children, { navigateWithTransition })}
      </main>
    </div>
  );
};

export default PageLayout;
