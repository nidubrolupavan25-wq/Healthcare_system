import "./css/navbar.css";

function GuestMenu({ onLogin, onSignup }) {
  return (
    <div className="guest-dropdown">
      <div className="guest-title">Guest User</div>

      <button className="guest-btn primary" onClick={onLogin}>
        Login
      </button>

      <button className="guest-btn secondary" onClick={onSignup}>
        Sign Up
      </button>
    </div>
  );
}

export default GuestMenu;
