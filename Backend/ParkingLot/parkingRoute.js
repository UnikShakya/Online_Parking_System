const express = require("express");
const router = express.Router();
const parkingController = require("./parkingController");

router.get("/", parkingController.getAllLots);
router.post("/book", parkingController.bookLot);
router.get("/booked", parkingController.bookedLot);


module.exports = router;
