import React from "react";
import talk_ro_doctor from "../../assets/images/talk_to_doctor.jpeg"
import Medicine from "../../assets/images/medicine.jpg"
import appointment_image from "../../assets/images/appointment_image.png"
import lab_test from "../../assets/images/lab_test.jpeg"
import surgery from "../../assets/images/surgery.png"
// import gold from "../assets/images/"
import "../../components/style/services.css";
import book_health from "../../assets/images/book-health-checkup.webp"
import nutrition_main from "../../assets/images/nutrition-main.jpg"
import dental from "../../assets/images/surgery.png"
import Vaccines from "../../assets/images/Vaccines.webp"
import covid_19 from "../../assets/images/covid-19.jpg"


const services = [
  { name: "Talk to Doctor", img: talk_ro_doctor, link: "/doctor" },
  { name: "Medicine", img: Medicine, link: "/medicine" },
  { name: "Book Dr. Appointment", img: appointment_image, link: "/doctor" },
  { name: "Lab Test & Packages", img: lab_test, link: "labtest" },
  { name: "Surgery", img: surgery, link: "Surgery.html" },
  { name: "JhaiHealthcare GOLD", img: "/images/gold.jpg", link: "#" },
  { name: "Book Health Check", img: book_health, link: "#" },
  { name: "Nutrition", img: nutrition_main, link: "#" },
  { name: "Dental", img: dental, link: "#" },
  { name: "Vaccination", img: Vaccines, link: "#" },
  { name: "COVID-19", img: covid_19, link: "#" },
];

function ServicesGrid() {
  return (
    <section className="services-grid">
      {services.map((service, i) => (
        <a className="service-card" href={service.link} key={i}>
          <div className="service-icon">
            <img src={service.img} alt={service.name} />
          </div>
          <h3>{service.name}</h3>
        </a>
      ))}
    </section>
  );
}

export default ServicesGrid;
