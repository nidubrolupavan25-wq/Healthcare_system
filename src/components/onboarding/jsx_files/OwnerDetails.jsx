// src/components/onboarding/jsx_files/OwnerDetails.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboarding } from "../context/OnboardingContext";
import "../../onboarding/css/OwnerDetails.css";
import {  HospitalAPI} from "../../../services/api";


const OwnerDetails = () => {
  const { form, updateField } = useOnboarding();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    updateField("ownerName", form.ownerName || "");
    updateField("designation", form.designation || "");
    updateField("ownerEmail", form.ownerEmail || "");
    updateField("ownerPhone", form.ownerPhone || "");
    updateField("ownerAadhar", form.ownerAadhar || "");
    updateField("ownerPAN", form.ownerPAN || "");
    updateField("ownerAddress", form.ownerAddress || "");
  }, []);

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "ownerPAN") value = value.toUpperCase();
    if (name === "ownerAadhar") value = value.replace(/\D/g, "").slice(0, 12);
    if (name === "ownerPhone") value = value.replace(/\D/g, "").slice(0, 10);

    updateField(name, value);
  };

  const validateOwner = () => {
    if (!form.ownerName || form.ownerName.trim().length < 3)
      return alert("Please enter owner full name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.ownerEmail))
      return alert("Enter valid email");
    if (!/^\d{10}$/.test(String(form.ownerPhone)))
      return alert("Enter valid 10-digit mobile");
    if (!/^\d{12}$/.test(String(form.ownerAadhar)))
      return alert("Enter valid 12-digit Aadhar");
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.ownerPAN))
      return alert("Enter valid PAN");
    if (!form.ownerAddress || form.ownerAddress.trim().length < 10)
      return alert("Enter valid address");
    return true;
  };

  const goPrev = () => navigate("/onboarding/services");

  const handleSubmit = async () => {
    if (!validateOwner()) return;

    const organizationId = form.hospitalId;
    if (!organizationId) {
      alert("Hospital ID missing. Complete previous page.");
      navigate("/onboarding/services");
      return;
    }

    setSubmitting(true);

    const payload = {
      name: form.ownerName,
      mobile: String(form.ownerPhone),
      email: form.ownerEmail,
      adhar: String(form.ownerAadhar),
      address: form.ownerAddress,
      department: form.departments?.[0] || "Administration",
      role: "Owner",
      designation: form.designation || "Owner",
      organizationId: Number(organizationId),
      pan: form.ownerPAN,
      salary: null,
      joiningDate: new Date().toISOString().slice(0, 10),
      timings: "9AM - 6PM",
      password: "HSPL-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
      twoFactAuthentication: 1,
    };

    try {
      // 👇 API call from api.js
      await  HospitalAPI.saveOwner(payload);

      alert("Owner Registered Successfully!");
      navigate("/onboarding/review");
    } catch (err) {
      alert("Submission failed: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="owner-form-container">
      <h2 className="form-title">👤 Owner / Admin Details</h2>
      <p className="info-text">
        Please provide the primary owner's information for verification.
      </p>

      {!form.hospitalId && (
        <div className="warning-box">
          ⚠️ Hospital ID missing. Complete previous steps.
        </div>
      )}

      <div className="form-grid-2">
        <div className="form-group">
          <label>Owner Full Name *</label>
          <input
            type="text"
            name="ownerName"
            placeholder="Ravi Kumar"
            value={form.ownerName || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Designation *</label>
          <input
            type="text"
            name="designation"
            placeholder="Owner / Director"
            value={form.designation || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            name="ownerEmail"
            placeholder="owner@example.com"
            value={form.ownerEmail || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Mobile Number *</label>
          <input
            type="text"
            name="ownerPhone"
            maxLength="10"
            placeholder="9876543210"
            value={form.ownerPhone || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Aadhar Number *</label>
          <input
            type="text"
            name="ownerAadhar"
            maxLength="12"
            placeholder="12-digit Aadhar"
            value={form.ownerAadhar || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>PAN Number *</label>
          <input
            type="text"
            name="ownerPAN"
            maxLength="10"
            placeholder="ABCDE1234F"
            value={form.ownerPAN || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group full-width">
        <label>Owner Address *</label>
        <textarea
          name="ownerAddress"
          rows="3"
          placeholder="Full owner address"
          value={form.ownerAddress || ""}
          onChange={(e) => updateField("ownerAddress", e.target.value)}
        />
      </div>

      <div className="nav-buttons">
        <button className="btn-prev" onClick={goPrev}>⬅ Previous</button>
        <button
          className="btn-next"
          onClick={handleSubmit}
          disabled={submitting || !form.hospitalId}
        >
          {submitting ? "Submitting..." : "Submit ➤"}
        </button>
      </div>
    </div>
  );
};

export default OwnerDetails;
