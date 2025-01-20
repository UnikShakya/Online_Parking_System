const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("./userModel");
const validator = require("validator");

// Create token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const ADMIN_EMAIL = 'admin@gmail.com'; // Predefined admin email
const ADMIN_PASSWORD = 'admin123'; // Predefined admin password

// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // First, check if the user is the admin based on predefined credentials
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            // Directly create a token for admin without querying the database
            const adminToken = createToken(ADMIN_EMAIL); // You can use any identifier here

            return res.json({
                success: true,
                token: adminToken,
                redirect: '/admin',  // Redirect to /admin if admin
            });
        }

        // Proceed to find the user from the database for normal users
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = createToken(user._id);

        // Respond with the token, username, and redirection URL
        res.json({
            success: true,
            token,
            username: user.username,  // Return the username
            redirect: '/',  // Redirect to '/' if normal user
        });
    } catch (error) {
        console.error(error);
        res.json({
            success: false,
            message: "An error occurred. Please try again.",
        });
    }
};

//Registeruser
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Check if user already exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }

        // Validate email format & password strength
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new userModel({ username, email, password: hashedPassword });

        // Save the user to MongoDB
        const savedUser = await newUser.save(); // Save the user first

        // Prepare the activity log
        const activity = {
            action: `${username} signed up in ParkEase`,
            timestamp: new Date()
        };

        // Add activity after user creation
        savedUser.activities.push(activity);

        // Save the updated user document with activities
        await savedUser.save();

        // Send success response
        res.json({ success: true, message: "Account created successfully" });
    } catch (error) {
        console.error('Error occurred during registration:', error);
        res.json({ success: false, message: "An error occurred. Please try again.", error: error.message });
    }
};


module.exports = { loginUser, registerUser };
