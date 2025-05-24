const express = require('express');
const router = express.Router();
const { getUserBookings, getUserBookingCount, getUpcomingBookings } = require('./profileController'); 
const authMiddleware = require('../authentication');

router.get('/my-bookings', authMiddleware, getUserBookings);
router.get('/my-upcomingbookings', authMiddleware, getUpcomingBookings);
router.get('/my-bookings/count', authMiddleware, getUserBookingCount);


module.exports = router;
