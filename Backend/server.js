const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const userRouter = require("./User/userRoute");
const userModel = require("./User/userModel");
const adminModel = require("./adminModel"); // Import adminModel
const middlemanModel = require("./Middleman/middlemanModel"); // Import middlemanModel
const middlemanRouter = require("./Middleman/middlemanRoute")
const bookingRoute = require("./bookingRoute");
const bookingModel = require("./bookingModel");
const database = require("./database"); // Import the database function
const adminRouter = require("./adminRoute"); // Import adminRouter
const paymentRouter = require("./Payment/paymentRoute");
const axios = require('axios'); // Add near your other routes in server.js
const parkingRouter = require("./ParkingLot/parkingRoute");
const profileRoute = require('./Profile/profileRoute'); // adjust path



// Connect to MongoDB
database(); // Call the database function to connect to MongoDB
dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3000;

// middleman
app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:5174", // Your client URL
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true, // Allow credentials (cookies, etc.)
    })
);


// Create default admin if not exists
const createDefaultAdmin = async () => {
    try {
        const admin = await adminModel.findOne({ email: "admin@gmail.com" });

        if (!admin) {
            const hashedPassword = await bcrypt.hash("admin123", 10);
            const newAdmin = new adminModel({
                username: "admin",
                email: "admin@gmail.com",
                password: hashedPassword,
                role: "admin", // Set role to "admin"
            });

            await newAdmin.save();
            console.log("Default admin created in admin collection");
        }
    } catch (error) {
        console.error("Error creating default admin:", error);
    }
};

// Create default middleman if not exists
const createDefaultmiddleman = async () => {
    try {
        const middleman = await middlemanModel.findOne({ email: "parkease@gmail.com" });

        if (!middleman) {
            const hashedPassword = await bcrypt.hash("parkease", 10);
            const newmiddleman = new middlemanModel({
                username: "middleman",
                email: "parkease@gmail.com",
                password: hashedPassword,
                role: "middleman", // Set role to "middleman"
                location: "Bouddha"
            });

            await newmiddleman.save();
            console.log("Default middleman created in middleman collection");
        }
    } catch (error) {
        console.error("Error creating default middleman:", error);
    }
};

// Create default admin and middleman on server start
createDefaultAdmin();
createDefaultmiddleman();

// Routes
app.get("/", (req, res) => {
    res.send("API Working");
});

app.use("/api/user", userRouter); // User routes
app.use("/api/booking", bookingRoute); // Booking routes
app.use("/api/admin", adminRouter); // Admin routes
app.use("/api/middleman", middlemanRouter); // Middleman routes
app.use('/api/payments', paymentRouter); //payment routes
app.use('/api/parking', parkingRouter)
app.use('/api/profile', profileRoute)

// Load Cron Job to send reminder emails
// require("./reminderCron")

// const API_URL = 'https://pay.periwin.com/api/payment/process/initiate/';
// const API_KEY = process.env.PERIPAY_API_KEY; // store this in .env

// app.post('/initiate-payment', async (req, res) => {
//     try {
//       const response = await axios.post(API_URL, req.body, {
//         headers: {
//           Authorization: `Bearer ${API_KEY}`,
//           'Content-Type': 'application/json',
//         },
//       });
  
//       res.json(response.data); // return PeriPay response to frontend
//     } catch (err) {
//       console.error('Error initiating payment:', err.response?.data || err.message);
//       res.status(500).json({ error: 'Failed to initiate payment' });
//     }
//   });

// Endpoint to get user count
app.get("/api/userCount", async (req, res) => {
    try {
        const userCount = await userModel.countDocuments();
        res.json({ userCount });
    } catch (err) {
        res.status(500).json({ message: "Error fetching user count" });
    }
});

// Endpoint to get user activities
app.get("/api/user/activities", async (req, res) => {
  try {
    const users = await userModel.find({});

    if (!users.length) {
      return res.status(404).json({ success: false, message: "No users found" });
    }

    const activities = users.map((user) => {
      const timestamps = (user.activities || []).map((activity) => activity.timestamp);
      return {
        username: user.username,
        activity: `${user.username} signed up in ParkEase`,
        timestamp: timestamps,
      };
    });

    res.json({ success: true, activities });
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ success: false, message: "Error fetching activities", error: error.message });
  }
});


// Endpoint to log ticket scans
app.post("/api/log-ticket", (req, res) => {
    const ticketData = req.body;
    console.log("Ticket Scanned:", ticketData);
    res.status(200).send({ message: "Ticket logged successfully" });
});

// Endpoint to get booking count
app.get("/api/bookingCount", async (req, res) => {
    try {
        const bookingCount = await bookingModel.countDocuments();
        res.json({ bookingCount });
    } catch (err) {
        console.error("Error fetching booking count:", err);
        res.status(500).json({ message: "Error fetching booking count" });
    }
});



// Khalti Payment Verification
// app.post('/api/verify-khalti', async (req, res) => {
//   const { token, amount, bookingId } = req.body;

//   try {
//     // Verify with Khalti API
//     const response = await axios.post(
//       'https://khalti.com/api/v2/payment/verify/',
//       { token, amount },
//       { headers: { Authorization: `Key ${process.env.KHALTI_SECRET_KEY}` } }
//     );

//     // Update booking status
//     await bookingModel.findByIdAndUpdate(bookingId, {
//       status: 'paid',
//       paymentMethod: 'khalti',
//       paymentId: response.data.idx
//     });

//     res.json({ success: true, data: response.data });
//   } catch (error) {
//     console.error('Khalti verification failed:', error);
//     res.status(400).json({ 
//       success: false, 
//       error: error.response?.data || 'Payment verification failed' 
//     });
//   }
// });

// Start the server
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
    // console.log('PeriPay Config:', {
    //     baseUrl: process.env.PERIPAY_BASE_URL,
    //     apiKey: process.env.PERIPAY_API_KEY ? '***loaded***' : 'MISSING'
    //   });
});