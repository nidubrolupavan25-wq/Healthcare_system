// src/components/onboarding/OnboardProgressBar.jsx

import React from "react";
import "./css/OnboardProgressBar.css";
import { Building2, FileCheck, Image, Stethoscope, UserRound } from "lucide-react";


const OnboardProgressBar = ({ currentStep }) => {
  const steps = [
  { id: 1, label: "Details", icon: <Building2 size={22} /> },
  { id: 2, label: "Certifications", icon: <FileCheck size={22} /> },
  { id: 3, label: "Images", icon: <Image size={22} /> },
  { id: 4, label: "Services", icon: <Stethoscope size={22} /> },
  { id: 5, label: "Owner Details", icon: <UserRound size={22} /> },
];

  return (
    <div className="progress-wrapper">

      {/* <h2 className="progress-title">Onboarding Progress</h2> */}

      <div className="progress-container">
        {steps.map((step, index) => (
          <div key={step.id} className="progress-step">

            <div
              className={`step-circle ${
                currentStep >= step.id ? "active" : ""
              }`}
            >
              <span className="step-icon">{step.icon}</span>
            </div>

            <p className="step-label">{step.label}</p>

            {index < steps.length - 1 && (
              <div
                className={`step-line ${
                  currentStep > step.id ? "active" : ""
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OnboardProgressBar;
