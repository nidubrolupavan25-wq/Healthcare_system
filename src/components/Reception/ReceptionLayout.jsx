import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import ReceptionSidebar from "./ReceptionSidebar";
import ReceptionHeader from "./ReceptionHeader";
import "../css/ReceptionLayout.css";

export default function ReceptionLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // open by default

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="reception-layout">
      {/* ✅ Header with toggle button */}
      <ReceptionHeader toggleSidebar={toggleSidebar} />

      <div className="reception-body">
        {/* ✅ Sidebar */}
        <aside
          className={`reception-sidebar ${isSidebarOpen ? "open" : "closed"}`}
        >
          <ReceptionSidebar onLinkClick={closeSidebar} />
        </aside>

        {/* ✅ Main Content Area */}
        <main
          className={`reception-content ${isSidebarOpen ? "shifted" : ""}`}
        >
          <Outlet /> {/* All nested routes appear here */}
        </main>
      </div>
    </div>
  );
}
