import React from "react";
import "./css/OnboardFooter.css";

const OnboardFooter = () => {
  return (
    <footer className="onboard-footer">
      <p>© {new Date().getFullYear()} MediConnect — Hospital Onboarding System</p>
    </footer>
  );
};

export default OnboardFooter;
