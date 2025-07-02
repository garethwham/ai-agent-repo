import React from 'react';
import './TimelineView.css';

function TimelineView({ tasks }) {
  return (
    <div className="timeline-view">
      {tasks.map(task => (
        <div key={task.id} className="timeline-item">
          <div className="timeline-content">
            <h3>{task.title}</h3>
            <p>Created: {new Date(task.createdDate).toLocaleDateString()}</p>
            <p>Ship Date: {new Date(task.shipDate).toLocaleDateString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TimelineView;