import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ConnectedCircles from "../Components/Stepper";
import { toast } from "react-toastify";

const BookingForm = ({ onSubmit }) => {
  // State management
  const [formData, setFormData] = useState({
    name: "",
    vehicleNumber: "",
    phoneNumber: "",
    paymentMethod: "",
    vehicleType: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [khaltiLoaded, setKhaltiLoaded] = useState(false);

  // Get data from navigation state
  const { state } = useLocation();
  const totalCost4Wheeler = Number(state?.totalCost4Wheeler) || 0;
  const totalCost2Wheeler = Number(state?.totalCost2Wheeler) || 0;
  const startTime = state?.startTime || "11:00";
  const endTime = state?.endTime || "12:00";
  const selectedSpots = Array.isArray(state?.selectedSpots) ? state.selectedSpots : ["A1"];
  const currentLocation = state?.location || "Location 1";
  const selectedDate = state?.selectedDate || ""; // Fallback to empty string
  const navigate = useNavigate();

  // Check if Khalti script is loaded
  useEffect(() => {
    const checkKhalti = () => {
      if (window.KhaltiCheckout) {
        setKhaltiLoaded(true);
      } else {
        setTimeout(checkKhalti, 500);
      }
    };
    checkKhalti();
  }, []);

  // Price calculations
  const calculatePrice = (spotId) => {
    const twoWheelerRows = ["A", "B", "C", "D"];
    return twoWheelerRows.includes(spotId.charAt(0)) ? totalCost2Wheeler : totalCost4Wheeler;
  };

  const calculateTotalPrice = () => selectedSpots.reduce((sum, spot) => sum + calculatePrice(spot), 0);

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate form data
  const validateFormData = () => {
    const { name, vehicleNumber, phoneNumber, paymentMethod } = formData;

    if (!name.trim() || !vehicleNumber.trim() || !phoneNumber.trim() || !paymentMethod) {
      return "Please fill in all required fields.";
    }
    if (/^\s*$/.test(name)) return "Name cannot contain only spaces.";
    if (/^\d+$/.test(name)) return "Name cannot contain only numbers.";
    if (/^\s*$/.test(vehicleNumber)) return "Vehicle number cannot contain only spaces.";
    if (!/^[a-zA-Z0-9]+$/.test(vehicleNumber)) return "Vehicle number should only contain letters and numbers.";
    if (!/^\d{10}$/.test(phoneNumber)) return "Phone number should be exactly 10 digits.";
    if (!selectedDate) return "Please select a valid date.";
    if (paymentMethod === "khalti" && !khaltiLoaded) return "Payment system is loading. Please try again in a moment.";
    return "";
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const validationError = validateFormData();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleBack = () => {
    navigate("/parking-lot", {
      state: {
        selectedSpots,
        startTime,
        endTime,
        totalCost2Wheeler,
        totalCost4Wheeler,
        selectedDate,
      },
    });
  };

  // Payment handlers
  const handleConfirmYes = async () => {
    setShowConfirmDialog(false);
    setIsProcessingPayment(true);
    setErrorMessage("");

    try {
      if (formData.paymentMethod === "khalti") {
        await handleKhaltiPayment();
      } else {
        await handleCashPayment();
      }
    } catch (error) {
      console.error("Payment error:", error);
      setErrorMessage(error.message || "Payment processing failed");
      toast.error(error.message || "Payment processing failed");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleKhaltiPayment = async () => {
    return new Promise((resolve, reject) => {
      const amountPaisa = calculateTotalPrice() * 100;

      const config = {
        publicKey: "19c1199a4e9146a492cb21d6c7c96c15",
        productIdentity: `parking_${Date.now()}`,
        productName: "Parking Booking",
        productUrl: window.location.href,
        amount: amountPaisa,
        eventHandler: {
          onSuccess: async (payload) => {
            try {
              const verifyResponse = await axios.post(
                "http://localhost:3000/api/verify-khalti-payment",
                {
                  token: payload.token,
                  amount: calculateTotalPrice(),
                }
              );

              if (!verifyResponse.data.success) {
                throw new Error(verifyResponse.data.error || "Payment verification failed");
              }

              await saveBooking({
                ...formData,
                paymentVerified: true,
                paymentToken: payload.token,
                pidx: payload.idx,
              });

              toast.success("Payment successful! Booking confirmed.");
              navigateToSuccessPage();
              resolve();
            } catch (error) {
              toast.error(error.message || "Payment verification failed");
              reject(error);
            }
          },
          onError: (error) => {
            toast.error(error.message || "Payment failed");
            reject(new Error(error.message || "Payment failed"));
          },
          onClose: () => {
            reject(new Error("Payment cancelled by user"));
          },
        },
      };

      const checkout = new window.KhaltiCheckout(config);
      checkout.show({ amount: amountPaisa });
    });
  };

  const saveBooking = async (bookingData) => {
    const token = localStorage.getItem("token");

    // Format selectedDate to YYYY-MM-DD
    let formattedDate;
    if (selectedDate) {
      try {
        const dateObj = new Date(selectedDate);
        if (!isNaN(dateObj.getTime())) {
          formattedDate = dateObj.toISOString().split("T")[0]; // Converts to YYYY-MM-DD
        } else {
          throw new Error("Invalid date format in selectedDate");
        }
      } catch (err) {
        console.error("Date formatting error:", err);
        throw new Error("Please provide a valid date");
      }
    } else {
      throw new Error("Selected date is missing");
    }

    const payload = {
      ...bookingData,
      location: currentLocation,
      selectedSpots,
      startTime,
      endTime,
      date: formattedDate, // Use formatted date
      totalCost: calculateTotalPrice(),
      vehicleType:
        bookingData.vehicleType ||
        (selectedSpots[0]?.charAt(0) === "R" ? "4-wheeler" : "2-wheeler"),
    };

    console.log("Booking payload:", payload); // Debug payload

    try {
      const res = await axios.post("http://localhost:3000/api/parking/book", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      console.error("Error saving booking:", {
        status: error.response?.status,
        data: error.response?.data,
      });
      throw new Error(error.response?.data?.message || "Booking failed");
    }
  };

  const handleCashPayment = async () => {
    try {
      await saveBooking({
        ...formData,
        paymentVerified: true,
      });
      toast.success("Booking created successfully!");
      navigateToSuccessPage();
    } catch (error) {
      console.error("Cash payment processing error:", error);
      toast.error(error.message || "Failed to process cash payment");
      setErrorMessage(error.message);
    }
  };

  const navigateToSuccessPage = () => {
    navigate("/booking-ticket", {
      state: {
        name: formData.name,
        vehicleNumber: formData.vehicleNumber,
        selectedSpots,
        selectedDate,
        startTime,
        endTime,
        totalAmount: calculateTotalPrice(),
        paymentMethod: formData.paymentMethod,
      },
    });
  };

  const handleConfirmNo = () => {
    setShowConfirmDialog(false);
  };

  return (
    <div className="p-5 bg-designColor text-textColor max-h-max flex flex-col items-center">
      <ConnectedCircles />
      <div className="w-full max-w-6xl flex flex-col justify-center items-center p-4 my-5">
        <div className="flex flex-col md:flex-row justify-between w-full max-w-7xl bg-white p-6 rounded-lg shadow-md border border-gray-300">
          {/* Left Column - Booking Date */}
          <div className="w-full md:w-1/3 flex flex-col gap-4 border border-black p-4 relative">
            <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">Booking Date</h2>
            <div className="flex flex-col items-center bg-bodyColor py-3 mb-4 relative">
              <div className="text-white px-3 py-1 rounded mr-2">Start Time</div>
              <div className="text-lg text-text font-bold">{startTime}</div>
              <div className="absolute w-px h-12 bg-black left-1/2 transform -translate-x-1/2 top-full"></div>
            </div>
            <div className="flex flex-col border-2 border-black items-center mt-4">
              <div className="text-bodyColor px-3 py-3 rounded mr-2">End Time</div>
              <div className="text-lg text-bodyColor font-bold">{endTime}</div>
            </div>
            <h3 className="text-xl text-black font-bold mt-4">Order Summary</h3>
            <div className="text-black">
              {selectedSpots.map((spot, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{spot}</span>
                  <span>Rs {calculatePrice(spot)}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 border-t pt-2 font-bold text-black flex justify-between">
              <span>Total:</span>
              <span>Rs {calculateTotalPrice()}</span>
            </div>
          </div>

          {/* Right Column - Customer Details */}
          <div className="md:w-2/3 p-4">
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
                  required
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
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Phone number:</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full text-bodyColor px-3 py-2 border border-gray-300 rounded"
                  pattern="[0-9]{10}"
                  required
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
                  <label className="inline-flex items-center mb-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === "cash"}
                      onChange={handleInputChange}
                      className="form-radio appearance-none w-5 h-5 border-2 border-gray-400 rounded-md checked:border-black focus:outline-none transition-colors relative custom-radio"
                      required
                    />
                    <span className="ml-2 text-gray-700">Cash</span>
                  </label>
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
                    {!khaltiLoaded && formData.paymentMethod === "khalti" && (
                      <span className="ml-2 text-yellow-600 text-sm">(Loading payment system...)</span>
                    )}
                  </label>
                </div>
              </div>
              {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
            </form>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between w-full max-w-7xl">
        <button
          onClick={handleBack}
          className="bg-gradient-to-r from-gradientStart to-gradientEnd text-white px-6 py-2 rounded-full hover:opacity-80 transition-all duration-300 transform hover:scale-105 shadow-lg"
          disabled={isProcessingPayment}
        >
          ← Back
        </button>

        <button
          onClick={handleFormSubmit}
          className="bg-gradient-to-r from-gradientStart to-gradientEnd text-white px-6 py-2 rounded-full hover:opacity-80 transition-all duration-300 transform hover:scale-105 shadow-lg"
          disabled={isProcessingPayment}
        >
          {isProcessingPayment ? "Processing..." : "Next →"}
        </button>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-designColor rounded-lg p-6 w-96 shadow-lg">
            <h3 className="text-lg font-bold text-white mb-4">Confirm Booking</h3>
            <p className="text-white mb-6">
              {formData.paymentMethod === "khalti"
                ? "You will be redirected to Khalti payment. Are you sure?"
                : "Are you sure you want to confirm this booking?"}
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleConfirmNo}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                disabled={isProcessingPayment}
              >
                No
              </button>
              <button
                onClick={handleConfirmYes}
                className="bg-gradient-to-r from-gradientStart to-gradientEnd text-white px-4 py-2 rounded hover:opacity-80 transition-opacity"
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? "Processing..." : "Yes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingForm;