import React from "react";
import Logo from "../../assets/images/logo-removebg-preview.png";
import "./css/navbar.css";

function ModuleNavbar({ show, avatarSrc }) {
  return (
    <nav className={`module-navbar ${show ? "show" : ""}`}>
      <div className="module-navbar-inner full">
        
        {/* LEFT */}
        <div className="module-left">
          <img src={Logo} className="module-logo" alt="logo" />
          <span className="brand-name">JhaiHealthcare</span>
        </div>

        {/* CENTER */}
        <div className="module-center">
          <span>Talk to Doctor</span>
          <span>Medicine</span>
          <span>Book Dr. Appointment</span>
          <span>Lab Test & Packages</span>
          <span>Surgery</span>
          <span>JhaiHealthcare GOLD</span>
        </div>

        {/* RIGHT */}
        <div className="module-right">
          <span className="about-link">About Us</span>
          <img src={avatarSrc} className="avatar small" alt="user" />
        </div>
      </div>
    </nav>
  );
}

export default ModuleNavbar;
