import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./components/jsx/Home";
import Login from "./components/login/Login";
import { UserProvider } from "./context/UserContext";

import MedicinePage from "./components/MedicalPage/Medicinejsx/MedicinePage";
import MedicineNavbar from "./components/MedicalPage/Medicinejsx/MedicineNavbar";
import PharmacyNearMe from "./components/MedicalPage/Medicinejsx/PharmacyNearMe";

import DoctorPage from "./components/Doctors/jsx/DoctorPage";

export default function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart((prev) => [
      ...prev,
      { name: item.name, price: item.price ?? 0 },
    ]);
  };

  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/medicine"
          element={
            <>
              <MedicineNavbar cartCount={cart.length} />
              <MedicinePage addToCart={addToCart} />
            </>
          }
        />

        {/* ✅ Pharmacy Near Me */}
        <Route path="/pharmacy-near-me" element={<PharmacyNearMe />} />

        <Route path="/doctor" element={<DoctorPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </UserProvider>
  );
}
