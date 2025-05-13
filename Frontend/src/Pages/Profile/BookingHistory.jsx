import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaParking, FaCalendarAlt, FaClock, FaSearchLocation, FaRegClock, FaTimes } from 'react-icons/fa';

function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');

 useEffect(() => {
    const fetchBookings = async () => {
      if (!token) {
        setError("No token found.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/api/profile/my-bookings', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response && response.data) {
          setBookings(response.data);
        } else {
          setBookings([]);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Failed to fetch bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  const cancelBooking = async (bookingId) => {
     const confirmCancel = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirmCancel) return;
    try {
      const response = await axios.put(`http://localhost:3000/api/parking/cancel/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.message === "Booking cancelled successfully.") {
        // Update the UI state after cancellation
        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking._id !== bookingId)
        );
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      // You can show an error message or alert here
    }
  };

  const extendBooking = async()=>{
    
  }
  return (
    <div className="text-designColor">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center">
          👋 Welcome, <span className="bg-gradient-to-r from-gradientStart to-gradientEnd bg-clip-text text-transparent">{username}</span>
        </h2>
        <h3 className="text-xl font-semibold text-center mb-8 text-designColor">Your Booking History</h3>

        {bookings.length > 0 ? (
          <ul className="divide-y divide-gray-700 border border-gray-700 rounded-xl overflow-hidden">
            {bookings.map((booking, index) => (
              <li key={index} className="p-4 hover:bg-white/10 transition duration-200">
                <div className="text-lg font-semibold text-designColor flex items-center gap-2 mb-2">
                  <FaParking /> Spot: {booking.selectedSpots}
                </div>
                <div className='flex justify-between'>
                <div className="text-sm text-designColor space-y-1">
                  <p className="flex items-center gap-2"><FaSearchLocation /> Location: {booking.location}</p>
                  <p className="flex items-center gap-2"><FaCalendarAlt /> Date: {booking.date}</p>
                  <p className="flex items-center gap-2"><FaClock /> Start Time: {booking.startTime}</p>
                  <p className="flex items-center gap-2"><FaClock /> End Time: {booking.endTime}</p>
                </div>
                <div className=''>
                         <button className="px-4 me-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200">
                    Extend
                  </button>
                  <button onClick={() => cancelBooking(booking._id)} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200">
                    Cancel
                  </button>
                </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center mt-20">
            <p className="text-2xl text-designColor mb-6">🚫 You have no bookings yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingHistory;
