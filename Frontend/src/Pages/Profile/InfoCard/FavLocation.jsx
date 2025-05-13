import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

function FavLocation() {
  const location = 'Location 1'; // Mock data

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex items-center gap-4">
      <FaMapMarkerAlt className="text-red-600 text-3xl" />
      <div>
        <h3 className="text-xl font-bold">{location}</h3>
        <p className="text-sm text-gray-500">Most Frequently Booked</p>
      </div>
    </div>
  );
}

export default FavLocation;
