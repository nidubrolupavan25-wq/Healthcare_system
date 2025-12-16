import React, { useEffect, useState } from "react";
import TestCard from "./TestCard";
import TestModal from "./TestModal";
import AuthModal from "./AuthModal";
import Cart from "./Cart";
import "../LabTestStyle/lab_test-lt.css";
// import "../styles/lab_test-lt.css";

const initialTests = [
    { id: 'cbc', title: 'Complete Blood Count (CBC)', description: 'Measures blood cell counts to assess overall health 🩺.', cost: '₹200 - ₹300', price: 250, img: 'https://thumbs.dreamstime.com/b/complete-blood-count-icon-testing-cells-cbc-full-test-provide-information-white-red-concentration-hemoglobin-226405843.jpg', short: 'Measures blood cell counts for overall health 🩺.' },
    { id: 'lipid-profile', title: 'Lipid Profile', description: 'Evaluates cholesterol levels and heart health risks ❤️.', cost: '₹450 - ₹700', price: 575, img: 'https://tse1.mm.bing.net/th/id/OIP.2K0TFni-GutBkApQ9UNWqAHaDt?pid=Api&P=0&h=180', short: 'Checks cholesterol and heart health ❤️.' },
    { id: 'thyroid-profile', title: 'Thyroid Profile (TSH)', description: 'Assesses thyroid function to diagnose thyroid disorders 🦋.', cost: '₹350 - ₹650', price: 500, img: 'https://tse4.mm.bing.net/th/id/OIP.baNTJ5VY4-sYbb0pHpoUnQAAAA?pid=Api&P=0&h=180', short: 'Evaluates thyroid function 🦋.' },
    { id: 'diabetes-care', title: 'Diabetes Care Package', description: 'Monitors blood sugar levels and diabetes risk factors 🩺.', cost: '₹699 - ₹1,499', price: 1099, img: 'https://tse2.mm.bing.net/th/id/OIP.ZMctZpa20X3r_Yo-NIvGFAHaHa?pid=Api&P=0&h=180', short: 'Monitors blood sugar and diabetes risk 🩺.' },
    { id: 'vitamin-d-b12', title: 'Vitamin D & B12 Combo', description: 'Checks vitamin D and B12 levels for energy, immunity, and bone health 🌞.', cost: '₹800 - ₹1,200', price: 1000, img: 'https://tse4.mm.bing.net/th/id/OIP.DDqDt3bABB854LCVAFjMYgAAAA?pid=Api&P=0&h=180', short: 'Assesses vitamin levels for energy and immunity 🌞.' },
    { id: 'liver-function', title: 'Liver Function Test (LFT)', description: 'Evaluates liver health and detects liver disorders 🩺.', cost: '₹400 - ₹800', price: 600, img: 'https://tse2.mm.bing.net/th/id/OIP.5AgKUXhPy_0iwQEgtZ5HAAHaH_?pid=Api&P=0&h=180', short: 'Evaluates liver health and function 🩺.' },
    { id: 'kidney-function', title: 'Kidney Function Test (KFT)', description: 'Assesses kidney performance and health 🩺.', cost: '₹500 - ₹900', price: 700, img: 'https://tse2.mm.bing.net/th/id/OIP.oPSQEXfUYMpwR-hWL-FTUgHaHa?pid=Api&P=0&h=180', short: 'Checks kidney performance and health 🩺.' },
    { id: 'basic-metabolic', title: 'Basic Metabolic Panel (BMP)', description: 'Monitors metabolism, blood sugar, and kidney function ⚙️.', cost: '₹2,500 - ₹3,000', price: 2750, img: 'https://tse4.mm.bing.net/th/id/OIP.zniU4B5_MZTLlbpnBrZHVQHaH6?pid=Api&P=0&h=180', short: 'Monitors metabolism and organ function ⚙️.' },
    { id: 'comprehensive-metabolic', title: 'Comprehensive Metabolic Panel (CMP)', description: 'Comprehensive screening for organ function and health 🩺.', cost: '₹699 - ₹1,200', price: 950, img: 'https://allseniors.org/wp-content/uploads/2024/06/tests-20.png', short: 'Comprehensive health screening 🩺.' },
    { id: 'mammography', title: 'Mammography', description: 'Screening for breast cancer and abnormalities 🎀.', cost: '₹1,500 - ₹2,500', price: 2000, img: 'https://tse3.mm.bing.net/th/id/OIP.blZQFS3WEU50LJ6-_y7QsAHaHa?pid=Api&P=0&h=180', short: 'Breast cancer screening 🎀.' },
    { id: 'full-body-checkup', title: 'Full Body Checkup', description: 'Complete health assessment for overall wellness 🩺.', cost: '₹1,999 - ₹3,499', price: 2749, img: 'https://tse2.mm.bing.net/th/id/OIP.Cf0-hLQyuoe3RpW80_pLVgAAAA?pid=Api&P=0&h=180', short: 'Complete health assessment 🩺.' },
    { id: 'x-ray-mri', title: 'X-ray & MRI', description: 'Advanced imaging for diagnostic purposes 📷.', cost: '₹500 - ₹10,000', price: 5250, img: 'https://up.yimg.com/ib/th/id/OIP.oGxtAobipnvyLXPh2Kx_DwHaHa?pid=Api&rs=1&c=1&qlt=95&w=103&h=103', short: 'Advanced imaging for diagnostics 📷.' },
    { id: 'genetic-testing', title: 'Genetic Testing', description: 'Personalized health insights through genetic analysis 🧬.', cost: '₹8,000 - ₹15,000', price: 11500, img: 'https://tse4.mm.bing.net/th/id/OIP.vAMcQiZIo6xGlqUBrgecyAHaHa?pid=Api&P=0&h=180', short: 'Personalized health insights 🧬.' },
    { id: 'allergy-tests', title: 'Allergy Tests', description: 'Identifies allergens to manage allergic reactions 🤧.', cost: '₹2,000 - ₹5,000', price: 3500, img: 'https://tse1.mm.bing.net/th/id/OIP.gCOfd9P0dpaqWUm8fVwv-AHaHa?pid=Api&P=0&h=180', short: 'Identify and manage allergies 🤧.' },
    { id: 'home-collection', title: 'Home Collection', description: 'Convenient lab tests conducted at your home 🏠.', cost: '₹200 - ₹500 + Test Cost', price: 350, img: 'https://tse2.mm.bing.net/th/id/OIP.bNejjbDy7ngvEHIfBvSANAHaHa?pid=Api&P=0&h=180', short: 'Lab tests at your home 🏠.' },
    { id: 'ecg-more', title: 'ECG & More', description: 'Cardiac and advanced diagnostic tests 💓.', cost: '₹300 - ₹4,000', price: 2150, img: 'https://tse2.mm.bing.net/th/id/OIP.1DPhhvB0YURUFNS9I84jMwHaHa?pid=Api&P=0&h=180', short: 'Cardiac and advanced tests 💓.' }
];

