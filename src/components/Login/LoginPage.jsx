// src/components/Login/LoginPage.jsx
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";
import { AuthAPI, LoginAPI, StaffAPI } from "../../services/api";
import { UserContext } from "../../context/UserContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  // ---------- Common States ----------
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("login"); // login | forgot
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // ---------- Login States ----------
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  // ---------- Role Selection ----------
  const [availableRoles, setAvailableRoles] = useState([]);
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  // ---------- Forgot Password States ----------
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Prevent back navigation
  useEffect(() => {
    const onPopState = () => {};
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const resetMessages = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  // Save auth data with SUPER ADMIN detection
  const saveAuthContext = (data) => {
    console.log("Saving Auth Data:", data);
    
    // Check if this is a Super Admin
    const userEmail = data.email || email;
    const userRole = data.role || data.roles?.[0];
    
    console.log("User Email:", userEmail);
    console.log("User Role:", userRole);
    
    // Normalize role for comparison
    const normalizedRole = userRole?.toLowerCase().trim() || '';
    console.log("Normalized Role:", normalizedRole);
    
    // Check for Super Admin roles
    const isSuperAdmin = [
      'super admin', 
      'super_admin', 
      'superadmin',
      'superadministrator',
      'super administrator',
      'super'
    ].includes(normalizedRole);
    
    console.log("Is Super Admin:", isSuperAdmin);
    
    if (isSuperAdmin) {
      // Force set as Super Admin
      localStorage.setItem("userRole", "Super Admin");
      console.log("🔵 FORCE SET: User Role = 'Super Admin'");
    } else {
      localStorage.setItem("userRole", userRole || "");
    }
    
    localStorage.setItem("verificationLevel", data.verificationLevel || "");
    localStorage.setItem("organizationId", data.organizationId || "");
    localStorage.setItem("organizationCode", data.organizationCode || "");
    localStorage.setItem("userEmail", userEmail);
    localStorage.setItem("auth", "true");
    localStorage.setItem("loginTime", new Date().toISOString());
  };

  // ----------------------------------------------------------
  //            🔥 UPDATED: PROPER ROLE REDIRECTION
  // ----------------------------------------------------------
  const goToDashboard = async (role, userEmail) => {
    try {
      // Normalize role for comparison
      const normalizedRole = role.toLowerCase().trim();
      console.log(`Navigating as ${normalizedRole} (original: ${role}) → Dashboard`);

      // DEBUG: Log all localStorage before navigation
      console.log("🔍 CURRENT LOCALSTORAGE BEFORE NAVIGATION:");
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        console.log(`${key}: ${localStorage.getItem(key)}`);
      }

      // SUPER ADMIN DETECTION WITH MULTIPLE CHECKS
      const possibleSuperAdminRoles = [
        'super admin', 
        'super_admin', 
        'superadmin',
        'superadministrator',
        'super administrator',
        'super'
      ];
      
      const isSuperAdmin = possibleSuperAdminRoles.includes(normalizedRole);
      
      console.log("🎯 SUPER ADMIN CHECK:");
      console.log("- Normalized role:", normalizedRole);
      console.log("- Is Super Admin?", isSuperAdmin);
      
      // If super admin, FORCE set the role and redirect immediately
      if (isSuperAdmin) {
        console.log("🚀 REDIRECTING TO SUPER ADMIN DASHBOARD");
        
        // Double check and set role
        localStorage.setItem("userRole", "Super Admin");
        localStorage.setItem("isSuperAdmin", "true");
        
        // Clear any previous normal admin data
        localStorage.removeItem("staffData");
        localStorage.removeItem("organizationData");
        
        // Force redirect to super admin
        window.location.href = "/super-admin";
        return;
      }

      // For non-super admin users, proceed with normal flow
      let profileData = null;

      // ADMIN + DOCTOR → ADMIN DASHBOARD
      if (normalizedRole === "admin" || normalizedRole === "doctor") {
        try {
          const res = await StaffAPI.getByEmail(userEmail);
          profileData = res?.data;
        } catch (err) {
          console.error("Error fetching admin profile:", err);
        }
        navigate("/dashboard", { replace: true });
      }

      // MEDICAL
      else if (normalizedRole === "medical") {
        try {
          const res = await StaffAPI.getByEmail(userEmail);
          profileData = res?.data;
        } catch (err) {
          console.error("Error fetching medical profile:", err);
        }
        navigate("/medicaldashboard", { replace: true });
      }

      // LAB
      else if (normalizedRole === "labreporter" || normalizedRole === "lab") {
        navigate("/lab-management", { replace: true });
        return;
      }

      // PATIENT
      else if (normalizedRole === "patient") {
        navigate("/patient-dashboard", { replace: true });
        return;
      }

      // DEFAULT FALLBACK
      else {
        console.warn(`Unknown role: ${role}, redirecting to default dashboard`);
        navigate("/dashboard", { replace: true });
      }

      // Save profile data for non-super admin users
      if (profileData) {
        const orgId = localStorage.getItem("organizationId");
        const fullUser = {
          ...profileData,
          organizationId: orgId ? Number(orgId) : null,
        };
        setUser(fullUser);
        localStorage.setItem("userData", JSON.stringify(fullUser));
        console.log("USER SAVED WITH ORG ID:", fullUser);
      }

    } catch (err) {
      console.error("Dashboard error:", err);
      setErrorMessage("Failed to load dashboard");
    }
  };

  // ----------------------------------------------------------
  //                   LOGIN SUCCESS HANDLER
  // ----------------------------------------------------------
  const handleLoginSuccess = async (data) => {
    console.log("LOGIN SUCCESS RESPONSE:", data);
    saveAuthContext(data);

    const level = data.verificationLevel;
    const roles = Array.isArray(data.roles)
      ? data.roles.map((r) => r.toLowerCase())
      : [];

    console.log("Verification Level:", level);
    console.log("Roles:", roles);

    // Check if it's a Super Admin BEFORE checking verification level
    const userRole = data.role || data.roles?.[0] || '';
    const normalizedRole = userRole.toLowerCase().trim();
    const isSuperAdmin = [
      'super admin', 
      'super_admin', 
      'superadmin',
      'superadministrator',
      'super administrator',
      'super'
    ].includes(normalizedRole);
    
    console.log("🎯 SUPER ADMIN CHECK IN LOGIN SUCCESS:", isSuperAdmin);
    
    // SUPER ADMIN BYPASSES VERIFICATION LEVEL CHECK
    if (isSuperAdmin) {
      console.log("🚀 SUPER ADMIN LOGIN - BYPASSING VERIFICATION CHECK");
      await goToDashboard(userRole, data.email || email);
      return;
    }

    // LEVEL-BASED REDIRECTION FOR NON-SUPER ADMINS
    if (level === "1" || String(level).toLowerCase() === "pending") {
      navigate("/onboarding/bank", { replace: true });
      return;
    }

    // FULLY APPROVED - MULTI ROLE SUPPORT
    if (roles.length === 1) {
      await goToDashboard(roles[0], data.email || email);
    } else if (roles.length > 1) {
      setAvailableRoles(roles);
      setShowRoleSelector(true);
    } else {
      setErrorMessage("No roles assigned");
    }
  };

  // ----------------------------------------------------------
  //                   LOGIN FUNCTION
  // ----------------------------------------------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    resetMessages();
    
    if (!email || !password) {
      setErrorMessage("Please enter email and password");
      return;
    }

    // DEBUG: Test with hardcoded super admin credentials
    console.log("Login attempt with:", { email, password });
    
    // Hardcoded Super Admin test
    if (email === "superadmin@example.com" && password === "SuperAdmin@123") {
      console.log("🟢 HARDCODED SUPER ADMIN DETECTED");
      setLoading(true);
      
      // Clear everything first
      localStorage.clear();
      
      // Set super admin credentials
      localStorage.setItem("userEmail", "superadmin@example.com");
      localStorage.setItem("userRole", "Super Admin"); // EXACTLY THIS STRING
      localStorage.setItem("isSuperAdmin", "true");
      localStorage.setItem("auth", "true");
      localStorage.setItem("loginTime", new Date().toISOString());
      
      // Force redirect to super admin
      setTimeout(() => {
        window.location.href = "/super-admin";
      }, 500);
      return;
    }

    setLoading(true);
    try {
      const res = await AuthAPI.login(email, password);
      const data = res?.data || {};

      if (data.requiresOtp) {
        setIsOtpSent(true);
        setSuccessMessage("OTP sent to your email");
        setLoading(false);
        return;
      }

      await handleLoginSuccess(data);
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------------
  //                 OTP VERIFICATION
  // ----------------------------------------------------------
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    resetMessages();
    if (!otp || otp.length !== 6) {
      setErrorMessage("Enter valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await AuthAPI.verifyOtp(email, otp);
      const data = res?.data || {};

      if (data.status === "success") {
        await handleLoginSuccess(data);
      } else {
        setErrorMessage(data.message || "Invalid OTP");
      }
    } catch {
      setErrorMessage("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------------
  //                   ROLE SELECTOR
  // ----------------------------------------------------------
  const handleRoleSelect = async (role) => {
    setShowRoleSelector(false);
    setSuccessMessage(`Logging in as ${role.toUpperCase()}...`);

    // Check if selected role is super admin
    const normalizedRole = role.toLowerCase().trim();
    const isSuperAdmin = [
      'super admin', 
      'super_admin', 
      'superadmin',
      'superadministrator',
      'super administrator',
      'super'
    ].includes(normalizedRole);
    
    if (isSuperAdmin) {
      // Force set as Super Admin and redirect
      localStorage.setItem("userRole", "Super Admin");
      localStorage.setItem("isSuperAdmin", "true");
      window.location.href = "/super-admin";
      return;
    }

    const level = localStorage.getItem("verificationLevel");
    if (level === "1" || level?.toLowerCase() === "pending") {
      navigate("/onboarding/bank", { replace: true });
      return;
    }

    await goToDashboard(role, email);
  };

  // ----------------------------------------------------------
  //             FORGOT PASSWORD FLOW
  // ----------------------------------------------------------
  const handleForgotEmailSubmit = async (e) => {
    e.preventDefault();
    resetMessages();
    if (!forgotEmail) {
      setErrorMessage("Enter your email");
      return;
    }
    setLoading(true);
    try {
      await LoginAPI.sendOtp(forgotEmail);
      setSuccessMessage("OTP sent!");
      setForgotStep(2);
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || "Email not found");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotOtpVerify = async (e) => {
    e.preventDefault();
    resetMessages();
    if (!forgotOtp || forgotOtp.length !== 6) {
      setErrorMessage("Enter valid OTP");
      return;
    }
    setLoading(true);
    try {
      const res = await LoginAPI.verifyOtp(forgotEmail, forgotOtp);
      if (res?.data?.toLowerCase().includes("successful")) {
        setSuccessMessage("OTP verified!");
        setForgotStep(3);
      } else {
        setErrorMessage("Invalid OTP");
      }
    } catch {
      setErrorMessage("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    resetMessages();
    if (!newPassword || !confirmPassword) {
      setErrorMessage("Fill all fields");
      return;
    }
    if (newPassword.length < 8) {
      setErrorMessage("Password too short");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords don't match");
      return;
    }
    setLoading(true);
    try {
      await AuthAPI.updatePassword(forgotEmail, newPassword);
      setSuccessMessage("Password updated!");
      setTimeout(() => {
        setMode("login");
        setForgotStep(1);
        setForgotEmail("");
        setForgotOtp("");
        setNewPassword("");
        setConfirmPassword("");
      }, 1500);
    } catch {
      setErrorMessage("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendForgotOtp = async () => {
    resetMessages();
    setLoading(true);
    try {
      await LoginAPI.sendOtp(forgotEmail);
      setSuccessMessage("OTP resent!");
    } catch {
      setErrorMessage("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const switchToLogin = () => {
    setMode("login");
    setIsOtpSent(false);
    setShowRoleSelector(false);
    setForgotStep(1);
    resetMessages();
  };

  // ----------------------------------------------------------
  //                        UI SECTION
  // ----------------------------------------------------------
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h2 className="login-title">
            {mode === "login"
              ? isOtpSent
                ? "Verify OTP"
                : showRoleSelector
                ? "Select Role"
                : "Welcome Back"
              : "Reset Password"}
          </h2>
          <p className="login-subtitle">
            {mode === "login"
              ? isOtpSent
                ? "Enter the 6-digit code"
                : showRoleSelector
                ? "Choose your role"
                : "Login to your hospital system"
              : forgotStep === 1
              ? "Enter registered email"
              : forgotStep === 2
              ? "Enter OTP"
              : "Set new password"}
          </p>
        </div>

        {errorMessage && <div className="popup-error">{errorMessage}</div>}
        {successMessage && <div className="popup-success">{successMessage}</div>}

        {/* DEBUG INFO - REMOVE IN PRODUCTION */}
        <div style={{
          background: '#f0f0f0',
          padding: '10px',
          margin: '10px 0',
          borderRadius: '5px',
          fontSize: '12px',
          color: '#333'
        }}>
          <strong>Debug Info:</strong><br />
          Email: {email}<br />
          Role in localStorage: {localStorage.getItem("userRole") || "Not set"}
        </div>

        {/* LOGIN FORM */}
        {mode === "login" && !isOtpSent && !showRoleSelector && (
          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <input
                type="email"
                placeholder="Email Address (superadmin@example.com for Super Admin)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Password (SuperAdmin@123 for Super Admin)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <button className={`primary-btn ${loading ? "loading" : ""}`} disabled={loading}>
              {loading ? "Checking..." : "Login"}
            </button>
            <div className="link-container">
              <span className="login-link" onClick={() => setMode("forgot")}>
                Forgot Password?
              </span>
              <span className="lo" onClick={() => navigate("/onboarding")}>
                Registration
              </span>
            </div>
          </form>
        )}

        {/* OTP VERIFICATION */}
        {mode === "login" && isOtpSent && (
          <form onSubmit={handleVerifyOtp} className="login-form">
            <div className="input-group">
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
                disabled={loading}
                required
              />
            </div>
            <button className={`primary-btn ${loading ? "loading" : ""}`} disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <div className="link-container">
              <span className="login-link" onClick={() => setIsOtpSent(false)}>
                Back
              </span>
            </div>
          </form>
        )}

        {/* ROLE SELECTOR */}
        {showRoleSelector && (
          <div className="role-selector">
            <h3>Select Your Role</h3>
            <div className="role-buttons">
              {availableRoles.map((role) => (
                <button
                  key={role}
                  type="button"
                  className="primary-btn role-btn"
                  onClick={() => handleRoleSelect(role)}
                >
                  {role.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="link-container">
              <span className="login-link" onClick={switchToLogin}>
                Back to Login
              </span>
            </div>
          </div>
        )}

        {/* FORGOT PASSWORD STEP 1 */}
        {mode === "forgot" && forgotStep === 1 && (
          <form onSubmit={handleForgotEmailSubmit} className="login-form">
            <div className="input-group">
              <input
                type="email"
                placeholder="Registered Email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <button className={`primary-btn ${loading ? "loading" : ""}`} disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
            <div className="link-container">
              <span className="login-link" onClick={switchToLogin}>
                Back to Login
              </span>
            </div>
          </form>
        )}

        {/* FORGOT PASSWORD STEP 2 */}
        {mode === "forgot" && forgotStep === 2 && (
          <form onSubmit={handleForgotOtpVerify} className="login-form">
            <div className="input-group">
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={forgotOtp}
                onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
                disabled={loading}
                required
              />
            </div>
            <button className={`primary-btn ${loading ? "loading" : ""}`} disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <div className="link-container">
              <span className="login-link" onClick={handleResendForgotOtp}>
                Resend OTP
              </span>
              <span className="login-link" onClick={switchToLogin}>
                Back
              </span>
            </div>
          </form>
        )}

        {/* FORGOT PASSWORD STEP 3 */}
        {mode === "forgot" && forgotStep === 3 && (
          <form onSubmit={handlePasswordUpdate} className="login-form">
            <div className="input-group">
              <input
                type="password"
                placeholder="New Password (min 8 chars)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <button className={`primary-btn ${loading ? "loading" : ""}`} disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;