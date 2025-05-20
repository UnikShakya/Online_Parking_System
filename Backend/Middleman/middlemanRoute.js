const express = require("express");
const { signupMiddleman, getMiddlemen, getMiddlemanByBouddha, getMiddlemanByDharahara, getMiddlemanByPatan,  } = require("./middlemanController"); // Import the signupMiddleman function
const authMiddleware = require("../authentication");
const middlemanRouter = express.Router();

// Allow anyone to create new middlemen
middlemanRouter.post("/signup-middleman", authMiddleware, signupMiddleman);
middlemanRouter.get("/",authMiddleware, getMiddlemen); // New endpoint
middlemanRouter.get("/:id",authMiddleware,  getMiddlemanById); 
middlemanRouter.get("/bouddha", authMiddleware,getMiddlemanByBouddha); 
middlemanRouter.get("/patan",authMiddleware, getMiddlemanByDharahara); 
middlemanRouter.get("/dharahara", authMiddleware,getMiddlemanByPatan); 
module.exports = middlemanRouter;