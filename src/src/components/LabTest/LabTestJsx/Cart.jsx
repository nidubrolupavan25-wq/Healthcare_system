import React from "react";

export default function Cart({ items, total, onCheckout }) {
  return (
    <section id="cart" className="subcategory-section-lt cart-lt">
      <h2>Your Cart</h2>
      <ul id="cart-items">
        {items.length === 0 && <li>No items in cart.</li>}
        {items.map((it, idx) => (
          <li key={idx}>{it.name} - ₹{it.price}</li>
        ))}
      </ul>
      <p>Total: ₹<span id="cart-total">{total}</span></p>
      <button className="pay-button-lt" onClick={onCheckout}>Checkout</button>
    </section>
  );
}
