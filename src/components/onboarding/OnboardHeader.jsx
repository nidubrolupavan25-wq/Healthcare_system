// src/components/onboarding/OnboardHeader.jsx

import React from "react";
import "./css/OnboardHeader.css";

const OnboardHeader = ({ currentStep }) => {
  const stepNames = [
    "Hospital Details",
    "Certifications",
    "Images",
    "Services",
    "Owner Details",
  ];

  return (
    <header className="onboard-header">
      <div className="container">
        <h1 className="header-title">Hospital Onboarding</h1>
        <p className="header-sub">
          Step {currentStep} of 5 — {stepNames[currentStep - 1]}
        </p>
      </div>
    </header>
  );
};

export default OnboardHeader;
