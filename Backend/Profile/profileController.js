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