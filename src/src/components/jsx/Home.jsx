import React from "react";
import Navbar from "../navbar/Navbar";
import Hero from "../jsx/Hero";
import ServicesGrid from "../jsx/ServicesGrid";
import ConsultationBanner from "../jsx/ConsultationBanner";
import SpecialisedDoctors from "../jsx/SpecialisedDoctors";
import CashlessSupport from "../jsx/CashlessSupport";
import VideosSection from "../jsx/VideosSection";
import Chatbot from "../jsx/Chatbot";
import RoboAssistant from "../jsx/RoboAssistant";
import "../../components/style/home.css";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <main className="main-content">
        <div className="container">
          <ServicesGrid />          
          <ConsultationBanner />
          <SpecialisedDoctors />
          <CashlessSupport />
        </div>
      </main>
      <VideosSection />
      <Chatbot />
      <RoboAssistant />
    </>
  );
}

export default Home;
