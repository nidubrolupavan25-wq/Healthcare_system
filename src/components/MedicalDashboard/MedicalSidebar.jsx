import React from "react";
import "./css/MedicalSidebar.css";
import { 
  FaBars, 
  FaHome, 
  FaUserMd, 
  FaStore,  
  FaUsers, 
  FaBox, 
  FaMoneyBillWave,  
  FaSignOutAlt,
  FaClipboardList,
  FaSearch 
} from "react-icons/fa";

const MedicalSidebar = ({ sidebarOpen, setSidebarOpen, setPage, currentPage }) => {
  const handleLogout = (e) => {
    // Prevent any default behavior and stop event bubbling
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log("🔄 Starting logout process...");
    
    // Clear ALL authentication data
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear cookies
    document.cookie.split(";").forEach(cookie => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    });
    
    console.log("✅ All storage cleared");
    
    // Force redirect to login page - DON'T go to dashboard
    window.location.href = "/login";
    
    // Prevent any further execution
    return false;
  };

  return (
    <>
      {/* HEADER */}
      <header className="top-header">
        <FaBars
          className="menu-icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        />
        <h1>Medical Dashboard</h1>
      </header>

      {/* SIDEBAR */}
      <div className={`med-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-scroll-container">
          <ul className="sidebar-menu">
            <li
              className={currentPage === "dashboard" ? "active" : ""}
              onClick={() => {
                setPage("dashboard");
                setSidebarOpen(false);
              }}
            >
              <FaHome /> Dashboard
            </li>

            <li
              className={currentPage === "search" ? "active" : ""}
              onClick={() => {
                setPage("search");
                setSidebarOpen(false);
              }}
            >
              <FaSearch /> Search
            </li>

            <li
              className={currentPage === "patient" ? "active" : ""}
              onClick={() => {
                setPage("patient");
                setSidebarOpen(false);
              }}
            >
              <FaUserMd /> Patient Prescription
            </li>

            <li
              className={currentPage === "orders" ? "active" : ""}
              onClick={() => {
                setPage("orders");
                setSidebarOpen(false);
              }}
            >
              <FaClipboardList /> Orders
            </li>

            <li
              className={currentPage === "inventory" ? "active" : ""}
              onClick={() => {
                setPage("inventory");
                setSidebarOpen(false);
              }}
            >
              <FaBox /> Inventory
            </li>

            <li
              className={currentPage === "customers" ? "active" : ""}
              onClick={() => {
                setPage("customers");
                setSidebarOpen(false);
              }}
            >
              <FaUsers /> Customers
            </li>

            <li
              className={currentPage === "store" ? "active" : ""}
              onClick={() => {
                setPage("store");
                setSidebarOpen(false);
              }}
            >
              <FaStore /> Medical Store
            </li>

            <li
              className={currentPage === "billing" ? "active" : ""}
              onClick={() => {
                setPage("billing");
                setSidebarOpen(false);
              }}
            >
              <FaMoneyBillWave /> Billing
            </li>

            {/* Logout button with proper event handling */}
            <li 
              className="logout" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleLogout(e);
              }}
              onMouseDown={(e) => e.preventDefault()} // Additional prevention
            >
              <FaSignOutAlt /> Logout
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default MedicalSidebar;