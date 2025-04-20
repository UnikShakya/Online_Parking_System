import React, { useEffect, useState } from 'react';
import { FaParking, FaCalendarAlt, FaClock, FaMoneyBillWave } from 'react-icons/fa';

function Profile() {
  const [bookings, setBookings] = useState([]);
  const username = localStorage.getItem('username');

  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem('bookings')) || [];
    setBookings(storedBookings);
  }, []);

  return (
    <div className="bg-designColor text-textColor min-h-screen">
      <div className="pt-24 max-w-5xl mx-auto px-4 text-white">
        <h2 className="text-4xl font-bold mb-4">👋 Welcome, <span className="text-gradient">{username}</span></h2>
        <h3 className="text-2xl font-semibold mb-8">Your Bookings</h3>

        {bookings.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking, index) => (
              <div key={index} className="bg-[#1f2937] p-5 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 border border-gray-600">
                <h4 className="text-lg font-bold mb-3 flex items-center gap-2 text-gradient">
                  <FaParking /> Spot: {booking.parkingSpot}
                </h4>
                <p className="mb-2 flex items-center gap-2 text-sm">
                  <FaCalendarAlt /> <span>Date:</span> {booking.date}
                </p>
                <p className="mb-2 flex items-center gap-2 text-sm">
                  <FaClock /> <span>Time:</span> {booking.time}
                </p>
                <p className="mb-2 flex items-center gap-2 text-sm">
                  ⏳ <span>Duration:</span> {booking.duration} hour(s)
                </p>
                <p className="mb-1 flex items-center gap-2 text-sm text-green-400 font-semibold">
                  <FaMoneyBillWave /> <span>Cost:</span> Rs. {booking.cost}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center mt-10 text-lg">🚫 You have no bookings yet.</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
