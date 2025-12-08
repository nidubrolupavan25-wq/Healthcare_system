import React, { useState, useEffect } from "react";
import "../css/PatientPrescription.css";

const STATUS = {
  PENDING: "Pending",
  GIVEN: "Given",
  IN_STOCK: "In Stock",
  LOW_STOCK: "Low Stock",
  OUT_OF_STOCK: "Out of Stock",
};

const initialPatients = [
  {
    id: "P001",
    name: "Ramesh Kumar",
    doctorName: "Dr. Aakash Mehta",
    prescriptions: [
      {
        medicine: "Paracetamol 500mg",
        dosage: "1 tab × 2/day",
        duration: "5 days",
        timing: ["Morning", "Evening"],
        status: STATUS.PENDING,
      },
      {
        medicine: "Amoxicillin 250mg",
        dosage: "1 cap × 1/day",
        duration: "7 days",
        timing: ["Morning"],
        status: STATUS.PENDING,
      },
      {
        medicine: "Dolo 650mg",
        dosage: "1 tab × 3/day",
        duration: "4 days",
        timing: ["Morning", "Afternoon", "Night"],
        status: STATUS.GIVEN,
      },
    ],
  },
  {
    id: "P002",
    name: "Priya Sharma",
    doctorName: "Dr. Kavita Rao",
    prescriptions: [
      {
        medicine: "Ibuprofen 400mg",
        dosage: "1 tab × 3/day",
        duration: "3 days",
        timing: ["Morning", "Afternoon", "Night"],
        status: STATUS.PENDING,
      },
      {
        medicine: "Cough Syrup",
        dosage: "10ml × 2/day",
        duration: "5 days",
        timing: ["Morning", "Night"],
        status: STATUS.GIVEN,
      },
    ],
  },
  {
    id: "P003",
    name: "Vijay Patel",
    doctorName: "Dr. Manish Shah",
    prescriptions: [
      {
        medicine: "Vitamin C 500mg",
        dosage: "1 tab × 2/day",
        duration: "10 days",
        timing: ["Morning", "Evening"],
        status: STATUS.PENDING,
      },
      {
        medicine: "Cetrizine 10mg",
        dosage: "1 tab × 1/day",
        duration: "2 days",
        timing: ["Night"],
        status: STATUS.GIVEN,
      },
      {
        medicine: "B Complex",
        dosage: "1 tab × 1/day",
        duration: "15 days",
        timing: ["Morning"],
        status: STATUS.PENDING,
      },
    ],
  },
];

const initialStock = [
  { name: "Paracetamol 500mg", stock: 25, rack: "Rack A1" },
  { name: "Amoxicillin 250mg", stock: 3, rack: "Rack B2" },
  { name: "Ibuprofen 400mg", stock: 0, rack: "Rack C3" },
  { name: "Vitamin C 500mg", stock: 18, rack: "Rack D4" },
  { name: "Cetrizine 10mg", stock: 2, rack: "Rack E1" },
];

export default function PatientPrescription() {
  const [patients, setPatients] = useState(initialPatients);
  const [stock, setStock] = useState(initialStock);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(initialPatients);
  const [filterType, setFilterType] = useState("All");
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Filter + Search
  useEffect(() => {
    let result = [...patients];

    if (filterType !== "All") {
      result = result
        .map((p) => ({
          ...p,
          prescriptions: p.prescriptions.filter((rx) => rx.status === filterType),
        }))
        .filter((p) => p.prescriptions.length > 0);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.id.toLowerCase().includes(q) || p.name.toLowerCase().includes(q)
      );
    }

    setFiltered(result);
  }, [search, filterType, patients]);

  // Give Medicine
  const handleGiveMedicine = (index, med) => {
    const qty = Number(med.givenQty || 0);
    if (qty < 1) return alert("Invalid Quantity");

    const stkIndex = stock.findIndex((s) => s.name === med.medicine);
    if (stkIndex === -1) return alert("Stock not found");

    if (qty > stock[stkIndex].stock) return alert("Not enough stock");

    const updatedStock = [...stock];
    updatedStock[stkIndex].stock -= qty;
    setStock(updatedStock);

    const updatedSelected = {
      ...selectedPatient,
      prescriptions: selectedPatient.prescriptions.map((rx, i) =>
        i === index ? { ...rx, status: STATUS.GIVEN } : rx
      ),
    };

    setSelectedPatient(updatedSelected);

    setPatients((prev) =>
      prev.map((p) =>
        p.id === selectedPatient.id ? updatedSelected : p
      )
    );

    alert("Medicine Given");
  };

  return (
    <div className="pres-page">

      <h2 className="page-title">Patient Prescription</h2>

      {/* Search + Filter */}
      <div className="top-controls">
        <input
          type="text"
          placeholder="Search Patient ID or Name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Given">Given</option>
        </select>
      </div>

      {/* Main Table */}
      <table className="pres-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Patient</th>
            <th>Total</th>
            <th>Pending</th>
            <th>Given</th>
            <th>View</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((p) => {
            const pending = p.prescriptions.filter((x) => x.status === STATUS.PENDING).length;
            const given = p.prescriptions.filter((x) => x.status === STATUS.GIVEN).length;

            return (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.prescriptions.length}</td>
                <td>{pending}</td>
                <td>{given}</td>
                <td>
                  <button onClick={() => setSelectedPatient(p)}>View</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Modal */}
      {selectedPatient && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button className="close-btn" onClick={() => setSelectedPatient(null)}>✖</button>

            <h2>{selectedPatient.name}</h2>
            <p><strong>Doctor:</strong> {selectedPatient.doctorName}</p>

            <table className="modal-table">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Dosage</th>
                  <th>Status</th>
                  <th>Qty</th>
                  <th>Give</th>
                </tr>
              </thead>

              <tbody>
                {selectedPatient.prescriptions.map((med, i) => (
                  <tr key={i}>
                    <td>{med.medicine}</td>
                    <td>{med.dosage}</td>
                    <td>{med.status}</td>

                    <td>
                      <input
                        type="number"
                        value={med.givenQty || ""}
                        onChange={(e) => {
                          const qty = e.target.value;
                          setSelectedPatient((prev) => ({
                            ...prev,
                            prescriptions: prev.prescriptions.map((rx, idx) =>
                              idx === i ? { ...rx, givenQty: qty } : rx
                            ),
                          }));
                        }}
                      />
                    </td>

                    <td>
                      <button
                        disabled={med.status === STATUS.GIVEN}
                        onClick={() => handleGiveMedicine(i, med)}
                      >
                        Give
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        </div>
      )}

    </div>
  );
}
