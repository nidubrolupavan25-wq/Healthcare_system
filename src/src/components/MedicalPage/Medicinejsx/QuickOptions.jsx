import React, { useState } from "react";
import "../MedicineStyling/QuickOptions.css";
import { Link, useNavigate } from "react-router-dom";

export default function QuickOptions() {
  const [showOffers, setShowOffers] = useState(false);
  const navigate = useNavigate();

  const options = [
    {
      icon: "🏥",
      title: "Pharmacy Near Me",
      subtitle: "Find Store",
      onClick: () => navigate("/pharmacy-near-me"), // ✅ FIXED
    },
    {
      icon: "💊",
      title: "Get 20% Off",
      subtitle: "Upload Prescription",
      onClick: () => setShowOffers(true),
    },
    {
      icon: "🧑‍⚕️",
      title: "Doctor Appointment",
      subtitle: "Book Now",
      link: "/doctor",
    },
    {
      icon: "📋",
      title: "Health Insurance",
      subtitle: "Explore Plans",
    },
    {
      icon: "🔬",
      title: "Lab Tests",
      subtitle: "At Home",
      link: "/lab-tests",
    },
  ];

  return (
    <>
      <section className="quick-options">
        {options.map((opt) => {
          const content = (
            <div
              key={opt.title}
              className="quick-option"
              role="button"
              tabIndex={0}
              onClick={opt.onClick}
            >
              <span className="quick-option-icon">{opt.icon}</span>
              <div>
                <div className="quick-option-title">{opt.title}</div>
                <small>{opt.subtitle}</small>
              </div>
            </div>
          );

          return opt.link ? (
            <Link key={opt.title} to={opt.link}>
              {content}
            </Link>
          ) : (
            content
          );
        })}
      </section>

      {showOffers && (
        <div className="offers-popup">
          <div className="offers-content">
            <h3>🔥 20% Off Medicines</h3>
            <button onClick={() => setShowOffers(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
