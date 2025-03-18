import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import "dayjs/locale/en"; // Optional: For English locale formatting

function Selection({setShowLogin}) {
  const today = dayjs(); // Current date as a Dayjs object
  const [selectedDate, setSelectedDate] = useState(null); // Dayjs object or null
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState(null); // Dayjs object or null
  const [endTime, setEndTime] = useState(null); // Dayjs object or null
  const [error, setError] = useState("");
  const [timeError, setTimeError] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  const navigate = useNavigate();

  // Rates for 2-wheelers and 4-wheelers per hour
  const rates = {
    "2Wheeler": {
      peakRate: 20,
      offPeakRate: 25,
    },
    "4Wheeler": {
      peakRate: 40,
      offPeakRate: 45,
    },
  };

  const handleDateChange = (newValue) => {
    setSelectedDate(newValue);
    if (newValue && newValue.isBefore(today, "day")) {
      setError("Cannot select a past date!");
    } else {
      setError("");
    }
  };

  const handleStartTimeChange = (newValue) => {
    setStartTime(newValue); // newValue is a Dayjs object or null
    if (newValue && endTime && newValue.isAfter(endTime)) {
      setTimeError("Start time must be earlier than end time!");
    } else {
      setTimeError("");
    }
  };

  const handleEndTimeChange = (newValue) => {
    setEndTime(newValue); // newValue is a Dayjs object or null
    if (startTime && newValue && newValue.isBefore(startTime)) {
      setTimeError("End time must be later than start time!");
    } else {
      setTimeError("");
    }
  };

  const handleBooking = () => {
    // Check if the user is logged in
    if (!localStorage.getItem("token")) {
      // alert("Please log in to book a parking spot.");
      setShowLogin(true); // Show the login popup
      return;
    }

    setFormSubmitted(true);

    if (!isFormValid()) {
      console.log("Please fill in all fields!");
      return;
    }

    if (endTime.isBefore(startTime)) {
      setTimeError("End time must be later than start time!");
      return;
    }

    // Convert Dayjs times to minutes since midnight
    const startTotalMinutes = startTime.hour() * 60 + startTime.minute();
    const endTotalMinutes = endTime.hour() * 60 + endTime.minute();

    // Get the correct rate based on vehicle type and time
    let totalCost2Wheeler = 0;
    let totalCost4Wheeler = 0;

    const calculateCost = (vehicleType, startTotalMinutes, endTotalMinutes) => {
      const currentHour = new Date().getHours();
      const isPeak = currentHour >= 10 && currentHour < 17;

      let vehicleRate = 0;

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
        let currentHour = Math.floor(currentTime / 60);
        let rate = isPeak ? vehicleRate : vehicleRate;

        let nextHourStart = (currentHour + 1) * 60;
        let chargeableMinutes = Math.min(nextHourStart, endTotalMinutes) - currentTime;

        totalCost += (vehicleRate / 60) * chargeableMinutes;
        currentTime = nextHourStart;
      }

      return totalCost.toFixed(2);
    };

    totalCost2Wheeler = calculateCost("2Wheeler", startTotalMinutes, endTotalMinutes);
    totalCost4Wheeler = calculateCost("4Wheeler", startTotalMinutes, endTotalMinutes);

    console.log(`Total cost for 2-wheeler: Rs.${totalCost2Wheeler}`);
    console.log(`Total cost for 4-wheeler: Rs.${totalCost4Wheeler}`);

    navigate("/parking-lot", {
      state: { totalCost2Wheeler,
               totalCost4Wheeler,
                rates,
               startTime: startTime.format("HH:mm A"),
               endTime: endTime.format("HH:mm A"),
                },
    });
  };

  const isFormValid = () =>
    location && selectedDate && startTime && endTime && !timeError;

  return (
    <div className="max-w-5xl mx-auto my-20 flex flex-col items-center">
      {/* Form Container */}
      <div className="flex w-full items-center">
        <div className="flex-1 border rounded-lg shadow-md bg-textColor">
          <div className="flex justify-between items-center border-b pb-3">
            <div className="flex-1 border-r-2">
              <select
                id="location"
                name="location"
                className="px-1 mt-3 text-gray-700 rounded-lg border-0 w-full focus:ring-0 focus:border-0 focus:hover:bg outline-none"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option className= ""value="">Select Area</option>
                <option className= ""value="Lagankhel">Parking area 1</option>
                <option className= ""value="Sundhara">Parking area 2</option>
                <option className= ""value="Naxal">Parking area 3</option>
                <option className= ""value="Satdobato">Parking area 4</option>
              </select>
            </div>

            <div className="flex-1 border-r-2 px-4">
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
                <DatePicker
                  label="Select Date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  minDate={today}
                  slotProps={{
                    textField: {
                      variant: "standard",
                      fullWidth: true,
                      sx: {
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "0.375rem",
                          "&:hover fieldset": { borderColor: "#3b82f6" },
                          "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                        },
                        "& .MuiInputLabel-root": {
                          color: "#6b7280",
                        },
                      },
                    },
                    openPickerButton: {
                      sx: {
                        color: "#6b7280",
                      },
                    },
                  }}
                  format="DD/MM/YYYY"
                />
              </LocalizationProvider>
            </div>

            <div className="flex-1 border-r-2 px-4">
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
                <TimePicker
                  label="Start Time"
                  value={startTime}
                  onChange={handleStartTimeChange}
                  minutesStep={1}
                  slotProps={{
                    textField: {
                      variant: "standard",
                      fullWidth: true,
                      sx: {
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "0.375rem",
                          "&:hover fieldset": { borderColor: "#3b82f6" },
                          "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                        },
                        "& .MuiInputLabel-root": {
                          color: "#6b7280",
                        },
                      },
                    },
                    openPickerButton: {
                      sx: {
                        color: "#6b7280",
                      },
                    },
                  }}
                  format="HH:mm A"
                />
              </LocalizationProvider>
            </div>

            <div className="flex-1 px-4">
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
                <TimePicker
                  label="End Time"
                  value={endTime}
                  onChange={handleEndTimeChange}
                  minutesStep={1}
                  slotProps={{
                    textField: {
                      variant: "standard",
                      fullWidth: true,
                      sx: {
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "0.375rem",
                          "&:hover fieldset": { borderColor: "#3b82f6" },
                          "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                        },
                        "& .MuiInputLabel-root": {
                          color: "#6b7280",
                        },
                      },
                    },
                    openPickerButton: {
                      sx: {
                        color: "#6b7280",
                      },
                    },
                  }}
                  format="HH:mm A"
                />
              </LocalizationProvider>
            </div>
          </div>
        </div>

       <div className="ml-4">
          <button
            className="bg-gradient-to-r from-[#FF5733] to-[#8B5CF6] text-white font-semibold rounded-lg px-8 py-5 text-base hover:opacity-90 transition-opacity"
            onClick={handleBooking}
          >
            Book Now
          </button>
        </div>
      </div>

      {/* Error Messages Outside the Form Container */}
      <div className="mt-4 text-center w-full">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {timeError && <p className="text-red-500 text-sm">{timeError}</p>}
        {formSubmitted && !isFormValid() && (
          <p className="text-red-500 text-sm">Please fill in all fields!</p>
        )}
      </div>
    </div>
  );
}

export default Selection;