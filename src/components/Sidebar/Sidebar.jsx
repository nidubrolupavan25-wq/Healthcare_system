// src/components/Sidebar/Sidebar.jsx
import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { UserContext } from "../../context/UserContext";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, setUser } = useContext(UserContext) || {};
  const location = useLocation();
  const navigate = useNavigate();

  // Close sidebar after clicking a link (only on mobile)
  const handleLinkClick = () => {
    if (window.innerWidth <= 768) toggleSidebar();
  };

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("user");
    sessionStorage.clear();
    setUser(null);
    navigate("/", { replace: true });
  };

  const isActive = (p) => (location.pathname === p ? "active" : "");

  if (location.pathname === "/") return null;

  return (
    <aside className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
      {/* Close button – visible only on mobile when open */}
      {window.innerWidth <= 768 && isOpen && (
        <button className="close-btn" onClick={toggleSidebar} aria-label="Close menu">
          ×
        </button>
      )}

      {/* ---- CENTERED PROFILE ---- */}
      <div className="profile">
        <div className="profile-center">
          {user?.image ? (
            <img
              src={
                user.image.startsWith("http")
                  ? user.image
                  : `data:image/jpeg;base64,${user.image}`
              }
              alt="Avatar"
              className="avatar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-avatar.png";
              }}
            />
          ) : (
            <img
              src="/default-avatar.png"
              alt="Default Avatar"
              className="avatar"
            />
          )}
          <div className="info">
            <strong>{user?.name || "User Name"}</strong>
            <small>{user?.department || "Department"}</small>
          </div>
        </div>
      </div>

      {/* ---- NAVIGATION ---- */}
      <nav className="nav">
  {[
    { to: "/dashboard", icon: "th-large", label: "Dashboard" },
    { to: "/medicaldashboard", icon: "clinic-medical", label: "medicaldashboard" }, // ⭐ Added here
    { to: "/doctors", icon: "user-md", label: "Doctors" },
    { to: "/patients", icon: "users", label: "Patients" },
    { to: "/appointments", icon: "calendar-alt", label: "Appointments" },
    { to: "/medicines", icon: "pills", label: "Medicines" },
    { to: "/staffmanagement", icon: "building", label: "Departments" },
    { to: "/bookingpage", icon: "bed", label: "Booking Beds" },
    { to: "/labmanagement", icon: "flask", label: "Lab Management" },
    { to: "/reports", icon: "chart-bar", label: "Reports" },
    { to: "/settings", icon: "cog", label: "Settings" },
  ].map((item) => (
    <Link
      key={item.to}
      to={item.to}
      className={`nav-link ${isActive(item.to)}`}
      onClick={handleLinkClick}
    >
      <i className={`fas fa-${item.icon}`}></i>
      <span>{item.label}</span>
    </Link>
  ))}
</nav>

      {/* ---- LOGOUT ---- */}
      <button className="logout" onClick={handleLogout}>
        <i className="fas fa-sign-out-alt"></i> Logout
      </button>
    </aside>
  );
};

export default Sidebar;