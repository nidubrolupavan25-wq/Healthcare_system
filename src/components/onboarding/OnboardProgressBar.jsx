// src/components/onboarding/OnboardProgressBar.jsx
import React from "react";
import "./css/OnboardProgressBar.css";
import { 
  Building2, 
  FileCheck, 
  Image as ImageIcon, 
  Stethoscope, 
  UserRound,
  Check
} from "lucide-react";

const OnboardProgressBar = ({ currentStep }) => {
  const steps = [
    { 
      id: 1, 
      label: "Hospital Details", 
      icon: <Building2 size={20} />,
      description: "Basic Information"
    },
    { 
      id: 2, 
      label: "Certifications", 
      icon: <FileCheck size={20} />,
      description: "Licenses & Approvals"
    },
    { 
      id: 3, 
      label: "Images", 
      icon: <ImageIcon size={20} />,
      description: "Photos & Documents"
    },
    { 
      id: 4, 
      label: "Services", 
      icon: <Stethoscope size={20} />,
      description: "Specialties & Facilities"
    },
    { 
      id: 5, 
      label: "Owner Details", 
      icon: <UserRound size={20} />,
      description: "Management Information"
    },
  ];

  return (
    <div className="progress-wrapper">
      <div className="progress-container">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          
          return (
            <div key={step.id} className="progress-step">
              {/* Step Circle */}
              <div className={`step-circle-wrapper ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                <div className="step-circle">
                  {isCompleted ? (
                    <div className="completed-icon">
                      <Check size={16} />
                    </div>
                  ) : (
                    <div className="step-icon">
                      {step.icon}
                    </div>
                  )}
                </div>
                
                {/* Step Number */}
                <div className="step-number">
                  {step.id}
                </div>
              </div>
              
              {/* Step Info */}
              <div className="step-info">
                <p className="step-label">{step.label}</p>
                <p className="step-description">{step.description}</p>
              </div>
              
              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className={`step-line ${isCompleted ? 'active' : ''}`}>
                  <div className="line-fill" style={{ width: isCompleted ? '100%' : '0%' }}></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OnboardProgressBar;