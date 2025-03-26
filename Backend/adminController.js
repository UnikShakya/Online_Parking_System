const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const adminModel = require("./adminModel"); // Use adminModel
const validator = require("validator");

// Create token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const ADMIN_EMAIL = "admin@gmail.com"; // Predefined admin email
const ADMIN_PASSWORD = "admin123"; // Predefined admin password

// // Middleware to verify default admin
// const verifyDefaultAdmin = async (req, res, next) => {
//     const { email, password } = req.body;

//     if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
//         return res.status(403).json({ success: false, message: "Unauthorized: Default admin credentials required" });
//     }

//     next();
// };

// Signup Admin (Only default admin can create new admins)
const signupAdmin = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if admin already exists
        const exists = await adminModel.findOne({ email });
        if (exists) {
            return res.status(409).json({ success: false, message: "Admin already exists" });
        }

        // Validate email format & password strength
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new admin object
        const newAdmin = new adminModel({
            username,
            email,
            password: hashedPassword,
        });

        // Save the new admin to MongoDB
        const savedAdmin = await newAdmin.save();

        // Create a token for the new admin
        const token = createToken(savedAdmin._id);

        // Return success response
        res.status(201).json({
            success: true,
            message: "Admin created successfully",
            token,
            username: savedAdmin.username,
        });
    } catch (error) {
        console.error("Error creating admin:", error);
        res.status(500).json({ success: false, message: "An error occurred", error: error.message });
    }
};

module.exports = { signupAdmin };