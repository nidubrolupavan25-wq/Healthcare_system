// src/components/Medicine/StaffManagement.jsx
import React, { useEffect, useState, useMemo } from "react";
import { StaffAPI } from "../../services/api";
import "../css/staff.css";
import { FaEye, FaEdit, FaTrashAlt } from "react-icons/fa";

const avatarPlaceholder = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const departmentDisplayMap = {
  Doctors: "Doctors",
  Nurses: "Nursing",
  Cleaning: "Cleaning",
  Pharmacy: "Pharmacy",
  Reception: "Reception",
  "Lab Tech": "Lab",
  Maintenance: "Maintenance",
  Security: "Security",
};

const departmentOptions = [
  { label: "Doctors", value: "Doctors" },
  { label: "Nurses", value: "Nursing" },
  { label: "Cleaning", value: "Cleaning" },
  { label: "Pharmacy", value: "Pharmacy" },
  { label: "Reception", value: "Reception" },
  { label: "Lab Tech", value: "Lab" },
  { label: "Maintenance", value: "Maintenance" },
  { label: "Security", value: "Security" },
];

const StaffManagement = () => {
  const [currentDept, setCurrentDept] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [allStaff, setAllStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    adhar: "",
    address: "",
    department: "Nursing",
    role: "",
    salary: "",
    joiningDate: "",
    timings: "",
  });

  /* ---------- FETCH STAFF ---------- */
  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      setError("");
      try {
        let res;
        if (currentDept === "all") {
          res = await StaffAPI.getAll();
        } else {
          const backendDept = departmentDisplayMap[currentDept];
          res = await StaffAPI.getByDepartment(backendDept);
        }
        setAllStaff(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load staff data.");
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, [currentDept]);

  /* ---------- SEARCH & SORT ---------- */
  const filteredData = useMemo(() => {
    let data = [...allStaff];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          `EMP${String(s.id).padStart(3, "0")}`.toLowerCase().includes(q)
      );
    }
    data.sort((a, b) => a.name.localeCompare(b.name));
    return data;
  }, [allStaff, searchQuery]);

  /* ---------- ADD STAFF ---------- */
  const handleAdd = async (e) => {
  e.preventDefault();

  if (!/^[6-9]\d{9}$/.test(form.mobile)) {
    alert("Mobile must be 10 digits, starting with 6-9");
    return;
  }
  if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
    alert("Please enter a valid email");
    return;
  }
  if (form.adhar && form.adhar.length !== 12) {
    alert("Aadhaar must be exactly 12 digits");
    return;
  }
  if (!form.name || !form.role || !form.salary || !form.department) {
    alert("Please fill all required fields");
    return;
  }
  if (form.salary < 0) {
    alert("Salary cannot be negative");
    return;
  }

  try {
    await StaffAPI.add({
      name: form.name.trim(),
      mobile: form.mobile,
      email: form.email || null,
      adhar: form.adhar || null,
      address: form.address || null,
      department: form.department,
      role: form.role.trim(),
      salary: Number(form.salary),
      joiningDate: form.joiningDate || null,
      timings: form.timings || null,
    });

    setShowAddModal(false);
    setForm({
      name: "", mobile: "", email: "", adhar: "", address: "",
      department: "Nursing", role: "", salary: "", joiningDate: "", timings: ""
    });

    const res = await StaffAPI.getAll();
    setAllStaff(res.data);
    alert("Staff added successfully!");
  } catch (err) {
    alert("Failed: " + (err.response?.data?.message || err.message));
  }
};
  /* ---------- EXPORT STAFF ---------- */
  const handleExport = () => {
    if (!allStaff.length) return alert("No data to export.");

    const csvRows = [];
    const headers = [
      "Employee ID", "Full Name", "Mobile", "Email", "Aadhaar",
      "Department", "Role", "Salary", "Joining Date"
    ];
    csvRows.push(headers.join(","));

    allStaff.forEach((s) => {
      const row = [
        `EMP${String(s.id).padStart(3, "0")}`, s.name, s.mobile, s.email,
        s.adhar, s.department, s.role, s.salary, s.joiningDate
      ];
      csvRows.push(row.map((v) => `"${v || ""}"`).join(","));
    });

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "staff_data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ---------- ACTION HANDLERS ---------- */
  const openView = (emp) => alert(`Viewing details for ${emp.name}`);
  const openEdit = (emp) => alert(`Editing staff: ${emp.name}`);
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this staff member?")) return;
    try {
      await StaffAPI.delete(id);
      setAllStaff(allStaff.filter((s) => s.id !== id));
    } catch (err) {
      alert("Failed to delete staff.");
    }
  };

  /* ---------- RENDER ---------- */
  if (loading) return <div className="text-center py-5">Loading…</div>;
  if (error) return <div className="text-danger text-center py-5">{error}</div>;

  return (
    <div className="staff-container">
      {/* ========== HEADER + SEARCH + BUTTONS ========== */}
      <div className="header-row">
        <h2 className="header-title">Staff Management</h2>
        <div className="header-right">
          <input
            type="text"
            className="search-input"
            placeholder="Search by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="header-actions">
            <button className="btn-add" onClick={() => setShowAddModal(true)}>
              + Add Staff
            </button>
            <button className="btn-export" onClick={handleExport}>
              Export
            </button>
          </div>
        </div>
      </div>

      {/* ========== TABS (HORIZONTAL PILLS) ========== */}
      <div className="nav-tabs-custom">
        {[
          ["all", "All Staff", "fa-layer-group"],
          ["Doctors", "Doctors", "fa-user-md"],
          ["Nurses", "Nurses", "fa-user-nurse"],
          ["Cleaning", "Cleaning", "fa-broom"],
          ["Pharmacy", "Pharmacy", "fa-pills"],
          ["Reception", "Reception", "fa-concierge-bell"],
          ["Lab Tech", "Lab Tech", "fa-flask"],
          ["Maintenance", "Maintenance", "fa-tools"],
        ].map(([key, label, icon]) => (
          <button
            key={key}
            className={`tab-btn ${currentDept === key ? "active" : ""}`}
            onClick={() => setCurrentDept(key)}
          >
            <i className={`fas ${icon}`}></i> {label}
          </button>
        ))}
      </div>

      {/* ========== TABLE (RESPONSIVE) ========== */}
      <div className="table-wrapper">
        <table className="staff-table">
          <thead>
            <tr>
              <th>AVATAR</th>
              <th>EMPLOYEE ID</th>
              <th>NAME</th>
              <th>ROLE</th>
              <th>DEPARTMENT</th>
              <th>SALARY</th>
              <th>CONTACT</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={8} className="no-data">No staff found.</td>
              </tr>
            ) : (
              filteredData.map((emp) => (
                <tr key={emp.id}>
                  <td>
                    <img src={avatarPlaceholder} alt={emp.name} className="staff-avatar" />
                  </td>
                  <td className="emp-id">
                    <strong>{`EMP${String(emp.id).padStart(3, "0")}`}</strong>
                  </td>
                  <td className="staff-name">{emp.name}</td>
                  <td>{emp.role}</td>
                  <td className="dept-text">{emp.department}</td>
                  <td className="salary">₹{emp.salary?.toLocaleString() ?? "—"}</td>
                  <td className="contact-cell">{emp.mobile}</td>
                  <td className="action-buttons">
                    <button className="view" onClick={() => openView(emp)} title="View">
                      <FaEye />
                    </button>
                    <button className="edit" onClick={() => openEdit(emp)} title="Edit">
                      <FaEdit />
                    </button>
                    <button className="delete" onClick={() => handleDelete(emp.id)} title="Delete">
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

     {/* ========== PROFESSIONAL ADD STAFF MODAL (UNIQUE CLASSES) ========== */}
{showAddModal && (
  <div className="staff-add-modal-backdrop" onClick={() => setShowAddModal(false)}>
    <div className="staff-add-modal-container" onClick={(e) => e.stopPropagation()}>
      
      {/* Header */}
      <div className="staff-add-modal-header">
        <h3 className="staff-add-modal-title">
          <i className="fas fa-user-plus"></i> Add New Staff
        </h3>
        <button className="staff-add-modal-close" onClick={() => setShowAddModal(false)}>
          ×
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleAdd} className="staff-add-modal-form">
        <div className="staff-add-form-grid">

          {/* Full Name */}
          <div className="staff-add-form-group">
            <label className="staff-add-label">Full Name <span className="required">*</span></label>
            <input
              type="text"
              className="staff-add-input"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter full name"
            />
          </div>

          {/* Mobile */}
          <div className="staff-add-form-group">
            <label className="staff-add-label">Mobile <span className="required">*</span></label>
            <input
              type="tel"
              className="staff-add-input"
              required
              value={form.mobile}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                if (/^[6-9]/.test(val) || val === "") {
                  setForm({ ...form, mobile: val });
                }
              }}
              placeholder="10 digits (6-9 start)"
              maxLength={10}
            />
            {form.mobile && !/^[6-9]\d{9}$/.test(form.mobile) && (
              <small className="staff-add-error">Invalid mobile number</small>
            )}
          </div>

          {/* Email */}
          <div className="staff-add-form-group">
            <label className="staff-add-label">Email</label>
            <input
              type="email"
              className="staff-add-input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="example@hospital.com"
            />
            {form.email && !/^\S+@\S+\.\S+$/.test(form.email) && (
              <small className="staff-add-error">Invalid email format</small>
            )}
          </div>

          {/* Aadhaar */}
          <div className="staff-add-form-group">
            <label className="staff-add-label">Aadhaar</label>
            <input
              type="text"
              className="staff-add-input"
              value={form.adhar}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 12);
                setForm({ ...form, adhar: val });
              }}
              placeholder="12 digits"
              maxLength={12}
            />
            {form.adhar && form.adhar.length !== 12 && (
              <small className="staff-add-error">Aadhaar must be 12 digits</small>
            )}
          </div>

          {/* Address */}
          <div className="staff-add-form-group">
            <label className="staff-add-label">Address</label>
            <input
              type="text"
              className="staff-add-input"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Full address"
            />
          </div>

          {/* Department */}
          <div className="staff-add-form-group">
            <label className="staff-add-label">Department <span className="required">*</span></label>
            <select
              className="staff-add-select"
              required
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
            >
              {departmentOptions.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>

          {/* Role */}
          <div className="staff-add-form-group">
            <label className="staff-add-label">Role <span className="required">*</span></label>
            <input
              type="text"
              className="staff-add-input"
              required
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              placeholder="e.g. Senior Nurse"
            />
          </div>

          {/* Salary */}
          <div className="staff-add-form-group">
            <label className="staff-add-label">Salary <span className="required">*</span></label>
            <input
              type="number"
              className="staff-add-input"
              required
              min="0"
              step="1000"
              value={form.salary}
              onChange={(e) => setForm({ ...form, salary: e.target.value })}
              placeholder="₹50,000"
            />
          </div>

          {/* Joining Date */}
          <div className="staff-add-form-group">
            <label className="staff-add-label">Joining Date</label>
            <input
              type="date"
              className="staff-add-input"
              value={form.joiningDate}
              onChange={(e) => setForm({ ...form, joiningDate: e.target.value })}
            />
          </div>

          {/* Timings */}
          <div className="staff-add-form-group">
            <label className="staff-add-label">Timings</label>
            <input
              type="text"
              className="staff-add-input"
              value={form.timings}
              onChange={(e) => setForm({ ...form, timings: e.target.value })}
              placeholder="e.g. 9 AM - 5 PM"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="staff-add-modal-footer">
          <button type="button" className="staff-add-btn-cancel" onClick={() => setShowAddModal(false)}>
            Cancel
          </button>
          <button type="submit" className="staff-add-btn-submit">
            Add Staff
          </button>
        </div>
      </form>
    </div>
  </div>
)}
      <footer className="footer">
        © 2025 HealthCare Management System. All rights reserved.
      </footer>
    </div>
  );
};

export default StaffManagement;