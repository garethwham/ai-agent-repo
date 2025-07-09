import React from 'react';

function ViewToggle({ viewMode, toggleView }) {
  return (
    <button className="view-toggle-btn" onClick={toggleView}>
      {viewMode === 'kanban' ? 'Switch to List View' : 'Switch to Kanban View'}
    </button>
  );
}

export default ViewToggle;
