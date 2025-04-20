const axios = require('axios');
const Payment = require('./PaymentModel');

const verifyPayment = async (req, res) => {
  const { token, amount } = req.body;


  try {
    const amountInPaisa = amount * 100;

    const response = await axios.post(
      'https://a.khalti.com/api/v2/payment/verify/',
      { token, 
        amount: amountInPaisa
       },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        },
      }
    );
 // Check if payment was successful
 if (response.data.state.name !== 'Completed') {
  return res.status(400).json({ 
    success: false, 
    error: "Payment not completed" 
  });
}

res.status(200).json({ 
  success: true, 
  data: response.data 
});

} catch (error) {
console.error('Khalti verification error:', error.response?.data || error.message);

// More detailed error response
const errorData = error.response?.data || {};
res.status(error.response?.status || 400).json({
  success: false,
  error: errorData.detail || errorData.error || 'Payment verification failed',
  khaltiError: errorData
});
}
};

const payment = async (req, res) => {
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

module.exports = { verifyPayment, payment };
