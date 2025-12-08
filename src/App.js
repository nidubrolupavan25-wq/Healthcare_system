// src/App.js
import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  Outlet,
  BrowserRouter as Router,
  useLocation,
} from "react-router-dom";
import "./App.css";
import { UserProvider } from "./context/UserContext";

// ----- LAYOUTS -----
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import LoginPage from './components/Login/LoginPage';

// ----- ADMIN PAGES -----
import Dashboard from "./components/Dashboard";
import DoctorsList from "./components/Doctors/DoctorsList";
import AddDoctor from "./components/Doctors/AddDoctor";
import DoctorRegister from "./components/Doctors/DoctorRegister";
import DoctorView from "./components/Doctors/DoctorView";
import PatientsList from "./components/Patients/PatientsList";
import PatientRegister from "./components/Patients/PatientRegister";
import PatientView from "./components/Patients/PatientView";
import BookingPage from "./components/RoomMangement/BookingPage";
import Appointments from "./components/Appointments/AppointmentsList";
import MedicinePage from "./components/Medicine/MedicinePage";
import StaffManagement from "./components/Medicine/StaffManagement";
import Reports from "./components/Sidebar/Reports";
import Settings from "./components/Sidebar/Settings";
import LabManagementMain from "./components/LabManagement/LabManagementMain";
import LabManagement from "./components/LabManagement/LabManagement";

// ----- RECEPTION MODULE -----
import ReceptionLayout from "./components/Reception/ReceptionLayout";
import ReceptionPatientList from "./components/Reception/ReceptionPatientList";
import ReceptionPatientRegister from "./components/Reception/ReceptionPatientRegister";
import ReceptionDashboard from "./components/Reception/ReceptionDashboard";

// ----- MEDICAL DASHBOARD MODULE -----
import MedicalDashboard from "./components/MedicalDashboard/MedicalDashboard";
import MedicalStock from "./components/MedicalDashboard/jsx_files/MedicalStock";
import PatientPrescription from "./components/MedicalDashboard/jsx_files/PatientPrescription";
import Customers from "./components/MedicalDashboard/jsx_files/Customers";
import Inventory from "./components/MedicalDashboard/jsx_files/Inventory";
import Billing from "./components/MedicalDashboard/jsx_files/Billing";
import Orders from "./components/MedicalDashboard/jsx_files/Orders";
import SearchPage from "./components/MedicalDashboard/jsx_files/SearchPage";

// ----- SUPER ADMIN -----
import SuperAdminDashboard from "./components/SuperAdminDashboard/SuperAdminDashboard";
import SuperAdminProtectedRoute from "./components/SuperAdminDashboard/SuperAdminProtectedRoute";

// ----- ONBOARDING MODULE -----
import { OnboardingProvider } from "./components/onboarding/context/OnboardingContext";
import HospitalDetails from "./components/onboarding/jsx_files/HospitalDetails";
import OwnerDetails from "./components/onboarding/jsx_files/OwnerDetails";
import Services from "./components/onboarding/jsx_files/Services";
import Images from "./components/onboarding/jsx_files/Images";
import ReviewSubmit from "./components/onboarding/jsx_files/ReviewSubmit";
import BankDetailsForm from "./components/onboarding/jsx_files/BankDetailsForm";
import Certifications from "./components/onboarding/jsx_files/Certifications";

// ---- Role Check Helper ----
const checkUserRole = () => {
  const userEmail = localStorage.getItem("userEmail");
  const userRole = localStorage.getItem("userRole");
  
  // Debug log
  console.log("Current User Auth:", { userEmail, userRole });
  
  if (!userEmail) return null;
  
  // Normalize role for comparison
  const normalizedRole = userRole?.toLowerCase().trim() || '';
  
  // Check for super admin roles
  const isSuperAdmin = [
    'super admin', 
    'super_admin', 
    'superadmin',
    'superadministrator',
    'super administrator'
  ].includes(normalizedRole);
  
  return {
    email: userEmail,
    role: userRole,
    normalizedRole: normalizedRole,
    isSuperAdmin: isSuperAdmin,
    isAuthenticated: !!userEmail
  };
};

// ---- Protected Route ----
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const userAuth = checkUserRole();
  const location = useLocation();
  
  console.log("ProtectedRoute check:", userAuth);
  
  if (!userAuth?.isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  
  // If user is Super Admin, they should go to super-admin dashboard
  if (userAuth?.isSuperAdmin && !location.pathname.startsWith('/super-admin')) {
    return <Navigate to="/super-admin" replace />;
  }
  
  // If specific roles are required
  if (allowedRoles.length > 0) {
    const hasAccess = userAuth?.isSuperAdmin || allowedRoles.some(allowedRole => 
      userAuth?.normalizedRole.includes(allowedRole.toLowerCase())
    );
    
    if (!hasAccess) {
      return <Navigate to="/dashboard" replace />;
    }
  }
  
  return children;
};

