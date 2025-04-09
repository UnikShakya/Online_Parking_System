const mongoose = require('mongoose');

const parkingLotSchema = new mongoose.Schema({
  slotNumber: { type: String, required: true }, // e.g. "A1", "B10"
  type: { type: String, enum: ["2-wheeler", "4-wheeler"], required: true },
  isBooked: { type: Boolean, default: false },
});

const parkingLotModel = mongoose.model("ParkingLot", parkingLotSchema);

module.exports = parkingLotModel
