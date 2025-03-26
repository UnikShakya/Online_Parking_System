const express = require("express");
const { signupMiddleman } = require("./middlemanController"); // Import the signupMiddleman function
const middlemanRouter = express.Router();

// Allow anyone to create new middlemen
middlemanRouter.post("/signup-middleman", signupMiddleman);

module.exports = middlemanRouter;