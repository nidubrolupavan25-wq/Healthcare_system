import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../css/DoctorView.css";
import api from "../../services/api";

const DoctorView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDoctorById = async () => {
    try {
      const response = await api.get(`/doctors/${id}`);
      if (response.data.success && response.data.data) {
        setDoctor(response.data.data);
      } else {
        alert("Failed to fetch doctor details");
      }
    } catch (error) {
      console.error("Error fetching doctor details:", error);
      alert("Error fetching doctor details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorById();
  }, [id]);

  if (loading) return <div className="loading">Loading doctor details...</div>;
  if (!doctor) return <div className="error">Doctor not found.</div>;

  return (
    <div className="doctor-profile-page">
      {/* Header Section */}
      <div className="profile-header">
        <img
          src={
            doctor.image
              ? `data:image/jpeg;base64,${doctor.image}`
              : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          }
          alt="Doctor"
          className="profile-image"
        />

        <div className="profile-main-info">
          <h2>{doctor.doctorName}</h2>
          <p className="specialization">{doctor.specialization}</p>
          <span
            className={`status-badge ${
              doctor.status === "ACTIVE" ? "active" : "inactive"
            }`}
          >
            {doctor.status}
          </span>
        </div>

        <button className="btn-back" onClick={() => navigate("/doctorslist")}>
          <i className="fa-solid fa-arrow-left"></i> Back to List
        </button>
      </div>

      {/* Doctor Info Section */}
      <div className="profile-details">
        <h3>Doctor Information</h3>
        <div className="info-grid">
          <div className="info-item" data-field="phone">
            <div>
              <span className="info-label">Phone</span>
              <div className="info-value">{doctor.phone}</div>
            </div>
          </div>

          <div className="info-item" data-field="email">
            <div>
              <span className="info-label">Email</span>
              <div className="info-value">
                <a href={`mailto:${doctor.email}`}>{doctor.email}</a>
              </div>
            </div>
          </div>

          <div className="info-item" data-field="experience">
            <div>
              <span className="info-label">Experience</span>
              <div className="info-value">{doctor.experience} years</div>
            </div>
          </div>

          <div className="info-item" data-field="gender">
            <div>
              <span className="info-label">Gender</span>
              <div className="info-value">{doctor.gender}</div>
            </div>
          </div>

          <div className="info-item" data-field="address">
            <div>
              <span className="info-label">Address</span>
              <div className="info-value">{doctor.address}</div>
            </div>
          </div>

          <div className="info-item" data-field="city">
            <div>
              <span className="info-label">City</span>
              <div className="info-value">{doctor.city}</div>
            </div>
          </div>

          <div className="info-item" data-field="state">
            <div>
              <span className="info-label">State</span>
              <div className="info-value">{doctor.state}</div>
            </div>
          </div>

          <div className="info-item" data-field="country">
            <div>
              <span className="info-label">Country</span>
              <div className="info-value">{doctor.country}</div>
            </div>
          </div>

          <div className="info-item" data-field="pincode">
            <div>
              <span className="info-label">Pin Code</span>
              <div className="info-value">{doctor.pinCode}</div>
            </div>
          </div>

          <div className="info-item" data-field="role">
            <div>
              <span className="info-label">Role</span>
              <div className="info-value">{doctor.role}</div>
            </div>
          </div>

          <div className="info-item" data-field="license">
            <div>
              <span className="info-label">License No</span>
              <div className="info-value">{doctor.medicalLicenseNo}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorView;
