import React from 'react';
import footer from "../assets/footer.jpg";

function Footer() {
  return (
    <footer className="relative text-white py-10">
      {/* Background Image */}
      <img
        src={footer}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay to improve readability */}
      <div className="absolute inset-0 bg-designColor bg-opacity-90"></div>

      {/* Content */}
      <div className="relative container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div>
          <div className="flex items-center mb-4">
            <h2 className="text-2xl font-bold"><span className='text-gradientStart'>P</span>ark<span className='text-gradientStart'>E</span>ase</h2>
          </div>
          <p className="text-gray-400 mb-4">
          We are the leading provider of vehicle parking solutions in Nepal. Park with ease like never before!          </p>

        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Navigation</h3>
          <ul className="space-y-2">
            <li><a href="#home" className="text-gray-400 hover:text-white flex items-center"><span className="text-green-500 mr-2">•</span> Home</a></li>
            <li><a href="#about-us" className="text-gray-400 hover:text-white flex items-center"><span className="text-green-500 mr-2">•</span> About Us</a></li>
            <li><a href="#services" className="text-gray-400 hover:text-white flex items-center"><span className="text-green-500 mr-2">•</span>Services</a></li>
            <li><a href="#contact" className="text-gray-400 hover:text-white flex items-center"><span className="text-green-500 mr-2">•</span> Contact Us</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
          <p className="text-gray-400 mb-2">Corporate Office Address:</p>
          <p className="text-gray-400 flex items-center mb-4">
            <span className="text-green-500 mr-2">📍</span> Balkumari, Lalitpur
          </p>
          <p className="text-gray-400 flex items-center">
            <span className="text-blue-500 mr-2">📞</span> +977 9847693340
          </p>
        </div>

        {/* Discover Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Discover</h3>
          <ul className="space-y-2">
            <li><a href="" className="text-gray-400 hover:text-white flex items-center"><span className="text-green-500 mr-2">•</span> Help</a></li>
            <li><a href="" className="text-gray-400 hover:text-white flex items-center"><span className="text-green-500 mr-2">•</span> How It Works</a></li>
            <li><a href="" className="text-gray-400 hover:text-white flex items-center"><span className="text-green-500 mr-2">•</span> Contact Us</a></li>
          </ul>
        </div>
      </div>
      {/* Copyright Notice */}
      <div className="relative container mx-auto px-6 mt-8 text-center">
        <p className="text-gray-400 text-sm">
          ParkEase © 2025. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;