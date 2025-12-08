// src/components/onboarding/jsx_files/Services.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboarding } from "../context/OnboardingContext";
import "../../onboarding/css/Services.css";
import { HospitalAPI } from "../../../services/api";



const DEPARTMENTS = [
  "Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Gynecology",
  "General Surgery", "ENT", "Dermatology", "Ophthalmology", "Dentistry",
  "Psychiatry", "Radiology", "Pathology", "Urology", "Nephrology",
  "Pulmonology", "Gastroenterology"
];

const SERVICES = [
  "X-Ray", "CT Scan", "MRI", "Blood Test", "ICU Care",
  "Operation Theatre", "Ventilator Support", "Dialysis Unit"
];

const FACILITIES = [
  "24x7 Pharmacy", "Parking", "Cafeteria", "Online Appointments",
  "Ambulance Service", "Blood Bank"
];

const MEDICIAN_SERVICES = [
  "Prescription Medicines",
  "OTC Medicines",
  "Baby Care Products",
  "Health Supplements",
  "Home Delivery",
  "Vaccination Support",
  "Diagnostic Test Kits",
  "First Aid Supplies",
  "Medical Equipment Rental"
];

const MEDICIAN_FACILITIES = [
  "24x7 Medicine Availability",
  "Free Home Delivery",
  "Phone Ordering",
  "Digital Payment",
  "Instant Billing"
];

const Services = () => {
  const { form, updateField, setHospitalId } = useOnboarding();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const safe = (v, fallback) =>
    v === undefined || v === null || v === "" ? fallback : v;

  const toggleItem = (field, value) => {
    const current = form[field] || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    updateField(field, updated);
  };

  const validate = () => {
    if (form.onboardingType === "Hospital") {
      if (!form.departments || form.departments.length === 0) {
        alert("Please select at least one hospital department");
        return false;
      }
    }

    if (!form.name || !form.organizationMail || !form.hospital_phone) {
      alert("Please complete basic details first");
      return false;
    }

    return true;
  };

  const submitHospital = async () => {
    if (!validate()) return null;
    setSubmitting(true);

    try {
      const fd = new FormData();

      const hospitalJson = {
        type: safe(form.onboardingType, "Hospital"),
        code: safe(form.code, `HSP${Math.floor(1000 + Math.random() * 9000)}`),
        name: safe(form.name, ""),
        tagline: safe(form.type, "Hospital"),
        description: safe(form.description, ""),
        established_year: Number(safe(form.established_year, 0)),
        ownership_type: safe(form.ownership_type, "Private"),
        organizationMail: safe(form.organizationMail, ""),
        hospital_phone: safe(form.hospital_phone, ""),
        alternate_phone: safe(form.alternate_phone, ""),
        website: safe(form.website, ""),
        address: safe(form.address, ""),
        landmark: safe(form.landmark, ""),
        area: safe(form.area, ""),
        city: safe(form.city, ""),
        district: safe(form.district, ""),
        state: safe(form.state, ""),
        country: safe(form.country, "India"),
        pincode: safe(form.pincode, ""),

        latitude: Number(safe(form.latitude, 0)),
        longitude: Number(safe(form.longitude, 0)),
        geofence_radius: Number(safe(form.geofence_radius, 500)),
        location_accuracy: safe(form.location_accuracy, "high"),

        total_beds: Number(safe(form.total_beds, 0)),
        icu_beds: Number(safe(form.icu_beds, 0)),
        emergency_beds: Number(safe(form.emergency_beds, 0)),
        operation_theatres: Number(safe(form.operation_theatres, 0)),
        ventilators: Number(safe(form.ventilators, 0)),
        ambulances: Number(safe(form.ambulances, 0)),

        departments: form.departments || [],
        services: form.services || [],
        facilities: form.facilities || [],

        status: "pending",
        onboarding_stage: 2,
      };

      fd.append("hospital", JSON.stringify(hospitalJson));

      // Images
      if (form.images) {
        Object.values(form.images).forEach((e) => {
          if (e?.file) fd.append("images", e.file);
        });
      }

      // Documents
      if (form.certifications) {
        Object.values(form.certifications).forEach((e) => {
          if (e?.file) fd.append("documents", e.file);
        });
      }

      // 👇 API call from api.js
      const { data } = await HospitalAPI.createHospital(fd);

      const hospitalId = data?.id || data?.hospitalId || data?.data?.id;

      if (!hospitalId) {
        alert("Hospital created but ID missing.");
        return null;
      }

      setHospitalId(hospitalId);
      alert("Hospital Details Saved!");

      return hospitalId;
    } catch (err) {
      alert("Error: " + err.message);
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  const goNext = async () => {
    const hospitalId = await submitHospital();
    if (hospitalId) navigate("/onboarding/owner");
  };

  const goPrev = () => navigate("/onboarding/images");

  return (
    <div className="services-container">
      <h2 className="form-title">
        {form.onboardingType === "Hospital"
          ? "🥼 Hospital Services & Departments"
          : "💊 Medician Services"}
      </h2>

      {/* ---------------- HOSPITAL ONLY ---------------- */}
      {form.onboardingType === "Hospital" && (
        <>
          <h3 className="section-title">Select Hospital Departments *</h3>
          <div className="options-grid">
            {DEPARTMENTS.map(d => (
              <label key={d} className="option-item">
                <input
                  type="checkbox"
                  checked={form.departments.includes(d)}
                  onChange={() => toggleItem("departments", d)}
                />
                {d}
              </label>
            ))}
          </div>

          <h3 className="section-title">Available Medical Services</h3>
          <div className="options-grid">
            {SERVICES.map(s => (
              <label key={s} className="option-item">
                <input
                  type="checkbox"
                  checked={form.services.includes(s)}
                  onChange={() => toggleItem("services", s)}
                />
                {s}
              </label>
            ))}
          </div>

          <h3 className="section-title">Additional Hospital Facilities</h3>
          <div className="options-grid">
            {FACILITIES.map(f => (
              <label key={f} className="option-item">
                <input
                  type="checkbox"
                  checked={form.facilities.includes(f)}
                  onChange={() => toggleItem("facilities", f)}
                />
                {f}
              </label>
            ))}
          </div>
        </>
      )}

      {/* ---------------- MEDICIAN ONLY ---------------- */}
      {form.onboardingType === "Medician" && (
        <>
          <h3 className="section-title">Medician Services *</h3>
          <div className="options-grid">
            {MEDICIAN_SERVICES.map(s => (
              <label key={s} className="option-item">
                <input
                  type="checkbox"
                  checked={form.services.includes(s)}
                  onChange={() => toggleItem("services", s)}
                />
                {s}
              </label>
            ))}
          </div>

          <h3 className="section-title">Medician Facilities</h3>
          <div className="options-grid">
            {MEDICIAN_FACILITIES.map(f => (
              <label key={f} className="option-item">
                <input
                  type="checkbox"
                  checked={form.facilities.includes(f)}
                  onChange={() => toggleItem("facilities", f)}
                />
                {f}
              </label>
            ))}
          </div>
        </>
      )}

      <div className="nav-buttons">
        <button className="btn-prev" onClick={goPrev}>⬅ Previous</button>
        <button className="btn-next" onClick={goNext} disabled={submitting}>
          {submitting ? "Submitting..." : "Next ➡"}
        </button>
      </div>
    </div>
  );
};

export default Services;
