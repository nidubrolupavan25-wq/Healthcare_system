import "../DoctorStyle/doctor.css";

export default function HeroBanner() {
  return (
    <section className="hero-banner">
      <div className="hero-content">
        <h1>Find the Right Doctor for You</h1>
        <p>Connect with experienced healthcare professionals from anywhere</p>
      </div>

      <div className="hero-image-box">
        <img src="/images/doctor-hero.png" alt="doctor" className="hero-image" />
      </div>
    </section>
  );
}
