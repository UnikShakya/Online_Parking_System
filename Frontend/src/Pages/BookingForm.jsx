import React, { useState } from "react";
import cash from "../assets/cash.png";
import khalti from "../assets/khalti.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BookingForm = ({ onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        name: "",
        vehicleNumber: "",
        phoneNumber: "",
        paymentMethod: "",
        vehicleType: "",
    });
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate()
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
        console.log("Form submitted with data:", formData);  // Debugging the form data
    
        try {
            const response = await axios.post("http://localhost:4000/api/booking", formData);
            
            if (response.status === 201) {
                console.log("Booking saved:", response && response.data);
                onSubmit(formData);
                alert("Form has been submitted")
                navigate("/booking-ticket", {
                    state:{name:formData.name,
                        vehicleNumber:formData.vehicleNumber
                    }
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-gray-800 text-white w-3/4 max-w-lg rounded-lg p-6 relative">
                <button
                    className="absolute top-2 right-3 text-white text-xl font-bold"
                    onClick={onClose} // Close the modal
                >
                    ✖
                </button>

                <h2 className="text-xl font-bold mb-4 text-center">Please Fill Your Details</h2>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-2">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded bg-gray-700 text-white"
                            aria-label="Enter your name"
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Vehicle Number</label>
                        <input
                            type="text"
                            name="vehicleNumber"
                            value={formData.vehicleNumber}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded bg-gray-700 text-white"
                            aria-label="Enter vehicle number"
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Phone Number</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded bg-gray-700 text-white"
                            aria-label="Enter phone number"
                        />
                    </div>
                    {/* <div>
                        <label className="block mb-2 py-2">Vehicle Type</label>
                        <select
                            name="vehicleType"
                            value={formData.vehicleType}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded bg-gray-700 text-white"
                        >
                            <option value="">Select Vehicle Type</option>
                            <option value="2-wheeler">2 Wheeler</option>
                            <option value="4-wheeler">4 Wheeler</option>
                        </select>
                    </div> */}
                    <div>
                        <label className="block mb-2 py-2">Payment Method</label>
                        <div className="flex space-x-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="cash"
                                    checked={formData.paymentMethod === "cash"}
                                    onChange={handleInputChange}
                                    className="mr-2"
                                />
                                <img src={cash} className="bg-transparent" alt="Cash payment method" width="40px" height="auto" />
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="digital"
                                    checked={formData.paymentMethod === "digital"}
                                    onChange={handleInputChange}
                                    className="mr-2"
                                />
                                <img src={khalti} alt="Digital payment method" width="40px" height="auto"/>
                            </label>
                        </div>
                    </div>
                    <div className="flex justify-center items-center">
                        <button
                            type="submit"
                            className="bg-designColor text-white rounded-full px-6 py-2 mt-4  hover:bg-opacity-70"
                        >
                            Submit
                        </button>
                    </div>

                    {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

                </form>
            </div>
        </div>
    );
};

export default BookingForm;
