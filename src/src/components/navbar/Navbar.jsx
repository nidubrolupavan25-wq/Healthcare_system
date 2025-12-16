import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import GuestMenu from "./GuestMenu";
import LoginModal from "../login/LoginModal";
import Sidebar from "./Sidebar";
import ModuleNavbar from "./ModuleNavbar";
import "./css/navbar.css";
import Logo from "../../assets/images/logo-removebg-preview.png";

function Navbar() {
  const { user } = useContext(UserContext);

  const [guestMenuOpen, setGuestMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModuleNav, setShowModuleNav] = useState(false);

  const defaultAvatar =
    "https://img.icons8.com/ios-filled/50/000000/user.png";

  const avatarSrc = user?.image
    ? user.image.startsWith("data:image")
      ? user.image
      : `data:image/jpeg;base64,${user.image}`
    : defaultAvatar;

  // ✅ SCROLL HANDLER
  useEffect(() => {
    const onScroll = () => {
      setShowModuleNav(window.scrollY > 220);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleAvatarClick = () => {
    if (user) setSidebarOpen(true);
    else setGuestMenuOpen((p) => !p);
  };

  return (
    <>
      {/* ✅ MAIN NAVBAR (VISIBLE BEFORE SCROLL) */}
      <header className={`navbar ${showModuleNav ? "hide" : ""}`}>
        <div className="navbar-container">
          <div className="brand-row">
            <img src={Logo} width="45" alt="logo" />
            <span className="brand-name">JhaiHealthcare</span>
          </div>

          <div className="avatar-wrapper">
            <img
              src={avatarSrc}
              className="avatar"
              onClick={handleAvatarClick}
              alt="user"
            />

            {!user && guestMenuOpen && (
              <GuestMenu
                onLogin={() => {
                  setGuestMenuOpen(false);
                  setLoginOpen(true);
                }}
                onSignup={() => alert("Signup coming soon")}
              />
            )}
          </div>
        </div>
      </header>

      {/* ✅ MODULE NAVBAR (VISIBLE AFTER SCROLL) */}
      <ModuleNavbar show={showModuleNav} avatarSrc={avatarSrc} />

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

      {user && (
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}
    </>
  );
}

export default Navbar;
