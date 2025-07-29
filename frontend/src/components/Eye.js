import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Eye = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [poems, setPoems] = useState([]);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const [imagesRes, videosRes, poemsRes] = await Promise.all([
        axios.get(`${backendUrl}/api/images`),
        axios.get(`${backendUrl}/api/videos`),
        axios.get(`${backendUrl}/api/poems`)
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

  return (
    <div style={{
      background: 'linear-gradient(120deg,#fff56ee6 10%, #a2791a 135%)',
      minHeight: '100vh',
      margin: 0,
      fontFamily: 'sans-serif',
      padding: '2rem'
    }}>
      <button
        onClick={goBack}
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '25px',
          cursor: 'pointer',
          zIndex: 1000,
          fontSize: '16px'
        }}
      >
        ← Back to Home
      </button>

      <div style={{ textAlign: 'center', paddingTop: '80px' }}>
        <h1 style={{ fontSize: '4rem', color: '#333', marginBottom: '2rem' }}>
          Eye - Cinematography
        </h1>

        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Videos Section */}
          {videos.length > 0 && (
            <div style={{ marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2rem', color: '#333', marginBottom: '1rem' }}>Videos</h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem'
              }}>
                {videos.map((video) => (
                  <div key={video._id} style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '10px',
                    padding: '1rem',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}>
                    <h3 style={{ color: '#333', marginBottom: '0.5rem' }}>{video.title}</h3>
                    {video.description && (
                      <p style={{ color: '#666', marginBottom: '1rem' }}>{video.description}</p>
                    )}
                    <video
                      controls
                      style={{ width: '100%', borderRadius: '8px' }}
                      src={`data:video/mp4;base64,${video.video_data}`}
                    />
                    <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>
                      Uploaded by: {video.uploaded_by} | {new Date(video.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Images Section */}
          {images.length > 0 && (
            <div style={{ marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2rem', color: '#333', marginBottom: '1rem' }}>Images</h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '2rem'
              }}>
                {images.map((image) => (
                  <div key={image._id} style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '10px',
                    padding: '1rem',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}>
                    <h3 style={{ color: '#333', marginBottom: '0.5rem' }}>{image.title}</h3>
                    {image.description && (
                      <p style={{ color: '#666', marginBottom: '1rem' }}>{image.description}</p>
                    )}
                    <img
                      src={`data:image/jpeg;base64,${image.image_data}`}
                      alt={image.title}
                      style={{ width: '100%', borderRadius: '8px' }}
                    />
                    <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>
                      Uploaded by: {image.uploaded_by} | {new Date(image.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Content Message */}
          {images.length === 0 && videos.length === 0 && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '10px',
              padding: '2rem',
              textAlign: 'center',
              marginTop: '2rem'
            }}>
              <h3 style={{ color: '#333' }}>No content available yet</h3>
              <p style={{ color: '#666' }}>Check back later for cinematography content!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Eye;