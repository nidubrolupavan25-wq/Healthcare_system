
import "../MedicalPage/style/AddCartModal.css";

export default function AddCartModal({ open, message, onClose }) {
  if (!open) return null;

  return (
    <div className="addcart-modal-overlay" onClick={onClose}>
      <div
        className="addcart-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Added to Cart</h3>
        <p>{message}</p>

        <button className="addcart-close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

