const express = require('express');
const router = express.Router();
const { getUserBookings } = require('../Payment/paymentController'); // or profileController
const authMiddleware = require('../authentication');

router.get('/my-bookings', authMiddleware, getUserBookings);

module.exports = router;
