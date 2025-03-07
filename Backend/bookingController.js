const BookingModel = require('./bookingModel');

const booking = async (req, res) => {
    try {
        console.log("Received Data:", req.body);  // Debugging log

        // Check if paymentMethod is missing
        if (!req.body.paymentMethod) {
            return res.status(400).json({ message: "Payment method is required" });
        }

        const { name, vehicleNumber, phoneNumber, paymentMethod } = req.body;

        // Create a new booking document
        const newBooking = new BookingModel({
            name,
            vehicleNumber,
            phoneNumber,
            // vehicleType,
            paymentMethod,
        });

        // Save the new booking document to the database
        await newBooking.save();

        // Respond with the saved booking data
        res.status(201).json(newBooking);
    } catch (error) {
        console.error('Error saving booking:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const getBookings = async(req, res)=>{
    try {
        const bookings = await BookingModel.find();
        res.status(200).json(bookings)
        } catch (error) {
        console.log("Error fetching Bookings", error)
        res.status(500).json({ message: 'Internal Server Error' });
}
}

module.exports = { booking, getBookings };
