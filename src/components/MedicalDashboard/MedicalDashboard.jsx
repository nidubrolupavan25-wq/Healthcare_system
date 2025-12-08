// import React, { useState, useEffect } from "react";
// import "./MedicalDashboard.css";
// import MedicalSidebar from "./MedicalSidebar";

// const STATUS = {
//   PENDING: "Pending",
//   GIVEN: "Given",
//   IN_STOCK: "In Stock",
//   LOW_STOCK: "Low Stock",
//   OUT_OF_STOCK: "Out of Stock",
// };

// const initialPatients = [
//   {
//     id: "P001",
//     name: "Ramesh Kumar",
//     doctorName: "Dr. Aakash Mehta",
//     prescriptions: [
//       {
//         medicine: "Paracetamol 500mg",
//         dosage: "1 tab × 2/day",
//         duration: "5 days",
//         timing: ["Morning", "Evening"],
//         status: STATUS.PENDING,
//       },
//       {
//         medicine: "Amoxicillin 250mg",
//         dosage: "1 cap × 1/day",
//         duration: "7 days",
//         timing: ["Morning"],
//         status: STATUS.PENDING,
//       },
//       {
//         medicine: "Dolo 650mg",
//         dosage: "1 tab × 3/day",
//         duration: "4 days",
//         timing: ["Morning", "Afternoon", "Night"],
//         status: STATUS.GIVEN,
//       },
//     ],
//   },
//   {
//     id: "P002",
//     name: "Priya Sharma",
//     doctorName: "Dr. Kavita Rao",
//     prescriptions: [
//       {
//         medicine: "Ibuprofen 400mg",
//         dosage: "1 tab × 3/day",
//         duration: "3 days",
//         timing: ["Morning", "Afternoon", "Night"],
//         status: STATUS.PENDING,
//       },
//       {
//         medicine: "Cough Syrup",
//         dosage: "10ml × 2/day",
//         duration: "5 days",
//         timing: ["Morning", "Night"],
//         status: STATUS.GIVEN,
//       },
//     ],
//   },
//   {
//     id: "P003",
//     name: "Vijay Patel",
//     doctorName: "Dr. Manish Shah",
//     prescriptions: [
//       {
//         medicine: "Vitamin C 500mg",
//         dosage: "1 tab × 2/day",
//         duration: "10 days",
//         timing: ["Morning", "Evening"],
//         status: STATUS.PENDING,
//       },
//       {
//         medicine: "Cetrizine 10mg",
//         dosage: "1 tab × 1/day",
//         duration: "2 days",
//         timing: ["Night"],
//         status: STATUS.GIVEN,
//       },
//       {
//         medicine: "B Complex",
//         dosage: "1 tab × 1/day",
//         duration: "15 days",
//         timing: ["Morning"],
//         status: STATUS.PENDING,
//       },
//     ],
//   },
// ];


// const initialStock = [
//   { name: "Paracetamol 500mg", stock: 25, rack: "Rack A1" },
//   { name: "Amoxicillin 250mg", stock: 3, rack: "Rack B2" },
//   { name: "Ibuprofen 400mg", stock: 0, rack: "Rack C3" },
//   { name: "Vitamin C 500mg", stock: 18, rack: "Rack D4" },
//   { name: "Cetrizine 10mg", stock: 2, rack: "Rack E1" },
// ];



// export default function MedicalDashboard() {
//   const [tab, setTab] = useState("patients");
//   const [patients, setPatients] = useState(initialPatients);
//   const [stock] = useState(initialStock);
//   const [search, setSearch] = useState("");
//   const [filtered, setFiltered] = useState(initialPatients);
//   const [filterType, setFilterType] = useState("All");

//   const [selectedPatient, setSelectedPatient] = useState(null);
// const [showModal, setShowModal] = useState(false);


//   // 🔍 Live Search + Filter
//   useEffect(() => {
//     const query = search.trim().toLowerCase();
//     let result = [...patients];

//     if (filterType !== "All") {
//       result = result
//         .map((p) => ({
//           ...p,
//           prescriptions: p.prescriptions.filter((rx) => rx.status === filterType),
//         }))
//         .filter((p) => p.prescriptions.length > 0);
//     }

//     if (query) {
//       result = result.filter(
//         (p) =>
//           p.id.toLowerCase().includes(query) ||
//           p.name.toLowerCase().includes(query)
//       );
//     }

//     setFiltered(result);
//   }, [search, patients, filterType]);

//   const getStockStatus = (qty) => {
//     if (qty === 0) return STATUS.OUT_OF_STOCK;
//     if (qty <= 3) return STATUS.LOW_STOCK;
//     return STATUS.IN_STOCK;
//   };

//   const handleGiveMedicine = (index, med) => {
//   const qty = parseInt(med.givenQty || 0);

//   if (qty <= 0) {
//     alert("Please enter valid quantity");
//     return;
//   }

