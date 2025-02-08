import React, { useState } from "react";
import { FaBell } from "react-icons/fa6";
import { Link } from "react-router-dom";

function Selection() {
  const today = new Date().toISOString().split("T")[0]; // Current date in YYYY-MM-DD format
  const [selectedDate, setSelectedDate] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const handleDateChange = (e) => {
    const selected = e.target.value;
    setSelectedDate(selected);
    if (new Date(selected) < new Date(today)) {
      setError("Cannot select a past date!");
    } else {
      setError("");
    }
  };

  const handleBooking = () => {
    setFormSubmitted(true);
    if (!isFormValid) {
      console.log("Please fill in all fields!");
    } else {
      console.log("Booking has been confirmed");
    }
  };

  const toggleNotification = () => {
    setShowNotification(!showNotification);
  };

  const isFormValid = location && selectedDate && startTime && endTime;

  return (
    <section className="my-4">
      <div className="flex justify-evenly gap-4 items-center">
        <div className="flex gap-4 items-center">
          <label htmlFor="location" className="text-lg text-gray-600 font-semibold">
            Select location:
          </label>
          <select
            id="location"
            name="location"
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">-- Select --</option>
            <option value="Lagankhel">Lagankhel</option>
            <option value="Sundhara">Sundhara</option>
            <option value="Naxal">Naxal</option>
            <option value="Satdobato">Satdobato</option>
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
          <input
            type="time"
            id="end-time"
            name="end-time"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>

        <button
          className="bg-designColor text-white rounded-full px-6 py-2 text-base hover:bg-opacity-70"
          onClick={handleBooking}
        >
          <Link to={isFormValid ? "/parking-lot" : "#"}>Book Now</Link>
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
