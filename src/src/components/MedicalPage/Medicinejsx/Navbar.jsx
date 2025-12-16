
import "../MedicalPage/style/Navbar.css";
export default function Navbar({ cartCount, openCart }) {
  return (
    <nav className="top-nav">
      <div className="nav-links">
        <div className="nav-item">
          <a role="button" aria-label="Jhai Products">
            Jhai Products
          </a>
          <div className="dropdown-menu">
            <a>Featured Products</a>
            <a>New Arrivals</a>
            <a>Best Sellers</a>
            <a>All Products</a>
          </div>
        </div>

        <div className="nav-item">
          <a role="button" aria-label="Baby Care">
            Baby Care
          </a>
          <div className="dropdown-menu">
            <a>Baby Food</a>
            <a>Diapers & Wipes</a>
            <a>Baby Grooming</a>
            <a>Baby Health Care</a>
          </div>
        </div>

        <div className="nav-item">
          <a role="button" aria-label="Nutritional Drinks">
            Nutritional Drinks
          </a>
          <div className="dropdown-menu">
            <div className="dropdown-section-title">Nutritional Drinks</div>
            <a>Adult Nutrition</a>
            <a>Kids Nutrition</a>
            <a>Specialty Nutrition</a>
            <a>Rehydration Drinks</a>
            <a>Green Tea</a>
            <div className="dropdown-section-title">Sports Nutrition</div>
            <a>Protein Powders</a>
            <a>Whey Protein</a>
            <a>Peanut Butter</a>
          </div>
        </div>

        <div className="nav-item">
          <a role="button" aria-label="Women Care">
            Women Care
          </a>
          <div className="dropdown-menu">
            <a>Feminine Hygiene</a>
            <a>Maternity Care</a>
            <a>Women's Wellness</a>
            <a>Skin Care</a>
          </div>
        </div>

        <div className="nav-item">
          <a role="button" aria-label="Personal Care">
            Personal Care
          </a>
          <div className="dropdown-menu">
            <a>Bath & Body</a>
            <a>Hair Care</a>
            <a>Oral Care</a>
          </div>
        </div>

        <div className="nav-item">
          <a role="button" aria-label="Ayurveda">
            Ayurveda
          </a>
          <div className="dropdown-menu">
            <a>Ayurvedic Medicines</a>
            <a>Herbal Supplements</a>
            <a>Ayurvedic Oils</a>
          </div>
        </div>

        <div className="nav-item">
          <a role="button" aria-label="Health Devices">
            Health Devices
          </a>
          <div className="dropdown-menu">
            <a>BP Monitors</a>
            <a>Glucometers</a>
            <a>Thermometers</a>
          </div>
        </div>
      </div>

      <div className="nav-icons">
        <button className="icon-btn" title="Profile" aria-label="View Profile">
          👤
        </button>
        <button
          className="icon-btn"
          title="Cart"
          aria-label="View Cart"
          onClick={openCart}
        >
          🛒
          <span className="cart-badge">{cartCount}</span>
        </button>
      </div>
    </nav>
  );
}
