import React from 'react';

const AddDoctor = ({ onSubmit, onCancel }) => {
  return (
    <div className="page-content active">
      <div className="form-container">
        <div className="form-header">
          <h2>Add New Doctor</h2>
          <button className="btn-back" onClick={onCancel}>
            <i className="fas fa-arrow-left"></i> Back to Doctors
          </button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label>Full Name *</label>
              <input type="text" name="name" placeholder="Enter full name" required />
            </div>
            <div className="form-field">
              <label>Specialization *</label>
              <select name="specialization" required>
                <option value="">Select</option>
                <option>Cardiology</option>
                <option>Neurology</option>
                <option>Pediatrics</option>
                <option>Orthopedics</option>
                <option>Dermatology</option>
                <option>General Medicine</option>
              </select>
            </div>
            <div className="form-field">
              <label>Phone Number *</label>
              <input type="tel" name="phone" placeholder="+1 234 567 8900" required />
            </div>
            <div className="form-field">
              <label>Email *</label>
              <input type="email" name="email" placeholder="doctor@example.com" required />
            </div>
            <div className="form-field">
              <label>Experience (Years) *</label>
              <input type="number" name="experience" placeholder="0" min="0" required />
            </div>
            <div className="form-field">
              <label>Qualification *</label>
              <input type="text" name="qualification" placeholder="MBBS, MD" required />
            </div>
            <div className="form-field full">
              <label>Address</label>
              <textarea name="address" rows="3" placeholder="Enter full address"></textarea>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn-submit">Save Doctor</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDoctor;