import React, { useState, useRef } from "react";
import axios from "axios";

const DoctorRegister = () => {
  const genders = ["Male", "Female", "Other"];
  const specializations = [
    "Cardiologist", "Dermatologist", "Neurologist", "Pediatrician",
    "Orthopedic", "General Physician", "Psychiatrist", "Gynecologist",
    "Dentist", "ENT Specialist"
  ];
  const roles = ["Doctor", "Consultant", "Surgeon", "Specialist"];
  const statuses = ["Active", "Inactive"];

  const [formData, setFormData] = useState({
    doctorId: "",
    first_name: "", last_name: "", email: "", phone: "",
    password: "", confirm_password: "", date_of_birth: "",
    gender: "", country: "", state: "", city: "", address: "",
    pin_code: "", specialization: "", qualification: "",
    experience_years: "", license_number: "", role: "", status: "",
    profile_photo: null
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const refs = {
    doctorId: useRef(null), first_name: useRef(null), last_name: useRef(null),
    email: useRef(null), phone: useRef(null), password: useRef(null),
    confirm_password: useRef(null), date_of_birth: useRef(null),
    gender: useRef(null), country: useRef(null), state: useRef(null),
    city: useRef(null), address: useRef(null), pin_code: useRef(null),
    specialization: useRef(null), qualification: useRef(null),
    experience_years: useRef(null), license_number: useRef(null),
    role: useRef(null), status: useRef(null), profile_photo: useRef(null)
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setSuccess("");
  };

  const validate = () => {
    const newErrors = {};
    const requiredFields = [
      "doctorId", "first_name", "last_name", "email", "phone", "password", "confirm_password",
      "date_of_birth", "gender", "country", "state", "city", "address", "pin_code",
      "specialization", "qualification", "experience_years", "license_number",
      "role", "status"
    ];

    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].toString().trim() === "") {
        newErrors[field] = `${field.replace("_", " ")} is required`;
      }
    });

    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = "Passwords do not match";
    }

    if (!formData.profile_photo) {
      newErrors.profile_photo = "Profile photo is required";
    }

    setErrors(newErrors);
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      const firstError = Object.keys(validationErrors)[0];
      if (refs[firstError] && refs[firstError].current) {
        refs[firstError].current.scrollIntoView({ behavior: "smooth", block: "center" });
        refs[firstError].current.focus();
      }
      return;
    }

    try {
      const data = new FormData();
      data.append("doctorId", formData.doctorId);
      data.append("doctorName", `${formData.first_name} ${formData.last_name}`);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("password", formData.password);
      data.append("specialization", formData.specialization);
      data.append("role", formData.role);
      data.append("status", formData.status);
      data.append("address", formData.address);
      data.append("dateOfBirth", formData.date_of_birth);
      data.append("gender", formData.gender);
      data.append("experience", formData.experience_years);
      data.append("medicalLicenseNo", formData.license_number);
      if (formData.profile_photo) data.append("imageFile", formData.profile_photo);

      await axios.post("http://localhost:9090/api/doctors", data);

      setSuccess("Doctor Registered Successfully ✅");
      setErrors({});
      setFormData({
        doctorId: "", first_name: "", last_name: "", email: "", phone: "",
        password: "", confirm_password: "", date_of_birth: "", gender: "",
        country: "", state: "", city: "", address: "", pin_code: "",
        specialization: "", qualification: "", experience_years: "",
        license_number: "", role: "", status: "", profile_photo: null
      });
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      alert(message);
      setErrors({ apiError: message });
    }
  };

  return (
    /* add both form-container and register-container so shared form styles and register-specific styles apply */
    <div className="form-container register-container">
      <h2>Doctor Registration</h2>
      {success && <div className="success-message">{success}</div>}
      {errors.apiError && <div className="error-message">{errors.apiError}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <h3>Personal Info</h3>
        <div className="grid-container">
          <div className="form-group">
            <label>Doctor ID *</label>
            <input ref={refs.doctorId} type="number" name="doctorId" value={formData.doctorId} onChange={handleChange} />
            {errors.doctorId && <span className="error">{errors.doctorId}</span>}
          </div>

          <div className="form-group">
            <label>First Name *</label>
            <input ref={refs.first_name} name="first_name" value={formData.first_name} onChange={handleChange} />
            {errors.first_name && <span className="error">{errors.first_name}</span>}
          </div>

          <div className="form-group">
            <label>Last Name *</label>
            <input ref={refs.last_name} name="last_name" value={formData.last_name} onChange={handleChange} />
            {errors.last_name && <span className="error">{errors.last_name}</span>}
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input ref={refs.email} type="email" name="email" value={formData.email} onChange={handleChange} />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Phone *</label>
            <input ref={refs.phone} type="tel" name="phone" value={formData.phone} onChange={handleChange} />
            {errors.phone && <span className="error">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input ref={refs.password} type="password" name="password" value={formData.password} onChange={handleChange} />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label>Confirm Password *</label>
            <input ref={refs.confirm_password} type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} />
            {errors.confirm_password && <span className="error">{errors.confirm_password}</span>}
          </div>

          <div className="form-group">
            <label>Date of Birth *</label>
            <input ref={refs.date_of_birth} type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} />
            {errors.date_of_birth && <span className="error">{errors.date_of_birth}</span>}
          </div>

          <div className="form-group">
            <label>Gender *</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Select</option>
              {genders.map((g, i) => <option key={i} value={g}>{g}</option>)}
            </select>
            {errors.gender && <span className="error">{errors.gender}</span>}
          </div>

          <div className="form-group">
            <label>Profile Photo *</label>
            <input type="file" name="profile_photo" onChange={handleChange} />
            {errors.profile_photo && <span className="error">{errors.profile_photo}</span>}
          </div>
        </div>

        <h3>Address Info</h3>
        <div className="grid-container">
          <div className="form-group">
            <label>Country *</label>
            <input ref={refs.country} name="country" value={formData.country} onChange={handleChange} />
            {errors.country && <span className="error">{errors.country}</span>}
          </div>

          <div className="form-group">
            <label>State *</label>
            <input ref={refs.state} name="state" value={formData.state} onChange={handleChange} />
            {errors.state && <span className="error">{errors.state}</span>}
          </div>

          <div className="form-group">
            <label>City *</label>
            <input ref={refs.city} name="city" value={formData.city} onChange={handleChange} />
            {errors.city && <span className="error">{errors.city}</span>}
          </div>

          <div className="form-group">
            <label>PIN Code *</label>
            <input ref={refs.pin_code} name="pin_code" value={formData.pin_code} onChange={handleChange} />
            {errors.pin_code && <span className="error">{errors.pin_code}</span>}
          </div>

          <div className="form-group full-width">
            <label>Address *</label>
            <textarea name="address" value={formData.address} onChange={handleChange}></textarea>
            {errors.address && <span className="error">{errors.address}</span>}
          </div>
        </div>

        <h3>Professional Info</h3>
        <div className="grid-container">
          <div className="form-group">
            <label>Specialization *</label>
            <select name="specialization" value={formData.specialization} onChange={handleChange}>
              <option value="">Select Specialization</option>
              {specializations.map((spec, i) => <option key={i} value={spec}>{spec}</option>)}
            </select>
            {errors.specialization && <span className="error">{errors.specialization}</span>}
          </div>

          <div className="form-group">
            <label>Qualification *</label>
            <input ref={refs.qualification} name="qualification" value={formData.qualification} onChange={handleChange} />
            {errors.qualification && <span className="error">{errors.qualification}</span>}
          </div>

          <div className="form-group">
            <label>Experience Years *</label>
            <input ref={refs.experience_years} type="number" name="experience_years" value={formData.experience_years} onChange={handleChange} />
            {errors.experience_years && <span className="error">{errors.experience_years}</span>}
          </div>

          <div className="form-group">
            <label>License Number *</label>
            <input ref={refs.license_number} name="license_number" value={formData.license_number} onChange={handleChange} />
            {errors.license_number && <span className="error">{errors.license_number}</span>}
          </div>

          <div className="form-group">
            <label>Role *</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="">Select Role</option>
              {roles.map((r, i) => <option key={i} value={r}>{r}</option>)}
            </select>
            {errors.role && <span className="error">{errors.role}</span>}
          </div>

          <div className="form-group">
            <label>Status *</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="">Select Status</option>
              {statuses.map((s, i) => <option key={i} value={s}>{s}</option>)}
            </select>
            {errors.status && <span className="error">{errors.status}</span>}
          </div>
        </div>

        {/* keep both submit-btn and btn-submit so either CSS rule matches */}
        <button type="submit" className="submit-btn btn-submit">Register</button>
      </form>
    </div>
  );
};

export default DoctorRegister;
