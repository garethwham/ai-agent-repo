import React, { useState } from 'react';

const initialTasks = [
  {
    id: 1,
    title: 'Design UI mockups',
    description: 'Create initial wireframes for the application',
    status: 'To Do',
    label: ''
  },
  {
    id: 2,
    title: 'Implement React components',
    description: 'Build the core components for the task tracking system',
    status: 'In Progress',
    label: ''
  },
  {
    id: 3,
    title: 'Write documentation',
    description: 'Document the component structure and usage',
    status: 'Done',
    label: ''
  }
];

function TaskList() {
  const [tasks, setTasks] = useState(initialTasks);

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

  return (
    <div className="task-list">
      <TaskColumn status="To Do" />
      <TaskColumn status="In Progress" />
      <TaskColumn status="Done" />
    </div>
  );
}

export default TaskList;