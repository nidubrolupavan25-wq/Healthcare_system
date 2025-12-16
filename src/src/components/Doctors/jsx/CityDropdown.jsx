import { useState } from "react";
import "../DoctorStyle/doctor.css";

export default function CityDropdown({ city }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="city-item-apollo">
      <div className="city-dropdown" onClick={() => setOpen(!open)}>
        <span className="city-name">{city.name}</span>
        <i className={`fas fa-chevron-down ${open ? "rotate" : ""}`}></i>
      </div>

      <div className={`city-submenu ${open ? "active" : ""}`}>
        {city.areas.map((area, i) => (
          <a key={i} href="#">{area}</a>
        ))}
      </div>
    </div>
  );
}
