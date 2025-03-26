const express = require("express");
const { signupAdmin } = require("./adminController");
const adminRouter = express.Router();

// Only default admin can create new admins
adminRouter.post("/signup-admin", signupAdmin);

module.exports = adminRouter;