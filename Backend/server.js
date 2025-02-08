const express = require("express");
const cors = require("cors");
const database = require("./database");
const userRouter = require("./userRoute");
const userModel = require("./userModel");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5174', // your client URL
    credentials: true, // Allow credentials (cookies, etc.)
}));

database(); // Connect to the database

// Create default admin if not exists
const createDefaultAdmin = async () => {
    try {
        const admin = await userModel.findOne({ email: 'admin@gmail.com' });

        if (!admin) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            const newAdmin = new userModel({
                username: 'admin',
                email: 'admin@gmail.com',
                password: hashedPassword
            });

            await newAdmin.save();
            console.log('Default admin created');
        }
    } catch (error) {
        console.error('Error creating default admin:', error);
    }
};

createDefaultAdmin(); // Create the admin when the server starts

app.get("/", (req, res) => {
    res.send("API Working");
});

app.use("/api/user", userRouter); // User routes

// Endpoint to get user count
app.get("/api/userCount", async (req, res) => {
    try {
        const userCount = await userModel.countDocuments();
        res.json({ userCount });
    } catch (err) {
        res.status(500).json({ message: "Error fetching user count" });
    }
});


// app.post('/forget-password', (req, res) => {
//     const {email} = req.body;
//     UserModel.findOne({email: email})
//     .then(user => {
//         if(!user) {
//             return res.send({Status: "User not existed"})
//         } 
//         const token = jwt.sign({id: user._id}, "jwt_secret_key", {expiresIn: "1d"})
//         var transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//               user: 'shakyaunik123@gmail.com',
//               pass: 'qhvbsplzthzbgbke'
//             }
//           });
          
//           var mailOptions = {
//             from: 'shakyaunik123@gmail.com',
//             to: user.email,
//             subject: 'Reset Password Link',
//             text: `http://localhost:5174/reset_password/${user._id}/${token}`
//           };
          
//           transporter.sendMail(mailOptions, function(error, info){
//             if (error) {
//               console.log(error);
//             } else {
//               return res.send({Status: "Success"})
//             }
//           });
//     })
// })

// app.post('/reset-password/:id/:token', (req, res) => {
//     const {id, token} = req.params
//     const {password} = req.body

//     jwt.verify(token, "jwt_secret_key", (err, decoded) => {
//         if(err) {
//             return res.json({Status: "Error with token"})
//         } else {
//             bcrypt.hash(password, 10)
//             .then(hash => {
//                 UserModel.findByIdAndUpdate({_id: id}, {password: hash})
//                 .then(u => res.send({Status: "Success"}))
//                 .catch(err => res.send({Status: err}))
//             })
//             .catch(err => res.send({Status: err}))
//         }
//     })
// })



app.post('/api/log-ticket', (req, res) => {
    const ticketData = req.body;
    console.log('Ticket Scanned:', ticketData);
    res.status(200).send({ message: 'Ticket logged successfully' });
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
