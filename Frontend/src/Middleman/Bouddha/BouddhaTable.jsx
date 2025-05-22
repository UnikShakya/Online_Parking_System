import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function BouddhaTable() {
  const [bookings, setBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [location, setLocation] = useState('Bouddha'); // Set default to Bouddha
  const [BouddhaMiddlemen, setBouddhaMiddlemen] = useState([]);

  // Fetch middlemen from Bouddha
  useEffect(() => {
    const fetchBouddhaMiddlemen = async () => {
      try {
        console.log('Starting to fetch Bouddha middlemen...');
        const response = await axios.get('http://localhost:3000/api/middleman/bouddha', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming authMiddleware requires a token
          },
        });
        console.log('Bouddha middlemen response:', response.data);
        console.log('Bouddha middlemen IDs:', response.data.middlemen.map(m => m._id));
        setBouddhaMiddlemen(response.data.middlemen);
      } catch (error) {
        console.error('❌ Error fetching Bouddha middlemen:', error.response ? error.response.data : error.message);
      }
    };
    fetchBouddhaMiddlemen();
  }, []);

  // Fetch bookings and filter by Bouddha middlemen
  useEffect(() => {
    const fetchBookings = async () => {
      console.log('Starting to fetch bookings...');
      try {
        const response = await axios.get('http://localhost:3000/api/booking/getBookings');
        console.log('Bookings response:', response.data);
        console.log('Number of bookings received:', response.data.length);
        
        // Filter bookings where the middleman is in Bouddha
        console.log('Filtering bookings with Bouddha middlemen IDs:', BouddhaMiddlemen.map(m => m._id));
        const bookingsWithStatus = response.data
          .filter((booking) => {
            const isMatch = BouddhaMiddlemen.some((middleman) => {
              const match = middleman._id === booking.middlemanId;
              console.log(`Checking booking ${booking._id}: middlemanId=${booking.middlemanId}, matches=${match}`);
              return match;
            });
            return isMatch;
          })
          .map((booking) => {
            console.log(`Processing booking ${booking._id}:`, booking);
            return {
              ...booking,
              paid: booking.paymentMethod.toLowerCase() === 'digital' ? true : (booking.paid ?? false),
            };
          });

        console.log('Filtered bookings:', bookingsWithStatus);
        console.log('Number of filtered bookings:', bookingsWithStatus.length);
        setBookings(bookingsWithStatus);
        setFilteredBookings(bookingsWithStatus);
      } catch (error) {
        console.error('❌ Error fetching bookings:', error.response ? error.response.data : error.message);
      }
    };

    if (BouddhaMiddlemen.length > 0) {
      console.log('Bouddha middlemen available, fetching bookings...');
      fetchBookings();
    } else {
      console.log('No Bouddha middlemen available yet, skipping booking fetch.');
    }
  }, [BouddhaMiddlemen]);

  // Filter bookings when searchQuery changes
  useEffect(() => {
    console.log('Search query changed:', searchQuery);
    const filtered = bookings.filter(
      (booking) =>
        booking.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
    console.log('Filtered bookings after search:', filtered);
    setFilteredBookings(filtered);
  }, [searchQuery, bookings]);

  // Handle status change for payment
  const handleStatusChange = (bookingId, newStatus) => {
    try {
      console.log(`Updating status for booking ${bookingId} to ${newStatus}`);
      const updatedBookings = bookings.map((booking) => {
        if (booking._id === bookingId) {
          const isDigitalPayment = booking.paymentMethod.toLowerCase() === 'digital';
          console.log(`Booking ${bookingId} paymentMethod: ${booking.paymentMethod}, isDigital: ${isDigitalPayment}`);
          return {
            ...booking,
            paid: isDigitalPayment ? true : newStatus === 'Paid',
          };
        }
        return booking;
      });
      console.log('Updated bookings:', updatedBookings);
      setBookings(updatedBookings);
      setFilteredBookings(updatedBookings);
    } catch (error) {
      console.error('❌ Error updating status:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0] p-6">
      <h2 className="text-center font-semibold text-5xl">{location}</h2>

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

export default BouddhaTable;