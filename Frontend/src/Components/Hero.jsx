import React from "react";
import Navbar from "./Navbar"; 
import bg from "../assets/bg.jpg";
import Selection from "./Selection"; 

function Hero({ setShowLogin }) {
  return (
    <section id="home" className="relative w-full h-screen bg-designColor">
      <img
        src={bg}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-designColor bg-opacity-90"></div>

      <div className="absolute top-[70%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl px-4 text-center">
        <h1 className="text-4xl md:text-3xl font-bold text-white mb-6">
          ParkEase,        </h1>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Smart Parking for a Smarter City.
        </h1>

        <Selection setShowLogin={setShowLogin} />
      </div>
    </section>
  );
}

export default Hero;