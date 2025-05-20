import axios from 'axios';
import React, { useState, useEffect } from 'react'

function ManageBookings() {

const [bookingCount, setBookingCount] = useState(0);

useEffect(() => {
  // Function to  fetchBookingCount  from the backend
  const fetchBookingCount = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/bookingCount');  // Adjust URL based on your backend
      if (response.data && response.data.bookingCount !== undefined) {
        setBookingCount(response.data.bookingCount);
      } else {
        console.error('Invalid response format', response);
        setBookingCount(0);  // Fallback value
      }
    } catch (error) {
      console.error('Error fetching user count:', error);
      setBookingCount(0);  // Fallback value on error
    }
  };

  fetchBookingCount();
}, []);  


  return (
    <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg shadow-md text-white hover:shadow-lg transform transition duration-300 hover:scale-105 cursor-pointer">
    <h3 className="text-lg font-semibold">Active Bookings</h3>
    <p className="text-4xl font-bold mt-2">
    {bookingCount > 0 ? bookingCount : "No Bookings yet"}

      </p>
  </div>
  )
}

export default ManageBookings
