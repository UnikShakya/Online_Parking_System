import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
// import { useParking } from "../Context/ParkingContext";

const ParkingLot = () => {
    const { state } = useLocation();
    const totalCost2Wheeler = state?.totalCost2Wheeler || 0; // Cost for 2-wheeler
    const totalCost4Wheeler = state?.totalCost4Wheeler || 0; // Cost for 4-wheeler

    // const {selectedSpots, setSelectedSpots} = useParking()

    const [selectedSpots, setSelectedSpots] = useState([]);
    const [bookedSpots, setBookedSpots] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    

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
        // Check if the spot is for 2-wheeler or 4-wheeler
        if (spotId.startsWith("A") || spotId.startsWith("B") || spotId.startsWith("C") || spotId.startsWith("D")) {
            return Number(totalCost2Wheeler); // Ensure it's a number
        } else {
            return Number(totalCost4Wheeler); // Ensure it's a number
        }
    };

    // Function to calculate the total price for all selected spots
    const calculateTotalPrice = () => {
        const total = selectedSpots.reduce((total, spotId) => {
            const price = calculatePrice(spotId);
            return total + price;
        }, 0);
        return total;
    };
    

    const handleConfirm = () => {
        console.log("handleConfirm function triggered");


        console.log("Confirmed booking for spot:", selectedSpots);
        setErrorMessage("");
        setShowModal(false);

        setBookedSpots([...bookedSpots, ...selectedSpots]);
        setSelectedSpots([]);
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
                            className={`w-12 h-12 m-1 rounded border ${isSelected ? "bg-yellow-400" : isBooked ? "bg-red-500" : "bg-gray-300 hover:bg-gray-400"
                                } cursor-pointer`}
                            onClick={() => handleSpotClick(spotId)}
                        ></div>
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
                            className={`w-12 h-12 m-1 rounded border ${isSelected ? "bg-yellow-400" : isBooked ? "bg-red-500" : "bg-gray-300 hover:bg-gray-400"
                                } cursor-pointer`}
                            onClick={() => handleSpotClick(spotId)}
                        ></div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="p-5 max-h-screen flex flex-col items-center">
            <h1 className="text-2xl font-bold text-center mb-6">Parking Lots</h1>
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
                    <div className="w-5 h-5 bg-gray-300 border mr-2"></div>
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
                    className="bg-designColor text-white rounded-full px-6 py-2 text-base hover:bg-opacity-70"
                    onClick={handleBookParking}
                >
                    Book Now
                </button>
                {errorMessage && (
                    <p className="mt-3 text-red-500 font-semibold">{errorMessage}</p>
                )}

                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-gray-800 text-white w-3/4 max-w-lg rounded-lg p-6 relative">
                            <button
                                className="absolute top-2 right-3 text-white text-xl font-bold"
                                onClick={() => setShowModal(false)}
                            >
                                ✖
                            </button>
                            <h2 className="text-xl font-bold mb-4 text-center">Selected Parking Lot</h2>
                            <table className="w-full mb-6">
                                <thead>
                                    <tr>
                                        <th className="text-left py-2 px-4 border-b border-gray-600">Parking Lot ID</th>
                                        <th className="text-left py-2 px-4 border-b border-gray-600">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedSpots.map((spot, index) => (
                                        <tr key={index}>
                                            <td className="py-2 px-4 border-b border-gray-600">{spot}</td>
                                            <td className="py-2 px-4 border-b border-gray-600">Rs {calculatePrice(spot)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="mb-4">
                                <span className="text-lg font-bold">Total: Rs {calculateTotalPrice()}</span>
                            </div>
                            <div className="flex justify-center">
                                <Link to="/bookingform">
                                    <button
                                        className="bg-designColor text-white rounded-full px-6 py-2 cursor-pointer hover:bg-opacity-70"
                                        onClick={handleConfirm}
                                    >
                                        Book Now
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ParkingLot;