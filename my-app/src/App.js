import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import TaskList from './components/TaskList';
import Settings from './components/Settings';

function App() {
  const [viewMode, setViewMode] = useState('kanban');
  const [darkMode, setDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = 'default-user'; // In a real app, this would come from authentication

  useEffect(() => {
    const fetchUserPreferences = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3001/api/preferences/${userId}`);
        setViewMode(response.data.view_mode);
        setDarkMode(response.data.theme === 'dark');
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
        viewMode: newViewMode,
        theme: darkMode ? 'dark' : 'light'
      });
      setViewMode(newViewMode);
      setError(null);
    } catch (err) {
      setError('Failed to update view mode');
      console.error('Error updating view mode:', err);
    }
  };

  const toggleDarkMode = async () => {
    const newDarkMode = !darkMode;
    try {
      await axios.put(`http://localhost:3001/api/preferences/${userId}`, {
        viewMode,
        theme: newDarkMode ? 'dark' : 'light'
      });
      setDarkMode(newDarkMode);
      setError(null);
    } catch (err) {
      setError('Failed to update theme');
      console.error('Error updating theme:', err);
    }
  };

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Team '25 todo list</h1>
        <div className="header-actions">
          <button
            className="view-toggle-btn"
            onClick={toggleView}
          >
            {viewMode === 'kanban' ? 'Switch to List View' : 'Switch to Kanban View'}
          </button>
          <button
            className="view-toggle-btn"
            onClick={() => setShowSettings(true)}
          >
            Settings
          </button>
        </div>
      </header>
      <main>
        <TaskList viewMode={viewMode} />
      </main>
      {showSettings && (
        <Settings
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

export default App;