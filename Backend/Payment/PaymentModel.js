const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  vehicleType: { type: String },
  startTime: { type: String },
  endTime: { type: String },
  selectedSpots: { type: [String] },
  totalCost: { type: Number },
  paymentVerified: { type: Boolean, default: false },
  paymentToken: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Payment', paymentSchema);
