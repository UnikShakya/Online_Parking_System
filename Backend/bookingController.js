const BookingModel = require('./bookingModel');
const parkingLotModel = require('./ParkingLot/parkingLotModel');

const booking = async (req, res) => {
    const userId = req.user.id;
    try {
        console.log("Received Data:", req.body);

        const { name, vehicleNumber, phoneNumber, paymentMethod, location, selectedSpots, date, startTime, endTime, totalCost, status } = req.body;

        if (!paymentMethod) {
            return res.status(400).json({ message: "Payment method is required" });
        }
        const spotsString = Array.isArray(selectedSpots)
            ? selectedSpots.join(', ')
            : selectedSpots;
        // Save new booking
        const newBooking = new BookingModel({
            name,
            userId,
            vehicleNumber,
            phoneNumber,
            paymentMethod,
            location,
            selectedSpots: spotsString,
            date,
            startTime,
            endTime,
            totalCost,
            status
        });

        await newBooking.save();

        // // Update parking lot status
        // await parkingLotModel.findOneAndUpdate(
        //     { location, lotNumber, date, startTime, endTime },
        //     { isBooked: true }
        // );

        res.status(201).json(newBooking);
    } catch (error) {
        console.error('Error saving booking:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getBookings = async (req, res) => {
    try {
        const bookings = await BookingModel.find();
        res.status(200).json(bookings);
    } catch (error) {
        console.log("Error fetching Bookings", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        console.log(`Updating booking ${id} to status: ${status}`); 

        if (!['Paid', 'Unpaid'].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const updatedBooking = await BookingModel.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        console.log('Updated booking:', updatedBooking); 


        res.status(200).json(updatedBooking);
    } catch (error) {
        console.error('Error updating booking status:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const extendBookings = async (req, res) => {
  try {
    const { id } = req.params;
    const { endTime, date } = req.body;

    if (!endTime || !date) {
      return res.status(400).json({ message: "End time and date are required" });
    }

    const updatedBooking = await BookingModel.findByIdAndUpdate(
      id,
      { 
        endTime,
        date,
        updatedAt: new Date() 
      },
      { new: true } 
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({
      message: "Booking extended successfully",
      updatedBooking
    });
  } catch (error) {
    console.error("Error extending booking:", error);
    res.status(500).json({ message: "Failed to extend booking" });
  }
};

module.exports = { booking, getBookings, updateBookingStatus, extendBookings };
