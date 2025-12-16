import React, { useEffect, useState, useRef } from "react";
import api from "../../../services/api";
import "../MedicineStyling/PharmacyNearMe.css";

export default function PharmacyNearMe() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");
  const [stores, setStores] = useState([]);
  const [visible, setVisible] = useState(6);
  const [search, setSearch] = useState("");
  const loaderRef = useRef(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => setError("Location permission denied")
    );
  }, []);

  useEffect(() => {
    if (!location) return;

    api
      .get("/hospitals/nearby", {
        params: {
          latitude: location.lat,
          longitude: location.lng,
          radius: 5,
          type: "Hospital",
        },
      })
      .then((res) => setStores(res.data?.data || []))
      .catch(() => setError("Failed to load pharmacies"));
  }, [location]);

  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVisible((v) => v + 4);
    });
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, []);

  const filteredStores = stores.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.city?.toLowerCase().includes(search.toLowerCase())
  );

  const visibleStores = filteredStores.slice(0, visible);

  if (error) return <p className="status-msg">{error}</p>;
  if (!location) return <p className="status-msg">Detecting location…</p>;

  return (
    <div className="pharmacy-page">
      <h2 className="page-title">🏥 Pharmacies Near You</h2>

      <input
        className="search-box"
        placeholder="Search pharmacy or city..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="pharmacy-grid">
        {visibleStores.map((store) => (
          <div className="pharmacy-card" key={store.id}>
            <h3>{store.name}</h3>
            <p className="city">{store.city}</p>

            <div className="badges">
              <span className="badge open">Open</span>
              <span className="badge delivery">Delivery Available</span>
            </div>

            <div className="map-wrapper">
              <iframe
                title={`map-${store.id}`}
                loading="lazy"
                src={`https://www.google.com/maps?q=${store.latitude},${store.longitude}&z=15&output=embed`}
              />
            </div>

            <button
              className="map-btn"
              onClick={() =>
                window.open(
                  `https://www.google.com/maps?q=${store.latitude},${store.longitude}`,
                  "_blank"
                )
              }
            >
              Open in Google Maps
            </button>
          </div>
        ))}
      </div>

      {visible < filteredStores.length && (
        <div ref={loaderRef} className="loader">
          Loading more pharmacies…
        </div>
      )}
    </div>
  );
}
