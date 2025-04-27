const BookingModel = require('./bookingModel');
const parkingLotModel = require('./ParkingLot/parkingLotModel');

const booking = async (req, res) => {
    try {
        console.log("Received Data:", req.body);

        const { name, vehicleNumber, phoneNumber, paymentMethod, location, lotNumber, date, startTime, endTime } = req.body;

        // Basic validation
        if (!paymentMethod) {
            return res.status(400).json({ message: "Payment method is required" });
        }

        // Save new booking
        const newBooking = new BookingModel({
            name,
            vehicleNumber,
            phoneNumber,
            paymentMethod,
            location,
            lotNumber,
            date,
            startTime,
            endTime,
        });

        await newBooking.save();

        // Update parking lot status
        await ParkingLotModel.findOneAndUpdate(
            { location, lotNumber, date, startTime, endTime },
            { isBooked: true }
        );

        res.status(201).json(newBooking);
    } catch (error) {
        console.error('Error saving booking:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getBookings = async(req, res) => {
    try {
        const bookings = await BookingModel.find();
        res.status(200).json(bookings);
    } catch (error) {
        console.log("Error fetching Bookings", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


module.exports = { booking, getBookings };
