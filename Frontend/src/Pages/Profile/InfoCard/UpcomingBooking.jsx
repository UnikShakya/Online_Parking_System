import React from 'react';
import { FaCalendarAlt } from 'react-icons/fa';

function UpcomingBooking() {
  const nextBooking = {
    date: '2025-05-20',
    time: '10:00 AM',
    location: 'Location 2'
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex items-center gap-4">
      <FaCalendarAlt className="text-green-600 text-3xl" />
      <div>
        <h3 className="text-xl font-bold">{nextBooking.date}</h3>
        <p className="text-sm text-gray-500">Next at {nextBooking.time} - {nextBooking.location}</p>
      </div>
    </div>
  );
}

export default UpcomingBooking;
