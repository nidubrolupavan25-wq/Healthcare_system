import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DoctorAPI, PatientAPI } from '../services/api.js';
import './css/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    departments: 12,
    doctors: 0,
    patients: 0,
    appointments: 45,
  });

  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState({
    temp: '22°C',
    condition: 'Sunny'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [userName, setUserName] = useState('User');
  const [userRole, setUserRole] = useState('Patient');

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    const role = localStorage.getItem('userRole');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    setUserName(user?.name || userEmail?.split('@')[0] || 'User');
    setUserRole(role || 'Patient');
    
    const fetchStats = async () => {
      try {
        const doctorCount = (await DoctorAPI.getCount())?.data || 0;
        const patientCount = (await PatientAPI.getCount())?.data || 0;

        setStats(prev => ({
          ...prev,
          doctors: doctorCount,
          patients: patientCount,
        }));
      } catch (error) {
        console.error('Dashboard load error', error);
      }
    };

    fetchStats();
    
    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timeInterval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`Searching for: ${searchQuery}`);
      // Implement actual search functionality here
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    sessionStorage.clear();
    navigate('/');
  };

  // Format date as DD-MM-YYYY
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Format time as HH:MM
  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className="dashboard-container">
      
      {/* TOP NAVIGATION BAR - Like in the uploaded image */}
      <div className="top-navbar">
        <div className="nav-left">
          <h1 className="brand" onClick={() => navigate('/dashboard')} style={{cursor: 'pointer'}}>Dandelion Pro</h1>
          <nav className="nav-menu">
            <button className="nav-link" onClick={() => handleNavigation('/dashboard')}>Dashboard</button>
            <button className="nav-link" onClick={() => handleNavigation('/doctors')}>Doctors</button>
            <button className="nav-link" onClick={() => handleNavigation('/patients')}>Patients</button>
            <button className="nav-link" onClick={() => handleNavigation('/appointments')}>Appointments</button>
            <button className="nav-link" onClick={() => handleNavigation('/medicines')}>Medicines</button>
            <button className="nav-link" onClick={() => handleNavigation('/staffmanagement')}>Departments</button>
            <button className="nav-link" onClick={() => handleNavigation('/bookingpage')}>Booking</button>
            <button className="nav-link" onClick={() => handleNavigation('/reports')}>Reports</button>
            <button className="nav-link" onClick={() => handleNavigation('/settings')}>Settings</button>
          </nav>
        </div>
        
        <div className="nav-right">
          <form onSubmit={handleSearch} className="search-container">
            <input 
              type="text" 
              placeholder="Type here to search" 
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-btn">
              <i className="fas fa-search"></i>
            </button>
          </form>
          
          <div className="user-info">
            <div className="user-details">
              <span className="user-name">{userName}</span>
              <span className="user-role">{userRole}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
          
          <div className="weather-info">
            <span className="weather-temp">{weather.temp}</span>
            <span className="current-time">{formatTime(currentTime)}</span>
            <span className="current-date">{formatDate(currentTime)}</span>
          </div>
        </div>
      </div>

      {/* MAIN DASHBOARD CONTENT */}
      <div className="dash-wrapper">
        {/* Page Title */}
        <div className="page-header">
          <h2>Dashboard Overview</h2>
          <p>Welcome to your hospital management dashboard</p>
        </div>

        {/* TOP STATS BOXES */}
        <div className="stats-container">
          <div className="stat-card blue">
            <div className="icon-box">
              <i className="fas fa-building"></i>
            </div>
            <div className="stat-info">
              <h4>Departments</h4>
              <h2>{stats.departments}</h2>
              <span>↑ 15% from last month</span>
            </div>
          </div>

          <div className="stat-card green">
            <div className="icon-box">
              <i className="fas fa-user-md"></i>
            </div>
            <div className="stat-info">
              <h4>Doctors</h4>
              <h2>{stats.doctors}</h2>
              <span>↑ 5 new this week</span>
            </div>
          </div>

          <div className="stat-card purple">
            <div className="icon-box">
              <i className="fas fa-users"></i>
            </div>
            <div className="stat-info">
              <h4>Patients</h4>
              <h2>{stats.patients}</h2>
              <span>↑ 15% from last month</span>
            </div>
          </div>

          <div className="stat-card orange">
            <div className="icon-box">
              <i className="fas fa-calendar-check"></i>
            </div>
            <div className="stat-info">
              <h4>Patient Appointments</h4>
              <h2>{stats.appointments}</h2>
              <span>Today's schedule</span>
            </div>
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="activity-section">
          <h3>Recent Activity</h3>

          <div className="activity-cards">
            <div className="activity-card">
              <div className="activity-left-border blue-border"></div>
              <div className="activity-content">
                <i className="fas fa-user-plus act-icon"></i>
                <h4>New Patient Registered</h4>
                <p>John Smith registered for consultation</p>
                <span>2 hours ago</span>
              </div>
            </div>

            <div className="activity-card">
              <div className="activity-left-border green-border"></div>
              <div className="activity-content">
                <i className="fas fa-calendar-check act-icon"></i>
                <h4>Appointment Completed</h4>
                <p>Dr. Sarah completed appointment with Lisa</p>
                <span>4 hours ago</span>
              </div>
            </div>

            <div className="activity-card">
              <div className="activity-left-border orange-border"></div>
              <div className="activity-content">
                <i className="fas fa-user-md act-icon"></i>
                <h4>Doctor Application</h4>
                <p>New doctor application received</p>
                <span>6 hours ago</span>
              </div>
            </div>
            
            <div className="activity-card">
              <div className="activity-left-border purple-border"></div>
              <div className="activity-content">
                <i className="fas fa-prescription act-icon"></i>
                <h4>New Prescription Issued</h4>
                <p>Dr. Johnson prescribed medication for patient</p>
                <span>8 hours ago</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional Dashboard Content */}
        <div className="dashboard-grid">
          <div className="grid-item appointments-widget">
            <h3>Upcoming Appointments</h3>
            <div className="appointment-list">
              <div className="appointment-item">
                <div className="appointment-time">10:30 AM</div>
                <div className="appointment-details">
                  <strong>Dr. Michael Chen</strong>
                  <span>General Checkup - Room 204</span>
                </div>
              </div>
              <div className="appointment-item">
                <div className="appointment-time">11:15 AM</div>
                <div className="appointment-details">
                  <strong>Dr. Sarah Wilson</strong>
                  <span>Follow-up - Room 301</span>
                </div>
              </div>
              <div className="appointment-item">
                <div className="appointment-time">2:00 PM</div>
                <div className="appointment-details">
                  <strong>Dr. James Rodriguez</strong>
                  <span>Consultation - Room 105</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid-item department-stats">
            <h3>Department Statistics</h3>
            <div className="department-list">
              <div className="department-item">
                <span>Cardiology</span>
                <div className="department-bar">
                  <div className="bar-fill" style={{width: '85%'}}></div>
                </div>
                <span>85%</span>
              </div>
              <div className="department-item">
                <span>Neurology</span>
                <div className="department-bar">
                  <div className="bar-fill" style={{width: '72%'}}></div>
                </div>
                <span>72%</span>
              </div>
              <div className="department-item">
                <span>Pediatrics</span>
                <div className="department-bar">
                  <div className="bar-fill" style={{width: '64%'}}></div>
                </div>
                <span>64%</span>
              </div>
              <div className="department-item">
                <span>Orthopedics</span>
                <div className="department-bar">
                  <div className="bar-fill" style={{width: '91%'}}></div>
                </div>
                <span>91%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="dashboard-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Dandelion Pro Hospital</h4>
            <p>Advanced Hospital Management System</p>
            <p>© 2025 All Rights Reserved</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <button onClick={() => handleNavigation('/doctors')}>Doctors</button>
            <button onClick={() => handleNavigation('/patients')}>Patients</button>
            <button onClick={() => handleNavigation('/appointments')}>Appointments</button>
            <button onClick={() => handleNavigation('/reports')}>Reports</button>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>Email: support@dandelionpro.com</p>
            <p>Phone: +1 (555) 123-4567</p>
            <p>Address: 123 Hospital St, Medical City</p>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <button onClick={() => handleNavigation('/settings')}>Help Center</button>
            <button>Privacy Policy</button>
            <button>Terms of Service</button>
          </div>
        </div>
        <div className="footer-bottom">
          <p>Dandelion Pro v2.0.1 • React.js Hospital Management System</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;