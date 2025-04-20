  import React, { useState } from "react";
  import {  useLocation, useNavigate } from "react-router-dom";
  import ConnectedCircles from "../Components/Stepper";

  const ParkingLot = ({discountRate}) => {
    const { state } = useLocation();
    const totalCost2Wheeler = state?.totalCost2Wheeler || 0;
    const totalCost4Wheeler = state?.totalCost4Wheeler || 0;
    const startTime = state?.startTime || "";
    const endTime = state?.endTime || "";
    const isPeak = state?.isPeak || false;
    const rates = state?.rates || {
      "2Wheeler": { offPeakRate: 20 }, // Default values if not passed
      "4Wheeler": { offPeakRate: 40 }
    };
    const [selectedSpots, setSelectedSpots] = useState([]);
    const [bookedSpots, setBookedSpots] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [activeStep, setActiveStep] = useState(1);

    const navigate = useNavigate();

    const handleSpotClick = (spotId) => {
      setErrorMessage("");
      if (bookedSpots.includes(spotId)) return;
      setSelectedSpots((prev) =>
        prev.includes(spotId) ? prev.filter((spot) => spot !== spotId) : [...prev, spotId]
      );
    };

    const handleBookParking = () => {
      if (selectedSpots.length === 0) {
        setErrorMessage("Please select a parking lot.");
      } else {
        setErrorMessage("");
        setShowModal(true);
      }
    };
    
    const calculatePrice = (spotId) => {
      if (spotId.startsWith("A") || spotId.startsWith("B") || spotId.startsWith("C") || spotId.startsWith("D")) {
        return Number(totalCost2Wheeler);
      } else {
        return Number(totalCost4Wheeler);
      }
    };
    

    const calculateTotalPrice = () => {
      const total = selectedSpots.reduce((total, spotId) => {
        const price = calculatePrice(spotId);
        return total + price;
      }, 0);
      return total;
    };

    const handleConfirm = () => {
      console.log("Confirmed booking for spot:", selectedSpots);
      setErrorMessage("");
      setShowModal(false);
      setBookedSpots([...bookedSpots, ...selectedSpots]);
      setSelectedSpots([]);
      setActiveStep(2);

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

    const render2WheelerParkingRow = (numSpots, rowId) => {
      return (
        <div key={rowId} className="flex justify-center mb-4">
          {Array.from({ length: numSpots }).map((_, index) => {
            const spotId = `${rowId}${index}`;
            const isSelected = selectedSpots.includes(spotId);
            const isBooked = bookedSpots.includes(spotId);
            return (
              <div
                key={spotId}
                className={`w-12 h-12 m-1 rounded border flex items-center justify-center
                  ${isSelected ? "bg-yellow-400" : isBooked ? "bg-red-500" : "bg-blue-300 hover:bg-blue-400"}
                  cursor-pointer transition-colors duration-200`}
                onClick={() => handleSpotClick(spotId)}
              >
                <span className="text-xs font-bold">{spotId}</span>
              </div>
            );
          })}
        </div>
      );
    };

    const render4WheelerParkingRow = (numSpots, rowId) => {
      return (
        <div key={rowId} className="flex justify-center mb-4">
          {Array.from({ length: numSpots }).map((_, index) => {
            const spotId = `${rowId}${index}`;
            const isSelected = selectedSpots.includes(spotId);
            const isBooked = bookedSpots.includes(spotId);
            return (
              <div
                key={spotId}
                className={`w-12 h-12 m-1 rounded border flex items-center justify-center
                  ${isSelected ? "bg-yellow-400" : isBooked ? "bg-red-500" : "bg-green-300 hover:bg-green-400"}
                  cursor-pointer transition-colors duration-200`}
                onClick={() => handleSpotClick(spotId)}
              >
                <span className="text-xs font-bold">{spotId}</span>
              </div>
            );
          })}
        </div>
      );
    };

    return (
      <div className="relative p-5 bg-designColor text-textColor max-h-max mt-[5rem] flex flex-col items-center">
        <ConnectedCircles activeStep={activeStep} />

        <h1 className="text-2xl font-bold text-center m-6">Parking Lots</h1>
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 rotate-90 text-lg font-semibold">
          Entry
        </div>
        <div className="flex w-full max-w-5xl">
          <div className="flex-grow ml-[-80px] mr-[80px]">
            {render2WheelerParkingRow(20, "A")}
            <div className="h-6"></div>
            {render2WheelerParkingRow(20, "B")}
            {render2WheelerParkingRow(20, "C")}
            <div className="h-6"></div>
            {render2WheelerParkingRow(20, "D")}
            <div className="text-center mt-2 font-semibold">2-Wheeler Parking</div>
          </div>
          <div className="flex flex-col ml-4 w-20">
            <div className="-mb-4">{render4WheelerParkingRow(1, "R1")}</div>
            <div className="-mb-4">{render4WheelerParkingRow(1, "R2")}</div>
            <div className="-mb-4">{render4WheelerParkingRow(1, "R3")}</div>
            <div className="-mb-4">{render4WheelerParkingRow(1, "R4")}</div>
            <div className="-mb-4">{render4WheelerParkingRow(1, "R5")}</div>
            <div className="-mb-4">{render4WheelerParkingRow(1, "R6")}</div>
            <div className="text-center mt-2 font-semibold">4-Wheeler Parking</div>
          </div>
        </div>

        <div className="flex justify-center mt-6 space-x-6">
          <div className="flex items-center">
            <div className="w-5 h-5 bg-blue-300 border mr-2"></div>
            <span>2-Wheeler Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 bg-green-300 border mr-2"></div>
            <span>4-Wheeler Available</span>
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
          {errorMessage && (
            <p className="mt-3 text-red-500 font-semibold">{errorMessage}</p>
          )}
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
      </div>
    );
  };

  export default ParkingLot;