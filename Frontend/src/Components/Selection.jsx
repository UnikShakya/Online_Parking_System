import React, { useState } from "react";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Selection() {
  const today = new Date().toISOString().split("T")[0]; // Current date in YYYY-MM-DD format
  const [selectedDate, setSelectedDate] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState("");
  const [timeError, setTimeError] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const navigate = useNavigate(); // Hook for navigation

  // Rates for 2-wheelers and 4-wheelers per hour
  const rates = {
    "2Wheeler": {
      peakRate: 20, // Peak rate for 2-wheeler (10 AM - 5 PM)
      offPeakRate: 25, // Off-peak rate for 2-wheeler (before 10 AM, after 5 PM)
    },
    "4Wheeler": {
      peakRate: 40, // Peak rate for 4-wheeler (10 AM - 5 PM)
      offPeakRate: 45, // Off-peak rate for 4-wheeler (before 10 AM, after 5 PM)
    },
  };

  const handleDateChange = (e) => {
    const selected = e.target.value;
    setSelectedDate(selected);
    if (new Date(selected) < new Date(today)) {
      setError("Cannot select a past date!");
    } else {
      setError("");
    }
  };

  const handleTimeChange = (e) => {
    setEndTime(e.target.value);
    if (startTime && e.target.value <= startTime) {
      setTimeError("End time must be later than start time!");
    } else {
      setTimeError("");
    }
  };

  const handleBooking = () => {
    setFormSubmitted(true);

    if (!isFormValid) {
      console.log("Please fill in all fields!");
      return;
    }

    if (endTime <= startTime) {
      setTimeError("End time must be later than start time!");
      return;
    }

    // Convert time strings (HH:MM) to minutes since midnight
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);

    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;

    // Get the correct rate based on vehicle type and time
    let totalCost2Wheeler = 0;
    let totalCost4Wheeler = 0;

    const calculateCost = (vehicleType, startTotalMinutes, endTotalMinutes) => {
      const currentHour = new Date().getHours();
      const isPeak = currentHour >= 10 && currentHour < 17;

      let vehicleRate = 0;

      // Select rate based on vehicle type
      if (vehicleType === "2Wheeler") {
        const { peakRate, offPeakRate } = rates["2Wheeler"];
        vehicleRate = isPeak ? peakRate : offPeakRate;
      } else if (vehicleType === "4Wheeler") {
        const { peakRate, offPeakRate } = rates["4Wheeler"];
        vehicleRate = isPeak ? peakRate : offPeakRate;
      }

      let currentTime = startTotalMinutes;
      let totalCost = 0;

      while (currentTime < endTotalMinutes) {
        let currentHour = Math.floor(currentTime / 60); // Extract the current hour

        // Determine if the current hour falls in peak or off-peak period
        let rate = isPeak ? vehicleRate : vehicleRate; // Just using the correct rate here

        // Find the next full hour or the end time (whichever is smaller)
        let nextHourStart = (currentHour + 1) * 60;
        let chargeableMinutes = Math.min(nextHourStart, endTotalMinutes) - currentTime;

        // Calculate cost for the chargeable minutes
        totalCost += (vehicleRate / 60) * chargeableMinutes;

        // Move to the next hour
        currentTime = nextHourStart;
      }

      return totalCost.toFixed(2); // Round to 2 decimal places
    };

    totalCost2Wheeler = calculateCost("2Wheeler", startTotalMinutes, endTotalMinutes);
    totalCost4Wheeler = calculateCost("4Wheeler", startTotalMinutes, endTotalMinutes);

    console.log(`Total cost for 2-wheeler: Rs.${totalCost2Wheeler}`);
    console.log(`Total cost for 4-wheeler: Rs.${totalCost4Wheeler}`);

    navigate("/parking-lot", {
      state: { totalCost2Wheeler, totalCost4Wheeler, rates }
    });
  };

  const toggleNotification = () => {
    setShowNotification(!showNotification);
  };

  const isFormValid = location && selectedDate && startTime && endTime && !timeError;

  return (
    <section className="my-4">
      <div className="flex justify-evenly gap-4 items-center">
        <div className="flex gap-4 items-center">
          <label htmlFor="location" className="text-lg text-gray-600 font-semibold">
            Select Area:
          </label>
          <select
            id="location"
            name="location"
            className="px-2 py-2 bg-gray-100 text-gray-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">-- Select --</option>
            <option value="Lagankhel">Parking area 1</option>
            <option value="Sundhara">Parking area 2</option>
            <option value="Naxal">Parking area 3</option>
            <option value="Satdobato">Parking area 4</option>
          </select>
        </div>

        <div className="flex gap-4 items-center">
          <label htmlFor="date" className="text-lg text-gray-600 font-semibold">
            Select Date:
          </label>
          <input
            type="date"
            id="date"
            name="date"
            min={today}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-designColor"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </div>

        <div className="flex gap-4 items-center">
          <label htmlFor="start-time" className="text-lg text-gray-600 font-semibold">
            Start time:
          </label>
          <input
            type="time"
            id="start-time"
            name="start-time"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        <div className="flex gap-4 items-center">
          <label htmlFor="end-time" className="text-lg text-gray-600 font-semibold">
            End time:
          </label>
          <div>
            <input
              type="time"
              id="end-time"
              name="end-time"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={endTime}
              onChange={handleTimeChange}
            />
            {timeError && <p className="text-red-500 text-sm mt-1">{timeError}</p>}
          </div>
        </div>

        <button
          className="bg-designColor text-white rounded-full px-6 py-2 text-base hover:bg-opacity-70"
          onClick={handleBooking}
        >
          Book Now
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <FaBell size={30} className="cursor-pointer" onClick={toggleNotification} />
          {showNotification && (
            <div className="absolute right-0 top-8 w-96 bg-white shadow-lg border rounded-md z-10">
              <div className="px-4 py-2 bg-gray-100 border flex justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                <h3 className="text-base text-gray-800 cursor-pointer">Mark all as read</h3>
              </div>
              <ul>
                <li className="px-4 py-2 border-b text-gray-700 hover:bg-gray-100 cursor-pointer">
                  Notification 1
                </li>
                <li className="px-4 py-2 border-b text-gray-700 hover:bg-gray-100 cursor-pointer">
                  Notification 2
                </li>
                <li className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                  Notification 3
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {formSubmitted && !isFormValid && (
        <div className="mt-2 text-center">
          <p className="text-red-500">Please fill in all fields!</p>
        </div>
      )}
    </section>
  );
}

export default Selection;
