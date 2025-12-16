import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-logo">Dandelion Pro</h3>
          <p className="footer-description">
            Advanced Hospital Management System providing comprehensive 
            healthcare solutions with modern technology.
          </p>
          <div className="social-links">
            <a href="#" className="social-link"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social-link"><i className="fab fa-twitter"></i></a>
            <a href="#" className="social-link"><i className="fab fa-linkedin-in"></i></a>
            <a href="#" className="social-link"><i className="fab fa-instagram"></i></a>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="footer-title">Quick Links</h4>
          <ul className="footer-links">
            <li><button onClick={() => handleNavigation('/dashboard')}>Dashboard</button></li>
            <li><button onClick={() => handleNavigation('/doctors')}>Doctors</button></li>
            <li><button onClick={() => handleNavigation('/patients')}>Patients</button></li>
            <li><button onClick={() => handleNavigation('/appointments')}>Appointments</button></li>
            <li><button onClick={() => handleNavigation('/reports')}>Reports</button></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-title">Services</h4>
          <ul className="footer-links">
            <li><button>Patient Management</button></li>
            <li><button>Doctor Scheduling</button></li>
            <li><button>Medical Records</button></li>
            <li><button>Billing System</button></li>
            <li><button>Lab Integration</button></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-title">Contact Info</h4>
          <div className="contact-info">
            <p><i className="fas fa-map-marker-alt"></i> 123 Hospital Street, Medical City</p>
            <p><i className="fas fa-phone"></i> +1 (555) 123-4567</p>
            <p><i className="fas fa-envelope"></i> support@dandelionpro.com</p>
            <p><i className="fas fa-clock"></i> 24/7 Emergency Support</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; {currentYear} Dandelion Pro Hospital Management System. All rights reserved.</p>
          <div className="footer-bottom-links">
            <button onClick={() => handleNavigation('/settings')}>Privacy Policy</button>
            <span>•</span>
            <button>Terms of Service</button>
            <span>•</span>
            <button>Cookie Policy</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;