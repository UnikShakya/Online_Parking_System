import React, { useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import StoreContext from './Context/StoreContext';
import { IoIosClose } from "react-icons/io";
import "./LoginPopup.css";

const LoginPopup = ({ setShowLogin }) => {
    const { token, setToken, url } = useContext(StoreContext);
    const [currState, setCurrState] = useState("Sign Up");
    const [data, setData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const navigate = useNavigate();  // Initialize useNavigate for programmatic navigation

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    };

    const onLogin = async (e) => {
        e.preventDefault();

        let new_url = url;
        if (currState === "Login") {
            new_url += "/api/user/login";  // Login API endpoint
        } else if (currState === "Sign Up") {
            new_url += "/api/user/register";  // Register API endpoint
        }

        try {
            const response = await axios.post(new_url, data);

            if (response.data && response.data.success) {
                if (currState === "Login") {
                    const { token, username, redirect } = response.data;

                    // Store token and username in localStorage
                    setToken(token);
                    localStorage.setItem("token", token);
                    localStorage.setItem("username", username);

                    // Close the login popup
                    setShowLogin(false);
                    toast.success("Successfully logged in!");

                    // Redirect based on the response (admin or normal user)
                    navigate(redirect);  // Redirect to the path specified in the response (e.g., /admin)
                } else if (currState === "Sign Up") {
                    setCurrState("Login");  // Switch to login state after successful signup
                    toast.success("Account created successfully! Please log in.");
                }
            } else {
                toast.error(response.data.message || "An unexpected error occurred.");
            }
        } catch (error) {
            console.error("Error during API call:", error);
            if (error.response) {
                toast.error(error.response.data.message || "An error occurred. Please try again.");
            } else if (error.request) {
                toast.error("No response from the server. Please try again.");
            } else {
                toast.error("An error occurred. Please try again.");
            }
        }
    };

    // Function to handle logout
    const onLogout = () => {
        setToken(null);  // Clear the token from context
        localStorage.removeItem("token");  // Remove the token from localStorage
        setShowLogin(true);  // Show the login popup again
        toast.success("Logged out successfully!");
    };

    return (
        <div className='login-popup'>
            <form onSubmit={onLogin} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <IoIosClose className='cursor-pointer' size={30} onClick={() => setShowLogin(false)} />
                </div>
                <div className="login-popup-inputs">
                    {currState === "Sign Up" && <input name='username' onChange={onChangeHandler} value={data.username} type="text" placeholder='Your name' required />}
                    <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required />
                    <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
                </div>
                <button>{currState === "Login" ? "Login" : "Create account"}</button>
                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>By continuing, I agree to the terms of use & privacy policy.</p>
                </div>
                {currState === "Login"
                    ? <p>Create a new account? <span onClick={() => setCurrState('Sign Up')}>Click here</span></p>
                    : <p>Already have an account? <span onClick={() => setCurrState('Login')}>Login here</span></p>
                }
            </form>
        </div>
    );
};

export default LoginPopup;
