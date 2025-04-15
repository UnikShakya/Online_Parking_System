import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Table({id}) {
  const [bookings, setBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBookings, setFilteredBookings] = useState([]);

  // Fetch bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/booking/getBookings');
        const bookingsWithStatus = response.data.map(booking => ({
          ...booking,
          // Set paid to true for digital payments (e.g., "khalti"), otherwise use existing paid status or false
          paid: booking.paymentMethod.toLowerCase() === 'digital' ? true : (booking.paid ?? false),
        }));
        setBookings(bookingsWithStatus);
        setFilteredBookings(bookingsWithStatus);
      } catch (error) {
        console.error("Error fetching Bookings:", error);
      }
    };
    fetchBookings();
  }, []);

  // Filter bookings based on search query
  useEffect(() => {
    const filtered = bookings.filter(
      (booking) =>
        booking.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBookings(filtered);
  }, [searchQuery, bookings]);

  // Handle status change from dropdown
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const updatedBookings = bookings.map(booking => {
        if (booking._id === bookingId) {
          const isDigitalPayment = booking.paymentMethod.toLowerCase() === 'digital';
          const updatedBooking = { 
            ...booking, 
            paid: isDigitalPayment ? true : newStatus === 'Paid' // Prevent changing digital payments to unpaid
          };
          // Uncomment and update backend if needed
          // await axios.put(`http://localhost:4000/api/booking/${bookingId}`, { paid: updatedBooking.paid });
          return updatedBooking;
        }
        return booking;
      });
      setBookings(updatedBookings);
      setFilteredBookings(updatedBookings);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Helper function to create paths with the token and dynamic id
  const middlemanPath = (path) => `/middleman/${id}${path ? `/${path}` : ''}`;

  return (
    <div className="min-h-screen bg-designColor p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <Link to={middlemanPath("")}>
          <h1 className="text-4xl font-bold cursor-pointer">
            <span className="text-gradientStart">P</span>
            <span className="text-textColor">ark</span>
            <span className="text-gradientStart">E</span>
            <span className="text-textColor">ase</span>
          </h1>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6 md:flex-none w-full flex justify-end">
        <input
          type="text"
          placeholder="Search by Name or Vehicle Number"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-1/3 px-4 py-2 border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-y-auto max-h-[600px]">
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
                        // Disable dropdown for digital payments since they are always paid
                        disabled={booking.paymentMethod.toLowerCase() === 'digital'}
                      >
                        <option value="Paid" className="bg-green-50 border-none text-green-700">Paid</option>
                        <option value="Unpaid" className="bg-red-50 border-none text-red-700">Unpaid</option>
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
      <div className="mt-6 flex justify-between text-textColor">
        <p>Total Bookings: {filteredBookings.length}</p>
        <p>
          Cash Payments: {filteredBookings.filter(b => b.paymentMethod.toLowerCase() === 'cash').length} 
          (Unpaid: {filteredBookings.filter(b => b.paymentMethod.toLowerCase() === 'cash' && !b.paid).length})
        </p>
      </div>
    </div>
  );
}

export default Table;