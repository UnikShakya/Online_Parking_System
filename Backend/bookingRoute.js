const express = require("express");
const { booking, getBookings, updateBookingStatus, extendBookings } = require('./bookingController');
const authMiddleware = require("./authentication");
const bookingRoute = express.Router();
// const { bookingSchema } = require('./bookingSchema');

bookingRoute.post("/", authMiddleware, booking)
bookingRoute.put("/extendbooking/:id", authMiddleware, extendBookings)
bookingRoute.get("/getBookings", getBookings)
bookingRoute.patch("/updatestatus/:id", updateBookingStatus)

module.exports = bookingRoute;
