import React, { useState, useEffect } from 'react';
import './App.css';
import TaskList from './components/TaskList';

function App() {
  const [viewMode, setViewMode] = useState(() => {
    // Get saved view mode from localStorage or default to 'kanban'
    return localStorage.getItem('viewMode') || 'kanban';
  });

  useEffect(() => {
    // Save view mode to localStorage whenever it changes
    localStorage.setItem('viewMode', viewMode);
  }, [viewMode]);

  const toggleView = () => {
    setViewMode(prevMode => prevMode === 'kanban' ? 'list' : 'kanban');
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