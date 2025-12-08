import React, { useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Link, useNavigate } from "react-router-dom";
import "../css/DoctorsList.css";

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const API_BASE = "http://localhost:9090/api/doctors";
  const navigate = useNavigate(); // ✅ placed inside component

  // ✅ Fetch all doctors
  const fetchDoctors = async () => {
    try {
      const response = await fetch(API_BASE);
      const data = await response.json();
      if (data.success) setDoctors(data.data);
      else alert("Error fetching doctors: " + data.message);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      alert("Error fetching doctors from server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // ✅ Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    try {
      const response = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (data.success) {
        alert(data.message);
        fetchDoctors();
      } else alert("Delete failed: " + data.message);
    } catch (error) {
      console.error("Error deleting doctor:", error);
      alert("Error deleting doctor");
    }
  };

  // ✅ Handle View (navigate to doctor view page)
  const handleView = (id) => {
    navigate(`/doctors/${id}`);
  };

  // ✅ Handle Edit (open modal)
  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      doctorName: doctor.doctorName,
      specialization: doctor.specialization,
      phone: doctor.phone,
      email: doctor.email,
      role: doctor.role,
      status: doctor.status,
      address: doctor.address,
      gender: doctor.gender,
      experience: doctor.experience,
      city: doctor.city,
      state: doctor.state,
      pinCode: doctor.pinCode,
      country: doctor.country,
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Save edited doctor
  const handleSave = async () => {
    if (!editingDoctor) return;
    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE}/${editingDoctor.doctorId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        alert("Doctor updated successfully!");
        setEditingDoctor(null);
        fetchDoctors();
      } else {
        alert("Update failed: " + data.message);
      }
    } catch (error) {
      console.error("Error updating doctor:", error);
      alert("Error updating doctor");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div>Loading doctors...</div>;

  return (
    <>
      <div className="page-content active">
        <div className="page-header">
          <h2>All Doctors</h2>
          <Link to="/doctorregister">
            <button className="btn-add">
              <i className="fa-solid fa-plus"></i> Add New Doctor
            </button>
          </Link>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Doctor Name</th>
                <th>Specialization</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Experience</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No doctors found.
                  </td>
                </tr>
              ) : (
                doctors.map((doctor) => (
                  <tr key={doctor.doctorId}>
                    <td>{doctor.doctorName}</td>
                    <td>{doctor.specialization}</td>
                    <td>{doctor.phone}</td>
                    <td>{doctor.email}</td>
                    <td>{doctor.experience} years</td>
                    <td>
                      <span
                        className={`status-badge ${
                          doctor.status === "ACTIVE" ? "active" : "inactive"
                        }`}
                      >
                        {doctor.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button
                          className="btn-icon"
                          title="View"
                          onClick={() => handleView(doctor.doctorId)}
                        >
                          <i className="fa-solid fa-eye"></i>
                        </button>
                        <button
                          className="btn-icon"
                          title="Edit"
                          onClick={() => handleEdit(doctor)}
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button
                          className="btn-icon delete"
                          title="Delete"
                          onClick={() => handleDelete(doctor.doctorId)}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ Edit Modal */}
      {editingDoctor && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Doctor</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Doctor Name</label>
                <input
                  name="doctorName"
                  value={formData.doctorName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Specialization</label>
                <input
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Experience (years)</label>
                <input
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option>ACTIVE</option>
                  <option>INACTIVE</option>
                </select>
              </div>

              <div className="form-group">
                <label>Address</label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>City</label>
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>State</label>
                <input
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Pin Code</label>
                <input
                  name="pinCode"
                  value={formData.pinCode}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Country</label>
                <input
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setEditingDoctor(null)}
              >
                Cancel
              </button>
              <button
                className="btn-save"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DoctorsList;
