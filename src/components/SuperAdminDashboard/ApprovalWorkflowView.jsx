import React, { useState, useEffect } from "react";
import { HospitalAPI } from "../../services/api"; 
import { CheckCircle, XCircle, Eye, ArrowLeft, Download, MapPin, Image, FileText, Clock } from "lucide-react";
import "../SuperAdminDashboard/css/ApprovalWorkflowView.css";

export default function ApprovalWorkflowView({ setHideLayout }) {
  const [tab, setTab] = useState("hospitals");
  const [list, setList] = useState({ hospitals: [], stores: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // Stats for dashboard
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  // -------------------------------------------
  // LOAD PENDING HOSPITALS & STATS
  // -------------------------------------------
  useEffect(() => {
    async function loadApprovals() {
      try {
        const [hospitalsRes, storesRes, statsRes] = await Promise.all([
          HospitalAPI.getPending(),
          HospitalAPI.getPendingStores(),
          HospitalAPI.getApprovalStats()
        ]);

        const hospitals = hospitalsRes.data.data || [];
        const stores = storesRes.data.data || [];
        const statsData = statsRes.data || {};

        setList({
          hospitals: Array.isArray(hospitals) ? hospitals : [],
          stores: Array.isArray(stores) ? stores : []
        });

        setStats({
          total: statsData.total || hospitals.length + stores.length,
          pending: statsData.pending || hospitals.length + stores.length,
          approved: statsData.approved || 0,
          rejected: statsData.rejected || 0
        });

      } catch (err) {
        setError("Failed to load approval data. Please try again.");
        console.error("Load error:", err);
      }
      setLoading(false);
    }

    loadApprovals();
  }, []);

  // -------------------------------------------
  // VIEW DETAILS: MERGE OWNER + HOSPITAL FIELDS
  // -------------------------------------------
  async function fetchDetails(id) {
    try {
      setLoadingDetails(true);
      const res = await HospitalAPI.getById(id);

      const owner = res.data.owner || {};
      const hospital = res.data.hospital || {};

      const flattenedOwner = Object.fromEntries(
        Object.entries(owner).map(([k, v]) => [`owner_${k}`, v])
      );

      const combined = {
        ...flattenedOwner,
        ...hospital,
      };

      setSelected(combined);
    } catch (err) {
      alert("Failed to load details");
    } finally {
      setLoadingDetails(false);
    }
  }

  // -------------------------------------------
  // APPROVE / REJECT
  // -------------------------------------------
  async function doAction(action) {
    if (!selected) return;

    if (action === "reject" && !rejectReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }

    setLoadingAction(true);

    const newVerificationLevel = action === "approve" ? "1" : "2";
    const newStatus = action === "approve" ? "Approved" : "Rejected";

    try {
      // Update verification level
      const updateRes = await HospitalAPI.updateVerification(selected.id, {
        verificationLevel: newVerificationLevel,
        status: newStatus,
      });

      // Send email based on action
      if (action === "approve") {
        await HospitalAPI.sendApprovalMail({
          email: selected.owner_email,
          organizationName: selected.name,
          password: selected.owner_password || "Owner@123"
        });
      } else {
        await HospitalAPI.sendRejectionMail({
          email: selected.owner_email,
          organizationName: selected.name,
          reason: rejectReason
        });
      }

      // Update local state
      setList(prev => ({
        ...prev,
        [tab]: prev[tab].filter(item => item.id !== selected.id),
      }));

      // Update stats
      setStats(prev => ({
        ...prev,
        pending: prev.pending - 1,
        [action === "approve" ? "approved" : "rejected"]: prev[action === "approve" ? "approved" : "rejected"] + 1
      }));

      // Show success message
      alert(`✅ ${selected.name} has been ${action === "approve" ? "approved" : "rejected"} successfully!`);

    } catch (err) {
      console.error("Action error:", err);
      alert(`Failed to ${action}. Please try again.`);
    } finally {
      setLoadingAction(false);
      setSelected(null);
      setRejectReason("");
      setShowReasonModal(false);
      setHideLayout(false);
    }
  }

  // Field lists
  const OWNER_ALLOW = [
    "owner_name",
    "owner_mobile",
    "owner_email",
    "owner_adhar",
    "owner_address",
    "owner_department",
    "owner_role",
    "owner_ownerpan",
    "owner_designation",
  ];

  const HOSPITAL_ALLOW = [
    "code", "name", "type", "tagline", "description", "established_year",
    "ownership_type", "organizationmail", "hospital_phone", "alternate_phone",
    "website", "address", "landmark", "area", "city", "district", "state",
    "country", "pincode", "total_beds", "icu_beds", "emergency_beds",
    "operation_theatres", "ventilators", "ambulances", "departments",
    "services", "facilities", "registration_number", "gst_number",
    "licence_expiry", "fire_safety_validity", "insurance_details",
  ];

  const STORE_ALLOW = [
    "code", "name", "type", "description", "ownership_type", "organizationmail",
    "hospital_phone", "alternate_phone", "website", "address", "landmark",
    "area", "city", "district", "state", "country", "pincode",
    "registration_number", "gst_number", "licence_expiry",
  ];

  // Loading & Error UI
  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="loading-container">
          <div className="spinner"></div>
          <h3 className="loading-text">Loading approval requests...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-wrapper">
        <div className="error-container">
          <XCircle size={48} className="error-icon" />
          <h3 className="error-text">{error}</h3>
          <button 
            className="btn primary" 
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper gradient-bg">
      {/* ---------------------------------------------------
           LIST PAGE
      --------------------------------------------------- */}
      {!selected && !loadingDetails && (
        <>
          {/* Header with Stats */}
          <div className="pg-head">
            <h2 className="page-title gradient-text">⚡ Approval Workflow</h2>
            <div className="pg-sub">Review and manage pending requests</div>
            
            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card total">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <div className="stat-value">{stats.total}</div>
                  <div className="stat-label">Total Requests</div>
                </div>
              </div>
              
              <div className="stat-card pending">
                <div className="stat-icon">⏳</div>
                <div className="stat-content">
                  <div className="stat-value">{stats.pending}</div>
                  <div className="stat-label">Pending Review</div>
                </div>
              </div>
              
              <div className="stat-card approved">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <div className="stat-value">{stats.approved}</div>
                  <div className="stat-label">Approved</div>
                </div>
              </div>
              
              <div className="stat-card rejected">
                <div className="stat-icon">❌</div>
                <div className="stat-content">
                  <div className="stat-value">{stats.rejected}</div>
                  <div className="stat-label">Rejected</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="workflow-tabs">
            <button
              className={`tab ${tab === "hospitals" ? "active hospital-tab" : ""}`}
              onClick={() => setTab("hospitals")}
            >
              <div className="tab-content">
                <div className="tab-icon">🏥</div>
                <div className="tab-info">
                  <div className="tab-label">Hospitals</div>
                  <div className="tab-count">{list.hospitals.length} pending</div>
                </div>
              </div>
            </button>

            <button
              className={`tab ${tab === "stores" ? "active store-tab" : ""}`}
              onClick={() => setTab("stores")}
            >
              <div className="tab-content">
                <div className="tab-icon">🏬</div>
                <div className="tab-info">
                  <div className="tab-label">Medical Stores</div>
                  <div className="tab-count">{list.stores.length} pending</div>
                </div>
              </div>
            </button>
          </div>

          {/* Pending List */}
          <div className="workflow-list">
            {(tab === "hospitals" ? list.hospitals : list.stores).length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🎉</div>
                <h3>No Pending Requests</h3>
                <p>All {tab} have been reviewed and processed.</p>
              </div>
            ) : (
              (tab === "hospitals" ? list.hospitals : list.stores).map((item) => (
                <div key={item.id} className="workflow-card">
                  <div className="wf-left">
                    <div className="wf-type-badge">
                      {item.type === "Medician" ? "🏬 Store" : "🏥 Hospital"}
                    </div>
                    <h3>{item.name}</h3>
                    <div className="wf-details">
                      <span className="wf-detail">
                        <MapPin size={14} /> {item.city || "Location not specified"}
                      </span>
                      <span className="wf-detail">
                        <Clock size={14} /> {new Date(item.createdAt || item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="wf-right">
                    <button
                      className="btn view-btn"
                      onClick={() => {
                        setHideLayout(true);
                        setLoadingDetails(true);
                        fetchDetails(item.id);
                      }}
                    >
                      <Eye size={16} />
                      View Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {loadingDetails && (
        <div className="details-loader">
          <div className="spinner"></div>
          <p>Loading details...</p>
        </div>
      )}

      {/* ---------------------------------------------------
           DETAILS PAGE
      --------------------------------------------------- */}
      {selected && (
        <div className="details-page">
          {/* Back Button */}
          <div className="back-row">
            <button
              className="back-btn"
              onClick={() => {
                setSelected(null);
                setHideLayout(false);
              }}
            >
              <ArrowLeft size={18} />
              Back to List
            </button>
          </div>

          <div className="details-card">
            {/* Header */}
            <div className="details-header">
              <div className="org-type">
                {selected.type === "Medician" ? "🏬 Medical Store" : "🏥 Hospital"}
              </div>
              <h2 className="details-title">{selected.name}</h2>
              <div className="org-code">Code: {selected.code || "N/A"}</div>
            </div>

            {/* Owner Details */}
            <div className="section glass-card">
              <h3 className="section-title">
                <div className="title-icon">👤</div>
                Owner Information
              </h3>
              <div className="info-grid">
                {Object.keys(selected)
                  .filter(k => OWNER_ALLOW.includes(k.toLowerCase()))
                  .map((key) => (
                    <div key={key} className="info-item">
                      <label className="info-label">
                        {key.replace("owner_", "").replace(/_/g, " ")}
                      </label>
                      <p className="info-value">
                        {selected[key] || <span className="empty-field">Not provided</span>}
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            {/* Organization Details */}
            <div className="section glass-card">
              <h3 className="section-title">
                <div className="title-icon">
                  {selected.type === "Medician" ? "🏬" : "🏥"}
                </div>
                {selected.type === "Medician" ? "Store Details" : "Hospital Details"}
              </h3>
              <div className="info-grid">
                {Object.keys(selected)
                  .filter(k => 
                    !k.startsWith("owner_") &&
                    k !== "documents" &&
                    k !== "images" &&
                    (selected.type === "Medician" 
                      ? STORE_ALLOW.includes(k.toLowerCase())
                      : HOSPITAL_ALLOW.includes(k.toLowerCase()))
                  )
                  .map((key) => (
                    <div key={key} className="info-item">
                      <label className="info-label">
                        {key.replace(/_/g, " ")}
                      </label>
                      <p className="info-value">
                        {typeof selected[key] === "string" &&
                        (selected[key].startsWith("[") || selected[key].startsWith("{"))
                          ? JSON.parse(selected[key]).toString()
                          : selected[key] || <span className="empty-field">Not provided</span>}
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            {/* Location Map */}
            <div className="section glass-card">
              <h3 className="section-title">
                <div className="title-icon">📍</div>
                Location
              </h3>
              {selected.latitude && selected.longitude ? (
                <div className="map-container">
                  <iframe
                    className="map-frame"
                    loading="lazy"
                    allowFullScreen
                    src={`https://www.google.com/maps?q=${selected.latitude},${selected.longitude}&z=15&output=embed`}
                    title="Location Map"
                  />
                  <div className="map-coordinates">
                    <span>Lat: {selected.latitude}</span>
                    <span>Long: {selected.longitude}</span>
                  </div>
                </div>
              ) : (
                <div className="no-location">
                  <MapPin size={24} />
                  <p>Location coordinates not provided</p>
                </div>
              )}
            </div>

            {/* Images Gallery */}
            <div className="section glass-card">
              <h3 className="section-title">
                <div className="title-icon">🖼️</div>
                Images Gallery
              </h3>
              {selected.images ? (
                <div className="image-grid">
                  {JSON.parse(selected.images).map((img, i) => (
                    <div
                      key={i}
                      className="image-card"
                      onClick={() => setPreviewImage(`data:${img.type};base64,${img.data}`)}
                    >
                      <div className="image-wrapper">
                        <img
                          src={`data:${img.type};base64,${img.data}`}
                          alt={img.name}
                          className="gallery-image"
                        />
                        <div className="image-overlay">
                          <span className="overlay-text">Click to view</span>
                        </div>
                      </div>
                      <div className="image-name">{img.name}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-content">
                  <Image size={24} />
                  <p>No images uploaded</p>
                </div>
              )}
            </div>

            {/* Documents */}
            <div className="section glass-card">
              <h3 className="section-title">
                <div className="title-icon">📄</div>
                Documents
              </h3>
              {selected.documents ? (
                <div className="doc-grid">
                  {JSON.parse(selected.documents).map((doc, i) => (
                    <a
                      key={i}
                      className="doc-card"
                      href={`data:${doc.type};base64,${doc.data}`}
                      download={doc.name}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="doc-icon">
                        <FileText size={20} />
                      </div>
                      <div className="doc-info">
                        <div className="doc-name">{doc.name}</div>
                        <div className="doc-type">{doc.type}</div>
                      </div>
                      <div className="doc-action">
                        <Download size={16} />
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="no-content">
                  <FileText size={24} />
                  <p>No documents uploaded</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="action-section">
              <div className="action-buttons">
                <button
                  className="btn reject-btn"
                  onClick={() => setShowReasonModal(true)}
                  disabled={loadingAction}
                >
                  <XCircle size={18} />
                  Reject Request
                </button>
                
                <button
                  className="btn approve-btn"
                  onClick={() => doAction("approve")}
                  disabled={loadingAction}
                >
                  {loadingAction ? (
                    <>
                      <div className="spinner-small"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      Approve Request
                    </>
                  )}
                </button>
              </div>
              <p className="action-note">
                Review all details carefully before making a decision
              </p>
            </div>
          </div>

          {/* Image Preview Modal */}
          {previewImage && (
            <div className="img-modal" onClick={() => setPreviewImage(null)}>
              <div className="img-modal-content">
                <img src={previewImage} alt="Preview" />
                <button className="close-modal">×</button>
              </div>
            </div>
          )}

          {/* Rejection Reason Modal */}
          {showReasonModal && (
            <div className="reason-modal-overlay">
              <div className="reason-modal">
                <div className="modal-header">
                  <h3>Rejection Reason</h3>
                  <button 
                    className="close-btn"
                    onClick={() => setShowReasonModal(false)}
                  >
                    ×
                  </button>
                </div>
                <div className="modal-body">
                  <p className="modal-text">
                    Please provide a reason for rejecting {selected.name}
                  </p>
                  <textarea
                    className="reason-input"
                    placeholder="Enter detailed reason for rejection..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={4}
                  />
                  <div className="char-count">
                    {rejectReason.length}/500 characters
                  </div>
                </div>
                <div className="modal-actions">
                  <button 
                    className="btn cancel-btn"
                    onClick={() => {
                      setShowReasonModal(false);
                      setRejectReason("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn submit-btn"
                    disabled={!rejectReason.trim() || rejectReason.length > 500}
                    onClick={() => {
                      setShowReasonModal(false);
                      doAction("reject");
                    }}
                  >
                    Submit Rejection
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}