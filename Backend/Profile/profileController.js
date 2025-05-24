const BookingModel = require('../bookingModel');
const parkingLotModel = require('../ParkingLot/parkingLotModel')
const moment = require('moment')
// const Payment = require("../Payment/PaymentModel");

// // Get bookings of the logged-in user
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
//     getUserBookings // Make sure this matches exactly with the function name
// };

const getUserBookings = async (req, res) => {
  console.log("User ID from token:", req.user.id); // Log the user ID
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
  console.log("User ID from token:", req.user.id); // Log the user ID
  try {
    // Current Nepal time (+0545)
    const currentNepalTime = moment().utcOffset('+0545');
    console.log("Current Nepal Time:", currentNepalTime.format('YYYY-MM-DD HH:mm'));

    // Fetch all bookings for the user
    const userBookings = await parkingLotModel.find({ userId: req.user.id });
    console.log("Total bookings fetched:", userBookings.length);

    // Filter bookings for future dates/times
    const upcomingBookings = userBookings.filter((booking) => {
      try {
        // Combine date and startTime into a datetime string
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
  console.log("User ID from token:", req.user.id); // Log the user ID

  try {
    // Count documents where userId matches the logged-in user
    const bookingCount = await parkingLotModel.countDocuments({ userId: req.user.id });

    res.json({ bookingCount }); // Return count as JSON
  } catch (err) {
    console.error("Error fetching user booking count:", err);
    res.status(500).json({ message: "Failed to fetch booking count" });
  }
};
module.exports = {getUserBookings, getUpcomingBookings, getUserBookingCount}