//   // Find stock
//   const stockItem = stock.find((s) => s.name === med.medicine);

//   if (!stockItem) {
//     alert("Stock not found for this item");
//     return;
//   }

//   if (qty > stockItem.stock) {
//     alert("Entered quantity greater than available stock!");
//     return;
//   }

//   // Update patient prescription status
//   setSelectedPatient((prev) => ({
//     ...prev,
//     prescriptions: prev.prescriptions.map((item, idx) =>
//       idx === index ? { ...item, status: STATUS.GIVEN } : item
//     ),
//   }));

//   // Reduce stock
//   stockItem.stock -= qty;

//   alert("Medicine Given Successfully!");
// };

// const [inputValue, setInputValue] = useState("");

// const handleSubmit = () => {
//   if (inputValue.trim() === "") return alert("Please enter something");

//   console.log("Entered:", inputValue);

//   alert("Entered: " + inputValue);
//   setInputValue("");
// };



//   return (
//     <>
//     <MedicalSidebar/>
//     <div className="medx-dashboard-content">

//       {/* 👩‍⚕️ PATIENT PRESCRIPTIONS */}
//       {tab === "patients" && (
//         <section className="medx-patients-section">
//           <div className="medx-top-bar">
//             <div className="medx-search-container">
//               <span className="medx-search-icon">🔍</span>
//               <input
//                 type="text"
//                 placeholder="Search Patient ID or Name..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="medx-search-input"
//               />
//             </div>

//             <div className="medx-filter-container-right">
//               <label>Filter:</label>
//               <select
//                 value={filterType}
//                 onChange={(e) => setFilterType(e.target.value)}
//               >
//                 <option value="All">All</option>
//                 <option value="Pending">Pending</option>
//                 <option value="Given">Given</option>
//               </select>
//             </div>
//           </div>

//           <h2>👩‍⚕️ Patient Prescription List</h2>

//           <table className="medx-data-table">
//             <thead>
//               <tr>
//                 <th>Patient ID</th>
//                 <th>Name</th>
//                 <th>Total</th>
//                 <th>Pending</th>
//                 <th>Given</th>
//                 <th>View</th>
//                 <th>Complete</th>
//               </tr>
//             </thead>

//             <tbody>
//               {filtered.length > 0 ? (
//                 filtered.map((p) => {
//                   const pendingCount = p.prescriptions.filter(
//                     (r) => r.status === STATUS.PENDING
//                   ).length;

//                   const givenCount = p.prescriptions.filter(
//                     (r) => r.status === STATUS.GIVEN
//                   ).length;

//                   return (
//                     <tr key={p.id}>
//                       <td>{p.id}</td>
//                       <td>{p.name}</td>
//                       <td>{p.prescriptions.length}</td>
//                       <td>{pendingCount}</td>
//                       <td>{givenCount}</td>

//                       <td>
//                         <button
//   className="medx-view-btn"
//   onClick={() => setSelectedPatient(p)}
// >
//   🔍 View
// </button>

//                       </td>

//                       <td>
//                         <button
//                           className="medx-give-btn"
//                           disabled={pendingCount === 0}
//                           onClick={() =>
//                             setPatients((prev) =>
//                               prev.map((pt) =>
//                                 pt.id === p.id
//                                   ? {
//                                       ...pt,
//                                       prescriptions: pt.prescriptions.map(
//                                         (rx) => ({ ...rx, status: STATUS.GIVEN })
//                                       ),
//                                     }
//                                   : pt
//                               )
//                             )
//                           }
//                         >
//                           ✅ Complete
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })
//               ) : (
//                 <tr>
//                   <td colSpan="7" className="medx-no-result">
//                     No patients found...
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </section>
//       )}

//       {/* 📦 MEDICINE STOCK */}
//       {tab === "stock" && (
//         <section className="medx-stock-section">
//           <h2>📦 Medicine Stock Overview</h2>

//           <table className="medx-data-table">
//             <thead>
//               <tr>
//                 <th>Medicine</th>
//                 <th>Stock</th>
//                 <th>Rack</th>
//                 <th>Status</th>
//                 <th>Input</th>
//     <th>Enter</th>
//               </tr>
//             </thead>

//             <tbody>
//               {stock.map((item, index) => {
//                 const status = getStockStatus(item.stock);
//                 return (
//                   <tr key={index}>
//                     <td>{item.name}</td>
//                     <td>{item.stock}</td>
//                     <td>{item.rack}</td>
//                     <td
//                       className={`medx-status ${status
//                         .replace(/\s/g, "")
//                         .toLowerCase()}`}
//                     >
//                       {status}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </section>
//       )}

//      {selectedPatient && (
//   <div className="medx-modal-overlay">
//     <div className="medx-modal-box">

//       <button className="medx-close" onClick={() => setSelectedPatient(null)}>✖</button>

//       {/* Patient Details Card */}
//       <div className="medx-details-card">
//   <h2>👤 Patient Details</h2>

