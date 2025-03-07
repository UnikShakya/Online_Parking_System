import React, { useState } from 'react'

function ManageParking() {

const [parkingCount, setParkingCount] = useState(0)

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow-md text-white hover:shadow-lg transform transition duration-300 hover:scale-105 cursor-pointer">
    <h3 className="text-lg font-semibold">Total Parkings</h3>
    <p className="text-4xl font-bold mt-2">
      {parkingCount > 0 ? parkingCount : "No parking yet"}
    </p>
  </div>
  )
}

export default ManageParking
