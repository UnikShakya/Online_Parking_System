import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Table() {
  const { id } = useParams(); // Get middleman ID from URL param
  const [bookings, setBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [location, setLocation] = useState('');

  // Fetch middleman by ID to get location
  useEffect(() => {
    const fetchMiddleman = async () => {
      console.log('Fetching middleman with ID:', id);
      try {
        const token = localStorage.getItem('token'); // Get token from localStorage
        if (!token) {
          console.error('No token found in localStorage');
          setLocation('Authentication required');
          return;
        }
        const res = await axios.get(`http://localhost:3000/api/middleman/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add Authorization header
          },
        });
        console.log('Middleman response:', res.data);
        if (res.data && res.data.middleman && res.data.middleman.location) {
          setLocation(res.data.middleman.location); // Should set to "Patan"
        } else {
          setLocation('Location not found');
        }
      } catch (error) {
        console.error('❌ Error fetching middleman:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          setLocation(`Error: ${error.response.data.message || 'Failed to load location'}`);
        } else {
          setLocation('Error loading location');
        }
      }
    };

    if (id) {
      fetchMiddleman();
    } else {
      console.warn('⚠️ No ID passed to Table component');
      setLocation('No ID provided');
    }
  }, [id]);

  // Fetch bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      console.log('Fetching bookings...');
      try {
        const response = await axios.get('http://localhost:3000/api/booking/getBookings');
        console.log('Bookings fetched:', response.data);
        const bookingsWithStatus = response.data.map((booking) => ({
          ...booking,
          paid: booking.paymentMethod.toLowerCase() === 'digital' ? true : (booking.paid ?? false),
        }));
        setBookings(bookingsWithStatus);
        setFilteredBookings(bookingsWithStatus);
      } catch (error) {
        console.error('❌ Error fetching Bookings:', error);
      }
    };
    fetchBookings();
  }, []);

  // Filter bookings when searchQuery or bookings change
  useEffect(() => {
    const filtered = bookings.filter(
      (booking) =>
        booking.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBookings(filtered);
  }, [searchQuery, bookings]);

  // Handle status change for payment
  const handleStatusChange = (bookingId, newStatus) => {
    try {
      console.log(`Status change for ${bookingId} -> ${newStatus}`);
      const updatedBookings = bookings.map((booking) => {
        if (booking._id === bookingId) {
          const isDigitalPayment = booking.paymentMethod.toLowerCase() === 'digital';
          return {
            ...booking,
            paid: isDigitalPayment ? true : newStatus === 'Paid',
          };
        }
        return booking;
      });
      setBookings(updatedBookings);
      setFilteredBookings(updatedBookings);
    } catch (error) {
      console.error('❌ Error updating status:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0] p-6">
      <h2 className="text-center font-semibold text-5xl">{location || 'Loading location...'}</h2>

      {/* Search Bar */}
      <div className="mb-6 md:flex-none w-2/3 flex justify-start">
        <input
          type="text"
          placeholder="Search by Name or Vehicle Number"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-1/3 px-4 py-2 border-2 border-black rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="overflow-y-auto max-h-[580px]">
          <table className="min-w-full">
            <thead className="bg-blue-600 text-white sticky top-0 z-10">
              <tr>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Phone Number</th>
                <th className="py-3 px-6 text-left">Vehicle Number</th>
                <th className="py-3 px-6 text-left">Payment Method</th>
                <th className="py-3 px-6 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">{booking.name}</td>
                    <td className="py-4 px-6">{booking.phoneNumber}</td>
                    <td className="py-4 px-6">{booking.vehicleNumber}</td>
                    <td className="py-4 px-6">{booking.paymentMethod}</td>
                    <td className="py-4 px-6">
                      <select
                        value={booking.paid ? 'Paid' : 'Unpaid'}
                        onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                        className={`w-28 px-3 py-1 rounded-lg border-2 shadow-sm focus:outline-none focus:ring-5 focus:ring-green-700 transition-all duration-200 ${
                          booking.paid
                            ? 'bg-green-50 border-green-400 text-green-700'
                            : 'bg-red-50 border-red-400 text-red-700'
                        }`}
                        disabled={booking.paymentMethod.toLowerCase() === 'digital'}
                      >
                        <option value="Paid" className="bg-green-50 border-none text-green-700">
                          Paid
                        </option>
                        <option value="Unpaid" className="bg-red-50 border-none text-red-700">
                          Unpaid
                        </option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 px-6 text-center text-gray-500">
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Footer */}
      <div className="mt-6 flex justify-between text-black">
        <p>Total Bookings: {filteredBookings.length}</p>
        <p>Cash Payments: {filteredBookings.filter((b) => b.paymentMethod.toLowerCase() === 'cash').length}</p>
      </div>
    </div>
  );
}

export default Table;