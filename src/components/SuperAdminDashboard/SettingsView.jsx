import React, { useState } from "react";
import { X } from "lucide-react";
import "../SuperAdminDashboard/css/settings-view.css"

export default function SettingsView() {
  const [saving, setSaving] = useState(false);

  /* GENERAL */
  const [systemName, setSystemName] = useState("MediAdmin Platform");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [contactEmail, setContactEmail] = useState("support@example.com");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [logoPreview, setLogoPreview] = useState("/mnt/data/91a6760f-0856-429a-8b7a-206af548c072.png");

  /* NOTIFICATIONS */
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [emailFrom, setEmailFrom] = useState("no-reply@example.com");
  const [smtpHost, setSmtpHost] = useState("");

  /* APPROVAL WORKFLOW */
  const [autoApproveThreshold, setAutoApproveThreshold] = useState(0);
  const [requiredHospitalDocs, setRequiredHospitalDocs] = useState(["License", "PAN", "GST"]);
  const [requiredStoreDocs, setRequiredStoreDocs] = useState(["KYC", "GST"]);

  /* SECURITY */
  const [twoFA, setTwoFA] = useState(true);
  const [maxFailedLogins, setMaxFailedLogins] = useState(5);
  const [sessionTimeout, setSessionTimeout] = useState(60);

  /* BACKUP */
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupSchedule, setBackupSchedule] = useState("02:00");

  /* THEME & API */
  const [accentColor, setAccentColor] = useState("#0a4fa3");
  const [allowThemeSwitching, setAllowThemeSwitching] = useState(true);
  const [paymentGatewayKey, setPaymentGatewayKey] = useState("");
  const [smsApiKey, setSmsApiKey] = useState("");

  /* ROLES */
  const [roles, setRoles] = useState([
    { id: "admin", name: "Admin", perms: { view: true, edit: true, approve: true } },
    { id: "hospital_admin", name: "Hospital Admin", perms: { view: true, edit: true, approve: false } },
    { id: "store_admin", name: "Store Admin", perms: { view: true, edit: false, approve: false } },
  ]);
  const [newRoleName, setNewRoleName] = useState("");

  /* AUDIT LOGS */
  const [auditRetentionDays, setAuditRetentionDays] = useState(90);

  /* CONFIRM MODAL */
  const [showConfirm, setShowConfirm] = useState(false);

  function handleLogoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLogoPreview(url);
  }

  function saveSection(sectionName, payload) {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert(`${sectionName} settings saved`);
      console.log("saved", sectionName, payload);
    }, 700);
  }

  function addRole() {
    if (!newRoleName.trim()) return alert("Enter role name");
    const id = newRoleName.trim().toLowerCase().replace(/\s+/g, "_");
    setRoles(prev => [...prev, { id, name: newRoleName.trim(), perms: { view: true, edit: false, approve: false } }]);
    setNewRoleName("");
  }

  function toggleRolePerm(roleId, perm) {
    setRoles(prev =>
      prev.map(r =>
        r.id === roleId ? { ...r, perms: { ...r.perms, [perm]: !r.perms[perm] } } : r
      )
    );
  }

  function clearOldLogs() {
    setShowConfirm(true);
  }

  function confirmClearLogs() {
    setShowConfirm(false);
    alert("Old logs cleared successfully!");
  }

  return (
    <div className="page-wrapper">
      <div className="pg-head">
        <h2 className="page-title">⚙️ System Settings (Enterprise)</h2>
        <div className="pg-sub">
          Full configuration for General, Notifications, Workflow, Security, Backups, Themes, Roles & Billing.
        </div>
      </div>

      {/* GENERAL */}
      <div className="settings-card">
        <h3 className="settings-title">General</h3>
        <div className="settings-grid">
          <div>
            <label>System Name</label>
            <input value={systemName} onChange={(e) => setSystemName(e.target.value)} className="input" />
          </div>

          <div>
            <label>Contact Email</label>
            <input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="input" />
          </div>

          <div>
            <label>Timezone</label>
            <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="filter-select">
              <option>Asia/Kolkata</option>
              <option>UTC</option>
              <option>America/New_York</option>
            </select>
          </div>

          <div>
            <label>Maintenance Mode</label>
            <button className={`btn ${maintenanceMode ? "primary" : "ghost"}`} onClick={() => setMaintenanceMode(!maintenanceMode)}>
              {maintenanceMode ? "Enabled" : "Disabled"}
            </button>
          </div>

          {/* LOGO */}
          <div style={{ gridColumn: "1 / span 2" }}>
            <label>Platform Logo</label>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 96, height: 56, borderRadius: 8, overflow: "hidden", border: "1px solid #ddd" }}>
                <img src={logoPreview} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div>
                <input id="logoFile" type="file" accept="image/*" onChange={handleLogoChange} style={{ display: "none" }} />
                <label htmlFor="logoFile" className="btn small">Upload Logo</label>
              </div>
            </div>
          </div>

          <div style={{ gridColumn: "1 / span 3", textAlign: "right" }}>
            <button className="btn primary"
              onClick={() => saveSection("General", { systemName, contactEmail, timezone, maintenanceMode })}>
              Save General
            </button>
          </div>
        </div>
      </div>

      {/* NOTIFICATIONS */}
      <div className="settings-card">
        <h3 className="settings-title">Notifications</h3>
        <div className="settings-grid">
          <div>
            <label>Email Notifications</label>
            <button className={`btn ${emailEnabled ? "primary" : "ghost"}`} onClick={() => setEmailEnabled(!emailEnabled)}>
              {emailEnabled ? "On" : "Off"}
            </button>
          </div>

          <div>
            <label>SMS Notifications</label>
            <button className={`btn ${smsEnabled ? "primary" : "ghost"}`} onClick={() => setSmsEnabled(!smsEnabled)}>
              {smsEnabled ? "On" : "Off"}
            </button>
          </div>

          <div>
            <label>Email From</label>
            <input value={emailFrom} onChange={(e) => setEmailFrom(e.target.value)} className="input" />
          </div>

          <div>
            <label>SMTP Host</label>
            <input value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} className="input" />
          </div>

          <div style={{ gridColumn: "1 / span 3", textAlign: "right" }}>
            <button className="btn primary"
              onClick={() => saveSection("Notifications", { emailEnabled, smsEnabled, emailFrom, smtpHost })}>
              Save Notifications
            </button>
          </div>
        </div>
      </div>

      {/* APPROVAL WORKFLOW */}
      <div className="settings-card">
        <h3 className="settings-title">Approval Workflow</h3>
        <div className="settings-grid">
          <div>
            <label>Auto Approve Limit (per day)</label>
            <input type="number" value={autoApproveThreshold}
              onChange={(e) => setAutoApproveThreshold(Number(e.target.value))}
              className="input" />
          </div>

          <div>
            <label>Required Hospital Docs</label>
            <input value={requiredHospitalDocs.join(", ")}
              onChange={(e) => setRequiredHospitalDocs(e.target.value.split(",").map(s => s.trim()))}
              className="input" />
          </div>

          <div>
            <label>Required Store Docs</label>
            <input value={requiredStoreDocs.join(", ")}
              onChange={(e) => setRequiredStoreDocs(e.target.value.split(",").map(s => s.trim()))}
              className="input" />
          </div>

          <div style={{ gridColumn: "1 / span 3", textAlign: "right" }}>
            <button className="btn primary"
              onClick={() => saveSection("Approval Workflow", { autoApproveThreshold, requiredHospitalDocs, requiredStoreDocs })}>
              Save Workflow
            </button>
          </div>
        </div>
      </div>

      {/* SECURITY */}
      <div className="settings-card">
        <h3 className="settings-title">Security</h3>
        <div className="settings-grid">
          <div>
            <label>Two-Factor Auth</label>
            <button className={`btn ${twoFA ? "primary" : "ghost"}`} onClick={() => setTwoFA(!twoFA)}>
              {twoFA ? "Enabled" : "Disabled"}
            </button>
          </div>

          <div>
            <label>Max Failed Logins</label>
            <input type="number" value={maxFailedLogins}
              onChange={(e) => setMaxFailedLogins(Number(e.target.value))}
              className="input" />
          </div>

          <div>
            <label>Session Timeout (min)</label>
            <input type="number" value={sessionTimeout}
              onChange={(e) => setSessionTimeout(Number(e.target.value))}
              className="input" />
          </div>

          <div style={{ gridColumn: "1 / span 3", textAlign: "right" }}>
            <button className="btn primary"
              onClick={() => saveSection("Security", { twoFA, maxFailedLogins, sessionTimeout })}>
              Save Security
            </button>
          </div>
        </div>
      </div>

      {/* BACKUP */}
      <div className="settings-card">
        <h3 className="settings-title">Backup & Data</h3>
        <div className="settings-grid">
          <div>
            <label>Auto Backup</label>
            <button className={`btn ${autoBackup ? "primary" : "ghost"}`} onClick={() => setAutoBackup(!autoBackup)}>
              {autoBackup ? "On" : "Off"}
            </button>
          </div>

          <div>
            <label>Backup Time</label>
            <input type="time" value={backupSchedule}
              onChange={(e) => setBackupSchedule(e.target.value)}
              className="input" />
          </div>

          <div style={{ gridColumn: "1 / span 3", textAlign: "right" }}>
            <button className="btn primary"
              onClick={() => saveSection("Backup", { autoBackup, backupSchedule })}>
              Save Backup
            </button>
          </div>
        </div>
      </div>

      {/* THEME & INTEGRATIONS */}
      <div className="settings-card">
        <h3 className="settings-title">Theme & Integrations</h3>
        <div className="settings-grid">
          <div>
            <label>Accent Color</label>
            <input type="color" value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="input" />
          </div>

          <div>
            <label>Allow Theme Switch</label>
            <button className={`btn ${allowThemeSwitching ? "primary" : "ghost"}`}
              onClick={() => setAllowThemeSwitching(!allowThemeSwitching)}>
              {allowThemeSwitching ? "Yes" : "No"}
            </button>
          </div>

          <div>
            <label>Payment Gateway Key</label>
            <input value={paymentGatewayKey}
              onChange={(e) => setPaymentGatewayKey(e.target.value)}
              className="input" />
          </div>

          <div>
            <label>SMS API Key</label>
            <input value={smsApiKey}
              onChange={(e) => setSmsApiKey(e.target.value)}
              className="input" />
          </div>

          <div style={{ gridColumn: "1 / span 3", textAlign: "right" }}>
            <button className="btn primary"
              onClick={() => saveSection("Theme & Integrations", { accentColor, allowThemeSwitching, paymentGatewayKey, smsApiKey })}>
              Save Integrations
            </button>
          </div>
        </div>
      </div>

      {/* ROLES */}
      <div className="settings-card">
        <h3 className="settings-title">Roles & Permissions</h3>

        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <input className="input" placeholder="New role" value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)} />
            <button className="btn primary" onClick={addRole}>Add</button>
          </div>
        </div>

        <div className="table-box">
          <table className="hospital-table">
            <thead>
              <tr>
                <th>Role</th>
                <th>View</th>
                <th>Edit</th>
                <th>Approve</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((r) => (
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td><input type="checkbox" checked={r.perms.view} onChange={() => toggleRolePerm(r.id, "view")} /></td>
                  <td><input type="checkbox" checked={r.perms.edit} onChange={() => toggleRolePerm(r.id, "edit")} /></td>
                  <td><input type="checkbox" checked={r.perms.approve} onChange={() => toggleRolePerm(r.id, "approve")} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ textAlign: "right", marginTop: 12 }}>
          <button className="btn primary"
            onClick={() => saveSection("Roles & Permissions", { roles })}>
            Save Roles
          </button>
        </div>
      </div>

      {/* AUDIT LOGS */}
      <div className="settings-card">
        <h3 className="settings-title">Audit Logs & Billing</h3>

        <div className="settings-grid">
          <div>
            <label>Log Retention (days)</label>
            <input
              type="number"
              className="input"
              value={auditRetentionDays}
              onChange={(e) => setAuditRetentionDays(Number(e.target.value))}
            />
          </div>

          <div>
            <label>Default Billing Plan</label>
            <select className="filter-select">
              <option>Free</option>
              <option>Pro</option>
              <option>Enterprise</option>
            </select>
          </div>

          <div style={{ gridColumn: "1 / span 3", textAlign: "right" }}>
            <button className="btn ghost" onClick={clearOldLogs}>Clear Old Logs</button>
            <button className="btn primary"
              onClick={() => saveSection("Audit & Billing", { auditRetentionDays })}>
              Save
            </button>
          </div>
        </div>
      </div>

      {/* CONFIRM DELETE LOGS MODAL */}
      {showConfirm && (
        <div className="modal-backdrop">
          <div className="modal-card small">
            <div className="modal-header">
              <h3>Confirm Action</h3>
              <button className="icon-btn small" onClick={() => setShowConfirm(false)}>
                <X size={16} />
              </button>
            </div>

            <div className="modal-body">
              <p>
                Are you sure you want to clear audit logs older than {auditRetentionDays} days?
              </p>
            </div>

            <div className="modal-footer">
              <button className="btn ghost" onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="btn danger" onClick={confirmClearLogs}>Yes, Clear Logs</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
