import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import "./css/navbar.css";

function Sidebar({ open, onClose }) {
  const { user, setUser } = useContext(UserContext);

  if (!open) return null;

  const defaultAvatar =
    "https://img.icons8.com/ios-filled/50/000000/user-male-circle.png";

  const avatarSrc = user.image
    ? user.image.startsWith("data:image")
      ? user.image
      : `data:image/jpeg;base64,${user.image}`
    : defaultAvatar;

  const logout = () => {
    setUser(null);
    onClose();
  };

  return (
    <>
      <div className="sidebar-overlay" onClick={onClose}></div>

      <aside className="sidebar active">
        <div className="sidebar-header">
          <div className="user-info">
            <img src={avatarSrc} alt="user" />
            <div>
              <strong>{user.name}</strong>
              <div>{user.email}</div>
            </div>
          </div>

          <span className="sidebar-close-btn" onClick={onClose}>
            &times;
          </span>
        </div>

        <ul className="sidebar-menu">
         
              <li>My Account</li>
              <li>My Appointments</li>
              <li>My Memberships</li>
              <li>My Orders</li>
              <li>Transactions & Payments</li>
              <li>Health Records</li>
              <li>Need Help</li>
          <li className="logout" onClick={logout}>
            Logout
          </li>
        </ul>
      </aside>
    </>
  );
}

export default Sidebar;
