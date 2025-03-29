import React, { useState } from "react";
import { FaMotorcycle, FaCar } from "react-icons/fa";
import { toast } from "react-toastify"
function ParkingCost() {
  const [twoWheelerCost, setTwoWheelerCost] = useState("25");
  const [fourWheelerCost, setFourWheelerCost] = useState("45");

  const handleUpdate = () => {
    toast.success("Parking Cost has been updated")
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold text-center mb-6">Update Parking Cost</h2>
      <div className="max-w-md p-6 bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg rounded-xl text-white">
        <div className="mb-6 flex items-center bg-white p-3 rounded-lg shadow-md text-gray-800">
          <FaMotorcycle className="text-2xl mr-2 text-indigo-500" />
          <input
            type="text"
            value={twoWheelerCost}
            onChange={(e) => setTwoWheelerCost(e.target.value)}
            className="w-full p-2 border-none outline-none bg-transparent text-lg"
          />
        </div>
        <div className="mb-6 flex items-center bg-white p-3 rounded-lg shadow-md text-gray-800">
          <FaCar className="text-2xl mr-2 text-purple-500" />
          <input
            type="text"
            value={fourWheelerCost}
            onChange={(e) => setFourWheelerCost(e.target.value)}
            className="w-full p-2 border-none outline-none bg-transparent text-lg"
          />
        </div>
        <button
          onClick={handleUpdate}
          className="w-full bg-white text-indigo-600 font-bold py-2 rounded-lg hover:bg-gray-200 transition-all"
        >
          Update Cost
        </button>
      </div>
    </div>
  );
}

export default ParkingCost;
