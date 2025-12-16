// src/components/onboarding/OnboardHeader.jsx
import React from "react";
import "./css/OnboardHeader.css";
import { Hospital } from "lucide-react";

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
      <div className="header-container">
        <div className="header-left">
          <div className="logo-wrapper">
            <Hospital size={28} className="logo-icon" />
            <h1 className="header-title">MediConnect</h1>
          </div>
          <div className="header-tagline">Hospital Management System</div>
        </div>
        
        <div className="header-right">
          <div className="step-indicator">
            <span className="step-number">Step {currentStep}</span>
            <span className="step-total">of 5</span>
          </div>
          <div className="step-name">{stepNames[currentStep - 1]}</div>
        </div>
      </div>
      
      <div className="header-progress">
        <div 
          className="progress-fill" 
          style={{ width: `${(currentStep / 5) * 100}%` }}
        ></div>
      </div>
    </header>
  );
};

export default OnboardHeader;