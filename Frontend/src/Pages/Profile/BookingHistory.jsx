import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaParking, FaCalendarAlt, FaClock, FaSearchLocation, FaRegClock, FaTimes } from 'react-icons/fa';

function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newEndTime, setNewEndTime] = useState('');
  const [validationError, setValidationError] = useState('');

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
        console.log("Fetching bookings...");
        const response = await axios.get('http://localhost:3000/api/profile/my-bookings', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response && response.data) {
          console.log("Bookings fetched successfully:", response.data);
          setBookings(response.data);
        } else {
          console.log("No bookings found.");
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
      console.log(`Cancelling booking with ID: ${bookingId}`);
      const response = await axios.put(`http://localhost:3000/api/parking/cancel/${bookingId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.message === "Booking cancelled successfully.") {
        console.log("Booking cancelled successfully:", bookingId);
        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking._id !== bookingId)
        );
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  const openExtendModal = (booking) => {
    // Ensure endTime is in HH:mm format for the input
    const formattedEndTime = booking.endTime.slice(0, 5); // e.g., "16:00:00" -> "16:00"
    setCurrentBooking(booking);
    setNewDate(booking.date);
    setNewEndTime(formattedEndTime);
    setValidationError('');
    setShowExtendModal(true);
  };

  const closeExtendModal = () => {
    setShowExtendModal(false);
    setCurrentBooking(null);
    setNewDate('');
    setNewEndTime('');
    setValidationError('');
  };

  const handleExtendBooking = async () => {
    if (!currentBooking) return;

    const originalEndDateTime = new Date(`${currentBooking.date}T${currentBooking.endTime}`);
    const newEndDateTime = new Date(`${newDate}T${newEndTime}:00`);

    // Validate date and time
    if (newDate === currentBooking.date && newEndTime <= currentBooking.endTime.slice(0, 5)) {
      setValidationError("New end time must be later than the current end time on the same date.");
      return;
    }
    if (newEndDateTime <= originalEndDateTime) {
      setValidationError("New end time must be later than the current booking end.");
      return;
    }

    try {
      console.log(`Extending booking with ID: ${currentBooking._id} to ${newDate} ${newEndTime}`);
      const response = await axios.put(
        `http://localhost:3000/api/parking/extend/${currentBooking._id}`,
        { endTime: newEndTime, date: newDate },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.message === "Booking extended successfully.") {
        console.log("✅ Booking extended:", response.data.updatedBooking);
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === currentBooking._id
              ? {
                  ...booking,
                  endTime: response.data.updatedBooking.endTime,
                  date: response.data.updatedBooking.date,
                }
              : booking
          )
        );
        closeExtendModal();
      }
    } catch (error) {
      console.error("❌ Error extending booking:", error);
      setValidationError("Failed to extend the booking. Please try again.");
    }
  };

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
                    <p className="flex items-center gap-2"><FaRegClock /> End Time: {booking.endTime}</p>
                  </div>
                  <div className=''>
                    <button
                      onClick={() => openExtendModal(booking)}
                      className="px-4 me-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                    >
                      Extend
                    </button>
                    <button
                      onClick={() => cancelBooking(booking._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
                    >
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

        {/* Extend Booking Modal */}
        {showExtendModal && currentBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-designColor">Extend Booking</h3>
                <button onClick={closeExtendModal} className="text-gray-500 hover:text-gray-700">
                  <FaTimes />
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New Date
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  min={currentBooking.date}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New End Time
                </label>
                <input
                  type="time"
                  value={newEndTime}
                  onChange={(e) => setNewEndTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  min={newDate === currentBooking.date ? currentBooking.endTime.slice(0, 5) : undefined}
                />
              </div>
              
              {validationError && (
                <div className="mb-4 text-red-500 text-sm">{validationError}</div>
              )}
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeExtendModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExtendBooking}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                >
                  Confirm Extension
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingHistory;