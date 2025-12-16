import "../MedicineStyling/Deals50.css";

export default function Deals50({ addToCart }) {
  const deals = [
    {
      name: "Loreal Total Repair Serum, 80 ml",
      img: "https://images.apollo247.in/pub/media/catalog/product/l/o/lor0419_3.jpg?tr=q-85,f-webp,w-150,dpr-1,c-at_max",
      price: 199.5,
      originalPrice: 399,
      discount: "50% off",
    },
    {
      name: "Nivea Men Fresh Active Deodorant Spray, 150 ml",
      img: "https://images.apollo247.in/pub/media/catalog/product/n/i/niv0123_2_1.jpg?tr=q-85,f-webp,w-150,dpr-1,c-at_max",
      price: 157.5,
      originalPrice: 315,
      discount: "50% off",
    },
    {
      name: "Lacto Calamine SPF 50 PA+++ UVA/UVB",
      img: "https://images.apollo247.in/pub/media/catalog/product/L/A/LAC0550_1-AUG23_1.jpg?tr=q-85,f-webp,w-150,dpr-1,c-at_max",
      price: 199.5,
      originalPrice: 399,
      discount: "50% off",
    },
    {
      name: "Garnier Bright Complete Vitamin C Face Wash 150 gm",
      img: "https://images.apollo247.in/pub/media/catalog/product/g/a/gar0522_1.jpg?tr=q-85,f-webp,w-150,dpr-1,c-at_max",
      price: 146.6,
      originalPrice: 266.5,
      discount: "45% off",
    },
  ];

  return (
    <section className="minimum-50-section">
      <h1>Minimum 50 Percent Off</h1>

      <div className="deals-products">
        {deals.map((item) => (
          <div className="deals-product" key={item.name}>
            <img src={item.img} alt={item.name} />

            <p>{item.name}</p>

            <div className="deals-price">
              ₹{item.price}
              <span className="deals-original-price">₹{item.originalPrice}</span>
            </div>

            <p className="deals-discount">{item.discount}</p>

            <button
              className="deals-add-btn"
              onClick={() => addToCart({ name: item.name, price: item.price })}
            > ADD Cart
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
