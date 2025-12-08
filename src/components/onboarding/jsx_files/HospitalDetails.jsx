// src/components/onboarding/jsx_files/HospitalDetails.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboarding } from "../context/OnboardingContext";
import "../../onboarding/css/HospitalDetails.css";

const INDIAN_CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai",
  "Kolkata", "Surat", "Pune", "Jaipur", "Vijayawada", "Visakhapatnam",
  "Guntur", "Nellore", "Tirupati", "Rajahmundry", "Kakinada",
  "Warangal", "Nizamabad"
];

const INDIAN_STATES = [
  "Andhra Pradesh", "Telangana", "Karnataka", "Tamil Nadu",
  "Kerala", "Maharashtra", "Gujarat", "Rajasthan", "Delhi", "West Bengal"
];

const HospitalDetails = () => {
  const navigate = useNavigate();
  const { form, updateField } = useOnboarding();

  const [cityInput, setCityInput] = useState(form.city || "");
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // NEW: onboarding type (hospital / medician)
  const [onboardingType, setOnboardingType] = useState(form.onboardingType || "Hospital");

  // Load previous values
  useEffect(() => {
    Object.keys(form).forEach((key) => {
      updateField(key, form[key] || "");
    });
  }, []);

  // CITY CHANGE
  const handleCityChange = (e) => {
    const value = e.target.value;
    setCityInput(value);
    updateField("city", value);

    if (value.length > 1) {
      const filtered = INDIAN_CITIES.filter((c) =>
        c.toLowerCase().includes(value.toLowerCase())
      );
      setCitySuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectCity = (city) => {
    setCityInput(city);
    updateField("city", city);
    setShowSuggestions(false);
  };

  // GPS
  const handleGetLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);

        updateField("latitude", lat);
        updateField("longitude", lng);

        fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        )
          .then((res) => res.json())
          .then((data) => {
            if (data?.address) {
              updateField(
                "address",
                data.display_name?.split(", ").slice(0, 4).join(", ")
              );
              updateField("city", data.address.city || data.address.town || "");
              updateField("state", data.address.state || "");
              updateField("pincode", data.address.postcode || "");
              setCityInput(data.address.city || "");
            }
            alert("✔ Location captured successfully.");
          })
          .catch(() => alert("Could not fetch address details"));
      },
      () => { },
      { enableHighAccuracy: true }
    );
  };

  // VALIDATION
  const validate = () => {
    if (!form.name?.trim()) return alert("Name required");
    if (!form.organizationMail) return alert("Email required");

    if (!/^\d{10}$/.test(String(form.hospital_phone)))
      return alert("Enter valid 10-digit phone");

    if (!form.address?.trim()) return alert("Address required");
    if (!form.city?.trim()) return alert("City required");
    if (!form.state?.trim()) return alert("State required");

    return true;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!validate()) return;

    updateField("onboardingType", onboardingType);

    navigate("/onboarding/certifications");
  };



  return (
    <div className="form-card">

      {/* NEW TYPE SWITCH */}
      <h3 className="section-title">Select Onboarding Type</h3>

      <Select
        label="Onboarding Type"
        value={onboardingType}
        onChange={(e) => {
          const type = e.target.value;
          setOnboardingType(type);

          // Update form.type so backend receives correct value
          updateField("onboardingType", type);

          // Auto-set code prefix
          if (type === "Hospital") updateField("code", "HSP001");
          else updateField("code", "MDC001");
        }}
        options={["Hospital", "Medician"]}
      />


      <h3 className="section-title">Basic Info</h3>

      <div className="form-grid-4">
        {/* CODE */}
        <Input
          label={onboardingType === "Hospital" ? "Hospital Code" : "Medician Code"}
          value={form.code}
          onChange={(e) => updateField("code", e.target.value)}
        />

        {/* NAME */}
        <Input
          label={onboardingType === "Hospital" ? "Hospital Name *" : "Medician Name *"}
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
        />

        {/* TYPE (Hide in medician mode) */}
        {onboardingType === "Hospital" && (
          <Select
            label="Tagline*"
            value={form.type}
            onChange={(e) => updateField("type", e.target.value)}
            options={[
              "Multi-Specialty",
              "Super Specialty",
              "General Hospital",
              "Clinic",
              "Nursing Home",
            ]}
          />
        )}
      </div>

      {/* DESCRIPTION (Hide in medician mode) */}
      {onboardingType === "Hospital" && (
        <div className="input-full">
          <textarea
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Hospital description"
          />
        </div>
      )}

      {/* Remaining fields same for hospital & medician */}
      <h3 className="section-title">Contact Information</h3>
      <div className="form-grid-3">
        <Input label="Email Address *" value={form.organizationMail} onChange={(e) => updateField("organizationMail", e.target.value)} />
        <Input
          label="Contact Number *"
          maxLength="10"
          value={form.hospital_phone}
          onChange={(e) => {
            let value = e.target.value.replace(/\D/g, ""); // allow only digits

            // Ensure number starts with 6, 7, 8, or 9
            if (value.length === 1 && !/[6-9]/.test(value)) {
              return; // prevent invalid first digit
            }

            updateField("hospital_phone", value);
          }}
        />
        <Input label="Alternate Phone" maxLength="10" value={form.alternate_phone} onChange={(e) => updateField("alternate_phone", e.target.value.replace(/\D/g, ""))} />
      </div>

      <h3 className="section-title">Address & Location</h3>
      <div style={{ marginTop: 12 }}>
        <button className="gps-btn" onClick={handleGetLocation}>📍 Capture My Hospital Location</button>
      </div>

      <div className="form-grid-3" style={{ marginTop: 12 }}>
        <Input label="Latitude" value={form.latitude} readOnly />
        <Input label="Longitude" value={form.longitude} readOnly />
      </div>


      <div className="input-full">
        <textarea value={form.address} onChange={(e) => updateField("address", e.target.value)} placeholder="Street address" />
      </div>

      <div className="form-grid-3">
        <Input label="Landmark" value={form.landmark} onChange={(e) => updateField("landmark", e.target.value)} />
        <Input label="Area" value={form.area} onChange={(e) => updateField("area", e.target.value)} />
        <Input label="District" value={form.district} onChange={(e) => updateField("district", e.target.value)} />
      </div>

      <div className="form-grid-3">
        <div className="input-wrapper" style={{ position: "relative" }}>

          {/* Label moved to top */}
          <label>City *</label>

          {/* Input moved below, placeholder added */}
          <input
            type="text"
            value={cityInput}
            onChange={handleCityChange}
            onFocus={() => setShowSuggestions(true)}
            placeholder="City *"
          />

          {showSuggestions && citySuggestions.length > 0 && (
            <ul className="city-suggestions">
              {citySuggestions.map((city, i) => (
                <li key={i} onClick={() => selectCity(city)}>{city}</li>
              ))}
            </ul>
          )}

        </div>

        <Select label="State *" value={form.state} onChange={(e) => updateField("state", e.target.value)} options={INDIAN_STATES} />

        <Input label="Pincode" value={form.pincode} onChange={(e) => updateField("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))} />
      </div>

      <div className="form-grid-3">
        <Input label="Country" value={form.country} readOnly />
        <Input label="Google Place ID" value={form.google_place_id} onChange={(e) => updateField("google_place_id", e.target.value)} />
        <Input label="Google Map Link" value={form.google_map_link} onChange={(e) => updateField("google_map_link", e.target.value)} />
      </div>

      {/* HIDE capacity section in medician */}
      {onboardingType === "Hospital" && (
        <>
          <h3 className="section-title">Capacity</h3>
          <div className="form-grid-3">
            <Input label="Total Beds" type="number" value={form.total_beds} onChange={(e) => updateField("total_beds", e.target.value)} />
            <Input label="ICU Beds" type="number" value={form.icu_beds} onChange={(e) => updateField("icu_beds", e.target.value)} />
            <Input label="Emergency Beds" type="number" value={form.emergency_beds} onChange={(e) => updateField("emergency_beds", e.target.value)} />
          </div>
        </>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
        <button className="next-btn" onClick={handleNext}>Next ➡</button>
      </div>
    </div>
  );
};

const Input = ({ label, ...props }) => (
  <div className="input-wrapper" style={{ display: "flex", flexDirection: "column" }}>
    <label style={{ marginBottom: "6px", fontWeight: "500" }}>{label}</label>
    <input {...props} className="input-box" />
  </div>
);


const Select = ({ label, options, ...props }) => (
  <div className="input-wrapper" style={{ display: "flex", flexDirection: "column" }}>
    <label style={{ marginBottom: "6px", fontWeight: "500" }}>{label}</label>
    <select {...props} className="select-box">
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);


export default HospitalDetails;
