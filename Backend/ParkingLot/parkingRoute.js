const express = require("express");
const router = express.Router();
const parkingController = require("./parkingController");
const authMiddleware = require("../authentication");

router.get("/", parkingController.getAllLot);
router.get("/location2", parkingController.getAllLotLocation2);
router.get("/location3", parkingController.getAllLotLocation3);
router.post("/book", authMiddleware, parkingController.bookLot);
router.get("/booked", parkingController.bookedLot);
router.get("/booked-location2", parkingController.bookedLotLocation2);
router.get("/booked-location3", parkingController.bookedLotLocation3);
router.put("/cancel/:id", parkingController.cancelBooking);
router.put("/extend/:id", parkingController.extendBooking);

module.exports = router;
