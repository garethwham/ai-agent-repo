import React, { useState } from 'react';

const initialTasks = [
  {
    id: 1,
    title: 'Design UI mockups',
    description: 'Create initial wireframes for the application',
    status: 'To Do'
  },
  {
    id: 2,
    title: 'Implement React components',
    description: 'Build the core components for the task tracking system',
    status: 'In Progress'
  },
  {
    id: 3,
    title: 'Write documentation',
    description: 'Document the component structure and usage',
    status: 'Done'
  }
];

function TaskList() {
  const [tasks, setTasks] = useState(initialTasks);

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const TaskCard = ({ task }) => (
    <div className="task-card">
      <h3>{task.title}</h3>
      <p>{task.description}</p>
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