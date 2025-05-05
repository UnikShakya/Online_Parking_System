const mongoose = require('mongoose');

const parkingLotSchema = new mongoose.Schema({
  location: String,
  // vehicleType: { type: String, required: true },
  date: String, // "YYYY-MM-DD"
  startTime: String,
  endTime: String,
  selectedSpots: { type: String, required: true },
  isBooked: { type: Boolean, default: false },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Reference to the User model
    required: false, // Optional initially, can be populated after booking
  },
});


const parkingLotModel = mongoose.model("ParkingLot", parkingLotSchema);

module.exports = parkingLotModel
