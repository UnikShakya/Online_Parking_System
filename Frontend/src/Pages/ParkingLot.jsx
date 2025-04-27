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
  const [currentLocation, setCurrentLocation] = useState(locationId || "Location 1");

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
        const bookedSpotNumbers = bookedResponse.data.map(spot => spot.lotNumber);
        setBookedSpots(bookedSpotNumbers);
        
      } catch (err) {
        console.error("Error fetching data:", err);
        setErrorMessage("Failed to fetch parking data.");
      }
    };
  
    fetchData();
  }, [currentLocation]); // Add currentLocation as dependency

  const handleSpotClick = (spot) => {
    console.log('Clicked on lot:', spot.lotNumber, 'Location:', spot.location);

    if (bookedSpots.includes(spot.lotNumber)) return;

    setSelectedSpots(prev =>
      prev.includes(spot.lotNumber)
        ? prev.filter(spotId => spotId !== spot.lotNumber)
        : [...prev, spot.lotNumber]
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
            location: currentLocation
          },
        });
  };

  const renderParkingRows = (type) => {
    return parkingLots
      .filter((spot) => {
        // Filter spots based on the vehicle type (2Wheeler or 4Wheeler)
        if (type === "2Wheeler") {
          return !spot.lotNumber.startsWith("R"); // 2Wheeler: Exclude R-prefixed spots
        } else if (type === "4Wheeler") {
          return spot.lotNumber.startsWith("R"); // 4Wheeler: Only include R-prefixed spots
        }
        return true;
      })
      .map((spot, index) => (
        <ParkingSpot
          key={`${spot.lotNumber}-${index}`}  // Unique key by appending index
          spot={spot}
          selectedSpots={selectedSpots}
          bookedSpots={bookedSpots}
          onClick={handleSpotClick}
        />
      ));
  };

  return (
    <div className="relative p-5 bg-designColor text-textColor max-h-max mt-[5rem] flex flex-col items-center">
      <ConnectedCircles activeStep={activeStep} />

      <h1 className="text-2xl font-bold text-center m-6">Parking Lots - {currentLocation}</h1>

      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4 text-center">2-Wheeler Parking</h3>
          <div className="grid grid-cols-5 gap-2 mt-4">
            {renderParkingRows("2Wheeler")}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4 text-center">4-Wheeler Parking</h3>
          <div className="grid grid-cols-6 gap-2">
            {renderParkingRows("4Wheeler")}
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-6 space-x-6">
        <div className="flex items-center">
          <div className="w-5 h-5 bg-blue-300 border mr-2"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-5 h-5 bg-yellow-400 border mr-2"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center">
          <div className="w-5 h-5 bg-red-500 border mr-2"></div>
          <span>Booked</span>
        </div>
      </div>

      <div className="flex flex-col items-center mt-8">
        <button
          className="bg-gradient-to-r from-gradientStart to-gradientEnd text-white rounded-full px-6 py-2 text-base hover:opacity-80 transition-all duration-300 transform hover:scale-105 shadow-lg"
          onClick={handleBookParking}
        >
          Book Now
        </button>
        {errorMessage && <p className="mt-3 text-red-500 font-semibold">{errorMessage}</p>}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-gray-900 text-white w-11/12 max-w-4xl rounded-xl p-8 relative shadow-2xl">
              <button
                className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-red-400"
                onClick={() => setShowModal(false)}
              >
                ✖
              </button>

              <h2 className="text-3xl font-extrabold mb-6 text-center">
                Confirm Booking - {currentLocation}
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full mb-8 border-separate border-spacing-0">
                  <thead>
                    <tr className="bg-gray-800 rounded-t-lg">
                      <th className="text-left py-3 px-6 font-semibold text-blue-400">Spot</th>
                      <th className="text-left py-3 px-6 font-semibold text-blue-300">From</th>
                      <th className="text-left py-3 px-6 font-semibold text-blue-300">To</th>
                      <th className="text-left py-3 px-6 font-semibold text-blue-300">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSpots.map((spot, index) => (
                      <tr key={index} className="border-b-2 border-gray-600">
                        <td className="py-4 px-6 text-xl">{spot}</td>
                        <td className="py-4 px-6">{startTime}</td>
                        <td className="py-4 px-6">{endTime}</td>
                        <td className="py-4 px-6">
                          {calculatePrice(spot)}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-800">
                      <td className="py-4 px-6 font-semibold text-xl text-right" colSpan="3">
                        <span>Total:</span>
                      </td>
                      <td className="py-4 px-6 font-bold text-xl">
                        {calculateTotalPrice()}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="flex justify-center">
                  <button
                    className="bg-gradient-to-r from-gradientStart to-gradientEnd text-white rounded-full px-6 py-2 text-base hover:opacity-80 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    onClick={handleConfirm}
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ParkingSpot = ({ spot, selectedSpots, bookedSpots, onClick }) => {
  const isSelected = selectedSpots.includes(spot.lotNumber);
  const isBooked = spot.isBooked || bookedSpots.includes(spot.lotNumber);

  return (
    <div
      onClick={() => !isBooked && onClick(spot)}
      className={`w-12 h-12 flex justify-center items-center rounded-md ${
        isBooked 
          ? "bg-red-500 cursor-not-allowed" 
          : isSelected 
            ? "bg-yellow-400 cursor-pointer" 
            : "bg-blue-300 cursor-pointer"
      }`}
    >
      <span className="text-xs">{spot.lotNumber}</span>
    </div>
  );
};

export default ParkingLot;
