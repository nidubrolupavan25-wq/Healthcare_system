import React, { useState } from "react";
import "../css/Customers.css";

const Customers = () => {
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1-555-0101",
      address: "123 Main St, City, State",
      registrationDate: "2024-01-15",
      totalOrders: 12,
      totalSpent: "$450.50",
      status: "Active"
    },
    {
      id: 2,
      name: "Maria Garcia",
      email: "maria.garcia@email.com",
      phone: "+1-555-0102",
      address: "456 Oak Ave, City, State",
      registrationDate: "2024-01-10",
      totalOrders: 8,
      totalSpent: "$320.75",
      status: "Active"
    },
    {
      id: 3,
      name: "Robert Chen",
      email: "robert.chen@email.com",
      phone: "+1-555-0103",
      address: "789 Pine Rd, City, State",
      registrationDate: "2024-01-05",
      totalOrders: 5,
      totalSpent: "$189.25",
      status: "Inactive"
    },
    {
      id: 4,
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "+1-555-0104",
      address: "321 Elm St, City, State",
      registrationDate: "2024-01-20",
      totalOrders: 3,
      totalSpent: "$95.80",
      status: "Active"
    }
  ]);

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  const [searchTerm, setSearchTerm] = useState("");

  const handleAddCustomer = (e) => {
    e.preventDefault();
    if (newCustomer.name && newCustomer.email && newCustomer.phone) {
      const customer = {
        id: customers.length + 1,
        name: newCustomer.name,
        email: newCustomer.email,
        phone: newCustomer.phone,
        address: newCustomer.address,
        registrationDate: new Date().toISOString().split('T')[0],
        totalOrders: 0,
        totalSpent: "$0.00",
        status: "Active"
      };
      setCustomers([...customers, customer]);
      setNewCustomer({ name: "", email: "", phone: "", address: "" });
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  return (
    <div className="customers-page">
      <div className="customers-header">
        <h1>Customers</h1>
        <p>Manage your pharmacy customers and their information</p>
      </div>

      {/* Statistics */}
      <div className="customers-stats">
        <div className="stat-card">
          <h3>Total Customers</h3>
          <p>{customers.length}</p>
        </div>
        <div className="stat-card">
          <h3>Active Customers</h3>
          <p>{customers.filter(c => c.status === "Active").length}</p>
        </div>
        <div className="stat-card">
          <h3>New This Month</h3>
          <p>{customers.filter(c => {
            const regDate = new Date(c.registrationDate);
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            return regDate.getMonth() === currentMonth && regDate.getFullYear() === currentYear;
          }).length}</p>
        </div>
        <div className="stat-card">
          <h3>Avg. Orders per Customer</h3>
          <p>{(customers.reduce((acc, c) => acc + c.totalOrders, 0) / customers.length).toFixed(1)}</p>
        </div>
      </div>

      {/* Search and Add Customer */}
      <div className="customers-actions">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search customers by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <button className="btn-primary">Add New Customer</button>
      </div>

      {/* Customers Table */}
      <div className="customers-section">
        <h2>Customer Directory</h2>
        <div className="customers-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Registration Date</th>
                <th>Total Orders</th>
                <th>Total Spent</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map(customer => (
                <tr key={customer.id}>
                  <td>#{customer.id}</td>
                  <td>
                    <div className="customer-name">
                      <strong>{customer.name}</strong>
                      <span className="customer-address">{customer.address}</span>
                    </div>
                  </td>
                  <td>
                    <div className="customer-contact">
                      <div>{customer.email}</div>
                      <div>{customer.phone}</div>
                    </div>
                  </td>
                  <td>{customer.registrationDate}</td>
                  <td>{customer.totalOrders}</td>
                  <td>{customer.totalSpent}</td>
                  <td>
                    <span className={`status-badge ${customer.status.toLowerCase()}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-view">View</button>
                      <button className="btn-edit">Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Form */}
      <div className="add-customer-section">
        <h2>Add New Customer</h2>
        <form onSubmit={handleAddCustomer} className="customer-form">
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input 
                type="text" 
                placeholder="Enter customer name"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address *</label>
              <input 
                type="email" 
                placeholder="Enter email address"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Phone Number *</label>
              <input 
                type="tel" 
                placeholder="Enter phone number"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input 
                type="text" 
                placeholder="Enter full address"
                value={newCustomer.address}
                onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">Add Customer</button>
            <button type="button" className="btn-secondary" onClick={() => setNewCustomer({ name: "", email: "", phone: "", address: "" })}>
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Customers;