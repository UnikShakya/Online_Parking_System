const express = require("express");
const cors = require("cors");
const database = require("./database"); // Import the database function
const userRouter = require("./userRoute");  // Correct path to userRoutes file
const userModel = require("./userModel");
require('dotenv').config();

// app config
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
database(); // Call the function to connect to MongoDB

// Create default admin if not exists
const createDefaultAdmin = async () => {
    try {
        const admin = await userModel.findOne({ email: 'admin@gmail.com' });

        if (!admin) {
            const hashedPassword = await bcrypt.hash('admin123', 10); // Default password for admin
            const newAdmin = new userModel({
                username: 'admin',
                email: 'admin@gmail.com',
                password: hashedPassword
            });

            await newAdmin.save();
            console.log('Default admin created');
        }
    } catch (error) {
        console.error('Error creating default admin:', error);
    }
};

createDefaultAdmin(); // Create the admin when the server starts


app.get("/", (req, res) => {
    res.send("API Working");
});
app.use("/api/user", userRouter);  // This makes your routes accessible under /api/user

// Endpoint to get user count
app.get("/api/userCount", async (req, res) => {
    console.log("Fetching user count...");
    try {
        const userCount = await userModel.countDocuments();
        console.log("User count fetched:", userCount);
        res.json({ userCount });
    } catch (err) {
        console.error("Error fetching user count:", err);
        res.status(500).json({ message: "Error fetching user count" });
    }
});

app.get("/api/userActivities", async(req, res) =>{
        try{
            const activities = await userModel.find({}).select('activities');
            res.json({activities});
        }
        catch(err){
            console.log("Error fetching activities", err)
            res.status(500).json({message:"Error fetching activites"})
        }
})
  

app.listen(port, () => console.log(`Server started on http://localhost:${port}`));
