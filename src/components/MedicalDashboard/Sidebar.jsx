// src/components/MedicalDashboard/MedicalSidebar.jsx
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { FiUser, FiClipboard, FiBox, FiLogOut, FiHome } from "react-icons/fi";
import { UserContext } from "../../context/UserContext";

export default function MedicalSidebar({ tab, setTab }) {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleLogout = (e) => {
    // Make sure clicks aren't swallowed by a parent element
    if (e && typeof e.stopPropagation === "function") e.stopPropagation();

    console.log(">>> handleLogout called (start)");

    try {
      // Remove only auth related keys so other app state isn't suddenly lost
      localStorage.removeItem("userEmail");
      localStorage.removeItem("user");
      sessionStorage.clear();
      console.log(">>> cleared localStorage/sessionStorage");
    } catch (err) {
      console.warn(">>> error clearing storage:", err);
    }

    try {
      if (typeof setUser === "function") {
        setUser(null);
        console.log(">>> setUser(null) called");
      } else {
        console.warn(">>> setUser is not a function or undefined");
      }
    } catch (err) {
      console.warn(">>> error calling setUser:", err);
    }

    // Prefer react-router navigation
    try {
      navigate("/", { replace: true });
      console.log(">>> navigate('/') called");
    } catch (err) {
      console.warn(">>> navigate threw:", err);
    }

    // Fallback: if after 200ms we are not on '/', force a hard redirect
    setTimeout(() => {
      if (window.location.pathname !== "/") {
        console.warn(">>> React navigation didn't change location — doing hard redirect");
        window.location.replace("/");
      } else {
        console.log(">>> Location is now / (logout completed)");
      }
    }, 200);
  };

  return (
    <aside className="medx-sidebar">
      <h2 className="medx-sidebar-title">🩺 MedX Medical</h2>

      <nav className="medx-sidebar-menu">
        <div
          role="button"
          className={`nav-link ${tab === "home" ? "active" : ""}`}
          onClick={() => {
            setTab("home");
            navigate("/medicaldashboard");
          }}
        >
          <FiHome /> <span>Dashboard</span>
        </div>

        <div
          role="button"
          className={`nav-link ${tab === "patients" ? "active" : ""}`}
          onClick={() => {
            setTab("patients");
            navigate("/medicaldashboard");
          }}
        >
          <FiUser /> <span>Patients</span>
        </div>

        <div
          role="button"
          className={`nav-link ${tab === "stock" ? "active" : ""}`}
          onClick={() => {
            setTab("stock");
            navigate("/medicaldashboard/stock");
          }}
        >
          <FiBox /> <span>Medicine Stock</span>
        </div>

        <div
          role="button"
          className={`nav-link ${tab === "reports" ? "active" : ""}`}
          onClick={() => {
            setTab("reports");
            navigate("/medicaldashboard/prescription");
          }}
        >
          <FiClipboard /> <span>Prescription</span>
        </div>
      </nav>

      <button
        type="button"               // <-- important to avoid form submit side effects
        className="logout-btn"
        onClick={handleLogout}
        aria-label="Logout"
      >
        <FiLogOut /> <span>Logout</span>
      </button>
    </aside>
  );
}
