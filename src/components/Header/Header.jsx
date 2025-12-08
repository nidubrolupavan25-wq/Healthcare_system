import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import "./Header.css";

const Header = ({ toggleSidebar }) => {
  const { user } = useContext(UserContext);

  return (
    <header className="hc-header">
      {/* Left: Toggle + Welcome */}
      <div className="hc-header-left">
        <button className="hc-toggle-btn" onClick={toggleSidebar} aria-label="Toggle Sidebar">
          <i className="fas fa-bars"></i>
        </button>
        <h2 className="hc-welcome-text">
          Welcome <span>{user?.name || "Admin"}</span>
        </h2>
      </div>

      {/* Right: Notification + Profile */}
      <div className="hc-header-right">
        {/* Notification */}
        <button className="hc-notif-btn" aria-label="Notifications">
          <i className="fas fa-bell"></i>
          <span className="hc-notif-badge">3</span>
        </button>

        {/* Profile */}
        <div className="hc-user-profile">
          <img
            src={
              user?.image
                ? user.image.startsWith("http")
                  ? user.image
                  : `data:image/jpeg;base64,${user.image}`
                : "https://via.placeholder.com/42"
            }
            alt="User Avatar"
            className="hc-user-avatar"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/42";
            }}
          />
          <div className="hc-user-details">
            <span className="hc-user-name">{user?.name || "Admin"}</span>
            <span className="hc-user-role">{user?.department || "Staff"}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;