import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = ({ userName = "Admin", userRole = "Administrator", onLogout = () => {} }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleSettings = () => {
    navigate('/settings');
    setShowDropdown(false);
  };

  const handleLogout = () => {
    onLogout();
    setShowDropdown(false);
  };

  return (
    <header className="hc-header">
      {/* Left: Hospital Logo/Name */}
      <div className="hc-header-left">
        <h2 className="hospital-name">🏥 HealthCare System</h2>
      </div>

      {/* Right: User Profile & Actions */}
      <div className="hc-header-right">
        {/* Notifications */}
        <button className="hc-notif-btn" aria-label="Notifications" title="Notifications">
          <span className="notif-icon">🔔</span>
          <span className="hc-notif-badge">3</span>
        </button>

        {/* Settings */}
        <button className="hc-settings-btn" aria-label="Settings" title="Settings" onClick={handleSettings}>
          <span className="settings-icon">⚙️</span>
        </button>

        {/* User Profile Dropdown */}
        <div className="hc-user-profile">
          <button 
            className="profile-btn"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="user-avatar">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <span className="user-name">{userName}</span>
              <span className="user-role">{userRole}</span>
            </div>
            <span className="dropdown-arrow">▼</span>
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="dropdown-menu">
              <div className="dropdown-item">
                <span>👤 Profile</span>
              </div>
              <div className="dropdown-item" onClick={handleSettings}>
                <span>⚙️ Settings</span>
              </div>
              <hr className="dropdown-divider" />
              <div className="dropdown-item logout" onClick={handleLogout}>
                <span>🚪 Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;