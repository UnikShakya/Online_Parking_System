const express = require("express");
const { loginUser, registerUser, forgetPassword, resetPassword } = require('./userController');
const userRouter = express.Router();

userRouter.post("/register",registerUser);
userRouter.post("/login",loginUser);
userRouter.post("/forget-password",forgetPassword);
userRouter.post("/reset-password/:token",resetPassword);

module.exports = userRouter;
