import React from "react";
import "./css/DashboardHome.css";

export default function DashboardHome({ patients }) {
  // Calculate stats
  const total = patients.length;

  const pending = patients.reduce(
    (sum, p) => sum + p.prescriptions.filter((x) => x.status === "Pending").length,
    0
  );

  const completed = patients.reduce(
    (sum, p) => sum + p.prescriptions.filter((x) => x.status === "Given").length,
    0
  );

  return (
    <div className="dash-container">

      <div className="dash-card">
        <h2>{total}</h2>
        <p>Total Patients Today</p>
      </div>

      <div className="dash-card pending">
        <h2>{pending}</h2>
        <p>Pending Prescriptions</p>
      </div>

      <div className="dash-card completed">
        <h2>{completed}</h2>
        <p>Completed Prescriptions</p>
      </div>

    </div>
  );
}
