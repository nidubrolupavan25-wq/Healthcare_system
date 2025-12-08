// src/components/onboarding/jsx_files/Images.jsx
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboarding } from "../context/OnboardingContext";
import "../../onboarding/css/Images.css";

const Images = () => {
  const { form, updateField } = useOnboarding();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const currentFieldRef = useRef(null);

  // 🔥 Dynamic fields for hospital or medician
  const IMAGE_FIELDS =
    form.onboardingType === "Medician"
      ? [
          { key: "profilePhoto", label: "Medician Profile Photo", required: true },
          { key: "licenseImage", label: "License / Certification Image", required: true },
          { key: "clinicFront", label: "Clinic / Medical Store Front View", required: false },
          { key: "clinicInside", label: "Inside Clinic / Store", required: false },
          { key: "idProof", label: "Aadhaar / ID Proof", required: false }
        ]
      : [
          { key: "frontView", label: "Hospital Front View", required: true },
          { key: "reception", label: "Reception Area", required: true },
          { key: "wardRoom", label: "General Ward / Rooms", required: true },
          { key: "icu", label: "ICU / Critical Care Unit", required: false },
          { key: "operationTheatre", label: "Operation Theatre", required: false },
          { key: "pharmacy", label: "Pharmacy Area", required: false },
          { key: "sideBuilding", label: "Building Side View", required: false },
          { key: "staffGroup", label: "Staff Group Photo", required: false }
        ];

  // OPEN FILE SELECTOR
  const openFileSelector = (fieldKey) => {
    currentFieldRef.current = { fieldKey };
    fileInputRef.current.accept = "image/*";
    fileInputRef.current.click();
  };

  // ON FILE SELECTED
  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = file.type.startsWith("image/")
      ? URL.createObjectURL(file)
      : null;

    const { fieldKey } = currentFieldRef.current;

    const updatedImages = {
      ...(form.images || {}),
      [fieldKey]: { file, previewUrl, fileName: file.name }
    };

    updateField("images", updatedImages);

    e.target.value = "";
  };

  // VALIDATION
  const validateRequired = () => {
    const missingImages = IMAGE_FIELDS.filter(
      (img) => img.required && !form.images?.[img.key]
    );

    if (missingImages.length) {
      alert(
        "Please upload required images:\n\n" +
          missingImages.map((i) => "• " + i.label).join("\n")
      );
      return false;
    }
    return true;
  };

  // NEXT (NO API NOW)
  const goNext = () => {
    if (!validateRequired()) return;

    // Both Hospital & Medician go to same next page
    navigate("/onboarding/services");
  };

  const goPrev = () => navigate("/onboarding/certifications");

  return (
    <div className="images-container">
      <h2 className="form-title">📸 Upload Images</h2>

      <input
        ref={fileInputRef}
        type="file"
        style={{ display: "none" }}
        onChange={onFileChange}
      />

      <div className="image-grid">
        {IMAGE_FIELDS.map((img) => {
          const uploaded = form.images?.[img.key];
          return (
            <div key={img.key} className="image-card">
              <div className="image-label">
                <strong>{img.label}</strong>
                {img.required && <span className="required-tag">Required</span>}
              </div>

              {uploaded?.previewUrl ? (
                <img
                  src={uploaded.previewUrl}
                  alt={img.label}
                  className="image-preview"
                />
              ) : (
                <div className="image-placeholder">No image uploaded</div>
              )}

              <button
                className="upload-btn"
                onClick={() => openFileSelector(img.key)}
              >
                {uploaded ? "Replace Image" : "Upload Image"}
              </button>
            </div>
          );
        })}
      </div>

      <div className="nav-buttons" style={{ marginTop: 20 }}>
        <button className="btn-prev" onClick={goPrev}>
          ⬅ Previous
        </button>

        <button className="btn-next" onClick={goNext}>
          Next ➡
        </button>
      </div>
    </div>
  );
};

export default Images;
