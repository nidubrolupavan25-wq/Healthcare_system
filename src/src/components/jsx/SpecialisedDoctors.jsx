import React from "react";
import Cardiology_1 from "../../assets/images/Cardiology_1.png"
import Neurology from "../../assets/images/Neurology.png"
import Dermatology from "../../assets/images/Dermatology.png"
import Orthopedics from "../../assets/images/Orthopedics.png"
import Gastroenterology from "../../assets/images/Gastroenterology.png"
import Paediatrics from "../../assets/images/Paediatrics.png"
import "../../components/style/specialised.css";
function SpecialisedDoctors() {
  const doctors = [
    { name: "Cardiology", img: Cardiology_1 },
    { name: "Neurology", img: Neurology },
    { name: "Dermatology", img: Dermatology},
    { name: "Orthopedics", img: Orthopedics },
    { name: "Gastroenterology", img: Gastroenterology },
    { name: "Paediatrics", img: Paediatrics }
  ];

  return (
    <section className="specialised-section">
      <div className="specialised-header">
        <h2>Specialised Doctors Categories</h2>
        <a href="#" className="view-more">View More</a>
      </div>

      <div className="specialised-container">
        {doctors.map((doc, index) => (
          <div className="specialised-card" key={index}>
            <a href="#">
              <img src={doc.img} alt={doc.name} />
              <h3>{doc.name}</h3>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SpecialisedDoctors;
