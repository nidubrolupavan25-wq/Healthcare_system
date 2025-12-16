import CityDropdown from "./CityDropdown";
import "../DoctorStyle/doctor.css";

export default function CitiesSection() {
  const cities = [
    { name: "Delhi", areas: ["Central Delhi", "South Delhi", "North Delhi", "East Delhi"] },
    { name: "Hyderabad", areas: ["Hitech City", "Banjara Hills", "Secunderabad", "Madhapur"] },
    { name: "Kolkata", areas: ["Salt Lake", "New Town", "South Kolkata", "Central Kolkata"] },
    { name: "Chennai", areas: ["Anna Nagar", "Velachery", "Tambaram", "OMR"] },
    { name: "Bengaluru", areas: ["Whitefield", "Koramangala", "Indiranagar", "JP Nagar"] },
    { name: "Mumbai", areas: ["Andheri", "Bandra", "Powai", "Thane"] },
  ];

  return (
    <section className="cities-section">
      <h2 className="section-heading">Find Doctors by City</h2>

      <div className="cities-grid-apollo">
        {cities.map((city, index) => (       
          <CityDropdown key={index} city={city} />
        ))}
      </div>
    </section>
  );
}
