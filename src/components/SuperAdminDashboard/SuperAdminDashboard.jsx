// src/components/SuperAdminDashboard/SuperAdminDashboard.jsx
import React, { useState, useRef, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import ApprovalWorkflowView from "./ApprovalWorkflowView";
import HospitalManagementView from "./HospitalManagementView";
import MedicalStoresManagementView from "./MedicalStoresManagementView";
import SettingsView from "./SettingsView"; // Fixed: Use SettingsView, not Settings
import ViewHospitalPage from "./ViewHospitalPage"; // Added for routing

import SuperAdminHeader from "./SuperAdminHeader";
import SuperAdminSidebar from "./SuperAdminSidebar";
import SuperAdminDashboardPage from "./SuperAdminDashboardPage";

import api from "../../services/api";
import "./SuperAdminDashboard.css";

/* SAMPLE NOTIFICATIONS */
const sampleNotifications = [
  { id: 1, title: "New hospital registered: Green Valley", time: "2h ago" },
  { id: 2, title: "Store KYC pending: Quick Meds", time: "5h ago" },
  { id: 3, title: "Server maintenance scheduled", time: "1d ago" },
];

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications] = useState(sampleNotifications);
  const [dark, setDark] = useState(false);
  const [hideLayout, setHideLayout] = useState(false);

  // ⭐ REAL DASHBOARD COUNTS
  const [counts, setCounts] = useState({
    hospitals: 0,
    stores: 0,
    pendingHos: 0,
    pendingMed: 0,
  });

  const notifRef = useRef(null);

  /* --- AUTO CLOSE NOTIFICATION PANEL --- */
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* --- FETCH REAL COUNTS ON PAGE LOAD --- */
  useEffect(() => {
    fetchDashboardCounts();
  }, []);

  async function fetchDashboardCounts() {
    try {
      const [
        activeHos,
        activeMed,
        pendingHos,
        pendingMed,
      ] = await Promise.all([
        api.get("/hospitals/filter/light", { params: { type: "Hospital", level: 1 } }),
        api.get("/hospitals/filter/light", { params: { type: "Medical", level: 1 } }),
        api.get("/hospitals/filter/light", { params: { type: "Hospital", level: 0 } }),
        api.get("/hospitals/filter/light", { params: { type: "Medical", level: 0 } }),
      ]);

      setCounts({
        hospitals: activeHos.data.count,
        stores: activeMed.data.count,
        pendingHos: pendingHos.data.count,
        pendingMed: pendingMed.data.count,
      });

    } catch (error) {
      console.error("Dashboard Count Error:", error);
    }
  }

  /* --- HANDLE PAGE SELECTION --- */
  const handlePageSelect = (page) => {
    setActivePage(page);
    // Navigate to the correct route
    if (page === "dashboard") {
      navigate("/super-admin");
    } else if (page === "settings") {
      navigate("/super-admin/settings");
    } else {
      navigate(`/super-admin/${page}`);
    }
  };

  /* --- RENDER SELECTED PAGE --- */
  function renderPage() {
    switch (activePage) {
      case "dashboard":
        return (
          <SuperAdminDashboardPage
            analyticsSample={{
              hospitalsByCity: [
                { city: "Mumbai", value: 35 },
                { city: "Delhi", value: 28 },
                { city: "Bangalore", value: 22 },
              ],
              storesByMonth: {
                values: [10, 12, 8, 15, 18, 20],
                months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
              },
              totalPatients: 4300,
              approvalsTrend: { values: [5, 10, 7, 15, 12, 20] },
              pendingApprovals: counts.pendingHos + counts.pendingMed,
              pendingVsApproved: {
                pending: counts.pendingHos + counts.pendingMed,
                approved: 52,
                rejected: 4,
              },
            }}
            dashboardCounts={{
              hospitals: counts.hospitals,
              stores: counts.stores,
            }}
            openApproval={() => handlePageSelect("approvalsWorkflow")}
          />
        );

      case "approvalsWorkflow":
        return <ApprovalWorkflowView setHideLayout={setHideLayout} />;

      case "hospitalManagement":
        return <HospitalManagementView />;

      case "medicalStores":
        return <MedicalStoresManagementView />;

      case "settings":
        return <SettingsView />; // Fixed: Use SettingsView

      default:
        return <h2>Not Found</h2>;
    }
  }

  return (
    <div className={`dashboard-shell ${dark ? "dark" : ""}`}>
      {/* SIDEBAR - hides when hideLayout=true */}
      {!hideLayout && (
        <SuperAdminSidebar
          open={sidebarOpen}
          active={activePage}
          onSelect={handlePageSelect} // Fixed: Use handlePageSelect
          setOpen={setSidebarOpen}
        />
      )}

      <div
        className={`content-area ${
          sidebarOpen && !hideLayout ? "content-shift" : ""
        }`}
      >
        {/* HEADER */}
        {!hideLayout && (
          <SuperAdminHeader
            onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
            unreadCount={notifications.length}
            onOpenNotifications={() => setNotifOpen(!notifOpen)}
            dark={dark}
            setDark={setDark}
          />
        )}

        {/* NOTIFICATION PANEL */}
        {notifOpen && (
          <div className="notification-panel" ref={notifRef}>
            {notifications.map((n) => (
              <div key={n.id} className="notification-item">
                <div><strong>{n.title}</strong></div>
                <div className="text-muted">{n.time}</div>
              </div>
            ))}
          </div>
        )}

        {/* MAIN CONTENT WITH ROUTES */}
        <main className="content-main">
          <Routes>
            <Route path="/" element={
              <SuperAdminDashboardPage
                analyticsSample={{
                  hospitalsByCity: [
                    { city: "Mumbai", value: 35 },
                    { city: "Delhi", value: 28 },
                    { city: "Bangalore", value: 22 },
                  ],
                  storesByMonth: {
                    values: [10, 12, 8, 15, 18, 20],
                    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                  },
                  totalPatients: 4300,
                  approvalsTrend: { values: [5, 10, 7, 15, 12, 20] },
                  pendingApprovals: counts.pendingHos + counts.pendingMed,
                  pendingVsApproved: {
                    pending: counts.pendingHos + counts.pendingMed,
                    approved: 52,
                    rejected: 4,
                  },
                }}
                dashboardCounts={{
                  hospitals: counts.hospitals,
                  stores: counts.stores,
                }}
                openApproval={() => handlePageSelect("approvalsWorkflow")}
              />
            } />
            <Route path="/approvalsWorkflow" element={<ApprovalWorkflowView setHideLayout={setHideLayout} />} />
            <Route path="/hospitalManagement" element={<HospitalManagementView />} />
            <Route path="/medicalStores" element={<MedicalStoresManagementView />} />
            <Route path="/settings" element={<SettingsView />} />
            <Route path="/hospital/:id" element={<ViewHospitalPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}