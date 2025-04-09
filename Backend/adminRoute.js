const express = require("express");
const { signupAdmin, getAdmins, getAdminById } = require("./adminController");
const adminRouter = express.Router();
const authentication = require("./authentication")

// Only default admin can create new admins
adminRouter.post("/signup-admin", signupAdmin);
adminRouter.get("/admins", getAdmins);
adminRouter.get("/:id", getAdminById, authentication); // Add route for fetching admin by ID

module.exports = adminRouter;