import React, { useEffect, useState } from 'react';
import { DoctorAPI, PatientAPI } from '../services/api.js';
import './css/Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    departments: 0,
    doctors: 0,
    patients: 0,
    appointments: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const doctorCount = (await DoctorAPI.getCount()).data;
        const patientCount = (await PatientAPI.getCount()).data;

        setStats({
          departments: 0,
          doctors: doctorCount,
          patients: patientCount,
          appointments: 0,
        });
      } catch (error) {
        console.error('Dashboard load error', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="dash-wrapper">

      {/* TOP STATS BOXES */}
      <div className="stats-container">

        <div className="stat-card blue">
          <div className="icon-box">
            <i className="fas fa-users"></i>
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

        <div className="stat-card blue">
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

        </div>
      </div>

    </div>
  );
};

export default Dashboard;
