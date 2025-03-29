import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ConnectedCircles from "../Components/Stepper";

const ParkingLot3 = () => {
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
  const [activeBuilding, setActiveBuilding] = useState("Main Building");
  const [activeFloor, setActiveFloor] = useState("Ground Floor");

  const navigate = useNavigate();

  // Parking complex configuration
  const parkingComplex = {
    "Main Building": {
      "Ground Floor": {
        "2Wheeler": {
          rows: ["A", "B", "C", "D"],
          spotsPerRow: 20,
          color: "bg-blue-100"
        },
        "4Wheeler": {
          rows: ["R1", "R2", "R3", "R4", "R5", "R6"],
          spotsPerRow: 1,
          color: "bg-green-100"
        },
        "EV Charging": {
          rows: ["EV1", "EV2"],
          spotsPerRow: 1,
          color: "bg-purple-100",
          premium: true
        }
      },
      "First Floor": {
        "2Wheeler": {
          rows: ["E", "F", "G", "H"],
          spotsPerRow: 18,
          color: "bg-blue-100"
        },
        "4Wheeler": {
          rows: ["S1", "S2", "S3", "S4"],
          spotsPerRow: 1,
          color: "bg-green-100"
        }
      }
    },
    "North Wing": {
      "Level 1": {
        "2Wheeler": {
          rows: ["N1", "N2", "N3"],
          spotsPerRow: 15,
          color: "bg-blue-100"
        },
        "4Wheeler": {
          rows: ["NR1", "NR2"],
          spotsPerRow: 1,
          color: "bg-green-100"
        },
        "Disabled": {
          rows: ["D1", "D2"],
          spotsPerRow: 1,
          color: "bg-yellow-100",
          premium: true
        }
      }
    },
    "VIP Parking": {
      "Premium Level": {
        "4Wheeler": {
          rows: ["V1", "V2", "V3", "V4"],
          spotsPerRow: 1,
          color: "bg-red-100",
          premium: true
        }
      }
    }
  };

  const handleSpotClick = (spotId, isPremium) => {
    setErrorMessage("");
    if (bookedSpots.includes(spotId)) return;
    
    // Check if trying to add premium spot with regular spots
    if ((isPremium && selectedSpots.some(s => !s.isPremium)) || 
        (!isPremium && selectedSpots.some(s => s.isPremium))) {
      setErrorMessage("Cannot mix premium and regular spots in one booking");
      return;
    }
    
    setSelectedSpots((prev) =>
      prev.some(spot => spot.id === spotId) 
        ? prev.filter((spot) => spot.id !== spotId) 
        : [...prev, { id: spotId, isPremium }]
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

  const calculatePrice = (spot) => {
    const basePrice = /^[A-Za-z]/.test(spot.id) ? 
      Number(totalCost2Wheeler) : 
      Number(totalCost4Wheeler);
      
    return spot.isPremium ? basePrice * 1.5 : basePrice;
  };

  const calculateTotalPrice = () => {
    return selectedSpots.reduce((total, spot) => total + calculatePrice(spot), 0);
  };

  const handleConfirm = () => {
    setBookedSpots([...bookedSpots, ...selectedSpots.map(s => s.id)]);
    setSelectedSpots([]);
    setActiveStep(2);
    setShowModal(false);

    navigate("/bookingform", {
      state: {
        selectedSpots: selectedSpots.map(s => s.id),
        startTime,
        endTime,
        totalCost2Wheeler,
        totalCost4Wheeler,
        isPremium: selectedSpots[0]?.isPremium || false
      },
    });
  };

  const renderParkingRow = (rowId, numSpots, type, isPremium = false) => {
    return (
      <div key={rowId} className="flex justify-center mb-4">
        {Array.from({ length: numSpots }).map((_, index) => {
          const spotId = `${rowId}${index}`;
          const isSelected = selectedSpots.some(s => s.id === spotId);
          const isBooked = bookedSpots.includes(spotId);
          let spotClass = "";
          
          if (isPremium) {
            spotClass = isSelected ? "bg-purple-400" : 
              isBooked ? "bg-red-500" : "bg-purple-200 hover:bg-purple-300";
          } else if (type === "Disabled") {
            spotClass = isSelected ? "bg-yellow-400" : 
              isBooked ? "bg-red-500" : "bg-yellow-200 hover:bg-yellow-300";
          } else if (type === "4Wheeler") {
            spotClass = isSelected ? "bg-green-400" : 
              isBooked ? "bg-red-500" : "bg-green-200 hover:bg-green-300";
          } else {
            spotClass = isSelected ? "bg-blue-400" : 
              isBooked ? "bg-red-500" : "bg-blue-200 hover:bg-blue-300";
          }

          return (
            <div
              key={spotId}
              className={`w-12 h-12 m-1 rounded border flex items-center justify-center
                ${spotClass} cursor-pointer transition-all duration-200
                ${isPremium ? "ring-2 ring-purple-500" : ""}
                ${type === "Disabled" ? "ring-2 ring-yellow-500" : ""}`}
              onClick={() => handleSpotClick(spotId, isPremium)}
              title={isPremium ? "Premium Spot" : type === "Disabled" ? "Disabled Parking" : ""}
            >
              <span className="text-xs font-bold">{spotId}</span>
              {type === "EV Charging" && (
                <span className="absolute bottom-0 text-xs">⚡</span>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderFloor = (building, floorName) => {
    const floor = parkingComplex[building][floorName];
    return (
      <div className="parking-floor mb-8 p-6 rounded-xl shadow-lg bg-white border border-gray-200">
        <h3 className="text-2xl font-bold mb-4 text-center text-gray-800">
          {building} - {floorName}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(floor).map(([type, config]) => (
            <div key={type} className="mb-6">
              <h4 className="text-lg font-semibold mb-3 flex items-center">
                <span className={`w-3 h-3 rounded-full mr-2 ${
                  type === "2Wheeler" ? "bg-blue-400" :
                  type === "4Wheeler" ? "bg-green-400" :
                  type === "EV Charging" ? "bg-purple-400" :
                  "bg-yellow-400"
                }`}></span>
                {type} Parking {config.premium && "(Premium)"}
              </h4>
              {config.rows.map(row => 
                renderParkingRow(row, config.spotsPerRow, type, config.premium)
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="relative p-5 bg-designColor text-textColor max-h-max mt-[5rem] flex flex-col items-center">
      <ConnectedCircles activeStep={activeStep} />

      <h1 className="text-3xl font-bold text-center m-6">Parking Complex</h1>
      
      {/* Building Selection */}
      <div className="flex flex-wrap justify-center mb-6 gap-2">
        {Object.keys(parkingComplex).map(building => (
          <button
            key={building}
            className={`px-4 py-2 rounded-full font-medium transition-all
              ${activeBuilding === building ? 
                "bg-gradient-to-r from-gradientStart to-gradientEnd text-white shadow-md" : 
                "bg-gray-200 hover:bg-gray-300"}`}
            onClick={() => {
              setActiveBuilding(building);
              setActiveFloor(Object.keys(parkingComplex[building])[0]);
            }}
          >
            {building}
          </button>
        ))}
      </div>

      {/* Floor Selection */}
      <div className="flex flex-wrap justify-center mb-6 gap-2">
        {Object.keys(parkingComplex[activeBuilding]).map(floor => (
          <button
            key={floor}
            className={`px-4 py-2 rounded-full font-medium transition-all
              ${activeFloor === floor ? 
                "bg-blue-600 text-white shadow-md" : 
                "bg-gray-200 hover:bg-gray-300"}`}
            onClick={() => setActiveFloor(floor)}
          >
            {floor}
          </button>
        ))}
      </div>

      {/* Entry Sign */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 rotate-90 text-lg font-semibold bg-yellow-400 px-3 py-1 rounded shadow-md">
        🚗 Entry Point
      </div>

      {/* Selected Floor */}
      {renderFloor(activeBuilding, activeFloor)}

      {/* Legend */}
      <div className="flex flex-wrap justify-center mt-6 gap-4 bg-white p-4 rounded-lg shadow">
        <div className="flex items-center">
          <div className="w-5 h-5 bg-blue-200 border border-blue-400 mr-2"></div>
          <span>2-Wheeler</span>
        </div>
        <div className="flex items-center">
          <div className="w-5 h-5 bg-green-200 border border-green-400 mr-2"></div>
          <span>4-Wheeler</span>
        </div>
        <div className="flex items-center">
          <div className="w-5 h-5 bg-purple-200 border border-purple-400 mr-2"></div>
          <span>EV/ Premium</span>
        </div>
        <div className="flex items-center">
          <div className="w-5 h-5 bg-yellow-200 border border-yellow-400 mr-2"></div>
          <span>Disabled</span>
        </div>
        <div className="flex items-center">
          <div className="w-5 h-5 bg-yellow-400 border border-yellow-600 mr-2"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center">
          <div className="w-5 h-5 bg-red-500 border border-red-600 mr-2"></div>
          <span>Booked</span>
        </div>
      </div>

      {/* Book Now Button */}
      <div className="flex flex-col items-center mt-8 w-full">
        <button
          className="bg-gradient-to-r from-gradientStart to-gradientEnd text-white rounded-full px-8 py-3 text-lg font-semibold hover:opacity-80 transition-all duration-300 transform hover:scale-105 shadow-lg"
          onClick={handleBookParking}
        >
          {selectedSpots.some(s => s.isPremium) ? "Book Premium Spots" : "Book Selected Spots"}
        </button>
        {errorMessage && (
          <p className="mt-3 text-red-500 font-semibold text-center max-w-md">{errorMessage}</p>
        )}
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white w-11/12 max-w-4xl rounded-xl p-8 relative shadow-2xl">
            <button
              className="absolute top-4 right-4 text-gray-500 text-2xl font-bold hover:text-red-500 transition-colors"
              onClick={() => setShowModal(false)}
            >
              ✖
            </button>

            <h2 className="text-3xl font-extrabold mb-6 text-center text-gradient bg-clip-text text-transparent bg-gradient-to-r from-gradientStart to-gradientEnd">
              Booking Confirmation
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Location</h3>
                <p className="text-gray-700"><span className="font-medium">Building:</span> {activeBuilding}</p>
                <p className="text-gray-700"><span className="font-medium">Floor:</span> {activeFloor}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Time Details</h3>
                <p className="text-gray-700"><span className="font-medium">From:</span> {startTime}</p>
                <p className="text-gray-700"><span className="font-medium">To:</span> {endTime}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Pricing</h3>
                <p className="text-gray-700"><span className="font-medium">2-Wheeler:</span> Rs {totalCost2Wheeler}</p>
                <p className="text-gray-700"><span className="font-medium">4-Wheeler:</span> Rs {totalCost4Wheeler}</p>
                {selectedSpots.some(s => s.isPremium) && (
                  <p className="text-gray-700"><span className="font-medium">Premium:</span> +50%</p>
                )}
              </div>
            </div>

            <div className="overflow-x-auto mb-6 border rounded-lg">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left py-3 px-4 font-semibold">Spot ID</th>
                    <th className="text-left py-3 px-4 font-semibold">Type</th>
                    <th className="text-left py-3 px-4 font-semibold">Category</th>
                    <th className="text-left py-3 px-4 font-semibold">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSpots.map((spot, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4">{spot.id}</td>
                      <td className="py-3 px-4">{/^[A-Za-z]/.test(spot.id) ? "2-Wheeler" : "4-Wheeler"}</td>
                      <td className="py-3 px-4">
                        {spot.isPremium ? "Premium" : spot.id.startsWith("D") ? "Disabled" : "Standard"}
                      </td>
                      <td className="py-3 px-4">Rs {calculatePrice(spot)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr className="font-semibold">
                    <td className="py-3 px-4" colSpan="3">Total</td>
                    <td className="py-3 px-4">Rs {calculateTotalPrice()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                className="bg-gray-300 text-gray-800 rounded-full px-6 py-2 font-medium hover:bg-gray-400 transition-colors"
                onClick={() => setShowModal(false)}
              >
                Go Back
              </button>
              <button
                className="bg-gradient-to-r from-gradientStart to-gradientEnd text-white rounded-full px-8 py-2 font-semibold hover:opacity-90 transition-opacity shadow-md"
                onClick={handleConfirm}
              >
                Confirm & Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParkingLot3;