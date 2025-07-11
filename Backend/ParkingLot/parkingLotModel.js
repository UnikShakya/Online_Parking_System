const mongoose = require('mongoose');

const parkingLotSchema = new mongoose.Schema({
  location: String,
  // vehicleType: { type: String, required: true },
  date: String, 
  startTime: String,
  endTime: String,
  selectedSpots: { type: String, required: true },
  isBooked: { type: Boolean, default: false },
  extended:{type: Boolean, default: false},
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: false, 
  },
});


const parkingLotModel = mongoose.model("ParkingLot", parkingLotSchema);

module.exports = parkingLotModel
