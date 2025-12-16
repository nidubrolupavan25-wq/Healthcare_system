import "../MedicineStyling/MedicineNavbar.css";

export default function MedicineNavbar({ cartCount, openCart }) {
  return (
    <nav className="med-top-nav">
      <div className="med-nav-links">
        <div className="med-nav-item">
          <a role="button" aria-label="Jhai Products" className="med-nav-link">
            Jhai Products
          </a>
          <div className="med-dropdown-menu">
            <a>Featured Products</a>
            <a>New Arrivals</a>
            <a>Best Sellers</a>
            <a>All Products</a>
          </div>
        </div>

        <div className="med-nav-item">
          <a role="button" aria-label="Baby Care" className="med-nav-link">
            Baby Care
          </a>
          <div className="med-dropdown-menu">
            <a>Baby Food</a>
            <a>Diapers & Wipes</a>
            <a>Baby Grooming</a>
            <a>Baby Health Care</a>
          </div>
        </div>

        <div className="med-nav-item">
          <a
            role="button"
            aria-label="Nutritional Drinks"
            className="med-nav-link"
          >
            Nutritional Drinks
          </a>
          <div className="med-dropdown-menu">
            <div className="med-dropdown-section-title">Nutritional Drinks</div>
            <a>Adult Nutrition</a>
            <a>Kids Nutrition</a>
            <a>Specialty Nutrition</a>
            <a>Rehydration Drinks</a>
            <a>Green Tea</a>
            <div className="med-dropdown-section-title">Sports Nutrition</div>
            <a>Protein Powders</a>
            <a>Whey Protein</a>
            <a>Peanut Butter</a>
          </div>
        </div>

        <div className="med-nav-item">
          <a role="button" aria-label="Women Care" className="med-nav-link">
            Women Care
          </a>
          <div className="med-dropdown-menu">
            <a>Feminine Hygiene</a>
            <a>Maternity Care</a>
            <a>Women's Wellness</a>
            <a>Skin Care</a>
          </div>
        </div>

        <div className="med-nav-item">
          <a role="button" aria-label="Personal Care" className="med-nav-link">
            Personal Care
          </a>
          <div className="med-dropdown-menu">
            <a>Bath & Body</a>
            <a>Hair Care</a>
            <a>Oral Care</a>
          </div>
        </div>

        <div className="med-nav-item">
          <a role="button" aria-label="Ayurveda" className="med-nav-link">
            Ayurveda
          </a>
          <div className="med-dropdown-menu">
            <a>Ayurvedic Medicines</a>
            <a>Herbal Supplements</a>
            <a>Ayurvedic Oils</a>
          </div>
        </div>

        <div className="med-nav-item">
          <a role="button" aria-label="Health Devices" className="med-nav-link">
            Health Devices
          </a>
          <div className="med-dropdown-menu">
            <a>BP Monitors</a>
            <a>Glucometers</a>
            <a>Thermometers</a>
          </div>
        </div>
      </div>

      <div className="med-nav-icons">
        <button
          className="med-icon-btn"
          title="Profile"
          aria-label="View Profile"
          type="button"
        >
          👤
        </button>

        <button
          className="med-icon-btn"
          title="Cart"
          aria-label="View Cart"
          type="button"
          onClick={openCart}
        >
          🛒
          <span className="med-cart-badge">{cartCount}</span>
        </button>
      </div>
    </nav>
  );
}
