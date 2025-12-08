import React, { useContext } from "react";
import { Bell, Menu, Sun, Moon } from "lucide-react";
import { UserContext } from "../../context/UserContext";
import "./css/super-admin-header.css";

export default function SuperAdminHeader({
  onToggleSidebar,
  unreadCount,
  onOpenNotifications,
  dark,
  setDark
}) {
  const { user } = useContext(UserContext);

  return (
    <header className={`sa-header ${dark ? "dark" : ""}`}>
      <button className="sa-icon-btn menu" onClick={onToggleSidebar}>
        <Menu size={20} />
      </button>

      <div className="sa-right">
        <button className="sa-icon-btn" onClick={() => setDark(!dark)}>
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="sa-notification" onClick={onOpenNotifications}>
          <Bell size={20} />
          {unreadCount > 0 && <span className="sa-badge">{unreadCount}</span>}
        </div>

        <div className="sa-profile-box">
          <div className="sa-profile-text">
            <div className="sa-name">{user?.name || "Super Admin"}</div>
            <div className="sa-role">Super Administrator</div> {/* Fixed: Hardcoded role */}
          </div>

          <img
            src={
              user?.image
                ? user.image.startsWith("http")
                  ? user.image
                  : `data:image/jpeg;base64,${user.image}`
                : "https://via.placeholder.com/42"
            }
            alt="User Avatar"
            className="sa-avatar"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/42";
            }}
          />
        </div>
      </div>
    </header>
  );
}