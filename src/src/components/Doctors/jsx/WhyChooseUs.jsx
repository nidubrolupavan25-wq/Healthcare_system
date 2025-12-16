import "../DoctorStyle/doctor.css";

export default function WhyChooseUs() {
  const features = [
    { icon: "fa-shield-alt", title: "Verified Doctors", desc: "All doctors are certified and verified" },
    { icon: "fa-clock", title: "24/7 Support", desc: "Round-the-clock customer assistance" },
    { icon: "fa-video", title: "Online Consultation", desc: "Consult from anywhere, anytime" },
    { icon: "fa-lock", title: "Secure & Private", desc: "Your health data is safe with us" },
  ];

  return (
    <section className="why-choose">
      <h2 className="section-title">Why Choose Us?</h2>

      <div className="why-grid">
        {features.map((f, i) => (
          <div className="feature-card" key={i}>
            <i className={`fas ${f.icon}`}></i>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
