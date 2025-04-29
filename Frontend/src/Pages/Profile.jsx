import React, { useEffect, useState } from 'react';
import { FaParking, FaCalendarAlt, FaClock, FaSearchLocation } from 'react-icons/fa';

function Profile() {
  const [bookings, setBookings] = useState([]);
  const username = localStorage.getItem('username');

   // Dummy bookings
   const dummyBookings = [
    {
      Location: "Location 1",
      parkingSpot: "R60",
      date: "2025-04-29",
      startTime: "10:00 AM",
      endTime: "11:00 PM",
    }

  ];
  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem('bookings'));

    if (!storedBookings || storedBookings.length === 0) {
      localStorage.setItem('bookings', JSON.stringify(dummyBookings));
      setBookings(dummyBookings);
    } else {
      setBookings(storedBookings);
    }
  }, []);
  return (
    <div className="bg-designColor text-white min-h-screen">
      <div className="pt-24 max-w-6xl mx-auto px-6">
        <h2 className="text-5xl font-bold text-center mb-4">
          👋 Welcome, <span className="bg-gradient-to-r from-gradientStart to-gradientEnd bg-clip-text text-transparent">{username}</span>
        </h2>
        <h3 className="text-2xl font-semibold text-center mb-12 text-gray-400">Your Bookings</h3>

        {bookings.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {bookings.map((booking, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-gray-700"
              >
                <h4 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-400">
                  <FaParking /> Spot: {booking.parkingSpot}
                </h4>
                <div className="space-y-2 text-gray-300 text-sm">
                  <p className="flex items-center gap-2">
                    <FaSearchLocation /> <span>Location:</span> {booking.Location}
                  </p>
                  <p className="flex items-center gap-2">
                    <FaCalendarAlt /> <span>Date:</span> {booking.date}
                  </p>
                  <p className="flex items-center gap-2">
                    <FaClock /> <span>Start Time:</span> {booking.startTime}
                  </p>
                  <p className="flex items-center gap-2">
                    <FaClock /> <span>End Time:</span> {booking.endTime}
                  </p>
                  {/* <p className="flex items-center gap-2">
                    ⏳ <span>Duration:</span> {booking.duration} hour(s)
                  </p> */}
                  {/* <p className="flex items-center gap-2 text-green-400 font-semibold">
                    <FaMoneyBillWave /> <span>Cost:</span> Rs. {booking.cost}
                  </p> */}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center mt-20">
            <p className="text-2xl text-gray-400 mb-6">🚫 You have no bookings yet.</p>

          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
