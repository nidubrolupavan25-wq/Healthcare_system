import React from "react";

export default function TestCard({ test, onOpen, onAdd }) {
  return (
    <div className="subcategory-card-lt" onClick={() => onOpen(test.id)}>
      <img src={test.img} alt={test.title} />
      <h3>{test.title}</h3>
      <p>{test.short}</p>
      <p className="price-lt">{test.cost}</p>
      <button
        className="pay-button-lt"
        onClick={(e) => { e.stopPropagation(); onAdd(test.title, test.price); }}
      >
        Add to Cart
      </button>
    </div>
  );
}
    