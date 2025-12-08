import React, { useState, useEffect } from "react";
import { HospitalAPI } from "../../services/api";

export default function MedicalStoresManagementView() {
  const [stores, setStores] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");

  useEffect(() => {
    async function loadStores() {
      try {
        // ⭐ Fetch Level 0, 1, 2 Medical Stores
// const pendingRes = await HospitalAPI.getPendingStores();
const approvedRes = await HospitalAPI.getApprovedStores();
const rejectedRes = await HospitalAPI.getRejectedStores();

// ⭐ Extract data safely
// const pending = pendingRes.data.data || [];
const approved = approvedRes.data.data || [];
const rejected = rejectedRes.data.data || [];

// ⭐ Combine all 3
const allStores = [...approved, ...rejected];

// ⭐ Update state
setStores(allStores);
setFiltered(allStores);


      } catch (error) {
        console.error("Store Load Error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadStores();
  }, []);

  // -------------------------------------
  // FILTER + SEARCH LOGIC
  // -------------------------------------
  useEffect(() => {
    let result = [...stores];

    // Search filter
    if (search.trim() !== "") {
      const s = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.name?.toLowerCase().includes(s) ||
          item.code?.toLowerCase().includes(s) ||
          item.city?.toLowerCase().includes(s) ||
          item.owner_name?.toLowerCase().includes(s)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((item) => {
        const st =
          item.status ||
          (item.verificationLevel === "1"
            ? "Approved"
            : item.verificationLevel === "2"
            ? "Rejected"
            : "Pending");

        return st.toLowerCase() === statusFilter.toLowerCase();
      });
    }

    // City filter
    if (cityFilter !== "all") {
      result = result.filter(
        (item) => item.city?.toLowerCase() === cityFilter.toLowerCase()
      );
    }

    setFiltered(result);
  }, [search, statusFilter, cityFilter, stores]);

  if (loading) return <h3>Loading Medical Stores...</h3>;

  const uniqueCities = [...new Set(stores.map((s) => s.city).filter(Boolean))];

  return (
    <div className="page-wrapper">
      <h2 className="page-title">💊 Medical Stores Management</h2>

      {/* ---------------------------- 
           SEARCH + FILTER BAR 
      ---------------------------- */}
      <div className="filter-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search store name, code, city..."
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
              <th>Store Name</th>
              <th>Code</th>
              <th>City</th>
              <th>Contact</th>
              <th>License</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td>{s.code}</td>
                <td>{s.city || "—"}</td>
                <td>{s.owner_name || "—"}</td>
                <td>{s.license_number || "—"}</td>

                <td>
                  <span
                    className={`badge ${
                      s.status?.toLowerCase() ||
                      (s.verificationLevel === "1"
                        ? "approved"
                        : s.verificationLevel === "2"
                        ? "rejected"
                        : "pending")
                    }`}
                  >
                    {s.status ||
                      (s.verificationLevel === "1"
                        ? "Approved"
                        : s.verificationLevel === "2"
                        ? "Rejected"
                        : "Pending")}
                  </span>
                </td>

                <td>{s.createdAt || s.created_at || "—"}</td>

                <td>
                  <button className="btn view" onClick={() => setSelected(s)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Future modal */}
      {/* <DetailsModal item={selected} onClose={() => setSelected(null)} /> */}
    </div>
  );
}
