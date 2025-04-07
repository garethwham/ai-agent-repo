import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TaskList({ viewMode }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const fetchTasks = async (page = 1, status = null) => {
    try {
      setLoading(true);
      const params = { page, limit: pagination.limit };
      if (status) params.status = status;
      
      const response = await axios.get('http://localhost:3001/api/tasks', { params });
      setTasks(response.data.tasks);
      setPagination(response.data.pagination);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks. Please try again later.');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const handleLabelChange = (taskId, newLabel) => {
    // Check if label already exists in any task
    const labelExists = tasks.some(task => 
      task.id !== taskId && task.label.toLowerCase() === newLabel.toLowerCase()
    );

    if (labelExists) {
      alert('This label already exists. Please use a unique label.');
      return;
    }

    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, label: newLabel } : task
    ));
  };

  const TaskCard = ({ task }) => (
    <div className="task-card">
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <div className="task-label">
        <input
          type="text"
          placeholder="Add label"
          value={task.label}
          onChange={(e) => handleLabelChange(task.id, e.target.value)}
          className="label-input"
        />
      </div>
    </div>
  );

  const TaskColumn = ({ status }) => (
    <div className={`task-column status-${status.toLowerCase().replace(' ', '-')}`}>
      <h2>{status}</h2>
      {getTasksByStatus(status).map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );

  const ListView = () => (
    <div className="task-list-view">
      {tasks.map(task => (
        <div key={task.id} className={`task-card status-${task.status.toLowerCase().replace(' ', '-')}`}>
          <div className="task-status">{task.status}</div>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <div className="task-label">
            <input
              type="text"
              placeholder="Add label"
              value={task.label}
              onChange={(e) => handleLabelChange(task.id, e.target.value)}
              className="label-input"
            />
          </div>
        </div>
      ))}
    </div>
  );

  const Pagination = () => (
    <div className="pagination">
      <button
        onClick={() => fetchTasks(pagination.page - 1)}
        disabled={pagination.page === 1 || loading}
      >
        Previous
      </button>
      <span>Page {pagination.page} of {pagination.totalPages}</span>
      <button
        onClick={() => fetchTasks(pagination.page + 1)}
        disabled={pagination.page === pagination.totalPages || loading}
      >
        Next
      </button>
    </div>
  );

  if (loading && tasks.length === 0) {
    return <div className="loading">Loading tasks...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className={`task-container ${viewMode}`}>
      {viewMode === 'kanban' ? (
        <div className="task-list">
          <TaskColumn status="To Do" />
          <TaskColumn status="In Progress" />
          <TaskColumn status="Done" />
        </div>
      ) : (
        <>
          <ListView />
          <Pagination />
        </>
      )}
    </div>
  );
}

export default TaskList;