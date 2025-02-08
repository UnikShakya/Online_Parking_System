import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { IoIosClose, IoIosEye, IoIosEyeOff } from "react-icons/io";

function ResetPassword({ setShowLogin }) {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const navigate = useNavigate();
    const { token } = useParams(); // Get token from URL params

    const handleSubmit = async (e) => {
        e.preventDefault();
            
        if (!password) {
            setError("Password is required");
            console.error("Error: Password is required");
            return;
        }
    
        setLoading(true);
        setError("");
        setSuccess("");

       
    
        try {
            console.log("Sending request to:", `http://localhost:4000/api/user/reset-password/${token}`);
    
            const response = await axios.post(
                `http://localhost:4000/api/user/reset-password/${token}`,
                { password }
            );
    
            console.log("Response received:", response.data);
    
            setSuccess(response.data.message);
            setLoading(false);
    
            setTimeout(() => {
                console.log("Redirecting to home page...");
                navigate("/");
            }, 3000);
        } catch (err) {
            setLoading(false);
            
            if (err.response) {
                console.error("Error Response:", err.response.data);
                setError(err.response.data.message || "Something went wrong");
            } else if (err.request) {
                console.error("No response received:", err.request);
                setError("No response from server");
            } else {
                console.error("Request error:", err.message);
                setError("Error connecting to the server");
            }
        }
        
    };
    
    

    return (
        <div className="login-popup">
            <form onSubmit={handleSubmit} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>Reset Password</h2>
                    <IoIosClose className="cursor-pointer" size={30} onClick={() => setShowLogin(false)} />
                </div>

                <div className="relative">
                    <input
                        name="password"
                        type={isPasswordVisible ? "text" : "password"}
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <button type="submit" disabled={loading}>
                    {loading ? "Resetting..." : "Reset Password"}
                </button>
            </form>
        </div>
    );
}

export default ResetPassword;
