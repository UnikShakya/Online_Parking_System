import React, { useState } from 'react'

function ManageBookings() {

const [bookingCount, setBookingCount] = useState(0);

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
