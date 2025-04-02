const express = require("express");
const { loginUser, registerUser, forgetPassword, resetPassword, getUsers, updateUser, deleteUser } = require('./userController');
const userRouter = express.Router();

userRouter.post("/register",registerUser);
userRouter.post("/login",loginUser);
userRouter.post("/forget-password",forgetPassword);
userRouter.post("/reset-password/:token",resetPassword);
userRouter.get("/users", getUsers); // New endpoint
userRouter.put("/:id", updateUser); 
userRouter.delete("/:id", deleteUser); 
module.exports = userRouter;
