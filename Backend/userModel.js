const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    activities: [{ action: String, timestamp: Date }]  // Add this field for storing activities
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
