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

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:5174", // Your client URL
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true, // Allow credentials (cookies, etc.)
    })
);

// Connect to MongoDB
database(); // Call the database function to connect to MongoDB

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

// Create default middleware if not exists
const createDefaultMiddleware = async () => {
    try {
        const middleware = await middlemanModel.findOne({ email: "parkease@gmail.com" });

        if (!middleware) {
            const hashedPassword = await bcrypt.hash("parkease", 10);
            const newMiddleware = new middlemanModel({
                username: "middleware",
                email: "parkease@gmail.com",
                password: hashedPassword,
                role: "middleware", // Set role to "middleware"
            });

            await newMiddleware.save();
            console.log("Default middleware created in middleman collection");
        }
    } catch (error) {
        console.error("Error creating default middleware:", error);
    }
};

// Create default admin and middleware on server start
createDefaultAdmin();
createDefaultMiddleware();

// Routes
app.get("/", (req, res) => {
    res.send("API Working");
});

app.use("/api/user", userRouter); // User routes
app.use("/api/booking", bookingRoute); // Booking routes
app.use("/api/admin", adminRouter); // Admin routes
app.use("/api/middleman", middlemanRouter); // Middleman routes


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
app.get("/api/user/userActivities", async (req, res) => {
    try {
        const users = await userModel.find({});

        if (users.length === 0) {
            return res.status(404).json({ success: false, message: "No users found" });
        }

        const activities = users.map((user) => {
            const userActivities = user.activities || [];
            return {
                username: user.username,
                activity: `${user.username} signed up in ParkEase`,
                timestamp: userActivities.map((activity) => activity.timestamp),
            };
        });

        res.json({ activities });
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

// Start the server
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});