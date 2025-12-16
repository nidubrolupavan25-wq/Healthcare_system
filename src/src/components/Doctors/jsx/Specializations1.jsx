import "../DoctorStyle/doctor.css";
import { specializations } from "./specializations";
import { useScrollAnimations } from "./useScrollAnimations";

export default function Specializations1() {
  useScrollAnimations();

  return (
    <section className="specializations-section">
      <h2 className="section-title">Browse by Specializations</h2>

      <div className="specialization-grid">
        {specializations.map((item, idx) => (
          <div
            key={idx}
            className="specialization-card animate-on-scroll"
            style={{ animationDelay: `${idx * 0.1}s` }}
            onClick={() => (window.location.href = item.link)}
          >
            <i className={`fas ${item.icon}`}></i>
            <h3>{item.name}</h3>
            <p>{item.doctors}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
