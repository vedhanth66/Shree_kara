import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Shree = () => {
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
        axios.get(`${backendUrl}/api/poems/shree`),
        axios.get(`${backendUrl}/api/images/shree`),
        axios.get(`${backendUrl}/api/videos/shree`),
        axios.get(`${backendUrl}/api/music/shree`)
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
    <div style={{
      backgroundColor: 'black',
      minHeight: '100vh',
      padding: '2rem',
      color: 'white'
    }}>
      <button
        onClick={goBack}
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          background: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          border: '1px solid rgba(255, 255, 255, 0.3)',
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
        <h1 style={{ fontSize: '5rem', color: 'white', marginBottom: '2rem' }}>
          Shree - Poetry
        </h1>

        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Poems Section */}
          {poems.length > 0 && (
            <div style={{ marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2rem', color: '#FFD800', marginBottom: '2rem' }}>Handwritten Poems</h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '2rem'
              }}>
                {poems.map((poem) => (
                  <div key={poem._id} style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '15px',
                    padding: '2rem',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 216, 0, 0.3)'
                  }}>
                    <h3 style={{ color: '#FFD800', marginBottom: '1rem', fontSize: '1.5rem' }}>
                      {poem.title}
                    </h3>
                    <div style={{
                      whiteSpace: 'pre-wrap',
                      lineHeight: '1.6',
                      fontSize: '1.1rem',
                      color: '#fff',
                      marginBottom: '1rem',
                      textAlign: 'left'
                    }}>
                      {poem.content}
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: '1px solid rgba(255, 216, 0, 0.3)',
                      paddingTop: '1rem',
                      fontSize: '0.9rem',
                      color: '#ccc'
                    }}>
                      <span>by {poem.author}</span>
                      <span>{new Date(poem.uploaded_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Images Section */}
          {images.length > 0 && (
            <div style={{ marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2rem', color: '#FFD800', marginBottom: '2rem' }}>Art Gallery</h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem'
              }}>
                {images.map((image) => (
                  <div key={image._id} style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '15px',
                    padding: '1rem',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 216, 0, 0.3)'
                  }}>
                    <h3 style={{ color: '#FFD800', marginBottom: '1rem' }}>{image.title}</h3>
                    {image.description && (
                      <p style={{ color: '#ccc', marginBottom: '1rem' }}>{image.description}</p>
                    )}
                    <img
                      src={`data:image/jpeg;base64,${image.image_data}`}
                      alt={image.title}
                      style={{ width: '100%', borderRadius: '10px', marginBottom: '1rem' }}
                    />
                    <p style={{ fontSize: '0.8rem', color: '#888' }}>
                      Uploaded by: {image.uploaded_by} | {new Date(image.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Content Message */}
          {poems.length === 0 && images.length === 0 && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '15px',
              padding: '3rem',
              textAlign: 'center',
              marginTop: '2rem',
              border: '1px solid rgba(255, 216, 0, 0.3)'
            }}>
              <h3 style={{ color: '#FFD800', marginBottom: '1rem' }}>No poetry available yet</h3>
              <p style={{ color: '#ccc' }}>Check back later for beautiful handwritten poems and art!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shree;