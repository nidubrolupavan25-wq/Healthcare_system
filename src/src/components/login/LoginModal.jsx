import React, { useEffect } from "react";
import Login from "./Login";
import "./loginModal.css";

function LoginModal({ open, onClose }) {
  // ✅ Stop background scroll when modal opens
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <span className="modal-close-btn" onClick={onClose}>
          &times;
        </span>

        <Login closeModal={onClose} />
      </div>
    </div>
  );
}

export default LoginModal;
