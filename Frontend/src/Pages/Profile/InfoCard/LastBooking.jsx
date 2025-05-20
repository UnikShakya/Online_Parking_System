import React from 'react';
import { FaHistory } from 'react-icons/fa';

function LastBooking() {
  const lastBooking = {
    date: '2025-05-10',
    time: '5:30 PM',
    location: 'Location 3'
  };

  return (
    <div className="bg-gradient-to-r  from-blue-500 to-blue-600 p-6 rounded-lg shadow-md text-white hover:shadow-lg transform transition duration-300 hover:scale-105 cursor-pointer">
      <FaHistory className="text-red-600 text-3xl" />
      <div>
        <h3 className="text-xl font-bold">{lastBooking.date}</h3>
        <p className="text-sm text-white">Last at {lastBooking.time} - {lastBooking.location}</p>
      </div>
    </div>
  );
}

export default LastBooking;
