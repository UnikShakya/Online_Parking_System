const express = require('express');
const paymentRouter = express.Router();
const { verifyPayment, payment } = require('./paymentController');
const authMiddleware = require('../authentication')

paymentRouter.post('/verify-khalti-payment', verifyPayment);
paymentRouter.post('/booking', authMiddleware, payment);

module.exports = paymentRouter;
