import React from 'react';
import './App.css';
import TaskList from './components/TaskList';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Team '25 todo list</h1>
      </header>
      <main>
        <TaskList />
      </main>
    </div>
  );
}

export default App;