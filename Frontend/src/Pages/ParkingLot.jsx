import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const ParkingLot = () => {
    const [selectedSpots, setSelectedSpots] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [showModal, setshowModal] = useState(false);
    const navigate = useNavigate()

    const handleSpotClick = (spotId) => {
        setErrorMessage(""); // Clear error message on spot selection
        if (selectedSpots.includes(spotId)) {
            setSelectedSpots(selectedSpots.filter((spot) => spot !== spotId));
        } else {
            setSelectedSpots([...selectedSpots, spotId]);
        }
    };

    const handleBookNow = () => {
        if (selectedSpots.length === 0) {
            setErrorMessage("Please select a parking lot.");
        } else {
            setErrorMessage(""); // Clear error if spots are selected
            // Proceed with booking logic here
            console.log(`Booked spots: ${selectedSpots.join(", ")}`);
            setshowModal(true);
        }
    };

    const handleConfirm = () => {
      console.log("Confirmed booking for spot:", selectedSpots);
      setshowModal(false);
      setSelectedSpots([]);
      navigate("/booking-ticket", {state: {selectedSpots}})
    }
    

    const renderParkingRow = (numSpots, rowId) => {
        return (
            <div key={rowId} className="flex justify-center mb-4">
                {Array.from({ length: numSpots }).map((_, index) => {
                    const spotId = `${rowId}${index}`;
                    const isSelected = selectedSpots.includes(spotId);
                    return (
                        <div
                            key={spotId}
                            className={`w-12 h-12 m-1 rounded border ${isSelected ? "bg-yellow-400" : "bg-gray-300 hover:bg-gray-400"
                                } cursor-pointer`}
                            onClick={() => handleSpotClick(spotId)}
                        ></div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="p-5 min-h-screen flex flex-col items-center">
            <h1 className="text-2xl font-bold text-center mb-6">Parking Lots</h1>
            {/* Entry Label */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 rotate-90 text-lg font-semibold">
                Entry
            </div>
            {/* Parking Area */}
            <div className="flex w-full max-w-5xl">
                <div className="flex-grow">
                    {/* Row 1 */}
                    {renderParkingRow(20, "A")}
                    {/* Row 2 */}
                    {renderParkingRow(12, "B")}
                    {/* Row 2 Extra */}
                    {renderParkingRow(12, "C")}
                    {/* Row 3 */}
                    {renderParkingRow(20, "D")}
                </div>
                {/* Side parking (right side) */}
                <div className="flex flex-col ml-4 w-20">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div
                            key={`side-${index}`}
                            className="w-12 h-12 m-1 rounded border bg-gray-300 hover:bg-gray-400 cursor-pointer"
                            onClick={() => handleSpotClick(`side-${index}`)}
                        ></div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="flex justify-center mt-6 space-x-6">
                <div className="flex items-center">
                    <div className="w-5 h-5 bg-gray-300 border mr-2"></div>
                    <span>Available</span>
                </div>
                <div className="flex items-center">
                    <div className="w-5 h-5 bg-yellow-400 border mr-2"></div>
                    <span>Selected</span>
                </div>
                <div className="flex items-center">
                    <div className="w-5 h-5 bg-green-400 border mr-2"></div>
                    <span>Reserved</span>
                </div>
                <div className="flex items-center">
                    <div className="w-5 h-5 bg-red-500 border mr-2"></div>
                    <span>Booked</span>
                </div>
            </div>

            {/* Book Now Button */}
            <div className="flex flex-col items-center mt-8">
                <button
                    className="bg-designColor text-white rounded-full px-6 py-2 text-base hover:bg-opacity-70"
                    onClick={handleBookNow}
                >
                    Book Now
                </button>
                {errorMessage && (
                    <p className="mt-4 text-red-500 font-semibold">{errorMessage}</p>
                )}
                {/* Modal */}
                {showModal && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-gray-800 text-white w-3/4 max-w-lg rounded-lg p-6 relative">
            {/* Close Button */}
            <button
                className="absolute top-2 right-3 text-white text-xl font-bold"
                onClick={() => setshowModal(false)}
            >
                ✖
            </button>
            
            <h2 className="text-xl font-bold mb-4 text-center">Selected Parking Lot</h2>
            <table className="w-full mb-6">
                <thead>
                    <tr>
                        <th className="text-left py-2 px-4 border-b border-gray-600">Parking Lot ID</th>
                        <th className="text-left py-2 px-4 border-b border-gray-600">Number of Spaces</th>
                        <th className="text-left py-2 px-4 border-b border-gray-600">Price</th>
                    </tr>
                </thead>
                <tbody>
                    {selectedSpots.map((spot, index) => (
                        <tr key={index}>
                            <td className="py-2 px-4 border-b border-gray-600">{spot}</td>
                            <td className="py-2 px-4 border-b border-gray-600">1</td>
                            <td className="py-2 px-4 border-b border-gray-600">Rs 25</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold">Total: Rs {selectedSpots.length * 25}</span>
            </div>
            <div className="flex justify-center">
                <button
                    className="bg-designColor text-white rounded-full px-6 py-2 hover:bg-opacity-70"
                    onClick={handleConfirm}
                >
       Book Now  
                </button>
            </div>
        </div>
    </div>
)}

            </div>
        </div>
    );
};
export default ParkingLot;
