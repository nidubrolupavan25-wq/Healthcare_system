// src/components/onboarding/OnboardingLayout.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import OnboardHeader from "./OnboardHeader";
import OnboardFooter from "./OnboardFooter";
import OnboardProgressBar from "./OnboardProgressBar";
import "./css/OnboardingLayout.css";

const OnboardingLayout = () => {
  const location = useLocation();
  
  // Determine current step from route
  const getCurrentStep = () => {
    const path = location.pathname;
    if (path.includes("/bank") || path.includes("/hospital-details")) return 1;
    if (path.includes("/certifications")) return 2;
    if (path.includes("/images")) return 3;
    if (path.includes("/services")) return 4;
    if (path.includes("/owner")) return 5;
    return 1;
  };

  const currentStep = getCurrentStep();

  return (
    <div className="onboarding-wrapper">
      {/* Floating background elements */}
      <div className="background-elements">
        <div className="bg-circle circle-1"></div>
        <div className="bg-circle circle-2"></div>
        <div className="bg-circle circle-3"></div>
      </div>
      
      {/* Onboarding Header */}
      <OnboardHeader currentStep={currentStep} />

      <main className="onboarding-main">
        {/* Progress Bar */}
        <div className="progress-section">
          <OnboardProgressBar currentStep={currentStep} />
        </div>

        {/* Dynamic page content */}
        <div className="onboarding-content-container">
          <div className="content-card">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Onboarding Footer */}
      <OnboardFooter />
    </div>
  );
};

export default OnboardingLayout;