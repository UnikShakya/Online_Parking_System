const schedule = require("node-schedule");
const User = require("../User/userModel");
const ParkingLot = require("./parkingLotModel");
const Booking = require('../bookingModel')
const nodemailer = require("nodemailer");
const mongoose = require("mongoose")


// Get all parking lots
exports.getAllLot = async (req, res) => {
  try {
    const lot = await ParkingLot.find();
    res.json(lot);
  } catch (err) {
    console.error("Error fetching parking lot:", err);
    res.status(500).json({ message: "Server error while fetching lot." });
  }
};
exports.getAllLotLocation2 = async (req, res) => {
  try {
    const lot = await ParkingLot.find({ location: "Bouddha" });
    res.json(lot);
  } catch (err) {
    console.error("Error fetching parking lot:", err);
    res.status(500).json({ message: "Server error while fetching lot." });
  }
};

exports.getAllLotLocation3 = async (req, res) => {
  try {
    const lot = await ParkingLot.find({ location: "Bhaktapur" });
    res.json(lot);
  } catch (err) {
    console.error("Error fetching parking lot:", err);
    res.status(500).json({ message: "Server error while fetching lot." });
  }
};

exports.bookLot = async (req, res) => {
  const { location, date, startTime, endTime, selectedSpots } = req.body;
  const userId = req.user.id;

    // Validate and format the date
  let formattedDate;
  try {
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      formattedDate = date;
    } else {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        throw new Error("Invalid date format");
      }
      formattedDate = dateObj.toISOString().split('T')[0];
    }
  } catch (err) {
    return res.status(400).json({ 
      message: "Invalid date format. Please use YYYY-MM-DD format",
      error: err.message
    });
  }

  console.log("Booking request:", req.body);
  console.log("selectedSpots type:", typeof selectedSpots); 
  console.log("Formatted date:", formattedDate);

  try {
    const lot = await ParkingLot.findOne({ location,
       selectedSpots: selectedSpots,
        isBooked: false
       });
    console.log("Found lot:", lot);

    if (!lot) {
      return res.status(200).json({ message: "No available spots found" });
    }

    // if (!lot) return res.status(404).json({ message: "Lot not found" });
    // if (lot.isBooked) return res.status(400).json({ message: "Already booked" });

    lot.isBooked = true;
    lot.userId = userId;
    lot.startTime = startTime;
    lot.endTime = endTime;
    lot.date = formattedDate;
    await lot.save();
    console.log("✅ Lot updated:", lot);

    const user = await User.findById(userId);
    const email = user.email;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
      }
    });

    const mailOptions = {
      from: process.env.MY_EMAIL,
      to: email,
      subject: "Parking Lot Booking Confirmation",
      html: `
        <h2>Booking Successful!</h2>
        <p>Your parking lot has been booked.</p>
        <ul>
          <li><strong>Location:</strong> ${location}</li>
          <li><strong>Date:</strong> ${formattedDate}</li>
          <li><strong>Time:</strong> ${startTime} to ${endTime}</li>
          <li><strong>Spot:</strong>  ${Array.isArray(selectedSpots) ? selectedSpots.join(", ") : selectedSpots}</li>
        </ul>
        <p>Thank you for using our service!</p>
      `
    };

    await transporter.sendMail(mailOptions);


 const endDateTime = new Date(`${date}T${endTime.padStart(5, '0')}:00`);
 const reminderTime = new Date(endDateTime.getTime() - 30 * 60000); 

 if (reminderTime > new Date()) {
   schedule.scheduleJob(reminderTime, async function () {
     const reminderOptions = {
       from: process.env.MY_EMAIL,
       to: email,
       subject: "🚗 Reminder: Your Parking Session Ends in 30 Minutes",
       html: `
         <h3>Your Parking Session is Ending Soon</h3>
         <p>Your parking session at <strong>${location}</strong> will end in 30 minutes.</p>
         <ul>
           <li><strong>Date:</strong> ${formattedDate}</li>
           <li><strong>Spot:</strong>  ${Array.isArray(selectedSpots) ? selectedSpots.join(", ") : selectedSpots}</li>
           <li><strong>Time:</strong> ${startTime} to ${endTime}</li>
         </ul>
         <p>We hope your time is going smoothly. Please make arrangements to pick up your vehicle.</p>
       `,
     };

     try {
       await transporter.sendMail(reminderOptions);
       console.log("📧 Reminder email sent");
     } catch (error) {
       console.error("Reminder email failed:", error);
     }
   });
 } else {
   console.log("Reminder time is in the past. Reminder not scheduled.");
 }

     schedule.scheduleJob(endDateTime, async function () {
      const endTimeUpOptions = {
        from: process.env.MY_EMAIL,
        to: email,
        subject: "🚗 Parking Time Ended",
        html: `
          <h3>Your Parking Session Has Ended</h3>
          <p>Your parking session at <strong>${location}</strong> has ended 😢.</p>
          <ul>
            <li><strong>Date:</strong> ${formattedDate}</li>
            <li><strong>Spot:</strong>  ${Array.isArray(selectedSpots) ? selectedSpots.join(", ") : selectedSpots}</li>
            <li><strong>Time:</strong> ${startTime} to ${endTime}</li>
          </ul>
          <p>If you need more time, you can extend your booking.</p>
          <p>Thank you for using our service!</p>
        `
      };

      try {
        await transporter.sendMail(endTimeUpOptions);
        console.log("📧 Parking Time Ended email sent");
      } catch (error) {
        console.error("End-time email failed:", error);
      }
    });

    res.json({ message: "Booked successfully and email sent" });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ message: "Booking failed" });
  }
};

