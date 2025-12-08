import React, { useState, useEffect } from "react";
import { PatientAPI, DoctorAPI } from "../../services/api";
import "./ReceptionPatientRegister.css";

const ReceptionPatientRegister = () => {

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
    appointmentTime: ""
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [savedPatient, setSavedPatient] = useState(null);
  const [showPrintView, setShowPrintView] = useState(false);

  /* ------------------------------------------
      FORMAT DATE → DD-MON-YY (Oracle Format)
  ------------------------------------------- */
  const formatOracleDate = (dateStr) => {
    if (!dateStr) return null;

    const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const mon = months[d.getMonth()];
    const year = String(d.getFullYear()).slice(-2);

    return `${day}-${mon}-${year}`;
  };

  /* ------------------------------------------
      FORMAT TIME → 10:30 AM / 04:45 PM
  ------------------------------------------- */
  const convertToAMPM = (time24) => {
    if (!time24) return "";
    let [hrs, mins] = time24.split(":");
    hrs = parseInt(hrs);

    const ampm = hrs >= 12 ? "PM" : "AM";
    hrs = hrs % 12 || 12;

    return `${hrs}:${mins} ${ampm}`;
  };

  /* ------------------------------------------
      FETCH DOCTORS
  ------------------------------------------- */
  useEffect(() => {
    DoctorAPI.getAll()
      .then((resp) => setDoctors(resp.data?.data || []))
      .catch((err) => console.error("Doctor Fetch Error:", err));
  }, []);

  /* ------------------------------------------
      HANDLE INPUT CHANGE
  ------------------------------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  /* ------------------------------------------
      SUBMIT FORM
  ------------------------------------------- */
  const handleSubmit = async () => {
    if (!formData.fullName || !formData.aadhar || !formData.phone ||
        !formData.dob || !formData.gender || !formData.doctorId || !formData.address) {
      setError("Please fill all required fields");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const oracleDate = formatOracleDate(formData.appointmentDate);
      const timeAMPM = convertToAMPM(formData.appointmentTime);

     const payload = {
  name: formData.fullName,
  aadhar: formData.aadhar,
  phone: formData.phone,
  gender: formData.gender,
  dateOfBirth: formData.dob,
  address: formData.address,
  doctorId: parseInt(formData.doctorId),
  disease: formData.diseases,

  // Store date normally in YYYY-MM-DD
  appointmentDate: formData.appointmentDate,
  appointmentTime: formData.appointmentTime,

  // Store normal ISO date for LocalDate field
  dateIssued: formData.appointmentDate,

  medisionStatus: "Pending",
  doctorStatus: "Pending",
  labStatus: "Pending"
};

      const resp = await PatientAPI.add(payload);

      const newPatient = {
        ...payload,
        patientId: resp.data?.data?.patientId ?? "TEMP-" + Date.now(),
        doctorName:
          doctors.find((d) => d.doctorId == formData.doctorId)?.doctorName ||
          "",
      };

      setSavedPatient(newPatient);
      setShowPrintView(true);
      setFormData(initialFormState);
      alert("Patient added successfully!");

    } catch (err) {
      console.error(err);

      const msg = err.response?.data?.message || "Error adding patient";

      if (msg.toLowerCase().includes("aadhar")) setError("❌ Aadhar already exists!");
      else if (msg.toLowerCase().includes("phone")) setError("❌ Phone already exists!");
      else setError(msg);

    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------------------
      PRINT HANDLERS
  ------------------------------------------- */
  const handlePrint = () => window.print();
  const handleClosePrintView = () => {
    setShowPrintView(false);
    setSavedPatient(null);
  };

  /* ------------------------------------------
      PRINT VIEW
  ------------------------------------------- */
 if (showPrintView && savedPatient) {
  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .a4-print, .a4-print * { visibility: visible; }
          .a4-print {
            position: absolute;
            top: 0;
            left: 0;
            width: 21cm !important;
            min-height: 29.7cm !important;
            padding: 20mm !important;
            background: white !important;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="a4-bg">
        <div className="a4-print">

          {/* HEADER BAR */}
          <div className="no-print" style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginBottom: "20px"
          }}>
            <button className="btn-print" onClick={handlePrint}>
              🖨 Print
            </button>
            <button className="btn-close" onClick={handleClosePrintView}>
              ✕ Close
            </button>
          </div>

          {/* MAIN A4 CONTENT */}
          <div style={{ textAlign: "center", marginBottom: "25px" }}>
            <h1 style={{ margin: 0, color: "#0A3D62", fontSize: "28px" }}>
              🏥 HOSPITAL MANAGEMENT SYSTEM
            </h1>
            <h2 style={{ margin: "10px 0 0 0", fontSize: "20px", color: "#222" }}>
              Patient Registration Card
            </h2>
            <div style={{
              width: "100%",
              height: "3px",
              background: "#0A3D62",
              marginTop: "12px"
            }}></div>
          </div>

          {/* PATIENT DETAILS TABLE */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "15px"
            }}
          >
            <tbody>
              {[
                ["Patient ID", savedPatient.patientId],
                ["Full Name", savedPatient.name],
                ["Aadhar Number", savedPatient.aadhar],
                ["Phone Number", savedPatient.phone],
                ["Gender", savedPatient.gender],
                ["Address", savedPatient.address],
                ["Doctor", savedPatient.doctorName],
                ["Disease", savedPatient.disease || "N/A"],
                ["Appointment Date", savedPatient.appointmentDate],
                ["Appointment Time", savedPatient.appointmentTime],
                ["Generated On", new Date().toLocaleString()],
              ].map(([label, value], index) => (
                <tr key={index}>
                  <td
                    style={{
                      padding: "10px 15px",
                      border: "1px solid #ccc",
                      fontWeight: "600",
                      width: "35%",
                      background: "#F7F9FA"
                    }}
                  >
                    {label}
                  </td>
                  <td
                    style={{
                      padding: "10px 15px",
                      border: "1px solid #ccc",
                    }}
                  >
                    {value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* FOOTER */}
          <div style={{
            marginTop: "40px",
            textAlign: "center",
            fontSize: "13px",
            color: "#555"
          }}>
            <p>Thank you for visiting our hospital.</p>
            <p>This is a system-generated slip. No signature required.</p>
          </div>

        </div>
      </div>
    </>
  );
}

  /* ------------------------------------------
      FORM VIEW
  ------------------------------------------- */
  return (
    <div className="register-container">

      <h2 className="title">Add Patient</h2>

      {error && <p className="error-box">{error}</p>}

      <div className="grid-2">
        <input name="fullName" placeholder="Full Name *" value={formData.fullName} onChange={handleChange} />
        <input name="aadhar" placeholder="Aadhar Number *" value={formData.aadhar} onChange={handleChange} />
        <input name="phone" placeholder="Phone Number *" value={formData.phone} onChange={handleChange} />
        <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
        
        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="">Select Gender *</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <select name="doctorId" value={formData.doctorId} onChange={handleChange}>
          <option value="">Select Doctor *</option>
          {doctors.map((doc) => (
            <option key={doc.doctorId} value={doc.doctorId}>
              {doc.doctorName} ({doc.specialization})
            </option>
          ))}
        </select>

        <input name="diseases" placeholder="Diseases" value={formData.diseases} onChange={handleChange} />
      </div>

      <label>Appointment Date</label>
      <input type="date" name="appointmentDate" value={formData.appointmentDate} onChange={handleChange} />

      <label>Appointment Time</label>
      <input type="time" name="appointmentTime" value={formData.appointmentTime} onChange={handleChange} />

      <textarea
        name="address"
        placeholder="Address *"
        value={formData.address}
        onChange={handleChange}
      ></textarea>

      <button className="btn-submit" disabled={loading} onClick={handleSubmit}>
        {loading ? "Adding..." : "➕ Add Patient"}
      </button>

    </div>
  );
};

export default ReceptionPatientRegister;
