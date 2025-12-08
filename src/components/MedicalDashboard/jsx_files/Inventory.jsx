import React, { useState, useEffect } from 'react';
import '../css/Inventory.css';

const Inventory = () => {
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);

  // Sample initial data
  const initialMedicines = [
    {
      id: 1,
      name: 'Paracetamol 500mg',
      category: 'Pain Relief',
      batchNumber: 'BATCH001',
      quantity: 150,
      price: 5.99,
      cost: 3.50,
      expiryDate: '2024-12-31',
      supplier: 'MediCorp Ltd',
      reorderLevel: 20,
      status: 'In Stock'
    },
    {
      id: 2,
      name: 'Amoxicillin 250mg',
      category: 'Antibiotic',
      batchNumber: 'BATCH002',
      quantity: 45,
      price: 12.99,
      cost: 8.00,
      expiryDate: '2024-10-15',
      supplier: 'Pharma Solutions',
      reorderLevel: 15,
      status: 'In Stock'
    },
    {
      id: 3,
      name: 'Vitamin C 1000mg',
      category: 'Supplements',
      batchNumber: 'BATCH003',
      quantity: 5,
      price: 8.49,
      cost: 4.50,
      expiryDate: '2025-03-20',
      supplier: 'Health Plus',
      reorderLevel: 10,
      status: 'Low Stock'
    },
    {
      id: 4,
      name: 'Insulin Syringes',
      category: 'Medical Supplies',
      batchNumber: 'BATCH004',
      quantity: 0,
      price: 15.99,
      cost: 9.00,
      expiryDate: '2026-01-30',
      supplier: 'MediCorp Ltd',
      reorderLevel: 25,
      status: 'Out of Stock'
    }
  ];

  // Initialize medicines
  useEffect(() => {
    setMedicines(initialMedicines);
    setFilteredMedicines(initialMedicines);
  }, []);

  // Filter medicines based on search and filter
  useEffect(() => {
    let filtered = medicines;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(medicine =>
        medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(medicine => medicine.status === filterType);
    }

    setFilteredMedicines(filtered);
  }, [searchTerm, filterType, medicines]);

  // Add new medicine
  const addMedicine = (medicineData) => {
    const newMedicine = {
      id: medicines.length + 1,
      ...medicineData,
      status: getStockStatus(medicineData.quantity, medicineData.reorderLevel)
    };
    setMedicines([...medicines, newMedicine]);
    setShowAddForm(false);
  };

  // Update medicine
  const updateMedicine = (medicineData) => {
    const updatedMedicines = medicines.map(medicine =>
      medicine.id === editingMedicine.id
        ? { ...medicineData, status: getStockStatus(medicineData.quantity, medicineData.reorderLevel) }
        : medicine
    );
    setMedicines(updatedMedicines);
    setEditingMedicine(null);
  };

  // Delete medicine
  const deleteMedicine = (id) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      setMedicines(medicines.filter(medicine => medicine.id !== id));
    }
  };

  // Calculate stock status
  const getStockStatus = (quantity, reorderLevel) => {
    if (quantity === 0) return 'Out of Stock';
    if (quantity <= reorderLevel) return 'Low Stock';
    return 'In Stock';
  };

  // Calculate total inventory value
  const totalInventoryValue = medicines.reduce((total, medicine) => 
    total + (medicine.quantity * medicine.cost), 0
  );

  // Get low stock items
  const lowStockItems = medicines.filter(medicine => medicine.status === 'Low Stock' || medicine.status === 'Out of Stock');

  return (
    <div className="inventory-container">
      <div className="inventory-header">
        <h2>Medicine Inventory Management</h2>
        <p>Manage your pharmaceutical stock efficiently</p>
      </div>

      {/* Inventory Summary Cards */}
      <div className="inventory-summary">
        <div className="summary-card total-items">
          <h3>Total Items</h3>
          <p>{medicines.length}</p>
        </div>
        <div className="summary-card total-value">
          <h3>Total Value</h3>
          <p>${totalInventoryValue.toFixed(2)}</p>
        </div>
        <div className="summary-card low-stock">
          <h3>Low Stock</h3>
          <p>{lowStockItems.length}</p>
        </div>
        <div className="summary-card out-of-stock">
          <h3>Out of Stock</h3>
          <p>{medicines.filter(m => m.status === 'Out of Stock').length}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="inventory-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search medicines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-controls">
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All Status</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
          <button 
            className="btn-primary"
            onClick={() => setShowAddForm(true)}
          >
            Add New Medicine
          </button>
        </div>
      </div>

      {/* Medicines Table */}
      <div className="medicines-table-container">
        <table className="medicines-table">
          <thead>
            <tr>
              <th>Medicine Name</th>
              <th>Category</th>
              <th>Batch No.</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Cost</th>
              <th>Expiry Date</th>
              <th>Supplier</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMedicines.map(medicine => (
              <tr key={medicine.id} className={medicine.status.toLowerCase().replace(' ', '-')}>
                <td>{medicine.name}</td>
                <td>{medicine.category}</td>
                <td>{medicine.batchNumber}</td>
                <td>
                  <span className={`quantity ${medicine.quantity <= medicine.reorderLevel ? 'low-quantity' : ''}`}>
                    {medicine.quantity}
                  </span>
                </td>
                <td>${medicine.price}</td>
                <td>${medicine.cost}</td>
                <td className={new Date(medicine.expiryDate) < new Date() ? 'expired' : ''}>
                  {medicine.expiryDate}
                </td>
                <td>{medicine.supplier}</td>
                <td>
                  <span className={`status-badge ${medicine.status.toLowerCase().replace(' ', '-')}`}>
                    {medicine.status}
                  </span>
                </td>
                <td className="actions">
                  <button 
                    className="btn-edit"
                    onClick={() => setEditingMedicine(medicine)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => deleteMedicine(medicine.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Form Modal */}
      {(showAddForm || editingMedicine) && (
        <MedicineForm
          medicine={editingMedicine}
          onSave={editingMedicine ? updateMedicine : addMedicine}
          onCancel={() => {
            setShowAddForm(false);
            setEditingMedicine(null);
          }}
        />
      )}
    </div>
  );
};

// Medicine Form Component
const MedicineForm = ({ medicine, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    medicine || {
      name: '',
      category: '',
      batchNumber: '',
      quantity: 0,
      price: 0,
      cost: 0,
      expiryDate: '',
      supplier: '',
      reorderLevel: 10
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{medicine ? 'Edit Medicine' : 'Add New Medicine'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Medicine Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} required>
                <option value="">Select Category</option>
                <option value="Pain Relief">Pain Relief</option>
                <option value="Antibiotic">Antibiotic</option>
                <option value="Supplements">Supplements</option>
                <option value="Medical Supplies">Medical Supplies</option>
                <option value="Cold & Flu">Cold & Flu</option>
                <option value="Chronic Disease">Chronic Disease</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Batch Number *</label>
              <input
                type="text"
                name="batchNumber"
                value={formData.batchNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Supplier *</label>
              <input
                type="text"
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Quantity *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
            <div className="form-group">
              <label>Reorder Level *</label>
              <input
                type="number"
                name="reorderLevel"
                value={formData.reorderLevel}
                onChange={handleChange}
                min="1"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Selling Price ($) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
              />
            </div>
            <div className="form-group">
              <label>Cost Price ($) *</label>
              <input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Expiry Date *</label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {medicine ? 'Update' : 'Add'} Medicine
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Inventory;