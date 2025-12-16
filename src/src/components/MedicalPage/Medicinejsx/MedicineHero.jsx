import "../MedicineStyling/MedicineHero.css";
export default function MedicineHero() {
  return (
    <section className="hero">
      <h1>Buy Medicines and Essentials</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Medicines"
          aria-label="Search Medicines"
        />
      </div>
    </section>
  );
}
