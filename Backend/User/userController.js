const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("./userModel");
const validator = require("validator");
const adminModel = require("../adminModel")
const middlemanModel = require("../Middleman/middlemanModel")
const nodemailer = require("nodemailer")
// Create token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '3d' });
};

const ADMIN_EMAIL = 'admin@gmail.com'; // Predefined admin email
const ADMIN_PASSWORD = 'admin123'; // Predefined admin password

const MIDDLEMAN_EMAIL = 'parkease@gmail.com'; // Predefined admin email
const MIDDLEMAN_PASSWORD = 'parkease' // Predefined admin password

//login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the credentials match the default admin
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            const token = createToken("default-admin-id");
            return res.json({
                success: true,
                token,
                username: "admin",
                redirect: `/admin/${token}`, // Redirect to admin dashboard
            });
        }

        // Check if the credentials match the default middleman
        if (email === MIDDLEMAN_EMAIL && password === MIDDLEMAN_PASSWORD) {
            const token = createToken("default-middleman-id");
            return res.json({
                success: true,
                token,
                username: "middleman",
                redirect: `/middleman/${token}`, // Redirect to middleman dashboard with token
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
            user = await middlemanModel.findOne({ email });  // Ensure we check the correct collection
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
            redirectPath = `/admin/${token}`; // Redirect admin users to /admin/:id
        } else if (user.role === 'middleman') {
            redirectPath = `/middleman/${token}`; // Redirect middleman users to /middleman/:id
        }

        // Return the response
        res.json({
            success: true,
            token,
            username: user.username,
            role: user.role,
            redirect: redirectPath, // Use the correct redirect path based on role\
            location: user.location
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

// middleman to verify admin
const verifyAdmin = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        if (!user || (user.email !== ADMIN_EMAIL && user.role !== 'admin')) {
            return res.status(403).json({ success: false, message: "Unauthorized: Admin access required" });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await userModel.find({}, "username email _id"); // Exclude _id if not needed
        res.json({ success: true, users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ success: false, message: "Error fetching users" });
    }
};

// UPDATE a user (new)
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email } = req.body;

        // Validation
        if (!username || !email) {
            return res.status(400).json({ 
                success: false, 
                message: "Username and email are required" 
            });
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            id,
            { username, email },
            { new: true, runValidators: true } // Return updated doc and run schema validators
        );

        if (!updatedUser) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        res.json({ 
            success: true, 
            message: "User updated successfully",
            user: updatedUser 
        });
    } catch (error) {
        console.error("Error updating user:", error);
        
        // Handle specific errors
        if (error.name === 'CastError') {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid user ID format" 
            });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                success: false, 
                message: error.message 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: "Error updating user" 
        });
    }
};

// DELETE a user (new)
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedUser = await userModel.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        res.json({ 
            success: true, 
            message: "User deleted successfully",
            user: deletedUser 
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid user ID format" 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: "Error deleting user" 
        });
    }
};
module.exports = { loginUser, registerUser, forgetPassword, resetPassword, getUsers, updateUser, deleteUser };

