import React from 'react';

function Settings({ darkMode, toggleDarkMode, onClose }) {
  return (
    <div className="settings-overlay">
      <div className="settings-modal">
        <h2>Settings</h2>
        <label className="settings-option">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={toggleDarkMode}
          />
          Dark Mode
        </label>
        <button className="view-toggle-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default Settings;
