const mongoose = require("mongoose");

const middlemanSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "middleware" }, // Default role for middlemen
});

const middlemanModel = mongoose.model("Middleman", middlemanSchema);

module.exports = middlemanModel;