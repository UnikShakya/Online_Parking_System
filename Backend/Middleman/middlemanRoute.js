const express = require("express");
const { signupMiddleman, getMiddlemen } = require("./middlemanController"); // Import the signupMiddleman function
const middlemanRouter = express.Router();

// Allow anyone to create new middlemen
middlemanRouter.post("/signup-middleman", signupMiddleman);
middlemanRouter.get("/middlemen", getMiddlemen); // New endpoint

module.exports = middlemanRouter;