export default function LabTestsPage() {
  const [tests, setTests] = useState(initialTests);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [modalTestId, setModalTestId] = useState(null);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    // replicate original category-tab click behavior (preserved)
    document.querySelectorAll('.category-tab-lt').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.category-tab-lt').forEach(t => t.classList.remove('active-lt'));
        tab.classList.add('active-lt');
      });
    });

    // generate initial captcha if modal present (original page called generateCaptcha on open)
    // We keep function calls in DOM functions; AuthModal generates captcha itself.
  }, []);

  function openTestModal(id) {
    setModalTestId(id);
    // show modal by manipulating DOM same as original
    const md = document.getElementById('testDetailsModal');
    if (md) md.style.display = 'flex';
    // populate content same as original JS (we also set modalTest from state)
    const test = tests.find(t => t.id === id);
    if (test) {
      const titleEl = document.getElementById('testTitle');
      const descEl = document.getElementById('testDescription');
      const costEl = document.getElementById('testCost');
      if (titleEl) titleEl.textContent = test.title;
      if (descEl) descEl.textContent = test.description;
      if (costEl) costEl.textContent = test.cost;
    }
  }

  function closeTestModal() {
    setModalTestId(null);
    const md = document.getElementById('testDetailsModal');
    if (md) md.style.display = 'none';
  }

  function bookTest() {
    alert("Test booked successfully!");
  }

  function addToCart(name, price) {
    // preserve original logic style (DOM-based update)
    setCart(prev => {
      const next = [...prev, { name, price }];
      return next;
    });
    setTotal(prev => prev + price);

    // also update DOM list like original code did
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    if (cartItems) {
      const li = document.createElement('li');
      li.textContent = `${name} - ₹${price}`;
      cartItems.appendChild(li);
    }
    if (cartTotal) cartTotal.textContent = (Number(cartTotal.textContent) || 0) + price;
  }

  function checkout() {
    if (cart.length === 0) {
      alert("Your cart is empty!");
    } else {
      alert(`Thank you for your order! Total: ₹${total}`);
      setCart([]);
      setTotal(0);
      // also clear DOM cart list
      const cartItems = document.getElementById('cart-items');
      if (cartItems) cartItems.innerHTML = '';
      const cartTotal = document.getElementById('cart-total');
      if (cartTotal) cartTotal.textContent = '0';
    }
  }

  // keep modalTest for TestModal component
  const modalTest = tests.find(t => t.id === modalTestId);

  return (
    <main>
      <section className="hero-lt">
        <h1>Comprehensive Lab Testing Services</h1>
        <p>Book your lab tests with ease and get accurate results from trusted labs.</p>
        <button onClick={() => document.querySelector(".subcategory-card-lt")?.click()}>Explore Tests</button>
      </section>

      <section id="lab-tests" className="subcategory-section-lt active-lt">
        <h2>Lab Tests</h2>
        <div className="subcategory-grid-lt">
          {tests.map(t => (
            <TestCard key={t.id} test={t} onOpen={openTestModal} onAdd={addToCart} />
          ))}
        </div>
      </section>

      <div className="modal-lt" id="testDetailsModal" style={{ display: modalTest ? 'flex' : 'none' }}>
        <div className="modal-content-lt">
          <button className="close-button-lt" onClick={closeTestModal}><i className="fas fa-times"></i></button>
          <div id="testDetailsContent">
            <h2 id="testTitle">{modalTest ? modalTest.title : ''}</h2>
            <p id="testDescription">{modalTest ? modalTest.description : ''}</p>
            <p id="testCost" className="price-lt">{modalTest ? modalTest.cost : ''}</p>
            <a href="../html/payment.html"><button className="pay-button-lt" onClick={() => bookTest()}>Book Now</button></a>
          </div>
        </div>
      </div>

      <Cart items={cart} total={total} onCheckout={checkout} />

      <button className="chatbot-button-lt" onClick={() => alert("Chatbot assistance coming soon!")}>
        <i className="fas fa-comment-medical"></i>
      </button>

      <AuthModal show={showAuth} onClose={() => setShowAuth(false)} />
    </main>
  );
}
