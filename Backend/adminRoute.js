const express = require("express");
const { signupAdmin, getAdmins } = require("./adminController");
const adminRouter = express.Router();

// Only default admin can create new admins
adminRouter.post("/signup-admin", signupAdmin);
adminRouter.get("/admins", getAdmins);

module.exports = adminRouter;