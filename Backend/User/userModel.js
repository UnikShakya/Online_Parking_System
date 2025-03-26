const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" }, // Only "user" role allowed
    activities: [{
        action: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
    }],
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;