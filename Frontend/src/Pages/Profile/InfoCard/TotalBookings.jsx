import React from 'react'
import { FaClipboardList } from 'react-icons/fa'

function TotalBookings() {
  // mock value or fetch from props/state
  const totalBookings = 5;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex items-center gap-4">
      <FaClipboardList className="text-blue-600 text-3xl" />
      <div>
        <h3 className="text-xl font-bold">{totalBookings}</h3>
        <p className="text-sm text-gray-500">Your Total Bookings</p>
      </div>
    </div>
  )
}

export default TotalBookings
