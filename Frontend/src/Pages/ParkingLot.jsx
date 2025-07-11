import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ConnectedCircles from "../Components/Stepper";

const ParkingLot = ({ discountRate }) => {
  const { state } = useLocation();
  const { locationId } = useParams();
  const totalCost2Wheeler = state?.totalCost2Wheeler || 0;
  const totalCost4Wheeler = state?.totalCost4Wheeler || 0;
  const startTime = state?.startTime || "";
  const endTime = state?.endTime || "";
  const selectedDate = state?.selectedDate || "";
  const isPeak = state?.isPeak || false;
  const rates = state?.rates || {
    "2Wheeler": { offPeakRate: 20 },
    "4Wheeler": { offPeakRate: 40 }
  };

  const [parkingLots, setParkingLots] = useState([]);
  const [selectedSpots, setSelectedSpots] = useState([]);
  const [bookedSpots, setBookedSpots] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [currentLocation, setCurrentLocation] = useState(locationId || "Patan");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all parking lots
        const parkingResponse = await axios.get("http://localhost:3000/api/parking");
        const filteredParkingLots = parkingResponse.data.filter(
          (spot) => spot.location === currentLocation
        );
        setParkingLots(filteredParkingLots);
        
        // Fetch booked spots separately
        const bookedResponse = await axios.get("http://localhost:3000/api/parking/booked");
        const bookedSpotNumbers = bookedResponse.data.map(spot => spot.selectedSpots);
        setBookedSpots(bookedSpotNumbers);
        
      } catch (err) {
        console.error("Error fetching data:", err);
        setErrorMessage("Failed to fetch parking data.");
      }
    };
  
    fetchData();
  }, [currentLocation]);

  const handleSpotClick = (spot) => {
    if (bookedSpots.includes(spot.selectedSpots)) return;

    setSelectedSpots(prev =>
      prev.includes(spot.selectedSpots)
        ? prev.filter(spotId => spotId !== spot.selectedSpots)
        : [...prev, spot.selectedSpots]
    );
  };

  const handleBookParking = () => {
    if (selectedSpots.length === 0) {
      setErrorMessage("Please select a parking lot.");
      return;
    }
    setErrorMessage("");
    setShowModal(true);
  };

  const calculatePrice = (spotId) => {
    return spotId.startsWith("R") ? Number(totalCost4Wheeler) : Number(totalCost2Wheeler);
  };

  const calculateTotalPrice = () => {
    return selectedSpots.reduce((total, spotId) => total + calculatePrice(spotId), 0);
  };

  const handleConfirm = () => {
    if (selectedSpots.length === 0) {
      setErrorMessage("Please select a parking lot.");
      return;
    }
  
    setErrorMessage("");
    navigate("/bookingform", {
      state: {
        selectedSpots,
        startTime,
        endTime,
        totalCost2Wheeler,
        totalCost4Wheeler,
        selectedDate,
        location: currentLocation
      },
    });
  };

  const render2WheelerParking = () => {
    const twoWheelerSpots = parkingLots.filter(spot => {
      const spotId = String(spot.selectedSpots || '');
      return spotId && !spotId.startsWith("R");
    });
    
    if (twoWheelerSpots.length === 0) {
      return <div className="text-center py-4">No 2-wheeler spots available</div>;
    }

    const rows = [];
    for (let i = 0; i < twoWheelerSpots.length; i += 10) {
      const rowSpots = twoWheelerSpots.slice(i, i + 10);
      rows.push(
        <div key={`row-${i}`} className="flex justify-center gap-4 mb-2">
          <div className="flex space-x-1">
            {rowSpots.map((spot) => (
              <ParkingSpot
                key={spot.selectedSpots}
                spot={spot}
                selectedSpots={selectedSpots}
                bookedSpots={bookedSpots}
                onClick={handleSpotClick}
                is4Wheeler={false}
              />
            ))}
          </div>
        </div>
      );
    }
    return rows;
  };

  const render4WheelerParking = () => {
    const fourWheelerSpots = parkingLots.filter(spot => {
      const spotId = String(spot.selectedSpots || '');
      return spotId && spotId.startsWith("R");
    });
    
    if (fourWheelerSpots.length === 0) {
      return <div className="text-center py-4">No 4-wheeler spots available</div>;
    }

    return (
      <div className="flex justify-center">
        <div className="grid grid-cols-6 gap-4">
          {fourWheelerSpots.map((spot) => (
            <ParkingSpot
              key={spot.selectedSpots}
              spot={spot}
              selectedSpots={selectedSpots}
              bookedSpots={bookedSpots}
              onClick={handleSpotClick}
              is4Wheeler={true}
            />
          ))}
        </div>
      </div>
    );
  };


  return (
    <div className="relative p-5 bg-designColor min-h-screen flex flex-col items-center">
      <ConnectedCircles activeStep={activeStep} />

      <h1 className="text-3xl font-bold text-center text-textColor my-8">
        Parking Lots - {currentLocation}
      </h1>

      {/* Main Parking Area */}
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-6 mb-8">
        {/* Entry Road */}
        <div className="bg-gray-500 h-12 mb-6 flex items-center justify-center">
          <span className="text-white font-bold text-lg">ENTRY</span>
        </div>

        {/* 2-Wheeler Parking Section */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-center text-gray-700 bg-blue-100 py-2 rounded">
            2-Wheeler Parking
          </h3>
          <div className="parking-rows">
            {render2WheelerParking()}
          </div>
        </div>

        <div className="border-t-4 border-dashed border-gray-300 my-6"></div>

        {/* 4-Wheeler Parking Section */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 text-center text-gray-700 bg-green-100 py-2 rounded">
            4-Wheeler Parking
          </h3>
          <div className="parking-rows">
            {render4WheelerParking()}
          </div>
        </div>

        {/* Exit Road */}
        <div className="bg-gray-500 h-12 mt-6 flex items-center justify-center">
          <span className="text-white font-bold text-lg">EXIT</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center mt-4 space-x-8 mb-8 bg-white p-4 rounded-lg shadow">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-blue-400 rounded mr-2"></div>
          <span className="text-gray-700">Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 bg-yellow-400 rounded mr-2"></div>
          <span className="text-gray-700">Selected</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 bg-red-500 rounded mr-2"></div>
          <span className="text-gray-700">Booked</span>
        </div>
      </div>

      <div className="flex flex-col items-center mt-4 mb-12">
        <button
          className="bg-gradient-to-r from-gradientStart to-gradientEnd hover:opacity-70 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105 shadow-lg"
          onClick={handleBookParking}
        >
          Book Now
        </button>
        {errorMessage && (
          <p className="mt-3 text-red-500 font-semibold">{errorMessage}</p>
        )}
      </div>

      {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
              <div className="bg-gray-900 text-white w-11/12 max-w-4xl rounded-xl p-8 relative shadow-2xl transform transition-all duration-300">
                <button
                  className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-red-400 transition-colors duration-200"
                  onClick={() => setShowModal(false)}
                >
                  ✖
                </button>

                <h2 className="text-3xl font-extrabold mb-6 text-center bg-clip-text text-transparent bg-textColor">
                  Selected Parking Lot
                </h2>

                <div className="mb-6 text-center">
                  <p className="text-lg text-gray-300">
                  {`2-Wheeler: Rs ${rates["2Wheeler"].offPeakRate} per hour`}
                  </p>
                  <p className="text-lg text-gray-300">
                  {`4-Wheeler: Rs ${rates["4Wheeler"].offPeakRate} per hour`}
                  </p>
                </div>
                {isPeak && (
    <p className="text-sm text-yellow-600">
      A discount of {discountRate * 100}% has been applied due to peak hours.
    </p>
  )}

                <div className="overflow-x-auto">
                  <table className="w-full mb-8 border-separate border-spacing-0">
                    <thead>
                      <tr className="bg-gray-800 rounded-t-lg">
                        <th className="text-left py-3 px-6 font-semibold text-blue-400 rounded-tl-lg">Parking Lot ID</th>
                        <th className="text-left py-3 px-6 font-semibold text-blue-300">From</th>
                        <th className="text-left py-3 px-6 font-semibold text-blue-300">To</th>
                        <th className="text-left py-3 px-6 font-semibold text-blue-300 rounded-tr-lg">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedSpots.map((spot, index) => (
                        <tr key={index} className="hover:bg-gray-700 transition-colors duration-150">
                          <td className="py-4 px-6 border-b border-gray-700">{spot}</td>
                          <td className="py-4 px-6 border-b border-gray-700">{startTime}</td>
                          <td className="py-4 px-6 border-b border-gray-700">{endTime}</td>
                          <td className="py-4 px-6 border-b border-gray-700">Rs {calculatePrice(spot)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mb-6 text-right">
                  <span className="text-2xl font-bold text-textColor">Total: Rs {calculateTotalPrice()}</span>
                </div>

                <div className="flex justify-center">
                  {/* <Link to="/bookingform"> */}
                    <button
                      className="bg-gradient-to-r from-gradientStart to-gradientEnd text-white rounded-full px-8 py-3 text-lg font-semibold cursor-pointer hover:opacity-80 transition-all duration-300 transform hover:scale-105 shadow-lg"
                      onClick={handleConfirm}
                    >
                      Confirm Booking
                    </button>
                  {/* </Link> */}
                </div>
              </div>
            </div>
          )}

    </div>
  );
};

const ParkingSpot = ({ spot, selectedSpots, bookedSpots, onClick, is4Wheeler = false }) => {
  const isSelected = selectedSpots.includes(spot.selectedSpots);
  const isBooked = spot.isBooked || bookedSpots.includes(spot.selectedSpots);

  return (
    <div
      onClick={() => !isBooked && onClick(spot)}
      className={`flex flex-col justify-center items-center rounded-md ${
        isBooked
          ? "bg-red-500 cursor-not-allowed"
          : isSelected
          ? "bg-yellow-400 cursor-pointer"
          : "bg-blue-400 cursor-pointer"
      } ${
        is4Wheeler
          ? "w-20 h-32 m-1" 
          : "w-12 h-8 m-1"   
      } relative transition-all duration-200 hover:opacity-90`}
    >
      <span className={`font-bold ${
        is4Wheeler ? "text-sm" : "text-xs"
      } ${
        isBooked ? "text-white" : "text-gray-800"
      }`}>
        {spot.selectedSpots}
      </span>
      {isBooked && (
        <div className=" flex items-center justify-center">
          <div className="w-full h-0.5 bg-white"></div>
        </div>
      )}
      {is4Wheeler && (
        <div className="absolute bottom-1 w-4/5 h-1 bg-gray-600 rounded-full"></div>
      )}
    </div>
  );
};

export default ParkingLot;