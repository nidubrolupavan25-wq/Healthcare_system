import React, { useState, useEffect } from "react";
import "../css/Appointments.css";
import axios from "axios";

const BASE_URL = "http://localhost:9090/api";

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDoctor, setFilterDoctor] = useState("All");
  const [filterDate, setFilterDate] = useState(new Date().toISOString().slice(0, 10));
  const [doctors, setDoctors] = useState([]);

  // Edit Modal
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [updatedData, setUpdatedData] = useState({});

  // Add Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "", mobile: "", email: "", disease: "", date: "", time: "", doctorId: "", notes: ""
  });

  // Fetch doctors
  useEffect(() => {
    axios.get(`${BASE_URL}/doctors`)
      .then(res => setDoctors(res.data?.data || []))
      .catch(err => console.error("Error fetching doctors:", err));
  }, []);

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const params = { fromDate: filterDate };
        if (filterStatus !== "All") params.doctorStatus = filterStatus;
        if (filterDoctor !== "All") params.doctorId = filterDoctor;

        const res = await axios.get(`${BASE_URL}/patient/filter/native`, { params });
        const data = res.data?.data || [];

        setAppointments(
          data.map((p) => ({
            id: p.patientId,
            patientId: p.patientId,
            patient: p.name,
            doctorId: p.doctorId,
            doctor: doctors.find((d) => d.doctorId === p.doctorId)?.doctorName || `Doctor ${p.doctorId}`,
            date: p.appointmentDate,
            time: p.appointmentTime,
            status: p.doctorStatus || "Pending",
            department: p.disease || "General",
            notes: p.notes || "",
          }))
        );
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setAppointments([]);
      }
    };
    fetchAppointments();
  }, [filterDate, filterStatus, filterDoctor, doctors]);

  // Status class
  const getStatusClass = (status) => {
    if (status === "Confirmed") return "apt-status-confirmed";
    if (status === "Pending") return "apt-status-pending";
    if (status === "Cancelled") return "apt-status-cancelled";
    return "apt-status";
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;
    try {
      await axios.delete(`${BASE_URL}/patient/${id}`);
      setAppointments(prev => prev.filter(a => a.id !== id));
      alert("Deleted!");
    } catch (err) {
      alert("Failed to delete");
    }
  };

  // Edit
  const openEditModal = (apt) => {
    setEditingAppointment(apt);
    setUpdatedData({
      name: apt.patient,
      appointmentDate: apt.date,
      appointmentTime: apt.time,
      doctorId: apt.doctorId,
      doctorStatus: apt.status,
      disease: apt.department,
      notes: apt.notes,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`${BASE_URL}/patient/${editingAppointment.id}`, updatedData);
      if (res.data.success) {
        setAppointments(prev =>
          prev.map(apt =>
            apt.id === editingAppointment.id
              ? { ...apt, ...updatedData, status: updatedData.doctorStatus }
              : apt
          )
        );
        setEditingAppointment(null);
        alert("Updated!");
      }
    } catch (err) {
      alert("Update failed");
    }
  };

  // Add Appointment
  const handleAdd = async (e) => {
    e.preventDefault();

    if (!/^[6-9]\d{9}$/.test(addForm.mobile)) {
      alert("Mobile must be 10 digits, starting with 6-9");
      return;
    }
    if (addForm.email && !/^\S+@\S+\.\S+$/.test(addForm.email)) {
      alert("Invalid email");
      return;
    }
    if (!addForm.name || !addForm.disease || !addForm.date || !addForm.time || !addForm.doctorId) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const payload = {
        name: addForm.name.trim(),
        mobile: addForm.mobile,
        email: addForm.email || null,
        disease: addForm.disease,
        appointmentDate: addForm.date,
        appointmentTime: addForm.time,
        doctorId: Number(addForm.doctorId),
        notes: addForm.notes || null,
      };

      const res = await axios.post(`${BASE_URL}/patient`, payload);
      if (res.data.success) {
        alert("Appointment added!");
        setShowAddModal(false);
        setAddForm({ name: "", mobile: "", email: "", disease: "", date: "", time: "", doctorId: "", notes: "" });

        // Refresh
        const refreshRes = await axios.get(`${BASE_URL}/patient/filter/native`, { params: { fromDate: filterDate } });
        const data = refreshRes.data?.data || [];
        setAppointments(data.map(p => ({
          id: p.patientId,
          patientId: p.patientId,
          patient: p.name,
          doctorId: p.doctorId,
          doctor: doctors.find(d => d.doctorId === p.doctorId)?.doctorName || `Doctor ${p.doctorId}`,
          date: p.appointmentDate,
          time: p.appointmentTime,
          status: p.doctorStatus || "Pending",
          department: p.disease || "General",
          notes: p.notes || "",
        })));
      }
    } catch (err) {
      alert("Failed: " + (err.response?.data?.message || err.message));
    }
  };

  const filteredAppointments = appointments
    .filter(apt =>
      apt.patient?.toLowerCase().includes(search.toLowerCase()) ||
      apt.department?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <>
      {/* + Add FAB */}
      <button className="apt-add-fab" onClick={() => setShowAddModal(true)}>+</button>

      <div className="apt-page-container">

        {/* Filters */}
        <div className="apt-filters-bar">
          <input
            type="text"
            placeholder="Search patient or disease..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="apt-search-input"
          />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="apt-date-input"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="apt-filter-select"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <select
            value={filterDoctor}
            onChange={(e) => setFilterDoctor(e.target.value)}
            className="apt-filter-select"
          >
            <option value="All">All Doctors</option>
            {doctors.map(doc => (
              <option key={doc.doctorId} value={doc.doctorId}>{doc.doctorName}</option>
            ))}
          </select>
        </div>

        <h3 className="apt-date-title">Appointments on {filterDate}</h3>

        {/* Cards */}
        <div className="apt-cards-grid">
          {filteredAppointments.length === 0 ? (
            <p className="apt-no-data">No appointments found.</p>
          ) : (
            filteredAppointments.map(apt => (
              <div key={apt.id} className="apt-card">
                <div className="apt-card-header">
                  <h4 className="apt-patient-name">{apt.patient}</h4>
                  <span className={getStatusClass(apt.status)}>{apt.status}</span>
                </div>
                <div className="apt-card-body">
                  <p><strong>Patient ID:</strong> {apt.patientId}</p>
                  <p><strong>Doctor:</strong> {apt.doctor}</p>
                  <p><strong>Disease:</strong> {apt.department}</p>
                  <p><strong>Date:</strong> {apt.date}</p>
                  <p><strong>Time:</strong> {apt.time}</p>
                  {apt.notes && <p><strong>Notes:</strong> {apt.notes}</p>}
                </div>
                <div className="apt-card-actions">
                  <button className="apt-edit-btn" onClick={() => openEditModal(apt)}>Edit</button>
                  <button className="apt-delete-btn" onClick={() => handleDelete(apt.id)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingAppointment && (
        <div className="apt-modal-backdrop" onClick={() => setEditingAppointment(null)}>
          <div className="apt-modal-container" onClick={e => e.stopPropagation()}>
            <div className="apt-modal-header">
              <h3>Edit Appointment</h3>
              <button className="apt-modal-close" onClick={() => setEditingAppointment(null)}>×</button>
            </div>
            <div className="apt-modal-body">
              <label>Patient Name</label>
              <input name="name" value={updatedData.name} onChange={handleEditChange} />
              <label>Date</label>
              <input type="date" name="appointmentDate" value={updatedData.appointmentDate} onChange={handleEditChange} />
              <label>Time</label>
              <input type="time" name="appointmentTime" value={updatedData.appointmentTime} onChange={handleEditChange} />
              <label>Doctor</label>
              <select name="doctorId" value={updatedData.doctorId} onChange={handleEditChange}>
                {doctors.map(doc => (
                  <option key={doc.doctorId} value={doc.doctorId}>{doc.doctorName}</option>
                ))}
              </select>
              <label>Status</label>
              <select name="doctorStatus" value={updatedData.doctorStatus} onChange={handleEditChange}>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <label>Disease</label>
              <input name="disease" value={updatedData.disease} onChange={handleEditChange} />
              <label>Notes</label>
              <textarea name="notes" value={updatedData.notes} onChange={handleEditChange} />
            </div>
            <div className="apt-modal-footer">
              <button className="apt-btn-cancel" onClick={() => setEditingAppointment(null)}>Cancel</button>
              <button className="apt-btn-save" onClick={handleUpdate}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="apt-add-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="apt-add-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="apt-add-modal-header">
              <h3>Add New Appointment</h3>
              <button className="apt-add-modal-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <form onSubmit={handleAdd} className="apt-add-form">
              <div className="apt-add-form-grid">
                <div className="apt-add-form-group">
                  <label>Patient Name <span className="required">*</span></label>
                  <input type="text" required value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} placeholder="Full name" />
                </div>
                <div className="apt-add-form-group">
                  <label>Mobile <span className="required">*</span></label>
                  <input
                    type="tel"
                    required
                    value={addForm.mobile}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                      if (/^[6-9]/.test(val) || val === "") setAddForm({ ...addForm, mobile: val });
                    }}
                    placeholder="10 digits (6-9 start)"
                    maxLength={10}
                  />
                  {addForm.mobile && !/^[6-9]\d{9}$/.test(addForm.mobile) && (
                    <small className="apt-add-error">Invalid mobile</small>
                  )}
                </div>
                <div className="apt-add-form-group">
                  <label>Email</label>
                  <input type="email" value={addForm.email} onChange={(e) => setAddForm({ ...addForm, email: e.target.value })} placeholder="example@gmail.com" />
                  {addForm.email && !/^\S+@\S+\.\S+$/.test(addForm.email) && (
                    <small className="apt-add-error">Invalid email</small>
                  )}
                </div>
                <div className="apt-add-form-group">
                  <label>Disease <span className="required">*</span></label>
                  <input type="text" required value={addForm.disease} onChange={(e) => setAddForm({ ...addForm, disease: e.target.value })} placeholder="e.g. Fever" />
                </div>
                <div className="apt-add-form-group">
                  <label>Date <span className="required">*</span></label>
                  <input type="date" required min={new Date().toISOString().split("T")[0]} value={addForm.date} onChange={(e) => setAddForm({ ...addForm, date: e.target.value })} />
                </div>
                <div className="apt-add-form-group">
                  <label>Time <span className="required">*</span></label>
                  <input type="time" required value={addForm.time} onChange={(e) => setAddForm({ ...addForm, time: e.target.value })} />
                </div>
                <div className="apt-add-form-group">
                  <label>Doctor <span className="required">*</span></label>
                  <select required value={addForm.doctorId} onChange={(e) => setAddForm({ ...addForm, doctorId: e.target.value })}>
                    <option value="">Select Doctor</option>
                    {doctors.map(doc => (
                      <option key={doc.doctorId} value={doc.doctorId}>{doc.doctorName}</option>
                    ))}
                  </select>
                </div>
                <div className="apt-add-form-group">
                  <label>Notes (Optional)</label>
                  <textarea value={addForm.notes} onChange={(e) => setAddForm({ ...addForm, notes: e.target.value })} placeholder="Any special instructions..." rows="2" />
                </div>
              </div>
              <div className="apt-add-modal-footer">
                <button type="button" className="apt-add-btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="apt-add-btn-submit">Add Appointment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AppointmentsList;