const mongoose = require("mongoose");
const ParkingLot = require("./ParkingLot/parkingLotModel");
const database = require("./database");
database();

const locations = ["Location 1", "Location 2", "Location 3"];

const generateLots = () => {
  const lots = [];

  const sections = ["A", "B", "C", "D"];
  const fourWheelerSlots = ["R10", "R20", "R30", "R40", "R50", "R60"];

  locations.forEach((location) => {
    // 2-Wheelers: A0–A19, B0–B219, etc.
    sections.forEach((section) => {
      for (let i = 0; i <= 19; i++) {
        lots.push({
          location,
          vehicleType: "2-wheeler",
          lotNumber: `${section}${i}`,
          isBooked: false,
        });
      }
    });

    // 4-Wheelers: R10–R60
    fourWheelerSlots.forEach((slot) => {
      lots.push({
        location,
        vehicleType: "4-wheeler",
        lotNumber: slot,
        isBooked: false,
      });
    });
  });

  return lots;
};

const seed = async () => {
  try {
    await ParkingLot.deleteMany();
    const lots = generateLots();
    await ParkingLot.insertMany(lots);
    console.log("✅ Parking lots seeded successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error seeding parking lots:", err);
  }
};

seed();
