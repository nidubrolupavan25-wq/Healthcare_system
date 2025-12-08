import React from "react";
import { LogOut, Home, CheckSquare, Building2, Store, Settings, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./css/SuperAdminSidebar.css";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: <Home size={18} /> },
  { id: "approvalsWorkflow", label: "Approvals & Reviews", icon: <CheckSquare size={18} /> },
  { id: "hospitalManagement", label: "Hospital Management", icon: <Building2 size={18} /> },
  { id: "medicalStores", label: "Medical Stores", icon: <Store size={18} /> },
  { id: "settings", label: "Settings", icon: <Settings size={18} /> },
];

export default function SuperAdminSidebar({ open, active, onSelect, setOpen }) {
  const navigate = useNavigate();

  const handleClick = (page) => {
    // Update active page
    onSelect(page);
    
    // Navigate to the correct route
    if (page === "dashboard") {
      navigate("/super-admin");
    } else {
      navigate(`/super-admin/${page}`);
    }

    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
      setOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/";
  };

  if (!open) return null;

  return (
    <>
      {/* Overlay for mobile */}
      {open && window.innerWidth <= 768 && (
        <div 
          className="superadmin-sidebar-overlay visible" 
          onClick={() => setOpen(false)}
        />
      )}

      <aside className={`superadmin-sidebar ${open ? "open" : "closed"}`}>
        <div className="superadmin-sidebar-header">
          <div className="superadmin-sidebar-logo">
            Medi<span className="superadmin-sidebar-logo-accent">Admin</span>
          </div>
          <button className="superadmin-sidebar-close" onClick={() => setOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <nav className="superadmin-sidebar-nav">
          {navItems.map(({ id, label, icon }) => (
            <button
              key={id}
              className={`superadmin-sidebar-item ${active === id ? "active" : ""}`}
              onClick={() => handleClick(id)}
            >
              <span className="superadmin-sidebar-icon">{icon}</span>
              <span className="superadmin-sidebar-label">{label}</span>
            </button>
          ))}

          {/* LOGOUT */}
          <button className="superadmin-sidebar-item superadmin-sidebar-logout" onClick={handleLogout}>
            <span className="superadmin-sidebar-icon"><LogOut size={18} /></span>
            <span className="superadmin-sidebar-label">Logout</span>
          </button>
        </nav>

        <div className="superadmin-sidebar-footer">
          <small>v1.0 • Super Admin</small>
        </div>
      </aside>
    </>
  );
}