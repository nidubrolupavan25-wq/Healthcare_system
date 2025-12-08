// src/components/onboarding/context/OnboardingContext.js
import React, { createContext, useContext, useState } from "react";

const OnboardingContext = createContext();

export const OnboardingProvider = ({ children }) => {
  const [form, setForm] = useState({

    // HOSPITAL DETAILS
    code: "",
    name: "",
    type: "",
    tagline: "",
    description: "",
    established_year: 0,
    ownership_type: "",
    registration_number: "",
    gst_number: "",
    licence_expiry: "",
    fire_safety_validity: "",
    insurance_details: "",
    hospital_email: "",
    hospital_phone: "",
    alternate_phone: "",
    website: "",
    address: "",
    landmark: "",
    area: "",
    city: "",
    district: "",
    state: "",
    country: "India",
    pincode: "",
    latitude: "0",
    longitude: "0",
    geofence_radius: "500",
    location_accuracy: "high",
    google_place_id: "",
    google_map_link: "",
    total_beds: 0,
    icu_beds: 0,
    emergency_beds: 0,
    operation_theatres: 0,
    ventilators: 0,
    ambulances: 0,

    // OWNER DETAILS
    ownerName: "",
    designation: "",
    ownerEmail: "",
    ownerPhone: "",
    ownerAadhar: "",
    ownerPAN: "",
    ownerAddress: "",

    // SERVICES & DEPARTMENTS
    departments: [],
    services: [],
    facilities: [],

    // FILES
    images: {},
    documents: {},

    // METADATA (DEFAULTS ADDED)
    status: "pending",
    verification_level: "none",
    onboarding_stage: 1,
    rejection_reason: "",
    rating: 0,
    rating_count: 0,
    views: 0,
    profile_completion: 0,
    submitted_at: new Date().toISOString(),
    last_login_at: new Date().toISOString(),
    ip_address: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),

    // STORE HOSPITAL ID AFTER CREATION
    hospitalId: null,
  });

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const setHospitalId = (id) => {
    setForm((prev) => ({ ...prev, hospitalId: id }));
  };

  const toggleArrayItem = (field, value) => {
    setForm((prev) => {
      const arr = prev[field] || [];
      return {
        ...prev,
        [field]: arr.includes(value)
          ? arr.filter((i) => i !== value)
          : [...arr, value],
      };
    });
  };

  return (
    <OnboardingContext.Provider
      value={{
        form,
        updateField,
        setHospitalId,
        toggleArrayItem,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => useContext(OnboardingContext);
