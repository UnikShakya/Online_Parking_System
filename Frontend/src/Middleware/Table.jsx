import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Table() {
  const [bookings, setBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBookings, setFilteredBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/booking/getBookings'); // Ensure this matches your backend route
        setBookings(response.data);
        setFilteredBookings(response.data); // Initially, show all bookings
      } catch (error) {
        console.error("Error fetching Bookings:", error);
      }
    };
    fetchBookings();
  }, []);

  // Automatically filter bookings based on search query
  useEffect(() => {
    const filtered = bookings.filter(
      (booking) =>
        booking.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBookings(filtered); // Update the filtered bookings list
  }, [searchQuery, bookings]); // Re-run filtering when searchQuery or bookings change

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-4">Parking Lot Bookings</h1>
      {/* Search bar */}
      <div className="mb-4 flex justify-end items-center">
        <input
          type="text"
          placeholder="Search by Name or Vehicle Number"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update the search query as user types
          className="w-1/4 px-4 py-2 border rounded-3xl"
        />
       
      </div>
      <div className="overflow-y-auto max-h-96">
        <table className="min-w-full bg-white shadow-md rounded-lg border">
          <thead className="bg-gray-800 sticky top-0 text-white">
            <tr>
              <th className="py-3 px-4 border">Name</th>
              <th className="py-3 px-4 border">Phone Number</th>
              <th className="py-3 px-4 border">Vehicle Number</th>
              <th className="py-3 px-4 border">Payment Method</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking, index) => (
                <tr key={index} className="text-center border-b hover:bg-gray-100">
                  <td className="py-4 px-4 border">{booking.name}</td>
                  <td className="py-4 px-4 border">{booking.phoneNumber}</td>
                  <td className="py-4 px-4 border">{booking.vehicleNumber}</td>
                  <td className="py-4 px-4 border">{booking.paymentMethod}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-4 px-4 text-center">No bookings found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
