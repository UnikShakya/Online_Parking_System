const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const middlemanModel = require("./middlemanModel"); // Import middlemanModel
const validator = require("validator");
const mongoose = require('mongoose'); // Added mongoose import

// Create token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Signup Middleman
const signupMiddleman = async (req, res) => {
    const { username, email, password, location } = req.body;

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
            location,
            role: 'middleman'
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
            middlemanId: savedMiddleman._id, // Added _id
            username: savedMiddleman.username,
            email,
            location
        });
    } catch (error) {
        console.error("Error creating middleman:", error);
        res.status(500).json({ success: false, message: "An error occurred", error: error.message });
    }
};

const getMiddlemen = async (req, res) => {
    try {
        const middlemen = await middlemanModel.find({}, "username email _id");
        res.json({ success: true, middlemen });
    } catch (error) {
        console.error("Error fetching middlemen:", error);
        res.status(500).json({ success: false, message: "Error fetching middlemen" });
    }
};

// Get middlemen by Bouddha
const getMiddlemanByBouddha = async (req, res) => {
  try {
    const middlemen = await middlemanModel.find({ location: 'Bouddha' }, 'username email _id');
    res.json({ success: true, middlemen });
  } catch (error) {
    console.error('Error fetching middlemen from Bouddha:', error);
    res.status(500).json({ success: false, message: 'Error fetching middlemen from Bouddha' });
  }
};

// Get middlemen by Patan
const getMiddlemanByPatan = async (req, res) => {
    try {
        const middlemen = await middlemanModel.find({ location: "Patan" }, "username email _id");
        res.json({ success: true, middlemen });
    } catch (error) {
        console.error("Error fetching middlemen from Patan:", error);
        res.status(500).json({ success: false, message: "Error fetching middlemen from Patan" });
    }
};

// Get middlemen by Dharahara
const getMiddlemanByDharahara = async (req, res) => {
  try {
    const middlemen = await middlemanModel.find({ location: 'Dharahara' }, 'username email _id');
    res.json({ success: true, middlemen });
  } catch (error) {
    console.error('Error fetching middlemen from Dharahara:', error);
    res.status(500).json({ success: false, message: 'Error fetching middlemen from Dharahara' });
  }
};


// // Get middleman by ID
// const getMiddlemanById = async (req, res) => {
//   try {
//     const middlemanId = req.params.id;

//     // Validate ObjectId
//     if (!mongoose.Types.ObjectId.isValid(middlemanId)) {
//       return res.status(400).json({ success: false, message: 'Invalid middleman ID' });
//     }

//     const middleman = await middlemanModel.findById(middlemanId);

//     if (!middleman) {
//       return res.status(404).json({ success: false, message: 'Middleman not found' });
//     }

//     res.status(200).json({ success: true, middleman });
//   } catch (error) {
//     console.error('Error fetching middleman:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// };

module.exports = { signupMiddleman, getMiddlemen, getMiddlemanByDharahara, getMiddlemanByBouddha, getMiddlemanByPatan };
