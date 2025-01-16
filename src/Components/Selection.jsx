import React, { useState } from "react";
import { FaBell } from "react-icons/fa6";

function Selection() {
  const today = new Date().toISOString().split("T")[0]; // Current date in YYYY-MM-DD format
  const [selectedDate, setSelectedDate] = useState("");
  const [error, setError] = useState("");

  // Function to handle date selection
  const handleDateChange = (e) => {
    const selected = e.target.value;
    setSelectedDate(selected);

    // Validate if the selected date is in the past
    if (new Date(selected) < new Date(today)) {
      setError("Cannot select a past date!");
    } else {
      setError("");
    }
  };

  return (
    <div className="flex justify-evenly gap-4 items-center my-4">
      <div className="flex gap-4 items-center">
        <label htmlFor="location" className="text-lg text-gray-600 font-semibold">
          Select location:
        </label>
        <select
          id="location"
          name="location"
          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
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
          min={today} // Disable past dates
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
        />
      </div>

      <button
        className="bg-designColor text-white rounded-full px-6 py-2 text-base hover:bg-opacity-70"
        disabled={!!error} // Disable button if there's an error
      >
        Book Now
      </button>
      <FaBell size={30} className="cursor-pointer" />

      {/* Error Message */}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

export default Selection;
