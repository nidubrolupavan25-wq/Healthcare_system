import React from "react";

export default function TestModal({ show, test, onClose, onBook }) {
  if (!show || !test) return null;
  return (
    <div className="modal-lt" style={{ display: "flex" }}>
      <div className="modal-content-lt">
        <button className="close-button-lt" onClick={onClose}>
          ×
        </button>
        <div id="testDetailsContent">
          <h2 id="testTitle">{test.title}</h2>
          <p id="testDescription">{test.description}</p>
          <p id="testCost" className="price-lt">{test.cost}</p>
          <a href="../html/payment.html">
            <button className="pay-button-lt" onClick={() => onBook(test)}>
              Book Now
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
