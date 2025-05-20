import React, { useEffect, useState } from 'react';
import axios from 'axios';
<<<<<<< HEAD
import {
  FaParking, FaCalendarAlt, FaClock,
  FaSearchLocation
} from 'react-icons/fa';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

function UpcomingBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [newEndTime, setNewEndTime] = useState('');

=======
import { FaParking, FaCalendarAlt, FaClock, FaSearchLocation } from 'react-icons/fa';

function UpcomingBookings() {
  const [upcomingBookings, setUpcomingBookings] = useState([]);
>>>>>>> b35dab6 (Successfully user can extend date and endTime)
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) {
<<<<<<< HEAD
        setError("No token found.");
        setLoading(false);
        return;
=======
        return; // Return if no token is found
>>>>>>> b35dab6 (Successfully user can extend date and endTime)
      }

      try {
        const response = await axios.get('http://localhost:3000/api/profile/my-bookings', {
<<<<<<< HEAD
          headers: { Authorization: `Bearer ${token}` },
        });

        const now = new Date();
        const upcoming = response.data.filter((booking) => {
          const bookingDateTime = new Date(`${booking.date}T${booking.endTime}`);
          return bookingDateTime > now;
        });

        setBookings(upcoming);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Failed to fetch bookings. Please try again later.");
      } finally {
        setLoading(false);
=======
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
>>>>>>> b35dab6 (Successfully user can extend date and endTime)
      }
    };

    fetchBookings();
  }, [token]);

<<<<<<< HEAD
  const cancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirmCancel) return;
    try {
      const response = await axios.put(`http://localhost:3000/api/parking/cancel/${bookingId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.message === "Booking cancelled successfully.") {
        setBookings((prev) => prev.filter((booking) => booking._id !== bookingId));
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setSelectedDate(dayjs(booking.date)); // Pre-fill with current date
    setNewEndTime(booking.endTime);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedBooking(null);
    setSelectedDate(null);
    setNewEndTime('');
  };

  const handleExtend = async () => {
    const newDate = selectedDate?.format('YYYY-MM-DD');
    const oldDateTime = new Date(`${selectedBooking.date}T${selectedBooking.endTime}`);
    const newDateTime = new Date(`${newDate}T${newEndTime}`);

    if (new Date(newDate) < new Date(selectedBooking.date)) {
      toast.error("New date must be the same or after the current booking date.");
      return;
    }

    if (newDateTime <= oldDateTime) {
      toast.error("New end time must be after the current end time.");
      return;
    }

    try {
      const response = await axios.put(`http://localhost:3000/api/parking/extend/${selectedBooking._id}`, {
        newDate,
        newEndTime,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.message === "Booking extended successfully.") {
        toast.success("Booking extended!");
        setBookings((prev) =>
          prev.map((b) =>
            b._id === selectedBooking._id
              ? { ...b, date: newDate, endTime: newEndTime }
              : b
          )
        );
        closeModal();
      }
    } catch (error) {
      console.error("Error extending booking:", error);
    }
  };
=======
  // Function to format date to the desired local format
  const formatDate = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString('en-US', options); // Format as "MM/DD/YYYY"
};
>>>>>>> b35dab6 (Successfully user can extend date and endTime)

  return (
    <div className="text-designColor">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center">
          👋 Welcome, <span className="bg-gradient-to-r from-gradientStart to-gradientEnd bg-clip-text text-transparent">{username}</span>
        </h2>
        <h3 className="text-xl font-semibold text-center mb-8 text-designColor">Your Upcoming Bookings</h3>

<<<<<<< HEAD
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : bookings.length > 0 ? (
          <ul className="divide-y divide-gray-700 border border-gray-700 rounded-xl overflow-hidden">
            {bookings.map((booking, index) => (
=======
        {upcomingBookings.length > 0 ? (
          <ul className="divide-y divide-gray-700 border border-gray-700 rounded-xl overflow-hidden">
            {upcomingBookings.map((booking, index) => (
>>>>>>> b35dab6 (Successfully user can extend date and endTime)
              <li key={index} className="p-4 hover:bg-white/10 transition duration-200">
                <div className="text-lg font-semibold text-designColor flex items-center gap-2 mb-2">
                  <FaParking /> Spot: {booking.selectedSpots}
                </div>
<<<<<<< HEAD
                <div className="flex justify-between">
                  <div className="text-sm text-designColor space-y-1">
                    <p className="flex items-center gap-2"><FaSearchLocation /> Location: {booking.location}</p>
                    <p className="flex items-center gap-2"><FaCalendarAlt /> Date: {booking.date}</p>
                    <p className="flex items-center gap-2"><FaClock /> Start Time: {booking.startTime}</p>
                    <p className="flex items-center gap-2"><FaClock /> End Time: {booking.endTime}</p>
                  </div>
                  <div>
                    <button
                      onClick={() => openModal(booking)}
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
=======
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
>>>>>>> b35dab6 (Successfully user can extend date and endTime)
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
<<<<<<< HEAD

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-center text-white">Extend Booking</h2>

            <label className="block text-sm font-medium mb-2 text-white">New Date</label>
<LocalizationProvider dateAdapter={AdapterDayjs}>
  <DatePicker
    label="Select Date"
    value={selectedDate}
    onChange={(newValue) => setSelectedDate(newValue)}
    minDate={dayjs()}
    format="DD/MM/YYYY"
    slotProps={{
      textField: {
        variant: "standard",
        fullWidth: true,
        sx: {
          // Input text color
          input: { color: "#ffffff" },
          // Label color
          "& .MuiInputLabel-root": {
            color: "#ffffff",
          },
          // Focused label color
          "& label.Mui-focused": {
            color: "#ffffff",
          },
          // Underline before focus
          "& .MuiInput-underline:before": {
            borderBottomColor: "#ffffff",
          },
          // Underline on hover
          "& .MuiInput-underline:hover:before": {
            borderBottomColor: "#3b82f6",
          },
          // Underline when focused
          "& .MuiInput-underline:after": {
            borderBottomColor: "#3b82f6",
          },
        },
      },
      openPickerButton: {
        sx: {
          color: "#ffffff",
        },
      },
    }}
  />
</LocalizationProvider>


            <label className="block text-sm font-medium mb-2 mt-4 text-white">New End Time</label>
            <input
              type="time"
              value={newEndTime}
              onChange={(e) => setNewEndTime(e.target.value)}
              className="w-full mb-6 px-4 py-2 rounded border text-black"
            />

            <div className="flex justify-end gap-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleExtend}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
=======
>>>>>>> b35dab6 (Successfully user can extend date and endTime)
    </div>
  );
}

export default UpcomingBookings;
