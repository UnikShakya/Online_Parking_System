const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const middlemanModel = require("./middlemanModel"); // Import middlemanModel
const validator = require("validator");

// Create token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Signup Middleman
const signupMiddleman = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if middleman already exists
        const exists = await middlemanModel.findOne({ email });
        if (exists) {
            return res.status(409).json({ success: false, message: "Middleman already exists" });
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

        // Create new middleman object
        const newMiddleman = new middlemanModel({
            username,
            email,
            password: hashedPassword,
            role: "middleware", // Set role to "middleware"
        });

        // Save the new middleman to MongoDB
        const savedMiddleman = await newMiddleman.save();

        // Create a token for the new middleman
        const token = createToken(savedMiddleman._id);

        // Return success response
        res.status(201).json({
            success: true,
            message: "Middleman created successfully",
            token,
            username: savedMiddleman.username,
            redirect: "/middleware", // Redirect to middleware dashboard
        });
    } catch (error) {
        console.error("Error creating middleman:", error);
        res.status(500).json({ success: false, message: "An error occurred", error: error.message });
    }
};

module.exports = { signupMiddleman };