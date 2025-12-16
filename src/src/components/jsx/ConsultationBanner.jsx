import React from "react";
import "../../components/style/consultation.css";
function ConsultationBanner() {
  return (
    <section className="consultation-banner">
      <img
        src="https://images.pexels.com/photos/417325/pexels-photo-417325.jpeg?auto=compress&cs=tinysrgb&w=300"
        alt="Consultation"
        className="banner-image left"
      />

      <div className="consultation-content">
        <h2>Consult with Top Doctors Online, 24x7</h2>
        <button className="consultation-btn">
          Start Consultation
        </button>
      </div>
    </section>
  );
}

export default ConsultationBanner;
