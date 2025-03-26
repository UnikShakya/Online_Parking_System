const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("./userModel");
const validator = require("validator");
const nodemailer = require("nodemailer")
const adminModel = require("../adminModel")
const middlemanModel = require("../Middleman/middlemanModel")
// Create token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const ADMIN_EMAIL = 'admin@gmail.com'; // Predefined admin email
const ADMIN_PASSWORD = 'admin123'; // Predefined admin password

const MIDDLEWARE_EMAIL = 'parkease@gmail.com'; // Predefined admin email
const MIDDLEWARE_PASSWORD = 'parkease' // Predefined admin password

//login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the credentials match the default admin
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            // Create a token for the default admin
            const token = createToken("default-admin-id"); // Use a unique ID for the default admin
            return res.json({
                success: true,
                token,
                username: "admin",
                redirect: "/admin", // Redirect to admin dashboard
            });
        }

        // Check if the credentials match the default middleware
        if (email === MIDDLEWARE_EMAIL && password === MIDDLEWARE_PASSWORD) {
            // Create a token for the default middleware
            const token = createToken("default-middleware-id"); // Use a unique ID for the default middleware
            return res.json({
                success: true,
                token,
                username: "middleware",
                redirect: "/middleware", // Redirect to middleware dashboard
            });
        }

        // Check in userModel (regular users)
        let user = await userModel.findOne({ email });

        // If not found in userModel, check in adminModel
        if (!user) {
            user = await adminModel.findOne({ email });
        }

        // If not found in adminModel, check in middlemanModel
        if (!user) {
            user = await middlemanModel.findOne({ email });
        }

        // If user not found in any collection
        if (!user) {
            return res.status(404).json({ success: false, message: "User does not exist" });
        }

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Create a token
        const token = createToken(user._id);

        // Determine the redirect path based on the user's role
        let redirectPath = '/'; // Default redirect for regular users
        if (user.role === 'admin') {
            redirectPath = '/admin'; // Redirect admin users to /admin
        } else if (user.role === 'middleware') {
            redirectPath = '/middleware'; // Redirect middleware users to /middleware
        }

        // Return the response
        res.json({
            success: true,
            token,
            username: user.username,
            redirect: redirectPath, // Use the correct redirect path based on role
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred. Please try again.",
            error: error.message,
        });
    }
};

// Register User
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
            return res.json({ success: false, message: "Password must be at least 8 characters" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user object
        const newUser = new userModel({
            username,
            email,
            password: hashedPassword,
            role: "user", // Default role for new users
        });

        // Save the new user to MongoDB
        const savedUser = await newUser.save();

        // Log the user's activity
        const activity = {
            action: `${username} signed up in ParkEase`,
            timestamp: new Date(),
        };
        savedUser.activities.push(activity);
        await savedUser.save();

        // Send success response with username
        res.json({ success: true, message: "Account created successfully", username: savedUser.username });
    } catch (error) {
        console.error('Error occurred during registration:', error);
        res.json({ success: false, message: "An error occurred. Please try again.", error: error.message });
    }
};


const forgetPassword = async(req, res) =>{
    try {
        const {email} = req.body;
        if(!email){
            return res.status(400).send({ message: "Please enter your email" });
        }

        const checkUser = await userModel.findOne({email})
        if(!checkUser){
            return res.status(400).send({message: "User not found. Please Register"})
        }

        const token = jwt.sign({email}, process.env.JWT_SECRET)

        const transporter  = nodemailer.createTransport({
            service:"gmail",
            secure:true,
            auth:{
                user:process.env.MY_EMAIL,
                pass:process.env.MY_PASSWORD,
            }

        })

        const reciever = {
            from: "shakyaunik123@gmail.com",
            to: email,
            subject: "Password Reset request",
            text: `Click on this link to reset password: ${process.env.CLIENT_URL}/reset-password/${token}`
        }
        await transporter.sendMail(reciever);
        return res.status(200).send({message:"Password reset link successfully in your gmail"})
    } catch (error) {
        return res.status(500).send({message: "Something went wrong"})
    }
}


const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).send({ message: "Please provide a password" });
        }

        // Verify JWT Token
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        // Find user by email from decoded token
        const user = await userModel.findOne({ email: decode.email });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        // Hash the new password using bcrypt
        const newHashPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
        user.password = newHashPassword;

        // Save only the password without modifying other fields
        await user.save();

        return res.status(200).send({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Error in resetPassword:", error);
        return res.status(500).send({ message: error.message || "Something went wrong" });
    }
};

// Middleware to verify admin
// const verifyAdmin = async (req, res, next) => {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) {
//         return res.status(401).json({ success: false, message: "No token provided" });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await userModel.findById(decoded.id);
//         if (!user || (user.email !== ADMIN_EMAIL && user.role !== 'admin')) {
//             return res.status(403).json({ success: false, message: "Unauthorized: Admin access required" });
//         }
//         req.user = user;
//         next();
//     } catch (error) {
//         return res.status(401).json({ success: false, message: "Invalid token" });
//     }
// };







module.exports = { loginUser, registerUser, forgetPassword, resetPassword};
