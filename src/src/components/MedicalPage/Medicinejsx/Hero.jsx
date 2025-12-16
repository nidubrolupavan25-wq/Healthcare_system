// ================================
// Hero.jsx  (UPDATED – REAL TIME SEARCH)
// ================================

import "../MedicalPage/style/Hero.css";

export default function Hero({ searchValue, onSearch }) {
  return (
    <section className="hero">
      <h1>Buy Medicines and Essentials</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Medicines"
          value={searchValue}
          onChange={(e) => onSearch(e.target.value)}
          aria-label="Search Medicines"
        />
      </div>
    </section>
  );
}
