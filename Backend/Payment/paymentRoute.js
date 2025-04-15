const express = require('express');
const paymentRouter = express.Router();
const { initiatePayment, verifyPayment } = require('./paymentController');

// Initiate payment
paymentRouter.post('/process/initiate', initiatePayment);

// Payment Verification Route
paymentRouter.get('/process/verify', verifyPayment);


module.exports = paymentRouter;