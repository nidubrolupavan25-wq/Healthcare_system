// src/components/LabManagement/LabManagementMain.jsx
import React, { useState, useEffect, useRef, useContext } from "react";
import "./LabManagementMain.css";
import LabDashboard from "./LabDashboard";
import LabResultUpload from "./LabResultUpload";
import LabPatientHistory from "./LabPatientHistory";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt, FaCog, FaBars } from "react-icons/fa";

const LabManagementMain = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, setUser } = useContext(UserContext) || {};
  const menuRef = useRef();
  const profileRef = useRef();
  const navigate = useNavigate();

  const menuItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "result-entry", label: "Upload Result" },
    { id: "patient-history", label: "Patient History" },
  ];

  // Auto close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Date & Time
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      document.getElementById("lab-current-date").innerText = now.toLocaleDateString("en-GB");
      document.getElementById("lab-current-time").innerText = now.toLocaleTimeString();
    };
    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("user");
    sessionStorage.clear();
    setUser(null);
    navigate("/", { replace: true });
  };

  const handleSettings = () => {
    navigate("/settings");
  };

  const handleMenuClick = (id) => {
    setActiveTab(id);
    setMenuOpen(false);
  };

  return (
    <div className="lab-container">
      {/* ===== TOP BAR ===== */}
      <header className="lab-header">
        <div className="header-left" ref={menuRef}>
          <FaBars className="menu-icon" onClick={() => setMenuOpen(!menuOpen)} />
          <h1>Laboratory Information System (LIS)</h1>

          {/* Menu dropdown */}
          {menuOpen && (
            <div className="menu-dropdown">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className={`menu-item ${activeTab === item.id ? "active" : ""}`}
                  onClick={() => handleMenuClick(item.id)}
                >
                  {item.label}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="header-right" ref={profileRef}>
          <div className="datetime">
            <span>Date: <strong id="lab-current-date"></strong></span>
            <span>Time: <strong id="lab-current-time"></strong></span>
          </div>

          {/* Profile Section */}
          <div className="profile-wrapper" onClick={() => setProfileOpen(!profileOpen)}>
            {user?.image ? (
              <img
                src={user.image.startsWith("http") ? user.image : `data:image/jpeg;base64,${user.image}`}
                alt="Avatar"
                className="profile-avatar"
              />
            ) : (
              <FaUserCircle className="profile-avatar default" />
            )}
            {profileOpen && (
              <div className="profile-dropdown">
                <p><strong>{user?.name || "John Smith"}</strong></p>
                <p className="role">{user?.department || "Lab Technician"}</p>
                <hr />
                <button onClick={handleSettings}><FaCog /> Settings</button>
                <button onClick={handleLogout}><FaSignOutAlt /> Logout</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ===== CONTENT ===== */}
      <main className="lab-main-content">
        {activeTab === "dashboard" && <LabDashboard />}
        {activeTab === "result-entry" && <LabResultUpload onUploadSuccess={() => setActiveTab("patient-history")} />}
        {activeTab === "patient-history" && <LabPatientHistory />}
      </main>
    </div>
  );
};

export default LabManagementMain;
