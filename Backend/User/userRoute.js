const express = require("express");
const { loginUser, registerUser, forgetPassword, resetPassword, getUsers, updateUser, deleteUser, getByUserId } = require('./userController');
const userRouter = express.Router();

userRouter.post("/register",registerUser);
userRouter.post("/login",loginUser);
userRouter.post("/forget-password",forgetPassword);
userRouter.post("/reset-password/:id/:token",resetPassword);
userRouter.get("/users", getUsers); 
// userRouter.get("/:userId", getByUserId); 
userRouter.put("/:id", updateUser); 
userRouter.delete("/:id", deleteUser); 
module.exports = userRouter;
