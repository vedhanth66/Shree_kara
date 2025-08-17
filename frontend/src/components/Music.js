import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Music.css';

const Music = () => {
  const navigate = useNavigate();
  const [music, setMusic] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const response = await axios.get(`${backendUrl}/api/music/music`);
      setMusic(response.data);
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

        {/* Music Content */}
        <div className="music-grid">
          {music.length > 0 ? (
            music.map((track) => (
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
            ))
          ) : (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" opacity="0.3">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
              <h3>No Music Yet</h3>
              <p>Musical compositions will appear here when uploaded!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Music;