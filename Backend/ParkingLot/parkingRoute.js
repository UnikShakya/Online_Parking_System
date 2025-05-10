const express = require("express");
const router = express.Router();
const parkingController = require("./parkingController");
const authMiddleware = require("../authentication");

router.get("/", parkingController.getAllLot);
router.post("/book", authMiddleware, parkingController.bookLot);
router.get("/booked", parkingController.bookedLot);


module.exports = router;
