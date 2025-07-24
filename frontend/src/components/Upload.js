import React, { useState } from 'react';
import axios from 'axios';
import './Upload.css';

const Upload = ({ onClose }) => {
  const [uploadType, setUploadType] = useState('image');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    author: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      
      if (uploadType === 'image') {
        if (!selectedFile) {
          setError('Please select an image');
          return;
        }

        const uploadData = {
          title: formData.title,
          description: formData.description,
          image_data: preview // base64 string
        };

        await axios.post('/api/upload/image', uploadData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setSuccess('Image uploaded successfully!');
      } else {
        const uploadData = {
          title: formData.title,
          content: formData.content,
          author: formData.author
        };

        await axios.post('/api/upload/poem', uploadData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setSuccess('Poem uploaded successfully!');
      }

      // Reset form
      setFormData({ title: '', description: '', content: '', author: '' });
      setSelectedFile(null);
      setPreview(null);
      
      // Close after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error) {
      setError(error.response?.data?.detail || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-overlay">
      <div className="upload-modal">
        <button className="close-btn" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        
        <h2>Upload Content</h2>
        
        <div className="upload-tabs">
          <button 
            className={uploadType === 'image' ? 'active' : ''}
            onClick={() => setUploadType('image')}
          >
            <i className="fas fa-image"></i> Image
          </button>
          <button 
            className={uploadType === 'poem' ? 'active' : ''}
            onClick={() => setUploadType('poem')}
          >
            <i className="fas fa-pen"></i> Poem
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          
          {uploadType === 'image' ? (
            <>
              <div className="form-group">
                <textarea
                  name="description"
                  placeholder="Description (optional)"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
              
              <div className="form-group">
                <div className="file-upload-area">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    id="file-input"
                    hidden
                  />
                  <label htmlFor="file-input" className="file-upload-label">
                    <i className="fas fa-cloud-upload-alt"></i>
                    {selectedFile ? selectedFile.name : 'Choose Image'}
                  </label>
                </div>
                
                {preview && (
                  <div className="image-preview">
                    <img src={preview} alt="Preview" />
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <input
                  type="text"
                  name="author"
                  placeholder="Author"
                  value={formData.author}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <textarea
                  name="content"
                  placeholder="Write your poem here..."
                  value={formData.content}
                  onChange={handleInputChange}
                  rows="10"
                  required
                />
              </div>
            </>
          )}
          
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;