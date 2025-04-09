import React, { useState } from 'react';
import { FaMotorcycle, FaCar } from "react-icons/fa";
import { toast } from "react-toastify";
import { useParkingCost } from '../Context/ParkingCostContext';

function ParkingCost() {
  const { twoWheelerCost, fourWheelerCost, setTwoWheelerCost, setFourWheelerCost } = useParkingCost();
  const [error, setError] = useState("");

  const handleChange = (e, setCost) => {
    const value = e.target.value;
    // Allow empty string or valid numbers
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setCost(value);
      setError("");
    }
  };

  const handleUpdate = () => {
    // Check if values are valid numbers
    if (twoWheelerCost === "" || fourWheelerCost === "") {
      setError("Please enter valid numbers for both vehicle types");
      return;
    }
    
    if (isNaN(Number(twoWheelerCost)) || isNaN(Number(fourWheelerCost))) {
      setError("Please enter valid numbers");
      return;
    }

    // Convert to numbers and update
    setTwoWheelerCost(Number(twoWheelerCost));
    setFourWheelerCost(Number(fourWheelerCost));
    setError("");
    toast.success("Parking Cost has been updated");
    console.log(`Updated Parking Cost: 2W - Rs.${twoWheelerCost}, 4W - Rs.${fourWheelerCost}`)
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
            onChange={(e) => handleChange(e, setTwoWheelerCost)}
            className="w-full p-2 border-none outline-none bg-transparent text-lg"
            placeholder="Enter amount"
          />
        </div>
        <div className="mb-6 flex items-center bg-white p-3 rounded-lg shadow-md text-gray-800">
          <FaCar className="text-2xl mr-2 text-purple-500" />
          <input
            type="text"
            value={fourWheelerCost}
            onChange={(e) => handleChange(e, setFourWheelerCost)}
            className="w-full p-2 border-none outline-none bg-transparent text-lg"
            placeholder="Enter amount"
          />
        </div>
        {error && (
          <div className="mb-4 text-red-300 text-center text-sm">
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