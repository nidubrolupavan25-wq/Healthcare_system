import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PatientAPI } from "../../services/api";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../css/PatientView.css";

const PatientView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    try {
      const res = await PatientAPI.getFullDetails(id);
      setDetails(res.data.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching patient details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  if (loading) return <div>Loading details...</div>;
  if (!details) return <div>No data found</div>;

  const { patient, ward, bedBooking } = details;

  return (
    <div className="patient-details-container">
      <div className="back-btn-container">
  <button className="btn-back" onClick={() => navigate("/patients")}>
    <i className="fas fa-arrow-left"></i> Back to List
  </button>
</div>


      <div className="patient-card">
        <h2>Patient Details</h2>
        <p><b>Name:</b> {patient.name}</p>
        <p><b>Gender:</b> {patient.gender}</p>
        <p><b>Phone:</b> {patient.phone}</p>
        <p><b>Disease:</b> {patient.disease}</p>
        <p><b>Address:</b> {patient.address}</p>
        <p><b>Doctor Status:</b> {patient.doctorStatus}</p>
        <p><b>Lab Status:</b> {patient.labStatus}</p>
        <p><b>Medicine Status:</b> {patient.medisionStatus}</p>

        <h3>Ward Information</h3>
        <p><b>Ward:</b> {ward.wardName || "N/A"}</p>
        <p><b>Type:</b> {ward.wardType || "N/A"}</p>

        <h3>Bed Booking</h3>
        <p><b>Admission:</b> {bedBooking.admissionDate || "N/A"}</p>
        <p><b>Discharge:</b> {bedBooking.dischargeDate || "N/A"}</p>
        <p><b>Status:</b> {bedBooking.status || "N/A"}</p>
      </div>
    </div>
  );
};

export default PatientView;
