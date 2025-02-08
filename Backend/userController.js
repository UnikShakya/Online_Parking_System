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

        // Add a login activity
        const activity = {
            action: `${user.username} logged in to ParkEase`,
            timestamp: new Date(),
        };

        user.activities.push(activity); // Add activity to the user
        await user.save(); // Save user with updated activities

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
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new userModel({ username, email, password: hashedPassword });

        // Save the user to MongoDB
        const savedUser = await newUser.save();

        // Prepare the activity log
        const activity = {
            action: `${username} signed up in ParkEase`,
            timestamp: new Date()
        };

        // Log activities before adding
        console.log('Activities before pushing:', savedUser.activities);

        // Add activity to the user document
        savedUser.activities.push(activity);

        // Log activities after pushing
        console.log('Activities after pushing:', savedUser.activities);

        // Save the updated user document with activities
        const updatedUser = await savedUser.save();

        // Log activities after save
        console.log('Updated activities after save:', updatedUser.activities);

        // Send success response
        res.json({ success: true, message: "Account created successfully", username });
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

        console.log("Token received in backend:", token);
        console.log("Password received in backend:", password);

        if (!password) {
            return res.status(400).send({ message: "Please provide a password" });
        }

        // Verify JWT Token
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decode);

        // Find user by email from decoded token
        const user = await userModel.findOne({ email: decode.email });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        // Hash the new password using bcrypt
        const newHashPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
        user.password = newHashPassword;
        await user.save();

        return res.status(200).send({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Error in resetPassword:", error);
        return res.status(500).send({ message: error.message || "Something went wrong" });
    }
};



module.exports = { loginUser, registerUser, forgetPassword, resetPassword };
