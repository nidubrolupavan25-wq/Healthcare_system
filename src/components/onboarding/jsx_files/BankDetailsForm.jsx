

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/BankDetailsForm.css";

const BankDetailsForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    account_no: "",
    ifsc_code: "",
    branch_name: "",
    bank_name: "",
    bank_holder_name: "",
    passbook_image: null,
  });

  // 1️⃣ Load saved data when coming back from Certification Page
  useEffect(() => {
    const savedBank = localStorage.getItem("bankDetails");
    const savedPassbook = localStorage.getItem("passbookFile");

    if (savedBank) {
      const data = JSON.parse(savedBank);
      setFormData(prev => ({
        ...prev,
        account_no: data.account_no,
        ifsc_code: data.ifsc_code,
        branch_name: data.branch_name,
        bank_name: data.bank_name,
        bank_holder_name: data.bank_holder_name,
      }));
    }

    if (savedPassbook) {
      // Not converting back to file here (not needed)
      setFormData(prev => ({ ...prev, passbook_image: savedPassbook }));
    }
  }, []);

  const handleImageUpload = (e) => {
    setFormData({ ...formData, passbook_image: e.target.files[0] });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Store bank details
    localStorage.setItem("bankDetails", JSON.stringify({
      account_no: formData.account_no,
      ifsc_code: formData.ifsc_code,
      branch_name: formData.branch_name,
      bank_name: formData.bank_name,
      bank_holder_name: formData.bank_holder_name,
    }));

    // Save passbook image (base64)
    if (formData.passbook_image instanceof File) {
      const reader = new FileReader();
      reader.readAsDataURL(formData.passbook_image);
      reader.onload = () => {
        localStorage.setItem("passbookFile", reader.result);
        navigate("/onboarding/certification");
      };
    } else {
      navigate("/onboarding/certification");
    }
  };


  return (
    <div className="form-container">
      <h2 className="form-title">Bank Details Form</h2>

      <form onSubmit={handleSubmit}>
        <div className="flex-row">
          <div className="form-group">
            <label>Account Holder Name</label>
            <input
              type="text"
              name="bank_holder_name"
              value={formData.bank_holder_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Bank Name</label>
            <input
              type="text"
              name="bank_name"
              value={formData.bank_name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="flex-row">
          <div className="form-group">
            <label>Account Number</label>
            <input
              type="number"
              name="account_no"
              value={formData.account_no}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>IFSC Code</label>
            <input
              type="text"
              name="ifsc_code"
              value={formData.ifsc_code}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="flex-row">
          <div className="form-group">
            <label>Branch Name</label>
            <input
              type="text"
              name="branch_name"
              value={formData.branch_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Upload Passbook / Cheque</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              required
            />
          </div>
        </div>

       <div className="button-row">
          <button
            type="button"
            className="prev-btn"
            onClick={() => navigate("/onboarding/owner-details")}
          >
            ⬅ Previous
          </button>

          <button type="submit" className="submit-btn">
            Next ➜
          </button>
        </div>
      </form>
    </div>
  );
};

export default BankDetailsForm;
