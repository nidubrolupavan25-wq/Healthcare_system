import React, { useState, useEffect } from "react";
import { HospitalAPI } from "../../services/api"; 
import "../SuperAdminDashboard/css/hospital-management.css";

export default function HospitalManagementView() {
  const [hospitals, setHospitals] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");

  useEffect(() => {
    async function loadHospitals() {
      try {
        // ⭐ Fetch Level 0, 1, 2 Hospitals
// const pendingRes = await HospitalAPI.getPending();
const approvedRes = await HospitalAPI.getApprovedHospitals();
const rejectedRes = await HospitalAPI.getRejectedHospitals();

// ⭐ Extract data safely
// const pending = pendingRes.data.data || [];
const approved = approvedRes.data.data || [];
const rejected = rejectedRes.data.data || [];

// ⭐ Combine all 3 levels
const allHospitals = [...approved, ...rejected];

// ⭐ Set state
setHospitals(allHospitals);
setFiltered(allHospitals);


      } catch (error) {
        console.error("Hospital Load Error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadHospitals();
  }, []);

  // -------------------------------------
  // FILTER + SEARCH LOGIC
  // -------------------------------------
  useEffect(() => {
    let result = [...hospitals];

    // Search filter
    if (search.trim() !== "") {
      const s = search.toLowerCase();
      result = result.filter(
        (h) =>
          h.name?.toLowerCase().includes(s) ||
          h.code?.toLowerCase().includes(s) ||
          h.city?.toLowerCase().includes(s) ||
          h.ownership_type?.toLowerCase().includes(s)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((h) => {
        const st =
          h.status ||
          (h.verificationLevel === "1"
            ? "Approved"
            : h.verificationLevel === "2"
            ? "Rejected"
            : "Pending");

        return st.toLowerCase() === statusFilter.toLowerCase();
      });
    }

    // City filter
    if (cityFilter !== "all") {
      result = result.filter(
        (h) => h.city?.toLowerCase() === cityFilter.toLowerCase()
      );
    }

    setFiltered(result);
  }, [search, statusFilter, cityFilter, hospitals]);

  if (loading) return <h3>Loading Hospitals...</h3>;

  const uniqueCities = [...new Set(hospitals.map((h) => h.city).filter(Boolean))];

  return (
    <div className="page-wrapper">
      <h2 className="page-title">🏥 Hospital Management</h2>

      {/* ----------------------------
           SEARCH + FILTER BAR
      ---------------------------- */}
      <div className="filter-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search hospital name, code, city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
        </select>

        <select
          className="filter-select"
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
        >
          <option value="all">All Cities</option>
          {uniqueCities.map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="table-box">
        <table className="hospital-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Code</th>
              <th>Type</th>
              <th>City</th>
              <th>Ownership</th>
              <th>Beds</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((h) => (
              <tr key={h.id}>
                <td>{h.id}</td>
                <td>{h.name}</td>
                <td>{h.code}</td>
                <td>{h.type || "—"}</td>
                <td>{h.city || "—"}</td>
                <td>{h.ownership_type || "—"}</td>
                <td>{h.total_beds || "—"}</td>

                <td>
                  <span
                    className={`badge ${
                      h.status?.toLowerCase() ||
                      (h.verificationLevel === "1"
                        ? "approved"
                        : h.verificationLevel === "2"
                        ? "rejected"
                        : "pending")
                    }`}
                  >
                    {h.status ||
                      (h.verificationLevel === "1"
                        ? "Approved"
                        : h.verificationLevel === "2"
                        ? "Rejected"
                        : "Pending")}
                  </span>
                </td>

                <td>{h.createdAt || h.created_at || "—"}</td>

                <td>
                  <button className="btn view" onClick={() => setSelected(h)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Future Modal */}
      {/* <DetailsModal item={selected} onClose={() => setSelected(null)} /> */}
    </div>
  );
}
