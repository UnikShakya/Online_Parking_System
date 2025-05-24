const express = require("express");
const { signupMiddleman, getMiddlemen, getMiddlemanByBouddha, getMiddlemanByBhaktapur, getMiddlemanByPatan, getMiddlemanCount } = require("./middlemanController"); // Import the signupMiddleman function
const authMiddleware = require("../authentication");
const middlemanRouter = express.Router();

// Allow anyone to create new middlemen
middlemanRouter.post("/signup-middleman", authMiddleware, signupMiddleman);
middlemanRouter.get("/",authMiddleware, getMiddlemen); // New endpoint
// middlemanRouter.get("/:id",authMiddleware,  getMiddlemanById); 
// middlemanRouter.get("/:location", authMiddleware,getMiddlemanByLocation); 
middlemanRouter.get("/bouddha", authMiddleware,getMiddlemanByBouddha); 
middlemanRouter.get("/bhaktapur",authMiddleware, getMiddlemanByBhaktapur); 
middlemanRouter.get("/patan", authMiddleware,getMiddlemanByPatan); 
middlemanRouter.get("/count",getMiddlemanCount); 
module.exports = middlemanRouter;