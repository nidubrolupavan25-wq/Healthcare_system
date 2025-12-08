import React from "react";
import { Outlet } from "react-router-dom";

import OnboardHeader from "./OnboardHeader";
import OnboardFooter from "./OnboardFooter";
import OnboardProgressBar from "./OnboardProgressBar";

const OnboardingLayout = () => {
  return (
    <div className="onboarding-wrapper">

      {/* Onboarding Header */}
      <OnboardHeader />

      {/* Progress Bar */}
      <OnboardProgressBar />

      {/* Dynamic page content */}
      <div className="onboarding-content">
        <Outlet />
      </div>

      {/* Onboarding Footer */}
      <OnboardFooter />

    </div>
  );
};

export default OnboardingLayout;
