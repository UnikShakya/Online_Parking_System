const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    vehicleType: { type: String, required: true, enum: ['2-wheeler', '4-wheeler']},  // Only allow these two values
    paymentMethod: { type: String, required: true, enum: ['cash', 'digital'] },
});

const BookingModel = mongoose.model('Booking', bookingSchema);

module.exports = BookingModel;
