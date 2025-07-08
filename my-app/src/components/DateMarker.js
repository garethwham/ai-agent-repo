import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DateMarker.css';

function DateMarker() {
  const [markers, setMarkers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newMarker, setNewMarker] = useState({
    name: '',
    markerDate: new Date().toISOString().split('T')[0]
  });
  const userId = 'default-user'; // In a real app, this would come from authentication

  useEffect(() => {
    fetchMarkers();
  }, []);

  const fetchMarkers = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/date-markers/${userId}`);
      setMarkers(response.data);
    } catch (error) {
      console.error('Error fetching date markers:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMarker(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/date-markers', {
        ...newMarker,
        userId
      });
      setShowForm(false);
      setNewMarker({
        name: '',
        markerDate: new Date().toISOString().split('T')[0]
      });
      fetchMarkers();
    } catch (error) {
      console.error('Error creating date marker:', error);
    }
  };

  const handleDelete = async (markerId) => {
    try {
      await axios.delete(`http://localhost:3001/api/date-markers/${markerId}`);
      fetchMarkers();
    } catch (error) {
      console.error('Error deleting date marker:', error);
    }
  };

  return (
    <div className="date-marker-container">
      <div className="date-marker-header">
        <h3>Timeline Markers</h3>
        <button
          className="add-marker-btn"
          onClick={() => setShowForm(true)}
        >
          Add Marker
        </button>
      </div>

      {showForm && (
        <div className="date-marker-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Marker Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newMarker.name}
                onChange={handleInputChange}
                placeholder="e.g. Beta Launch"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="markerDate">Date:</label>
              <input
                type="date"
                id="markerDate"
                name="markerDate"
                value={newMarker.markerDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit">Save</button>
              <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="markers-list">
        {markers.map(marker => (
          <div key={marker.id} className="marker-item">
            <div className="marker-info">
              <span className="marker-name">{marker.name}</span>
              <span className="marker-date">
                {new Date(marker.marker_date).toLocaleDateString()}
              </span>
            </div>
            <button
              className="delete-marker-btn"
              onClick={() => handleDelete(marker.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DateMarker;