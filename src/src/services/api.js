import axios from "axios";

const API_BASE_URL = "http://192.168.68.147:9090/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================= STAFF ================= */
export const StaffAPI = {
  getAll: () => api.get("/staff"),
  getByDepartment: (dept) => api.get(`/staff/department/${dept}`),
  getByEmail: (email) => api.get(`/staff/email/${email}`),
};

/* ================= AUTH ================= */
export const AuthAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  verifyOtp: (email, otp) => api.post("/auth/verify-otp", { email, otp }),
};

/* ================= MEDICINES ================= */
export const MedicineAPI = {
  getGlobalMedicines: (params) => api.get("/medicines/global", { params }),
  getMedicineDetails: (id) => api.get(`/medicines/${id}/details`),
  getReviews: (id) => api.get(`/medicines/${id}/reviews`),
};

/* ================= ORGANIZATIONS ================= */
export const OrganizationAPI = {
  // Paginated list
  getOrganizations: ({ type, page = 0, size = 10, sort = "rating,desc" }) =>
    api.get("/hospitals", {
      params: { type, page, size, sort },
    }),

  // Nearby (MAP)
  getNearby: ({ latitude, longitude, radius = 5, type }) =>
    api.get("/hospitals/nearby", {
      params: { latitude, longitude, radius, type },
    }),

  // Details page
  getDetails: (id) => api.get(`/hospitals/${id}`),
};

export default api;
