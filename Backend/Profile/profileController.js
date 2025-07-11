const BookingModel = require('../bookingModel');
const parkingLotModel = require('../ParkingLot/parkingLotModel')
const moment = require('moment')
// const Payment = require("../Payment/PaymentModel");

// const getUserBookings = async (req, res) => {
//     try {
//       const userId = req.user.id; // This comes from the auth middleware
//       const bookings = await Payment.find({ userId });
      
//       res.status(200).json({
//         success: true,
//         bookings
//       });
//     } catch (error) {
//       console.error("Error fetching user bookings:", error);
//       res.status(500).json({ success: false, message: "Failed to fetch bookings" });
//     }
// };
  
// module.exports = {
//     getUserBookings
// };

const getUserBookings = async (req, res) => {
  console.log("User ID from token:", req.user.id); 
  try {
    const userBookings = await parkingLotModel.find({ userId: req.user.id });
    
    if (userBookings.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }

    res.json(userBookings);
  } catch (err) {
    console.error("Error fetching user bookings:", err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

const getUpcomingBookings = async (req, res) => {
  console.log("User ID from token:", req.user.id); 
  try {
    const currentNepalTime = moment().utcOffset('+0545');
    console.log("Current Nepal Time:", currentNepalTime.format('YYYY-MM-DD HH:mm'));

    const userBookings = await parkingLotModel.find({ userId: req.user.id });
    console.log("Total bookings fetched:", userBookings.length);

    const upcomingBookings = userBookings.filter((booking) => {
      try {
        const bookingDateTime = moment(`${booking.date} ${booking.startTime}`, 'YYYY-MM-DD HH:mm');
        // console.log(`Booking ID: ${booking._id}, DateTime: ${bookingDateTime.format('YYYY-MM-DD HH:mm')}, Valid: ${bookingDateTime.isValid()}`);

        // Check if the booking is in the future
        const isFuture = bookingDateTime.isValid() && bookingDateTime.isAfter(currentNepalTime);
        // console.log(`Booking ID: ${booking._id}, Is Future: ${isFuture}`);
        return isFuture;
      } catch (err) {
        console.error(`Error parsing date for booking ID: ${booking._id}`, err);
        return false;
      }
    });

    console.log("Upcoming bookings:", upcomingBookings.length);
    if (upcomingBookings.length === 0) {
      return res.status(404).json({ message: "No upcoming bookings found" });
    }

    res.json(upcomingBookings);
  } catch (err) {
    console.error("Error fetching upcoming bookings:", err);
    res.status(500).json({ message: "Failed to fetch upcoming bookings" });
  }
};

const getUserBookingCount = async (req, res) => {
  console.log("User ID from token:", req.user.id); 

  try {
    // Count documents where userId matches the logged-in user
    const bookingCount = await parkingLotModel.countDocuments({ userId: req.user.id });

    res.json({ bookingCount });
  } catch (err) {
    console.error("Error fetching user booking count:", err);
    res.status(500).json({ message: "Failed to fetch booking count" });
  }
};
module.exports = {getUserBookings, getUpcomingBookings, getUserBookingCount}