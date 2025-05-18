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
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');

  // Modal state
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [newEndTime, setNewEndTime] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) {
        setError('No token found.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          'http://localhost:3000/api/profile/my-bookings',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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
        setBookings((prev) =>
          prev.filter((booking) => booking._id !== bookingId)
        );
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking.');
    }
  };

  const openExtendModal = (booking) => {
    setSelectedBooking(booking);
    setSelectedDate(dayjs(booking.date));
    setNewEndTime(booking.endTime);
    setError('');
    setIsExtendModalOpen(true);
  };

  const closeExtendModal = () => {
    setIsExtendModalOpen(false);
    setSelectedBooking(null);
    setError('');
  };

  const handleExtend = async () => {
    setError('');

    if (!selectedDate || !newEndTime) {
      setError('Please fill in both new date and end time.');
      return;
    }

    const oldDate = new Date(selectedBooking.date);
    const oldEndTime = new Date(`${selectedBooking.date}T${selectedBooking.endTime}`);
    const newDate = selectedDate.format('YYYY-MM-DD');
    const newDateTime = new Date(`${newDate}T${newEndTime}`);

    if (selectedDate.isBefore(dayjs(oldDate), 'day')) {
      setError('New date must be the same or after the current booking date.');
      return;
    }

    if (newDateTime <= oldEndTime) {
      setError('New end time must be after the current end time.');
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/api/parking/extend/${selectedBooking._id}`,
        { newDate, newEndTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.message === 'Booking extended successfully.') {
        setBookings((prev) =>
          prev.map((b) =>
            b._id === selectedBooking._id
              ? { ...b, date: newDate, endTime: newEndTime }
              : b
          )
        );
        closeExtendModal();
      } else {
        setError('Failed to extend booking.');
      }
    } catch (error) {
      console.error('Error extending booking:', error);
      setError('Error extending booking. Please try again later.');
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
                <div className="flex justify-between">
                  <div className="text-sm space-y-1">
                    <p className="flex items-center gap-2">
                      <FaSearchLocation /> Location: {booking.location}
                    </p>
                    <p className="flex items-center gap-2">
                      <FaCalendarAlt /> Date: {booking.date}
                    </p>
                    <p className="flex items-center gap-2">
                      <FaClock /> Start Time: {booking.startTime}
                    </p>
                    <p className="flex items-center gap-2">
                      <FaClock /> End Time: {booking.endTime}
                    </p>
                  </div>
                  <div>
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
          !loading && (
            <div className="text-center mt-20">
              <p className="text-2xl">🚫 You have no bookings yet.</p>
            </div>
          )
        )}

        {/* Extend Modal */}
        {isExtendModalOpen && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-designColor p-6 rounded-lg max-w-md w-full text-white">
              <h3 className="text-xl font-semibold mb-4">Extend Booking</h3>

              <div className="mb-4">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Select New Date"
                    value={selectedDate}
                    onChange={(newValue) => setSelectedDate(newValue)}
                    minDate={dayjs()}
                    format="YYYY-MM-DD"
                    slotProps={{
                      textField: {
                        variant: 'standard',
                        fullWidth: true,
                        sx: {
                          input: { color: '#ffffff' },
                          '& .MuiInputLabel-root': { color: '#ffffff' },
                          '& label.Mui-focused': { color: '#ffffff' },
                          '& .MuiInput-underline:before': { borderBottomColor: '#ffffff' },
                          '& .MuiInput-underline:hover:before': { borderBottomColor: '#3b82f6' },
                          '& .MuiInput-underline:after': { borderBottomColor: '#3b82f6' },
                        },
                      },
                      openPickerButton: {
                        sx: { color: '#ffffff' },
                      },
                    }}
                  />
                </LocalizationProvider>
              </div>

              <label className="block mb-4">
                New End Time:
                <input
                  type="time"
                  value={newEndTime}
                  onChange={(e) => setNewEndTime(e.target.value)}
                  className="w-full px-3 py-2 mt-1 rounded-md text-black"
                />
              </label>

              {error && <p className="text-red-400 mb-2">{error}</p>}

              <div className="flex justify-end gap-4">
                <button
                  onClick={closeExtendModal}
                  className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExtend}
                  className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                >
                  Confirm
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
