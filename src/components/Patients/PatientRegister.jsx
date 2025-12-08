import React, { useState, useEffect, useRef } from "react";
import { PatientAPI, DoctorAPI } from "../../services/api";

const PatientRegister = () => {
  // ────── Form state ──────
  const initialFormState = {
    fullName: "",
    aadhar: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
    doctorId: "",
    diseases: "",
    appointmentDate: "",
    appointmentTime: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [savedPatient, setSavedPatient] = useState(null);
  const [showPrintView, setShowPrintView] = useState(false);

  // ────── Fetch doctors ──────
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await DoctorAPI.getAll();
        setDoctors(response.data.data || []);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };
    fetchDoctors();
  }, []);

  // ────── Input handler ──────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ────── Submit handler ──────
  const handleSubmit = async () => {
    // Validation
    if (!formData.fullName || !formData.aadhar || !formData.phone || 
        !formData.dob || !formData.gender || !formData.doctorId || !formData.address) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        name: formData.fullName,
        age: formData.dob
          ? new Date().getFullYear() - new Date(formData.dob).getFullYear()
          : null,
        gender: formData.gender,
        mobile: formData.phone,
        email: `${formData.fullName.toLowerCase().replace(" ", ".")}@example.com`,
        address: formData.address,
        disease: formData.diseases,
        doctor: { doctorId: parseInt(formData.doctorId) },
        admissionDate:
          formData.appointmentDate || new Date().toISOString().split("T")[0],
        status: "Admitted",
      };

      const response = await PatientAPI.add(payload);
      const newPatient = {
        ...payload,
        patientId: response.data?.patientId ?? "TMP-" + Date.now(),
        appointmentTime: formData.appointmentTime,
        doctorName:
          doctors.find((d) => d.doctorId === parseInt(formData.doctorId))
            ?.doctorName ?? "",
        aadhar: formData.aadhar,
      };

      setSavedPatient(newPatient);
      setShowPrintView(true);
      alert("Patient added successfully!");

      // reset form
      setFormData(initialFormState);
    } catch (err) {
      console.error("Error:", err);
      setError(
        err?.response?.data?.message ||
          "Error adding patient. Check console for details."
      );
    } finally {
      setLoading(false);
    }
  };

  // ────── Print handler ──────
  const handlePrint = () => {
    window.print();
  };

  const handleClosePrintView = () => {
    setShowPrintView(false);
    setSavedPatient(null);
  };

  // ────── PRINT VIEW (Full Page) ──────
  if (showPrintView && savedPatient) {
    return (
      <>
        <style>{`
          @media print {
            body * {
              visibility: hidden;
            }
            .printable-slip,
            .printable-slip * {
              visibility: visible;
            }
            .printable-slip {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            .no-print {
              display: none !important;
            }
          }
        `}</style>

        <div style={{ 
          minHeight: "100vh", 
          backgroundColor: "#f5f5f5",
          padding: "20px"
        }}>
          <div style={{ 
            maxWidth: "900px", 
            margin: "0 auto",
            backgroundColor: "#fff"
          }}>
            {/* Top Action Bar - No Print */}
            <div className="no-print" style={{ 
              padding: "20px",
              borderBottom: "2px solid #1a5276",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#f8f9fa"
            }}>
              <h3 style={{ margin: 0, color: "#1a5276" }}>Patient Registration Card</h3>
              <div>
                <button 
                  onClick={handlePrint}
                  style={{
                    backgroundColor: "#28a745",
                    color: "white",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginRight: "10px",
                    fontSize: "16px",
                    fontWeight: "bold"
                  }}
                >
                  🖨 Print Card
                </button>
                <button 
                  onClick={handleClosePrintView}
                  style={{
                    backgroundColor: "#6c757d",
                    color: "white",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "16px"
                  }}
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Printable Slip */}
            <div className="printable-slip" style={{
              padding: "40px",
              fontFamily: "Arial, sans-serif",
            }}>
              {/* Header */}
              <div style={{ 
                textAlign: "center", 
                marginBottom: "30px",
                borderBottom: "3px solid #1a5276",
                paddingBottom: "20px"
              }}>
                <div style={{ fontSize: "40px", marginBottom: "10px" }}>🏥</div>
                <h1 style={{ 
                  color: "#1a5276", 
                  margin: "0 0 5px 0",
                  fontSize: "32px",
                  letterSpacing: "2px",
                  fontWeight: "bold"
                }}>
                  HOSPITAL MANAGEMENT SYSTEM
                </h1>
                <h2 style={{ 
                  color: "#555", 
                  margin: "5px 0 0 0",
                  fontSize: "20px",
                  fontWeight: "normal"
                }}>
                  Patient Registration Card
                </h2>
              </div>

              {/* Patient Details Table */}
              <table style={{ 
                width: "100%", 
                borderCollapse: "collapse",
                marginBottom: "30px",
                border: "1px solid #ddd"
              }}>
                <tbody>
                  <tr>
                    <td style={tdLabel}>Patient ID</td>
                    <td style={tdValue}><strong>{savedPatient.patientId}</strong></td>
                  </tr>
                  <tr>
                    <td style={tdLabel}>Full Name</td>
                    <td style={tdValue}>{savedPatient.name}</td>
                  </tr>
                  <tr>
                    <td style={tdLabel}>Age / Gender</td>
                    <td style={tdValue}>
                      {savedPatient.age} years / {savedPatient.gender}
                    </td>
                  </tr>
                  <tr>
                    <td style={tdLabel}>Aadhar Number</td>
                    <td style={tdValue}>{savedPatient.aadhar}</td>
                  </tr>
                  <tr>
                    <td style={tdLabel}>Mobile Number</td>
                    <td style={tdValue}>{savedPatient.mobile}</td>
                  </tr>
                  <tr>
                    <td style={tdLabel}>Email Address</td>
                    <td style={tdValue}>{savedPatient.email}</td>
                  </tr>
                  <tr>
                    <td style={tdLabel}>Address</td>
                    <td style={tdValue}>{savedPatient.address}</td>
                  </tr>
                  <tr>
                    <td style={tdLabel}>Assigned Doctor</td>
                    <td style={tdValue}><strong>{savedPatient.doctorName}</strong></td>
                  </tr>
                  <tr>
                    <td style={tdLabel}>Disease(s)</td>
                    <td style={tdValue}>{savedPatient.disease || "Not specified"}</td>
                  </tr>
                  <tr>
                    <td style={tdLabel}>Admission Date</td>
                    <td style={tdValue}>{savedPatient.admissionDate}</td>
                  </tr>
                  <tr>
                    <td style={tdLabel}>Appointment Time</td>
                    <td style={tdValue}>
                      {savedPatient.appointmentTime || "Not specified"}
                    </td>
                  </tr>
                  <tr>
                    <td style={tdLabel}>Status</td>
                    <td style={{
                      ...tdValue,
                      color: "#28a745",
                      fontWeight: "bold",
                      fontSize: "16px"
                    }}>
                      {savedPatient.status}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Important Instructions */}
              <div style={{
                border: "2px dashed #1a5276",
                padding: "20px",
                marginBottom: "20px",
                backgroundColor: "#f0f4f8",
                borderRadius: "8px"
              }}>
                <h3 style={{ 
                  color: "#1a5276", 
                  marginTop: 0,
                  fontSize: "18px"
                }}>
                  📋 Important Instructions:
                </h3>
                <ul style={{ 
                  margin: "10px 0",
                  paddingLeft: "20px",
                  lineHeight: "1.8"
                }}>
                  <li>Please arrive 15 minutes before your appointment time</li>
                  <li>Bring this slip along with your medical records</li>
                  <li>Carry a valid ID proof for verification</li>
                  <li>For cancellations, contact reception 24 hours in advance</li>
                </ul>
              </div>

              {/* Footer */}
              <div style={{
                borderTop: "2px solid #ddd",
                paddingTop: "20px"
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12px",
                  color: "#666",
                  marginBottom: "15px"
                }}>
                  <div>
                    <strong>Generated On:</strong> {new Date().toLocaleString()}
                  </div>
                  <div>
                    <strong>Print Date:</strong> {new Date().toLocaleDateString()}
                  </div>
                </div>
                
                <div style={{
                  textAlign: "center",
                  fontSize: "11px",
                  color: "#999",
                  borderTop: "1px solid #eee",
                  paddingTop: "15px"
                }}>
                  <p style={{ margin: "5px 0" }}>
                    📞 Contact: +91-1800-123-4567 | 📧 info@hospital.com
                  </p>
                  <p style={{ margin: "5px 0" }}>
                    📍 Address: 123 Medical Street, Healthcare City, HC 123456
                  </p>
                  <p style={{ margin: "10px 0 5px 0", fontSize: "10px" }}>
                    This is a computer-generated document. No signature is required.
                  </p>
                  <p style={{ margin: "5px 0", fontSize: "10px" }}>
                    Please keep this card for your records and present it during your visit.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Action Buttons - No Print */}
            <div className="no-print" style={{ 
              padding: "20px",
              borderTop: "2px solid #1a5276",
              display: "flex",
              justifyContent: "center",
              gap: "15px",
              backgroundColor: "#f8f9fa"
            }}>
              <button 
                onClick={handlePrint}
                style={{
                  backgroundColor: "#28a745",
                  color: "white",
                  padding: "14px 40px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "18px",
                  fontWeight: "bold",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}
              >
                🖨 Print This Card
              </button>
              <button 
                onClick={handleClosePrintView}
                style={{
                  backgroundColor: "#6c757d",
                  color: "white",
                  padding: "14px 40px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "18px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}
              >
                ✕ Close & Return
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ────── MAIN FORM VIEW ──────
  return (
    <div className="form-container" style={{ maxWidth: 900, margin: "auto", padding: "20px" }}>
      <h2 style={{ color: "#1a5276", marginBottom: "10px" }}>Add Patient</h2>
      {error && (
        <p style={{ 
          color: "#dc3545", 
          padding: "12px", 
          backgroundColor: "#f8d7da", 
          borderRadius: "4px",
          border: "1px solid #f5c6cb",
          marginBottom: "20px"
        }}>
          {error}
        </p>
      )}

      <div>
        <div
          className="grid-container"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          <input
            type="text"
            name="fullName"
            placeholder="Full Name *"
            value={formData.fullName}
            onChange={handleChange}
            style={inputStyle}
          />
          <input
            type="text"
            name="aadhar"
            placeholder="Aadhar Number *"
            value={formData.aadhar}
            onChange={handleChange}
            style={inputStyle}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number *"
            value={formData.phone}
            onChange={handleChange}
            style={inputStyle}
          />
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            style={inputStyle}
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">Select Gender *</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <select
            name="doctorId"
            value={formData.doctorId}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">Select Doctor *</option>
            {doctors.map((doc) => (
              <option key={doc.doctorId} value={doc.doctorId}>
                {doc.doctorName} ({doc.specialization})
              </option>
            ))}
          </select>

          <input
            type="text"
            name="diseases"
            placeholder="Diseases"
            value={formData.diseases}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div style={{ marginTop: 12 }}>
          <label style={labelStyle}>Appointment Date</label>
          <input
            type="date"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleChange}
            style={{ ...inputStyle, width: "100%" }}
          />
        </div>

        <div style={{ marginTop: 12 }}>
          <label style={labelStyle}>Appointment Time</label>
          <input
            type="time"
            name="appointmentTime"
            value={formData.appointmentTime}
            onChange={handleChange}
            style={{ ...inputStyle, width: "100%" }}
          />
        </div>

        <textarea
          name="address"
          placeholder="Address *"
          value={formData.address}
          onChange={handleChange}
          style={{ 
            ...inputStyle,
            width: "100%", 
            marginTop: 12, 
            minHeight: 80,
            resize: "vertical"
          }}
        />

        <button 
          onClick={handleSubmit}
          disabled={loading} 
          style={{ 
            marginTop: 20,
            padding: "14px 30px",
            fontSize: "16px",
            backgroundColor: loading ? "#6c757d" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "bold",
            width: "100%",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}
        >
          {loading ? "Adding Patient..." : "➕ Add Patient"}
        </button>
      </div>
    </div>
  );
};

/* ────── Styles ────── */
const tdLabel = {
  fontWeight: "bold",
  width: "40%",
  padding: "14px 16px",
  borderBottom: "1px solid #ddd",
  backgroundColor: "#f0f4f8",
  color: "#1a5276",
  fontSize: "14px"
};

const tdValue = {
  padding: "14px 16px",
  borderBottom: "1px solid #ddd",
  fontSize: "14px",
  color: "#333"
};

const inputStyle = {
  padding: "10px 12px",
  fontSize: "14px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  width: "100%",
  boxSizing: "border-box"
};

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  fontWeight: "600",
  color: "#333",
  fontSize: "14px"
};

export default PatientRegister;