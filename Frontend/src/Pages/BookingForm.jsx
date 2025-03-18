import React, { useState } from "react";
// import cash from "../assets/cash.png";
// import khalti from "../assets/khalti.png";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ConnectedCircles from "../Components/Stepper";


const BookingForm = ({ onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        name: "",
        vehicleNumber: "",
        phoneNumber: "",
        paymentMethod: "",
        vehicleType: "",
    });
    const [errorMessage, setErrorMessage] = useState("");

    const { state } = useLocation();

    const totalCost4Wheeler = state?.totalCost4Wheeler || "";
    const startTime = state?.startTime || "11:00"; // Start time from Selection (already formatted)
    const endTime = state?.endTime || "12:00"; // End time from Selection (already formatted)
    const selectedSpots = state?.selectedSpots || ["A0"]; // Ensure this is an array
    const totalCost2Wheeler = state?.totalCost2Wheeler || "Rs 25";

    const navigate = useNavigate();
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (
            !formData.name.trim() ||
            !formData.vehicleNumber.trim() ||
            !formData.phoneNumber.trim() ||
            !formData.paymentMethod
            // !formData.vehicleType
        ) {
            setErrorMessage("Please fill in all required fields.");
            console.log("Error: Missing form data");
            return;
        }

        setErrorMessage("");
        console.log("Form submitted with data:", formData);

        try {
            const response = await axios.post("http://localhost:4000/api/booking", formData);

            if (response.status === 201) {
                console.log("Booking saved:", response && response.data);
                onSubmit(formData);
                // alert("Form has been submitted");
                navigate("/booking-ticket", {
                    state: {
                        name: formData.name,
                        vehicleNumber: formData.vehicleNumber,
                    },
                });
            }
        } catch (error) {
            console.error("Error saving booking:", error);

            if (error.response) {
                console.error("Response Data:", error.response.data);
                console.error("Response Status:", error.response.status);
                console.error("Response Headers:", error.response.headers);
            } else if (error.request) {
                console.error("Request Data:", error.request);
            } else {
                console.error("Error Message:", error.message);
            }

            setErrorMessage("Failed to save booking. Please try again.");
        }
    };

    return (
        <div className="p-5 bg-designColor text-textColor max-h-max mt-[5rem] flex flex-col items-center">
            <ConnectedCircles />
            <div className=" w-full max-w-6xl flex flex-col justify-center items-center p-4 my-5">        
                <div className="flex flex-col md:flex-row justify-between w-full max-w-7xl bg-white p-6 rounded-lg shadow-md border border-gray-300">
                {/* Left Column - Booking Date */}
                <div className="w-full md:w-1/3 flex flex-col gap-4 border border-black p-4 relative">
                    <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">Booking Date</h2>

                    {/* Start Time Section */}
                    <div className="flex flex-col items-center bg-bodyColor py-3 mb-4 relative">
                        <div className="text-white px-3 py-1 rounded mr-2">Start Time</div>
                        <div className="text-lg text-text font-bold">{startTime}</div>

                        {/* Vertical Line */}
                        <div
                            className="absolute w-px h-12 bg-black left-1/2 transform -translate-x-1/2 top-full"
                        ></div>
                    </div>

                    {/* End Time Section */}
                    <div className="flex flex-col border-2 border-black items-center mt-4">
                        <div className="text-bodyColor px-3 py-3 rounded mr-2">End Time</div>
                        <div className="text-lg text-bodyColor font-bold">{endTime}</div>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-xl text-bodyColor font-bold mb-2">Order Summary</h3>
                        <div className="flex justify-between text-gray-600 mb-2">
                            <span>{selectedSpots}</span>
                            <span>Rs 25</span>
                        </div>
                        {/* Small Horizontal Line at Right */}
                        <div className="flex justify-end">
                            <div className="w-16 border-t-2 border-gray-300 my-2"></div>
                        </div>
                        <div className="flex justify-between font-bold text-bodyColor">
                            <span>Total :</span>
                            <span>{totalCost2Wheeler + totalCost4Wheeler}</span>
                        </div>
                    </div>
                </div>

                {/* Right Column - Customer Details */}
                <div className="md:w-2/3  p-4">
                    <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">Customer Details</h2>
                    <form onSubmit={handleFormSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full text-bodyColor px-3 py-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Vehicle number:</label>
                            <input
                                type="text"
                                name="vehicleNumber"
                                value={formData.vehicleNumber}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border text-bodyColor border-gray-300 rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Phone number:</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                className="w-full text-bodyColor px-3 py-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <style>
                                {`
      .custom-radio:checked::after {
        content: "✔";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: black;
        font-size: 12px;
      }
    `}
                            </style>
                            <label className="block text-gray-700 font-bold mb-2">Payment Method:</label>
                            <div className="flex flex-col">
                                {/* Cash Option */}
                                <label className="inline-flex items-center mb-2">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cash"
                                        checked={formData.paymentMethod === "cash"}
                                        onChange={handleInputChange}
                                        className="form-radio appearance-none w-5 h-5 border-2 border-gray-400 rounded-md checked:border-black focus:outline-none transition-colors relative custom-radio"
                                    />
                                    <span className="ml-2 text-gray-700">Cash</span>
                                </label>

                                {/* Khalti Option */}
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="khalti"
                                        checked={formData.paymentMethod === "khalti"}
                                        onChange={handleInputChange}
                                        className="form-radio appearance-none w-5 h-5 border-2 border-gray-400 rounded-md checked:border-black focus:outline-none transition-colors relative custom-radio"
                                    />
                                    <span className="ml-2 text-gray-700">Khalti</span>
                                </label>
                            </div>
                        </div>
                        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
                        {/* <button
                            type="submit" className="bg-gradient-to-r from-gradientStart to-gradientEnd text-white px-6 py-2 rounded-full hover:bg-green-400 transition-colors mt-4"
                        >
                            Submit
                        </button> */}
                    </form>
                </div>
            </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between w-full max-w-7xl">
                <Link to="/parking-lot">
                <button
                    onClick={onClose}
                    className="bg-gradient-to-r from-gradientStart to-gradientEnd text-white px-6 py-2 rounded-full hover:opacity-80 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                    ← Back
                </button>
                </Link>

                <Link to="/booking-ticket">
                    <button
                        onClick={handleFormSubmit}
                        className="bg-gradient-to-r from-gradientStart to-gradientEnd text-white px-6 py-2 rounded-full hover:opacity-80 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                        Next →
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default BookingForm;