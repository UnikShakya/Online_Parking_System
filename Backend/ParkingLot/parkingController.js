const ParkingLot = require("./parkingLotModel");

// Get all parking lots
exports.getAllLots = async (req, res) => {
  try {
    const lots = await ParkingLot.find();
    res.json(lots);
  } catch (err) {
    console.error("Error fetching parking lots:", err);
    res.status(500).json({ message: "Server error while fetching lots." });
  }
};

// Book a specific parking lot
exports.bookLot = async (req, res) => {
  const { location, date, startTime, endTime, selectedSpots } = req.body;

  console.log("Booking request:", req.body); // Add this line

  try {
    const lot = await ParkingLot.findOne({ location, selectedSpots });
    console.log("Found lot:", lot); // Add this line

    if (!lot) return res.status(404).json({ message: "Lot not found" });
    if (lot.isBooked) return res.status(400).json({ message: "Already booked" });

    lot.isBooked = true;
    await lot.save();

    res.json({ message: "Booked successfully" });
  } catch (err) {
    console.error("Booking error:", err); // Add this line
    res.status(500).json({ message: "Booking failed" });
  }
};

exports.bookedLot = async (req, res) => {
  try {
    const bookedSpots = await ParkingLot.find({ isBooked: true });
    if (bookedSpots.length === 0) {
      return res.status(404).json({ message: 'No booked spots found' });
    }
    res.json(bookedSpots);
  } catch (error) {
    console.error("Error fetching booked spots:", error); // Log the error for debugging
    res.status(500).json({ message: 'Error fetching booked spots', error: error.message });
  }
};
