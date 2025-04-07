import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import TaskList from './components/TaskList';

function App() {
  const [viewMode, setViewMode] = useState('kanban');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = 'default-user'; // In a real app, this would come from authentication

  useEffect(() => {
    const fetchUserPreferences = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3001/api/preferences/${userId}`);
        setViewMode(response.data.view_mode);
        setError(null);
      } catch (err) {
        setError('Failed to load user preferences');
        console.error('Error loading user preferences:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPreferences();
  }, [userId]);

  const toggleView = async () => {
    const newViewMode = viewMode === 'kanban' ? 'list' : 'kanban';
    try {
      await axios.put(`http://localhost:3001/api/preferences/${userId}`, {
        viewMode: newViewMode
      });
      setViewMode(newViewMode);
      setError(null);
    } catch (err) {
      setError('Failed to update view mode');
      console.error('Error updating view mode:', err);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Team '25 todo list</h1>
        <button 
          className="view-toggle-btn"
          onClick={toggleView}
        >
          {viewMode === 'kanban' ? 'Switch to List View' : 'Switch to Kanban View'}
        </button>
      </header>
      <main>
        <TaskList viewMode={viewMode} />
      </main>
    </div>
  );
}

export default App;