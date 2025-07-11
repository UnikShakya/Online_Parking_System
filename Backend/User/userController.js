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

const ADMIN_EMAIL = 'admin@gmail.com'; 
const ADMIN_PASSWORD = 'admin123'; 

const MIDDLEMAN_EMAIL = 'parkease@gmail.com'; 
const MIDDLEMAN_PASSWORD = 'parkease' 

//login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            const token = createToken("default-admin-id");
            return res.json({
                success: true,
                token,
                username: "admin",
                redirect: `/admin/${token}`, 
            });
        }

        if (email === MIDDLEMAN_EMAIL && password === MIDDLEMAN_PASSWORD) {
            const token = createToken("default-middleman-id");
            const location = "Patan";
            return res.json({
                success: true,
                token,
                location: "Patan",
                username: "middleman",
                redirect: `/middleman/${location}/${token}`, 
            });
        }

        let user = await userModel.findOne({ email });

        if (!user) {
            user = await adminModel.findOne({ email });
        }

        if (!user) {
            user = await middlemanModel.findOne({ email });  
        }

        if (!user) {
            return res.status(404).json({ success: false, message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = createToken(user._id);

        let redirectPath = '/'; 
        if (user.role === 'admin') {
            redirectPath = `/admin/${token}`; 
        }
        else if (user.role === 'middleman') {
            const location = user.location?.toLowerCase() || 'patan'; 
            redirectPath = `/middleman/${location}/${token}`;
        }

        // Return the response
        res.json({
            success: true,
            token,
            username: user.username,
            role: user.role,
            redirect: redirectPath, 
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

// const getByUserId = async (req, res)=>{
//      try {
//     const user = await userModel.findById(req.params.userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }


const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).send({ message: "Please enter your email" });
        }

        const checkUser = await userModel.findOne({ email })
        if (!checkUser) {
            return res.status(400).send({ message: "User not found. Please Register" })
        }

        const token = jwt.sign({ email }, process.env.JWT_SECRET)

        const transporter = nodemailer.createTransport({
            service: "gmail",
            secure: true,
            auth: {
                user: process.env.MY_EMAIL,
                pass: process.env.MY_PASSWORD,
            }

        })

        const reciever = {
            from: "shakyaunik123@gmail.com",
            to: email,
            subject: "Password Reset request",
            text: `Click on this link to reset password: ${process.env.CLIENT_URL}/reset-password/${token}`
        }
        await transporter.sendMail(reciever);
        return res.status(200).send({ message: "Password reset link successfully in your gmail" })
    } catch (error) {
        return res.status(500).send({ message: "Something went wrong" })
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

        const user = await userModel.findOne({ email: decode.email });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        // Hash the new password using bcrypt
        const newHashPassword = await bcrypt.hash(password, 10); 
        user.password = newHashPassword;

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
        const users = await userModel.find({}, "username email _id");
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
            { new: true, runValidators: true } 
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

