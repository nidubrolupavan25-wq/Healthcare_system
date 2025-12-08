// src/components/Medicine/MedicinePage.jsx
import React, { useState, useEffect } from "react";
import {
  FaBell,
  FaEye,
  FaEdit,
  FaTrashAlt,
  FaPlus,
  FaArrowLeft,
} from "react-icons/fa";
//import Header from "../Header/Header";
import "./MedicinePage.css";
import { v4 as uuidv4 } from "uuid";
import { MedicineAPI, SupplierAPI } from "../../services/api";
//import 'bootstrap/dist/css/bootstrap.min.css';


const MedicinePage = () => {
  /* ────── COMMON ────── */
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  /* ────── VIEW MODE ────── */
  const [viewMode, setViewMode] = useState("medicines"); // "medicines" | "suppliers"

  /* ────── MEDICINE STATE ────── */
  const [medicines, setMedicines] = useState([]);
  const [searchMed, setSearchMed] = useState("");
  const [filterType, setFilterType] = useState("All");

  /* ────── SUPPLIER STATE ────── */
  const [suppliers, setSuppliers] = useState([]);
  const [searchSup, setSearchSup] = useState("");

  /* ────── MODALS ────── */
  const [viewModal, setViewModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selected, setSelected] = useState(null); // medicine OR supplier

  /* ────── FORM STATES ────── */
  const [medForm, setMedForm] = useState({
    medicineName: "",
    category: "",
    manufacturer: "",
    batchNo: "",
    pricePerUnit: "",
    purchaseCost: "",
    quantityAvailable: "",
    reorderLevel: "",
    expiryDate: "",
    description: "",
    locationOfRack: "",
    supplier: { supplierId: "" },
    createdBy: "admin",
  });

  const [supForm, setSupForm] = useState({
    supplierName: "",
    companyName: "",
    email: "",
    contact: "",
    status: "Active",
    supplyDate: "",
  });

  /* ────── FETCH ────── */
  useEffect(() => {
    if (viewMode === "medicines") {
      fetchMedicines();
      fetchSuppliers(); // needed for dropdown
    } else {
      fetchSuppliers();
    }
  }, [viewMode]);

  useEffect(() => {
    if (viewMode === "medicines") checkAlerts();
  }, [medicines]);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const { data } = await MedicineAPI.getAll();
      console.log("Fetched medicines:", data);
      setMedicines(data);
    } catch (e) {
      setError("Failed to load medicines.");
      notify("Error loading medicines.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const { data } = await SupplierAPI.getAll();
      setSuppliers(data);
    } catch (e) {
      setError("Failed to load suppliers.");
      notify("Error loading suppliers.");
    } finally {
      setLoading(false);
    }
  };

  /* ────── NOTIFICATIONS ────── */
  const notify = (msg) => {
    const id = uuidv4();
    setNotifications((p) => [
      ...p,
      { id, text: msg, time: new Date().toLocaleTimeString(), read: false },
    ]);
  };
  const markRead = (id) =>
    setNotifications((p) => p.map((n) => (n.id === id ? { ...n, read: true } : n)));

  /* ────── ALERTS (medicines) ────── */
  const checkAlerts = () => {
    const next = new Date();
    next.setMonth(next.getMonth() + 2);

    const exp = medicines.filter(
      (m) => new Date(m.expiryDate) <= next && m.quantityAvailable > 0
    );
    const low = medicines.filter(
      (m) => m.quantityAvailable > 0 && m.quantityAvailable <= m.reorderLevel
    );
    const out = medicines.filter((m) => m.quantityAvailable === 0);

    if (exp.length) notify(`${exp.length} medicine(s) expiring soon!`);
    if (low.length) notify(`${low.length} medicine(s) low stock!`);
    if (out.length) notify(`${out.length} medicine(s) out of stock!`);
  };

  /* ────── MEDICINE CRUD ────── */
  const addMedicine = async () => {
    try {
      await MedicineAPI.create(medForm);
      fetchMedicines();
      setAddModal(false);
      resetMedForm();
      notify("Medicine added!");
    } catch {
      notify("Failed to add medicine.");
    }
  };
  const editMedicine = async () => {
    try {
      const payload = {
        quantityAvailable: medForm.quantityAvailable,
        pricePerUnit: medForm.pricePerUnit,
        updatedBy: "admin",
      };
     await MedicineAPI.update(selected.id, payload);
      fetchMedicines();
      setEditModal(false);
      notify("Medicine updated!");
    } catch {
      notify("Update failed.");
    }
  };
  const deleteMedicine = async () => {
    try {
      await MedicineAPI.delete(deleteModal);
     setMedicines((p) => p.filter((m) => m.id !== deleteModal));
      setDeleteModal(false);
      notify("Medicine deleted!");
    } catch {
      notify("Delete failed.");
    }
  };

  /* ────── SUPPLIER CRUD ────── */
  const addSupplier = async () => {
    try {
      await SupplierAPI.create(supForm);
      fetchSuppliers();
      setAddModal(false);
      resetSupForm();
      notify("Supplier added!");
    } catch {
      notify("Failed to add supplier.");
    }
  };
  const editSupplier = async () => {
    try {
      await SupplierAPI.update(selected.supplierId, supForm);
      fetchSuppliers();
      setEditModal(false);
      notify("Supplier updated!");
    } catch {
      notify("Update failed.");
    }
  };
  const deleteSupplier = async () => {
    try {
      await SupplierAPI.delete(deleteModal);
      setSuppliers((p) => p.filter((s) => s.supplierId !== deleteModal));
      setDeleteModal(false);
      notify("Supplier deleted!");
    } catch {
      notify("Delete failed.");
    }
  };

  /* ────── FORM RESET ────── */
  const resetMedForm = () => {
    setMedForm({
      medicineName: "",
      category: "",
      manufacturer: "",
      batchNo: "",
      pricePerUnit: "",
      purchaseCost: "",
      quantityAvailable: "",
      reorderLevel: "",
      expiryDate: "",
      description: "",
      locationOfRack: "",
      supplier: { supplierId: "" },
      createdBy: "admin",
    });
  };
  const resetSupForm = () => {
    setSupForm({
      supplierName: "",
      companyName: "",
      email: "",
      contact: "",
      status: "Active",
      supplyDate: "",
    });
  };

  /* ────── MODAL OPENERS ────── */
  const openAdd = () => {
    viewMode === "medicines" ? resetMedForm() : resetSupForm();
    setAddModal(true);
  };
  const openEdit = (item) => {
    setSelected(item);
    if (viewMode === "medicines") {
      setMedForm({
        ...medForm,
        quantityAvailable: item.quantityAvailable,
        pricePerUnit: item.pricePerUnit,
      });
    } else {
      setSupForm({ ...item });
    }
    setEditModal(true);
  };
  const openView = (item) => {
    setSelected(item);
    setViewModal(true);
  };

  /* ────── FILTER / SEARCH ────── */
  const filteredMeds = () => {
    let list = medicines;
    if (filterType === "OutOfStock")
      list = medicines.filter((m) => m.quantityAvailable === 0);
    else if (filterType === "ExpiringSoon") {
      const nxt = new Date();
      nxt.setMonth(nxt.getMonth() + 2);
      list = medicines.filter(
        (m) => new Date(m.expiryDate) <= nxt && m.quantityAvailable > 0
      );
    } else if (filterType === "LowStock")
      list = medicines.filter(
        (m) => m.quantityAvailable > 0 && m.quantityAvailable <= m.reorderLevel
      );

    if (searchMed)
      list = list.filter((m) =>
        m.medicineName.toLowerCase().includes(searchMed.toLowerCase())
      );
    return list;
  };

  const filteredSups = () => {
    if (!searchSup) return suppliers;
    return suppliers.filter((s) =>
      s.supplierName.toLowerCase().includes(searchSup.toLowerCase())
    );
  };

  /* ────── STATS ────── */
  const totalMeds = medicines.length;
  const outMeds = medicines.filter((m) => m.quantityAvailable === 0).length;
  const expMeds = medicines.filter((m) => {
    const nxt = new Date();
    nxt.setMonth(nxt.getMonth() + 2);
    return new Date(m.expiryDate) <= nxt && m.quantityAvailable > 0;
  }).length;
  const lowMeds = medicines.filter(
    (m) => m.quantityAvailable > 0 && m.quantityAvailable <= m.reorderLevel
  ).length;
  const totalSups = suppliers.length;

  if (loading) return <div className="loading">Loading…</div>;
  if (error) return <div className="error">{error}</div>;

  /* ────── RENDER ────── */
  return (
    <div className="medicine-page">
     
      <div className="page-content active">
        {/* ---------- HEADER ---------- */}
        <div className="medicine-header">
          <h2>
            {viewMode === "medicines" ? "Medicine Management" : "Supplier Management"}
          </h2>

          <div className="header-right">
            {/* Bell */}
            <div
              className="notification-bell"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <FaBell />
              {notifications.some((n) => !n.read) && (
                <span className="badge">
                  {notifications.filter((n) => !n.read).length}
                </span>
              )}
              {showDropdown && (
                <div className="notification-dropdown">
                  {notifications.length ? (
                    notifications
                      .slice()
                      .reverse()
                      .map((n) => (
                        <div
                          key={n.id}
                          className={`notification-item ${n.read ? "read" : "unread"}`}
                          onClick={() => markRead(n.id)}
                        >
                          <p className={!n.read ? "unread-text" : ""}>{n.text}</p>
                          <span className="time">{n.time}</span>
                        </div>
                      ))
                  ) : (
                    <p className="no-notify">No notifications</p>
                  )}
                </div>
              )}
            </div>

            {/* Search + Add */}
            <div className="medicine-controls">
              <input
                type="text"
                placeholder={`Search ${viewMode === "medicines" ? "medicine" : "supplier"}…`}
                value={viewMode === "medicines" ? searchMed : searchSup}
                onChange={(e) =>
                  viewMode === "medicines"
                    ? setSearchMed(e.target.value)
                    : setSearchSup(e.target.value)
                }
              />
              <button className="add-btnn" onClick={openAdd}>
                <FaPlus />
              </button>
            </div>
          </div>
        </div>

      {/* ---------- SUMMARY CARDS ---------- */}
<div className="summary-cards1">
  {viewMode === "medicines" ? (
    <>
      <div
        className={`card blue ${filterType === "All" ? "active-card" : ""}`}
        onClick={() => setFilterType("All")}
      >
        <h4>Total Medicines</h4>
        <p>{totalMeds}</p>
      </div>
      <div
        className={`card red ${filterType === "OutOfStock" ? "active-card" : ""}`}
        onClick={() => setFilterType("OutOfStock")}
      >
        <h4>Out of Stock</h4>
        <p>{outMeds}</p>
      </div>
      <div
        className={`card orange ${filterType === "ExpiringSoon" ? "active-card" : ""}`}
        onClick={() => setFilterType("ExpiringSoon")}
      >
        <h4>Expiring Soon</h4>
        <p>{expMeds}</p>
      </div>
      <div
        className={`card green ${filterType === "LowStock" ? "active-card" : ""}`}
        onClick={() => setFilterType("LowStock")}
      >
        <h4>Low Stock</h4>
        <p>{lowMeds}</p>
      </div>

      {/* SUPPLIERS CARD – CLICK TO SWITCH */}
      <div
        className="card teal"
        style={{ cursor: "pointer" }}
        onClick={() => setViewMode("suppliers")}
      >
        <h4>Suppliers</h4>
        <p>{totalSups}</p>
      </div>
    </>
  ) : (
    <>
      <div
        className="card purple"
        onClick={() => setViewMode("medicines")}
        style={{ cursor: "pointer" }}
      >
        <h4>Back to Medicines</h4>
        <p>{totalMeds}</p>
      </div>
      <div className="card teal">
        <h4>Total Suppliers</h4>
        <p>{totalSups}</p>
      </div>
    </>
  )}
</div>

        {/* ---------- TABLE ---------- */}
        <div className="medicine-table">
          <table>
            <thead>
              <tr>
                {viewMode === "medicines" ? (
                  <>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Stock</th>
                    <th>Price</th>
                    <th>Expiry</th>
                    <th>Actions</th>
                  </>
                ) : (
                  <>
                    <th>Name</th>
                    <th>Company</th>
                    <th>Email</th>
                    <th>Contact</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {viewMode === "medicines" ? (
                filteredMeds().length ? (
                  filteredMeds().map((m) => (
                   <tr key={m.id}>
                      <td>{m.medicineName}</td>
                      <td>{m.category}</td>
                      <td
                        className={
                          m.quantityAvailable === 0
                            ? "stock out"
                            : m.quantityAvailable <= m.reorderLevel
                            ? "stock low"
                            : "stock ok"
                        }
                      >
                        {m.quantityAvailable}
                      </td>
                      <td>₹{m.pricePerUnit}</td>
                      <td>{new Date(m.expiryDate).toLocaleDateString()}</td>
                      <td className="action-buttons">
                        <button className="view" onClick={() => openView(m)}>
                          <FaEye />
                        </button>
                        <button className="edit" onClick={() => openEdit(m)}>
                          <FaEdit />
                        </button>
                        <button
                          className="delete"
                          onClick={() => setDeleteModal(m.id)}
                        >
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">
                      No medicines found.
                    </td>
                  </tr>
                )
              ) : (
                filteredSups().length ? (
                  filteredSups().map((s) => (
                    <tr key={s.supplierId}>
                      <td>{s.supplierName}</td>
                      <td>{s.companyName}</td>
                      <td>{s.email}</td>
                      <td>{s.contact}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            s.status === "Active" ? "available" : "out"
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="action-buttons">
                        <button className="view" onClick={() => openView(s)}>
                          <FaEye />
                        </button>
                        <button className="edit" onClick={() => openEdit(s)}>
                          <FaEdit />
                        </button>
                        <button
                          className="delete"
                          onClick={() => setDeleteModal(s.supplierId)}
                        >
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">
                      No suppliers found.
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* ---------- VIEW MODAL ---------- */}
        {viewModal && selected && (
          <div className="modal-overlay" onClick={() => setViewModal(false)}>
            <div
              className="modal-content view-popup"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>{viewMode === "medicines" ? "Medicine Details" : "Supplier Details"}</h3>

              {viewMode === "medicines" ? (
                <>
                  <p><b>ID:</b> {selected.id}</p>
                  <p><b>Name:</b> {selected.medicineName}</p>
                  <p><b>Category:</b> {selected.category}</p>
                  <p><b>Manufacturer:</b> {selected.manufacturer}</p>
                  <p><b>Batch:</b> {selected.batchNo}</p>
                  <p><b>Stock:</b> {selected.quantityAvailable}</p>
                  <p><b>Price:</b> ₹{selected.pricePerUnit}</p>
                  <p><b>Expiry:</b> {new Date(selected.expiryDate).toLocaleDateString()}</p>
                  <p><b>Rack:</b> {selected.locationOfRack}</p>
                  <p><b>Supplier:</b> {selected.supplier?.supplierName || "N/A"}</p>
                </>
              ) : (
                <>
                  <p><b>ID:</b> {selected.supplierId}</p>
                  <p><b>Name:</b> {selected.supplierName}</p>
                  <p><b>Company:</b> {selected.companyName}</p>
                  <p><b>Email:</b> {selected.email}</p>
                  <p><b>Contact:</b> {selected.contact}</p>
                  <p><b>Status:</b> {selected.status}</p>
                  <p><b>Supply Date:</b> {selected.supplyDate?.split("T")[0] || "-"}</p>
                </>
              )}

              <button onClick={() => setViewModal(false)}>Close</button>
            </div>
          </div>
        )}

        {/* ---------- ADD MODAL ---------- */}
        {addModal && (
          <div className="modal-overlay" onClick={() => setAddModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>{viewMode === "medicines" ? "Add Medicine" : "Add Supplier"}</h3>

              {viewMode === "medicines" ? (
                <>
                  <input
                    placeholder="Medicine Name"
                    value={medForm.medicineName}
                    onChange={(e) => setMedForm({ ...medForm, medicineName: e.target.value })}
                  />
                  <input
                    placeholder="Category"
                    value={medForm.category}
                    onChange={(e) => setMedForm({ ...medForm, category: e.target.value })}
                  />
                  <input
                    placeholder="Manufacturer"
                    value={medForm.manufacturer}
                    onChange={(e) => setMedForm({ ...medForm, manufacturer: e.target.value })}
                  />
                  <input
                    placeholder="Batch No"
                    value={medForm.batchNo}
                    onChange={(e) => setMedForm({ ...medForm, batchNo: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Price per Unit"
                    value={medForm.pricePerUnit}
                    onChange={(e) => setMedForm({ ...medForm, pricePerUnit: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Purchase Cost"
                    value={medForm.purchaseCost}
                    onChange={(e) => setMedForm({ ...medForm, purchaseCost: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={medForm.quantityAvailable}
                    onChange={(e) => setMedForm({ ...medForm, quantityAvailable: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Reorder Level"
                    value={medForm.reorderLevel}
                    onChange={(e) => setMedForm({ ...medForm, reorderLevel: e.target.value })}
                  />
                  <input
                    type="date"
                    value={medForm.expiryDate}
                    onChange={(e) => setMedForm({ ...medForm, expiryDate: e.target.value })}
                  />
                  <input
                    placeholder="Rack Location"
                    value={medForm.locationOfRack}
                    onChange={(e) => setMedForm({ ...medForm, locationOfRack: e.target.value })}
                  />
                  <select
                    value={medForm.supplier.supplierId}
                    onChange={(e) =>
                      setMedForm({
                        ...medForm,
                        supplier: { supplierId: e.target.value },
                      })
                    }
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map((s) => (
                      <option key={s.supplierId} value={s.supplierId}>
                        {s.supplierName}
                      </option>
                    ))}
                  </select>
                </>
              ) : (
                <>
                  <input
                    placeholder="Supplier Name"
                    value={supForm.supplierName}
                    onChange={(e) => setSupForm({ ...supForm, supplierName: e.target.value })}
                  />
                  <input
                    placeholder="Company Name"
                    value={supForm.companyName}
                    onChange={(e) => setSupForm({ ...supForm, companyName: e.target.value })}
                  />
                  <input
                    placeholder="Email"
                    value={supForm.email}
                    onChange={(e) => setSupForm({ ...supForm, email: e.target.value })}
                  />
                  <input
                    placeholder="Contact"
                    value={supForm.contact}
                    onChange={(e) => setSupForm({ ...supForm, contact: e.target.value })}
                  />
                  <select
                    value={supForm.status}
                    onChange={(e) => setSupForm({ ...supForm, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <input
                    type="date"
                    placeholder="Supply Date"
                    value={supForm.supplyDate}
                    onChange={(e) => setSupForm({ ...supForm, supplyDate: e.target.value })}
                  />
                </>
              )}

              <div className="popup-buttons">
                <button onClick={viewMode === "medicines" ? addMedicine : addSupplier}>
                  Add
                </button>
                <button onClick={() => setAddModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* ---------- EDIT MODAL ---------- */}
        {editModal && selected && (
          <div className="modal-overlay" onClick={() => setEditModal(false)}>
            <div className="modal-content edit-popup" onClick={(e) => e.stopPropagation()}>
              <h3>
                Edit {viewMode === "medicines" ? selected.medicineName : selected.supplierName}
              </h3>

              {viewMode === "medicines" ? (
                <>
                  <label>Stock:</label>
                  <input
                    type="number"
                    value={medForm.quantityAvailable}
                    onChange={(e) =>
                      setMedForm({ ...medForm, quantityAvailable: e.target.value })
                    }
                  />
                  <label>Price:</label>
                  <input
                    type="number"
                    value={medForm.pricePerUnit}
                    onChange={(e) =>
                      setMedForm({ ...medForm, pricePerUnit: e.target.value })
                    }
                  />
                </>
              ) : (
                <>
                  <input
                    placeholder="Supplier Name"
                    value={supForm.supplierName}
                    onChange={(e) => setSupForm({ ...supForm, supplierName: e.target.value })}
                  />
                  <input
                    placeholder="Company Name"
                    value={supForm.companyName}
                    onChange={(e) => setSupForm({ ...supForm, companyName: e.target.value })}
                  />
                  <input
                    placeholder="Email"
                    value={supForm.email}
                    onChange={(e) => setSupForm({ ...supForm, email: e.target.value })}
                  />
                  <input
                    placeholder="Contact"
                    value={supForm.contact}
                    onChange={(e) => setSupForm({ ...supForm, contact: e.target.value })}
                  />
                  <select
                    value={supForm.status}
                    onChange={(e) => setSupForm({ ...supForm, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <input
                    type="date"
                    value={supForm.supplyDate}
                    onChange={(e) => setSupForm({ ...supForm, supplyDate: e.target.value })}
                  />
                </>
              )}

              <div className="popup-buttons">
                <button onClick={viewMode === "medicines" ? editMedicine : editSupplier}>
                  Save
                </button>
                <button onClick={() => setEditModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* ---------- DELETE MODAL ---------- */}
        {deleteModal && (
          <div className="modal-overlay" onClick={() => setDeleteModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Confirm Delete</h3>
              <p>
                Are you sure you want to delete this{" "}
                {viewMode === "medicines" ? "medicine" : "supplier"}?
              </p>
              <div className="popup-buttons">
                <button
                  onClick={viewMode === "medicines" ? deleteMedicine : deleteSupplier}
                >
                  Yes
                </button>
                <button onClick={() => setDeleteModal(false)}>No</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicinePage;