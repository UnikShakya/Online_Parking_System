import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ConnectedCircles from "../Components/Stepper";

const ParkingLot2 = () => {
  const { state } = useLocation();
  const totalCost2Wheeler = state?.totalCost2Wheeler || 0;
  const totalCost4Wheeler = state?.totalCost4Wheeler || 0;
  const startTime = state?.startTime || "";
  const endTime = state?.endTime || "";

  const [selectedSpots, setSelectedSpots] = useState([]);
  const [bookedSpots, setBookedSpots] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  const navigate = useNavigate();

  // Parking lot configuration (single level, no floors)
  const parkingConfig = {
    "2Wheeler": {
      rows: ["A", "B", "C", "D"],
      spotsPerRow: 20,
    },
    "4Wheeler": {
      rows: ["R1", "R2", "R3", "R4", "R5", "R6"],
      spotsPerRow: 1,
    },
  };

  const handleSpotClick = (spotId) => {
    setErrorMessage("");
    if (bookedSpots.includes(spotId)) return;
    setSelectedSpots((prev) =>
      prev.includes(spotId) ? prev.filter((spot) => spot !== spotId) : [...prev, spotId]
    );
  };

  const handleBookParking = () => {
    if (selectedSpots.length === 0) {
      setErrorMessage("Please select at least one parking spot.");
    } else {
      setErrorMessage("");
      setShowModal(true);
    }
  };

  const calculatePrice = (spotId) => {
    const is2Wheeler = /^[A-Za-z]/.test(spotId);
    return is2Wheeler ? Number(totalCost2Wheeler) : Number(totalCost4Wheeler);
  };

  const calculateTotalPrice = () => {
    return selectedSpots.reduce((total, spotId) => total + calculatePrice(spotId), 0);
  };

  const handleConfirm = () => {
    setBookedSpots([...bookedSpots, ...selectedSpots]);
    setSelectedSpots([]);
    setActiveStep(2);
    setShowModal(false);

    navigate("/bookingform", {
      state: {
        selectedSpots,
        startTime,
        endTime,
        totalCost2Wheeler,
        totalCost4Wheeler,
      },
    });
  };

  const renderParkingRow = (rowId, numSpots, type) => {
    return (
      <div key={rowId} className="flex justify-center mb-4">
        {Array.from({ length: numSpots }).map((_, index) => {
          const spotId = `${rowId}${index}`;
          const isSelected = selectedSpots.includes(spotId);
          const isBooked = bookedSpots.includes(spotId);
          return (
            <div
              key={spotId}
              className={`w-12 h-12 m-2 rounded-lg border-2 flex items-center justify-center text-sm font-semibold shadow-md
                ${isSelected ? "bg-yellow-300 border-yellow-400 text-gray-800" : 
                  isBooked ? "bg-red-500 border-red-600 text-white" : 
                  type === "2Wheeler" ? "bg-blue-100 border-blue-200 text-blue-800 hover:bg-blue-200" : 
                  "bg-green-100 border-green-200 text-green-800 hover:bg-green-200"}
                cursor-pointer transition-all duration-300 transform hover:scale-105`}
              onClick={() => handleSpotClick(spotId)}
            >
              {spotId}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-designColor mt-[5rem] p-6 flex flex-col items-center">
      <ConnectedCircles activeStep={activeStep} />

      <h1 className="text-4xl font-extrabold text-white mb-8 mt-4 tracking-tight">
        Select Your Parking Spot
      </h1>

      {/* Parking Layout */}
      <div className="w-full relative max-w-8xl bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 2-Wheeler Section */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">2-Wheeler Parking</h2>
            {parkingConfig["2Wheeler"].rows.map((row) =>
              renderParkingRow(row, parkingConfig["2Wheeler"].spotsPerRow, "2Wheeler")
            )}
          </div>

          {/* 4-Wheeler Section */}
          <div className="w-full md:w-1/4">
            <h2 className="text-2xl font-bold text-green-700 text-center">4-Wheeler Parking</h2>
            {parkingConfig["4Wheeler"].rows.map((row) =>
              renderParkingRow(row, parkingConfig["4Wheeler"].spotsPerRow, "4Wheeler")
            )}
          </div>
        </div>

        {/* Entry Sign */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 rotate-90 text-lg font-semibold">
          Entry
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center mt-6 gap-6 bg-white p-4 rounded-lg shadow-md w-full max-w-8xl">
        <div className="flex items-center">
          <div className="w-5 h-5 bg-blue-100 border-2 border-blue-200 rounded mr-2"></div>
          <span className="text-gray-700 font-medium">2-Wheeler Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-5 h-5 bg-green-100 border-2 border-green-200 rounded mr-2"></div>
          <span className="text-gray-700 font-medium">4-Wheeler Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-5 h-5 bg-yellow-300 border-2 border-yellow-400 rounded mr-2"></div>
          <span className="text-gray-700 font-medium">Selected</span>
        </div>
        <div className="flex items-center">
          <div className="w-5 h-5 bg-red-500 border-2 border-red-600 rounded mr-2"></div>
          <span className="text-gray-700 font-medium">Booked</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col items-center mt-8 w-full max-w-6xl">
        <button
          className="bg-gradient-to-r from-gradientStart to-gradientEnd text-white rounded-full px-8 py-3 text-lg font-semibold shadow-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105"
          onClick={handleBookParking}
        >
          Book Selected Spots
        </button>
        {errorMessage && (
          <p className="mt-3 text-red-600 font-medium animate-pulse">{errorMessage}</p>
        )}
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-2xl rounded-xl p-8 shadow-2xl transform transition-all duration-300 scale-100">
            <button
              className="absolute top-4 right-4 text-gray-500 text-2xl font-bold hover:text-red-500 transition-colors"
              onClick={() => setShowModal(false)}
            >
              ✖
            </button>

            <h2 className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-gradientStart to-gradientEnd bg-clip-text text-transparent">
              Booking Summary
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Time Details</h3>
                <p className="text-gray-600"><span className="font-medium">From:</span> {startTime}</p>
                <p className="text-gray-600"><span className="font-medium">To:</span> {endTime}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Pricing</h3>
                <p className="text-gray-600"><span className="font-medium">2-Wheeler:</span> Rs {totalCost2Wheeler}</p>
                <p className="text-gray-600"><span className="font-medium">4-Wheeler:</span> Rs {totalCost4Wheeler}</p>
              </div>
            </div>

            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Spot ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSpots.map((spot, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-700">{spot}</td>
                      <td className="py-3 px-4 text-gray-700">{/^[A-Za-z]/.test(spot) ? "2-Wheeler" : "4-Wheeler"}</td>
                      <td className="py-3 px-4 text-gray-700">Rs {calculatePrice(spot)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 font-semibold text-gray-800">
                    <td className="py-3 px-4" colSpan="2">Total</td>
                    <td className="py-3 px-4">Rs {calculateTotalPrice()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="flex justify-center gap-4">
              <button
                className="bg-gray-200 text-gray-700 rounded-full px-6 py-2 font-medium hover:bg-gray-300 transition-all duration-300 shadow"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-gradient-to-r from-gradientStart to-gradientEnd text-white rounded-full px-8 py-2 font-semibold hover:opacity-90 transition-all duration-300 shadow-lg"
                onClick={handleConfirm}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParkingLot2;