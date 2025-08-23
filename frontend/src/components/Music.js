import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Music.css';

const Music = () => {
  const navigate = useNavigate();
  const [music, setMusic] = useState([]);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [poems, setPoems] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const [musicRes, imagesRes, videosRes, poemsRes] = await Promise.all([
        axios.get(`${backendUrl}/api/music/music`),
        axios.get(`${backendUrl}/api/images/music`),
        axios.get(`${backendUrl}/api/videos/music`),
        axios.get(`${backendUrl}/api/poems/music`)
      ]);
      setMusic(musicRes.data);
      setImages(imagesRes.data);
      setVideos(videosRes.data);
      setPoems(poemsRes.data);
    } catch (error) {
      console.error('Error fetching music:', error);
    }
  };

  const goBack = () => {
    navigate('/');
  };

  const handlePlayPause = (audioElement, musicId) => {
    if (currentlyPlaying && currentlyPlaying !== musicId) {
      // Pause the currently playing track
      const currentAudio = document.getElementById(`audio-${currentlyPlaying}`);
      if (currentAudio) {
        currentAudio.pause();
      }
    }

    if (audioElement.paused) {
      audioElement.play();
      setCurrentlyPlaying(musicId);
    } else {
      audioElement.pause();
      setCurrentlyPlaying(null);
    }
  };

  return (
    <div className="music-container">
      <button className="back-btn" onClick={goBack}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
        Back to Home
      </button>

      <div className="content-wrapper">
        <div className="header-section">
          <h1 className="main-title">Music</h1>
          <p className="subtitle">Musical Compositions & Soundscapes</p>
        </div>

        <div className="music-content">
          {/* Poems Section */}
          {poems.length > 0 && (
            <div style={{ marginBottom: '3rem', width: '100%' }}>
              <h2 style={{ fontSize: '2rem', color: '#FFD700', marginBottom: '2rem', textAlign: 'center' }}>Musical Poetry</h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '2rem'
              }}>
                {poems.map((poem) => (
                  <div key={poem._id} style={{
                    background: 'linear-gradient(145deg, rgba(0, 0, 0, 0.3), rgba(26, 26, 26, 0.2))',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(255, 215, 0, 0.2)',
                    borderRadius: '15px',
                    padding: '2rem',
                    color: '#a7a7a7b3'
                  }}>
                    <h3 style={{ color: '#FFD700', marginBottom: '1rem' }}>{poem.title}</h3>
                    <p style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '1rem' }}>by {poem.author}</p>
                    <div style={{
                      whiteSpace: 'pre-wrap',
                      lineHeight: '1.6',
                      color: '#fff',
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

          {/* Images Section */}
          {images.length > 0 && (
            <div style={{ marginBottom: '3rem', width: '100%' }}>
              <h2 style={{ fontSize: '2rem', color: '#FFD700', marginBottom: '2rem', textAlign: 'center' }}>Visual Music</h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem'
              }}>
                {images.map((image) => (
                  <div key={image._id} style={{
                    background: 'linear-gradient(145deg, rgba(0, 0, 0, 0.3), rgba(26, 26, 26, 0.2))',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(255, 215, 0, 0.2)',
                    borderRadius: '15px',
                    padding: '1rem',
                    color: '#a7a7a7b3'
                  }}>
                    <h3 style={{ color: '#FFD700', marginBottom: '1rem' }}>{image.title}</h3>
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

          {/* Videos Section */}
          {videos.length > 0 && (
            <div style={{ marginBottom: '3rem', width: '100%' }}>
              <h2 style={{ fontSize: '2rem', color: '#FFD700', marginBottom: '2rem', textAlign: 'center' }}>Music Videos</h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '2rem'
              }}>
                {videos.map((video) => (
                  <div key={video._id} style={{
                    background: 'linear-gradient(145deg, rgba(0, 0, 0, 0.3), rgba(26, 26, 26, 0.2))',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(255, 215, 0, 0.2)',
                    borderRadius: '15px',
                    padding: '1rem',
                    color: '#a7a7a7b3'
                  }}>
                    <h3 style={{ color: '#FFD700', marginBottom: '1rem' }}>{video.title}</h3>
                    {video.description && (
                      <p style={{ color: '#ccc', marginBottom: '1rem' }}>{video.description}</p>
                    )}
                    <video
                      controls
                      style={{ width: '100%', borderRadius: '10px' }}
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

          {/* Music Tracks Section */}
          <div className="music-grid">
            {music.length > 0 ? (
              <div style={{ marginBottom: '3rem', width: '100%' }}>
                <h2 style={{ fontSize: '2rem', color: '#FFD700', marginBottom: '2rem', textAlign: 'center' }}>Music Tracks</h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                  gap: '2rem'
                }}>
                  {music.map((track) => (
                    <div key={track._id} className="music-card">
                      <div className="music-info">
                        <h3 className="track-title">{track.title}</h3>
                        {track.artist && (
                          <p className="track-artist">by {track.artist}</p>
                        )}
                        {track.description && (
                          <p className="track-description">{track.description}</p>
                        )}
                      </div>

                      <div className="music-player">
                        <audio
                          id={`audio-${track._id}`}
                          src={`data:audio/mpeg;base64,${track.music_data}`}
                          onEnded={() => setCurrentlyPlaying(null)}
                        />
                        <button
                          className="play-btn"
                          onClick={() => handlePlayPause(document.getElementById(`audio-${track._id}`), track._id)}
                        >
                          {currentlyPlaying === track._id ? (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                            </svg>
                          ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          )}
                        </button>
                      </div>

                      <div className="track-metadata">
                        <span>Uploaded by: {track.uploaded_by}</span>
                        <span>{new Date(track.uploaded_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {/* Empty State - only show when ALL content types are empty */}
          {poems.length === 0 && images.length === 0 && videos.length === 0 && music.length === 0 && (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" opacity="0.3">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
              <h3>No Music Content Yet</h3>
              <p>Musical compositions, videos, images and poetry will appear here when uploaded!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Music;