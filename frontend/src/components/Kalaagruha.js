import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Kalaagruha.css';

const Kalaagruha = () => {
  const navigate = useNavigate();
  const [poems, setPoems] = useState([]);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [music, setMusic] = useState([]);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const [poemsRes, imagesRes, videosRes, musicRes] = await Promise.all([
        axios.get(`${backendUrl}/api/poems/kalaagruha`),
        axios.get(`${backendUrl}/api/images/kalaagruha`),
        axios.get(`${backendUrl}/api/videos/kalaagruha`),
        axios.get(`${backendUrl}/api/music/kalaagruha`)
      ]);
      
      setPoems(poemsRes.data);
      setImages(imagesRes.data);
      setVideos(videosRes.data);
      setMusic(musicRes.data);
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  const goBack = () => {
    navigate('/');
  };

  return (
    <div className="kalaagruha-container">
      <button className="back-btn" onClick={goBack}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
        Back to Home
      </button>

      <div className="content-wrapper">
        <div className="header-section">
          <h1 className="main-title">Kalaagruha</h1>
          <p className="subtitle">Creative Content Gallery</p>
        </div>

        {/* Content Display */}
        <div className="content-grid">
          {/* Poems Section */}
          {poems.length > 0 && (
            <div className="content-section">
              <h2 className="section-title">Poems</h2>
              <div className="items-grid">
                {poems.map((poem) => (
                  <div key={poem._id} className="content-card poem-card">
                    <h3 className="item-title">{poem.title}</h3>
                    <div className="poem-content">{poem.content}</div>
                    <p className="poem-author">— {poem.author}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Images Section */}
          {images.length > 0 && (
            <div className="content-section">
              <h2 className="section-title">Images</h2>
              <div className="items-grid">
                {images.map((image) => (
                  <div key={image._id} className="content-card image-card">
                    <h3 className="item-title">{image.title}</h3>
                    <div className="image-container">
                      <img 
                        src={`data:image/jpeg;base64,${image.image_data}`} 
                        alt={image.title} 
                        className="content-image"
                      />
                    </div>
                    {image.description && (
                      <p className="item-description">{image.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Videos Section */}
          {videos.length > 0 && (
            <div className="content-section">
              <h2 className="section-title">Videos</h2>
              <div className="items-grid">
                {videos.map((video) => (
                  <div key={video._id} className="content-card video-card">
                    <h3 className="item-title">{video.title}</h3>
                    <div className="video-container">
                      <video 
                        controls 
                        className="content-video"
                        src={`data:video/mp4;base64,${video.video_data}`} 
                      />
                    </div>
                    {video.description && (
                      <p className="item-description">{video.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Music Section */}
          {music.length > 0 && (
            <div className="content-section">
              <h2 className="section-title">Music</h2>
              <div className="items-grid">
                {music.map((track) => (
                  <div key={track._id} className="content-card music-card">
                    <h3 className="item-title">{track.title}</h3>
                    {track.artist && (
                      <p className="track-artist">by {track.artist}</p>
                    )}
                    <div className="music-container">
                      <audio 
                        controls 
                        className="content-audio"
                        src={`data:audio/mpeg;base64,${track.music_data}`} 
                      />
                    </div>
                    {track.description && (
                      <p className="item-description">{track.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {poems.length === 0 && images.length === 0 && videos.length === 0 && music.length === 0 && (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" opacity="0.3">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <h3>No Content Yet</h3>
              <p>Be the first to share your creative work!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Kalaagruha;