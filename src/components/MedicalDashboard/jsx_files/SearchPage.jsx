// SearchPage.jsx
import React, { useState, useEffect } from 'react';
import '../css/SearchPage.css';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [medicalShops, setMedicalShops] = useState([]);
  const [cart, setCart] = useState([]);
  const [orderStatus, setOrderStatus] = useState(null);
  const [currentStep, setCurrentStep] = useState('search');
  const [selectedShop, setSelectedShop] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Sample medicine data
  useEffect(() => {
    const sampleMedicines = [
      { id: 1, name: 'Paracetamol', price: 50, description: 'Pain reliever and fever reducer', prescription: false },
      { id: 2, name: 'Amoxicillin', price: 120, description: 'Antibiotic for bacterial infections', prescription: true },
      { id: 3, name: 'Ibuprofen', price: 80, description: 'Anti-inflammatory pain reliever', prescription: false },
      { id: 4, name: 'Vitamin C', price: 150, description: 'Immune system support', prescription: false },
      { id: 5, name: 'Cetirizine', price: 65, description: 'Antihistamine for allergies', prescription: false },
      { id: 6, name: 'Omeprazole', price: 95, description: 'Acid reducer for heartburn', prescription: true },
      { id: 7, name: 'Aspirin', price: 45, description: 'Pain reliever and blood thinner', prescription: false },
      { id: 8, name: 'Metformin', price: 110, description: 'Diabetes medication', prescription: true },
    ];
    setMedicines(sampleMedicines);

    // Get user location (simulated)
    setUserLocation({
      latitude: 12.9716,
      longitude: 77.5946,
      address: 'Bangalore, Karnataka'
    });
  }, []);

  // Sample medical shops data
  useEffect(() => {
    if (userLocation) {
      const sampleShops = [
        { 
          id: 1, 
          name: 'Apollo Pharmacy', 
          distance: '0.5 km', 
          rating: 4.5, 
          address: 'MG Road, Bangalore',
          deliveryTime: '20-30 min',
          medicines: [1, 2, 3, 4, 7]
        },
        { 
          id: 2, 
          name: 'MedPlus', 
          distance: '1.2 km', 
          rating: 4.2, 
          address: 'Brigade Road, Bangalore',
          deliveryTime: '25-35 min',
          medicines: [1, 3, 5, 6, 8]
        },
        { 
          id: 3, 
          name: 'Wellness Forever', 
          distance: '0.8 km', 
          rating: 4.3, 
          address: 'Church Street, Bangalore',
          deliveryTime: '15-25 min',
          medicines: [2, 4, 5, 7]
        },
        { 
          id: 4, 
          name: 'Fortis Pharmacy', 
          distance: '1.5 km', 
          rating: 4.7, 
          address: 'Richmond Road, Bangalore',
          deliveryTime: '30-40 min',
          medicines: [1, 2, 6, 8]
        },
      ];
      setMedicalShops(sampleShops);
    }
  }, [userLocation]);

  // Search functionality
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.length > 1) {
      const filtered = medicines.filter(medicine =>
        medicine.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredMedicines(filtered);
    } else {
      setFilteredMedicines([]);
    }
  };

  // Select medicine and find available shops
  const handleMedicineSelect = (medicine) => {
    setSelectedMedicine(medicine);
    
    // Update shops with availability information
    const updatedShops = medicalShops.map(shop => ({
      ...shop,
      hasMedicine: shop.medicines.includes(medicine.id)
    }));
    
    setMedicalShops(updatedShops);
    setCurrentStep('shops');
  };

  // Add to cart
  const handleAddToCart = (shop) => {
    setSelectedShop(shop);
    const newCartItem = {
      ...selectedMedicine,
      quantity: 1,
      shop: shop.name,
      shopId: shop.id,
      deliveryTime: shop.deliveryTime
    };
    setCart([newCartItem]);
    setCurrentStep('cart');
  };

  // Update quantity
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    setCart(prevCart => 
      prevCart.map(item => ({
        ...item,
        quantity: newQuantity
      }))
    );
  };

  // Proceed to payment
  const handleProceedToPayment = () => {
    setCurrentStep('payment');
  };

  // Process payment
  const handlePayment = async (paymentMethod) => {
    setPaymentProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setOrderStatus({
      id: `ORD${Date.now()}`,
      status: 'confirmed',
      estimatedDelivery: selectedShop.deliveryTime,
      medicine: selectedMedicine.name,
      shop: selectedShop.name,
      amount: selectedMedicine.price * cart[0].quantity + 25,
      paymentMethod: paymentMethod,
      orderTime: new Date().toLocaleTimeString()
    });
    
    setPaymentProcessing(false);
    setCurrentStep('tracking');
  };

  // Calculate total amount
  const calculateTotal = () => {
    const medicineTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    return medicineTotal + 25; // Adding delivery fee
  };

  // Render Search Step
  const renderSearchStep = () => (
    <div className="search-step">
      <div className="search-header">
        <h2>Find Your Medicines</h2>
        <p>Search from 1000+ medicines and healthcare products</p>
      </div>
      
      <div className="search-container">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search for medicines (e.g., Paracetamol, Vitamin C)"
            value={searchTerm}
            onChange={handleSearch}
            autoFocus
          />
          {searchTerm && (
            <button 
              className="clear-search"
              onClick={() => {
                setSearchTerm('');
                setFilteredMedicines([]);
              }}
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
        
        {filteredMedicines.length > 0 ? (
          <div className="search-results">
            <div className="results-header">
              <h3>Search Results</h3>
              <span>{filteredMedicines.length} medicines found</span>
            </div>
            {filteredMedicines.map(medicine => (
              <div 
                key={medicine.id} 
                className="medicine-card"
                onClick={() => handleMedicineSelect(medicine)}
              >
                <div className="medicine-icon">
                  <i className="fas fa-pills"></i>
                </div>
                <div className="medicine-info">
                  <h3>{medicine.name}</h3>
                  <p>{medicine.description}</p>
                  <div className="medicine-tags">
                    {medicine.prescription && (
                      <span className="prescription-tag">
                        <i className="fas fa-prescription"></i>
                        Prescription Required
                      </span>
                    )}
                    <span className="price-tag">₹{medicine.price}</span>
                  </div>
                </div>
                <div className="medicine-action">
                  <i className="fas fa-chevron-right"></i>
                </div>
              </div>
            ))}
          </div>
        ) : searchTerm.length > 1 ? (
          <div className="no-results">
            <i className="fas fa-search"></i>
            <h3>No medicines found</h3>
            <p>Try searching with different keywords</p>
          </div>
        ) : (
          <div className="popular-medicines">
            <h3>Popular Medicines</h3>
            <div className="popular-list">
              {medicines.slice(0, 4).map(medicine => (
                <div 
                  key={medicine.id}
                  className="popular-medicine"
                  onClick={() => handleMedicineSelect(medicine)}
                >
                  <i className="fas fa-pills"></i>
                  <span>{medicine.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Render Shops Step
  const renderShopsStep = () => (
    <div className="shops-step">
      <div className="step-header">
        <button 
          className="back-button"
          onClick={() => setCurrentStep('search')}
        >
          <i className="fas fa-arrow-left"></i>
        </button>
        <h2>Available Pharmacies</h2>
      </div>

      <div className="selected-medicine-banner">
        <div className="medicine-details">
          <h3>{selectedMedicine?.name}</h3>
          <p>{selectedMedicine?.description}</p>
          <div className="medicine-price">₹{selectedMedicine?.price}</div>
        </div>
        {selectedMedicine?.prescription && (
          <div className="prescription-notice">
            <i className="fas fa-exclamation-triangle"></i>
            Prescription required for this medicine
          </div>
        )}
      </div>

      <div className="shops-list">
        <div className="shops-count">
          {medicalShops.filter(shop => shop.hasMedicine).length} pharmacies available
        </div>
        
        {medicalShops.filter(shop => shop.hasMedicine).map(shop => (
          <div key={shop.id} className="shop-card">
            <div className="shop-header">
              <h3>{shop.name}</h3>
              <div className="shop-rating">
                <i className="fas fa-star"></i>
                {shop.rating}
              </div>
            </div>
            
            <div className="shop-details">
              <div className="shop-info">
                <div className="info-item">
                  <i className="fas fa-location-arrow"></i>
                  <span>{shop.distance} away</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-clock"></i>
                  <span>Delivery in {shop.deliveryTime}</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{shop.address}</span>
                </div>
              </div>
              
              <div className="shop-actions">
                <div className="price-section">
                  <div className="price">₹{selectedMedicine?.price}</div>
                  <div className="delivery-fee">+ ₹25 delivery</div>
                </div>
                <button 
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(shop)}
                >
                  <i className="fas fa-cart-plus"></i>
                  Add to Cart
                </button>
              </div>
            </div>
            
            <div className="availability-badge">
              <i className="fas fa-check-circle"></i>
              In Stock • Ready for Delivery
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render Cart Step
  const renderCartStep = () => (
    <div className="cart-step">
      <div className="step-header">
        <button 
          className="back-button"
          onClick={() => setCurrentStep('shops')}
        >
          <i className="fas fa-arrow-left"></i>
        </button>
        <h2>Your Cart</h2>
      </div>

      <div className="cart-items">
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <div className="item-image">
              <i className="fas fa-pills"></i>
            </div>
            <div className="item-details">
              <h3>{item.name}</h3>
              <p>From: {item.shop}</p>
              <div className="delivery-info">
                <i className="fas fa-clock"></i>
                Delivery in {item.deliveryTime}
              </div>
            </div>
            <div className="item-controls">
              <div className="quantity-controls">
                <button 
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <i className="fas fa-minus"></i>
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item.quantity + 1)}>
                  <i className="fas fa-plus"></i>
                </button>
              </div>
              <div className="item-price">₹{item.price * item.quantity}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>Order Summary</h3>
        <div className="summary-item">
          <span>Medicine Cost</span>
          <span>₹{cart.reduce((total, item) => total + (item.price * item.quantity), 0)}</span>
        </div>
        <div className="summary-item">
          <span>Delivery Fee</span>
          <span>₹25</span>
        </div>
        <div className="summary-item">
          <span>Taxes</span>
          <span>₹0</span>
        </div>
        <div className="summary-divider"></div>
        <div className="summary-total">
          <span>Total Amount</span>
          <span>₹{calculateTotal()}</span>
        </div>
      </div>

      <div className="cart-actions">
        <button 
          className="proceed-payment-btn"
          onClick={handleProceedToPayment}
        >
          Proceed to Payment
          <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );

  // Render Payment Step
  const renderPaymentStep = () => (
    <div className="payment-step">
      <div className="step-header">
        <button 
          className="back-button"
          onClick={() => setCurrentStep('cart')}
        >
          <i className="fas fa-arrow-left"></i>
        </button>
        <h2>Payment</h2>
      </div>

      <div className="order-summary-card">
        <h3>Order Summary</h3>
        <div className="order-items">
          <div className="order-item">
            <span>{selectedMedicine?.name} × {cart[0]?.quantity}</span>
            <span>₹{selectedMedicine?.price * cart[0]?.quantity}</span>
          </div>
          <div className="order-item">
            <span>Delivery Fee</span>
            <span>₹25</span>
          </div>
        </div>
        <div className="order-total">
          <span>Total</span>
          <span>₹{calculateTotal()}</span>
        </div>
      </div>

      <div className="payment-methods">
        <h3>Select Payment Method</h3>
        
        <div className="payment-options">
          <div className="payment-option" onClick={() => handlePayment('card')}>
            <div className="payment-icon">
              <i className="fas fa-credit-card"></i>
            </div>
            <div className="payment-info">
              <h4>Credit/Debit Card</h4>
              <p>Pay using your card</p>
            </div>
            <div className="payment-radio">
              <i className="fas fa-circle"></i>
            </div>
          </div>

          <div className="payment-option" onClick={() => handlePayment('upi')}>
            <div className="payment-icon">
              <i className="fas fa-mobile-alt"></i>
            </div>
            <div className="payment-info">
              <h4>UPI Payment</h4>
              <p>Google Pay, PhonePe, Paytm</p>
            </div>
            <div className="payment-radio">
              <i className="fas fa-circle"></i>
            </div>
          </div>

          <div className="payment-option" onClick={() => handlePayment('wallet')}>
            <div className="payment-icon">
              <i className="fas fa-wallet"></i>
            </div>
            <div className="payment-info">
              <h4>Digital Wallet</h4>
              <p>Pay using wallet balance</p>
            </div>
            <div className="payment-radio">
              <i className="fas fa-circle"></i>
            </div>
          </div>

          <div className="payment-option" onClick={() => handlePayment('cod')}>
            <div className="payment-icon">
              <i className="fas fa-money-bill-wave"></i>
            </div>
            <div className="payment-info">
              <h4>Cash on Delivery</h4>
              <p>Pay when you receive</p>
            </div>
            <div className="payment-radio">
              <i className="fas fa-circle"></i>
            </div>
          </div>
        </div>
      </div>

      {paymentProcessing && (
        <div className="payment-processing">
          <div className="processing-spinner">
            <i className="fas fa-spinner fa-spin"></i>
          </div>
          <p>Processing your payment...</p>
        </div>
      )}
    </div>
  );

  // Render Tracking Step
  const renderTrackingStep = () => (
    <div className="tracking-step">
      <div className="order-confirmed">
        <div className="success-animation">
          <i className="fas fa-check-circle"></i>
        </div>
        <h2>Order Confirmed!</h2>
        <p className="order-id">Order ID: {orderStatus?.id}</p>
        <p className="order-time">Placed at {orderStatus?.orderTime}</p>
      </div>

      <div className="tracking-card">
        <h3>Delivery Tracking</h3>
        
        <div className="tracking-timeline">
          <div className="timeline-step active">
            <div className="step-indicator">
              <div className="step-dot"></div>
              <div className="step-line"></div>
            </div>
            <div className="step-content">
              <h4>Order Placed</h4>
              <p>We've received your order</p>
              <span className="step-time">Just now</span>
            </div>
          </div>

          <div className="timeline-step">
            <div className="step-indicator">
              <div className="step-dot"></div>
              <div className="step-line"></div>
            </div>
            <div className="step-content">
              <h4>Pharmacy Confirmed</h4>
              <p>Pharmacy is preparing your order</p>
              <span className="step-time">Upcoming</span>
            </div>
          </div>

          <div className="timeline-step">
            <div className="step-indicator">
              <div className="step-dot"></div>
              <div className="step-line"></div>
            </div>
            <div className="step-content">
              <h4>Out for Delivery</h4>
              <p>Your order is on the way</p>
              <span className="step-time">Upcoming</span>
            </div>
          </div>

          <div className="timeline-step">
            <div className="step-indicator">
              <div className="step-dot"></div>
            </div>
            <div className="step-content">
              <h4>Delivered</h4>
              <p>Estimated delivery: {orderStatus?.estimatedDelivery}</p>
              <span className="step-time">Upcoming</span>
            </div>
          </div>
        </div>
      </div>

      <div className="delivery-details">
        <h3>Delivery Information</h3>
        <div className="detail-item">
          <span>Medicine:</span>
          <span>{orderStatus?.medicine}</span>
        </div>
        <div className="detail-item">
          <span>Pharmacy:</span>
          <span>{orderStatus?.shop}</span>
        </div>
        <div className="detail-item">
          <span>Estimated Delivery:</span>
          <span>{orderStatus?.estimatedDelivery}</span>
        </div>
        <div className="detail-item">
          <span>Payment Method:</span>
          <span>{orderStatus?.paymentMethod?.toUpperCase()}</span>
        </div>
        <div className="detail-item total">
          <span>Amount Paid:</span>
          <span>₹{orderStatus?.amount}</span>
        </div>
      </div>

      <div className="tracking-actions">
        <button 
          className="new-order-btn"
          onClick={() => {
            setCurrentStep('search');
            setSearchTerm('');
            setSelectedMedicine(null);
            setCart([]);
            setOrderStatus(null);
          }}
        >
          <i className="fas fa-plus"></i>
          Place New Order
        </button>
        <button className="help-btn">
          <i className="fas fa-headset"></i>
          Need Help?
        </button>
      </div>
    </div>
  );

  return (
    <div className="search-page">
      <div className="search-page-container">
        {currentStep === 'search' && renderSearchStep()}
        {currentStep === 'shops' && renderShopsStep()}
        {currentStep === 'cart' && renderCartStep()}
        {currentStep === 'payment' && renderPaymentStep()}
        {currentStep === 'tracking' && renderTrackingStep()}
      </div>
    </div>
  );
};

export default SearchPage;