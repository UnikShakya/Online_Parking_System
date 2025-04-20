import axios from 'axios';
import React, { useState } from 'react';
import { IoIosClose } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

function ForgetPassword({ setShowLogin }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!email) {
            setError('Email is required');
            return;
        }
    
        setLoading(true);
        setError('');
        setSuccess('');
    
        try {
            const response = await axios.post('http://localhost:4000/api/user/forget-password', { email });
    
            setSuccess(response.data.message);
            setLoading(false);
    
            const token = response.data.token; // Extract token from the response
    
            if (token) {
                setTimeout(() => navigate(`/reset-password/${token}`), 3000);
            } else {
                // setError('Token not received. Please try again.');
            }
        } catch (err) {
            setLoading(false);
            if (err.response) {
                setError(err.response.data.message || 'Something went wrong');
            } else {
                setError('Error connecting to the server');
            }
        }
    };
    

    return (
        <div className="login-popup">
            <form onSubmit={handleSubmit} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>Forget Password</h2>
                    <IoIosClose className="cursor-pointer" size={30} onClick={() => setShowLogin(false)} />
                </div>

                <div className="login-popup-inputs">
                    <input
                        name="email"
                        type="email"
                        placeholder="Your email"
                        onChange={(e) => setEmail(e.target.value)} // Set email in state
                        value={email}
                        required
                    />
                </div>


                <button type="submit" disabled={loading} className='bg-gradient-to-r from-gradientStart to-gradientEnd'>
                    {loading ? 'Sending...' : 'Send'}
                </button>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
            </form>
        </div>
    );
}

export default ForgetPassword;
