import React from 'react';
import { FaCalendarAlt } from 'react-icons/fa';

function UpcomingBooking() {
  const nextBooking = {
    date: '2025-05-20',
    time: '10:00 AM',
    location: 'Location 2'
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow-md text-white hover:shadow-lg transform transition duration-300 hover:scale-105 cursor-pointer4">
      <FaCalendarAlt className="text-red-600 text-3xl" />
      <div>
        <h3 className="text-xl font-bold">{nextBooking.date}</h3>
        <p className="text-sm text-white">Next at {nextBooking.time} - {nextBooking.location}</p>
      </div>
    </div>
  );
}

export default UpcomingBooking;
