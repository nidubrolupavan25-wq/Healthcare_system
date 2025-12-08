import React, { useState, useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Link, useNavigate } from "react-router-dom";
import { PatientAPI, DoctorAPI } from "../../services/api";
import "../css/PatientsList.css";

const PatientsList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingPatient, setEditingPatient] = useState(null);
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [doctors, setDoctors] = useState([]);

  const [searchType, setSearchType] = useState(""); // ⬅ NEW
  const [searchText, setSearchText] = useState(""); // ⬅ NEW

  const navigate = useNavigate();

  // Fetch patients
  const fetchPatients = async () => {
    try {
      const res = await PatientAPI.getAll();
      setPatients(res.data.data || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Error fetching patients data.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch doctors
  const fetchDoctors = async () => {
    try {
      const res = await DoctorAPI.getAll();
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
  }, []);

  // Calculate Age
  const calculateAge = (dob) => {
    if (!dob) return "-";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const handleView = (id) => navigate(`/patients/${id}`);

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setFormData({
      phone: patient.phone || "",
      address: patient.address || "",
      doctorId: patient.doctorId || "",
      appointmentDate: patient.appointmentDate || "",
    });
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    if (!editingPatient) return;
    setIsSaving(true);
    try {
      const res = await PatientAPI.updatePartial(editingPatient.patientId, formData);
      if (res.data.success) {
        alert("Patient updated successfully!");
        setEditingPatient(null);
        fetchPatients();
      } else {
        alert("Update failed: " + res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error updating patient");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;
    try {
      await PatientAPI.delete(id);
      alert("Patient deleted successfully.");
      fetchPatients();
    } catch (err) {
      console.error(err);
      alert("Error deleting patient.");
    }
  };

  // ⬅⬅⬅ FILTER PATIENTS BASED ON SELECTED SEARCH TYPE
 let filteredPatients = patients.filter((p) => {
  if (!searchType || !searchText) return true;

  const text = searchText.toLowerCase();

  switch (searchType) {
    case "id":
      return p.patientId?.toString().startsWith(text);
    case "name":
      return p.name?.toLowerCase().startsWith(text);
    case "phone":
      return p.phone?.toString().startsWith(text);
    case "aadhar":
      return p.aadhar?.toString().startsWith(text);
    default:
      return true;
  }
});

// Sorting based on selected type
if (searchType === "name") {
  filteredPatients.sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}
else if (searchType === "id") {
  filteredPatients.sort((a, b) =>
    a.patientId - b.patientId
  );
}
else if (searchType === "phone") {
  filteredPatients.sort((a, b) =>
    a.phone - b.phone
  );
}
else if (searchType === "aadhar") {
  filteredPatients.sort((a, b) =>
    a.aadhar - b.aadhar
  );
}


  if (loading) return <div>Loading patients...</div>;

  return (
    <>
      <div className="page-content active">

        {/* 🔍 Search Options */}
        <div className="search-section">
  <div className="search-box">

    <select
      className="search-dropdown"
      value={searchType}
      onChange={(e) => setSearchType(e.target.value)}
    >
      <option value="">Search By</option>
      <option value="id">Patient ID</option>
      <option value="name">Name</option>
      <option value="phone">Phone</option>
      <option value="aadhar">Aadhar</option>
    </select>

    <input
      type="text"
      className="search-input"
      placeholder="Enter value..."
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      disabled={!searchType}
    />
  </div>
</div>


        <div className="table-container">
          {error ? (
            <p style={{ textAlign: "center", color: "red" }}>{error}</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Aadhar</th>
                  <th>Phone</th>
                  <th>Doctor</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      No matching patients found.
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((p) => (
                    <tr key={p.patientId}>
                      <td>{p.patientId}</td>
                      <td>{p.name}</td>
                      <td>{calculateAge(p.dateOfBirth)}</td>
                      <td>{p.aadhar}</td>
                      <td>{p.phone}</td>
                      <td>
                        {
                          doctors.find((d) => d.doctorId === p.doctorId)?.doctorName ||
                          "N/A"
                        }
                      </td>
                      <td>
                        <div className="action-btns">
                          <button className="btn-icon" title="View" onClick={() => handleView(p.patientId)}>
                            <i className="fas fa-eye"></i>
                          </button>

                          <button className="btn-icon" title="Edit" onClick={() => handleEdit(p)}>
                            <i className="fas fa-edit"></i>
                          </button>

                          <button className="btn-icon delete" title="Delete" onClick={() => handleDelete(p.patientId)}>
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingPatient && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Patient Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Phone Number</label>
                <input name="phone" value={formData.phone} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Address</label>
                <input name="address" value={formData.address} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Doctor</label>
                <select name="doctorId" value={formData.doctorId} onChange={handleChange}>
                  <option value="">-- Select Doctor --</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.doctorId} value={doctor.doctorId}>
                      {doctor.doctorName} ({doctor.specialization})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Appointment Date</label>
                <input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setEditingPatient(null)}>Cancel</button>
              <button className="btn-save" onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PatientsList;
