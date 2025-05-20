import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaParking, FaCalendarAlt, FaClock, FaSearchLocation } from 'react-icons/fa';

function UpcomingBookings() {
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) {
        return; // Return if no token is found
      }

      try {
        const response = await axios.get('http://localhost:3000/api/profile/my-bookings', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response && response.data) {
          // Filter upcoming bookings based on the date and time
          const now = new Date();
          const filteredBookings = response.data.filter((booking) => {
            const bookingDate = new Date(booking.date);
            const bookingStartTime = new Date(`${booking.date}T${booking.startTime}:00`);
            return bookingStartTime > now; // Only keep bookings with start time in the future
          });
          setUpcomingBookings(filteredBookings);
          console.log(response.data)
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, [token]);

  // Function to format date to the desired local format
  const formatDate = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString('en-US', options); // Format as "MM/DD/YYYY"
};

  return (
    <div className="text-designColor">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center">
          👋 Welcome, <span className="bg-gradient-to-r from-gradientStart to-gradientEnd bg-clip-text text-transparent">{username}</span>
        </h2>
        <h3 className="text-xl font-semibold text-center mb-8 text-designColor">Your Upcoming Bookings</h3>

        {upcomingBookings.length > 0 ? (
          <ul className="divide-y divide-gray-700 border border-gray-700 rounded-xl overflow-hidden">
            {upcomingBookings.map((booking, index) => (
              <li key={index} className="p-4 hover:bg-white/10 transition duration-200">
                <div className="text-lg font-semibold text-designColor flex items-center gap-2 mb-2">
                  <FaParking /> Spot: {booking.selectedSpots}
                </div>
                <div className='flex justify-between'>
                <div className="text-sm text-designColor space-y-1">
                  <p className="flex items-center gap-2"><FaSearchLocation /> Location: {booking.location}</p>
                  <p className="flex items-center gap-2"><FaCalendarAlt /> Date: {formatDate(booking.date)}</p> {/* Format date here */}
                  <p className="flex items-center gap-2"><FaClock /> Start Time: {booking.startTime}</p>
                  <p className="flex items-center gap-2"><FaClock /> End Time: {booking.endTime}</p>
                </div>
                <div className=''>
                  <button className="px-4 me-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200">
                    Extend
                  </button>
                  <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200">
                    Cancel
                  </button>
                </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center mt-20">
            <p className="text-2xl text-designColor mb-6">🚫 You have no upcoming bookings.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UpcomingBookings;