//   <p><strong>Patient ID:</strong> {selectedPatient.id}</p>
//   <p><strong>Name:</strong> {selectedPatient.name}</p>

//   {/* ⭐ ADD THIS ⭐ */}
//   <p><strong>Doctor Name:</strong> {selectedPatient.doctorName}</p>

//   <p><strong>Total Medicines:</strong> {selectedPatient.prescriptions.length}</p>
// </div>


     


//       {/* Table */}
//       <div className="medx-table-card">
//         <h3>💊 Prescribed Medicines</h3>
//         <table className="medx-data-table">
//           <thead>
//             <tr>
//               <th>Medicine</th>
//               <th>Dosage</th>
//               <th>Duration</th>
//               <th>Timings</th>
//               <th>Status</th>
//               <th>Input</th>
//     <th>Enter</th>
//             </tr>
//           </thead>
//         <tbody>
//   {selectedPatient.prescriptions.map((med, i) => (
//     <tr key={i}>
//       <td>{med.medicine}</td>
//       <td>{med.dosage}</td>
//       <td>{med.duration}</td>
//       <td>{med.timing.join(", ")}</td>

//       <td>
//         <span className={`medx-status-chip ${med.status.toLowerCase()}`}>
//           {med.status}
//         </span>
//       </td>

//       {/* INPUT FIELD */}
//       <td>
//         <input
//           type="number"
//           className="medx-row-input"
//           placeholder="Qty"
//           value={med.givenQty || ""}
//           disabled={med.status === STATUS.GIVEN}
//           onChange={(e) => {
//             const value = e.target.value;

//             setSelectedPatient((prev) => ({
//               ...prev,
//               prescriptions: prev.prescriptions.map((item, idx) =>
//                 idx === i ? { ...item, givenQty: value } : item
//               ),
//             }));
//           }}
//         />
//       </td>

//       {/* SUBMIT BUTTON */}
//       <td>
//         <button
//           className="medx-row-enter-btn"
//           disabled={med.status === STATUS.GIVEN}
//           onClick={() => handleGiveMedicine(i, med)}
//         >
//           Submit
//         </button>
//       </td>
//     </tr>
//   ))}
// </tbody>

//         </table>
//       </div>

//     </div>
    
//   </div>
// )}


//     </div>
//     </>
//   );
// }

import React, { useState } from "react";
import MedicalSidebar from "./MedicalSidebar";
import "./css/MedicalDashboard.css";
import PatientPrescription from "./jsx_files/PatientPrescription";
import MedicalStock from "./jsx_files/MedicalStock";
import Customers from './jsx_files/Customers';
import Inventory from "./jsx_files/Inventory";
import Billing from "./jsx_files/Billing";
import Orders from "./jsx_files/Orders";
import SearchPage from "./jsx_files/SearchPage";



const MedicalDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage] = useState("dashboard");

  return (
    <div className="med-wrapper">

      <MedicalSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setPage={setPage}
      />

      <div className="med-main">

        {/* ⭐ DASHBOARD PAGE */}
        {page === "dashboard" && (
          <div className="med-dashboard-container">

            {/* ⭐ CARDS */}
            <div className="cards-row">
              <div className="dash-card">
                <h3>Today Total Prescriptions</h3>
                <p>40</p>
              </div>

              <div className="dash-card pending">
                <h3>Pending</h3>
                <p>12</p>
              </div>

              <div className="dash-card completed">
                <h3>Completed</h3>
                <p>28</p>
              </div>
            </div>

            <h2 className="section-title">Today's Prescriptions</h2>

            {/* ⭐ TABLE */}
            <table className="prescription-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Medicine</th>
                  <th>Status</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Amit Kumar</td>
                  <td>Paracetamol</td>
                  <td className="status pending">Pending</td>
                  <td>9:30 AM</td>
                </tr>

                <tr>
                  <td>Priya Singh</td>
                  <td>Vitamin D</td>
                  <td className="status completed">Completed</td>
                  <td>10:45 AM</td>
                </tr>

                <tr>
                  <td>Rahul Mehta</td>
                  <td>Azithromycin</td>
                  <td className="status pending">Pending</td>
                  <td>11:15 AM</td>
                </tr>
              </tbody>
            </table>

          </div>
        )}

        {/* ⭐ PATIENT PRESCRIPTION PAGE */}
        {page === "patient" && (
          <PatientPrescription />
        )}

        {/* ⭐ MEDICAL STORE PAGE */}
        {page === "store" && (
          <MedicalStock />
        )}
        

        {/* ⭐ HISTORY PAGE */}
        {/* {page === "history" && (
          <MedicalHistory />
        )} */}
        {page === "billing" && <Billing />}
        {page === "inventory" && <Inventory />}
        {page === "customers" && <Customers />}
         {page === "orders" && <Orders />}
         {page === "search" && <SearchPage />}

      </div>
    </div>
  );
};

export default MedicalDashboard;
