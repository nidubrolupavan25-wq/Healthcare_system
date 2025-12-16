import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DoctorAPI, PatientAPI } from '../services/api.js';
import './css/DashboardImproved.css';
import Header from './Header/Header';
import Footer from './Footer/Footer';

const DashboardImproved = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    departments: 12,
    doctors: 0,
    patients: 0,
    appointments: 45,
    revenue: '$45,200',
    beds: 250,
  });

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, type: 'appointment', message: 'New appointment scheduled', time: '2 hours ago' },
    { id: 2, type: 'patient', message: 'New patient registered', time: '4 hours ago' },
    { id: 3, type: 'doctor', message: 'Dr. Smith added to system', time: '6 hours ago' },
    { id: 4, type: 'lab', message: 'Lab results submitted', time: '8 hours ago' },
  ]);

  const [userName, setUserName] = useState('Admin');
  const [userRole, setUserRole] = useState('Administrator');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    const role = localStorage.getItem('userRole');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    setUserName(user?.name || userEmail?.split('@')[0] || 'Admin');
    setUserRole(role || 'Administrator');
    
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
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/');
  };

  const quickActions = [
    { label: 'Add Doctor', path: '/doctorregister', icon: '👨‍⚕️' },
    { label: 'Add Patient', path: '/patientregister', icon: '🏥' },
    { label: 'Schedule Appointment', path: '/appointments', icon: '📅' },
    { label: 'View Reports', path: '/reports', icon: '📊' },
  ];

  return (
    <div className="dashboard-improved">
      <Header userName={userName} userRole={userRole} onLogout={handleLogout} />
      
      <div className="dashboard-content">
        {/* Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-text">
            <h1>Welcome back, {userName}! 👋</h1>
            <p>Here's what's happening in your hospital today</p>
          </div>
          <div className="date-time">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card doctors">
            <div className="stat-icon">👨‍⚕️</div>
            <div className="stat-content">
              <h3>Total Doctors</h3>
              <p className="stat-number">{stats.doctors}</p>
              <span className="stat-change">+2 this month</span>
            </div>
          </div>

          <div className="stat-card patients">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>Total Patients</h3>
              <p className="stat-number">{stats.patients}</p>
              <span className="stat-change">+15 this week</span>
            </div>
          </div>

          <div className="stat-card appointments">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <h3>Appointments</h3>
              <p className="stat-number">{stats.appointments}</p>
              <span className="stat-change">12 pending</span>
            </div>
          </div>

          <div className="stat-card revenue">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>Revenue</h3>
              <p className="stat-number">{stats.revenue}</p>
              <span className="stat-change">+8% from last month</span>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* Quick Actions */}
          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="action-btn"
                  onClick={() => navigate(action.path)}
                >
                  <span className="action-icon">{action.icon}</span>
                  <span className="action-label">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="recent-activities">
            <h2>Recent Activities</h2>
            <div className="activities-list">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">{activity.type === 'appointment' ? '📅' : activity.type === 'patient' ? '👥' : activity.type === 'doctor' ? '👨‍⚕️' : '🔬'}</div>
                  <div className="activity-content">
                    <p className="activity-message">{activity.message}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="navigation-section">
          <h2>Manage Modules</h2>
          <div className="nav-grid">
            <div className="nav-card" onClick={() => navigate('/doctors')}>
              <div className="nav-icon">👨‍⚕️</div>
              <h3>Doctors</h3>
              <p>Manage doctors & schedules</p>
            </div>
            <div className="nav-card" onClick={() => navigate('/patients')}>
              <div className="nav-icon">👥</div>
              <h3>Patients</h3>
              <p>View patient records</p>
            </div>
            <div className="nav-card" onClick={() => navigate('/medicines')}>
              <div className="nav-icon">💊</div>
              <h3>Medicines</h3>
              <p>Manage inventory</p>
            </div>
            <div className="nav-card" onClick={() => navigate('/labmanagement')}>
              <div className="nav-icon">🔬</div>
              <h3>Lab Tests</h3>
              <p>Lab management</p>
            </div>
            <div className="nav-card" onClick={() => navigate('/appointments')}>
              <div className="nav-icon">📅</div>
              <h3>Appointments</h3>
              <p>Schedule & manage</p>
            </div>
            <div className="nav-card" onClick={() => navigate('/reports')}>
              <div className="nav-icon">📊</div>
              <h3>Reports</h3>
              <p>View analytics</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DashboardImproved;
