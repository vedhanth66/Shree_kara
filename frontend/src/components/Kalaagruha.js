import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Kalaagruha = () => {
  const navigate = useNavigate();
  const [poems, setPoems] = useState([]);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [uploadType, setUploadType] = useState('poem');
  const [uploadData, setUploadData] = useState({
    title: '',
    content: '',
    author: '',
    description: '',
    file: null
  });

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

  const handleLogin = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const formData = new FormData();
      formData.append('username', loginData.username);
      formData.append('password', loginData.password);

      const response = await axios.post(`${backendUrl}/api/auth/token`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      localStorage.setItem('token', response.data.access_token);
      setIsLoggedIn(true);
      setShowLogin(false);
      alert('Login successful!');
    } catch (error) {
      alert('Login failed: ' + (error.response?.data?.detail || 'Unknown error'));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = error => reject(error);
    });
  };

  const handleUpload = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const token = localStorage.getItem('token');
      
      let uploadPayload = {};
      let endpoint = '';

      if (uploadType === 'poem') {
        uploadPayload = {
          title: uploadData.title,
          content: uploadData.content,
          author: uploadData.author
        };
        endpoint = '/api/upload/poem';
      } else if (uploadType === 'image') {
        if (!uploadData.file) {
          alert('Please select an image file');
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
        if (!uploadData.file) {
          alert('Please select a video file');
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

      alert('Content uploaded successfully!');
      setUploadData({ title: '', content: '', author: '', description: '', file: null });
      fetchContent();
    } catch (error) {
      alert('Upload failed: ' + (error.response?.data?.detail || 'Unknown error'));
    }
  };

  const goBack = () => {
    navigate('/');
  };

  return (
    <div style={{
      backgroundColor: 'rgb(205, 204, 204)',
      minHeight: '100vh',
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

      {/* Author Login/Logout */}
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            style={{
              background: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => setShowLogin(true)}
            style={{
              background: '#007bff',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Author Login
          </button>
        )}
      </div>

      <div style={{ textAlign: 'center', paddingTop: '80px' }}>
        <h1 style={{ fontSize: '4rem', color: '#333', marginBottom: '2rem' }}>
          Kalaagruha - Content Hub
        </h1>

        {/* Author Upload Form */}
        {isLoggedIn && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '15px',
            padding: '2rem',
            maxWidth: '600px',
            margin: '0 auto 3rem',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ color: '#333', marginBottom: '1rem' }}>Upload Content</h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label>Content Type: </label>
              <select 
                value={uploadType} 
                onChange={(e) => setUploadType(e.target.value)}
                style={{ padding: '8px', marginLeft: '10px', borderRadius: '5px' }}
              >
                <option value="poem">Poem</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>

            <input
              type="text"
              placeholder="Title"
              value={uploadData.title}
              onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
              style={{ width: '100%', padding: '10px', margin: '5px 0', borderRadius: '5px', border: '1px solid #ccc' }}
            />

            {uploadType === 'poem' && (
              <>
                <input
                  type="text"
                  placeholder="Author"
                  value={uploadData.author}
                  onChange={(e) => setUploadData({...uploadData, author: e.target.value})}
                  style={{ width: '100%', padding: '10px', margin: '5px 0', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <textarea
                  placeholder="Poem content"
                  value={uploadData.content}
                  onChange={(e) => setUploadData({...uploadData, content: e.target.value})}
                  rows="6"
                  style={{ width: '100%', padding: '10px', margin: '5px 0', borderRadius: '5px', border: '1px solid #ccc' }}
                />
              </>
            )}

            {(uploadType === 'image' || uploadType === 'video') && (
              <>
                <input
                  type="text"
                  placeholder="Description"
                  value={uploadData.description}
                  onChange={(e) => setUploadData({...uploadData, description: e.target.value})}
                  style={{ width: '100%', padding: '10px', margin: '5px 0', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <input
                  type="file"
                  accept={uploadType === 'image' ? 'image/*' : 'video/*'}
                  onChange={(e) => setUploadData({...uploadData, file: e.target.files[0]})}
                  style={{ width: '100%', padding: '10px', margin: '5px 0', borderRadius: '5px', border: '1px solid #ccc' }}
                />
              </>
            )}

            <button
              onClick={handleUpload}
              style={{
                background: '#28a745',
                color: 'white',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '16px',
                marginTop: '10px'
              }}
            >
              Upload {uploadType.charAt(0).toUpperCase() + uploadType.slice(1)}
            </button>
          </div>
        )}

        {/* Content Display */}
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* All Content Sections */}
          {poems.length > 0 && (
            <div style={{ marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2rem', color: '#333', marginBottom: '1rem' }}>Poems</h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '2rem'
              }}>
                {poems.map((poem) => (
                  <div key={poem._id} style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '10px',
                    padding: '2rem',
                    textAlign: 'left'
                  }}>
                    <h3 style={{ color: '#333' }}>{poem.title}</h3>
                    <div style={{ whiteSpace: 'pre-wrap', margin: '1rem 0' }}>{poem.content}</div>
                    <p style={{ fontSize: '0.9rem', color: '#666' }}>by {poem.author}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {images.length > 0 && (
            <div style={{ marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2rem', color: '#333', marginBottom: '1rem' }}>Images</h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem'
              }}>
                {images.map((image) => (
                  <div key={image._id} style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '10px',
                    padding: '1rem'
                  }}>
                    <h3 style={{ color: '#333' }}>{image.title}</h3>
                    <img src={`data:image/jpeg;base64,${image.image_data}`} alt={image.title} style={{ width: '100%', borderRadius: '8px' }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {videos.length > 0 && (
            <div style={{ marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2rem', color: '#333', marginBottom: '1rem' }}>Videos</h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '2rem'
              }}>
                {videos.map((video) => (
                  <div key={video._id} style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '10px',
                    padding: '1rem'
                  }}>
                    <h3 style={{ color: '#333' }}>{video.title}</h3>
                    <video controls style={{ width: '100%', borderRadius: '8px' }} src={`data:video/mp4;base64,${video.video_data}`} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '15px',
            width: '300px'
          }}>
            <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Author Login</h3>
            <input
              type="text"
              placeholder="Username"
              value={loginData.username}
              onChange={(e) => setLoginData({...loginData, username: e.target.value})}
              style={{ width: '100%', padding: '10px', margin: '5px 0', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <input
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              style={{ width: '100%', padding: '10px', margin: '5px 0', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
              <button
                onClick={handleLogin}
                style={{
                  flex: 1,
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Login
              </button>
              <button
                onClick={() => setShowLogin(false)}
                style={{
                  flex: 1,
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Kalaagruha;