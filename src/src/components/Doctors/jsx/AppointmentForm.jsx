import { useState } from "react";
import "../DoctorStyle/doctor.css";

export default function AppointmentForm() {
  const [date, setDate] = useState("");

  return (
    <section className="appointment-section">
      <h2 className="section-heading">Find a Doctor in 3 easy steps</h2>

      <form className="apollo-form">
        <div className="form-row-inline">

          {/* Speciality */}
          <div className="form-group-apollo">
            <label>Select Speciality *</label>
            <div className="custom-select-wrapper">
              <select className="custom-select-apollo">
                <option value="">Select Speciality</option>
                <option>Cardiology</option>
                <option>Dermatology</option>
                <option>Neurology</option>
                <option>Orthopedics</option>
                <option>Pediatrics</option>
              </select>
              <i className="fas fa-chevron-down select-arrow"></i>
            </div>
          </div>

          {/* Date */}
          <div className="form-group-apollo">
            <label>Select Date *</label>
            <div className="custom-select-wrapper">
              <input
                type="date"
                className="custom-select-apollo"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <i className="far fa-calendar select-icon"></i>
            </div>
          </div>

          {/* Location */}
          <div className="form-group-apollo">
            <label>Preferred Location *</label>
            <div className="custom-select-wrapper">
              <input
                type="text"
                className="custom-select-apollo location-input"
                placeholder="Enter location or pincode"
              />
              <i className="fas fa-location-crosshairs select-icon"></i>
            </div>
          </div>

          {/* Submit */}
          <div className="form-group-apollo submit-group">
            <button type="submit" className="btn-submit-apollo">
              Submit
            </button>
          </div>

        </div>
      </form>
    </section>
  );
}
