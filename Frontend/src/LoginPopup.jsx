import React, { useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import StoreContext from './Context/StoreContext';
import { IoIosClose, IoIosEye, IoIosEyeOff } from "react-icons/io";
import "./LoginPopup.css";

const LoginPopup = ({ setShowLogin }) => {
    const { setToken, url } = useContext(StoreContext);
    const [currState, setCurrState] = useState("Login");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [data, setData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    const handleInputChange = (event) => {
        setData({ ...data, [event.target.name]: event.target.value.trimStart() });
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const trimmedUsername = data.username.trim();
        const trimmedEmail = data.email.trim();
        const trimmedPassword = data.password.trim();

        // Validation
        if (currState === "Sign Up") {
            if (!trimmedUsername) {
                toast.error("Username cannot be empty or just spaces.");
                return;
            }
            if (!isNaN(trimmedUsername)) {
                toast.error("Username cannot contain only numbers.");
                return;
            }
        }

        if (!trimmedEmail || !/\S+@\S+\.\S+/.test(trimmedEmail)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        if (!trimmedPassword || trimmedPassword.length < 8) {
            toast.error("Password must be at least 8 characters long.");
            return;
        }

        const endpoint = currState === "Login" ? "/api/user/login" : "/api/user/register";

        try {
            const response = await axios.post(`${url}${endpoint}`, data);
            if (response.data?.success) {
                if (currState === "Login") {
                    const { token, username, redirect } = response.data;
                    setToken(token);
                    localStorage.setItem("token", token);
                    localStorage.setItem("username", username);
                    console.log("token:", token)

                    toast.success("Successfully logged in!");
                    setShowLogin(false);
                    navigate(redirect || '/');
                } else {
                    toast.success("Account created successfully! Please log in.");
                    setCurrState("Login");
                    setData({ username: "", email: "", password: "" });
                }
            } else {
                toast.error(response.data.message || "An unexpected error occurred.");
            }
        } catch (error) {
            console.error("Login/Signup error:", error);
            toast.error(error.response?.data?.message || "An error occurred. Please try again.");
        }
    };

    return (
        <div className="login-popup">
            <form onSubmit={handleSubmit} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <IoIosClose
                        className="cursor-pointer"
                        size={30}
                        onClick={() => setShowLogin(false)}
                        aria-label="Close login popup"
                    />
                </div>

                <div className="login-popup-inputs">
                    {currState === "Sign Up" && (
                        <input
                            name="username"
                            type="text"
                            placeholder="Your name"
                            value={data.username}
                            onChange={handleInputChange}
                            required
                        />
                    )}
                    <input
                        name="email"
                        type="email"
                        placeholder="Your email"
                        value={data.email}
                        onChange={handleInputChange}
                        required
                    />
                    <div className="relative">
                        <input
                            name="password"
                            type={isPasswordVisible ? "text" : "password"}
                            placeholder="Password"
                            value={data.password}
                            onChange={handleInputChange}
                            required
                            className="w-full border px-4 py-2 pr-10 rounded-md focus:outline-none"
                        />
                        <span
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
                            onClick={togglePasswordVisibility}
                            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                        >
                            {isPasswordVisible ? <IoIosEyeOff size={25} /> : <IoIosEye size={25} />}
                        </span>
                    </div>
                </div>

                {/* {currState === "Login" && (
                    <div>
                        <Link
                            to="/forget-password"
                            className="text-gray-800 hover:text-blue-600 transition-colors"
                        >
                            Forgot password?
                        </Link>
                    </div>
                )} */}

                {currState === "Sign Up" && (
                    <div className="login-popup-condition">
                        <input type="checkbox" required id="terms" />
                        <label htmlFor="terms" className="ml-2">
                            By continuing, I agree to the terms of use & privacy policy.
                        </label>
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-gradient-to-r from-gradientStart to-gradientEnd text-white font-semibold rounded-md shadow focus:outline-none focus:ring-2"
                >
                    {currState === "Login" ? "Login" : "Create account"}
                </button>

                <p className="text-center mt-2">
                    {currState === "Login" ? "Create a new account?" : "Already have an account?"}
                    <span
                        onClick={() => setCurrState(currState === "Login" ? "Sign Up" : "Login")}
                        className="text-blue-600 cursor-pointer hover:underline ml-1"
                    >
                        {currState === "Login" ? " SignUp here" : " Login here"}
                    </span>
                </p>
            </form>
        </div>
    );
};

export default LoginPopup;
