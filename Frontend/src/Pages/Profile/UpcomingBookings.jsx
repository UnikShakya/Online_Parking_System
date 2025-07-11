import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaParking, FaCalendarAlt, FaClock, FaSearchLocation, FaRegClock, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function UpcomingBookings() {
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) {
        setError("No token found.");
        setLoading(false);
        return;
      }
    

      try {
        console.log("Fetching bookings...");
        const response = await axios.get('http://localhost:3000/api/profile/my-upcomingbookings', {
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
        setError("No upcoming bookings");
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
    const response = await axios.put(
      `http://localhost:3000/api/parking/cancel/${bookingId}`,
      {}, // No body needed for cancellation
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Cancel response:", response.data);

    if (response.data.message.includes("successfully")) {
      console.log("Booking cancelled successfully:", bookingId);
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking._id !== bookingId)
      );
      toast.success("Booking cancelled successfully");
    } else {
      console.warn("Unexpected response format:", response.data);
      setError("Received unexpected response from server");
      toast.error("Failed to cancel booking");
    }
  } catch (error) {
    console.error("Error cancelling booking:", {
      error: error.message,
      response: error.response?.data,
      config: error.config,
    });
    setError(
      error.response?.data?.message || "Failed to cancel booking. Please try again."
    );
    toast.error(error.response?.data?.message || "Failed to cancel booking");
  }
};

  const openExtendModal = (booking) => {
    const formattedEndTime = booking.endTime.slice(0, 5);
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

  try {
    console.log('Attempting to extend booking via primary endpoint');
    let response;
    try {
      response = await axios.put(
        `http://localhost:3000/api/parking/extend/${currentBooking._id}`,
        { endTime: newEndTime, date: newDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Primary endpoint response:', response.data);
    } catch (primaryError) {
      console.log('Primary endpoint failed, trying fallback:', primaryError);
      try {
        response = await axios.put(
          `http://localhost:3000/api/booking/extendbooking/${currentBooking._id}`,
          { endTime: newEndTime, date: newDate },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Fallback endpoint response:', response.data);
      } catch (fallbackError) {
        console.error('Both endpoints failed:', {
          primaryError: primaryError.response?.data,
          fallbackError: fallbackError.response?.data
        });
        throw fallbackError;
      }
    }

    if (response.data.message.includes("successfully")) {
      console.log('Extension successful, updating UI');
      setBookings(prev => prev.map(booking => 
        booking._id === currentBooking._id ? response.data.updatedBooking : booking
      ));
      closeExtendModal(); 
      toast.success("Booking has been extended successfully")
    } else {
      console.warn('Unexpected response format:', response.data);
      setValidationError("Received unexpected response from server");
    }
  } catch (error) {
    console.error('Full extension error:', {
      error: error.message,
      response: error.response?.data,
      config: error.config
    });
    setValidationError(
      error.response?.data?.message || 
      "Failed to extend booking. Please try again."
    );
  }
};

  // const viewTicket = (booking) => {
  //   navigate('/booking-ticket', {
  //     state: {
  //       name: booking.name || username || 'NA',
  //       // vehicleNumber: booking.vehicleNumber || 'NA',
  //       selectedSpots: booking.selectedSpots,
  //       startTime: booking.startTime,
  //       endTime: booking.endTime,
  //       totalAmount: booking.totalAmount || '0', // Default to '0' if not available
  //       selectedDate: booking.date,
  //     },
  //   });
  // };

  return (
    <div className="text-designColor">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center">
          Welcome, <span className="bg-gradient-to-r from-gradientStart to-gradientEnd bg-clip-text text-transparent">{username}</span>
        </h2>
        <h3 className="text-xl font-semibold text-center mb-8 text-designColor">Your Booking History</h3>

        {loading ? (
          <div className="text-center mt-20">
            <p className="text-2xl text-designColor">Loading bookings...</p>
          </div>
        ) : error ? (
          <div className="text-center mt-20">
            <p className="text-2xl text-red-500">{error}</p>
          </div>
        ) : bookings.length > 0 ? (
          <ul className="divide-y divide-gray-700 border border-gray-700 rounded-xl overflow-hidden">
            {bookings.map((booking, index) => (
              <li key={index} className="p-4 hover:bg-white/10 transition duration-200">
                <div className="text-lg font-semibold text-designColor flex items-center gap-2 mb-2">
                  <FaParking /> Spot: {booking.selectedSpots}
                </div>
                <div className="flex justify-between">
                  <div className="text-sm text-designColor space-y-1">
                    <p className="flex items-center gap-2"><FaSearchLocation /> Location: {booking.location}</p>
                    <p className="flex items-center gap-2"><FaCalendarAlt /> Date: {booking.date}</p>
                    <p className="flex items-center gap-2"><FaClock /> Start Time: {booking.startTime}</p>
                    <p className="flex items-center gap-2"><FaRegClock /> End Time: {booking.endTime}</p>
                  </div>
                  <div>
                    <button
                      onClick={() => openExtendModal(booking)}
                      className="px-4 py-3 me-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                    >
                      Extend
                    </button>
                    <button
                      onClick={() => cancelBooking(booking._id)}
                      className="px-4 py-3 me-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
                    >
                      Cancel
                    </button>
                    {/* <button
                      onClick={() => viewTicket(booking)}
                      className="px-4 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
                    >
                      View Ticket
                    </button> */}
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

        {showExtendModal && currentBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Extend Booking</h3>
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

export default UpcomingBookings;