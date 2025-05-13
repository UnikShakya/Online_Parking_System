import React from 'react';
import { FaHistory } from 'react-icons/fa';

function LastBooking() {
  const lastBooking = {
    date: '2025-05-10',
    time: '5:30 PM',
    location: 'Location 3'
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex items-center gap-4">
      <FaHistory className="text-purple-600 text-3xl" />
      <div>
        <h3 className="text-xl font-bold">{lastBooking.date}</h3>
        <p className="text-sm text-gray-500">Last at {lastBooking.time} - {lastBooking.location}</p>
      </div>
    </div>
  );
}

export default LastBooking;
