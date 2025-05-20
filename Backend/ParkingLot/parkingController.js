const schedule = require("node-schedule");
const User = require("../User/userModel");
const ParkingLot = require("./parkingLotModel");
const nodemailer = require("nodemailer");


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
// Get all parking lots for Location 2
exports.getAllLotLocation2 = async (req, res) => {
  try {
    const lot = await ParkingLot.find({ location: "Location 2" });
    res.json(lot);
  } catch (err) {
    console.error("Error fetching parking lot:", err);
    res.status(500).json({ message: "Server error while fetching lot." });
  }
};
// Get all parking lots for Location 2
exports.getAllLotLocation3 = async (req, res) => {
  try {
    const lot = await ParkingLot.find({ location: "Location 3" });
    res.json(lot);
  } catch (err) {
    console.error("Error fetching parking lot:", err);
    res.status(500).json({ message: "Server error while fetching lot." });
  }
};

// Book a specific parking lot
exports.bookLot = async (req, res) => {
  const { location, date, startTime, endTime, selectedSpots } = req.body;
  const userId = req.user.id;

    // Validate and format the date
  let formattedDate;
  try {
    // First check if date is already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      formattedDate = date;
    } else {
      // Parse other date formats
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
  console.log("selectedSpots type:", typeof selectedSpots); // Should log 'string'
  console.log("Formatted date:", formattedDate);

  try {
    const lot = await ParkingLot.findOne({ location,
       selectedSpots: {$in: selectedSpots},
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

    // 🔍 Fetch user email
    const user = await User.findById(userId);
    const email = user.email;

    // ✉️ Setup Nodemailer transporter
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
          <li><strong>Spot:</strong> ${selectedSpots}</li>
        </ul>
        <p>Thank you for using our service!</p>
      `
    };

    await transporter.sendMail(mailOptions);

    // Create new booking record
    // const newBooking = new Booking({
    //   user: userId,
    //   location,
    //   date,
    //   startTime,
    //   endTime,
    //   spot: selectedSpots
    // });

    // await newBooking.save();
 // ⏰ Schedule reminder 30 minutes before the end time
 const endDateTime = new Date(`${date}T${endTime.padStart(5, '0')}:00`);
 const reminderTime = new Date(endDateTime.getTime() - 30 * 60000); // 30 minutes before the end time

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
           <li><strong>Spot:</strong> ${selectedSpots}</li>
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

     // ⏰ Schedule an email when the parking time ends
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
            <li><strong>Spot:</strong> ${selectedSpots.join(", ")}</li>
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
// Get all booked spots for Location 2
exports.bookedLotLocation2 = async (req, res) => {
  try {
    const bookedSpots = await ParkingLot.find({ 
      location: "Location 2", 
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
// Get all booked spots for Location 2
exports.bookedLotLocation3 = async (req, res) => {
  try {
    const bookedSpots = await ParkingLot.find({ 
      location: "Location 3", 
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
exports.cancelBooking = async(req, res)=>{
   try {
    const bookingId = req.params.id;

    const updated = await ParkingLot.findByIdAndUpdate(
      bookingId,
      {
        $set: { isBooked: false },
        $unset: {
          userId: "",
          date: "",
          startTime: "",
          endTime: ""
        }
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Booking not found." });
    }

    res.status(200).json({ message: "Booking cancelled successfully.", booking: updated });
  } catch (err) {
    console.error("Cancel Error:", err);
    res.status(500).json({ message: "Error cancelling booking." });
  }
}
exports.extendBooking = async (req, res) => {
  const bookingId = req.params.id;
  const { date, endTime } = req.body;

  try {
    const booking = await ParkingLot.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Ensure new endTime is greater than existing one
    if (new Date(`1970-01-01T${endTime}:00Z`) <= new Date(`1970-01-01T${booking.endTime}:00Z`)) {
      return res.status(400).json({ message: 'New end time must be later than the current end time.' });
    }

    booking.date = date;
    booking.endTime = endTime;

    await booking.save();

    res.status(200).json({ message: 'Booking extended successfully.', updatedBooking: booking });
  } catch (error) {
    console.error('Extend error:', error);
    res.status(500).json({ message: 'Server error while extending booking.' });
  }
};
