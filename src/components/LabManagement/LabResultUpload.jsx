import React, { useState, useRef, useEffect } from 'react';
import './LabResultUpload.css';
import { LabAPI } from '../../services/api'; // ✅ ensure correct import path

const LabResultUpload = ({ onUploadSuccess }) => {
  const [patientId, setPatientId] = useState('');
  const [testId, setTestId] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [tests, setTests] = useState([]); // ✅ Store fetched tests
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  // ✅ Fetch all tests on mount
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await LabAPI.getAllTests();
        setTests(res.data || []);
      } catch (err) {
        console.error('Failed to fetch tests:', err);
        showAlert('❌ Failed to load test names. Please try again later.', 'error');
      }
    };
    fetchTests();
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (selected.type === 'application/pdf') {
        setPreview(`<iframe src="${ev.target.result}" style="width:100%;height:400px;"></iframe>`);
      } else {
        setPreview(`<img src="${ev.target.result}" style="max-width:100%;max-height:400px;" />`);
      }
    };
    reader.readAsDataURL(selected);
  };

  const uploadNewReport = async () => {
    if (!patientId.trim()) {
      showAlert('Please enter <strong>Patient ID</strong>!', 'error');
      return;
    }
    if (!testId.trim()) {
      showAlert('Please select a <strong>Test Name</strong>!', 'error');
      return;
    }
    if (!file) {
      showAlert('Please select a report file to upload!', 'error');
      return;
    }

    setLoading(true);

    try {
      console.log('[LabResultUpload] Uploading report for:', { patientId, testId, file: file.name });
      const res = await LabAPI.uploadReport(patientId.trim(), testId.trim(), file);
      const data = res.data;
      console.log('[Upload Success]', data);

      showAlert(
        `✅ Report <strong>${data.fileName ?? file.name}</strong> uploaded successfully for <strong>Patient ID ${patientId}</strong>!`,
        'success'
      );

      resetForm();
      setTimeout(() => onUploadSuccess?.(), 1500);
    } catch (err) {
      console.error('[Upload Error]', err);
      const msg = err.response?.data?.message || err.message || 'Something went wrong while uploading.';
      showAlert(`❌ ${msg}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (msg, type) => {
    setAlert({ show: true, message: msg, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 6000);
  };

  const resetForm = () => {
    setPatientId('');
    setTestId('');
    setFile(null);
    setPreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div>
      <h2>Upload New Patient Report</h2>

      <div className="lab-card">
        <div className="lab-card-header">Insert New Report Record</div>

        {alert.show && (
          <div className={`lab-alert lab-alert-${alert.type}`} dangerouslySetInnerHTML={{ __html: alert.message }} />
        )}

        {/* Patient ID */}
        <label><strong>Patient ID</strong></label>
        <input
          type="text"
          className="lab-input"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          placeholder="Enter Patient ID (e.g., 101)"
        />

        {/* ✅ Test Dropdown */}
        <label><strong>Select Test Name</strong></label>
        <select
          className="lab-input"
          value={testId}
          onChange={(e) => setTestId(e.target.value)}
        >
          <option value="">-- Select Test --</option>
          {tests.map((test) => (
            <option key={test.testId} value={test.testId}>
              {test.testName} (₹{test.testCost})
            </option>
          ))}
        </select>

        {/* File Upload */}
        <label><strong>Upload Report File</strong></label>
        <div className="lab-file-upload" onClick={() => fileInputRef.current && fileInputRef.current.click()}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <p>{file ? file.name : 'Click to upload report (PDF or Image)'}</p>
        </div>

        {/* Preview */}
        {preview && (
          <div className="lab-file-preview" dangerouslySetInnerHTML={{ __html: preview }} />
        )}

        <button
          className="lab-btn lab-btn-success"
          onClick={uploadNewReport}
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Insert New Report'}
        </button>
      </div>
    </div>
  );
};

export default LabResultUpload;
