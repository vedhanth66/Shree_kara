import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Kalaagruha.css';

const Kalaagruha = () => {
  const navigate = useNavigate();
  const [poems, setPoems] = useState([]);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [uploadType, setUploadType] = useState('poem');
  const [uploadData, setUploadData] = useState({
    title: '',
    content: '',
    author: '',
    description: '',
    file: null
  });
  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    fetchContent();
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  };

  const fetchContent = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const [poemsRes, imagesRes, videosRes] = await Promise.all([
        axios.get(`${backendUrl}/api/poems`),
        axios.get(`${backendUrl}/api/images`),
        axios.get(`${backendUrl}/api/videos`)
      ]);
      
      setPoems(poemsRes.data);
      setImages(imagesRes.data);
      setVideos(videosRes.data);
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
    if (!isLoggedIn) {
      showNotification('Please login from the home page first', 'error');
      return;
    }

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
          author: uploadData.author
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
          image_data: base64Data
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
          video_data: base64Data
        };
        endpoint = '/api/upload/video';
      }

      await axios.post(`${backendUrl}${endpoint}`, uploadPayload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      showNotification('Content uploaded successfully!', 'success');
      setUploadData({ title: '', content: '', author: '', description: '', file: null });
      fetchContent();
    } catch (error) {
      showNotification('Upload failed: ' + (error.response?.data?.detail || 'Unknown error'), 'error');
    } finally {
      setUploadLoading(false);
    }
  };

  const goBack = () => {
    navigate('/');
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
          {!isLoggedIn && (
            <div className="login-prompt">
              <p>Please <strong>login from the home page</strong> to upload and manage content.</p>
            </div>
          )}
        </div>

        {/* Author Upload Form - Only shown when logged in */}
        {isLoggedIn && (
          <div className="upload-section">
            <div className="upload-card">
              <h3>Upload Content</h3>
              
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
                </select>
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

              {(uploadType === 'image' || uploadType === 'video') && (
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
                      accept={uploadType === 'image' ? 'image/*' : 'video/*'}
                      onChange={(e) => setUploadData({...uploadData, file: e.target.files[0]})}
                      className="file-input"
                      required
                    />
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
        )}

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
                    
                    {isLoggedIn && (
                      <button
                        onClick={() => deleteContent('poem', poem._id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    )}
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

                    {isLoggedIn && (
                      <button
                        onClick={() => deleteContent('image', image._id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
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

                    {isLoggedIn && (
                      <button
                        onClick={() => deleteContent('video', video._id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {poems.length === 0 && images.length === 0 && videos.length === 0 && (
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