const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // Link to logged-in user
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
  pidx: { type: String },
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

const paymentModel = mongoose.model("Payment", paymentSchema);

module.exports = paymentModel;
