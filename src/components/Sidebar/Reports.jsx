import React, { useState, useEffect } from "react";
import { Bar, Pie, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import "../css/Reports.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Title
);

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState("All");
  const [timeRange, setTimeRange] = useState("Today");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);

  const reports = [
    "Patient",
    "Doctor",
    "Medicines",
    "Financial",
    "Ward",
    "Appointment",
    "Staff",
  ];

  const baseData = {
    Patients: { Total: 80, Admitted: 25, Discharged: 15, Outpatient: 40, Inpatient: 45 },
    Doctors: [
      { name: "Dr. Rajesh", patientsTreated: 18, performance: 4.7 },
      { name: "Dr. Anita", patientsTreated: 22, performance: 4.5 },
      { name: "Dr. Meena", patientsTreated: 15, performance: 4.8 },
    ],
    Medicines: [
      { name: "Paracetamol", stock: 150 },
      { name: "Amoxicillin", stock: 500 },
      { name: "Ibuprofen", stock: 250 },
    ],
    Financial: { DailyBilling: 120000, MonthlyBilling: 3500000, PendingPayments: 200000 },
    Ward: { TotalBeds: 120, Occupied: 90, Available: 30, AvgStay: 3.5 },
    Appointments: {
      Daily: 45,
      Cancelled: 5,
      Online: 25,
      Offline: 20,
      Department: 6,
    },
    Staff: [
      { name: "Nurse Priya", attendance: 95, performance: 4.8, salary: 40000 },
      { name: "Admin Ramesh", attendance: 88, performance: 4.5, salary: 35000 },
      { name: "Technician Arjun", attendance: 92, performance: 4.6, salary: 30000 },
    ],
  };

  const [data, setData] = useState(baseData);

  // 🕒 ADDED for timestamp-based chart scaling
  const timeScale = {
    Today: 1,
    "1Week": 1.3,
    "1Month": 1.7,
    "1Year": 2.2,
  };

  useEffect(() => {
    const scale = timeScale[timeRange] || 1;

    const updatedData = {
      Patients: Object.fromEntries(
        Object.entries(baseData.Patients).map(([k, v]) => [k, Math.round(v * scale)])
      ),
      Doctors: baseData.Doctors.map((d) => ({
        ...d,
        patientsTreated: Math.round(d.patientsTreated * scale),
      })),
      Medicines: baseData.Medicines.map((m) => ({
        ...m,
        stock: Math.round(m.stock * scale),
      })),
      Financial: Object.fromEntries(
        Object.entries(baseData.Financial).map(([k, v]) => [k, Math.round(v * scale)])
      ),
      Ward: Object.fromEntries(
        Object.entries(baseData.Ward).map(([k, v]) => [k, Math.round(v * scale)])
      ),
      Appointments: Object.fromEntries(
        Object.entries(baseData.Appointments).map(([k, v]) => [k, Math.round(v * scale)])
      ),
      Staff: baseData.Staff.map((s) => ({
        ...s,
        attendance: Math.min(100, Math.round(s.attendance * scale * 0.95)),
        salary: Math.round(s.salary * scale),
      })),
    };

    setData(updatedData);
  }, [timeRange]);
  // 🕒 END

  useEffect(() => setFilteredOptions(reports), []);

  const handleSearch = (val) => {
    setSearchTerm(val);
    setFilteredOptions(
      reports.filter((r) => r.toLowerCase().includes(val.toLowerCase()))
    );
  };

  const chartOptions = {
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { font: { size: 10 } } },
      y: { ticks: { font: { size: 10 } } },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="App">
      <h2>🏥 Hospital Reports Dashboard</h2>

      {/* 🔍 Filters */}
      <div className="filter-bar">
        <input
          className="search-box"
          placeholder="Search report..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <select value={selectedReport} onChange={(e) => setSelectedReport(e.target.value)}>
          <option value="All">All Reports</option>
          {filteredOptions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
          <option value="Today">Today</option>
          <option value="1Week">1 Week</option>
          <option value="1Month">1 Month</option>
          <option value="1Year">1 Year</option>
        </select>
      </div>

      {/* 👨‍⚕ Patient Reports */}
      {(selectedReport === "All" || selectedReport === "Patient") && (
        <Section title="👨‍⚕ Patient Reports">
          <CardGrid data={data.Patients} />
          <Bar
            data={{
              labels: Object.keys(data.Patients),
              datasets: [{ data: Object.values(data.Patients), backgroundColor: "#007bff" }],
            }}
            options={chartOptions}
            height={200}
          />
        </Section>
      )}

      {/* 🧑‍⚕ Doctor Reports */}
      {(selectedReport === "All" || selectedReport === "Doctor") && (
        <Section title="🧑‍⚕ Doctor Reports">
          <div className="grid">
            {data.Doctors.map((d) => (
              <div className="card" key={d.name}>
                <b>{d.name}</b>
                <p>Patients: {d.patientsTreated}</p>
                <p>⭐ {d.performance}</p>
              </div>
            ))}
          </div>
          <Bar
            data={{
              labels: data.Doctors.map((d) => d.name),
              datasets: [
                {
                  label: "Patients Treated",
                  data: data.Doctors.map((d) => d.patientsTreated),
                  backgroundColor: "#17a2b8",
                },
              ],
            }}
            options={chartOptions}
            height={200}
          />
        </Section>
      )}

      {/* 💊 Medicine Reports */}
      {(selectedReport === "All" || selectedReport === "Medicines") && (
        <Section title="💊 Medicine Reports">
          <CardGrid data={data.Medicines} />
          <Pie
            data={{
              labels: data.Medicines.map((m) => m.name),
              datasets: [
                {
                  data: data.Medicines.map((m) => m.stock),
                  backgroundColor: ["#007bff", "#28a745", "#ffc107"],
                },
              ],
            }}
            height={200}
          />
        </Section>
      )}

      {/* 💰 Financial Reports */}
      {(selectedReport === "All" || selectedReport === "Financial") && (
        <Section title="💰 Financial Reports">
          <CardGrid data={data.Financial} />
          <Doughnut
            data={{
              labels: Object.keys(data.Financial),
              datasets: [
                {
                  data: Object.values(data.Financial),
                  backgroundColor: ["#28a745", "#17a2b8", "#ffc107"],
                },
              ],
            }}
            height={200}
          />
        </Section>
      )}

      {/* 🏨 Ward Reports */}
      {(selectedReport === "All" || selectedReport === "Ward") && (
        <Section title="🏨 Ward Reports">
          <CardGrid data={data.Ward} />
          <Bar
            data={{
              labels: Object.keys(data.Ward),
              datasets: [
                {
                  data: Object.values(data.Ward),
                  backgroundColor: "#6f42c1",
                },
              ],
            }}
            options={chartOptions}
            height={200}
          />
        </Section>
      )}

      {/* 📅 Appointment Reports */}
      {(selectedReport === "All" || selectedReport === "Appointment") && (
        <Section title="📅 Appointment Reports">
          <CardGrid data={data.Appointments} />
          <Doughnut
            data={{
              labels: Object.keys(data.Appointments),
              datasets: [
                {
                  label: "Appointment Summary",
                  data: Object.values(data.Appointments),
                  backgroundColor: [
                    "#007bff",
                    "#28a745",
                    "#ffc107",
                    "#dc3545",
                    "#17a2b8",
                  ],
                  hoverOffset: 6,
                },
              ],
            }}
            options={{
              plugins: {
                legend: {
                  position: "bottom",
                  labels: { font: { size: 12 } },
                },
              },
              maintainAspectRatio: false,
            }}
            height={200}
          />
        </Section>
      )}

      {/* 👩‍💼 Staff Reports */}
      {(selectedReport === "All" || selectedReport === "Staff") && (
        <Section title="👩‍💼 Staff Reports">
          <div className="grid">
            {data.Staff.map((s) => (
              <div className="card" key={s.name}>
                <b>{s.name}</b>
                <p>Attendance: {s.attendance}%</p>
                <p>⭐ {s.performance}</p>
                <p>💰 ₹{s.salary}</p>
              </div>
            ))}
          </div>
          <Bar
            data={{
              labels: data.Staff.map((s) => s.name),
              datasets: [
                {
                  label: "Attendance (%)",
                  data: data.Staff.map((s) => s.attendance),
                  backgroundColor: "#20c997",
                },
              ],
            }}
            options={chartOptions}
            height={200}
          />
        </Section>
      )}
    </div>
  );
}

/* 🔧 Reusable Components */
const Section = ({ title, children }) => (
  <div className="section">
    <h3>{title}</h3>
    {children}
  </div>
);

// ✅ FIXED CardGrid — handles both objects & arrays
const CardGrid = ({ data }) => {
  if (Array.isArray(data)) {
    return (
      <div className="grid">
        {data.map((item, index) => (
          <div className="card" key={index}>
            {Object.entries(item).map(([k, v]) => (
              <p key={k}>
                <b>{k}:</b> {v}
              </p>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid">
      {Object.entries(data).map(([k, v]) => (
        <div className="card" key={k}>
          <b>{k}</b>
          <p>{v}</p>
        </div>
      ))}
    </div>
  );
};