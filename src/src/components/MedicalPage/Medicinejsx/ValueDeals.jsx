
import "../MedicineStyling/ValueDeals.css";

export default function ValueDeals({ products, addToCart }) {
  return (
    <section className="value-deals">
      <h2>Value Deals at Rs 100</h2>
      <div className="products-grid">
        {products.map((product) => (
          <div
            className="product-card"
            key={product.name}
            role="button"
            aria-label={`Add ${product.name} to cart`}
          >
            <img src={product.image} alt={product.name} />
            <div className="product-name">{product.name}</div>
            <div className="product-price">
              <span className="current-price">₹{product.currentPrice}</span>
              <span className="original-price">
                MRP ₹{product.originalPrice}
              </span>
              <div className="discount">{product.discount}</div>
            </div>
            <button
              className="add-btn"
              onClick={() =>
                addToCart({
                  name: product.name,
                  currentPrice: product.currentPrice,
                })
              }
            >
              ADD TO CART
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
