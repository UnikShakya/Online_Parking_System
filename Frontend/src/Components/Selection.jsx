import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { Tooltip } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/en";
import { toast } from "react-toastify";
import { useParkingCost } from "../Context/ParkingCostContext";

function Selection({ setShowLogin }) {
  const today = dayjs();
  const [selectedDate, setSelectedDate] = useState(null);
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [error, setError] = useState("");
  const [timeError, setTimeError] = useState("");

  const navigate = useNavigate();
  const { twoWheelerNum, fourWheelerNum } = useParkingCost();

  // Update usage in calculations
  const rates = useMemo(
    () => ({
      "2Wheeler": {
        peakRate: twoWheelerNum * 0.8,   // Changed from twoWheelerCost
        offPeakRate: twoWheelerNum,
      },
      "4Wheeler": {
        peakRate: fourWheelerNum * 0.8,   // Changed from fourWheelerCost
        offPeakRate: fourWheelerNum,
      },
    }),
    [twoWheelerNum, fourWheelerNum]      // Update dependencies
  );

  const calculateCost = (vehicleType) => {
    if (!startTime || !endTime) return { totalCost: '--', isPeak: false };

    const startTotalMinutes = startTime.hour() * 60 + startTime.minute();
    const endTotalMinutes = endTime.hour() * 60 + endTime.minute();

    if (endTotalMinutes <= startTotalMinutes) {
      return { totalCost: '--', isPeak: false };
    }

    const durationHours = (endTotalMinutes - startTotalMinutes) / 60;
    const startHour = startTime.hour();
    const isPeak = startHour >= 10 && startHour < 17;
    const rate = isPeak ? rates[vehicleType].peakRate : rates[vehicleType].offPeakRate;

    return {
      totalCost: (rate * durationHours).toFixed(2),
      isPeak,
    };
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
    if (selectedDate && selectedDate.isSame(today, "day") && newValue && newValue.isBefore(today)) {
      setTimeError("Cannot select past time for today!");
      setStartTime(null);
      return;
    }

    setStartTime(newValue);
    if (newValue && endTime && newValue.isAfter(endTime)) {
      setTimeError("Start time must be earlier than end time!");
    } else {
      setTimeError("");
    }
  };

  const handleEndTimeChange = (newValue) => {
    if (selectedDate && selectedDate.isSame(today, "day") && newValue && newValue.isBefore(today)) {
      setTimeError("Cannot select past time for today!");
      setEndTime(null);
      return;
    }

    setEndTime(newValue);
    if (startTime && newValue && newValue.isBefore(startTime)) {
      setTimeError("End time must be later than start time!");
    } else {
      setTimeError("");
    }
  };

  const handleBooking = () => {
    if (!localStorage.getItem("token")) {
      toast.error("Please login to book parking", {
        position: "top-right",
        autoClose: 3000,
        closeOnClick: true,
      });
      setShowLogin(true);
      return;
    }

    if (!location) {
      setError("Please select a parking lot");
      return;
    }
    if (!selectedDate) {
      setError("Please select a date");
      return;
    }
    if (!startTime || !endTime) {
      setTimeError("Please select both start and end times");
      return;
    }
    if (timeError) {
      return;
    }

    const twoWheelerData = calculateCost("2Wheeler");
    const fourWheelerData = calculateCost("4Wheeler");

    const parkingLotMap = {
      ParkingLot1: "1",
      ParkingLot2: "2",
      ParkingLot3: "3",
    };
    const parkingLotId = parkingLotMap[location] || "1";

    navigate("/parking-lot", {
      state: {
        totalCost2Wheeler: twoWheelerData.totalCost,
        totalCost4Wheeler: fourWheelerData.totalCost,
        rates,
        discountRate: 0.2,
        startTime: startTime.format("HH:mm A"),
        endTime: endTime.format("HH:mm A"),
        parkingLotId,
        isPeak: twoWheelerData.isPeak,
        date: selectedDate.format("DD/MM/YYYY"),
        location,
      },
    });
  };

  return (
    <div className="max-w-5xl mx-auto my-20 flex flex-col items-center">
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
                <option value="">Select Parking Lot</option>
                <option value="ParkingLot1">Parking Lot 1</option>
                <option value="ParkingLot2">Parking Lot 2</option>
                <option value="ParkingLot3">Parking Lot 3</option>
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
                        "& .MuiInputLabel-root": { color: "#6b7280" },
                      },
                    },
                    openPickerButton: { sx: { color: "#6b7280" } },
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
                        "& .MuiInputLabel-root": { color: "#6b7280" },
                      },
                    },
                    openPickerButton: { sx: { color: "#6b7280" } },
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
                        "& .MuiInputLabel-root": { color: "#6b7280" },
                      },
                    },
                    openPickerButton: { sx: { color: "#6b7280" } },
                  }}
                  format="HH:mm A"
                />
              </LocalizationProvider>
            </div>
          </div>
        </div>

        <div className="ml-4 flex flex-col items-center">
          <button
            className={`bg-gradient-to-r from-[#FF5733] to-[#8B5CF6] text-white font-semibold rounded-lg px-8 py-5 text-base ${
              timeError ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
            }`}
            onClick={handleBooking}
            disabled={!!timeError}
          >
            Book Now
          </button>
        </div>
      </div>

      {startTime && endTime && (
        <div className="mt-2 text-center">
          <Tooltip
            title={
              <div className="p-2">
                <div>Base Rates:</div>
                <div>2-Wheeler: Rs.{twoWheelerNum.toFixed(2)}/hr</div>
                <div>4-Wheeler: Rs.{fourWheelerNum.toFixed(2)}/hr</div>
                <div className="mt-1">
                  {calculateCost("2Wheeler").isPeak
                    ? "Peak hour rates apply (20% discount)"
                    : "Normal rates apply"}
                </div>
              </div>
            }
            arrow
          >
            <div className="text-sm text-gray-400 cursor-help">
              Estimated:
              <span className="font-medium mx-1">
                2W - Rs. {calculateCost("2Wheeler").totalCost}
              </span>
              |
              <span className="font-medium mx-1">
                4W - Rs. {calculateCost("4Wheeler").totalCost}
              </span>
            </div>
          </Tooltip>
        </div>
      )}

      <div className="mt-4 text-center w-full">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {timeError && <p className="text-red-500 text-sm">{timeError}</p>}
      </div>
    </div>
  );
}

export default Selection;