import React from "react";
import Cataract from "../../assets/images/Cataract.jpg"
// import surgery from "../assets/images/surgery.png"
// import surgery from "../assets/images/surgery.png"
import Dengue_fever from "../../assets/images/Dengue-fever.jpeg"
import Gall_Bladder from "../../assets/images/Gall-Bladder.jpg"
// import surgery from "../assets/images/surgery.png"

function CashlessSupport() {
  const procedures = [
    { name: "Cataract Treatment", img: Cataract },
    { name: "Circumcision", img: "https://images.pexels.com/photos/4173233/pexels-photo-4173233.jpeg" },
    { name: "Piles & Fissures", img: "https://images.pexels.com/photos/4356258/pexels-photo-4356258.jpeg" },
    { name: "Dengue Fever", img: Dengue_fever},
    { name: "Gall Stones & Kidney Stone", img: Gall_Bladder},
    { name: "Hair Transplant", img: "https://images.pexels.com/photos/4587347/pexels-photo-4587347.jpeg" }
  ];

  return (
    <section className="cashless-support">
      <div className="procedures-grid">
        {procedures.map((p, index) => (
          <div className="procedure-item" key={index}>
            <img src={p.img} alt={p.name} />
            <span>{p.name}</span>
          </div>
        ))}
      </div>

      <div className="cashless-content">
        <h2>Avail Cashless Support for Hospitalization</h2>
        <p>End-to-end care for various surgical procedures</p>

        <button className="register-btn">
          <a style={{ color: "white", textDecoration: "none" }}>
            APPLY NOW
          </a>
        </button>
      </div>
    </section>
  );
}

export default CashlessSupport;
