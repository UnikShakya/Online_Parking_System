// const cron = require('node-cron');
// const moment = require('moment');
// const nodemailer = require('nodemailer');
// const ParkingLot = require('./ParkingLot/parkingLotModel');
// const User = require('./User/userModel');  // Assuming you have a user model

// // Cron job to check bookings every minute
// cron.schedule('* * * * *', async () => {
//   try {
//     // Get the current time
//     const currentTime = moment();

//     // Find all parking bookings that are ending in 30 minutes or less
//     const lotsToRemind = await ParkingLot.find({
//       isBooked: true,
//       endTime: { $gt: currentTime, $lt: currentTime.add(30, 'minutes') },  // 30 mins from now
//     });

//     // Loop through each lot to send reminder
//     for (let lot of lotsToRemind) {
//       // Get the user info associated with this booking
//       const user = await User.findById(lot.userId);
//       if (!user) continue;

//       const userEmail = user.email;
//       const userName = user.name;
//       const endTimeFormatted = moment(lot.endTime).format('h:mm A');

//       // Create transporter for sending email
//       const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         secure: true,
//         auth: {
//           user: process.env.MY_EMAIL,
//           pass: process.env.MY_PASSWORD,
//         },
//       });

//       // Email content
//       const mailOptions = {
//         from: process.env.MY_EMAIL,
//         to: userEmail,
//         subject: 'Reminder: Parking Session Ending Soon',
//         html: `
//           <h2>Hello ${userName},</h2>
//           <p>Your parking session at ${lot.location} (Spot: ${lot.selectedSpots}) is ending soon!</p>
//           <p>End Time: ${endTimeFormatted}</p>
//           <p>Hurry! You have only 30 minutes left to pick up your vehicle.</p>
//         `,
//       };

//       // Send reminder email
//       await transporter.sendMail(mailOptions);

//       console.log(`Sent reminder to ${userEmail} about parking session ending soon.`);
//     }
//   } catch (error) {
//     console.error('Error sending reminder emails:', error);
//   }
// });

