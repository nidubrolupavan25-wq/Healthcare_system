
import "../MedicineStyling/Brands.css";
export default function Brands() {
  const brands = [
    {
      name: "Dhootapapeshwar",
      img: "https://images.apollo247.in/images/category/dhootapapeshwar_web.png?tr=q-85,f-webp,w-150,dpr-1,c-at_max",
      offer: "UP TO 15% OFF",
    },
    {
      name: "AVP",
      img: "https://images.apollo247.in/images/category/avp_web.png?tr=q-85,f-webp,w-150,dpr-1,c-at_max",
      offer: "UP TO 15% OFF",
    },
    {
      name: "Himalaya",
      img: "https://images.apollo247.in/images/category/himalaya_web.png?tr=q-85,f-webp,w-150,dpr-1,c-at_max",
      offer: "UP TO 50% OFF",
    },
    {
      name: "Kottakkal Ayurveda",
      img: "https://images.apollo247.in/images/category/kottakkal_web.png?tr=q-85,f-webp,w-150,dpr-1,c-at_max",
      offer: "FLAT 5% OFF",
    },
    {
      name: "Rasayanam",
      img: "https://images.apollo247.in/images/category/rasayanam_web.png?tr=q-85,f-webp,w-150,dpr-1,c-at_max",
      offer: "UP TO 70% OFF",
    },
    {
      name: "Zandu",
      img: "https://images.apollo247.in/images/category/zandu_web.png?tr=q-85,f-webp,w-150,dpr-1,c-at_max",
      offer: "UP TO 50% OFF",
    },
  ];

  return (
    <section className="brands-section" id="brands-section">
      <h2>Popular Brands</h2>
      <div className="brands-container">
        {brands.map((brand) => (
          <div
            key={brand.name}
            className="brand-card"
            role="button"
            aria-label={`${brand.name} Products`}
          >
            <img src={brand.img} alt={brand.name} />
            <div className="discount">{brand.offer}</div>
            <div className="brand-name">{brand.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
