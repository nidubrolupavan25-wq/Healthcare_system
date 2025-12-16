import React from "react";

function RoboAssistant() {
  return (
    <div className="robo-assistant" onClick={() => window.location.href = "/ai.html"}>
      <div className="robo-image">
        <svg width="60" height="60">
          <circle cx="30" cy="30" r="28" fill="#4285F4" />
        </svg>
      </div>
      <div className="robo-message">Can I help?</div>
    </div>
  );
}

export default RoboAssistant;
