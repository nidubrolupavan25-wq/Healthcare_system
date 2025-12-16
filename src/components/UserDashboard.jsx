import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/UserDashboard.css';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Patient');
  const [userEmail, setUserEmail] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [healthMetrics, setHealthMetrics] = useState({
    heartRate: 72,
    bloodPressure: '120/80',
    temperature: '98.6°F',
    lastCheckup: 'Jan 15, 2025'
  });

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    setUserEmail(email || '');
    setUserName(user?.name || email?.split('@')[0] || 'Patient');

    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timeInterval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('auth');
    navigate('/');
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className="user-dashboard-container">
      {/* Header */}
      <header className="user-dashboard-header">
        <div className="header-left">
          <h1 className="dashboard-brand">HealthCare Pro</h1>
        </div>
        <div className="header-center">
          <nav className="header-nav">
            <button className="nav-btn" onClick={() => navigate('/dashboard')}>
              <i className="fas fa-home"></i> Home
            </button>
            <button className="nav-btn" onClick={() => navigate('/appointments')}>
              <i className="fas fa-calendar"></i> Appointments
            </button>
            <button className="nav-btn" onClick={() => navigate('/doctors')}>
              <i className="fas fa-user-md"></i> Find Doctors
            </button>
            <button className="nav-btn" onClick={() => navigate('/medicines')}>
              <i className="fas fa-pills"></i> Medicines
            </button>
          </nav>
        </div>
        <div className="header-right">
          <div className="time-display">
            <span className="time">{formatTime(currentTime)}</span>
            <span className="date">{formatDate(currentTime)}</span>
          </div>
          <div className="user-menu">
            <span className="user-greeting">Hi, {userName}</span>
            <button className="logout-btn" onClick={handleLogout}>
              <i className="fas fa-power-off"></i> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="user-dashboard-main">
        {/* Welcome Section */}
        <section className="welcome-section">
          <div className="welcome-card">
            <div className="welcome-content">
              <h2>Welcome back, {userName}!</h2>
              <p>Manage your health information and appointments easily</p>
            </div>
            <div className="welcome-icon">
              <i className="fas fa-heart"></i>
            </div>
          </div>
        </section>

        {/* Health Metrics */}
        <section className="health-metrics-section">
          <h3>Your Health Metrics</h3>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon heart-rate">
                <i className="fas fa-heartbeat"></i>
              </div>
              <div className="metric-info">
                <span className="metric-label">Heart Rate</span>
                <span className="metric-value">{healthMetrics.heartRate} BPM</span>
              </div>
              <span className="metric-status">Normal</span>
            </div>

            <div className="metric-card">
              <div className="metric-icon blood-pressure">
                <i className="fas fa-tint"></i>
              </div>
              <div className="metric-info">
                <span className="metric-label">Blood Pressure</span>
                <span className="metric-value">{healthMetrics.bloodPressure}</span>
              </div>
              <span className="metric-status">Normal</span>
            </div>

            <div className="metric-card">
              <div className="metric-icon temperature">
                <i className="fas fa-thermometer-half"></i>
              </div>
              <div className="metric-info">
                <span className="metric-label">Temperature</span>
                <span className="metric-value">{healthMetrics.temperature}</span>
              </div>
              <span className="metric-status">Normal</span>
            </div>

            <div className="metric-card">
              <div className="metric-icon checkup">
                <i className="fas fa-clipboard-check"></i>
              </div>
              <div className="metric-info">
                <span className="metric-label">Last Checkup</span>
                <span className="metric-value">{healthMetrics.lastCheckup}</span>
              </div>
              <span className="metric-status">Due in 11 months</span>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions-section">
          <h3>Quick Actions</h3>
          <div className="actions-grid">
            <button className="action-card" onClick={() => navigate('/appointments')}>
              <div className="action-icon">
                <i className="fas fa-plus-circle"></i>
              </div>
              <span>Book Appointment</span>
            </button>

            <button className="action-card" onClick={() => navigate('/doctors')}>
              <div className="action-icon">
                <i className="fas fa-search"></i>
              </div>
              <span>Find a Doctor</span>
            </button>

            <button className="action-card" onClick={() => alert('Medical records feature')}>
              <div className="action-icon">
                <i className="fas fa-file-medical"></i>
              </div>
              <span>Medical Records</span>
            </button>

            <button className="action-card" onClick={() => alert('Prescription feature')}>
              <div className="action-icon">
                <i className="fas fa-prescription-bottle"></i>
              </div>
              <span>Prescriptions</span>
            </button>
          </div>
        </section>

        {/* Upcoming Appointments */}
        <section className="upcoming-appointments-section">
          <h3>Upcoming Appointments</h3>
          <div className="appointments-container">
            <div className="appointment-card">
              <div className="appointment-date">
                <span className="date-day">25</span>
                <span className="date-month">Dec</span>
              </div>
              <div className="appointment-details">
                <h4>Dr. Sarah Johnson</h4>
                <p>General Checkup</p>
                <span className="appointment-time">
                  <i className="fas fa-clock"></i> 10:30 AM
                </span>
              </div>
              <button className="btn-secondary">Reschedule</button>
            </div>

            <div className="appointment-card">
              <div className="appointment-date">
                <span className="date-day">28</span>
                <span className="date-month">Dec</span>
              </div>
              <div className="appointment-details">
                <h4>Dr. Michael Chen</h4>
                <p>Dental Consultation</p>
                <span className="appointment-time">
                  <i className="fas fa-clock"></i> 2:00 PM
                </span>
              </div>
              <button className="btn-secondary">Reschedule</button>
            </div>
          </div>
        </section>

        {/* Recent Messages */}
        <section className="messages-section">
          <h3>Messages from Doctors</h3>
          <div className="messages-list">
            <div className="message-card">
              <div className="message-avatar">Dr. S</div>
              <div className="message-content">
                <h4>Dr. Sarah Johnson</h4>
                <p>Your lab reports are ready. Please visit the clinic to collect them.</p>
                <span className="message-time">2 hours ago</span>
              </div>
              <button className="btn-icon">
                <i className="fas fa-reply"></i>
              </button>
            </div>

            <div className="message-card">
              <div className="message-avatar">Dr. M</div>
              <div className="message-content">
                <h4>Dr. Michael Chen</h4>
                <p>Reminder: Your appointment is scheduled for tomorrow at 10:30 AM.</p>
                <span className="message-time">1 day ago</span>
              </div>
              <button className="btn-icon">
                <i className="fas fa-reply"></i>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="user-dashboard-footer">
        <div className="footer-content">
          <p>&copy; 2025 HealthCare Pro. All rights reserved.</p>
          <div className="footer-links">
            <button>Privacy Policy</button>
            <button>Terms of Service</button>
            <button>Contact Us</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserDashboard;
