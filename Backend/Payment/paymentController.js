const axios = require('axios');
require('dotenv').config();

// Your PeriPay API key
const PERIPAY_API_KEY = process.env.PERIPAY_API_KEY; // Add your key here
const PERIPAY_BASE_URL = process.env.PERIPAY_BASE_URL || 'https://pay.periwin.com';
const BACKEND_URL = process.env.BACKEND_URL;

const initiatePayment = async (req, res) => {
  try {
    const { amount, productName, customerDetails } = req.body;

    const purchaseOrderId = `ORDER-${Date.now()}`;
    const amountInPaisa = Math.round(amount * 100);

   // Request Payload
const payload = {
  return_url: "https://yourwebsite.com/return",
  amount: 12000,  // Amount in paisa (1 paisa = 1/100th of a rupee)
  purchase_order_id: "ORDER-TEST123",  // Unique string for the order
  product_name: "IPHONE 16 PRO",
  customer_name: "John Doe",
  customer_email: "john.doe@example.com",
  customer_phone: "9800000000"
};


    console.log('Sending payment data:', payload);
    console.log('PERIPAY_API_KEY:', PERIPAY_API_KEY);

    // URL for payment initiation
const url = `${PERIPAY_BASE_URL}/api/payment/process/initiate/`;

  // Sending the POST request to initiate the payment
axios.post(url, payload, {
  headers: {
    'Authorization': `Bearer ${PERIPAY_API_KEY}`,
    'Content-Type': 'application/json'
  }
})

    res.json({
      success: true,
      paymentUrl: response.data.payment_url,
      paymentId: response.data.payment_id
    });

  } catch (error) {
    console.error('Payment initiation error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Payment initiation failed',
      error: error.response?.data || error.message
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      amount,
      purchase_order_id,
      payment_id,
      product_name,
      customer_name,
      customer_email,
      customer_phone,
      payment_gateway,
      refunded,
      payment_status
    } = req.query;

    console.log('Payment verification data:', req.query);

    res.redirect(`${BACKEND_URL}/payment/success?payment_id=${payment_id}`);

  } catch (error) {
    console.error('Payment verification error:', error);
    res.redirect(`${BACKEND_URL}/payment/failed`);
  }
};

module.exports = { initiatePayment, verifyPayment };
