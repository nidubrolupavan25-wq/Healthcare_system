import React, { useState } from 'react';
import '../css/Orders.css';

const Orders = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample orders data
  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      patientName: 'John Smith',
      patientId: 'P-1001',
      medication: 'Amoxicillin 500mg',
      quantity: 30,
      status: 'pending',
      date: '2023-10-15',
      priority: 'medium',
      type: 'prescription'
    },
    {
      id: 'ORD-002',
      patientName: 'Sarah Johnson',
      patientId: 'P-1002',
      medication: 'Medical Supplies Kit',
      quantity: 1,
      status: 'completed',
      date: '2023-10-14',
      priority: 'low',
      type: 'supplies'
    },
    {
      id: 'ORD-003',
      patientName: 'Michael Brown',
      patientId: 'P-1003',
      medication: 'Lab Test - Blood Work',
      quantity: 1,
      status: 'processing',
      date: '2023-10-16',
      priority: 'high',
      type: 'lab'
    },
    {
      id: 'ORD-004',
      patientName: 'Emily Davis',
      patientId: 'P-1004',
      medication: 'Physical Therapy Equipment',
      quantity: 1,
      status: 'pending',
      date: '2023-10-13',
      priority: 'medium',
      type: 'equipment'
    },
    {
      id: 'ORD-005',
      patientName: 'Robert Wilson',
      patientId: 'P-1005',
      medication: 'Ibuprofen 400mg',
      quantity: 60,
      status: 'shipped',
      date: '2023-10-12',
      priority: 'high',
      type: 'prescription'
    }
  ]);

  const statusFilters = [
    { id: 'all', label: 'All Orders', count: orders.length },
    { id: 'pending', label: 'Pending', count: orders.filter(order => order.status === 'pending').length },
    { id: 'processing', label: 'Processing', count: orders.filter(order => order.status === 'processing').length },
    { id: 'shipped', label: 'Shipped', count: orders.filter(order => order.status === 'shipped').length },
    { id: 'completed', label: 'Completed', count: orders.filter(order => order.status === 'completed').length }
  ];

  const filteredOrders = orders.filter(order => {
    const matchesFilter = activeFilter === 'all' || order.status === activeFilter;
    const matchesSearch = order.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return <span className="status-badge status-pending">Pending</span>;
      case 'processing':
        return <span className="status-badge status-processing">Processing</span>;
      case 'shipped':
        return <span className="status-badge status-shipped">Shipped</span>;
      case 'completed':
        return <span className="status-badge status-completed">Completed</span>;
      default:
        return <span className="status-badge">Unknown</span>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'high':
        return <span className="priority-badge priority-high">High</span>;
      case 'medium':
        return <span className="priority-badge priority-medium">Medium</span>;
      case 'low':
        return <span className="priority-badge priority-low">Low</span>;
      default:
        return <span className="priority-badge">Unknown</span>;
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'prescription':
        return <i className="fas fa-pills"></i>;
      case 'supplies':
        return <i className="fas fa-first-aid"></i>;
      case 'lab':
        return <i className="fas fa-flask"></i>;
      case 'equipment':
        return <i className="fas fa-crutch"></i>;
      default:
        return <i className="fas fa-box"></i>;
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  return (
    <div className="orders-module">
      <div className="orders-header">
        <div className="header-left">
          <h1><i className="fas fa-clipboard-list"></i> Medical Orders</h1>
          <p>Manage and track patient orders and medications</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary">
            <i className="fas fa-plus"></i> New Order
          </button>
        </div>
      </div>

      <div className="orders-content">
        <div className="filters-section">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search orders, patients, or medications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="status-filters">
            {statusFilters.map(filter => (
              <button
                key={filter.id}
                className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.label}
                <span className="filter-count">{filter.count}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="orders-stats">
          <div className="stat-card">
            <div className="stat-icon pending">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-info">
              <h3>Pending Orders</h3>
              <span className="stat-number">
                {orders.filter(order => order.status === 'pending').length}
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon processing">
              <i className="fas fa-sync-alt"></i>
            </div>
            <div className="stat-info">
              <h3>In Progress</h3>
              <span className="stat-number">
                {orders.filter(order => order.status === 'processing').length}
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon high-priority">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div className="stat-info">
              <h3>High Priority</h3>
              <span className="stat-number">
                {orders.filter(order => order.priority === 'high').length}
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon total">
              <i className="fas fa-boxes"></i>
            </div>
            <div className="stat-info">
              <h3>Total Orders</h3>
              <span className="stat-number">{orders.length}</span>
            </div>
          </div>
        </div>

        <div className="orders-list">
          <div className="list-header">
            <h2>Recent Orders</h2>
            <div className="list-actions">
              <button className="btn btn-outline">
                <i className="fas fa-download"></i> Export
              </button>
              <button className="btn btn-outline">
                <i className="fas fa-filter"></i> Filter
              </button>
            </div>
          </div>

          <div className="orders-table">
            {filteredOrders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-type">
                    {getTypeIcon(order.type)}
                    <span className="order-type-text">{order.type}</span>
                  </div>
                  <div className="order-id">{order.id}</div>
                </div>

                <div className="order-body">
                  <div className="patient-info">
                    <h4>{order.patientName}</h4>
                    <span className="patient-id">ID: {order.patientId}</span>
                  </div>

                  <div className="medication-info">
                    <h5>{order.medication}</h5>
                    <span className="quantity">Qty: {order.quantity}</span>
                  </div>

                  <div className="order-meta">
                    <div className="meta-item">
                      <i className="fas fa-calendar"></i>
                      <span>{order.date}</span>
                    </div>
                    <div className="meta-item">
                      {getPriorityBadge(order.priority)}
                    </div>
                  </div>
                </div>

                <div className="order-footer">
                  <div className="order-status">
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="order-actions">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="completed">Completed</option>
                    </select>
                    <button className="btn-icon">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="btn-icon">
                      <i className="fas fa-print"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;