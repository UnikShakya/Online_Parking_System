const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const adminModel = require("./adminModel"); // Use adminModel
const validator = require("validator");
const authMiddleware = require("./authentication");

// Create token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const ADMIN_EMAIL = "admin@gmail.com"; 
const ADMIN_PASSWORD = "admin123"; 

// const verifyDefaultAdmin = async (req, res, next) => {
//     const { email, password } = req.body;

//     if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
//         return res.status(403).json({ success: false, message: "Unauthorized: Default admin credentials required" });
//     }

//     next();
// };

// Signup Admin 
const signupAdmin = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const exists = await adminModel.findOne({ email });
        if (exists) {
            return res.status(409).json({ success: false, message: "Admin already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = new adminModel({
            username,
            email,
            password: hashedPassword,
        });

        const savedAdmin = await newAdmin.save();

        // Create a token for the new admin
        const token = createToken(savedAdmin._id);

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

const getAdmins = async (req, res) => {
    try {
        const admins = await adminModel.find({}, "username email _id");
        res.json({ success: true, admins });
    } catch (error) {
        console.error("Error fetching admins:", error);
        res.status(500).json({ success: false, message: "Error fetching admins" });
    }
};

const getAdminById = async (req, res) => {
    const { id } = req.params; 

    if (req.user._id !== id) {
        return res.status(403).json({ success: false, message: 'Not Authorized to access this admin' });
    }

    try {
        const admin = await adminModel.findById(id); 

        if (!admin) {
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }

        res.json({
            success: true,
            admin,
        });
    } catch (error) {
        console.error('Error fetching admin:', error);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
};





module.exports = { signupAdmin, getAdmins, getAdminById };