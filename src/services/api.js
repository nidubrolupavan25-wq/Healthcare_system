import axios from "axios";

const API_BASE_URL = "http://192.168.68.137:9090/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ----------------------
// Hospital APIs (ADDED)
// ----------------------
export const HospitalAPI = {
  getAll: () => api.get("/hospitals"),
  getById: (id) => api.get(`/hospitals/${id}`),
  getPendingApprovals: () => api.get("/hospitals/status/pending"),
  getApproved: () => api.get("/hospitals/status/approved"),
  getRejected: () => api.get("/hospitals/status/rejected"),
  updateStatus: (id, status) => api.patch(`/hospitals/${id}/status`, { status }),
  delete: (id) => api.delete(`/hospitals/${id}`),
  update: (id, data) => api.put(`/hospitals/${id}`, data),
  
  // Medical Stores (if separate from hospitals)
  getMedicalStores: () => api.get("/medical-stores"),
  getMedicalStoreById: (id) => api.get(`/medical-stores/${id}`),
  updateMedicalStoreStatus: (id, status) => api.patch(`/medical-stores/${id}/status`, { status }),
};

// ----------------------
// Doctor APIs
// ----------------------
export const DoctorAPI = {
  getAll: () => api.get("/doctors"),
  getCount: () => api.get("/doctors/count"),
  patchById: (id, data) => api.patch(`/doctors/${id}`, data),
  getById: (id) => api.get(`/doctors/${id}`),
};

// ----------------------
// Patient APIs
// ----------------------
export const PatientAPI = {
  getAll: () => api.get("/patient"), 
  getCount: () => api.get("/patient/count"),
  getFiltered: (params) => api.get("/patient/filter/native", { params }),
  add: (data) => api.post("/patient/add", data),
  getById: (id) => api.get(`/patient/${id}`),
  getFullDetails: (id) => api.get(`/patient/full-details/${id}`),
  updatePartial: (id, data) => api.patch(`/patient/${id}`, data),
  delete: (id) => api.delete(`/patient/${id}`),
   getTodayAll: () => api.get("/patient/today/all"),
};



// ----------------------
// Ward APIs
// ----------------------
export const WardAPI = {
  getAll: () => api.get("/wards/all"),
  add: (wardData) => api.post("/wards/add", wardData),
  getTotalBeds: (wardId) => api.get(`/wards/${wardId}/total-beds`),
  getBookedBeds: (wardId) => api.get(`/wards/${wardId}/booked-beds`),
  getAvailableBeds: (wardId) => api.get(`/wards/${wardId}/available-beds`),
  getAllBeds: (wardId) => api.get(`/wards/${wardId}/bedss`),
  getAvailableBedsList: (wardId) => api.get(`/wards/${wardId}/available-bedss`),
  getBookedBedsList: (wardId) => api.get(`/wards/${wardId}/booked-bedss`),
  deleteWard: (wardId) => api.delete(`/wards/delete/${wardId}`),
  
};

export const LabAPI = {
  // Categories
  getAllCategories: () => api.get("/labs/categories"),
  addCategory: (data) => api.post("/labs/categories", data),
  updateCategory: (id, data) => api.put(`/labs/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/labs/categories/${id}`),

  // Tests
  getAllTests: () => api.get("/labs/tests"),
  addTest: (data) => api.post("/labs/tests", data),
  updateTest: (id, data) => api.patch(`/labs/tests/${id}`, data),
  deleteTest: (id) => api.delete(`/labs/tests/${id}`),

  getUrgent: () => api.get("/labs/status/urgent"),
  getPending: () => api.get("/labs/status/pending"),
  getCompleted: () => api.get("/labs/status/completed"),
  getAll: () => api.get("/labs/status/all"),
  getFullHistory: (patientId) => api.get(`/labs/history/${patientId}`),


  // Reports
  uploadReport: (patientId, testId, file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post(`/labs/reports/upload/${patientId}/${testId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  getPatientReports: (patientId) => api.get(`/labs/reports/patient/${patientId}`),
};
// ----------------------
// Bed Booking APIs
// ----------------------
export const BedBookingAPI = {
  bookBed: (bookingData) => api.post("/bed-booking/book", bookingData),
  updateBedByWardAndBed: (data) => api.put("/bed-booking/update-by-bed", data),
  deleteBed: (data) => api.post("/bed-booking/delete-bed", data),
  addBed: (data) => api.post("/bed-booking/add-bed", data),
};

// ---------------------- Medicine APIs ----------------------
export const MedicineAPI = {
  getAll: () => api.get("/medicines"),
  getOutOfStock: () => api.get("/medicines/out-of-stock"),
  getExpired: () => api.get("/medicines/expired"),
  getById: (id) => api.get(`/medicines/${id}`),
  create: (data) => api.post("/medicines", data),
  update: (id, data) => api.patch(`/medicines/${id}`, data),
  delete: (id) => api.delete(`/medicines/${id}`),
};

// src/services/api.js  (or wherever your api file lives)

export const SupplierAPI = {
  getAll: () => api.get("/suppliers"),
  create: (data) => api.post("/suppliers", data),
  update: (id, data) => api.patch(`/suppliers/${id}`, data),
  delete: (id) => api.delete(`/suppliers/${id}`),
};
export const StaffAPI = {
  getAll: () => api.get("/staff"),
  getByDepartment: (dept) => api.get(`/staff/department/${dept}`),
  getByEmail: (email) => api.get(`/staff/email/${email}`),
  add: (data) => api.post("/staff", data),
  delete: (id) => api.delete(`/staff/${id}`),
  update: (id, data) => api.put(`/staff/${id}`, data),
  uploadImage: (id, formData) => api.post(`/staff/${id}/upload-image`, formData),
  deleteImage: (id) => api.delete(`/staff/${id}/delete-image`),
};
export const LoginAPI = {
  login: (email, password) => api.post("/staff/login", { email, password }),
  verifyOtp: (email, otp) => api.post("/staff/verify-otp", { email, otp }),
  sendOtp: (email) => api.post("/staff/send-otp", { email }),
};
export const AuthAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  verifyOtp: (email, otp) => api.post("/auth/verify-otp", { email, otp }),
  // ---------------------- Password Update API ----------------------

  updatePassword: (email, password) =>
    api.put("/staff/password/update", { email, password }),


};




export const OnboardingAPI = {
  // STEP 1: Hospital basic details
  saveHospitalDetails(data) {
    return axios.post(`${API_BASE_URL}/hospital-details`, data);
  },

  // STEP 2: Owner + bank details (bank skipped now)
  saveOwnerDetails(data) {
    return axios.post(`${API_BASE_URL}/owner-details`, data);
  },

  // STEP 3: Services & departments
  saveServices(data) {
    return axios.post(`${API_BASE_URL}/services`, data);
  },

  // STEP 4: Upload Image
  uploadImage(hospitalId, imageType, file) {
    const formData = new FormData();
    formData.append("file", file);

    return axios.post(
      `${API_BASE_URL}/upload-image?hospitalId=${hospitalId}&imageType=${imageType}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  },

  // FINAL: Submit onboarding
  submitOnboarding(hospitalId) {
    return axios.post(`${API_BASE_URL}/submit?hospitalId=${hospitalId}`);
  },

  // Get hospital by ID
  getHospital(id) {
    return axios.get(`${API_BASE_URL}/hospital/${id}`);
  }
};

export default api;