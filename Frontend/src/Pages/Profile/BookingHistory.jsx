import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FaParking,
  FaCalendarAlt,
  FaClock,
  FaSearchLocation,
} from 'react-icons/fa';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
        setError('No token found.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/api/profile/my-bookings', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBookings(response.data || []);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError('Failed to fetch bookings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  const cancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const response = await axios.put(
        `http://localhost:3000/api/parking/cancel/${bookingId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.message === 'Booking cancelled successfully.') {
        setBookings((prev) => prev.filter((booking) => booking._id !== bookingId));
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking.');
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

    const originalEndDateTime = new Date(`${currentBooking.date}T${currentBooking.endTime}`);
    const newEndDateTime = new Date(`${newDate}T${newEndTime}:00`);

    if (newDate === currentBooking.date && newEndTime <= currentBooking.endTime.slice(0, 5)) {
      setValidationError('New end time must be later than the current end time.');
      return;
    }

    if (newEndDateTime <= originalEndDateTime) {
      setValidationError('New end time must be after the current booking end.');
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/api/parking/extend/${currentBooking._id}`,
        { endTime: newEndTime, date: newDate },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.message === 'Booking extended successfully.') {
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === currentBooking._id
              ? { ...booking, endTime: newEndTime, date: newDate }
              : booking
          )
        );
        closeExtendModal();
      } else {
        setValidationError('Failed to extend booking.');
      }
    } catch (error) {
      console.error('Error extending booking:', error);
      setValidationError('Error extending booking. Please try again later.');
    }
  };

  return (
    <div className="text-designColor min-h-screen bg-[#f0f0f0] py-10">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-2">
          👋 Welcome,{' '}
          <span className="bg-gradient-to-r from-gradientStart to-gradientEnd bg-clip-text text-transparent">
            {username}
          </span>
        </h2>
        <h3 className="text-xl font-semibold text-center mb-8">Your Booking History</h3>

        {loading && <p className="text-center">Loading bookings...</p>}
        {error && <p className="text-center text-red-500 mb-4">{error}</p>}

        {!loading && bookings.length > 0 ? (
          <ul className="divide-y divide-gray-700 border border-gray-700 rounded-xl overflow-hidden">
            {bookings.map((booking, index) => (
              <li key={index} className="p-4 hover:bg-white/10 transition duration-200">
                <div className="text-lg font-semibold flex items-center gap-2 mb-2">
                  <FaParking /> Spot: {booking.selectedSpots}
                </div>
                <div className="text-sm space-y-1">
                  <p className="flex items-center gap-2">
                    <FaSearchLocation /> Location: {booking.location}
                  </p>
                  <p className="flex items-center gap-2">
                    <FaCalendarAlt /> Date: {booking.date}
                  </p>
                  <p className="flex items-center gap-2">
                    <FaClock /> End Time: {booking.endTime}
                  </p>
                </div>
                <div className="mt-4 flex gap-4">
                  <button
                    onClick={() => cancelBooking(booking._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => openExtendModal(booking)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Extend
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          !loading && <p className="text-center text-gray-600">No bookings found.</p>
        )}
      </div>

      {/* Extend Modal */}
      {showExtendModal && currentBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Extend Booking</h2>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="New Date"
                value={dayjs(newDate)}
                onChange={(date) => setNewDate(date.format('YYYY-MM-DD'))}
              />
            </LocalizationProvider>
            <div className="mt-4">
              <label className="block mb-1 font-semibold">New End Time</label>
              <input
                type="time"
                value={newEndTime}
                onChange={(e) => setNewEndTime(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            {validationError && (
              <p className="text-red-500 text-sm mt-2">{validationError}</p>
            )}
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={closeExtendModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleExtendBooking}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingHistory;
