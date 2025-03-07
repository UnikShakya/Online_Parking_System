const express = require("express");
const { booking, getBookings } = require('./bookingController');
const bookingRoute = express.Router();
// const { bookingSchema } = require('./bookingSchema');

bookingRoute.post("/", booking)
bookingRoute.get("/getBookings", getBookings)

module.exports = bookingRoute;
