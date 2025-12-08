import { NavLink } from "react-router-dom";
import styles from "../css/Sidebar.module.css";

const NAV = [
  { to: "dashboard", icon: "fa-tachometer-alt", label: "Dashboard" },
  { to: "patientRegister", icon: "fa-user-plus", label: "Add Patient" },
  { to: "patientsList", icon: "fa-list-ul", label: "Patient List" },
  { to: "search-patient", icon: "fa-search", label: "Search" },
  { to: "doctor-availability", icon: "fa-user-md", label: "Doctors" },
  { to: "print-slip", icon: "fa-print", label: "Print Slip" },
];

export default function ReceptionSidebar({ onLinkClick }) {
  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "dashboard"}
            onClick={onLinkClick}
            className={({ isActive }) =>
              `${styles.btn} ${isActive ? styles.active : ""}`
            }
          >
            <i className={`fas ${item.icon}`}></i> {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
