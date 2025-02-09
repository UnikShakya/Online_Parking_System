import React, { useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import StoreContext from './Context/StoreContext';
import { IoIosClose, IoIosEye, IoIosEyeOff } from "react-icons/io";
import "./LoginPopup.css";

const LoginPopup = ({ setShowLogin }) => {

    const { setToken, url } = useContext(StoreContext);
    const [currState, setCurrState] = useState("Sign Up");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [data, setData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    const handleInputChange = (event) => {
        setData({ ...data, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = currState === "Login" ? "/api/user/login" : "/api/user/register";

        try {
            const response = await axios.post(`${url}${endpoint}`, data);
            console.log(response);
            if (response.data?.success) {
                if (currState === "Login") {
                    const { token, username, redirect } = response.data;
                    setToken(token);
                    localStorage.setItem("token", token);
                    localStorage.setItem("username", username);

                    console.log("Closing login popup");
                    setShowLogin(false); // This should close the popup

                    toast.success("Successfully logged in!");

                    navigate(redirect === '/admin' ? '/admin' : '/');
                } else {
                    toast.success("Account created successfully! Please log in.");
                    setCurrState("Login");
                }
            } else {
                toast.error(response.data.message || "An unexpected error occurred.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred. Please try again.");
        }
    };

    return (
        <div className="login-popup">
            <form onSubmit={handleSubmit} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <IoIosClose className="cursor-pointer" size={30} onClick={() => setShowLogin(false)} />
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
                        value={data.email}  // Use data.email here
                        onChange={handleInputChange}  // Update email in data state
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
                            className="w-full border px-4 py-2 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
                            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                        >
                            {isPasswordVisible ? <IoIosEyeOff size={25} /> : <IoIosEye size={25} />}
                        </span>
                    </div>
                </div>

                {currState === "Login" && (
                    <div>
                        <Link
                            to="/forget-password"
                            className="text-gray-800"
                        >
                            Forgot password?
                        </Link>
                    </div>
                )}

                <button type="submit">{currState === "Login" ? "Login" : "Create account"}</button>

                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>By continuing, I agree to the terms of use & privacy policy.</p>
                </div>

                <p>
                    {currState === "Login" ? "Create a new account?" : "Already have an account?"}
                    <span onClick={() => setCurrState(currState === "Login" ? "Sign Up" : "Login")}>
                        {currState === "Login" ? " SignUp here" : " Login here"}
                    </span>
                </p>
            </form>
        </div>
    );
};

export default LoginPopup;
