// src/components/onboarding/OnboardFooter.jsx
import React from "react";
import "./css/OnboardFooter.css";
import { Shield, Heart, MessageCircle } from "lucide-react";

const OnboardFooter = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="onboard-footer">
      <div className="footer-top">
        <div className="footer-section">
          <div className="footer-icon">
            <Shield size={20} />
          </div>
          <div className="footer-text">
            <h4>Secure & Compliant</h4>
            <p>HIPAA compliant data protection</p>
          </div>
        </div>
        
        <div className="footer-section">
          <div className="footer-icon">
            <Heart size={20} />
          </div>
          <div className="footer-text">
            <h4>24/7 Support</h4>
            <p>Always here to help you</p>
          </div>
        </div>
        
        <div className="footer-section">
          <div className="footer-icon">
            <MessageCircle size={20} />
          </div>
          <div className="footer-text">
            <h4>Need Help?</h4>
            <p>Contact: support@mediconnect.com</p>
          </div>
        </div>
      </div>
      
      <div className="footer-divider"></div>
      
      <div className="footer-bottom">
        <p className="copyright">
          © {currentYear} <strong>MediConnect</strong> — Hospital Management System. All rights reserved.
        </p>
        <div className="footer-links">
          <a href="/privacy">Privacy Policy</a>
          <span className="divider">•</span>
          <a href="/terms">Terms of Service</a>
          <span className="divider">•</span>
          <a href="/help">Help Center</a>
        </div>
      </div>
    </footer>
  );
};

export default OnboardFooter;