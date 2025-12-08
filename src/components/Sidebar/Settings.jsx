import React, { useContext, useEffect, useState, useRef } from "react";
import {
  User, Shield, Settings as SettingsIcon, Bell, Palette, Save,
  Upload, Mail, Phone, MapPin, Users, Lock, Database, Globe,
  Sun, Moon, Monitor, X, Eye, EyeOff, Loader2
} from "lucide-react";
import "../css/settings.css";
import { UserContext } from "../../context/UserContext";
import api from "../../services/api";

const SettingsPage = () => {
  const { user, setUser } = useContext(UserContext);
  const [profileData, setProfileData] = useState({});
  const [imageUrl, setImageUrl] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const fileInputRef = useRef(null);
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    systemAlerts: true,
    weeklyReports: false
  });
  const [systemConfig, setSystemConfig] = useState({
    maintenanceMode: false,
    autoBackup: true,
    backupFrequency: "daily",
    sessionTimeout: "30",
    maxLoginAttempts: "3"
  });
  const [theme, setTheme] = useState("light");
  const [activeTab, setActiveTab] = useState("profile");

  /* ---------- PASSWORD MODAL STATE ---------- */
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [step, setStep] = useState(1);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* ---------- 2FA STATE ---------- */
  const [is2FALoading, setIs2FALoading] = useState(false);

  /* ---------- Load user ---------- */
  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.name || "",
        email: user.email || "",
        phone: user.mobile || "",
        department: user.department || "",
        address: user.address || "",
        bio: user.bio || ""
      });
      const url = user.profileImage || user.image;
      if (url) {
        if (url.startsWith("data:") || url.startsWith("http")) {
          setImageUrl(url);
        } else {
          setImageUrl(`data:image/jpeg;base64,${url}`);
        }
      }
    }
  }, [user]);

  /* ---------- Tabs ---------- */
  const tabs = [
    { id: "profile", label: "Profile Settings", icon: User },
    { id: "roles", label: "Role Management", icon: Shield },
    { id: "system", label: "System Configuration", icon: SettingsIcon },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "theme", label: "Theme Settings", icon: Palette }
  ];

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = field => {
    setNotifications(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSystemConfigChange = (field, value) => {
    setSystemConfig(prev => ({ ...prev, [field]: value }));
  };

  /* ---------- SAVE PROFILE (PATCH by email) ---------- */
  const handleSave = async () => {
    if (!user?.email) {
      alert("User email not found");
      return;
    }
    const updateData = {
      name: profileData.fullName,
      mobile: profileData.phone,
      department: profileData.department,
      address: profileData.address,
      bio: profileData.bio
    };
    try {
      await api.patch(`/staff/email/${user.email}`, updateData);
      setUser(prev => ({ ...prev, ...updateData }));
      alert("Profile updated successfully!");
    } catch (error) {
      alert(`Update failed: ${error.response?.data?.message || error.message}`);
    }
  };

  /* ---------- CHANGE PASSWORD: STEP 1 - Validate Old ---------- */
  const validateOldPassword = async () => {
    if (!oldPassword.trim()) return setError("Enter your old password");
    if (!user?.email) return setError("User email not found");
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(`/staff/email/${user.email}`);
      if (data.password !== oldPassword) throw new Error("Incorrect old password");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to verify");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- CHANGE PASSWORD: STEP 2 - Update New ---------- */
  const handlePasswordChange = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      setError("Fill all fields");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!user?.email) {
      setError("User email not found");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await api.get(`/staff/email/${user.email}`);
      const currentUser = response.data;
      const updateData = {
        ...currentUser,
        password: newPassword
      };
      await api.patch(`/staff/email/${user.email}`, updateData);
      setShowPasswordModal(false);
      setStep(1);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      alert("Password updated successfully!");
      setUser(prev => ({ ...prev, password: newPassword }));
    } catch (err) {
      console.error("Password update error:", err);
      setError(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const openChangePassword = () => {
    setShowPasswordModal(true);
    setStep(1);
    setError("");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  /* ---------- 2FA TOGGLE FUNCTION ---------- */
 const toggle2FA = async () => {
  if (!user?.id) {
    alert("User ID not found");
    return;
  }

  const current2FA = user.twoFactAuthentication;
  const new2FA = current2FA === 1 ? 0 : 1;

  setIs2FALoading(true);
  try {
    await api.patch(
      `/staff/${user.id}`,
      { twoFactorAuthentication: new2FA },
      { headers: { "Content-Type": "application/json" } } // ✅ Added fix
    );

    setUser(prev => ({ ...prev, twoFactAuthentication: new2FA }));
    alert(`Two-Factor Authentication ${new2FA === 1 ? "enabled" : "disabled"} successfully!`);
  } catch (error) {
    console.error("2FA update error:", error);
    alert(`Failed to update 2FA: ${error.response?.data?.message || error.message}`);
  } finally {
    setIs2FALoading(false);
  }
};


  /* ---------- Image Upload/Delete ---------- */
  const uploadImage = async (file) => {
    if (!user?.id) {
      alert("User ID not found");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await api.post(`/staff/${user.id}/upload-image`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const newUrl = res.data.imageUrl || `data:image/jpeg;base64,${res.data.image}` || URL.createObjectURL(file);
      setImageUrl(newUrl);
      setUser(prev => ({ ...prev, profileImage: newUrl, image: newUrl }));
    } catch (error) {
      alert(`Upload failed: ${error.response?.data?.message || error.message}`);
    }
  };

  const deleteImage = async () => {
    if (!user?.id) return;
    try {
      await api.delete(`/staff/${user.id}/delete-image`);
      setImageUrl(null);
      setUser(prev => ({ ...prev, profileImage: null, image: null }));
    } catch (error) {
      alert("Failed to remove image");
    }
  };

  const openPicker = () => fileInputRef.current?.click();
  const onFileChange = e => {
    const file = e.target.files?.[0];
    if (file) uploadImage(file);
  };

  /* ---------- Render Profile ---------- */
  const renderProfileSettings = () => (
    <div className="settings-section">
      <h2>Profile Settings</h2>
      {/* Avatar */}
      <div className="profile-header">
        <div className="avatar-wrapper">
          {imageUrl ? (
            <img src={imageUrl} alt="Profile" className="profile-img" />
          ) : (
            <div className="avatar">
              {profileData.fullName?.substring(0, 2).toUpperCase() || "U"}
            </div>
          )}
          <div
            className="avatar-overlay"
            onMouseEnter={() => setShowOverlay(true)}
            onMouseLeave={() => setShowOverlay(false)}
          >
            {showOverlay && (
              <div className="overlay-menu">
                <button onClick={openPicker}>
                  <Upload size={14} /> Change Image
                </button>
                {imageUrl && (
                  <>
                    <button onClick={() => setShowFullImage(true)}>
                      View Image
                    </button>
                    <button onClick={deleteImage} className="danger">
                      Remove Image
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={onFileChange}
        />
      </div>

      {showFullImage && imageUrl && (
        <div className="full-image-modal" onClick={() => setShowFullImage(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <img src={imageUrl} alt="Full profile" />
            <button className="close-modal" onClick={() => setShowFullImage(false)}>
              <X size={24} />
            </button>
          </div>
        </div>
      )}

      <div className="form-grid">
        <div className="form-group">
          <label><User size={18} /> Full Name</label>
          <input
            type="text"
            value={profileData.fullName || ""}
            onChange={e => handleProfileChange("fullName", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label><Mail size={18} /> Email Address</label>
          <input type="email" value={profileData.email || ""} disabled />
        </div>
        <div className="form-group">
          <label><Phone size={18} /> Phone Number</label>
          <input
            type="tel"
            value={profileData.phone || ""}
            onChange={e => handleProfileChange("phone", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label><Users size={18} /> Department</label>
          <select
            value={profileData.department || ""}
            onChange={e => handleProfileChange("department", e.target.value)}
          >
            <option>Cardiology</option>
            <option>Neurology</option>
            <option>Pediatrics</option>
            <option>Orthopedics</option>
            <option>Emergency</option>
            <option>HR</option>
          </select>
        </div>
        <div className="form-group full-width">
          <label><MapPin size={18} /> Address</label>
          <input
            type="text"
            value={profileData.address || ""}
            onChange={e => handleProfileChange("address", e.target.value)}
          />
        </div>
       
      </div>

      {/* SAVE BUTTON */}
      <div className="profile-actions">
        <button className="primary-btn">Cancel</button>
        <button className="primary-btn" onClick={handleSave}>
          <Save size={18} /> Save Changes
        </button>
      </div>

      {/* Security Section */}
      <div className="security-section">
        <h3><Lock size={20} /> Security</h3>
        <button className="secondary-btn" onClick={openChangePassword}>
          Change Password
        </button>

        {/* 2FA TOGGLE BUTTON */}
        <button
          className={`secondary-btn ${is2FALoading ? 'disabled' : ''}`}
          onClick={toggle2FA}
          disabled={is2FALoading}
          style={{ marginTop: '8px', position: 'relative' }}
        >
          {is2FALoading ? (
            <>
              <Loader2 className="spin" size={16} style={{ marginRight: '8px' }} />
              Updating...
            </>
          ) : (
            <>
              {user?.twoFactAuthentication === 1 ? "Enable" : "Disable"} Two-Factor Authentication
            </>
          )}
        </button>
      </div>
    </div>
  );

  /* ---------- PASSWORD MODAL ---------- */
  const renderPasswordModal = () => (
    <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Change Password</h3>
          <button onClick={() => setShowPasswordModal(false)} className="close-btn">
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          {/* STEP 1: Old Password */}
          {step === 1 && (
            <>
              <p>Enter your current password to continue.</p>
              <div className="password-group">
                <input
                  type={showOldPassword ? "text" : "password"}
                  placeholder="Old Password"
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                  className="password-input"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                >
                 
                </button>
              </div>
              {error && <p className="error-message">{error}</p>}
              <button
                className="primary-btn full-width"
                onClick={validateOldPassword}
                disabled={loading}
              >
                {loading ? <Loader2 className="spin" size={18} /> : "Next"}
              </button>
            </>
          )}

          {/* STEP 2: New + Confirm */}
          {step === 2 && (
            <>
              <p>Set your new password.</p>
              <div className="password-group">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="password-input"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                
                </button>
              </div>
              <div className="password-group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="password-input"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                 
                </button>
              </div>
              {error && <p className="error-message">{error}</p>}
              <div className="modal-buttons">
                <button className="secondary-btn" onClick={() => setStep(1)}>
                  Back
                </button>
                <button
                  className="primary-btn"
                  onClick={handlePasswordChange}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="spin" size={18} /> : "Update Password"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  /* ---------- Other Tabs (unchanged) ---------- */
  const renderRoleManagement = () => (
    <div className="settings-section">
      <h2>Role Management</h2>
      <p className="section-description">Manage user roles and permissions for your healthcare system</p>
      <div className="roles-container">
        {["Administrator", "Doctor", "Nurse", "Reception Staff"].map((role, i) => (
          <div key={i} className="role-card">
            <div className="role-header">
              <Shield size={24} className="role-icon" />
              <div>
                <h3>{role}</h3>
                <span className="role-count">{Math.floor(Math.random() * 50) + 5} users</span>
              </div>
            </div>
            <p>Manage permissions for {role.toLowerCase()} role</p>
            <div className="permissions-list">
              <span className="permission-tag">View</span>
              <span className="permission-tag">Edit</span>
              <span className="permission-tag">Delete</span>
            </div>
            <button className="edit-btn">Edit Role</button>
          </div>
        ))}
      </div>
      <button className="primary-btn">
        <Users size={18} /> Create New Role
      </button>
    </div>
  );

  const renderSystemConfiguration = () => (
    <div className="settings-section">
      <h2>System Configuration</h2>
      <p className="section-description">Configure system-wide settings and preferences</p>
      <div className="config-group">
        <h3><Database size={20} /> Database & Backup</h3>
        <div className="config-item">
          <div className="config-info">
            <label>Automatic Backup</label>
            <span className="config-description">Enable automatic database backups</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={systemConfig.autoBackup}
              onChange={e => handleSystemConfigChange("autoBackup", e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="config-item">
          <div className="config-info">
            <label>Backup Frequency</label>
            <span className="config-description">How often to perform backups</span>
          </div>
          <select
            value={systemConfig.backupFrequency}
            onChange={e => handleSystemConfigChange("backupFrequency", e.target.value)}
          >
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
      </div>
      <div className="config-group">
        <h3><Lock size={20} /> Security Settings</h3>
        <div className="config-item">
          <div className="config-info">
            <label>Session Timeout (minutes)</label>
            <span className="config-description">Auto logout after inactivity</span>
          </div>
          <input
            type="number"
            value={systemConfig.sessionTimeout}
            onChange={e => handleSystemConfigChange("sessionTimeout", e.target.value)}
            style={{ width: "100px" }}
          />
        </div>
        <div className="config-item">
          <div className="config-info">
            <label>Max Login Attempts</label>
            <span className="config-description">Lock account after failed attempts</span>
          </div>
          <input
            type="number"
            value={systemConfig.maxLoginAttempts}
            onChange={e => handleSystemConfigChange("maxLoginAttempts", e.target.value)}
            style={{ width: "100px" }}
          />
        </div>
      </div>
      <div className="config-group">
        <h3><Globe size={20} /> General Settings</h3>
        <div className="config-item">
          <div className="config-info">
            <label>Maintenance Mode</label>
            <span className="config-description">Disable system for maintenance</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={systemConfig.maintenanceMode}
              onChange={e => handleSystemConfigChange("maintenanceMode", e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="settings-section">
      <h2>Notification Settings</h2>
      <p className="section-description">Manage how you receive notifications and alerts</p>
      {Object.keys(notifications).map((key, i) => (
        <div key={i} className="notification-item">
          <div className="notification-info">
            <label>{key.replace(/([A-Z])/g, " $1").trim()}</label>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={notifications[key]}
              onChange={() => handleNotificationChange(key)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      ))}
    </div>
  );

  const renderThemeSettings = () => (
    <div className="settings-section">
      <h2>Theme Settings</h2>
      <p className="section-description">Customize the appearance of your dashboard</p>
      <div className="theme-group">
        <h3><Palette size={20} /> Color Theme</h3>
        <div className="theme-options">
          {["light", "dark", "auto"].map(t => (
            <div
              key={t}
              className={`theme-option ${theme === t ? "active" : ""}`}
              onClick={() => setTheme(t)}
            >
              {t === "light" && <Sun size={32} />}
              {t === "dark" && <Moon size={32} />}
              {t === "auto" && <Monitor size={32} />}
              <span>{t.charAt(0).toUpperCase() + t.slice(1)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /* ---------- Render ---------- */
  return (
    <div className="settings-container">
      {/* LEFT SIDEBAR */}
      <div className="settings-sidebar">
        <h1 className="settings-title">Settings</h1>
        <nav className="settings-nav">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`nav-item ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={20} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* RIGHT CONTENT */}
      <div className="settings-content">
        {activeTab === "profile" && renderProfileSettings()}
        {activeTab === "roles" && renderRoleManagement()}
        {activeTab === "system" && renderSystemConfiguration()}
        {activeTab === "notifications" && renderNotificationSettings()}
        {activeTab === "theme" && renderThemeSettings()}
        {showPasswordModal && renderPasswordModal()}
      </div>
    </div>
  );
};

export default SettingsPage;