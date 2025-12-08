// src/components/LabManagement/LabPatientHistory.jsx
import React, { useState } from "react";
import "./LabPatientHistory.css";
import { LabAPI } from "../../services/api";

const LabPatientHistory = () => {
  const [searchId, setSearchId] = useState("");
  const [history, setHistory] = useState([]);
  const [patientName, setPatientName] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  // ============================
  // LOAD FULL HISTORY (3 tables)
  // ============================
  const loadHistory = async () => {
    if (!searchId.trim()) {
      setAlertMsg("⚠️ Please enter Patient ID.");
      return;
    }

    setLoading(true);
    setAlertMsg("");

    try {
      const res = await LabAPI.getFullHistory(searchId.trim());

      // 👉 Get patient name from prescriptions
      if (res.data.prescriptions && res.data.prescriptions.length > 0) {
        setPatientName(res.data.prescriptions[0].name || "-");
      } else {
        setPatientName("-");
      }

      // 👉 Get lab report list
      const data = res.data.labReports || [];
      setHistory(data);

      if (data.length === 0) setAlertMsg("❌ No reports found");
      else setAlertMsg(`✅ Found ${data.length} report(s).`);
    } catch (err) {
      console.error("[LabPatientHistory] Error:", err);
      setAlertMsg("❌ Failed to fetch reports. Please check backend or connection.");
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // VIEW FILE FUNCTION (100% WORKING)
  // ============================
  const viewFile = (report) => {
    try {
      if (!report.reportFile) {
        window.alert("No file found for this report");
        return;
      }

      // Clean base64 (remove newlines/spaces)
      const cleanBase64 = report.reportFile.replace(/\s/g, "");

      const byteCharacters = atob(cleanBase64);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: report.fileType });

      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL, "_blank");
    } catch (error) {
      console.error("File open error:", error);
      window.alert("❌ Unable to open file.");
    }
  };

  return (
    <div>
      <h2>Patient Result History</h2>

      <div className="lab-card">
        <div className="lab-card-header">Search Patient History</div>

        <div className="lab-search-bar">
          <input
            type="text"
            className="lab-input"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter Patient ID"
          />
          <button
            className="lab-btn lab-btn-primary"
            onClick={loadHistory}
            disabled={loading}
          >
            {loading ? "Loading..." : "Search History"}
          </button>
        </div>

        {alertMsg && <p className="lab-alert-msg">{alertMsg}</p>}

        <table className="lab-history-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Date & Time</th>
              <th>Test Name</th>
              <th>File Type</th>
              <th>View File</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", color: "#999" }}>
                  No reports found
                </td>
              </tr>
            ) : (
              history.map((item, i) => (
                <tr key={i}>
                  <td>{patientName}</td>
                  <td>{new Date(item.uploadedOn).toLocaleString()}</td>
                  <td>{item.testName ?? "-"}</td>
                  <td>{item.fileType}</td>

                  <td>
                    <span
                      className="lab-view-file"
                      onClick={() => viewFile(item)}
                      style={{ cursor: "pointer", color: "blue" }}
                    >
                      View File
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LabPatientHistory;
