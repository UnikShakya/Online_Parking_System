const express = require("express");
const { signupAdmin, getAdmins, getAdminById } = require("./adminController");
const adminRouter = express.Router();
const authentication = require("./authentication")

adminRouter.post("/signup-admin", signupAdmin);
adminRouter.get("/admins", getAdmins);
adminRouter.get("/:id", getAdminById, authentication); 

module.exports = adminRouter;