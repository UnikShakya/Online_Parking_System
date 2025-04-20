const express = require('express');
const paymentRouter = express.Router();
const { verifyPayment, payment } = require('./paymentController');

paymentRouter.post('/verify-khalti-payment', verifyPayment);
paymentRouter.post('/booking', payment);

module.exports = paymentRouter;
