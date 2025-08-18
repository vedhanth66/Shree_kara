import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Eye = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [poems, setPoems] = useState([]);
  const [music, setMusic] = useState([]);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const [imagesRes, videosRes, poemsRes, musicRes] = await Promise.all([
        axios.get(`${backendUrl}/api/images/eye`),
        axios.get(`${backendUrl}/api/videos/eye`),
        axios.get(`${backendUrl}/api/poems/eye`),
        axios.get(`${backendUrl}/api/music/eye`),
      ]);
      
      setImages(imagesRes.data);
      setVideos(videosRes.data);
      setPoems(poemsRes.data);
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
          {/* Poems Section */}
          {poems.length > 0 && (
            <div style={{ marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2rem', color: '#333', marginBottom: '1rem' }}>Poetry</h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '2rem'
              }}>
                {poems.map((poem) => (
                  <div key={poem._id} style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '10px',
                    padding: '2rem',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}>
                    <h3 style={{ color: '#333', marginBottom: '0.5rem' }}>{poem.title}</h3>
                    <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>by {poem.author}</p>
                    <div style={{
                      whiteSpace: 'pre-wrap',
                      lineHeight: '1.6',
                      color: '#444',
                      marginBottom: '1rem'
                    }}>
                      {poem.content}
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#888' }}>
                      Uploaded by: {poem.uploaded_by} | {new Date(poem.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

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

          {/* Music Section */}
          {music.length > 0 && (
            <div style={{ marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2rem', color: '#333', marginBottom: '1rem' }}>Music</h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem'
              }}>
                {music.map((track) => (
                  <div key={track._id} style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '10px',
                    padding: '1rem',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}>
                    <h3 style={{ color: '#333', marginBottom: '0.5rem' }}>{track.title}</h3>
                    {track.artist && (
                      <p style={{ color: '#666', marginBottom: '0.5rem' }}>by {track.artist}</p>
                    )}
                    {track.description && (
                      <p style={{ color: '#666', marginBottom: '1rem' }}>{track.description}</p>
                    )}
                    <audio
                      controls
                      style={{ width: '100%', marginBottom: '1rem' }}
                      src={`data:audio/mpeg;base64,${track.music_data}`}
                    />
                    <p style={{ fontSize: '0.8rem', color: '#888' }}>
                      Uploaded by: {track.uploaded_by} | {new Date(track.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Content Message */}
          {images.length === 0 && videos.length === 0 && poems.length === 0 && music.length === 0 && (
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