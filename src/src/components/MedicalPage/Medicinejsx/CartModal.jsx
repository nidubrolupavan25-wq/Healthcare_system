
import "../MedicalPage/style/CartModal.css";
export default function CartModal({ open, onClose, cart }) {
  if (!open) return null;

  const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <div className="modal-overlay cart-modal" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Shopping Cart</h3>
        <ul id="cartItemsList">
          {cart.length === 0 ? (
            <li>Your cart is empty</li>
          ) : (
            cart.map((item, idx) => (
              <li key={idx}>
                <span>{item.name}</span>
                <span>₹{item.price}</span>
              </li>
            ))
          )}
        </ul>
        <p className="total">Total: ₹{total.toFixed(2)}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
