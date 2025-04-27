const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    paymentMethod: { type: String, required: true, enum: ['cash', 'khalti'] },
    // vehicleType: { type: String, required: true, enum: ['2-wheeler', '4-wheeler']},  // Only allow these two values
    location: { type: String, required: true },
    lotNumber: { type: String, required: true },
    date: { type: String, required: true }, // "YYYY-MM-DD"
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
});

const BookingModel = mongoose.model('Booking', bookingSchema);

module.exports = BookingModel;
