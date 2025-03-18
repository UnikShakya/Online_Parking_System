const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("./userModel");
const validator = require("validator");
const nodemailer = require("nodemailer");
// Create token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const ADMIN_EMAIL = 'admin@gmail.com'; // Predefined admin email
const ADMIN_PASSWORD = 'admin123'; // Predefined admin password

const MIDDLEWARE_EMAIL = 'parkease@gmail.com'; // Predefined admin email
const MIDDLEWARE_PASSWORD = 'parkease' // Predefined admin password

//login User
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
        // Check if the user is a middleware user
        if (email === MIDDLEWARE_EMAIL && password === MIDDLEWARE_PASSWORD) {
            const middlewareToken = createToken(MIDDLEWARE_EMAIL);
            return res.json({
                success: true,
                token: middlewareToken,
                redirect: '/middleware',  // Redirect to /middleware if middleware user
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

        // No activity logging, just respond with the token and user details
        res.json({
            success: true,
            token,
            username: user.username,  // Return the username
            redirect: '/',  // Redirect to '/' if normal user
        });
    } catch (error) {
        console.error("Error during login:", error);  // Log the error for debugging
        
        res.status(500).json({
            success: false,
            message: "An error occurred. Please try again.",
            error: error.message,  // Return the error message to help with debugging
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
            return res.json({ success: false, message: "Please enter a strong password (minimum 8 characters)" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user object
        const newUser = new userModel({
            username,
            email,
            password: hashedPassword,
            activities: [] // Initialize activities as an empty array
        });

        // Save the new user to MongoDB
        const savedUser = await newUser.save();

        // Prepare the signup activity log
        const activity = {
            action: `${username} signed up in ParkEase`,
            timestamp: new Date()
        };

        // Add activity to the user's activities array
        savedUser.activities.push(activity);

        // Save the updated user document with activities
        const updatedUser = await savedUser.save();

        // Log success and activities
        console.log('Updated activities after save:', updatedUser.activities);

        // Send success response with username
        res.json({ success: true, message: "Account created successfully", username: updatedUser.username });
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




module.exports = { loginUser, registerUser, forgetPassword, resetPassword };
