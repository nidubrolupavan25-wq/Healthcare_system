import React from "react";
import heroImg from "../../assets/images/img1-removebg-preview.png";
import logoImg from "../../assets/images/logo-removebg-preview.png";
import "../style/herosection.css";

function Hero() {
  return (
    <section className="hero-section">
  <img src={heroImg} alt="Doctor" className="hero-image" />

  <div className="hero-content">
    <img src={logoImg} alt="logo" className="hero-logo" />

    <h3 className="hero-tagline">
      Your Trusted Buddy For Better Health
    </h3>

    <h1 className="hero-title">
      Complete Healthcare Solutions at Your Fingertips
    </h1>

    <p className="hero-description">
      Connect with top doctors, book appointments, order medicines, and access
      comprehensive medical services from the comfort of your home.
    </p>

    <button className="hero-btn">
      Get Started Today →
    </button>
  </div>
</section>

  );
}

export default Hero;
