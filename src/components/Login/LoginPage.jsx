// src/components/Login/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";
import { AuthAPI } from "../../services/api";

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    
    if (!email || !password) {
      setErrorMessage("Please enter email and password");
      return;
    }

    setLoading(true);
    
    // Hardcoded Super Admin credentials
    if (email === "superadmin@example.com" && password === "SuperAdmin@123") {
      localStorage.clear();
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userRole", "Super Admin");
      localStorage.setItem("isSuperAdmin", "true");
      localStorage.setItem("auth", "true");
      
      // Redirect to super admin dashboard
      window.location.href = "/super-admin";
      return;
    }

    // Hardcoded Regular User credentials
    if (email === "user@example.com" && password === "User@123") {
      localStorage.clear();
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userRole", "User");
      localStorage.setItem("auth", "true");
      
      // Redirect to user dashboard
      window.location.href = "/dashboard";
      return;
    }

    try {
      // Try actual API login
      const res = await AuthAPI.login(email, password);
      const data = res?.data || {};

      if (data.requiresOtp) {
        setErrorMessage("OTP required. Please use demo credentials for now.");
        setLoading(false);
        return;
      }

      // Handle successful API login
      localStorage.clear();
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userRole", data.role || "User");
      localStorage.setItem("auth", "true");
      
      // Redirect based on role
      const role = data.role?.toLowerCase() || "user";
      if (role.includes("super")) {
        window.location.href = "/super-admin";
      } else {
        window.location.href = "/dashboard";
      }
      
    } catch (err) {
      setErrorMessage("Invalid credentials. Try demo: superadmin@example.com / SuperAdmin@123");
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Login to your hospital system</p>
        </div>

        {errorMessage && <div className="popup-error">{errorMessage}</div>}

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          
          <div className="link-container">
            <span className="login-link" onClick={() => alert("Forgot password functionality")}>
              Forgot Password?
            </span>
            <span className="login-link" onClick={() => navigate("/onboarding")}>
              Registration
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;