exports.bookedLot = async (req, res) => {
  try {
    const bookedSpots = await ParkingLot.find({ isBooked: true });
    if (bookedSpots.length === 0) {
      return res.status(200).json({ message: 'No booked spots found' });
    }
    res.json(bookedSpots);
  } catch (error) {
    console.error("Error fetching booked spots:", error); // Log the error for debugging
    res.status(500).json({ message: 'Error fetching booked spots', error: error.message });
  }
};

exports.bookedLotLocation2 = async (req, res) => {
  try {
    const bookedSpots = await ParkingLot.find({ 
      location: "Bouddha", 
      isBooked: true 
    });

    if (bookedSpots.length === 0) {
      return res.status(200).json({ message: "No booked spots found in Location 2" });
    }
    res.json(bookedSpots);
  } catch (error) {
    console.error("Error fetching booked spots:", error);
    res.status(500).json({ message: "Error fetching booked spots in Location 2" });
  }
};

exports.bookedLotLocation3 = async (req, res) => {
  try {
    const bookedSpots = await ParkingLot.find({ 
      location: "Bhaktapur", 
      isBooked: true 
    });

    if (bookedSpots.length === 0) {
      return res.status(200).json({ message: "No booked spots found in Location 3" });
    }
    res.json(bookedSpots);
  } catch (error) {
    console.error("Error fetching booked spots:", error);
    res.status(500).json({ message: "Error fetching booked spots in Location 3" });
  }
};
exports.cancelBooking = async (req, res) => {
  const bookingId = req.params.id; // Use id like extendBooking

  try {
    console.log("Cancelling booking for ID:", bookingId);

    // Validate ObjectId
    if (!mongoose.isValidObjectId(bookingId)) {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }

    const booking = await ParkingLot.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Cancel the booking
    booking.isBooked = false;
    booking.date = undefined; // Remove date
    booking.startTime = undefined; // Remove startTime
    booking.endTime = undefined; // Remove endTime
    booking.extended = false; // Reset extended status

    await booking.save();
    console.log("Cancelled booking:", booking);

    res.status(200).json({ message: 'Booking cancelled successfully', updatedBooking: booking });
  } catch (error) {
    console.error('Cancel error:', error);
    res.status(500).json({ message: 'Server error while cancelling booking', error: error.message });
  }
};

exports.extendBooking = async (req, res) => {
  const bookingId = req.params.id;
  const { date, endTime } = req.body;

  try {
    const booking = await ParkingLot.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (new Date(`1970-01-01T${endTime}:00Z`) <= new Date(`1970-01-01T${booking.endTime}:00Z`)) {
      return res.status(400).json({ message: 'New end time must be later than the current end time.' });
    }

    booking.date = date;
    booking.endTime = endTime;
    booking.extended = true; 


    await booking.save();

    res.status(200).json({ message: 'Booking extended successfully.', updatedBooking: booking });
  } catch (error) {
    console.error('Extend error:', error);
    res.status(500).json({ message: 'Server error while extending booking.' });
  }
}
exports.getExtendedBookings = async (req, res) => {
  try {
    const bookings = await ParkingLot.find({ extended: true })
      .populate({
        path: 'userId',
        select: 'username email', 
        model: 'User' 
      })
      .lean(); 

    console.log("Populated bookings:", bookings); 

    res.json(bookings);
  } catch (error) {
    console.error("Population error:", error);
    res.status(500).json({ 
      message: 'Error fetching extended bookings',
      error: error.message 
    });
  }
}
exports.getExtendedBookingsByPatan = async (req, res) => {
  try {
    const bookings = await ParkingLot.find({ extended: true, location: "Patan" })
      .populate({
        path: 'userId',
        select: 'username email', 
        model: 'User' 
      })
      .lean(); 

    console.log("Populated bookings:", bookings); 

    res.json(bookings);
  } catch (error) {
    console.error("Population error:", error);
    res.status(500).json({ 
      message: 'Error fetching extended bookings',
      error: error.message 
    });
  }
}

exports.getExtendedBookingsByBouddha = async (req, res) => {
  try {
    const bookings = await ParkingLot.find({ extended: true, location: "Bouddha" })
      .populate({
        path: 'userId',
        select: 'username email', 
        model: 'User' 
      })
      .lean(); 

    console.log("Populated bookings:", bookings); 

    res.json(bookings);
  } catch (error) {
    console.error("Population error:", error);
    res.status(500).json({ 
      message: 'Error fetching extended bookings',
      error: error.message 
    });
  }
}
exports.getExtendedBookingsByBhaktapur = async (req, res) => {
  try {
    const bookings = await ParkingLot.find({ extended: true, location: "Bhaktapur" })
      .populate({
        path: 'userId',
        select: 'username email',
        model: 'User' 
      })
      .lean();

    console.log("Populated bookings:", bookings); 

    res.json(bookings);
  } catch (error) {
    console.error("Population error:", error);
    res.status(500).json({ 
      message: 'Error fetching extended bookings',
      error: error.message 
    });
  }
}

exports.getBookingCountByUser = async (req, res) => {
  const { id } = req.params;

  try {
    const count = await ParkingLot.countDocuments({ userId: id });
    res.json({ bookingCount: count });
  } catch (err) {
    console.error("Error getting booking count:", err);
    res.status(500).json({ message: "Server error while fetching booking count." });
  }
};
