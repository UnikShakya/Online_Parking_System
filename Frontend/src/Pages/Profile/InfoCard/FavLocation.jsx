import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

function FavLocation() {
  const location = 'Location 1'; // Mock data

  return (
    <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg shadow-md text-white hover:shadow-lg transform transition duration-300 hover:scale-105 cursor-pointer">
      <FaMapMarkerAlt className="text-red-600 text-3xl" />
      <div>
        <h3 className="text-xl font-bold">{location}</h3>
        <p className="text-sm text-white">Most Frequently Booked</p>
      </div>
    </div>
  );
}

export default FavLocation;
