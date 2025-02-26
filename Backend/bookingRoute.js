const express = require("express");
const { booking } = require('./bookingController');
const bookingRoute = express.Router();
// const { bookingSchema } = require('./bookingSchema');

bookingRoute.post("/", booking)

module.exports = bookingRoute;
