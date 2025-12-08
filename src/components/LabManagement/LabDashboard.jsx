import React, { useState, useEffect } from "react";
import { LabAPI } from "../../services/api";
import "./LabDashboard.css";

const LabDashboard = () => {
  const [stats, setStats] = useState({
    urgent: 0,
    pending: 0,
    completed: 0,
    all: 0,
  });

  const [tableData, setTableData] = useState([]);
  const [activeStatus, setActiveStatus] = useState("all");
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch data based on status
  const fetchData = async (status = "all") => {
    try {
      setLoading(true);
      let response;
      switch (status) {
        case "urgent":
          response = await LabAPI.getUrgent();
          break;
        case "pending":
          response = await LabAPI.getPending();
          break;
        case "completed":
          response = await LabAPI.getCompleted();
          break;
        default:
          response = await LabAPI.getAll();
      }

      if (response?.data) {
        setTableData(response.data.data || []);
      }

      setActiveStatus(status);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching lab data:", error);
      setLoading(false);
    }
  };

  // 🔹 Fetch count for all statuses
  const fetchCounts = async () => {
    try {
      const urgent = await LabAPI.getUrgent();
      const pending = await LabAPI.getPending();
      const completed = await LabAPI.getCompleted();
      const all = await LabAPI.getAll();

      setStats({
        urgent: urgent.data.count || 0,
        pending: pending.data.count || 0,
        completed: completed.data.count || 0,
        all: all.data.count || 0,
      });
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  useEffect(() => {
    fetchCounts();
    fetchData("all");
  }, []);

  return (
    <div className="lab-dashboard">
      <h2>Laboratory Dashboard</h2>

      {/* --- Stats Cards --- */}
      <div className="lab-stats-grid">
        <div
          className={`lab-stat-card ${activeStatus === "all" ? "active" : ""}`}
          onClick={() => fetchData("all")}
        >
          <div className="lab-stat-label">TODAY'S SAMPLES</div>
          <div className="lab-stat-number">{stats.all}</div>
        </div>

        <div
          className={`lab-stat-card ${activeStatus === "completed" ? "active" : ""}`}
          onClick={() => fetchData("completed")}
        >
          <div className="lab-stat-label">RESULTS UPLOADED</div>
          <div className="lab-stat-number completed">{stats.completed}</div>
        </div>

        <div
          className={`lab-stat-card ${activeStatus === "pending" ? "active" : ""}`}
          onClick={() => fetchData("pending")}
        >
          <div className="lab-stat-label">PENDING ENTRY</div>
          <div className="lab-stat-number pending">{stats.pending}</div>
        </div>

        <div
          className={`lab-stat-card ${activeStatus === "urgent" ? "active" : ""}`}
          onClick={() => fetchData("urgent")}
        >
          <div className="lab-stat-label">URGENT REPORTS</div>
          <div className="lab-stat-number urgent">{stats.urgent}</div>
        </div>
      </div>

      {/* --- Table Section --- */}
      <div className="lab-card">
        <div className="lab-card-header">
          {activeStatus.toUpperCase()} LAB TESTS ({tableData.length})
        </div>

        {loading ? (
          <div className="loading-text">Loading...</div>
        ) : (
          <table className="lab-table">
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Patient Name</th>
                <th>Selected Tests</th>
                <th>Date Issued</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tableData.length > 0 ? (
                tableData.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.patientId}</td>
                    <td>{row.patientName}</td>
                    <td>{row.selectedTests || "—"}</td>
                    <td>
                      {row.dateIssued
                        ? new Date(row.dateIssued).toLocaleString()
                        : "—"}
                    </td>
                    <td>
                      <span className={`lab-badge lab-badge-${row.labStatus}`}>
                        {row.labStatus?.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", color: "#777" }}>
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LabDashboard;
