import React from "react";
import Navbar from "./Navbar"; // Import the Navbar component
import bg from "../assets/bg.jpg";
import Selection from "./Selection"; // Import the Selection component

function Hero({ setShowLogin }) {
  return (
    <div className="relative w-full h-screen bg-designColor">
      {/* Background Image */}
      <img
        src={bg}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay to improve readability (optional) */}
      <div className="absolute inset-0 bg-designColor bg-opacity-90"></div>

      {/* Centered Content */}
      <div className="absolute top-[70%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl px-4 text-center">
        {/* Add the text here */}
        <h1 className="text-4xl md:text-3xl font-bold text-white mb-6">
          ParkEase,        </h1>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Smart Parking for a Smarter City.
        </h1>

        {/* Selection Component */}
        <Selection setShowLogin={setShowLogin} />
      </div>
    </div>
  );
}

export default Hero;