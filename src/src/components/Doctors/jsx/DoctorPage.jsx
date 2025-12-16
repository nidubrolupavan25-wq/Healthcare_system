import "../DoctorStyle/doctor.css";
import HeroBanner from "./HeroBanner";
import Specializations1 from "./Specializations1";
import AppointmentForm from "./AppointmentForm";
import CitiesSection from "./CitiesSection";
import WhyChooseUs from "./WhyChooseUs";

export default function DoctorPage() {
  return (
    <>
      <HeroBanner />

      <div className="container">
        <AppointmentForm />
        <Specializations1 />
        <CitiesSection />
        <WhyChooseUs />
      </div>
    </>
  );
}
