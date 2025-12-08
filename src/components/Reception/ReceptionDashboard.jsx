import React, { useEffect, useState } from "react";
import { PatientAPI, DoctorAPI } from "../../services/api.js";
import "./ReceptionDashboard.css";

export default function ReceptionDashboard() {
  const [patients, setPatients] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeStatus, setActiveStatus] = useState("all");
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState({
    all: 0,
    completed: 0,
    pending: 0,
    urgent: 0,
  });

  // ============================================================
  //     FETCH TODAY PATIENTS + FIX STATUS + ADD DOCTOR NAME
  // ============================================================
  const loadTodayPatients = async () => {
    try {
      setLoading(true);

      const res = await PatientAPI.getTodayAll();
      let list = res.data.data || [];

      // ------------------------
      // Normalize Status
      // ------------------------
      list = list.map((p) => {
        let ds = p.doctorStatus?.toLowerCase()?.trim() || "";
        let ls = p.labStatus?.toLowerCase()?.trim() || "";

        // Fix spelling issues
        if (
          ds === "checked" ||
          ds === "completed" ||
          ds === "compleated" ||
          ds === "done"
        ) {
          ds = "completed";
        } else if (ds === "pending") {
          ds = "pending";
        }

        if (ls === "urgent") ls = "urgent";
        else if (ls === "pending") ls = "pending";
        else if (ls === "completed" || ls === "done") ls = "completed";

        return { ...p, doctorStatus: ds, labStatus: ls };
      });

      // ------------------------
      // Attach Doctor Names
      // ------------------------
      list = await Promise.all(
        list.map(async (p) => {
          if (p.doctorId) {
            try {
              const dr = await DoctorAPI.getById(p.doctorId);
              return { ...p, doctorName: dr.data.data.doctorName };
            } catch {
              return { ...p, doctorName: "—" };
            }
          }
          return { ...p, doctorName: "—" };
        })
      );

      setPatients(list);
      setFiltered(list);

      // ------------------------
      // Count Stats
      // ------------------------
      setStats({
        all: list.length,
        completed: list.filter((p) => p.doctorStatus === "completed").length,
        pending: list.filter((p) => p.doctorStatus === "pending").length,
        urgent: list.filter((p) => p.labStatus === "urgent").length,
      });

      setLoading(false);
    } catch (err) {
      console.log("Reception Dashboard Error:", err);
      setLoading(false);
    }
  };

  // ============================================================
  //     FILTERING
  // ============================================================
  const filterData = (status) => {
    setActiveStatus(status);

    if (status === "all") return setFiltered(patients);

    if (status === "completed")
      return setFiltered(patients.filter((p) => p.doctorStatus === "completed"));

    if (status === "pending")
      return setFiltered(patients.filter((p) => p.doctorStatus === "pending"));

    if (status === "urgent")
      return setFiltered(patients.filter((p) => p.labStatus === "urgent"));
  };

  useEffect(() => {
    loadTodayPatients();
  }, []);

  // ============================================================
  //     UI
  // ============================================================
  return (
    <div className="recep-dashboard">
      <h2 className="title">Reception Dashboard</h2>

      {/* ==================== CARDS ==================== */}
      <div className="recep-stats">
        <div
          className={`recep-card ${activeStatus === "all" ? "active" : ""}`}
          onClick={() => filterData("all")}
        >
          <p>TODAY PATIENTS</p>
          <h3>{stats.all}</h3>
        </div>

        <div
          className={`recep-card ${
            activeStatus === "completed" ? "active" : ""
          }`}
          onClick={() => filterData("completed")}
        >
          <p>COMPLETED</p>
          <h3 className="completed">{stats.completed}</h3>
        </div>

        <div
          className={`recep-card ${
            activeStatus === "pending" ? "active" : ""
          }`}
          onClick={() => filterData("pending")}
        >
          <p>PENDING</p>
          <h3 className="pending">{stats.pending}</h3>
        </div>

        <div
          className={`recep-card ${
            activeStatus === "urgent" ? "active" : ""
          }`}
          onClick={() => filterData("urgent")}
        >
          <p>URGENT</p>
          <h3 className="urgent">{stats.urgent}</h3>
        </div>
      </div>

      {/* ==================== TABLE ==================== */}
      <div className="recep-table-card">
        <div className="table-header">
          {activeStatus.toUpperCase()} PATIENTS ({filtered.length})
        </div>

        {loading ? (
          <p className="loading">Loading...</p>
        ) : (
          <table className="recep-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient Name</th>
                <th>Date</th>
                <th>Disease</th>
                <th>Doctor Name</th>
                <th>Status</th>
                <th>Phone</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-data">
                    No records found
                  </td>
                </tr>
              ) : (
                filtered.map((p, i) => (
                  <tr key={i}>
                    <td>{p.patientId}</td>
                    <td>{p.name}</td>
                    <td>{p.appointmentDate}</td>
                    <td>{p.disease || "—"}</td>
                    <td>{p.doctorName}</td>

                    {/* FIXED STATUS DISPLAY */}
                    <td>
  {activeStatus === "urgent"
    ? "Urgent"
    : p.doctorStatus === "completed"
    ? "Completed"
    : p.doctorStatus === "pending"
    ? "Pending"
    : "—"}
</td>

                    <td>{p.phone || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
