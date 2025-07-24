import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Gallery.css';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [poems, setPoems] = useState([]);
  const [activeTab, setActiveTab] = useState('images');
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const [imagesResponse, poemsResponse] = await Promise.all([
        axios.get('/api/images'),
        axios.get('/api/poems')
      ]);
      
      setImages(imagesResponse.data);
      setPoems(poemsResponse.data);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="gallery-loading">
        <div className="loading-spinner"></div>
        <p>Loading gallery...</p>
      </div>
    );
  }

  return (
    <div className="gallery-container">
      <div className="gallery-tabs">
        <button 
          className={activeTab === 'images' ? 'active' : ''}
          onClick={() => setActiveTab('images')}
        >
          <i className="fas fa-images"></i> Images ({images.length})
        </button>
        <button 
          className={activeTab === 'poems' ? 'active' : ''}
          onClick={() => setActiveTab('poems')}
        >
          <i className="fas fa-book"></i> Poems ({poems.length})
        </button>
      </div>

      {activeTab === 'images' && (
        <div className="images-grid">
          {images.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-image"></i>
              <p>No images uploaded yet</p>
            </div>
          ) : (
            images.map((image) => (
              <div 
                key={image._id} 
                className="image-card"
                onClick={() => setSelectedImage(image)}
              >
                <div className="image-wrapper">
                  <img src={image.image_data} alt={image.title} />
                  <div className="image-overlay">
                    <h3>{image.title}</h3>
                    <p>{image.description}</p>
                  </div>
                </div>
                <div className="card-info">
                  <h4>{image.title}</h4>
                  <p className="upload-info">
                    By {image.uploaded_by} • {formatDate(image.uploaded_at)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'poems' && (
        <div className="poems-grid">
          {poems.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-pen"></i>
              <p>No poems uploaded yet</p>
            </div>
          ) : (
            poems.map((poem) => (
              <div key={poem._id} className="poem-card">
                <h3>{poem.title}</h3>
                <p className="poem-author">By {poem.author}</p>
                <div className="poem-content">
                  {poem.content.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
                <p className="upload-info">
                  Uploaded by {poem.uploaded_by} • {formatDate(poem.uploaded_at)}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="close-modal-btn"
              onClick={() => setSelectedImage(null)}
            >
              <i className="fas fa-times"></i>
            </button>
            <img src={selectedImage.image_data} alt={selectedImage.title} />
            <div className="modal-info">
              <h3>{selectedImage.title}</h3>
              {selectedImage.description && <p>{selectedImage.description}</p>}
              <p className="upload-info">
                By {selectedImage.uploaded_by} • {formatDate(selectedImage.uploaded_at)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;