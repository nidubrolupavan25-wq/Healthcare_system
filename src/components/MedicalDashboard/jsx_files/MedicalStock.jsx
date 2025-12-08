import React, { useState, useEffect } from "react";
import "../css/MedicalStock.css";

const STATUS = {
  IN_STOCK: "In Stock",
  LOW_STOCK: "Low Stock",
  OUT_OF_STOCK: "Out of Stock",
};

const initialStock = [
  { name: "Paracetamol 500mg", stock: 25, rack: "Rack A1" },
  { name: "Amoxicillin 250mg", stock: 3, rack: "Rack B2" },
  { name: "Ibuprofen 400mg", stock: 0, rack: "Rack C3" },
  { name: "Vitamin C 500mg", stock: 18, rack: "Rack D4" },
  { name: "Cetrizine 10mg", stock: 2, rack: "Rack E1" },
];

export default function MedicalStock() {
  const [stockData, setStockData] = useState(initialStock);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(initialStock);
  const [filterType, setFilterType] = useState("All");

  const getStatus = (qty) => {
    if (qty === 0) return STATUS.OUT_OF_STOCK;
    if (qty <= 3) return STATUS.LOW_STOCK;
    return STATUS.IN_STOCK;
  };

  useEffect(() => {
    let result = [...stockData];

    if (filterType !== "All") {
      result = result.filter((item) => getStatus(item.stock) === filterType);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((s) => s.name.toLowerCase().includes(q));
    }

    setFiltered(result);
  }, [search, filterType, stockData]);

  return (
    <div className="stock-page">

      <h2 className="page-title">Medicine Stock</h2>

      {/* Top Controls */}
      <div className="stock-controls">
        <input
          type="text"
          placeholder="Search medicine..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="All">All</option>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
      </div>

      {/* Stock Table */}
      <table className="stock-table">
        <thead>
          <tr>
            <th>Medicine</th>
            <th>Stock</th>
            <th>Rack</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((item, index) => {
            const status = getStatus(item.stock);

            return (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.stock}</td>
                <td>{item.rack}</td>
                <td>
                  <span className={`status-badge ${status.replace(/\s/g, "").toLowerCase()}`}>
                    {status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

    </div>
  );
}
