import React, { useState } from 'react';
import { FaMotorcycle, FaCar } from "react-icons/fa";
import { toast } from "react-toastify";
import { useParkingCost } from '../Context/ParkingCostContext';

function ParkingCost() {
  const { twoWheelerNum,fourWheelerNum,setTwoWheelerNum,setFourWheelerNum  } = useParkingCost();

  const [localTwoWheelerCost, setLocalTwoWheelerCost] = useState(twoWheelerNum);
  const [localFourWheelerCost, setLocalFourWheelerCost] = useState(fourWheelerNum);
  const [error, setError] = useState("");

  const handleChange = (e, setLocalCost) => {
    const value = e.target.value;
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setLocalCost(value);
      setError("");
    }
  };

  const handleUpdate = () => {
    if (localTwoWheelerCost === "" || localFourWheelerCost === "") {
      setError("Please enter valid numbers for both vehicle types");
      return;
    }

    const twoWheelerNum = Number(localTwoWheelerCost);
    const fourWheelerNum = Number(localFourWheelerCost);

    if (isNaN(twoWheelerNum) || isNaN(fourWheelerNum) || twoWheelerNum < 0 || fourWheelerNum < 0) {
      setError("Please enter valid positive numbers");
      return;
    }

    setTwoWheelerNum(twoWheelerNum);
    setFourWheelerNum(fourWheelerNum);
    setError("");

    toast.success("Parking Cost has been updated!");
    console.log(`Updated Parking Cost: 2W - Rs.${twoWheelerNum}, 4W - Rs.${fourWheelerNum}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">Update Parking Cost</h2>

      <div className="max-w-md w-full p-6 bg-gradient-to-r from-indigo-500 to-purple-600 shadow-xl rounded-2xl text-white">
        
        {/* 2-Wheeler Input */}
        <div className="mb-6 flex items-center bg-white p-3 rounded-xl shadow-md text-gray-800">
          <FaMotorcycle className="text-2xl mr-3 text-indigo-500" />
          <input
            type="text"
            value={localTwoWheelerCost}
            onChange={(e) => handleChange(e, setLocalTwoWheelerCost)}
            className="w-full bg-transparent border-none outline-none text-lg"
            placeholder="2-Wheeler Cost"
          />
        </div>

        {/* 4-Wheeler Input */}
        <div className="mb-6 flex items-center bg-white p-3 rounded-xl shadow-md text-gray-800">
          <FaCar className="text-2xl mr-3 text-purple-500" />
          <input
            type="text"
            value={localFourWheelerCost}
            onChange={(e) => handleChange(e, setLocalFourWheelerCost)}
            className="w-full bg-transparent border-none outline-none text-lg"
            placeholder="4-Wheeler Cost"
          />
        </div>

        {error && (
          <div className="mb-4 text-red-300 text-center text-sm font-medium">
            {error}
          </div>
        )}

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
