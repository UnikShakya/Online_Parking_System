const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    name: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    paymentMethod: { 
        type: String, 
        required: true, 
        enum: ['cash', 'khalti'] 
    },
    location: { 
        type: String, 
        required: true, 
        enum: ["Patan", "Bouddha", "Bhaktapur"] 
    },
    selectedSpots: { type: String, required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    status: {
        type: String,
        enum: ['Paid', 'Unpaid'],
        default: 'Unpaid'
    },
    totalCost: { type: Number, required: true }
});

bookingSchema.pre('save', function(next) {
    if (this.paymentMethod === 'khalti') {
        this.status = 'Paid';
    }
    next();
});

// Check if model already exists before defining
const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

module.exports = Booking;