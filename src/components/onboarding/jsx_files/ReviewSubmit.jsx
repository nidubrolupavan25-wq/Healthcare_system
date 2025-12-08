// src/components/onboarding/jsx_files/ReviewSubmit.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { useOnboarding } from "../context/OnboardingContext";
import "../../onboarding/css/ReviewSubmit.css";

const ReviewSubmit = () => {
  const { form } = useOnboarding();
  const navigate = useNavigate();

  return (
    <div className="review-container">
      <h2 className="form-title">📋 Review Your Information</h2>

      <p className="review-note">Your submission has been recorded successfully.</p>

      {/* HOSPITAL DETAILS */}
      <div className="review-section">
        <h3>🏥 Hospital Information</h3>

        <div className="review-row">
          <strong>Hospital Code:</strong>
          <span>{form.code || "—"}</span>
        </div>

        <div className="review-row">
          <strong>Name:</strong>
          <span>{form.name || "—"}</span>
        </div>

        <div className="review-row">
          <strong>Type:</strong>
          <span>{form.type || "—"}</span>
        </div>

        <div className="review-row">
          <strong>Email:</strong>
          <span>{form.hospital_email || "—"}</span>
        </div>

        <div className="review-row">
          <strong>Contact:</strong>
          <span>{form.hospital_phone || "—"}</span>
        </div>

        <div className="review-row">
          <strong>Address:</strong>
          <span>{form.address || "—"}</span>
        </div>

        <div className="review-row">
          <strong>City:</strong>
          <span>{form.city || "—"}</span>
        </div>

        <div className="review-row">
          <strong>State:</strong>
          <span>{form.state || "—"}</span>
        </div>

        <div className="review-row">
          <strong>Pincode:</strong>
          <span>{form.pincode || "—"}</span>
        </div>

        <div className="review-row">
          <strong>Total Beds:</strong>
          <span>{form.total_beds || "0"}</span>
        </div>

        <div className="review-row">
          <strong>ICU Beds:</strong>
          <span>{form.icu_beds || "0"}</span>
        </div>
      </div>

      {/* OWNER INFORMATION */}
      <div className="review-section">
        <h3>👤 Owner Information</h3>

        <div className="review-row">
          <strong>Name:</strong>
          <span>{form.ownerName || "—"}</span>
        </div>

        <div className="review-row">
          <strong>Designation:</strong>
          <span>{form.designation || "—"}</span>
        </div>

        <div className="review-row">
          <strong>Email:</strong>
          <span>{form.ownerEmail || "—"}</span>
        </div>

        <div className="review-row">
          <strong>Phone:</strong>
          <span>{form.ownerPhone || "—"}</span>
        </div>

        <div className="review-row">
          <strong>Aadhar:</strong>
          <span>{form.ownerAadhar || "—"}</span>
        </div>

        <div className="review-row">
          <strong>PAN:</strong>
          <span>{form.ownerPAN || "—"}</span>
        </div>

        <div className="review-row">
          <strong>Address:</strong>
          <span>{form.ownerAddress || "—"}</span>
        </div>
      </div>

      {/* SERVICES */}
      <div className="review-section">
        <h3>🩺 Departments / Services / Facilities</h3>

        <div className="review-row">
          <strong>Departments:</strong>
          <span>{(form.departments || []).join(", ") || "None"}</span>
        </div>

        <div className="review-row">
          <strong>Services:</strong>
          <span>{(form.services || []).join(", ") || "None"}</span>
        </div>

        <div className="review-row">
          <strong>Facilities:</strong>
          <span>{(form.facilities || []).join(", ") || "None"}</span>
        </div>
      </div>

      {/* FILES */}
      <div className="review-section">
        <h3>📸 Uploaded Files</h3>

        {form.images && Object.keys(form.images).length > 0 ? (
          Object.entries(form.images).map(([key, val]) => (
            <div key={key} className="review-row">
              <strong>{key}:</strong>
              <span>{val.fileName || "Image uploaded"}</span>
            </div>
          ))
        ) : (
          <p>No images uploaded</p>
        )}

        {form.documents && Object.keys(form.documents).length > 0 ? (
          Object.entries(form.documents).map(([key, val]) => (
            <div key={key} className="review-row">
              <strong>{key}:</strong>
              <span>{val.fileName || "Document uploaded"}</span>
            </div>
          ))
        ) : (
          <p>No certificates uploaded</p>
        )}
      </div>

      {/* SUCCESS BOX */}
      {form.hospitalId && (
        <div
          className="success-box"
          style={{
            background: "#d4edda",
            border: "1px solid #28a745",
            padding: "16px",
            borderRadius: "8px",
            marginTop: "20px"
          }}
        >
          <h4 style={{ margin: "0 0 8px 0", color: "#155724" }}>
            ✅ All Steps Completed!
          </h4>
          <p style={{ margin: 0, color: "#155724" }}>
            Hospital ID: <strong>{form.hospitalId}</strong>
          </p>
          <p style={{ margin: "8px 0 0 0", color: "#155724" }}>
            Your onboarding request has been submitted successfully.
          </p>
        </div>
      )}

      <div className="submit-buttons" style={{ marginTop: "20px" }}>
        <button className="btn-submit" onClick={() => navigate("/")}>
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default ReviewSubmit;
