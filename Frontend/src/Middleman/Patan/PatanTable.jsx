import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PatanTable() {
  const [bookings, setBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved statuses from localStorage
  const getSavedStatuses = () => {
    try {
      return JSON.parse(localStorage.getItem('PatanBookingStatuses')) || {};
    } catch (error) {
      return {};
    }
  };

  // Fetch bookings for Patan location
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:3000/api/booking/getBookings');
        const savedStatuses = getSavedStatuses();
        
        // Filter bookings for Patan location and apply saved statuses
        const PatanBookings = response.data
          .filter(booking => booking.location === "Patan")
          .map(booking => ({
            ...booking,
            status: savedStatuses[booking._id] || 
                   (booking.paymentMethod.toLowerCase() === "khalti" ? "Paid" : "Unpaid")
          }));

        setBookings(PatanBookings);
        setFilteredBookings(PatanBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Filter bookings when searchQuery changes
  useEffect(() => {
    const filtered = bookings.filter(
      booking =>
        booking.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.phoneNumber.includes(searchQuery)
    );
    setFilteredBookings(filtered);
  }, [searchQuery, bookings]);

  // Handle status change and save to localStorage
  const handleStatusChange = (bookingId, newStatus) => {
    // Update state
    const updatedBookings = bookings.map(booking => {
      if (booking._id === bookingId && booking.paymentMethod.toLowerCase() !== "khalti") {
        return {
          ...booking,
          status: newStatus
        };
      }
      return booking;
    });
    
    setBookings(updatedBookings);
    setFilteredBookings(updatedBookings);

    // Save to localStorage
    const savedStatuses = getSavedStatuses();
    savedStatuses[bookingId] = newStatus;
    localStorage.setItem('PatanBookingStatuses', JSON.stringify(savedStatuses));
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading bookings...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F0F0F0] p-6">
      <h2 className="text-center font-semibold text-5xl mb-6">Patan Parking Bookings</h2>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by Name, Vehicle or Phone"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border-2 border-black rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Vehicle No.</th>
                <th className="py-3 px-4 text-left">Phone</th>
                <th className="py-3 px-4 text-left">Spot</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Start Time</th>
                <th className="py-3 px-4 text-left">End Time</th>
                <th className="py-3 px-4 text-left">Total Amount</th>
                <th className="py-3 px-4 text-left">Payment Method</th>
                <th className="py-3 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr key={booking._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{booking.name}</td>
                    <td className="py-3 px-4">{booking.vehicleNumber}</td>
                    <td className="py-3 px-4">{booking.phoneNumber}</td>
                    <td className="py-3 px-4">{booking.selectedSpots}</td>
                    <td className="py-3 px-4">{booking.date}</td>
                    <td className="py-3 px-4">{booking.startTime}</td>
                    <td className="py-3 px-4">{booking.endTime}</td>
                    <td className="py-3 px-4">Rs. {booking.totalCost}</td>
                    <td className="py-3 px-4 capitalize">{booking.paymentMethod}</td>
                    <td className="py-3 px-4">
                      {booking.paymentMethod.toLowerCase() === "khalti" ? (
                        <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800">
                          Paid
                        </span>
                      ) : (
                        <select
                          value={booking.status}
                          onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                          className={`px-3 py-1 rounded-lg border-2 ${
                            booking.status === "Paid" 
                              ? "bg-green-100 border-green-400 text-green-800" 
                              : "bg-red-100 border-red-400 text-red-800"
                          }`}
                        >
                          <option value="Paid">Paid</option>
                          <option value="Unpaid">Unpaid</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="py-4 text-center text-gray-500">
                    No bookings found for Patan location
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Footer */}
      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Total Bookings: {filteredBookings.length}
        </div>
        <div className="flex gap-4">
          <div className="text-sm">
            <span className="font-medium">Cash:</span> {filteredBookings.filter(b => b.paymentMethod.toLowerCase() === "cash").length}
          </div>
          <div className="text-sm">
            <span className="font-medium">Khalti:</span> {filteredBookings.filter(b => b.paymentMethod.toLowerCase() === "khalti").length}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatanTable;