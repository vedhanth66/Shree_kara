import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Eye.css';

const Eye = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [poems, setPoems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  
  const poemsRef = useRef(null);
  const imagesRef = useRef(null);
  const videosRef = useRef(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const [imagesRes, videosRes, poemsRes] = await Promise.all([
        axios.get(`${backendUrl}/api/images/eye`),
        axios.get(`${backendUrl}/api/videos/eye`),
        axios.get(`${backendUrl}/api/poems/eye`),
      ]);
      
      setImages(imagesRes.data);
      setVideos(videosRes.data);
      setPoems(poemsRes.data);
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  const goBack = () => {
    navigate('/');
  };

  const scrollToSection = (section) => {
    setActiveCategory(section);
    
    const refs = {
      images: imagesRef,
      videos: videosRef
    };
    
    if (refs[section] && refs[section].current) {
      refs[section].current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const categories = [
    { id: 'images', label: 'Images', count: images.length, icon: '📸' },
    { id: 'videos', label: 'Videos', count: videos.length, icon: '🎬' }
  ];

  return (
    <div className="eye-container">
      <button className="back-btn" onClick={goBack}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
        Back to Home
      </button>

      <div className="content-wrapper">
        {/* Header Section */}
        <div className="header-section">
          <div className="title-container">
            <h1 className="main-title">Eye</h1>
            <p className="subtitle">Cinematography & Visual Arts</p>
            <div className="title-underline"></div>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="category-navigation">
          <h3 className="nav-title">Explore Categories</h3>
          <div className="category-buttons">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => scrollToSection(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-label">{category.label}</span>
                <span className="category-count">({category.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div className="content-grid">
          {/* Images Section */}
          {images.length > 0 && (
            <div ref={imagesRef} className="content-section" id="images">
              <h2 className="section-title">
                <span className="section-icon">📸</span>
                Visual Gallery
              </h2>
              <div className="items-grid">
                {images.map((image) => (
                  <div key={image._id} className="content-card image-card">
                    <div className="image-container">
                      <img 
                        src={`data:image/jpeg;base64,${image.image_data}`} 
                        alt={image.title} 
                        className="content-image"
                      />
                      <div className="image-overlay">
                        <h3 className="overlay-title">{image.title}</h3>
                      </div>
                    </div>
                    <div className="card-content">
                      {image.description && (
                        <p className="item-description">{image.description}</p>
                      )}
                      <div className="card-footer">
                        <span className="upload-info">
                          {image.uploaded_by} • {new Date(image.uploaded_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Videos Section */}
          {videos.length > 0 && (
            <div ref={videosRef} className="content-section" id="videos">
              <h2 className="section-title">
                <span className="section-icon">🎬</span>
                Cinematography Reels
              </h2>
              <div className="items-grid">
                {videos.map((video) => (
                  <div key={video._id} className="content-card video-card">
                    <div className="video-container">
                      <video 
                        controls 
                        className="content-video"
                        src={`data:video/mp4;base64,${video.video_data}`} 
                      />
                    </div>
                    <div className="card-content">
                      <h3 className="item-title">{video.title}</h3>
                      {video.description && (
                        <p className="item-description">{video.description}</p>
                      )}
                      <div className="card-footer">
                        <span className="upload-info">
                          {video.uploaded_by} • {new Date(video.uploaded_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {images.length === 0 && videos.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🎬</div>
              <h3>No Content Yet</h3>
              <p>Cinematography content will appear here when uploaded!</p>
            </div>
          )}
        </div>

        {/* Background Effects */}
        <div className="floating-elements">
          {[...Array(10)].map((_, i) => (
            <div 
              key={i} 
              className="floating-element" 
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 20}s`,
                animationDuration: `${Math.random() * 15 + 20}s`
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Eye;