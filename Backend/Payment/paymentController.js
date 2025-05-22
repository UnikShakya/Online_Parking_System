const axios = require('axios');
const Payment = require('./PaymentModel');
const parkingLotModel = require('../ParkingLot/parkingLotModel');


const verifyPayment = async (req, res) => {
  const { pidx, amount } = req.body;

  if (!pidx || !amount) {
    return res.status(400).json({ success: false, error: "Missing pidx or amount" });
  }

  try {
    const response = await axios.post(
      "https://a.khalti.com/api/v2/payment/verify/",
      {},
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        params: {
          pidx: pidx,
          amount: amount,
        },
      }
    );

    if (response.data.state.name === "Completed") {
      return res.json({ success: true, data: response.data });
    } else {
      return res.status(400).json({ success: false, error: "Payment verification failed", khaltiError: response.data });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: "Internal server error", details: error.message });
  }
}

const payment = async (req, res) => {
    const userId = req.user.id; 

  const {
    name,
    vehicleNumber,
    phoneNumber,
    paymentMethod,
    vehicleType,
    // startTime,
    // endTime,
    // selectedSpots,
    // totalCost,
    // paymentVerified,
    // paymentToken,
    pidx
  } = req.body;

  // Input validation
  if (!paymentMethod || !name || !vehicleNumber || !phoneNumber) {
    return res.status(400).json({ 
      error: "Required fields are missing" 
    });
  }

  // Additional validation for Khalti payments
  if (paymentMethod === 'khalti' && (!paymentVerified || !paymentToken)) {
    return res.status(400).json({ 
      error: "For Khalti payments, verification data is required" 
    });
  }

  try {
    const newBooking = new Payment({
      userId,
      name,
      vehicleNumber,
      phoneNumber,
      paymentMethod,
      // vehicleType,
      // startTime,
      // endTime,
      // selectedSpots,
      // totalCost,
      paymentVerified: paymentMethod === 'khalti' ? paymentVerified : undefined,
      paymentToken: paymentMethod === 'khalti' ? paymentToken : undefined,
      pidx: paymentMethod === 'khalti' ? pidx : undefined,
      status: paymentMethod === 'cash' ? 'pending' : 'paid',
      createdAt: new Date()
    });

    const savedBooking = await newBooking.save();
    
    res.status(201).json({
      success: true,
      booking: savedBooking,
      message: "Booking created successfully"
    });

  } catch (error) {
    console.error('Error saving booking:', error);
    
    // Handle duplicate bookings or other DB errors
    if (error.code === 11000) {
      return res.status(400).json({ 
        error: "Duplicate booking detected" 
      });
    }
    
    res.status(500).json({ 
      error: error.message || 'Failed to save booking' 
    });
  }
};

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
// Update exports
module.exports = { verifyPayment, payment, getUserBookings, getUserBookingCount };
