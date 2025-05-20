const express = require('express');
const router = express.Router();
const { getUserBookings, getUserBookingCount } = require('../Payment/paymentController'); // or profileController
const authMiddleware = require('../authentication');

router.get('/my-bookings', authMiddleware, getUserBookings);
router.get('/my-bookings/count', authMiddleware, getUserBookingCount);


module.exports = router;
