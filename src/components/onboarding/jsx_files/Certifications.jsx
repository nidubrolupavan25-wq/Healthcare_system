// src/components/onboarding/jsx_files/Certifications.jsx

import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboarding } from "../context/OnboardingContext";
import "../../onboarding/css/Certifications.css";

// --------------------
// Hospital Certificate Fields
// --------------------
const HOSPITAL_CERTIFICATE_FIELDS = [
  { key: "hospitalRegistration", label: "Hospital Registration Certificate", required: true },
  { key: "gstCertificate", label: "GST Registration Certificate", required: true },
  { key: "fireNOC", label: "Fire Safety Certificate (NOC)", required: false },
  { key: "nabhCertificate", label: "NABH / NABL Accreditation", required: false },
  { key: "biomedicalWasteCert", label: "Biomedical Waste Authorization", required: false },
  { key: "pharmacyLicense", label: "Pharmacy License", required: false },
  { key: "bankProof", label: "Cancelled Cheque / Bank Statement", required: false }
];

// --------------------
// Medician Certificate Fields
// --------------------
const MEDICIAN_CERTIFICATE_FIELDS = [
  { key: "drugLicenseNumber", label: "Drug License Number", required: true },
  { key: "drugLicenseCert", label: "Drug License Certificate", required: true },
  { key: "pharmacyRegNumber", label: "Pharmacy Registration Number", required: false },
  { key: "pharmacyRegCert", label: "Pharmacy Registration Certificate", required: false },
  { key: "gstCertMed", label: "GST Certificate", required: false },
  { key: "shopEstCert", label: "Shop Establishment Certificate", required: false },
  { key: "storePhoto", label: "Medical Store Photo", required: false }
];

const Certifications = () => {
  const { form, updateField } = useOnboarding();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const currentKeyRef = useRef(null);

  const onboardingType = form.onboardingType; // Hospital / Medician
  const [files, setFiles] = useState(form.certifications || {});

  // Sync with global context
  useEffect(() => {
    updateField("certifications", files);
  }, [files]);

  // Allowed file types (Only documents)
  const fileTypes =
    ".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.ppt,.pptx,.rtf";

  const openFileSelector = (key) => {
    currentKeyRef.current = key;
    fileInputRef.current.accept = fileTypes;
    fileInputRef.current.click();
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFiles({
      ...files,
      [currentKeyRef.current]: {
        file,
        fileName: file.name
      }
    });

    e.target.value = "";
  };

  // Validate required certifications
  const validateRequired = () => {
    const selectedFields =
      onboardingType === "Medician"
        ? MEDICIAN_CERTIFICATE_FIELDS
        : HOSPITAL_CERTIFICATE_FIELDS;

    const missing = selectedFields.filter(
      (f) => f.required && !files[f.key]
    );

    if (missing.length) {
      alert(
        "Please upload required certificates:\n\n" +
          missing.map((m) => "• " + m.label).join("\n")
      );
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateRequired()) return;

    navigate("/onboarding/images");
  };

  const CERTIFICATE_FIELDS =
    onboardingType === "Medician"
      ? MEDICIAN_CERTIFICATE_FIELDS
      : HOSPITAL_CERTIFICATE_FIELDS;

  return (
    <div className="images-container">
      <h2 className="form-title">📄 Certifications</h2>
      <p className="small-info">
        Document Upload (PDF / Word / Excel / Text)
      </p>

      <input
        ref={fileInputRef}
        type="file"
        style={{ display: "none" }}
        onChange={onFileChange}
      />

      <div className="image-grid">
        {CERTIFICATE_FIELDS.map((cert) => {
          const uploaded = files[cert.key];

          return (
            <div key={cert.key} className="image-card">
              <div className="image-label">
                <strong>{cert.label}</strong>
                {cert.required && (
                  <span className="required-tag">Required</span>
                )}
              </div>

              {/* DOCUMENT DISPLAY */}
              {uploaded?.fileName ? (
                <div className="file-box">
                  <span className="file-icon">📄</span>
                  <span className="file-name">{uploaded.fileName}</span>
                </div>
              ) : (
                <div className="image-placeholder">No file uploaded</div>
              )}

              <button
                className="upload-btn"
                onClick={() => openFileSelector(cert.key)}
              >
                {uploaded ? "Replace Document" : "Upload Document"}
              </button>
            </div>
          );
        })}
      </div>

      <div className="nav-buttons" style={{ marginTop: 20 }}>
        <button className="btn-prev" onClick={() => navigate("/onboarding")}>
          ⬅ Back
        </button>

        <button className="btn-next" onClick={handleNext}>
          Next ➜
        </button>
      </div>
    </div>
  );
};

export default Certifications;
