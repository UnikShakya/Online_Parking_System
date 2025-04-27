const mongoose = require('mongoose');

const parkingLotSchema = new mongoose.Schema({
  location: String,
  // vehicleType: { type: String, required: true },
  date: String, // "YYYY-MM-DD"
  startTime: String,
  endTime: String,
  lotNumber: { type: String, required: true },
  isBooked: { type: Boolean, default: false },
});


const parkingLotModel = mongoose.model("ParkingLot", parkingLotSchema);

module.exports = parkingLotModel