// ---- Admin Layout ----
function AdminLayout({ sidebarOpen, toggleSidebar, children }) {
  const userAuth = checkUserRole();
  
  // Super Admin should not see admin layout
  if (userAuth?.isSuperAdmin) {
    return <Navigate to="/super-admin" replace />;
  }
  
  return (
    <ProtectedRoute>
      <div className="admin-layout">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        <div className={`main-content ${sidebarOpen ? "shifted" : ""}`}>
          <Header toggleSidebar={toggleSidebar} />
          <div className="page-content">
            {children}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

// ---- Notifications ----
const Notification = ({ message, type }) => (
  <div className={`notification ${type}`}>{message}</div>
);

// ---- Role Redirect Component ----
const RoleBasedRedirect = () => {
  const userAuth = checkUserRole();
  const location = useLocation();
  
  console.log("RoleBasedRedirect:", userAuth);
  
  if (!userAuth?.isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  
  if (userAuth?.isSuperAdmin) {
    return <Navigate to="/super-admin" replace />;
  } else {
    return <Navigate to="/dashboard" replace />;
  }
};

// ---- App Component ----
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notification, setNotification] = useState({ message: "", type: "" });

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const showNotification = (msg, type) => {
    setNotification({ message: msg, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

  return (
    <>
      <Routes>
        {/* LOGIN */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<Navigate to="/" replace />} />

        {/* ONBOARDING */}
        <Route
          path="/onboarding"
          element={
            <OnboardingProvider>
              <div className="page-content">
                <Outlet />
              </div>
            </OnboardingProvider>
          }
        >
          <Route index element={<HospitalDetails />} />
          <Route path="owner" element={<OwnerDetails />} />
          <Route path="services" element={<Services />} />
          <Route path="images" element={<Images />} />
          <Route path="review" element={<ReviewSubmit />} />
          <Route path="bank" element={<BankDetailsForm />} />
          <Route path="certification" element={<Certifications />} />
        </Route>

        {/* SUPER ADMIN DASHBOARD - MUST BE BEFORE OTHER ROUTES */}
        <Route path="/super-admin/*" element={
          <SuperAdminProtectedRoute>
            <SuperAdminDashboard />
          </SuperAdminProtectedRoute>
        } />

        {/* ADMIN DASHBOARD ROUTES - Only for non-super admin */}
        <Route path="/dashboard" element={
          <AdminLayout sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar}>
            <Dashboard />
          </AdminLayout>
        } />
        
        <Route path="/doctors" element={
          <AdminLayout sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar}>
            <DoctorsList showNotification={showNotification} />
          </AdminLayout>
        } />
        
        <Route path="/doctorregister" element={
          <AdminLayout sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar}>
            <DoctorRegister showNotification={showNotification} />
          </AdminLayout>
        } />
        
        <Route path="/doctors/add" element={
          <AdminLayout sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar}>
            <AddDoctor showNotification={showNotification} />
          </AdminLayout>
        } />
        
        <Route path="/doctors/:id" element={
          <AdminLayout sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar}>
            <DoctorView />
          </AdminLayout>
        } />
        
        <Route path="/patients" element={
          <AdminLayout sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar}>
            <PatientsList showNotification={showNotification} />
          </AdminLayout>
        } />
        
        <Route path="/patients/:id" element={
          <AdminLayout sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar}>
            <PatientView />
          </AdminLayout>
        } />
        
        <Route path="/patientregister" element={
          <AdminLayout sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar}>
            <PatientRegister showNotification={showNotification} />
          </AdminLayout>
        } />
        
        <Route path="/bookingpage" element={
          <AdminLayout sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar}>
            <BookingPage showNotification={showNotification} />
          </AdminLayout>
        } />
        
        <Route path="/medicines" element={
          <AdminLayout sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar}>
            <MedicinePage showNotification={showNotification} />
          </AdminLayout>
        } />
        
        <Route path="/staffmanagement" element={
          <AdminLayout sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar}>
            <StaffManagement showNotification={showNotification} />
          </AdminLayout>
        } />
        
        <Route path="/appointments" element={
          <AdminLayout sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar}>
            <Appointments />
          </AdminLayout>
        } />
        
        <Route path="/reports" element={
          <AdminLayout sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar}>
            <Reports showNotification={showNotification} />
          </AdminLayout>
        } />
        
        <Route path="/labmanagement" element={
          <AdminLayout sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar}>
            <LabManagement showNotification={showNotification} />
          </AdminLayout>
        } />
        
        <Route path="/settings" element={
          <AdminLayout sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar}>
            <Settings showNotification={showNotification} />
          </AdminLayout>
        } />

        {/* RECEPTION MODULE */}
        <Route path="/reception" element={
          <ProtectedRoute allowedRoles={['admin', 'receptionist', 'doctor']}>
            <ReceptionLayout />
          </ProtectedRoute>
        }>
          <Route index element={<ReceptionDashboard />} />
          <Route path="dashboard" element={<ReceptionDashboard />} />
          <Route path="patientsList" element={<ReceptionPatientList />} />
          <Route path="patientRegister" element={<ReceptionPatientRegister />} />
        </Route>

        {/* MEDICAL DASHBOARD MODULE */}
        <Route path="/medicaldashboard/*" element={
          <ProtectedRoute allowedRoles={['admin', 'doctor', 'pharmacist']}>
            <MedicalDashboard />
          </ProtectedRoute>
        } />

        {/* LAB MANAGEMENT */}
        <Route path="/lab-management/*" element={
          <ProtectedRoute allowedRoles={['admin', 'lab', 'technician']}>
            <LabManagementMain />
          </ProtectedRoute>
        } />

        {/* DEFAULT - Use RoleBasedRedirect component */}
        <Route path="*" element={<RoleBasedRedirect />} />
      </Routes>

      {notification.message && (
        <Notification message={notification.message} type={notification.type} />
      )}
    </>
  );
}

// ---- Wrapper ----
export default function AppWrapper() {
  return (
    <UserProvider>
      <Router>
        <App />
      </Router>
    </UserProvider>
  );
}