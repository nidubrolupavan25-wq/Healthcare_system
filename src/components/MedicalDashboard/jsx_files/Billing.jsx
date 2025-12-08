import React, { useState } from "react";
import "../css/Billing.css";

const Billing = () => {
  const [cart, setCart] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const medicines = [
    { id: 1, name: "Paracetamol 500mg", price: 5.99, stock: 100 },
    { id: 2, name: "Amoxicillin 250mg", price: 12.50, stock: 50 },
    { id: 3, name: "Vitamin C 1000mg", price: 8.75, stock: 75 },
    { id: 4, name: "Ibuprofen 400mg", price: 7.25, stock: 60 },
    { id: 5, name: "Cetirizine 10mg", price: 4.99, stock: 80 },
    { id: 6, name: "Omeprazole 20mg", price: 15.99, stock: 40 }
  ];

  const addToCart = (medicine) => {
    const existingItem = cart.find(item => item.id === medicine.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === medicine.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...medicine, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, quantity) => {
    if (quantity === 0) {
      removeFromCart(id);
    } else {
      setCart(cart.map(item =>
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.05; // 5% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const processPayment = () => {
    if (cart.length === 0) {
      alert("Please add items to cart");
      return;
    }
    
    const invoice = {
      id: Math.floor(Math.random() * 10000),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      customer: customerInfo,
      items: cart,
      subtotal: calculateSubtotal(),
      tax: calculateTax(),
      total: calculateTotal(),
      paymentMethod: paymentMethod
    };

    alert(`Payment processed successfully!\nInvoice #${invoice.id}\nTotal: $${invoice.total.toFixed(2)}`);
    
    // Reset form
    setCart([]);
    setCustomerInfo({ name: "", phone: "", email: "" });
    setPaymentMethod("cash");
  };

  return (
    <div className="billing-page">
      <div className="billing-header">
        <h1>Billing & POS</h1>
        <p>Process sales and generate invoices</p>
      </div>

      <div className="billing-container">
        {/* Products Section */}
        <div className="products-section">
          <h2>Available Medicines</h2>
          <div className="products-grid">
            {medicines.map(medicine => (
              <div key={medicine.id} className="product-card">
                <h3>{medicine.name}</h3>
                <p className="price">${medicine.price.toFixed(2)}</p>
                <p className="stock">Stock: {medicine.stock}</p>
                <button
                  onClick={() => addToCart(medicine)}
                  className="add-to-cart-btn"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Section */}
        <div className="cart-section">
          <div className="cart-header">
            <h2>Shopping Cart</h2>
            {cart.length > 0 && (
              <span className="cart-count">{cart.length} items</span>
            )}
          </div>

          <div className="cart-items">
            {cart.length === 0 ? (
              <p className="empty-cart">Cart is empty</p>
            ) : (
              cart.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p>${item.price.toFixed(2)} each</p>
                  </div>
                  <div className="item-controls">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      +
                    </button>
                  </div>
                  <div className="item-total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="remove-btn"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Customer Information */}
          <div className="customer-section">
            <h3>Customer Information</h3>
            <div className="customer-form">
              <input
                type="text"
                placeholder="Customer Name"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
              />
              <input
                type="email"
                placeholder="Email (Optional)"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
              />
            </div>
          </div>

          {/* Payment Summary */}
          {cart.length > 0 && (
            <div className="payment-summary">
              <h3>Payment Summary</h3>
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Tax (5%):</span>
                <span>${calculateTax().toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>

              {/* Payment Method */}
              <div className="payment-method">
                <h4>Payment Method</h4>
                <div className="payment-options">
                  <label>
                    <input
                      type="radio"
                      value="cash"
                      checked={paymentMethod === "cash"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    Cash
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    Card
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="upi"
                      checked={paymentMethod === "upi"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    UPI
                  </label>
                </div>
              </div>

              <button onClick={processPayment} className="checkout-btn">
                Process Payment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Billing;