import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Author.css';

const Author = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [uploadType, setUploadType] = useState('poem');
  const [targetSection, setTargetSection] = useState('kalaagruha');
  const [uploadData, setUploadData] = useState({
    title: '',
    content: '',
    author: '',
    artist: '',
    description: '',
    file: null
  });
  const [uploadLoading, setUploadLoading] = useState(false);
  const [stats, setStats] = useState({
    poems: 0,
    images: 0,
    videos: 0,
    music: 0
  });
  const [content, setContent] = useState({
    poems: [],
    images: [],
    videos: [],
    music: []
  });

  useEffect(() => {
    checkAuthStatus();
    if (isLoggedIn) {
      fetchContent();
    }
  }, [isLoggedIn]);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    setIsLoggedIn(true);
  };

  const fetchContent = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const [poemsRes, imagesRes, videosRes, musicRes] = await Promise.all([
        axios.get(`${backendUrl}/api/poems`),
        axios.get(`${backendUrl}/api/images`),
        axios.get(`${backendUrl}/api/videos`),
        axios.get(`${backendUrl}/api/music`)
      ]);
      
      setStats({
        poems: poemsRes.data.length,
        images: imagesRes.data.length,
        videos: videosRes.data.length,
        music: musicRes.data.length
      });
      setContent({
        poems: poemsRes.data,
        images: imagesRes.data,
        videos: videosRes.data,
        music: musicRes.data
      });
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = error => reject(error);
    });
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

  const handleUpload = async () => {
    setUploadLoading(true);

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const token = localStorage.getItem('token');
      
      let uploadPayload = {};
      let endpoint = '';

      if (uploadType === 'poem') {
        if (!uploadData.title || !uploadData.content || !uploadData.author) {
          showNotification('Please fill in all poem fields', 'error');
          setUploadLoading(false);
          return;
        }
        uploadPayload = {
          title: uploadData.title,
          content: uploadData.content,
          author: uploadData.author,
          target: targetSection
        };
        endpoint = '/api/upload/poem';
      } else if (uploadType === 'image') {
        if (!uploadData.file || !uploadData.title) {
          showNotification('Please select an image file and enter a title', 'error');
          setUploadLoading(false);
          return;
        }
        const base64Data = await convertFileToBase64(uploadData.file);
        uploadPayload = {
          title: uploadData.title,
          description: uploadData.description,
          image_data: base64Data,
          target: targetSection
        };
        endpoint = '/api/upload/image';
      } else if (uploadType === 'video') {
        if (!uploadData.file || !uploadData.title) {
          showNotification('Please select a video file and enter a title', 'error');
          setUploadLoading(false);
          return;
        }
        const base64Data = await convertFileToBase64(uploadData.file);
        uploadPayload = {
          title: uploadData.title,
          description: uploadData.description,
          video_data: base64Data,
          target: targetSection
        };
        endpoint = '/api/upload/video';
      } else if (uploadType === 'music') {
        if (!uploadData.file || !uploadData.title) {
          showNotification('Please select a music file and enter a title', 'error');
          setUploadLoading(false);
          return;
        }
        const base64Data = await convertFileToBase64(uploadData.file);
        uploadPayload = {
          title: uploadData.title,
          description: uploadData.description,
          artist: uploadData.artist,
          music_data: base64Data,
          target: targetSection
        };
        endpoint = '/api/upload/music';
      }

      await axios.post(`${backendUrl}${endpoint}`, uploadPayload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      showNotification('Content uploaded successfully!', 'success');
      setUploadData({ title: '', content: '', author: '', artist: '', description: '', file: null });
      fetchContent();
    } catch (error) {
      showNotification('Upload failed: ' + (error.response?.data?.detail || 'Unknown error'), 'error');
    } finally {
      setUploadLoading(false);
    }
  };

  const deleteContent = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const token = localStorage.getItem('token');

      if (!token) {
        showNotification('You are not logged in. Please log in from the home page.', 'error');
        return;
      }

      let endpoint = '';
      if (type === 'poem') endpoint = `/api/delete/poems/${id}`;
      else if (type === 'image') endpoint = `/api/delete/images/${id}`;
      else if (type === 'video') endpoint = `/api/delete/videos/${id}`;
      else if (type === 'music') endpoint = `/api/delete/music/${id}`;

      await axios.delete(`${backendUrl}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      showNotification('Deleted successfully!', 'success');
      fetchContent();  
    } catch (error) {
      showNotification('Deletion failed: ' + (error.response?.data?.detail || 'Unknown error'), 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const goBack = () => {
    navigate('/');
  };

  const getAcceptType = () => {
    switch (uploadType) {
      case 'image': return 'image/*';
      case 'video': return 'video/*';
      case 'music': return 'audio/*';
      default: return '';
    }
  };

  return (
    <div className="author-container">
      <div className="author-header">
        <button className="back-btn" onClick={goBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          Back to Home
        </button>

        <div className="author-title">
          <h1>Author Dashboard</h1>
          <p>Content Management & Upload</p>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5z"/>
          </svg>
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        {/* Stats Section */}
        <div className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
              </div>
              <div className="stat-info">
                <h3>{stats.poems}</h3>
                <p>Poems</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z"/>
                </svg>
              </div>
              <div className="stat-info">
                <h3>{stats.images}</h3>
                <p>Images</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z"/>
                </svg>
              </div>
              <div className="stat-info">
                <h3>{stats.videos}</h3>
                <p>Videos</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              </div>
              <div className="stat-info">
                <h3>{stats.music}</h3>
                <p>Music</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="upload-section">
          <div className="upload-card">
            <h2>Upload New Content</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label>Content Type</label>
                <select 
                  value={uploadType} 
                  onChange={(e) => setUploadType(e.target.value)}
                  className="select-input"
                >
                  <option value="poem">Poem</option>
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="music">Music</option>
                </select>
              </div>

              <div className="form-group">
                <label>Target Section</label>
                <select 
                  value={targetSection} 
                  onChange={(e) => setTargetSection(e.target.value)}
                  className="select-input"
                >
                  <option value="kalaagruha">Kalaagruha (Gallery)</option>
                  <option value="shree">Shree (Poetry)</option>
                  <option value="eye">Eye (Cinematography)</option>
                  <option value="dhantha">Dhantha (Creative Arts)</option>
                  <option value="music">Music</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <input
                type="text"
                placeholder="Title *"
                value={uploadData.title}
                onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
                className="form-input"
                required
              />
            </div>

            {uploadType === 'poem' && (
              <>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Author *"
                    value={uploadData.author}
                    onChange={(e) => setUploadData({...uploadData, author: e.target.value})}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <textarea
                    placeholder="Poem content *"
                    value={uploadData.content}
                    onChange={(e) => setUploadData({...uploadData, content: e.target.value})}
                    rows="6"
                    className="form-textarea"
                    required
                  />
                </div>
              </>
            )}

            {uploadType === 'music' && (
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Artist/Composer"
                  value={uploadData.artist}
                  onChange={(e) => setUploadData({...uploadData, artist: e.target.value})}
                  className="form-input"
                />
              </div>
            )}

            {(uploadType === 'image' || uploadType === 'video' || uploadType === 'music') && (
              <>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Description"
                    value={uploadData.description}
                    onChange={(e) => setUploadData({...uploadData, description: e.target.value})}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="file"
                    accept={getAcceptType()}
                    onChange={(e) => setUploadData({...uploadData, file: e.target.files[0]})}
                    className="file-input"
                    required
                  />
                  {uploadType === 'music' && (
                    <p className="file-info">Supported formats: MP3, WAV, AAC</p>
                  )}
                </div>
              </>
            )}

            <button
              onClick={handleUpload}
              disabled={uploadLoading}
              className="upload-btn"
            >
              {uploadLoading ? 'Uploading...' : `Upload ${uploadType.charAt(0).toUpperCase() + uploadType.slice(1)}`}
            </button>
          </div>
        </div>

        {/* Content Management Section */}
        <div className="content-management-section">
          <h2>Manage Content</h2>
          {/* Poems */}
          {content.poems.length > 0 && (
            <div className="content-list">
              <h3>Poems</h3>
              {content.poems.map(item => (
                <div key={item._id} className="content-item">
                  <span>{item.title}</span>
                  <button onClick={() => deleteContent('poem', item._id)} className="delete-btn">Delete</button>
                </div>
              ))}
            </div>
          )}
          {/* Images */}
          {content.images.length > 0 && (
            <div className="content-list">
              <h3>Images</h3>
              {content.images.map(item => (
                <div key={item._id} className="content-item">
                  <span>{item.title}</span>
                  <button onClick={() => deleteContent('image', item._id)} className="delete-btn">Delete</button>
                </div>
              ))}
            </div>
          )}
          {/* Videos */}
          {content.videos.length > 0 && (
            <div className="content-list">
              <h3>Videos</h3>
              {content.videos.map(item => (
                <div key={item._id} className="content-item">
                  <span>{item.title}</span>
                  <button onClick={() => deleteContent('video', item._id)} className="delete-btn">Delete</button>
                </div>
              ))}
            </div>
          )}
          {/* Music */}
          {content.music.length > 0 && (
            <div className="content-list">
              <h3>Music</h3>
              {content.music.map(item => (
                <div key={item._id} className="content-item">
                  <span>{item.title}</span>
                  <button onClick={() => deleteContent('music', item._id)} className="delete-btn">Delete</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Author;